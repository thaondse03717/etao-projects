$mainfest = null;
{
	var req = new XMLHttpRequest();
	req.open("GET", chrome.extension.getURL("manifest.json"), false);
	req.send(null);
	if (req.readyState == 4) {
		$mainfest = JSON.parse(req.responseText);
	}
	req = null;
}