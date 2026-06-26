# Release Notes Template

Use this template when preparing a Chrome Web Store update.

## Version

`X.Y.Z - short release name`

## User-Facing Summary

- One short sentence on what improved.
- One short sentence on why it matters.

## What's New

- Feature 1.
- Feature 2.
- Feature 3.

## Privacy and Permissions

- Required permissions changed: Yes / No.
- Host permissions changed: Yes / No.
- Optional permissions changed: Yes / No.
- Privacy policy changed: Yes / No.

If permissions changed, explain exactly why the change is necessary.

## Local-First Statement

Local AI Workbench continues to run user workflows in the browser. The developer does not receive prompts, page content, documents, images, notes, conversations, screenshots, or tab-context data.

## QA Evidence

- Static checks run:
  - `node --check background.js`
  - `node --check db.js`
  - `node --check docparse.js`
  - `node --check export.js`
  - `node --check md.js`
  - `node --check mic-permission.js`
  - `node --check safety.js`
  - `node --check sidepanel.js`
- Manual Chrome checks run:
  - Page summary.
  - Tab switching.
  - Right-click selected text.
  - Right-click image OCR.
  - Document attach.
  - Saved tab sessions.
  - Conversation export.
  - Settings/privacy link.

## Store Listing Notes

- Screenshot changes needed: Yes / No.
- Promo video changes needed: Yes / No.
- Description changes needed: Yes / No.
- Permission justification changes needed: Yes / No.

## Known Limitations

- Chrome's built-in on-device model must be available on the user's device.
- OCR depends on Chrome exposing image input for the on-device model.
- Voice input, voice memos, and meeting notes may use Chrome speech recognition and may not be fully on-device.
