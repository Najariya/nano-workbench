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
- After QA, do not ship user-facing pin/rename workspace management. Keep the product centered on the current tab, conversation export, screenshots, OCR, and voice capture.

## Current Focus

| ID | Status | Priority | Area | Work item | Acceptance criteria |
| --- | --- | --- | --- | --- | --- |
| IMP-001 | Done | P0 | Planning | Create a real improvement backlog for the experiment branch. | Backlog exists in repo, separates store-safe baseline from experiments, and gives clear next implementation slices. |
| IMP-002 | Done | P0 | Tab context | Design current-tab context behavior before implementation. | `docs/per-tab-workspaces.md` is retained as the experiment note; pin/rename workspace management is retired after QA. |
| IMP-003 | Done | P0 | Reliability | Establish regression checks for the submitted 6.7.4 behavior. | `QA_CHECKLIST.md` covers static checks, page read, active-tab switch, right-click selection, right-click image OCR, settings, history, and privacy URL. |
| IMP-004 | Done | P1 | UX | Make current tab/context state more visible in the side panel. | Context strip now shows Current tab, Generic chat, or No readable page. |
| IMP-005 | Done | P1 | Multi-tab | Improve active-tab switching behavior. | Switching tabs follows the active tab, clears stale page context, and re-reads the current page without exposing workspace management. |
| IMP-013 | Done | P1 | Reading quality | Improve "Nothing to read" diagnostics. | The side panel explains generic-chat, internal-page, no-text, and blocked-page states with a next action. |
| IMP-014 | Done | P1 | Reading quality | Make page-read freshness visible. | Context strip shows a last-read timestamp or an unread reason, and the refresh control re-reads the page. |
| IMP-015 | Done | P1 | Trust | Add source label to AI responses. | Page, email, and document-grounded responses include a compact source label. |
| IMP-016 | Done | P1 | Long pages | Improve long-page chunking feedback. | Long summaries report part-by-part progress before the combined answer. |
| IMP-017 | Done | P1 | OCR | Make image OCR action more prominent in onboarding and UI. | Onboarding, More sheet, context-menu copy, and store assets now surface the OCR workflow clearly. |
| IMP-018 | Done | P1 | OCR | Improve OCR result confidence and recheck guidance. | Medium, low, or partial OCR outputs show explicit recheck guidance for important values. |
| IMP-019 | Done | P1 | OCR | Add "copy clean text" and "copy fields" consistency. | OCR results expose Copy text, Copy fields when fields exist, and Copy JSON. |
| IMP-006 | Done | P0 | Release | Document release promotion steps. | `docs/testing-and-release-flow.md` now defines promotion, packaging, and dashboard upload order. |
| IMP-007 | Done | P0 | Store review | Keep permission/privacy copy aligned with manifest. | `docs/permission-privacy-alignment.md` maps permissions to listing and privacy policy language. |
| IMP-020 | Done | P2 | Sessions | Keep saved tab sessions simple. | Saved sessions reopen tabs and may restore the related conversation, but no longer expose workspace naming/pinning. |
| IMP-021 | Dropped | P2 | Workspaces | Add lightweight workspace names. | Dropped after QA because naming/pinning workspaces was confusing and low-value. |
| IMP-022 | Done | P2 | Export | Add local export of conversation. | Current conversation exports to local Markdown without network transfer. |
| IMP-023 | Done | P2 | Accessibility | Review keyboard and screen-reader paths. | `docs/accessibility-review.md` records current coverage and manual checks. |
| IMP-024 | Done | P2 | Store assets | Add polished screenshot/video script for next version. | `store-assets/NEXT_VERSION_SCRIPT.md` covers summary, OCR, local privacy, and per-tab workspace visuals. |
| IMP-025 | Done | P2 | Release notes | Create next-version release notes template. | `docs/release-notes-template.md` is ready for store update notes. |
| IMP-026 | Done | P1 | Reliability | Add Doctor diagnostics and guarded tab switching. | Doctor checks model/storage/page/conversation state, keeps safe local diagnostics, and active-tab changes wait while an AI run is in progress. |
| IMP-027 | In progress | P2 | Capture | Explore multi-page long screenshots. | Full-page capture scrolls the current page, stitches screenshots locally, restores scroll position, saves to Downloads, very long pages save as multiple local parts instead of failing, and `tests/screenshot-long-page.test.js` covers the 55-screen regression. |
| IMP-028 | In progress | P2 | Meetings | Improve meeting notes capture. | Build `6.8.21` includes meeting-note start/stop, first-use speech disclosure, local transcript capture, AI notes with action items, fallback transcript saving if AI summary fails, Memos saving, transcript copy, Markdown export, helper/UI wiring regression coverage, Doctor voice-readiness checks, safe Doctor workflow evidence, and `tools/check-doctor-evidence.js` for copied-report validation; manual Chrome mic QA remains. |
| IMP-029 | Done | P1 | UX simplification | Remove pin/rename workspace management. | More sheet no longer shows Pin/Rename workspace; export and Doctor use conversation/current-tab language. |
| IMP-030 | In progress | P1 | Screenshots | Add quick screenshot capture. | Build `6.8.21` promotes screenshot capture to a labeled **Screenshot** composer button beside voice input, opens visible/full-page choices, previews/saves locally, and has static wiring coverage in `tests/screenshot-composer-button.test.js`; manual Chrome button QA remains. |
| IMP-031 | In progress | P1 | Voice | Add Momo-style voice capture refinements. | Build `6.8.21` includes quick voice memos with cleanup/action items, fallback transcript saving if AI cleanup fails, saved local transcripts, copy/export actions, speech-recognition disclosure, helper/UI wiring regression coverage, Doctor/health voice-readiness checks, safe Doctor workflow evidence, and copied-report validation; manual mic QA remains. |
| IMP-032 | In progress | P1 | Screenshot OCR | Improve screenshot OCR quality. | Build `6.8.21` reads tall screenshots in OCR slices, crops empty margins, text-upscales screenshot slices within a pixel budget, adds stronger contrast prep, extends `tests/screenshot-long-page.test.js`, reports screenshot/OCR readiness in Doctor, makes **OCR + summarize** the primary post-capture action, shows quality hints for partial/low/noisy OCR, records safe Doctor workflow evidence, and can validate copied Doctor reports; OCR quality still requires manual verification on real captured pages. |

