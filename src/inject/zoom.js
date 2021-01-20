chrome.extension.sendMessage({}, function() {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

        window.location.href = document.querySelector("video").src;

	}
	}, 10);
});