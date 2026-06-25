# Per-Tab Workspaces Experiment

_Branch: `codex/per-tab-workspaces`_  
_Status: minimal test build implemented in `6.8.0`_

## QA Decision

After user testing on June 25, 2026, the visible workspace management layer was retired:

- Do not ship **Pin workspace**, **Unpin workspace**, or **Rename workspace** controls.
- Keep the useful current-tab behavior: the side panel follows the active tab, clears stale page context, and re-reads the current page.
- Keep simple **Export conversation** and **New thread** controls.
- Future product focus moves to quick screenshots, long screenshots, OCR, and voice / meeting-note capture.

## 6.8.0 Test Build

The first bare working version includes:

- Local `tabWorkspaces` records stored in the browser.
- One temporary workspace per normal web tab.
- Automatic workspace switching when Chrome reports an active-tab change.
- Stale page context is cleared immediately on workspace switch before the new page is re-read.
- A visible workspace mode label in the context strip.
- Generic chat is separated from page-grounded work.
- A **Pin workspace / Unpin workspace** button under **More -> Session & reading**.
- Old temporary workspace records are cleaned after the retention window when workspace state is saved.

This build does not add new permissions and does not change the local-only privacy model.

## Goal

Make Local AI Workbench feel natural when the user works across multiple browser tabs.

Today, the side panel can read the active tab, but the conversation is global. That creates a confusing experience when a user switches between a policy document, an email, a product page, and a GitHub issue. The workbench should remember the local context for each active work surface without sending anything outside the browser.

## Product Principles

- A tab's conversation should not silently bleed into another tab.
- Page-grounded work, document-grounded work, and generic chat should be visibly distinct.
- The user should be able to pin important workspaces.
- Temporary tab workspaces should be cleaned up safely.
- The feature must remain local-only and should not require new permissions.

## User Stories

| ID | User story | Success condition |
| --- | --- | --- |
| PTW-001 | As a user, I want each tab to remember its own conversation. | Switching tabs restores the matching tab conversation and page context. |
| PTW-002 | As a user, I want to know what the assistant is reading. | The context strip shows Current tab, Generic chat, Pinned workspace, or No readable page. |
| PTW-003 | As a user, I want to pin a research/work tab. | A pinned workspace can be reopened later even if the tab was reloaded or closed. |
| PTW-004 | As a privacy-conscious user, I want this to stay local. | Workspace metadata and threads are stored only in IndexedDB / `chrome.storage.local`. |
| PTW-005 | As a user, I want generic chat to remain separate. | Turning on Ignore page creates or uses a generic workspace, not the active tab workspace. |

## Proposed Behavior

### First open

1. Side panel opens.
2. Extension detects the active tab.
3. If the tab is a normal `http` or `https` page, create or load a temporary workspace for that tab.
4. Auto-read runs if enabled.
5. Context strip shows: `Current tab · <page title>`.

### Tab switch

1. Save the current thread.
2. Detect the new active tab.
3. Find a workspace by `tabId`.
4. If none exists, check whether a pinned workspace matches the URL.
5. If none exists, create a temporary workspace.
6. Load the matching thread.
7. Clear the current model session so old context is not reused.
8. Auto-read the new page if enabled.

### Pin workspace

1. User clicks `Pin workspace`.
2. Current workspace becomes pinned.
3. Record keeps URL, normalized origin/path, title, thread ID, and last seen time.
4. Context strip shows: `Pinned workspace · <title>`.

### Generic chat

1. User turns on **Ignore page - generic chat**.
2. The assistant uses a separate generic workspace.
3. Page context is not included in prompts.
4. Context strip shows: `Generic chat`.

## Storage Design

Use existing local storage helpers:

- `getArr(key)`
- `setArr(key, value)`
- Existing `threads` array for actual conversation turns.

Add a new local key:

```text
tabWorkspaces
```

Workspace record:

