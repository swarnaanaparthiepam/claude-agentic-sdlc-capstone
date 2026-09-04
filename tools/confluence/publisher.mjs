#!/usr/bin/env node
import { readFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

// Configuration from environment variables
const CONFLUENCE_URL = process.env.CONFLUENCE_URL;
const CONFLUENCE_EMAIL = process.env.CONFLUENCE_EMAIL;
const CONFLUENCE_API_TOKEN = process.env.CONFLUENCE_API_TOKEN;
const USER_STORY_ID = process.env.USER_STORY_ID;

// Validation
if (!CONFLUENCE_URL || !CONFLUENCE_EMAIL || !CONFLUENCE_API_TOKEN) {
  console.error('ERROR: Missing Confluence credentials.');
  console.error('Required environment variables:');
  console.error('  - CONFLUENCE_URL');
  console.error('  - CONFLUENCE_EMAIL');
  console.error('  - CONFLUENCE_API_TOKEN');
  process.exit(1);
}

if (!USER_STORY_ID) {
  console.error('ERROR: USER_STORY_ID environment variable required.');
  process.exit(1);
}

const artifactDir = path.join(process.cwd(), 'docs', 'artifacts', USER_STORY_ID);

if (!existsSync(artifactDir)) {
  console.error(`ERROR: Artifact directory not found: ${artifactDir}`);
  process.exit(1);
}

// Confluence API client
const authHeader = 'Basic ' + Buffer.from(`${CONFLUENCE_EMAIL}:${CONFLUENCE_API_TOKEN}`).toString('base64');

async function confluenceRequest(endpoint, options = {}) {
  const url = `${CONFLUENCE_URL}/wiki/rest/api${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': authHeader,
      'Content-Type': 'application/json',
      ...options.headers
    }
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Confluence API error (${response.status}): ${error}`);
  }

  return response.json();
}

// Find or create parent page
async function ensureParentPage(spaceKey, parentTitle) {
  try {
    const result = await confluenceRequest(`/content?spaceKey=${spaceKey}&title=${encodeURIComponent(parentTitle)}&limit=1`);

    if (result.results && result.results.length > 0) {
      return result.results[0].id;
    }

    // Create parent page
    const page = await confluenceRequest('/content', {
      method: 'POST',
      body: JSON.stringify({
        type: 'page',
        title: parentTitle,
        space: { key: spaceKey },
        body: {
          storage: {
            value: '<p>This page contains documentation for Agentic SDLC workflows.</p>',
            representation: 'storage'
          }
        }
      })
    });

    console.log(`Created parent page: ${parentTitle}`);
    return page.id;
  } catch (error) {
    console.error('Error ensuring parent page:', error.message);
    throw error;
  }
}

// Read artifact files
async function readArtifacts() {
  const artifacts = {};
  const files = [
    'user-story.md',
    'requirements.md',
    'architecture.md',
    'design-review.md',
    'impl-plan.md',
    'review.md',
    'verification.md'
  ];

  for (const file of files) {
    const filepath = path.join(artifactDir, file);
    if (existsSync(filepath)) {
      artifacts[file] = await readFile(filepath, 'utf8');
    }
  }

  return artifacts;
}

// Convert markdown to Confluence storage format (simplified)
function markdownToConfluence(markdown) {
  let html = markdown;

  // Headers
  html = html.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.*?)$/gm, '<h1>$1</h1>');

  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // Lists
  html = html.replace(/^- (.*?)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

  // Code blocks
  html = html.replace(/```(.*?)```/gs, '<ac:structured-macro ac:name="code"><ac:plain-text-body><![CDATA[$1]]></ac:plain-text-body></ac:structured-macro>');

  // Links
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');

  // Paragraphs
  html = html.split('\n\n').map(p => `<p>${p.trim()}</p>`).join('\n');

  return html;
}

