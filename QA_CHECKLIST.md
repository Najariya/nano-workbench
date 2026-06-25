# Local AI Workbench QA Checklist

Use this checklist before promoting experimental branch work into a release package.

## Baseline

- Store-stable baseline: `main`, version `6.7.4`.
- Experiment branch: `codex/per-tab-workspaces`.
- Do not upload an experiment ZIP until the checklist passes and the version is intentionally bumped.

## Static Checks

Run these from the repository root:

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

Expected result: every command exits successfully with no syntax error.

## Manifest and Privacy Checks

- `manifest.json` version is the intended release version.
- Extension name is `Local AI Workbench`.
- No old `Gemini Nano Workbench` or `Ask Nano` branding remains.
- No experimental WebGPU option appears in user-facing UI or listing copy.
- Host permissions are still intentional and explained:
  - `http://*/*`
  - `https://*/*`
- Privacy policy URL still points to:
  - `https://github.com/Najariya/nano-workbench/blob/main/PRIVACY.md`
- Permission justifications in `STORE_LISTING_DRAFT.md` match `manifest.json`.

## Manual Smoke Test

### Install and Setup

- Load the unpacked extension from this repo.
- Open a normal `https://` web page.
- Click the extension icon and verify the side panel opens.
- Confirm the setup screen correctly reports whether Chrome's on-device model is available, downloadable, downloading, or ready.
- Close/reopen the side panel and verify state is preserved.

### Page Reading

- With **Auto-read the tab I'm viewing** enabled, open a readable web page.
- Verify the context strip updates to the page title.
- Click **Summarize** and confirm the answer is grounded in the current page.
- Click the context refresh button and confirm the page can be re-read.
- Open a Chrome internal page or blocked page and confirm the error is understandable.

### Tab Switching

- Open two normal web pages in the same window.
- Switch between tabs.
- Verify the side panel follows the active tab without repeated permission prompts.
- Confirm the context strip does not keep showing the wrong page.
- Ask a question after switching tabs and confirm it answers against the active tab.

### Generic Chat

- Turn on **Ignore page — generic chat**.
- Ask a generic question.
- Confirm the answer does not claim to have read the page.
- Turn the setting off and confirm page context works again.

### Right-Click Selection

- Select text on a page.
- Right-click and choose **Ask Local AI**.
- Confirm the side panel opens and uses the selected text.

### Right-Click Image OCR

- Right-click an image that contains text.
- Choose **Extract text/details with Local AI**.
- Confirm the side panel opens.
- Confirm the OCR result appears with copied text/fields available.
- Confirm low-confidence or hard-to-read outputs do not overclaim certainty.
- Confirm **Copy text**, **Copy fields** when fields exist, and **Copy JSON** are available and copy the expected content.
- Confirm medium, low, or partial OCR results show recheck guidance for important values.

### Documents

- Attach a small `.txt` file and ask a question about it.
- Attach a small `.pdf` or `.docx` file and ask for a summary.
- Confirm the attached document chip appears and can be removed.

### History, Memos, and Local Storage

- Ask at least one question and confirm it appears in **History**.
- Save a memory item in Settings and confirm it persists after reopening the side panel.
- Record or type a memo if voice is available.
- Confirm stored content remains local and no account/login is required.

### Site Safety

- Open a normal HTTPS site and confirm the safety badge/check does not block normal use.
- Open an HTTP page if available and confirm the warning is understandable.

### Export and Sessions

- Export an AI answer to Markdown or text.
- Save a tab session.
- Reopen a saved session.
- Use tab grouping only after confirming the visible tabs are safe to reorganize.

## Per-Tab Workspace Regression Gate

When the experimental per-tab workspace feature is implemented, add these checks:

