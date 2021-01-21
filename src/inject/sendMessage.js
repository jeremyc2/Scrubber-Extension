function sendMessage(text) {
    chrome.runtime.sendMessage({data: text});
}

document.getElementById("lf").onclick = () => sendMessage('load frames');
document.getElementById("sf").onclick = () => sendMessage('show frames');
document.getElementById("hf").onclick = () => sendMessage('hide frames');