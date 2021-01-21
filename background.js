function sendMessage(text) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {data: text});
    });
}

function loadFrames() {
    sendMessage('load frames');
};

function toggleFrames() {
    sendMessage('toggle frames');
};

chrome.contextMenus.create({
    title: "Load Frames", 
    contexts:["selection"], 
    onclick: loadFrames()
});