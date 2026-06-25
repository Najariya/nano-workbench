# Local AI Workbench Project Backlog

_Branch: `codex/per-tab-workspaces`_  
_Created: June 25, 2026_

This backlog is for refining Local AI Workbench after the first Chrome Web Store submission. The current public/store-ready baseline is **6.7.4** on `main`. This branch is for product improvement experiments and should not be packaged for the store until items are reviewed, tested, and deliberately promoted.

## Product Direction

Local AI Workbench should become a calm, private, on-device AI work surface inside Chrome. The core promise is simple:

- Read the page, email, document, image, or tab the user chooses.
- Keep work local in the browser.
- Make browser context feel continuous without confusing users or mixing unrelated tabs.
- Avoid repeated permission friction.
- Make advanced tools discoverable without making the side panel feel crowded.

## Guardrails

- Keep `main` store-stable unless we intentionally promote a tested release.
- Do not change Chrome permissions casually; every permission must have a visible user-facing purpose.
- Do not reintroduce experimental WebGPU options into the store path.
- Do not weaken the privacy message: the developer has no access to user content.
- Treat broad page access as a core capability, but make the product behavior transparent.
- Preserve the right-click image OCR workflow as a prominent feature.
- Prefer small refinements with clear acceptance criteria over large rewrites.

## Current Focus

| ID | Status | Priority | Area | Work item | Acceptance criteria |
| --- | --- | --- | --- | --- | --- |
| IMP-001 | Done | P0 | Planning | Create a real improvement backlog for the experiment branch. | Backlog exists in repo, separates store-safe baseline from experiments, and gives clear next implementation slices. |
| IMP-002 | Done | P0 | Tab context | Design per-tab workspace behavior before implementation. | `docs/per-tab-workspaces.md` defines automatic tab context, pinned tab workspaces, storage model, UI states, and edge cases. |
| IMP-003 | Done | P0 | Reliability | Establish regression checks for the submitted 6.7.4 behavior. | `QA_CHECKLIST.md` covers static checks, page read, active-tab switch, right-click selection, right-click image OCR, settings, history, and privacy URL. |
| IMP-004 | Done | P1 | UX | Make current tab/context state more visible in the side panel. | Context strip now shows Current tab, Generic chat, Pinned workspace, or No readable page. |
| IMP-005 | Done | P1 | Multi-tab | Improve active-tab switching behavior. | Switching tabs loads that tab's local workspace and clears stale page context before re-reading. |

## Backlog

### P0: Store-Stable Foundation

| ID | Status | Work item | Why it matters | Acceptance criteria |
| --- | --- | --- | --- | --- |
| IMP-003 | Done | Add regression checklist for 6.7.4. | Prevent experiments from breaking the version already submitted for review. | `QA_CHECKLIST.md` exists and can be run before packaging or merging. |
| IMP-006 | Backlog | Document release promotion steps. | Avoid uploading an experimental ZIP by mistake. | A release note explains when to bump version, package, upload, and update listing text. |
| IMP-007 | Backlog | Keep permission/privacy copy aligned with manifest. | Store review depends on consistency between package, listing, and privacy policy. | Manifest permissions match listing justifications and privacy policy. |

### P1: Per-Tab Workspaces

| ID | Status | Work item | Why it matters | Acceptance criteria |
| --- | --- | --- | --- | --- |
| IMP-002 | Done | Write per-tab workspace spec. | The feature touches thread history, active tab changes, context reading, and saved sessions. | `docs/per-tab-workspaces.md` covers storage keys, tab identity, pinned behavior, UI labels, and cleanup. |
| IMP-008 | Done | Add workspace state model. | The extension needs to remember which conversation belongs to which active tab. | Local `tabWorkspaces` records map tab or pinned URL to local thread IDs without sending data anywhere. |
| IMP-009 | Done | Auto-switch conversation on tab change. | User should not manually rebuild context every time they move between tabs. | Active tab change loads the matching tab workspace or creates a new one. |
| IMP-010 | Done | Add "Pin this tab workspace". | Some work should survive tab reloads or tab ID changes. | User can pin/unpin a workspace from More -> Session & reading. |
| IMP-011 | Done | Add workspace indicator. | Users need to know what the AI is currently grounded in. | Context strip clearly shows Current tab, Generic chat, Pinned workspace, or No readable page. |
| IMP-012 | Done | Cleanup stale tab workspaces. | Prevent local storage clutter. | Temporary workspaces older than the local retention window are cleaned when workspaces are saved. |

### P1: Context and Reading Quality

