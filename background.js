// background.js
// Routes messages between popup and the active tab's content script.

chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
  if (msg && msg.type === "APPLY_CARD") {
    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      if (tab && tab.id) {
        await chrome.tabs.sendMessage(tab.id, msg);
        sendResponse({ ok: true });
      } else {
        sendResponse({ ok: false, error: "No active tab" });
      }
    } catch (err) {
      sendResponse({ ok: false, error: String(err) });
    }
    return true; // async
  }
  if (msg && msg.type === "APPLY_ALL") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, msg, sendResponse);
      }
    });
    return true; // async
  }
});
