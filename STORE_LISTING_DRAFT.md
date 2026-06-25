# Chrome Web Store Listing Draft

Use this as the working copy for the Chrome Web Store Developer Dashboard.

## Basic Details

**Name:** Gemini Nano Workbench

**Summary:**
On-device AI side panel for Chrome: summarize pages, read documents, draft text, and keep private local notes.

**Category:** Productivity

**Visibility:** Public listing

**Language:** English

## Single Purpose

Gemini Nano Workbench is an on-device AI side panel for Chrome that helps users understand, summarize, and work with the page, email, tab, document, or note they choose, while keeping data local in the browser.

## Detailed Description

Gemini Nano Workbench brings Chrome's built-in on-device AI into a practical side-panel workspace.

Use it to summarize articles and emails, ask questions about the current page, compare multiple tabs, attach local documents, extract details from images, draft or rewrite text, save private work memory, and export useful answers.

The extension is built for local-first use. It has no developer-operated server, no analytics, no telemetry, and no advertising. Conversation history, memos, reading lists, saved sessions, preferences, and work memory are stored locally in the browser.

Some optional user-triggered features may open normal web pages or use Chrome services. Deep research opens a search page and result pages. Calendar export opens Google Calendar and downloads an ICS file. Voice input uses Chrome's Web Speech API, which may process audio through Google's speech service depending on the user's Chrome setup.

## Permission Justifications

**sidePanel**  
Displays the extension's main workbench interface in Chrome's side panel.

**storage**  
Stores user preferences, conversation history, local work memory, voice memo text, reading list items, saved tab sessions, and page logs locally in the browser.

**activeTab**  
Lets the extension read the active page only when the user opens or uses the workbench for that page.

**scripting**  
Injects short page-reading scripts into pages the user chooses so the side panel can summarize page text, selected text, emails, links, products, and safety signals.

**tabs**  
Supports multi-tab summarize/compare, reading selected open tabs, opening user-requested research/calendar/setup pages, and reopening saved tab sessions.

**tabGroups**  
Supports the user-triggered tab cleanup feature that groups related open tabs.

**contextMenus**  
Adds right-click actions for selected text and images: "Ask Nano" and "Extract details from image".

**host permissions: `http://*/*` and `https://*/*`**  
Needed to read user-selected web pages across normal websites for summarization, email reading, tab comparison, link/product extraction, image extraction, and site-safety checks.

**optional history**  
Requested only if the user chooses the "Clear recent history" command. It is used only to delete the last 24 hours of browsing history after explicit confirmation.

## Data Use Summary

- No developer-operated data collection.
- No analytics, advertising, tracking, sale, or transfer of user data.
- Page/email/document content is processed locally for the requested feature.
- Local data is stored in IndexedDB or `chrome.storage.local`.
- Deep research opens normal web pages selected by the user flow.
- Voice input may use Chrome's Web Speech API.

## Privacy Policy URL

After publishing the repository, use:

https://github.com/Najariya/nano-workbench/blob/main/PRIVACY.md

## Reviewer Test Instructions

1. Install the extension in Chrome 138 or newer with built-in AI available.
2. Open a normal web page.
3. Click the extension icon to open the side panel.
4. Click **Summarize** to verify the current page is summarized locally.
5. Type a question in the composer and send it.
6. Attach a small `.txt`, `.pdf`, or `.docx` file and ask a question about it.
7. Select text on a page, right-click, and choose **Ask Nano**.
8. Optional: use **Settings > Developer mode > Run check** to view model/storage/mic capability status.

## Listing Assets

- Screenshot 1: `store-assets/screenshots/01-page-summary.png`
- Screenshot 2: `store-assets/screenshots/02-document-review.png`
- Small promotional tile: `store-assets/promo/small-promo-tile-440x280.png`
- Optional promo video file: `store-assets/promo/gemini-nano-workbench-promo.mp4`

Chrome Web Store expects a YouTube URL for the promo video field, so upload the MP4 to YouTube first if you want to include it.
