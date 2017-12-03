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
  sessionStorage.removeItem(trackWindowString);
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
  var newJSON = {};
  newJSON.tracked = tabIdToTrack;
  sessionStorage.setItem(trackWindowString, JSON.stringify(newJSON));
  return;
}

function handleSwitchTab(trackWindowString, activeTabId) {
  var getJSON = JSON.parse(sessionStorage.getItem(trackWindowString));
  var trackedTabId = parseInt(getJSON.tracked);
  if (activeTabId != trackedTabId) {
    getJSON.from = activeTabId;
    sessionStorage.setItem(trackWindowString, JSON.stringify(getJSON));
    chrome.tabs.update(trackedTabId, {active: true});
    return;
  }
  if (getJSON.hasOwnProperty("from")) {
    var fromTabId = parseInt(JSON.parse(sessionStorage.getItem(trackWindowString)).from);
    chrome.tabs.update(fromTabId, {active: true});
  }
}
