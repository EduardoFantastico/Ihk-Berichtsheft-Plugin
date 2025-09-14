<<<<<<< HEAD
# Ihk-Berichtsheft-Plugin
=======
# IHK Berichtsheft Filler (MV3)

Chrome Extension to create Cards and automatically apply qualifications and duration to open Berichtsheft entries on `bildung.ihk.de`.

## Install (Developer Mode)
1. Open Chrome → `chrome://extensions`
2. Enable "Developer mode"
3. Click "Load unpacked" and choose this folder
4. Pin the extension for quick access

## Cards
- In the popup, create a Card with:
  - Card Name
  - Duration (HH:MM)
  - Description (free text)
  - School/Company qualifications (multi-select with de-duplication across lists)
- Cards are saved in `chrome.storage.local` keyed by Card Name.

## Detect open report entries
- Navigate to your daily entries page on `https://bildung.ihk.de/...`
- Scroll a bit so entries render
- Open the popup and click "Refresh"
- If open text fields are found, a list appears under "Open Report Entries":
  - Each row: Entry label, Card dropdown, Duration override (optional)
  - If the list is empty, the section hides automatically

## Apply to All
- For each visible row, pick a Card and optionally set a per-entry Duration override
- Click "Apply to All"
- The content script will, for each mapped entry:
  1) Scroll into view to trigger lazy-load
  2) Click the red qualifications button and select all assigned qualifications
  3) Close the dialog
  4) Set the single duration input

## Zero-entry scenario
- If there are no open text fields (e.g., no entry blocks expanded), the mapping section is hidden
- Expand or create an entry, then click "Refresh"

## Notes
- The extension uses only `storage`, `activeTab`, and `scripting` permissions
- Works with dynamically loaded content via a MutationObserver and on-demand scans

## Troubleshooting
- If a qualification label differs slightly, adjusting the Card labels to match visible text improves matching
- Share a small HTML snippet around an entry if selectors need to be tightened further 
>>>>>>> recovery
