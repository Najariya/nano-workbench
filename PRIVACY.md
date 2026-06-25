# Privacy Policy — Local AI Workbench

_Last updated: 2026_

**Summary: this extension has no servers of its own and does not collect, sell, or transmit your personal data. The AI runs on your device. A few clearly-labelled, user-initiated features open normal web pages or use Chrome's speech service; these are described below.**

## What the extension does

Local AI Workbench uses Chrome's built-in on-device AI through browser-provided AI APIs to summarize pages and emails, parse attached documents, answer questions, extract details from images, draft and rewrite text, and more. The AI processing happens **locally inside your browser**.

## Data we collect

**None.** The extension operator runs no servers, no analytics, no tracking, and no telemetry. We never receive your data.

## Data the extension handles locally (never sent to us)

To function, the extension processes the following **on your device** and stores it **only in your browser** (IndexedDB / `chrome.storage.local`):

- **Page / email content** — the text of the tab you choose to read, used to generate a response.
- **Attached documents** — files you attach are parsed in-browser to extract text.
- **Work memory, voice memos, conversation history, reading list, saved sessions, persona, page log, and preferences** — stored locally so they persist between sessions. They stay on your machine and are removed if you delete them in the app or uninstall the extension.

## Features that contact the internet (only when you use them)

These are **user-initiated** and clearly labelled in the app. The extension still has no server of its own; these use the open web or Chrome's own services:

- **Deep research** — opens ordinary web pages (e.g. a search engine and the top results) in browser tabs so their content can be read. Your query is sent to those third-party sites exactly as if you visited them yourself.
- **Voice input / audio notes** — speech is transcribed by **Chrome's Web Speech API**, which, depending on your Chrome version and language, may send audio to Google's speech service. This is the one feature where audio may leave your device, and only while you actively record. The extension does not record or store audio files.

## Permissions and why they're used

- `sidePanel` — show the side-panel interface.
- `host_permissions` (`http://*/*`, `https://*/*`) and `scripting` — read and summarize normal web pages, emails, links, products, and safety signals you choose to work with in the side panel. This access is requested once at install so the workbench can follow the active tab without repeated prompts. The extension cannot read Chrome internal pages and does not send page content to a developer server.
- `storage` — save your notes, memory, persona, and preferences locally.
- `tabs`, `tabGroups` — list, save, reopen, and tidy/group tabs when you trigger those actions.
- `contextMenus` — the right-click "Ask Local AI" / "Extract from image" actions.
- Optional `history` — only requested if you use "Clear recent history"; used solely to clear, never to read or transmit your history.

## Data sharing and sale

We do not sell, rent, or share your data with anyone. We never receive it in the first place.

## Limited Use certification

This product's use of information received from Chrome APIs and from the user adheres to the [Chrome Web Store User Data Policy](https://developer.chrome.com/docs/webstore/program-policies/user-data-faq), including the **Limited Use** requirements. Data processed by the extension is used only to provide and improve the user-facing features described above, is processed locally on the user's device, is **not** transferred to the developer, is **not** sold, and is **not** used for advertising, creditworthiness, or any purpose unrelated to the extension's single purpose.

## Third parties

The extension operator uses no third-party services. Bundled open-source libraries (PDF.js, Mammoth.js, the Inter font) run locally and make no network calls. The third-party websites opened by the research/shopping features have their own privacy policies.

## Children

This extension is not directed to children under 13 and collects no data from anyone.

## Changes

Any future changes to this policy will be reflected in this file in the project's repository, with an updated date above.

## Contact

Questions? Open an issue at https://github.com/Najariya/nano-workbench/issues.