| ID | Status | Work item | Why it matters | Acceptance criteria |
| --- | --- | --- | --- | --- |
| IMP-013 | Backlog | Improve "Nothing to read" diagnostics. | Users need to know whether the page blocks scripts, is internal, or has no readable text. | Error message explains likely cause and gives next action. |
| IMP-014 | Backlog | Make page-read freshness visible. | Stale context is dangerous in tab-heavy work. | Context strip shows when the page was last read and offers a clear refresh action. |
| IMP-015 | Backlog | Add source label to AI responses. | Users should know which page/doc/image was used. | Responses include a compact source label when page or document context is used. |
| IMP-016 | Backlog | Improve long-page chunking feedback. | On-device context limits are real; users need transparent progress. | Long page summarization reports chunk progress and avoids silent truncation. |

### P1: OCR and Right-Click Flow

| ID | Status | Work item | Why it matters | Acceptance criteria |
| --- | --- | --- | --- | --- |
| IMP-017 | Backlog | Make image OCR action more prominent in onboarding and UI. | This is a standout feature and should be obvious. | Onboarding, More sheet, and screenshots/video all make OCR discoverable. |
| IMP-018 | Backlog | Improve OCR result confidence and recheck guidance. | Image extraction can be imperfect. | OCR output clearly marks low-confidence fields and recommends rechecking important values. |
| IMP-019 | Backlog | Add "copy clean text" and "copy fields" consistency. | OCR users need fast copy/export. | Text, JSON, and detected fields have predictable copy actions. |

### P2: Workspace Polish

| ID | Status | Work item | Why it matters | Acceptance criteria |
| --- | --- | --- | --- | --- |
| IMP-020 | Backlog | Improve saved sessions as workspaces. | Saved tabs and conversations should feel connected. | A saved session can be reopened with its related local notes/conversation summary. |
| IMP-021 | Backlog | Add lightweight workspace names. | Users need human labels for ongoing work. | User can rename a pinned workspace locally. |
| IMP-022 | Backlog | Add local export of workspace. | Sensitive users may want portable local records. | Workspace can export to Markdown/text without any network transfer. |

### P2: Quality, Accessibility, and Store Assets

| ID | Status | Work item | Why it matters | Acceptance criteria |
| --- | --- | --- | --- | --- |
| IMP-023 | Backlog | Review keyboard and screen-reader paths. | The side panel should remain usable without a mouse. | Core actions have labels, focus order is sane, and status updates remain accessible. |
| IMP-024 | Backlog | Add polished screenshot/video script for next version. | Store assets should show real value, not just UI surfaces. | Asset script covers summary, right-click OCR, local storage/privacy, and per-tab workspace if shipped. |
| IMP-025 | Backlog | Create next-version release notes template. | Reviewers and users need a clean update story. | Release notes explain new features, permissions unchanged/changed, and privacy posture. |

## Per-Tab Workspace Draft

### Problem

The extension currently follows the active tab, but conversation history is global. When the user switches between multiple tabs, it can feel unclear whether the assistant is continuing the old conversation, reading the new page, or mixing contexts.

### Desired Behavior

- Each normal web tab can have its own temporary workspace.
- Switching tabs should restore that tab's local conversation and page context.
- A new tab should start with a clean workspace unless it matches a pinned workspace.
- The user can pin a workspace when they want the conversation to survive tab closure, reloads, or returning later.
- Generic chat should remain available and clearly separate from page-grounded work.

### Proposed Local Storage

| Key | Shape | Purpose |
| --- | --- | --- |
| `tabWorkspaces` | Array of workspace records | Tracks temporary and pinned workspace metadata. |
| `threads` | Existing thread array | Stores conversation turns. |
| `workspacePrefs` | Object | Stores feature flags such as whether per-tab workspace is enabled. |

Workspace record draft:

```json
{
  "id": "ws_...",
  "threadId": "t...",
  "tabId": 123,
  "url": "https://example.com/page",
  "title": "Example page",
  "pinned": false,
  "lastSeen": 1782400000000
}
```

### UI Draft

- Add a small workspace label in the context strip:
  - `Current tab`
  - `Pinned workspace`
  - `Generic chat`
  - `No readable page`
- Add a `Pin workspace` button under **More → Session & reading**.
- Change the existing `New thread` behavior to create a new thread for the current workspace, not silently overwrite another tab's thread.

### Edge Cases

- Chrome internal pages cannot be read.
- Some pages block script access or expose little readable text.
- Tab IDs are temporary; pinned workspaces should rely on URL/title fallback.
- The same URL may be open in more than one tab. Temporary workspaces should prefer tab ID; pinned matching should be explicit.
- A user may want generic chat while still viewing a page. This must remain a separate state.

## Definition of Done for Experimental Features

- Feature has a backlog item and acceptance criteria.
- Privacy impact is checked.
- Manifest permission impact is checked.
- Manual smoke test is documented.
- `node --check` passes for modified JavaScript.
- Store assets/listing implications are noted if user-facing behavior changes.
- Version bump is done only when preparing a real store package.
