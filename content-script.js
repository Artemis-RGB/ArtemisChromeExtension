function fullscreenCallback() {
  chrome.runtime.sendMessage(
    "setFullscreen",
    document.fullscreenElement !== null
  );
}

document.addEventListener("fullscreenchange", fullscreenCallback);
document.addEventListener("webkitfullscreenchange", fullscreenCallback);
