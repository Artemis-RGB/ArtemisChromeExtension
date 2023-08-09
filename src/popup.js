document.addEventListener("DOMContentLoaded", function () {
  const portInput = document.getElementById("port");
  const saveButton = document.getElementById("saveButton");

  // Load saved settings on popup open
  chrome.runtime.sendMessage({ type: "getSettings" }, function (response) {
    portInput.value = (response ? response.port : null) || 9696;
  });

  // Save settings when the Save button is clicked
  saveButton.addEventListener("click", function () {
    const port = parseInt(portInput.value);
    // Send the new settings to the service worker
    const message = { type: "updateSettings", settings: { port: port } };
    chrome.runtime.sendMessage(message, function (response) {
      console.log("Message sent to service worker:", response);
    });
  });
});
