# Accessibility Review

_Scope: `6.8.x` experiment branch_

## Current Coverage

| Area | Status | Evidence |
| --- | --- | --- |
| Status updates | Pass | `#status` is a visually hidden live region with `role="status"` and `aria-live="polite"`. |
| Icon-only top controls | Pass | New conversation, settings, refresh context, attach, send, and safety controls have visible text or `aria-label` / `title`. |
| Core actions | Pass | Primary chips and More sheet actions use visible text labels. |
| Keyboard flow | Pass | Buttons, checkboxes, text areas, file input trigger, and command items are native focusable controls. |
| New workspace controls | Pass | Rename workspace and Export workspace use visible text and disabled states when unavailable. |
| OCR controls | Pass | OCR actions use visible text: Copy text, Copy fields, Copy JSON, Add to calendar. |
| Focus risk | Watch | The More sheet closes after action buttons; manual testing should confirm focus returns to the panel naturally. |
| Dynamic chat output | Watch | AI messages render Markdown; manual testing should confirm long outputs remain readable with keyboard scrolling. |

## Manual Checks

Run these before promotion:

1. Use Tab/Shift+Tab from the top bar through primary actions, More, composer, and send.
2. Open More and confirm every action can be reached with the keyboard.
3. Trigger Rename workspace and confirm the inline prompt receives focus.
4. Trigger Export workspace and confirm it does not require a pointer-only action.
5. Run OCR and confirm Copy text / Copy fields / Copy JSON are keyboard reachable.
6. Confirm screen readers announce status changes through the hidden status region.

## Follow-Up Ideas

- Add a focus return target after closing More.
- Consider `aria-expanded` on the More button and focus/menu buttons.
- Add more explicit labels for decorative symbols if they remain in text-only controls.
