#!/usr/bin/env node

import { readFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

// ============================================================
// Configuration
// ============================================================

const CONFLUENCE_URL = process.env.CONFLUENCE_URL;
const CONFLUENCE_EMAIL = process.env.CONFLUENCE_EMAIL;
const CONFLUENCE_API_TOKEN = process.env.CONFLUENCE_API_TOKEN;
const CONFLUENCE_SPACE_KEY = process.env.CONFLUENCE_SPACE_KEY || 'DEV';
const USER_STORY_ID = process.env.USER_STORY_ID;

// ============================================================
// Validation
// ============================================================

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

const artifactDir = path.join(
  process.cwd(),
  'docs',
  'artifacts',
  USER_STORY_ID
);

if (!existsSync(artifactDir)) {
  console.error(`ERROR: Artifact directory not found: ${artifactDir}`);
  process.exit(1);
}

// ============================================================
// Confluence API Client
// ============================================================

const authHeader =
  'Basic ' +
  Buffer.from(
    `${CONFLUENCE_EMAIL}:${CONFLUENCE_API_TOKEN}`
  ).toString('base64');

async function confluenceRequest(endpoint, options = {}) {
  const url = `${CONFLUENCE_URL}/wiki/rest/api${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: authHeader,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...options.headers
    }
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(
      `Confluence API error (${response.status}): ${error}`
    );
  }

  return response.json();
}

// ============================================================
// XML/XHTML escaping
// ============================================================

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// ============================================================
// Markdown → Confluence Storage Format
// ============================================================

function markdownToConfluence(markdown) {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');

  const output = [];
  let inCodeBlock = false;
  let codeLanguage = '';
  let codeLines = [];

  function flushCodeBlock() {
    if (!inCodeBlock) return;

    const code = codeLines.join('\n');

    const languageParameter = codeLanguage
      ? `<ac:parameter ac:name="language">${escapeXml(
          codeLanguage
        )}</ac:parameter>`
      : '';

    output.push(
      `<ac:structured-macro ac:name="code">` +
        languageParameter +
        `<ac:plain-text-body><![CDATA[${code.replace(
          /\]\]>/g,
          ']]]]><![CDATA[>'
        )}]]></ac:plain-text-body>` +
        `</ac:structured-macro>`
    );

    codeLines = [];
    codeLanguage = '';
    inCodeBlock = false;
  }

  function inlineMarkdown(text) {
    let result = escapeXml(text);

    // Markdown links
    result = result.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2">$1</a>'
    );

    // Bold
    result = result.replace(
      /\*\*(.+?)\*\*/g,
      '<strong>$1</strong>'
    );

    // Italic
    result = result.replace(
      /(?<!\*)\*([^*]+)\*(?!\*)/g,
      '<em>$1</em>'
    );

    // Inline code
    result = result.replace(
      /`([^`]+)`/g,
      '<code>$1</code>'
    );

    return result;
  }

  let paragraphLines = [];
  let listItems = [];
  let listType = null;

  function flushParagraph() {
    if (paragraphLines.length === 0) return;

    const text = paragraphLines
      .map(line => inlineMarkdown(line))
      .join('<br />');

    output.push(`<p>${text}</p>`);
    paragraphLines = [];
  }

  function flushList() {
    if (listItems.length === 0) return;

    const tag = listType === 'ordered' ? 'ol' : 'ul';

    output.push(
      `<${tag}>${listItems.join('')}</${tag}>`
    );

    listItems = [];
    listType = null;
  }

  for (const line of lines) {
    // --------------------------------------------------------
    // Code blocks
    // --------------------------------------------------------

    if (line.startsWith('```')) {
      if (inCodeBlock) {
        flushCodeBlock();
      } else {
        flushParagraph();
        flushList();

        inCodeBlock = true;
        codeLanguage = line.slice(3).trim();
      }

      continue;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      continue;
    }

    // --------------------------------------------------------
    // Blank line
    // --------------------------------------------------------

    if (line.trim() === '') {
      flushParagraph();
      flushList();
      continue;
    }

    // --------------------------------------------------------
    // Headings
    // --------------------------------------------------------

    const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);

    if (headingMatch) {
      flushParagraph();
      flushList();

      const level = Math.min(headingMatch[1].length, 6);
      const text = inlineMarkdown(headingMatch[2]);

      output.push(`<h${level}>${text}</h${level}>`);
      continue;
    }

    // --------------------------------------------------------
    // Unordered list
    // --------------------------------------------------------

    const unorderedMatch = line.match(/^[-*]\s+(.*)$/);

    if (unorderedMatch) {
      flushParagraph();

      if (listType && listType !== 'unordered') {
        flushList();
      }

      listType = 'unordered';

      listItems.push(
        `<li>${inlineMarkdown(unorderedMatch[1])}</li>`
      );

      continue;
    }

    // --------------------------------------------------------
    // Ordered list
    // --------------------------------------------------------

    const orderedMatch = line.match(/^\d+\.\s+(.*)$/);

    if (orderedMatch) {
      flushParagraph();

      if (listType && listType !== 'ordered') {
        flushList();
      }

      listType = 'ordered';

      listItems.push(
        `<li>${inlineMarkdown(orderedMatch[1])}</li>`
      );

      continue;
    }

    // --------------------------------------------------------
    // Normal paragraph
    // --------------------------------------------------------

    flushList();
    paragraphLines.push(line);
  }

  flushCodeBlock();
  flushParagraph();
  flushList();

  return output.join('\n');
}

