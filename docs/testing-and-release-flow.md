# Testing and Release Flow

_Branch: `codex/per-tab-workspaces`_

## Version Series

The published/store baseline is:

```text
6.7.x = store-stable line
```

The current-tab context improvement line should use:

```text
6.8.x = current-tab context, diagnostics, and capture improvements line
```

Rules:

- Keep the submitted Chrome Web Store package as `6.7.4`.
- Do not bump `manifest.json` for planning-only commits.
- When the first user-visible current-tab context code lands, bump the experiment branch to `6.8.0`.
- If we need multiple test builds before release, use:
  - `6.8.0` for the first local test build
  - `6.8.1` for the next local test build
  - `6.8.2`, `6.8.3`, etc. as needed
- Chrome extension `version` must stay numeric, so do not use `alpha`, `beta`, or `dev` inside `manifest.version`.
- If we want a human-readable label later, add `version_name`, for example:

```json
"version": "6.8.0",
"version_name": "6.8.5 - Current tab context test"
```

## GitHub Branch

Experimental work lives here:

```text
codex/per-tab-workspaces
```

GitHub URL:

```text
https://github.com/Najariya/nano-workbench/tree/codex/per-tab-workspaces
```

Do not merge this branch into `main` until the QA checklist passes.

## Local Test Folder

Use a separate local worktree folder for testing:

```text
/Users/naveenagrawal/Documents/Nano Workbench Labs/per-tab-workspaces
```

This folder should point to the experiment branch. Load this folder in Chrome with **Load unpacked**.

The main repo folder can remain on `main`:

```text
/Users/naveenagrawal/Documents/Nano Workbench
```

## How to Test in Chrome

1. Open Chrome.
2. Go to `chrome://extensions`.
3. Turn on **Developer mode**.
4. Click **Load unpacked**.
5. Select:

```text
/Users/naveenagrawal/Documents/Nano Workbench Labs/per-tab-workspaces
```

6. Open a normal web page.
7. Open the side panel from the extension icon.
8. Run the checks in `QA_CHECKLIST.md`.

## Testing Order

### Phase 1: Static sanity

Run:

```sh
node --check background.js
node --check db.js
node --check docparse.js
node --check export.js
node --check md.js
node --check mic-permission.js
node --check safety.js
node --check sidepanel.js
```

### Phase 2: Existing behavior

Confirm the existing `6.7.4` behavior still works:

- Page summary.
- Active tab switching.
- Right-click selected text.
- Right-click image OCR.
- Attach document.
- Settings.
- History.
- Local memory.

### Phase 3: Current-tab context behavior

After the current-tab context code is implemented:

- Switching tabs follows the active tab and clears stale page context.
- The current tab re-reads when auto-read is enabled.
- Generic chat stays separate.
- Pin/Rename workspace controls are not shown.
- Export conversation works after a conversation exists.
- No new permission appears.
- No user content leaves local browser storage.

## Merge Rule

Only merge into `main` after:

- `QA_CHECKLIST.md` passes.
- Manifest version is intentionally bumped to the release version.
- Store listing copy is updated if behavior changed.
- Privacy policy still matches behavior.
- A release ZIP is generated and inspected.

Recommended merge target for this branch:

```text
main <- codex/per-tab-workspaces
```

## Release Promotion Checklist

Use this sequence when an experimental build is ready to become the next store package:

1. Confirm the test build in `manifest.json` is the version you want users to receive.
2. Run every static check listed in `QA_CHECKLIST.md`.
3. Run the manual Chrome checks for the version being promoted.
4. Compare `manifest.json`, `STORE_LISTING_DRAFT.md`, and `PRIVACY.md` against `docs/permission-privacy-alignment.md`.
5. Update release notes using `docs/release-notes-template.md`.
6. Merge `codex/per-tab-workspaces` into `main` only after QA passes.
7. Create the store ZIP from `main`, not from an unreviewed experiment folder.
8. Inspect the ZIP contents before upload.
9. Upload the ZIP in the Chrome Web Store Developer Dashboard.
10. Update store listing text/screenshots/video only when they match the uploaded package.

Do not upload a `6.8.x` package while it is still marked as an experiment in the backlog.

## Permission and Privacy Gate

The current experimental line uses the same broad web-page host access as the store baseline:

```json
"host_permissions": ["<all_urls>"]
```

This is intentional because the workbench reads normal web pages, follows the active tab, summarizes visible content, captures user-triggered screenshots, and avoids repeated page-by-page prompts. The code still limits page reading and screenshots to normal `http` and `https` pages. Before promotion, verify that:

- No new required permission was added without a backlog item and user-facing reason.
- `downloads`, if present in the screenshot build, is explained as local screenshot saving.
- Optional `history` remains optional and user-triggered.
- The listing explains host access plainly.
- `PRIVACY.md` clearly says the developer has no access to user content.
- The package still has no analytics, telemetry, ads, or developer-operated server.