// Build Confluence page content
function buildPageContent(artifacts, userStoryId) {
  let content = `<h1>SDLC Documentation: ${userStoryId}</h1>`;

  const sections = [
    { key: 'user-story.md', title: 'User Story' },
    { key: 'requirements.md', title: 'Requirements' },
    { key: 'architecture.md', title: 'Architecture' },
    { key: 'design-review.md', title: 'Design Review' },
    { key: 'impl-plan.md', title: 'Implementation Plan' },
    { key: 'review.md', title: 'Code Review' },
    { key: 'verification.md', title: 'Verification' }
  ];

  for (const { key, title } of sections) {
    if (artifacts[key]) {
      content += `<h2>${title}</h2>`;
      content += `<ac:structured-macro ac:name="expand"><ac:rich-text-body>`;
      content += markdownToConfluence(artifacts[key]);
      content += `</ac:rich-text-body></ac:structured-macro>`;
    }
  }

  content += `<p><em>Published: ${new Date().toISOString()}</em></p>`;

  return content;
}

// Main publish function
async function publish() {
  console.log('===========================================');
  console.log('Confluence Publisher');
  console.log('===========================================');
  console.log(`User Story: ${USER_STORY_ID}`);
  console.log(`Artifact Directory: ${artifactDir}`);
  console.log('===========================================\n');

  try {
    // Read artifacts
    console.log('Reading artifacts...');
    const artifacts = await readArtifacts();
    const artifactCount = Object.keys(artifacts).length;
    console.log(`Found ${artifactCount} artifacts\n`);

    if (artifactCount === 0) {
      console.error('ERROR: No artifacts found to publish.');
      process.exit(1);
    }

    // Ensure parent page exists (using default space 'DEV' - customize as needed)
    console.log('Ensuring parent page exists...');
    const spaceKey = process.env.CONFLUENCE_SPACE_KEY || 'DEV';
    const parentTitle = 'Agentic SDLC Capstone';
    const parentId = await ensureParentPage(spaceKey, parentTitle);
    console.log(`Parent page ID: ${parentId}\n`);

    // Check if page for this User Story already exists
    console.log('Checking for existing page...');
    const pageTitle = `${USER_STORY_ID}: SDLC Documentation`;
    const existingResult = await confluenceRequest(`/content?spaceKey=${spaceKey}&title=${encodeURIComponent(pageTitle)}&limit=1`);

    const content = buildPageContent(artifacts, USER_STORY_ID);

    let pageId, pageUrl;

    if (existingResult.results && existingResult.results.length > 0) {
      // Update existing page
      const existing = existingResult.results[0];
      pageId = existing.id;
      console.log(`Updating existing page (ID: ${pageId})...\n`);

      const updated = await confluenceRequest(`/content/${pageId}`, {
        method: 'PUT',
        body: JSON.stringify({
          version: { number: (existing.version?.number || 1) + 1 },
          title: pageTitle,
          type: 'page',
          body: {
            storage: {
              value: content,
              representation: 'storage'
            }
          }
        })
      });

      pageUrl = `${CONFLUENCE_URL}/wiki${updated._links.webui}`;
    } else {
      // Create new page
      console.log('Creating new page...\n');

      const created = await confluenceRequest('/content', {
        method: 'POST',
        body: JSON.stringify({
          type: 'page',
          title: pageTitle,
          space: { key: spaceKey },
          ancestors: [{ id: parentId }],
          body: {
            storage: {
              value: content,
              representation: 'storage'
            }
          }
        })
      });

      pageId = created.id;
      pageUrl = `${CONFLUENCE_URL}/wiki${created._links.webui}`;
    }

    // Write confluence-status.json
    const statusPath = path.join(artifactDir, 'confluence-status.json');
    const status = {
      published: true,
      url: pageUrl,
      pageId,
      timestamp: new Date().toISOString(),
      userStoryId: USER_STORY_ID
    };

    await writeFile(statusPath, JSON.stringify(status, null, 2));

    console.log('===========================================');
    console.log('SUCCESS');
    console.log('===========================================');
    console.log(`Page URL: ${pageUrl}`);
    console.log(`Status file: ${statusPath}`);
    console.log('===========================================\n');

  } catch (error) {
    console.error('ERROR:', error.message);
    process.exit(1);
  }
}

// Run
publish();
