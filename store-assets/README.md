# Chrome Web Store Assets

Generated assets for the Chrome Web Store listing.

## Files

- `screenshots/01-workbench-actions.png` - 1280 x 800 real screenshot showing the side-panel workbench summarizing a page.
- `screenshots/02-image-ocr-right-click.png` - 1280 x 800 screenshot highlighting the right-click image OCR context-menu workflow.
- `screenshots/03-model-setup.png` - 1280 x 800 screenshot showing on-device model download and ready states.
- `screenshots/04-settings-safety.png` - 1280 x 800 real-screenshot composite showing settings, site safety, reading, and persona controls.
- `screenshots/05-model-download-context.png` - 1280 x 800 real screenshot showing the model setup card inside Chrome.
- `promo/small-promo-tile-440x280.png` - required 440 x 280 small promotional tile.
- `promo/local-ai-workbench-promo.mp4` - optional local promo video. Chrome Web Store expects a YouTube URL, so upload this video to YouTube and paste the video link if you want to use the video field.

## Technical fit

- Screenshots: 5 PNG files, each 1280 x 800.
- Small promotional tile: 440 x 280 PNG.
- Promo video source file: 1280 x 720 H.264 MP4. Upload this MP4 to YouTube before using the Chrome Web Store promo video field.

## Listing Story

Use the assets in this order so the OCR feature is visible early:

1. `screenshots/01-workbench-actions.png` - show the side-panel workbench on a real page.
2. `screenshots/02-image-ocr-right-click.png` - show the right-click image OCR workflow prominently.
3. `screenshots/03-model-setup.png` - show the one-time local model setup.
4. `screenshots/04-settings-safety.png` - show local controls, safety, and reading settings.
5. `screenshots/05-model-download-context.png` - show the model download/ready state in Chrome.

The promo video should keep `frame-03-ocr.png` as a dedicated OCR beat: right-click an image, extract text/fields locally, then copy clean text, fields, or JSON.

## Source

The source contact sheet is `source/asset-board.html`.
