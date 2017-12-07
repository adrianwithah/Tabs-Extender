var trackWindowPrefix = "track-window-";

chrome.commands.onCommand.addListener(function(command) {
  if (command == "flush-tab-right") {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      var currentTab = tabs[0];
      chrome.tabs.move(currentTab.id, {index: -1});
    });
  }
});

chrome.windows.onRemoved.addListener(function(windowId) {
  var trackWindowString = trackWindowPrefix + windowId.toString();
  chrome.storage.local.remove(trackWindowString);
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  chrome.windows.getCurrent(function(window) {
    var trackWindowString = trackWindowPrefix + window.id.toString();
    if (request.action == "track-tab") {
      handleTrackTab(trackWindowString, sender.tab.id);
      return;
    }
    if (request.action == "switch-tab") {
      handleSwitchTab(trackWindowString, sender.tab.id);
    }
  });
});

function handleTrackTab(trackWindowString, tabIdToTrack) {
  var trackJSON = {};
  trackJSON[trackWindowString] = {
    tracked : tabIdToTrack
  };
  chrome.storage.local.set(trackJSON);
  return;
}

function handleSwitchTab(trackWindowString, activeTabId) {
  chrome.storage.local.get(trackWindowString, function(getJSON) {
    var trackedTabId = parseInt(getJSON[trackWindowString].tracked);
    if (activeTabId != trackedTabId) {
      getJSON[trackWindowString].from = activeTabId;
      chrome.storage.local.set(getJSON);
      chrome.tabs.update(trackedTabId, {active: true});
      return;
    }
    if (getJSON[trackWindowString].hasOwnProperty("from")) {
      var fromTabId = parseInt(getJSON[trackWindowString].from);
      chrome.tabs.update(fromTabId, {active: true});
    }
  });
}
