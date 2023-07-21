//https://stackoverflow.com/questions/51086688/mutex-in-javascript-does-this-look-like-a-correct-implementation
class Mutex {
  constructor() {
    let current = Promise.resolve();
    this.lock = () => {
      let _resolve;
      const p = new Promise((resolve) => {
        _resolve = () => resolve();
      });
      // Caller gets a promise that resolves when the current outstanding
      // lock resolves
      const rv = current.then(() => _resolve);
      // Don't allow the next request until the new promise is done
      current = p;
      // Return the new promise
      return rv;
    };
  }
}

const baseUrl =
  "http://localhost:9696/plugins/eeb9ac67-4aff-4b05-b6db-f5eb47d89974";

const mutex = new Mutex();

async function sendInitialData() {
  let tabs = await chrome.tabs.query({});

  await fetch(`${baseUrl}/setAllTabs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tabs),
    signal: AbortSignal.timeout(200),
  });
}

async function sendUpdate(endpoint, data) {
  //Let's lock this to make sure the firstRequest feature works correctly.
  //If we don't, weird stuff happens if we send 2 requests while waiting for the response and we lose data.
  let unlock = await mutex.lock();

  try {
    let response = await fetch(`${baseUrl}/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      signal: AbortSignal.timeout(200),
    });

    let json = await response.json();

    if (json.firstRequest) {
      //if we get here, it means chrome
      //was already open when artemis started.
      //In this case, we need to send all the tabs,
      //which will then be updated as they change.

      await sendInitialData();
    }
  } catch (error) {
    //TODO: do we even handle this? Ignoring is probably fine.
  } finally {
    unlock();
  }
}

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.includeTabId) {
    request.body = { tabId: sender.tab.id, ...request.body };
  }
  await sendUpdate(request.type, request.body);
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  await sendUpdate("tabUpdated", { tabId, changeInfo });
});

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  await sendUpdate("tabActivated", { tabId: activeInfo.tabId });
});

chrome.tabs.onCreated.addListener(async (tab) => {
  await sendUpdate("tabCreated", tab);
});

chrome.tabs.onMoved.addListener(async (tabId, moveInfo) => {
  await sendUpdate("tabMoved", { tabId, moveInfo });
});

chrome.tabs.onRemoved.addListener(async (tabId, removeInfo) => {
  await sendUpdate("tabClosed", { tabId });
});
