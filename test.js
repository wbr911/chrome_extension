chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
    appendTextToBody(request.sel_text);
  });

function appendTextToBody(text) {
  chrome.tabs.getSelected(null, function(tab) {
    chrome.tabs.executeScript(tab.id, {"code" : '$("body").append("Test : "'+text+');'}) ;
  });
}

function check(tab_id, data, tab){
   // if(tab.url.indexOf("google") > -1){
        chrome.pageAction.show(tab_id);
  //  }
};
chrome.tabs.onUpdated.addListener(check);