- Confirm the extension version shows `6.8.0` in `chrome://extensions`.
- Open Tab A on a normal web page.
- Ask one question in Tab A.
- Open Tab B on a different normal web page.
- Confirm the context strip changes to Tab B and the old Tab A page content is not reused.
- Ask one question in Tab B.
- Switch back to Tab A and confirm Tab A's conversation returns.
- Switch back to Tab B and confirm Tab B's conversation returns.
- In Tab A, open **More -> Session & reading -> Pin workspace**.
- Confirm the context strip changes to **Pinned workspace**.
- Toggle **Ignore page - generic chat** and confirm the context strip changes to **Generic chat**.
- Ask a generic question and confirm it does not use the page.
- Turn generic chat off and confirm the current tab workspace returns.
- No new permission appears.
- No page content is transferred outside local browser storage.

## Context Quality Regression Gate

Run these checks for the `6.8.1 - Context quality test` build:

- Confirm `chrome://extensions` shows version `6.8.1`.
- Open a normal readable `https://` page and reload the unpacked extension.
- Confirm the context strip changes from `Not read` to `Read HH:MM` after the page is read.
- Click the context refresh button and confirm the read timestamp updates.
- Ask a page-grounded question and confirm the answer starts with a compact source label.
- Use **Summarize** on a long page and confirm progress shows the current part and total parts before the final summary.
- Open `chrome://extensions` or another internal Chrome page and confirm the message explains that browser/internal pages cannot be read.
- Turn on **Ignore page - generic chat** and confirm the message explains that generic chat is intentionally not reading the page.
- Open a page with little or no readable text and confirm **Summarize** gives a next action instead of only saying "Nothing to read".
- Attach a document and ask a question; confirm the answer source label identifies the attached document.

## OCR Workflow Regression Gate

Run these checks for the `6.8.2 - OCR workflow polish` build:

- Confirm `chrome://extensions` shows version `6.8.2`.
- Open the first-run onboarding if available and confirm the third card names right-click image OCR.
- Open **More** and confirm **Images & OCR -> Extract text from image** is visible.
- Click **Extract text from image** and confirm the assistant explains the right-click and attach-image paths.
- Right-click an image containing text and choose **Extract text/details with Local AI**.
- Confirm the OCR result has a confidence badge and shows recheck guidance when confidence is medium, low, or partial.
- Confirm **Copy text**, **Copy fields** when fields exist, and **Copy JSON** copy the expected output.
- Confirm `store-assets/README.md` keeps the OCR screenshot and promo frame in the listing story.

## Workspace Polish Regression Gate

Run these checks for the `6.8.3 - Workspace polish test` build:

- Confirm `chrome://extensions` shows version `6.8.3`.
- Pin a workspace, then use **More -> Session & reading -> Rename workspace**.
- Confirm the new workspace name appears in the context strip and persists after switching tabs away and back.
- Use **Export workspace** and confirm a local Markdown file downloads with workspace metadata and conversation turns.
- Use **Save tab session** after asking a question.
- Open **Saved sessions** and confirm the saved item shows a short conversation/workspace summary.
- Click **Open** on the saved session and confirm its conversation is restored while the saved tabs reopen.
- Confirm no new permission appears.
- Confirm no workspace content leaves local browser storage except the user-triggered Markdown export.

## Release and Store Documentation Gate

- Confirm `docs/testing-and-release-flow.md` includes the promotion checklist.
- Confirm `docs/permission-privacy-alignment.md` matches `manifest.json`, `STORE_LISTING_DRAFT.md`, and `PRIVACY.md`.
- Confirm `docs/release-notes-template.md` is ready to copy for the next store release.
- Confirm `store-assets/NEXT_VERSION_SCRIPT.md` covers page summary, right-click OCR, local privacy, and per-tab workspace visuals.
- Confirm `docs/accessibility-review.md` lists keyboard/screen-reader checks for the current UI.

## Packaging Gate

Only package after the above checks pass:

```sh
zip -r -X local-ai-workbench-store-vX.Y.Z.zip \
  manifest.json PRIVACY.md mic-permission.html mic-permission.js \
  fonts icons safety.js sidepanel.css background.js docparse.js \
  sidepanel.html sidepanel.js db.js md.js lib export.js
```

Then inspect the ZIP contents before upload.