// ============================================================
// Parent Page
// ============================================================

async function ensureParentPage(spaceKey, parentTitle) {
  try {
    const result = await confluenceRequest(
      `/content?spaceKey=${encodeURIComponent(
        spaceKey
      )}&title=${encodeURIComponent(parentTitle)}&limit=1`
    );

    if (result.results && result.results.length > 0) {
      return result.results[0].id;
    }

    console.log(`Parent page not found. Creating: ${parentTitle}`);

    const page = await confluenceRequest('/content', {
      method: 'POST',
      body: JSON.stringify({
        type: 'page',
        title: parentTitle,
        space: {
          key: spaceKey
        },
        body: {
          storage: {
            value:
              '<p>This page contains documentation for Agentic SDLC workflows.</p>',
            representation: 'storage'
          }
        }
      })
    });

    console.log(`Created parent page: ${parentTitle}`);

    return page.id;
  } catch (error) {
    console.error(
      'Error ensuring parent page:',
      error.message
    );

    throw error;
  }
}

// ============================================================
// Read Artifacts
// ============================================================

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

// ============================================================
// Build Page Content
// ============================================================

function buildPageContent(artifacts, userStoryId) {
  let content =
    `<h1>SDLC Documentation: ${escapeXml(userStoryId)}</h1>`;

  const sections = [
    {
      key: 'user-story.md',
      title: 'User Story'
    },
    {
      key: 'requirements.md',
      title: 'Requirements'
    },
    {
      key: 'architecture.md',
      title: 'Architecture'
    },
    {
      key: 'design-review.md',
      title: 'Design Review'
    },
    {
      key: 'impl-plan.md',
      title: 'Implementation Plan'
    },
    {
      key: 'review.md',
      title: 'Code Review'
    },
    {
      key: 'verification.md',
      title: 'Verification'
    }
  ];

  for (const { key, title } of sections) {
    if (!artifacts[key]) {
      continue;
    }

    content += `<h2>${escapeXml(title)}</h2>`;

    content +=
      `<ac:structured-macro ac:name="expand">` +
      `<ac:rich-text-body>`;

    content += markdownToConfluence(artifacts[key]);

    content +=
      `</ac:rich-text-body>` +
      `</ac:structured-macro>`;
  }

  content +=
    `<p><em>Published: ${escapeXml(
      new Date().toISOString()
    )}</em></p>`;

  return content;
}

// ============================================================
// Main Publish Function
// ============================================================

