chrome.commands.onCommand.addListener(function(command) {
  if (command == "flush-tab-right") {
    var numTabs;
    // chrome.tabs.query({currentWindow: true}, function(tabs) {
    //   numTabs = tabs.length;
    // });
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      var currentTab = tabs[0];
      chrome.tabs.move(currentTab.id, {index: -1});
    });
  }
})

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action == "track-tab") {
    sessionStorage.setItem("trackedTabId", sender.tab.id);
  } else if (request.action == "switch-tab") {
    var trackedTabId = parseInt(sessionStorage.getItem("trackedTabId"));
    chrome.tabs.update(trackedTabId, {active: true});
  }
});
