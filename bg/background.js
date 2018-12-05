// Initialize a new HistreeStorage object when background process / chrome starts up
const histreeStorage = new HistreeStorage();
let image;

// This handles messages sent from inject.js or browser_action.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // Handles requests from browser_action.js

    chrome.tabs.captureVisibleTab(null,{format:"jpeg",quality:1},function(img) {
        //post message only after call back return with Data URL
        console.log(img);

        image = img;
    });
    if (request.from === 'browser_action') {
        if (request.action === 'get-tree') {

            chrome.tabs.sendMessage(request.data.tab.id, histreeStorage.getHistreeForTabId(request.data.tab.id));

            // return sendResponse();
        }
    }

});




// Listens for changes to tabs to see when pages are loaded
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        histreeStorage.insertNodeIntoTreeByTabId({
            url: tab.url,
            title: tab.title,
            favIconUrl: tab.favIconUrl
        }, tab.id);


        chrome.tabs.sendMessage(tabId, {'action': 'image', 'img':image});
    }
});


chrome.commands.onCommand.addListener(command => {
    chrome.tabs.query({active: true, currentWindow: true}, activeTabs => {
        const id = activeTabs[0].id;
        if(command == 'action') {

            chrome.tabs.sendMessage(id, histreeStorage.getHistreeForTabId(id));


        }
    });
});

chrome.runtime.onSuspend.addListener(request => {

    console.log("test");


});