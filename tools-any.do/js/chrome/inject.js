var anydoActive = !1,
	anydoHidden = !0,
	anydoFrame = null,
	anydoButton = null,
	requestSource = null;

function createElements() {
	console.log("Creating elements...");
	anydoFrame = document.createElement("iframe");
	anydoFrame.className = "anydo";
	anydoFrame.style.width = "270px";
	anydoFrame.style.height = "100%";
	anydoFrame.style.zIndex = "2147483647";
	anydoFrame.style.position = "fixed";
	anydoFrame.style.top = "0";
	anydoFrame.style.right = "-270px";
	anydoFrame.style.display = "block";
	anydoFrame.style.boxShadow = "0 0 20px rgba(0, 0, 0, 0)";
	anydoFrame.style.border = "0";
	anydoFrame.style.webkitTransition = "right 0.3s ease-in-out, box-shadow 0.3s ease-in-out";
	document.body.appendChild(anydoFrame);
	anydoButton = document.createElement("div");
	anydoButton.className = "anydo";
	anydoButton.style.position = "fixed";
	anydoButton.style.width = "26px";
	anydoButton.style.height = "58px";
	anydoButton.style.zIndex = "2147483646";
	anydoButton.style.top = "55px";
	anydoButton.style.right = "0";
	anydoButton.style.webkitTransition = "right 0.3s ease-in-out, box-shadow 0.3s ease-in-out";
	anydoButton.style.cursor = "pointer";
	anydoButton.addEventListener("click", function() {
		toggleHidden();
		updateHidden()
	});
	document.body.appendChild(anydoButton)
}

function removeElements() {
	console.log("Removing elements...");
	document.body.removeChild(anydoFrame);
	document.body.removeChild(anydoButton);
	anydoHidden = !0;
	anydoButton = anydoFrame = null
}

function updateHidden() {
	anydoHidden ? (anydoFrame.style.right = "-270px", anydoFrame.style.boxShadow = "0 0 20px rgba(0, 0, 0, 0)", anydoButton.style.backgroundImage = "url(data:image/png;base64,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)", anydoButton.style.right = "0") : (anydoFrame.src = requestSource, setTimeout(function() {
		anydoFrame.style.right = "0";
		anydoFrame.style.boxShadow = "0 0 20px rgba(0, 0, 0, 0.5)";
		anydoButton.style.backgroundImage = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAA5CAYAAAAocjtWAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYxIDY0LjE0MDk0OSwgMjAxMC8xMi8wNy0xMDo1NzowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNS4xIFdpbmRvd3MiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QURDOURBOEY3OUFBMTFFMUE1MjE5NjJCRjZGQTMyQjMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QURDOURBOTA3OUFBMTFFMUE1MjE5NjJCRjZGQTMyQjMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpBREM5REE4RDc5QUExMUUxQTUyMTk2MkJGNkZBMzJCMyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpBREM5REE4RTc5QUExMUUxQTUyMTk2MkJGNkZBMzJCMyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PjJ9QHYAAAO/SURBVHja7JjPTxNBFMffzLRYDdiF8EN+KDXiQRKBozd6xJMm/gFg4tGEJhCDJ3sEQmIhXLhxlgsJCdGghih6MBglwYQfpsEENZooBaQ/tjuzvtnlxwItdNtd5OAkzdCG2c++N9/vm7dLdF2HkxgUTmh4Dv5ACHEU0Nvb24xZC3ncigABt3AKLXJf8KfGwHFQX19fO07hD7wkMK2WwAYHuMKSzoDw7v2Y8lACWOgFlCtvuB9U1BijGlDCgTBeGGhgYKBe07RwjPo6ZkgFzNJySKK+DIAQKDXUGk8DoXmmrr+/v1UIEV4VRcEZTx0CKvCizPzomCthAvALEF1IhdkDSQXhFPkE54OvPVUQpX7zrhlehlDzb2E6RgKI4NnlfQTk8Xd6LjRBL5oAxvaikJaQIJyJjEKQ432UZaOnn9PqlilaY969/BgQefdkG0TsGTYT5Am91PKeVSLAuw2huxFAjgY/EoSOHh9j9Qipwv/MACmkBFmM9wglGzQi2YXspMuhoipTJs03xTLtiYPVW7ocN19JMt9eumhhhT7b6g7pctMbzJydPo9k2qKkOJCkRaZXbCjLFohS2hIlJRYTOnM2HroK1jDF6nTXjnIUwl5EaRXJXBrKldQ5ti+5NyduimF/Hl0Uw4ENO8G+rgAY1dRT0EBmi6bYQ+F6GdY+viP3LJJPaZBIAaz8SkLazgm7MxpLffD29rWcI2gamoCotn2uYUeUe+rsmjbxx7JW5B7R4loc2sZmAbbWAZJxY/GhoaWNdG/GExAVxfvu8WiQisn2FhlHxTon8GxN/qjgdyWLwZGD/Rw7qxqKY5o5U4/nf2U4pZXhnzxaZjphV0pBzS8aS1N/LAi704+1eiI/k8qOKVdQT0/P3GX9TwyEyA9mZ4/qID5eA3HHIEeJIdwmvpplxs2Iuru7vzTytdEGse4YLKu88SE4dJd/jvlEKnMBdQqEolj3iXTwvraEMNnfCfcM29XVNVfNNxC2ECuTki8AdmxlMGDaRvCBNh9r0n/nDcupBEkYxDcD97Sl6TtiBYxU2hQIOfi+7ri3W4ODg50peiY8zaqUl/QCJIl3/3p58Gn7D74GsmW/qHZ2dg6KrVjgJl8NP+TzcEP8yCk62xFZx/DwcL009zIt6ZgktbBM/ECEljGigkA7Y2hoqBnXRd6xiuCkqIIY9hfMkkLHQBZgKz72jD4VlYFXajGkhe4OyJLS9oTuiUyoijKb8MJVlnAHJMfIyIhfVdXQN14UWkh7FddAVmAqlYqQk3rv/VeAAQAT46DTcWROiwAAAABJRU5ErkJggg==)";
		anydoButton.style.right = "270px"
	}, 100))
}

function toggleHidden() {
	null === anydoFrame ? console.log("toggleHidden called without frame!") : (anydoHidden = !anydoHidden, chrome.extension.sendRequest({
		action: "updateHiddenStatus",
		hidden: anydoHidden
	}))
}

function toggleActive(a) {
	console.log("Toggling... active?", anydoActive);
	anydoActive ? removeElements() : (createElements(), a || toggleHidden(), updateHidden());
	anydoActive = !anydoActive
}
chrome.extension.onRequest.addListener(function(a, b, c) {
	console.log(a, b);
	switch (a.action) {
	case "toggleTab":
		requestSource = a.src, toggleActive(a.hidden)
	}
	c()
});