## Backlog

### P0: Store-Stable Foundation

| ID | Status | Work item | Why it matters | Acceptance criteria |
| --- | --- | --- | --- | --- |
| IMP-003 | Done | Add regression checklist for 6.7.4. | Prevent experiments from breaking the version already submitted for review. | `QA_CHECKLIST.md` exists and can be run before packaging or merging. |
| IMP-006 | Done | Document release promotion steps. | Avoid uploading an experimental ZIP by mistake. | A release note explains when to bump version, package, upload, and update listing text. |
| IMP-007 | Done | Keep permission/privacy copy aligned with manifest. | Store review depends on consistency between package, listing, and privacy policy. | Manifest permissions match listing justifications and privacy policy. |

### P1: Per-Tab Workspaces

| ID | Status | Work item | Why it matters | Acceptance criteria |
| --- | --- | --- | --- | --- |
| IMP-002 | Done | Write per-tab workspace spec. | The feature touches thread history, active tab changes, context reading, and saved sessions. | `docs/per-tab-workspaces.md` covers storage keys, tab identity, pinned behavior, UI labels, and cleanup. |
| IMP-008 | Done | Add workspace state model. | The extension needs to remember which conversation belongs to which active tab. | Local `tabWorkspaces` records map tab or pinned URL to local thread IDs without sending data anywhere. |
| IMP-009 | Done | Auto-switch conversation on tab change. | User should not manually rebuild context every time they move between tabs. | Active tab change loads the matching tab workspace or creates a new one. |
| IMP-010 | Done | Add "Pin this tab workspace". | Some work should survive tab reloads or tab ID changes. | User can pin/unpin a workspace from More -> Session & reading. |
| IMP-011 | Done | Add current-tab indicator. | Users need to know what the AI is currently grounded in. | Context strip clearly shows Current tab, Generic chat, or No readable page. |
| IMP-012 | Done | Cleanup stale tab workspaces. | Prevent local storage clutter. | Temporary workspaces older than the local retention window are cleaned when workspaces are saved. |

### P1: Context and Reading Quality

| ID | Status | Work item | Why it matters | Acceptance criteria |
| --- | --- | --- | --- | --- |
| IMP-013 | Done | Improve "Nothing to read" diagnostics. | Users need to know whether the page blocks scripts, is internal, or has no readable text. | Error message explains likely cause and gives next action. |
| IMP-014 | Done | Make page-read freshness visible. | Stale context is dangerous in tab-heavy work. | Context strip shows when the page was last read and offers a clear refresh action. |
| IMP-015 | Done | Add source label to AI responses. | Users should know which page/doc/image was used. | Responses include a compact source label when page or document context is used. |
| IMP-016 | Done | Improve long-page chunking feedback. | On-device context limits are real; users need transparent progress. | Long page summarization reports chunk progress and avoids silent truncation. |

### P1: OCR and Right-Click Flow

