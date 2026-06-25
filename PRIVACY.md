<p align="center">
  <img src="icons/icon-128.png" width="92" alt="Local AI Workbench icon">
</p>

<h1 align="center">Privacy Policy</h1>

<p align="center">
  <strong>Local AI Workbench</strong><br>
  Private by design. Local by default. No developer access to your content.
</p>

<p align="center">
  <em>Last updated: June 25, 2026</em>
</p>

---

Local AI Workbench is designed as a **local-first browser AI workbench**. Its purpose is to help you summarize, question, extract, draft, and organize content from pages, emails, documents, images, notes, and tabs you choose to work with.

## The trust promise

> The developer does not have access to your page content, emails, prompts, notes, documents, images, local history, or saved workspaces. The extension has no developer-operated server, no analytics, no telemetry, and no advertising system. Because we do not receive your data, there is no path for us to sell it, inspect it, train on it, profile you with it, or use it for any unrelated purpose.

The core AI work happens locally in Chrome through browser-provided on-device AI APIs. Your local data stays in your browser unless you choose to delete it, clear browser storage, or uninstall the extension.

## Privacy at a glance

| Area | What it means |
| --- | --- |
| 🖥️ On-device AI | The main AI features run inside Chrome using browser-provided local AI capabilities. |
| 🔐 No developer access | The developer does not receive or view your private content. |
| 🚫 No backend server | The extension has no developer-operated backend, analytics, telemetry, or advertising service. |
| 🔒 Local storage | Notes, chats, page logs, reading lists, work memory, saved sessions, preferences, and transcripts are stored in your browser. |
| 🌐 Page access | The extension can read normal web pages only so it can summarize, answer questions, extract details, and follow the active tab. |
| 📸 Local screenshots | Screenshots are captured only when you choose the action and are saved locally through Chrome downloads. |
| 🖱️ User controlled | You choose what to read, summarize, attach, right-click, save, delete, or clear. |
| 💬 Voice note caution | Voice transcription uses Chrome's Web Speech API and may use Google's speech service depending on Chrome, language, and device settings. |
| 💰 No data business | We cannot sell or monetize data we never receive. |

## What the extension does

Local AI Workbench provides a Chrome side panel for:

- Summarizing and asking questions about the page or email you are viewing.
- Reading selected text through the right-click menu.
- Extracting text or details from images through the right-click menu.
- Capturing visible or full-page screenshots that can be saved locally and sent to local OCR when supported.
- Parsing attached documents locally where supported.
- Drafting, rewriting, explaining, and organizing text.
- Saving local notes, work memory, reading lists, tab sessions, and conversation history.
- Checking basic page safety signals such as URL, HTTPS status, and visible page indicators.

## What we collect

**We collect nothing.**

As the developer, I do not receive:

- Your web page content.
- Your emails.
- Your prompts or answers.
- Your notes or memos.
- Your attached documents.
- Your image content.
- Your screenshots.
- Your browsing history.
- Your voice recordings.
- Your personal information.

There is no developer-operated server, dashboard, account system, analytics panel, or remote database for this extension.

## What stays on your device

To provide the features you request, the extension may process and store the following **locally in Chrome**, using IndexedDB or `chrome.storage.local`:

- Page text and page context from the tab you choose to work with.
- Email or webmail content when you open an email page and ask the extension to work with it.
- Selected text sent through the right-click menu.
- Text or details extracted from images.
- Screenshots you choose to capture, saved as local image files through Chrome downloads.
- Text extracted from attached documents.
- Your prompts, AI responses, saved notes, memos, work memory, reading lists, saved tab sessions, page logs, persona settings, and app preferences.
- Optional voice memo transcripts. The extension stores transcript text, not audio files.
- Optional greeting name, if you enter one in settings.

This local data remains in your browser unless you delete it in the extension, clear browser storage, or uninstall the extension.

## Chrome Web Store data categories

For Chrome Web Store disclosure purposes, this extension may handle the following categories locally:

