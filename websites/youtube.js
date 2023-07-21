function waitForElm(selector) {
  return new Promise((resolve) => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver((mutations) => {
      if (document.querySelector(selector)) {
        resolve(document.querySelector(selector));
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}

async function sendYouTubeData() {
  console.log("[Artemis] Sending YouTube watch page data");
  console.log("[Artemis] Waiting for metadata...");

  await waitForElm(".ytd-watch-metadata");

  console.log("[Artemis] Metadata loaded!");

  youTube = true;

  let data = {};
  // Check if it is music
  if (
    document.querySelector(".ytd-topic-link-renderer") &&
    document
      .querySelector(".ytd-topic-link-renderer")
      .innerText.includes("Music")
  ) {
    console.log("[Artemis] Is music!");
    data.music = true;
  } else {
    console.log("[Artemis] Not music");
    console.log(
      `[Artemis] Thingy ${
        document.querySelector(".ytd-topic-link-renderer") ? "does" : "does not"
      } exist`
    );
    if (document.querySelector(".ytd-topic-link-renderer")) {
      console.log(
        `[Artemis] Thingy has the following text: "${
          document.querySelector(".ytd-topic-link-renderer").innerText
        }`
      );
    }

    data.music = false;
  }

  chrome.runtime.sendMessage({
    type: "setYouTube",
    body: data,
    includeTabId: true,
  });
}

async function checkForYouTube() {
  if (
    window.location.hostname == "www.youtube.com" &&
    window.location.pathname == "/watch"
  ) {
    await sendYouTubeData();
  } else {
    chrome.runtime.sendMessage({
      type: "setYoutube",
      body: { music: false },
      includeTabId: true,
    });
  }
}

const observeUrlChange = () => {
  let oldHref = document.location.href;
  const body = document.querySelector("body");
  const observer = new MutationObserver(async (mutations) => {
    if (oldHref !== document.location.href) {
      oldHref = document.location.href;
      setTimeout(async () => {
        await checkForYouTube();
      }, 2000);
    }
  });
  observer.observe(body, { childList: true, subtree: true });

  checkForYouTube();
};

window.addEventListener("load", observeUrlChange);
