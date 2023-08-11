function fullscreenCallback() {
  chrome.runtime.sendMessage({
    type: "setFullscreen",
    body: document.fullscreenElement !== null,
  });
}

document.addEventListener("fullscreenchange", fullscreenCallback);
document.addEventListener("webkitfullscreenchange", fullscreenCallback);

console.log("[Artemis] Loaded!");
