# Local AI Workbench Agent Instructions

These instructions apply to this repository and override the global defaults when working inside this project.

## Project Context

Local AI Workbench is a Chrome extension for local-first, on-device browser AI workflows. The active experiment branch is:

```text
codex/per-tab-workspaces
```

The store-stable baseline is:

```text
main / 6.7.x
```

The active product-improvement line is:

```text
6.8.x
```

Do not package or upload an experimental build to the Chrome Web Store until the relevant backlog item passes QA and the user explicitly agrees to promote it.

## Backlog Discipline

Use the project backlog as the work queue:

```text
PROJECT_BACKLOG.md
```

Before changing code, identify the backlog item or deliverable being picked up. If the work is not already in the backlog, add or clarify a backlog item first unless the change is a tiny housekeeping fix.

For each implementation item, keep the success criteria explicit:

- What user-visible or technical behavior must be true?
- What files or modules are expected to change?
- What tests or checks prove it?
- What still requires the user's manual Chrome test?

Update backlog status honestly:

- `Next` means ready to pick up.
- `In progress` means work has started.
- `Done` means implemented and checked against its success criteria.
- `Backlog` means not started.

## Required Work Report Format

Every final response for project work must include these sections, even if brief:

```text
Picked deliverable
Delivered
Success criteria
Tests run
Test result
Manual test needed
Next deliverable
GitHub status
```

### Picked deliverable

State the exact backlog item, phase, bug, or task selected for this turn.

Example:

```text
Picked deliverable: IMP-014, make page-read freshness visible.
```

### Delivered

List what was actually changed. Keep it concrete and file-aware.

Example:

```text
Delivered: Added a "last read" timestamp to the context strip and refreshed it after page reads.
```

### Success criteria

Report each criterion and whether it passed.

Example:

```text
Success criteria:
- Context strip shows freshness: passed.
- Refresh button updates freshness: passed.
- No new permissions: passed.
```

### Tests run

List automated/static checks and manual checks performed by the agent.

Examples:

```text
Tests run:
- node --check sidepanel.js
- node --check background.js
- git diff --check
```

### Test result

Say `passed`, `failed`, or `not fully tested`.

If any test failed, explain the failure and whether it blocks testing.

If a browser/manual test is required and the agent did not run it, say that clearly and ask the user to run exact steps.

### Manual test needed

For Chrome extension changes, include exact user test steps unless the agent already completed equivalent browser verification.

Example:

```text
Manual test needed:
1. Reload the unpacked extension from the lab folder.
2. Open Tab A and ask a question.
3. Open Tab B and confirm Tab A's answer does not appear.
```

### Next deliverable

Name the next backlog item or refinement to pick up.

Example:

```text
Next deliverable: IMP-014, show when the page was last read.
```

### GitHub status

Always state whether changes are:

- local only,
- committed,
- pushed to the experiment branch,
- merged to main,
- or not committed by design.

If a commit was made, include the short commit hash.

## Testing Requirements

After code changes, run the narrowest relevant checks. For this extension, default to:

```sh
node --check background.js
node --check db.js
node --check docparse.js
node --check export.js
node --check md.js
node --check mic-permission.js
node --check safety.js
node --check sidepanel.js
git diff --check
```

For UI/behavior work, also update or reference:

```text
QA_CHECKLIST.md
```

If browser testing is needed but not performed by the agent, the final response must explicitly ask the user to test and provide exact steps.

## Versioning Rules

- `6.7.x` is the store-stable line.
- `6.8.x` is the per-tab workspace / improvement line.
- Do not bump `manifest.json` for documentation-only changes.
- Bump the version only when a user-testable extension behavior changes.
- Chrome extension `version` must remain numeric.
- Use `version_name` for human-readable test labels.

## Git Rules

For this experiment branch, keep GitHub updated when the user asks for a working test build or ongoing product refinement.

Use focused commits:

- Planning/doc changes in one commit.
- Feature implementation in one commit.
- Test/build/package changes in one commit.

Do not merge into `main` until:

- QA checklist passes,
- manual Chrome testing is either completed or explicitly accepted,
- privacy/permissions are still aligned,
- and the user confirms promotion.

## Privacy and Permission Guardrails

- Do not add new Chrome permissions without a clear user-facing reason.
- Do not introduce remote analytics, telemetry, tracking, ads, or developer-server data collection.
- Preserve the privacy promise: the developer does not have access to user page content, prompts, notes, documents, images, local history, or saved workspaces.
- Any new local storage category must be reflected in docs if it changes the privacy explanation.

## Chrome Extension Testing Folder

The local test folder for this branch is:

```text
/Users/naveenagrawal/Documents/Nano Workbench Labs/per-tab-workspaces
```

When asking the user to test, point them to this folder for **Load unpacked**.
