function sendMessage(text) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {data: text});
    });
}

document.getElementById("load-frames").onclick = function() {
    sendMessage('load frames');
};

document.getElementById("toggle-frames").onclick = function() {
    sendMessage('toggle frames');
};