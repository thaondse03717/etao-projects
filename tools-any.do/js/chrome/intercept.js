chrome.extension.sendRequest({
	action: "facebookConnectComplete",
	access_token: document.getElementById("access_token").innerText
}, function() {
	window.close()
});