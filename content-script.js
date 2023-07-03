function fullscreenCallback() {
  chrome.runtime.sendMessage({
    IsInFullscreen: document.fullscreenElement !== null,
  });
}

document.addEventListener("fullscreenchange", fullscreenCallback);
document.addEventListener("webkitfullscreenchange", fullscreenCallback);
