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

function checkActiveTabAudible() {
  chrome.tabs.query(
    { active: true, currentWindow: true, audible: true },
    async function (tabs) {
      await sendUpdate({ ActiveTabAudible: tabs.length > 0 });
    }
  );
}

chrome.tabs.onUpdated.addListener(async function (tabId, changeInfo, tab) {
  chrome.tabs.query({}, async function (tabs) {
    if (tabs.some((v) => v.audible)) {
      await sendUpdate({ AnyTabAudible: true });
    } else {
      await sendUpdate({ AnyTabAudible: false });
    }
  });
  checkActiveTabAudible();
});

chrome.tabs.onActivated.addListener(function (activeInfo) {
  checkActiveTabAudible();
});
