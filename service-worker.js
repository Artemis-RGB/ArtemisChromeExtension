async function sendUpdate(json) {
  await fetch(
    "http://localhost:9696/plugins/eeb9ac67-4aff-4b05-b6db-f5eb47d89974/update",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(json),
    }
  );
}

chrome.runtime.onMessage.addListener(async function (
  request,
  sender,
  sendResponse
) {
  await sendUpdate(request);
});

async function getTabsAndSendUpdate() {
  chrome.tabs.query({}, async function (tabs) {
    await sendUpdate({ tabs });
  });
}

chrome.tabs.onUpdated.addListener(async function (tabId, changeInfo, tab) {
  await getTabsAndSendUpdate();
});

chrome.tabs.onActivated.addListener(async function (activeInfo) {
  await getTabsAndSendUpdate();
});

chrome.tabs.onAttached.addListener(async function (tabId, attachInfo) {
  await getTabsAndSendUpdate();
});

chrome.tabs.onCreated.addListener(async function (tab) {
  await getTabsAndSendUpdate();
});

chrome.tabs.onDetached.addListener(async function (tab) {
  await getTabsAndSendUpdate();
});

chrome.tabs.onMoved.addListener(async function (tabId, moveInfo) {
  await getTabsAndSendUpdate();
});

chrome.tabs.onRemoved.addListener(async function (tabId, removeInfo) {
  await getTabsAndSendUpdate();
});

chrome.tabs.onReplaced.addListener(async function (addedTabId, removedTabId) {
  await getTabsAndSendUpdate();
});

(async () => {
  await getTabsAndSendUpdate();
})();
