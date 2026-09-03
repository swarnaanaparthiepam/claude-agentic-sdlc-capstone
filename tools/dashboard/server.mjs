import express from 'express';
import chokidar from 'chokidar';
import { readFile, stat } from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';
import { existsSync } from 'fs';

const HOST = '127.0.0.1';
const PORT = Number(process.env.DASHBOARD_PORT ?? 3000);

// Get User Story ID from command line
const USER_STORY_ID = process.argv[2];

if (!USER_STORY_ID) {
  console.error('ERROR: User Story ID required.');
  console.error('Usage: node server.mjs <USER_STORY_ID>');
  console.error('Example: node server.mjs SCRUM-123');
  process.exit(1);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..', '..');
const artifactDir = path.join(repoRoot, 'docs', 'artifacts', USER_STORY_ID);
const statusFile = path.join(artifactDir, 'status.md');
const indexFile = path.join(__dirname, 'index.html');

const app = express();
const clients = [];

// Phase definitions
const PHASES = [
  { number: '00', name: 'Input', artifact: 'user-story.md' },
  { number: '01', name: 'Requirements', artifact: 'requirements.md' },
  { number: '02', name: 'Architecture', artifact: 'architecture.md' },
  { number: '03', name: 'Design Review', artifact: 'design-review.md' },
  { number: '04', name: 'Planning', artifact: 'impl-plan.md' },
  { number: '05', name: 'Implementation', artifact: null },
  { number: '06', name: 'Review', artifact: 'review.md' },
  { number: '07', name: 'Verification', artifact: 'verification.md' },
  { number: '08', name: 'PR', artifact: null }
];

// Parse status.md
function parseStatus(markdown) {
  const completed = new Set();

  for (const line of markdown.split('\n')) {
    const match = line.match(/^-\s*\[([ xX])\]\s*(\d{2}):/);
    if (match && match[1].toLowerCase() === 'x') {
      completed.add(match[2]);
    }
  }

  const extractField = (label) => {
    const match = markdown.match(new RegExp(`^\\*\\*${label}:\\*\\*\\s*(.*)$`, 'm'));
    return match ? match[1].trim() : null;
  };

  const currentPhase = extractField('Current Phase') ?? 'Unknown';
  const currentNumber = currentPhase.match(/\\d{2}/)?.[0] ?? null;
  const notes = markdown.split(/^\\*\\*Notes:\\*\\*\\s*$/m)[1]?.trim() ?? '';

  const phases = PHASES.map(({ number, name, artifact }) => {
    let state = 'pending';
    if (completed.has(number)) state = 'complete';
    else if (number === currentNumber) state = 'active';
    return { number, name, artifact, state };
  });

  return {
    userStoryId: USER_STORY_ID,
    title: extractField('Title'),
    currentPhase,
    pendingApproval: extractField('Pending Human Approval'),
    blockedPhase: extractField('Blocked Phase'),
    status: extractField('Status'),
    lastUpdated: extractField('Last Updated'),
    prInfo: extractField('PR Information'),
    confluenceStatus: extractField('Confluence Status'),
    completedCount: completed.size,
    totalCount: PHASES.length,
    phases,
    notes
  };
}

// Read status.md
async function readStatus() {
  if (!existsSync(statusFile)) {
    throw new Error(`status.md not found for ${USER_STORY_ID}. Workflow has not started yet.`);
  }

  const [markdown, info] = await Promise.all([
    readFile(statusFile, 'utf8'),
    stat(statusFile)
  ]);

  return {
    ...parseStatus(markdown),
    fileModified: info.mtime.toISOString()
  };
}

// SSE endpoint
app.get('/api/status', async (req, res) => {
  try {
    const data = await readStatus();
    res.json(data);
  } catch (error) {
    const missing = error.message.includes('not found');
    res.status(missing ? 404 : 500).json({
      error: error.message || 'Failed to read status.md.'
    });
  }
});

// SSE stream for live updates
app.get('/api/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  clients.push(res);

  req.on('close', () => {
    const index = clients.indexOf(res);
    if (index !== -1) clients.splice(index, 1);
  });
});

// Serve dashboard HTML
app.get('/', async (req, res) => {
  try {
    const html = await readFile(indexFile, 'utf8');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch {
    res.status(500).send('Dashboard template missing.');
  }
});

// Watch status.md for changes
if (existsSync(statusFile)) {
  const watcher = chokidar.watch(statusFile, { persistent: true });

  watcher.on('change', async () => {
    try {
      const data = await readStatus();
      const message = `data: ${JSON.stringify(data)}\\n\\n`;
      clients.forEach(client => client.write(message));
      console.log(`[${new Date().toISOString()}] Status updated, notified ${clients.length} clients`);
    } catch (error) {
      console.error('Error reading status after change:', error.message);
    }
  });

  console.log(`Watching: ${path.relative(repoRoot, statusFile)}`);
} else {
  console.warn(`WARNING: ${statusFile} does not exist yet.`);
  console.warn('Dashboard will show error until workflow creates status.md');
}

// Start server
app.listen(PORT, HOST, () => {
  console.log(`\\n===========================================`);
  console.log(`SDLC Dashboard for ${USER_STORY_ID}`);
  console.log(`===========================================`);
  console.log(`URL: http://${HOST}:${PORT}`);
  console.log(`Status file: ${statusFile}`);
  console.log(`Status: ${existsSync(statusFile) ? 'Found' : 'Not found yet'}`);
  console.log(`===========================================\\n`);
});
