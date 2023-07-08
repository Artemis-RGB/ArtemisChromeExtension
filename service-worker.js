async function sendUpdate(data) {
  await fetch(
    `http://localhost:9696/plugins/eeb9ac67-4aff-4b05-b6db-f5eb47d89974/${data.type}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data.body),
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

chrome.tabs.onUpdated.addListener(async function (tabId, changeInfo, tab) {
  await sendUpdate({ type: "updatedTab", body: { tabId, changeInfo } });
});

chrome.tabs.onActivated.addListener(async function (activeInfo) {
  await sendUpdate({ type: "activatedTab", body: { tabId: activeInfo.tabId } });
});

chrome.tabs.onAttached.addListener(async function (tabId, attachInfo) {
  await sendUpdate({ type: "attachedTab", body: { tabId, attachInfo } });
});

chrome.tabs.onCreated.addListener(async function (tab) {
  await sendUpdate({ type: "newTab", body: tab });
});

chrome.tabs.onMoved.addListener(async function (tabId, moveInfo) {
  await sendUpdate({ type: "tabMoved", body: { tabId, moveInfo } });
});

chrome.tabs.onRemoved.addListener(async function (tabId, removeInfo) {
  await sendUpdate({ type: "closedTab", body: { tabId } });
});