| Category | Why it applies |
| --- | --- |
| Website content | The extension reads pages, selected text, images, and documents you choose to summarize or analyze. |
| Web browsing activity | The extension uses the active tab URL/title and may keep local page logs or saved sessions so it can follow your current work. |
| Personal communications | If you use the extension on email or messaging web pages, it may process that visible content locally. |
| User-generated content | Prompts, answers, notes, memos, transcripts, reading lists, and saved workspace content are created by you and stored locally. |
| Personally identifiable information | Only if you voluntarily enter a name for greeting or save personal content in notes/prompts. |

These disclosures do **not** mean the developer receives this data. They mean the extension may handle this data locally to provide its features.

## When information may leave your device

Most features are local. The following user-initiated cases may involve the internet or third-party services:

- **Opening web pages:** If you use research, shopping, or link-opening features, Chrome opens normal web pages. Those websites receive requests just as they would if you visited them directly.
- **Voice input:** Chrome's Web Speech API may send audio to Google's speech service for transcription depending on your Chrome version, language, operating system, and settings. The extension does not store audio files.
- **External websites:** Any website you visit has its own privacy policy and behavior outside this extension's control.

The extension itself does not send your page content, prompts, notes, documents, images, or saved local history to a developer server.

## Permissions explained

| Permission | Why it is needed |
| --- | --- |
| `sidePanel` | Shows the Local AI Workbench interface inside Chrome's side panel. |
| `host_permissions` for `<all_urls>` | Lets the workbench read and capture normal web pages you choose to work with, follow the active tab, summarize pages, extract visible text, inspect basic safety signals, and avoid repeated permission prompts. The extension code limits page reading and screenshots to normal `http` and `https` pages and rejects Chrome internal pages. |
| `scripting` | Runs short page-reading scripts on normal web pages so the extension can collect visible text and page signals for your requested action. |
| `storage` | Saves local notes, memory, chats, reading lists, sessions, preferences, page logs, and transcripts in your browser. |
| `tabs` | Identifies the active tab, tab title, URL, and tab state so the side panel can work with the page you are viewing. |
| `activeTab` | Provides a temporary user-invoked grant for the active tab, used for current-page actions such as screenshots. |
| `downloads` | Saves user-triggered screenshots and exported files locally in your Downloads folder. |
| `tabGroups` | Supports user-triggered tab grouping and workspace organization. |
| `contextMenus` | Adds right-click actions for selected text and images, such as asking the local AI or extracting text/details from an image. |
| Optional `history` | Requested only if you choose the clear-history command. It is used to delete recent history after confirmation, not to read or transmit your history. |

The extension cannot read Chrome internal pages such as `chrome://` pages.

## Data sharing

We do not:

- Sell your data.
- Rent your data.
- Transfer your data to advertisers.
- Use your data for ads.
- Use your data for creditworthiness or lending.
- Allow humans to read your local content.
- Send your local content to a developer server.

## Limited Use

Local AI Workbench uses information from Chrome APIs and user actions only to provide the extension's visible, user-facing features. The extension is designed to comply with the Chrome Web Store User Data Policy and Limited Use requirements:

- Data is used only for the extension's single purpose.
- Data is processed locally where the extension controls the processing path.
- Data is not sold.
- Data is not used for advertising.
- Data is not transferred to the developer.
- Data is not used for unrelated profiling.

## Third-party components

Bundled libraries such as PDF.js, Mammoth.js, and local fonts run inside the extension package. They are included to parse files or render the user interface locally.

Chrome itself and the websites you choose to open are separate from this extension and may have their own privacy practices.

## Children

This extension is not directed to children under 13. The developer does not knowingly collect data from children or from any other users.

## Changes to this policy

Future changes will be published in this file in the public GitHub repository. The date at the top will be updated when the policy changes.

## Contact

Questions or concerns can be opened as a GitHub issue:

https://github.com/Najariya/nano-workbench/issues