| ID | Status | Work item | Why it matters | Acceptance criteria |
| --- | --- | --- | --- | --- |
| IMP-017 | Done | Make image OCR action more prominent in onboarding and UI. | This is a standout feature and should be obvious. | Onboarding, More sheet, and screenshots/video all make OCR discoverable. |
| IMP-018 | Done | Improve OCR result confidence and recheck guidance. | Image extraction can be imperfect. | OCR output clearly marks low-confidence fields and recommends rechecking important values. |
| IMP-019 | Done | Add "copy clean text" and "copy fields" consistency. | OCR users need fast copy/export. | Text, JSON, and detected fields have predictable copy actions. |
| IMP-032 | In progress | Improve screenshot OCR quality. | Captured screenshots are useful only if text remains legible enough for OCR and summary. | Tall screenshots are sliced before OCR instead of downscaled as one long image, OCR inputs crop empty margins, text-upscale screenshots, and normalize contrast; automated slice/scale coverage exists, Doctor reports screenshot capture/image-OCR readiness, captured screenshot cards lead with **OCR + summarize**, weak OCR results show quality hints, and Doctor copy includes safe screenshot OCR evidence without OCR/page text; manual OCR quality QA remains for real pages. |

### P1: Reliability and Diagnostics

| ID | Status | Work item | Why it matters | Acceptance criteria |
| --- | --- | --- | --- | --- |
| IMP-026 | Done | Add Doctor diagnostics and guarded tab switching. | Users need a reliable way to understand model, storage, permission, tab, and conversation state without opening DevTools. | Doctor shows pass/fail checks, copyable safe diagnostics, and tab switches are queued while an AI response is running instead of silently interrupting the model session. |
| IMP-029 | Done | Remove pin/rename workspace management. | The user-tested workspace naming/pinning layer was confusing and rarely needed. | More sheet exposes Export conversation and New thread only; Doctor/export language uses conversation/current tab. |

### P2: Workspace Polish

| ID | Status | Work item | Why it matters | Acceptance criteria |
| --- | --- | --- | --- | --- |
| IMP-020 | Done | Keep saved tab sessions simple. | Saved tabs and conversations should be useful without a new workspace concept. | A saved session can reopen tabs and optionally restore a related conversation summary, without workspace naming/pinning. |
| IMP-021 | Dropped | Add lightweight workspace names. | QA showed this creates more confusion than value. | Pin/rename workspace controls are not shipped. |
| IMP-022 | Done | Add local export of conversation. | Sensitive users may want portable local records. | Conversation can export to Markdown/text without any network transfer. |

### P2: Future Product Ideas

| ID | Status | Work item | Why it matters | Acceptance criteria |
| --- | --- | --- | --- | --- |
| IMP-027 | In progress | Explore multi-page long screenshots. | Long screenshots are a natural browser-workbench capability for research, records, and sharing. | Full-page capture scrolls and stitches locally, restores page position, saves PNGs under a clear Downloads folder, splits very long pages into parts, has an automated 55-screen regression test, documents permission impact, and Doctor reports screenshot API readiness. |
| IMP-028 | In progress | Improve meeting notes capture. | Meeting notes are a high-value local AI workflow when capture, cleanup, and summarization are frictionless. | Meeting notes can start from More/slash command, transcribe the mic, summarize into sections/action items, save to Memos, fall back to saving the transcript if AI summary fails, copy transcript, export Markdown, disclose Chrome speech behavior, report speech/mic readiness in Doctor, stay covered by helper/UI wiring regression tests, and add safe Doctor workflow evidence without transcript text; manual mic QA remains. |
| IMP-030 | In progress | Add quick screenshot capture. | A fast visible-page screenshot is the simplest next capture workflow and can feed OCR/summarization. | User can capture from a labeled **Screenshot** composer button beside the mic, choose visible/full-page capture, preview it, save it locally, and immediately process it with primary **OCR + summarize** or secondary text extraction where supported. |
| IMP-031 | In progress | Add Momo-style voice capture refinements. | Voice should feel like a first-class capture path, not a hidden utility. | Quick voice memos clean up speech into notes/action items, fall back to saving a structured transcript note if AI cleanup fails, retain local transcripts, expose copy/export actions, disclose Chrome speech behavior, expose Doctor/health readiness checks for speech API and microphone permission, keep the memo controls covered by UI wiring regression tests, and add safe Doctor workflow evidence without transcript text; manual mic QA remains. |

### P2: Quality, Accessibility, and Store Assets

| ID | Status | Work item | Why it matters | Acceptance criteria |
| --- | --- | --- | --- | --- |
| IMP-023 | Done | Review keyboard and screen-reader paths. | The side panel should remain usable without a mouse. | Core actions have labels, focus order is sane, and status updates remain accessible. |
| IMP-024 | Done | Add polished screenshot/video script for next version. | Store assets should show real value, not just UI surfaces. | Asset script covers summary, right-click OCR, local storage/privacy, and per-tab workspace if shipped. |
| IMP-025 | Done | Create next-version release notes template. | Reviewers and users need a clean update story. | Release notes explain new features, permissions unchanged/changed, and privacy posture. |

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
