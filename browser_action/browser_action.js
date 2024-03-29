// Scripts order
// pop_up_utils
// d3.min (d3 visualization library)
// visualization
// * browser_action.js

// This is the starting point for the 'main' action
// We first get the active tab when the the browser_action button is clicked
// BUG: There is a bug where changing the width of the popup window in the first 200ms triggers
// strange behavior

getActiveTab(activeTab => {
    // Once we've recieved the tab, we can then ask the background task for the tab's tree

    chrome.runtime.sendMessage({
            from: sender,
            action: 'get-tree',
            data: {
                tab: activeTab
            }
        },
        (getTreeResponse) => {


        });

    close();

});
