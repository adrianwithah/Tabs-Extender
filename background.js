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
