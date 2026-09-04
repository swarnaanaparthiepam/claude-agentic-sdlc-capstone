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

// Confluence API client
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

// Find or create parent page
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

// Escape XML characters in plain text
function escapeXml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Escape content that will be placed inside a CDATA section
function escapeCdata(value) {
  return value.replace(
    /\]\]>/g,
    ']]]]><![CDATA[>'
  );
}

// Convert markdown to Confluence storage format
function markdownToConfluence(markdown) {
  let html = markdown;

  // --------------------------------------------------
  // Protect fenced code blocks first.
  // Code content must not be interpreted as XHTML.
  // --------------------------------------------------
  const codeBlocks = [];

  html = html.replace(
    /```(?:[^\n]*)\n([\s\S]*?)```/g,
    (_, code) => {
      const index = codeBlocks.length;

      codeBlocks.push(
        '<ac:structured-macro ac:name="code">' +
          '<ac:plain-text-body><![CDATA[' +
          escapeCdata(code) +
          ']]></ac:plain-text-body>' +
        '</ac:structured-macro>'
      );

      return `@@CODE_BLOCK_${index}@@`;
    }
  );

  // --------------------------------------------------
  // Escape all remaining raw XML/HTML.
  // This prevents artifact content such as:
  //
  // <xml>
  // <script>
  // <something>
  //
  // from breaking Confluence XHTML.
  // --------------------------------------------------
  html = escapeXml(html);

  // --------------------------------------------------
  // Headers
  // --------------------------------------------------
  html = html.replace(
    /^### (.*?)$/gm,
    '<h3>$1</h3>'
  );

  html = html.replace(
    /^## (.*?)$/gm,
    '<h2>$1</h2>'
  );

  html = html.replace(
    /^# (.*?)$/gm,
    '<h1>$1</h1>'
  );

  // --------------------------------------------------
  // Bold
  // --------------------------------------------------
  html = html.replace(
    /\*\*(.*?)\*\*/g,
    '<strong>$1</strong>'
  );

  // --------------------------------------------------
  // Italic
  // --------------------------------------------------
  html = html.replace(
    /(?<!\*)\*([^*\n]+)\*(?!\*)/g,
    '<em>$1</em>'
  );

  // --------------------------------------------------
  // Markdown links
  // --------------------------------------------------
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2">$1</a>'
  );

  // --------------------------------------------------
  // Unordered lists
  // --------------------------------------------------
  html = html.replace(
    /^- (.*?)$/gm,
    '<li>$1</li>'
  );

  html = html.replace(
    /((?:<li>.*?<\/li>\s*)+)/gs,
    '<ul>$1</ul>'
  );

  // --------------------------------------------------
  // Restore code blocks
  // --------------------------------------------------
  html = html.replace(
    /@@CODE_BLOCK_(\d+)@@/g,
    (_, index) => codeBlocks[Number(index)]
  );

  // --------------------------------------------------
  // Paragraphs
  // --------------------------------------------------
  html = html
    .split(/\n\n+/)
    .map((paragraph) => {
      const trimmed = paragraph.trim();

      if (!trimmed) {
        return '';
      }

      // Do not wrap block-level elements in <p>.
      if (
        trimmed.startsWith('<h1>') ||
        trimmed.startsWith('<h2>') ||
        trimmed.startsWith('<h3>') ||
        trimmed.startsWith('<ul>') ||
        trimmed.startsWith('<ac:structured-macro')
      ) {
        return trimmed;
      }

      return `<p>${trimmed}</p>`;
    })
    .filter(Boolean)
    .join('\n');

  return html;
}

// Build Confluence page content
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
    if (artifacts[key]) {
      content += `<h2>${escapeXml(title)}</h2>`;

      content +=
        '<ac:structured-macro ac:name="expand">' +
        '<ac:rich-text-body>';

      content += markdownToConfluence(
        artifacts[key]
      );

      content +=
        '</ac:rich-text-body>' +
        '</ac:structured-macro>';
    }
  }

  content +=
    `<p><em>Published: ${new Date().toISOString()}</em></p>`;

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
    // --------------------------------------------------
    // 1. Read artifacts
    // --------------------------------------------------
    console.log('Reading artifacts...');

    const artifacts = await readArtifacts();

    const artifactCount =
      Object.keys(artifacts).length;

    console.log(
      `Found ${artifactCount} artifacts\n`
    );

    if (artifactCount === 0) {
      console.error(
        'ERROR: No artifacts found to publish.'
      );
      process.exit(1);
    }

    // --------------------------------------------------
    // 2. Ensure parent page exists
    // --------------------------------------------------
    console.log(
      'Ensuring parent page exists...'
    );

    const spaceKey =
      process.env.CONFLUENCE_SPACE_KEY || 'DEV';

    const parentTitle =
      'Agentic SDLC Capstone';

    const parentId =
      await ensureParentPage(
        spaceKey,
        parentTitle
      );

    console.log(
      `Parent page ID: ${parentId}\n`
    );

    // --------------------------------------------------
    // 3. Check whether User Story page exists
    // --------------------------------------------------
    console.log(
      'Checking for existing page...'
    );

    const pageTitle =
      `${USER_STORY_ID}: SDLC Documentation`;

    const existingResult =
      await confluenceRequest(
        `/content?spaceKey=${encodeURIComponent(
          spaceKey
        )}&title=${encodeURIComponent(
          pageTitle
        )}&limit=1&expand=version,_links`
      );

    const content =
      buildPageContent(
        artifacts,
        USER_STORY_ID
      );

    let pageId;
    let pageUrl;

    // --------------------------------------------------
    // 4. Update existing page
    // --------------------------------------------------
    if (
      existingResult.results &&
      existingResult.results.length > 0
    ) {
      const existing =
        existingResult.results[0];

      pageId = existing.id;

      console.log(
        `Updating existing page (ID: ${pageId})...\n`
      );

      // The API query explicitly requests version.
      // Still use a safe fallback in case it is unavailable.
      const currentVersion =
        existing.version?.number || 1;

      const updated =
        await confluenceRequest(
          `/content/${pageId}`,
          {
            method: 'PUT',
            body: JSON.stringify({
              version: {
                number: currentVersion + 1
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
    } else {
      // --------------------------------------------------
      // 5. Create new page
      // --------------------------------------------------
      console.log(
        'Creating new page...\n'
      );

      const created =
        await confluenceRequest(
          '/content',
          {
            method: 'POST',
            body: JSON.stringify({
              type: 'page',
              title: pageTitle,
              space: {
                key: spaceKey
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

    // --------------------------------------------------
    // 6. Write publication status
    // --------------------------------------------------
    const statusPath =
      path.join(
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

    // --------------------------------------------------
    // 7. Success
    // --------------------------------------------------
    console.log('===========================================');
    console.log('SUCCESS');
    console.log('===========================================');
    console.log(`Page URL: ${pageUrl}`);
    console.log(`Page ID: ${pageId}`);
    console.log(`Status file: ${statusPath}`);
    console.log('===========================================\n');

  } catch (error) {
    console.error(
      'ERROR:',
      error.message
    );

    process.exit(1);
  }
}

// Run
publish();
