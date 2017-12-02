document.addEventListener("keydown", onKeyDown);
document.addEventListener("keyup", onKeyUp);

var ctrlKeyDown = false;
function onKeyDown(event) {
  if (event.which == 17) {
    ctrlKeyDown = true;
  }
  if (event.which == 192) {
    if (ctrlKeyDown) {
      //send request to background page to store tab index.
      chrome.runtime.sendMessage({action: "track-tab"});
      return;
    }
    //send request to background page to switch tabs.
    chrome.runtime.sendMessage({action: "switch-tab"});
  }
}

function onKeyUp(event) {
  if (event.which == 17) {
    ctrlKeyDown = false;
  }
}
