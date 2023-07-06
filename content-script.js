function fullscreenCallback() {
  chrome.runtime.sendMessage({
    type: "raw",
    body: { IsInFullscreen: document.fullscreenElement !== null },
  });
}

document.addEventListener("fullscreenchange", fullscreenCallback);
document.addEventListener("webkitfullscreenchange", fullscreenCallback);
