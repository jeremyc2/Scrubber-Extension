function sendMessage(text) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {data: text});
    });
}

document.getElementById("lf").onclick = () => sendMessage('load frames');
document.getElementById("sf").onclick = () => sendMessage('show frames');
document.getElementById("hf").onclick = () => sendMessage('hide frames');