async function publish() {
  console.log('===========================================');
  console.log('Confluence Publisher');
  console.log('===========================================');
  console.log(`User Story: ${USER_STORY_ID}`);
  console.log(`Artifact Directory: ${artifactDir}`);
  console.log(`Confluence Space: ${CONFLUENCE_SPACE_KEY}`);
  console.log('===========================================\n');

  try {
    // --------------------------------------------------------
    // Read artifacts
    // --------------------------------------------------------

    console.log('Reading artifacts...');

    const artifacts = await readArtifacts();
    const artifactCount = Object.keys(artifacts).length;

    console.log(`Found ${artifactCount} artifacts\n`);

    if (artifactCount === 0) {
      console.error(
        'ERROR: No artifacts found to publish.'
      );
      process.exit(1);
    }

    // --------------------------------------------------------
    // Ensure parent page
    // --------------------------------------------------------

    console.log('Ensuring parent page exists...');

    const parentTitle = 'Agentic SDLC Capstone';

    const parentId = await ensureParentPage(
      CONFLUENCE_SPACE_KEY,
      parentTitle
    );

    console.log(`Parent page ID: ${parentId}\n`);

    // --------------------------------------------------------
    // Check existing CJS page
    // --------------------------------------------------------

    console.log('Checking for existing page...');

    const pageTitle =
      `${USER_STORY_ID}: SDLC Documentation`;

    const existingResult = await confluenceRequest(
      `/content?spaceKey=${encodeURIComponent(
        CONFLUENCE_SPACE_KEY
      )}&title=${encodeURIComponent(
        pageTitle
      )}&limit=1`
    );

    // --------------------------------------------------------
    // Build content
    // --------------------------------------------------------

    const content = buildPageContent(
      artifacts,
      USER_STORY_ID
    );

    let pageId;
    let pageUrl;

    // --------------------------------------------------------
    // Update existing page
    // --------------------------------------------------------

    if (
      existingResult.results &&
      existingResult.results.length > 0
    ) {
      const existing = existingResult.results[0];

      pageId = existing.id;

      console.log(
        `Updating existing page (ID: ${pageId})...\n`
      );

      const updated = await confluenceRequest(
        `/content/${pageId}`,
        {
          method: 'PUT',
          body: JSON.stringify({
            version: {
              number: existing.version.number + 1
            },
            title: pageTitle,
            type: 'page',
            body: {
              storage: {
                value: content,
                representation: 'storage'
              }
            }
          })
        }
      );

      pageUrl =
        `${CONFLUENCE_URL}/wiki${updated._links.webui}`;
    }

    // --------------------------------------------------------
    // Create new page
    // --------------------------------------------------------

    else {
      console.log('Creating new page...\n');

      const created = await confluenceRequest(
        '/content',
        {
          method: 'POST',
          body: JSON.stringify({
            type: 'page',
            title: pageTitle,
            space: {
              key: CONFLUENCE_SPACE_KEY
            },
            ancestors: [
              {
                id: parentId
              }
            ],
            body: {
              storage: {
                value: content,
                representation: 'storage'
              }
            }
          })
        }
      );

      pageId = created.id;

      pageUrl =
        `${CONFLUENCE_URL}/wiki${created._links.webui}`;
    }

    // --------------------------------------------------------
    // Write publication status
    // --------------------------------------------------------

    const statusPath = path.join(
      artifactDir,
      'confluence-status.json'
    );

    const status = {
      published: true,
      url: pageUrl,
      pageId,
      timestamp: new Date().toISOString(),
      userStoryId: USER_STORY_ID
    };

    await writeFile(
      statusPath,
      JSON.stringify(status, null, 2)
    );

    // --------------------------------------------------------
    // Success
    // --------------------------------------------------------

    console.log(
      '==========================================='
    );
    console.log('SUCCESS');
    console.log(
      '==========================================='
    );
    console.log(`Page URL: ${pageUrl}`);
    console.log(`Status file: ${statusPath}`);
    console.log(
      '===========================================\n'
    );
  } catch (error) {
    console.error('ERROR:', error.message);
    process.exit(1);
  }
}

// ============================================================
// Run
// ============================================================

publish();