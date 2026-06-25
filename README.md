# Local AI Workbench

A Chrome side-panel workbench for Chrome's built-in on-device AI. It helps summarize pages and email, answer questions about the active tab, parse attached documents, draft text, extract image details, save local notes, and manage private work memory.

The extension is designed around local processing: prompts run through Chrome's built-in AI APIs, and notes/history are stored in the browser with IndexedDB or `chrome.storage.local`.

The first Chrome Web Store package uses `activeTab` instead of broad required host permissions, so page reading is triggered by the user's action on the active tab.

## Features

- On-device page, article, and Gmail/Outlook email summarization.
- Ask questions about the active tab or an attached document.
- Parse local text, Markdown, CSV, JSON, PDF, DOCX, and image files.
- Save, reopen, and tidy browser tab sessions.
- Right-click selected text to ask Local AI, or right-click an image to extract text/details.
- Voice input and voice memos through Chrome's Web Speech API.
- Local conversation history, work memory, reading list, page log, and saved tab sessions.
- Site-safety heuristics, tab grouping, calendar export, and DOCX/Markdown/text export.

## Requirements

- Google Chrome 138 or newer.
- A desktop environment supported by Chrome's built-in AI APIs.
- Chrome built-in on-device AI enabled and downloaded.

## Local Install

1. Open `chrome://extensions`.
2. Turn on **Developer mode**.
3. Click **Load unpacked**.
4. Select this repository folder.
5. Open a normal web page and click the extension icon to open the side panel.

## Chrome Web Store Package

The source in this repository is the extension package. To create a zip for upload:

```sh
zip -r -X local-ai-workbench-store-v6.7.zip \
  manifest.json PRIVACY.md mic-permission.html mic-permission.js \
  fonts icons safety.js sidepanel.css background.js docparse.js \
  sidepanel.html sidepanel.js db.js md.js lib export.js
```

Upload the resulting zip in the Chrome Web Store Developer Dashboard.

## Privacy

See [PRIVACY.md](PRIVACY.md). In short: the project has no backend, no analytics, no telemetry, and no developer-operated data collection. User content is processed locally in Chrome. Voice input may use Chrome's speech service depending on the user's Chrome configuration.

## License

No open-source license has been selected yet. The repository is public, but reuse rights are not granted until a license is added.