```json
{
  "id": "ws_1782400000000_abcd",
  "threadId": "t1782400000000",
  "tabId": 123,
  "url": "https://example.com/article",
  "origin": "https://example.com",
  "title": "Example Article",
  "mode": "tab",
  "pinned": false,
  "createdAt": 1782400000000,
  "lastSeen": 1782400000000
}
```

Allowed `mode` values:

- `tab`
- `pinned`
- `generic`

## Matching Rules

| Scenario | Match rule |
| --- | --- |
| Temporary tab workspace | Prefer exact `tabId`. |
| Pinned workspace | Match explicit pinned record by URL. |
| Generic chat | Use one generic workspace per browser profile. |
| Same URL in two tabs | Keep separate temporary workspaces unless user explicitly pins one. |
| Closed tab | Temporary workspace becomes eligible for cleanup after retention window. |

## UI Changes

### Context strip

Current:

```text
<status dot> <page title> <refresh>
```

Proposed:

```text
<status dot> <workspace mode> · <page/workspace title> <refresh>
```

Examples:

- `Current tab · GitHub issue`
- `Pinned workspace · Policy review`
- `Generic chat`
- `No readable page · chrome://extensions`

### More sheet

Under **Session & reading**, add:

- `Pin workspace`
- `Unpin workspace` when already pinned

Future refinement:

- `Rename workspace`
- `Open workspace list`

## Implementation Plan

### Slice 1: Workspace state helpers

Add helpers near existing thread functions:

- `workspaceKeyForTab(tab)`
- `getWorkspaces()`
- `saveWorkspaces(workspaces)`
- `createWorkspaceForTab(tab)`
- `findWorkspaceForTab(tab)`
- `setCurrentWorkspace(workspace)`
- `saveCurrentWorkspaceThread()`

Acceptance:

- Helpers do not change visible behavior yet.
- `node --check sidepanel.js` passes.

### Slice 2: Load workspace on tab change

Wire workspace loading into the existing `ACTIVE_TAB_CHANGED` listener.

Acceptance:

- Switching tabs saves the old thread and loads the new tab's thread.
- Model session is reset on workspace change.
- Existing auto-read behavior still works.

### Slice 3: Pin/unpin UI

Add `Pin workspace` in **More → Session & reading**.

Acceptance:

- Button label updates between pin/unpin.
- Pinned workspace survives reload and tab ID changes.
- Pin state is visible in context strip.

### Slice 4: Cleanup

Add local cleanup for old temporary workspaces.

Acceptance:

- Pinned workspaces are never deleted automatically.
- Temporary workspaces older than the retention window are removed.
- Threads are not deleted until we have a separate user-facing cleanup policy.

## Privacy Impact

No new data leaves the device.

New local data:

- Workspace ID.
- Thread ID.
- Tab ID.
- URL/title metadata.
- Pin state.
- Last seen timestamp.

This is covered by the existing privacy policy under local storage, web browsing activity, user-generated content, page logs, saved sessions, and work memory.

## Permission Impact

No new permissions expected.

The feature relies on existing permissions:

- `tabs`
- `storage`
- `host_permissions`
- `scripting`

## Risks

| Risk | Mitigation |
| --- | --- |
| User thinks one tab has another tab's context. | Clear workspace label and session reset on tab change. |
| Too many local workspace records. | Cleanup temporary records after retention period. |
| Same URL appears in multiple tabs. | Prefer tab ID; pinning is explicit. |
| Thread history becomes fragmented. | Keep History tab global, but label workspace source in future refinement. |
| Minified `sidepanel.js` makes edits brittle. | Keep implementation slices small and syntax-check after each change. Consider a later source-formatting cleanup branch. |

## Manual Test Cases

- Tab A and Tab B each keep separate conversations.
- Switching tabs restores the expected conversation.
- Pinning Tab A survives reload.
- Opening the same URL in Tab B does not steal Tab A's temporary workspace.
- Generic chat does not include page context.
- Closing and reopening the side panel preserves workspace state.
- No new network calls or permissions are introduced.
