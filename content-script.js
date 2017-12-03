document.addEventListener("keydown", onKeyDown);

function onKeyDown(event) {
  if (event.which == 192) {
    var nodeName = document.activeElement.nodeName.toLowerCase();
    if (document.activeElement.isContentEditable
      || 'input' === nodeName
      || 'textarea' === nodeName || 'select' === nodeName) {
      return;
    }
    if (event.ctrlKey) {
      chrome.runtime.sendMessage({action: "track-tab"});
      return;
    }
    chrome.runtime.sendMessage({action: "switch-tab"});
  }
}
