# Permission and Privacy Alignment

_Branch: `codex/per-tab-workspaces`_

Use this file before promoting any experiment build to the Chrome Web Store.

## Current Manifest Surface

| Manifest item | Current value | User-facing reason | Listing/privacy alignment |
| --- | --- | --- | --- |
| `sidePanel` | Required | Opens the workbench inside Chrome's side panel. | Listing describes a browser side-panel workbench. |
| `storage` | Required | Saves local conversations, notes, reading lists, sessions, preferences, and workspace metadata. | Privacy policy says this data stays in the user's browser. |
| `scripting` | Required | Reads visible text from the active page when the user asks the workbench to read or summarize it. | Listing and privacy policy describe page reading for normal web pages. |
| `tabs` | Required | Follows the active tab, shows context, lists tabs for user-triggered tab/session tools, and reopens saved sessions. | Listing mentions active-tab reading, saved sessions, and tab tools. |
| `contextMenus` | Required | Adds right-click actions for selected text and image OCR. | Listing and screenshots mention right-click selected text and right-click image OCR. |
| `tabGroups` | Required | Supports user-triggered tab grouping. | Listing describes tab cleanup/grouping as a user-triggered tool. |
| `history` | Optional | Used only if the user asks for the clear-history tool. | Privacy policy states history access is optional and user-triggered. |
| `http://*/*`, `https://*/*` | Host permissions | Lets the workbench read normal web pages and avoid repeated page-by-page prompts. | Store listing and privacy policy must explain broad page access clearly. |

## Required Privacy Position

The privacy policy and listing must keep these statements true:

- The developer has no access to page content, prompts, documents, images, notes, or saved workspaces.
- There is no developer-operated server.
- There is no analytics, telemetry, advertising, sale of user data, profiling, or model training by the developer.
- User content stays in Chrome local storage / IndexedDB unless the user chooses an external website or Chrome service.
- Voice input may use Chrome's speech recognition service and is not represented as fully on-device.

## Promotion Check

Before upload, compare the package against this matrix:

1. Read `manifest.json`.
2. Confirm every required permission appears in this file.
3. Confirm every permission has a matching justification in `STORE_LISTING_DRAFT.md`.
4. Confirm `PRIVACY.md` still covers local storage, host permissions, optional history, voice input, and no developer data access.
5. If any permission changes, update this file, the listing draft, and privacy policy before packaging.
