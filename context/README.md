# Workflow Context Directory

This directory stores **runtime context** for SDLC workflow execution.

## Purpose

Unlike `docs/artifacts/<USER_STORY_ID>/status.md` (which is the source of truth for workflow state), this directory holds:
- Ephemeral execution metadata
- Environment information
- Integration status
- Performance metrics
- Session context

## Files

### workflow-context.json
**Runtime execution context**
- Current workflow session info
- Environment details (Node version, platform, etc.)
- Integration connectivity status (Jira, GitHub)
- Workflow metrics (count, average time, etc.)

**Schema:**
```json
{
  "currentWorkflow": {
    "userStoryId": "string",
    "startedAt": "ISO timestamp",
    "sessionId": "string",
    "mode": "workflow|standalone"
  },
  "environment": { ... },
  "integrations": { ... },
  "metrics": { ... }
}
```

## State vs Context

### status.md (Source of Truth)
- Located: `docs/artifacts/<USER_STORY_ID>/status.md`
- Contains: Phase state, approvals, blockers
- Managed by: `workflow.md` ONLY
- Persists: Forever (git-tracked)
- Used for: Workflow state machine

### workflow-context.json (Runtime Context)
- Located: `context/workflow-context.json`
- Contains: Execution metadata, environment, metrics
- Managed by: Any component
- Persists: Session-only (not critical)
- Used for: Monitoring, debugging, analytics

## Usage

### Reading Context
```javascript
const context = JSON.parse(
  fs.readFileSync('context/workflow-context.json', 'utf8')
);

console.log('Current workflow:', context.currentWorkflow?.userStoryId);
console.log('Platform:', context.environment.platform);
```

### Writing Context
```javascript
const context = JSON.parse(
  fs.readFileSync('context/workflow-context.json', 'utf8')
);

context.currentWorkflow = {
  userStoryId: 'CJS-2',
  startedAt: new Date().toISOString(),
  sessionId: 'abc123',
  mode: 'workflow'
};

fs.writeFileSync(
  'context/workflow-context.json',
  JSON.stringify(context, null, 2)
);
```

### Dashboard Integration
The monitoring dashboard can read this file to show:
- Active workflow
- Environment info
- Integration health
- Performance stats

## Not for State Management

❌ **Do NOT use this for:**
- Workflow phase tracking (use `status.md`)
- Approval state (use `status.md`)
- Artifact references (use filesystem)
- Critical state (use `status.md`)

✅ **Use this for:**
- Session metadata
- Environment info
- Integration status
- Performance metrics
- Debug context

## Git Tracking

This directory IS committed to git:
- `context/` directory structure
- `README.md` documentation
- Default `workflow-context.json` template

The actual runtime values in `workflow-context.json` can be:
- Committed (if helpful for debugging)
- Gitignored (if too noisy)
- Reset on each run (if ephemeral)

Current strategy: **Committed** for visibility.

## Dashboard Query
```javascript
// Dashboard reads this for real-time info
const context = require('./context/workflow-context.json');

if (context.currentWorkflow) {
  console.log(`Active: ${context.currentWorkflow.userStoryId}`);
  console.log(`Started: ${context.currentWorkflow.startedAt}`);
}
```

## Future Extensions

Potential additions:
- `execution-logs/` - Detailed phase logs
- `metrics/` - Performance data per phase
- `cache/` - Temporary data cache
- `snapshots/` - Point-in-time workflow state

Keep this directory lightweight and focused on runtime metadata.
