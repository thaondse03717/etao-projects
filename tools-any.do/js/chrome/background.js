var _gaq = _gaq || [];
_gaq.push(["_setAccount", "UA-28645272-1"]);
_gaq.push(["_trackPageview"]);
require("jquery,underscore,collections/task,collections/category,server/auth,server/sync,chrome/helpers,helpers/alert,constants".split(","), function(z, A, r, s, i, B, j, t) {
	function k() {
		e && t.popUpReminder(f, b)
	}

	function u() {
		function a(a, c, d) {
			b.create({
				title: a.linkUrl || a.selectionText || a.srcUrl || a.pageUrl,
				categoryId: f.getDefaultCategory().id,
				dueDate: b.generateDueDate(d)
			}, {
				success: function() {},
				error: function(a) {
					a.status == 409 ? alert("You must log in to Any.DO first.") : alert("There was an error with our servers... Please try again later. Error: " + a.status)
				}
			})
		}
		console.log("Background page: initializing context menu.");
		chrome.contextMenus.removeAll();
		var c = chrome.contextMenus.create({
			type: "normal",
			title: "Add To Any.DO",
			contexts: ["all"]
		});
		chrome.contextMenus.create({
			parentId: c,
			type: "normal",
			title: "Today",
			contexts: ["all"],
			onclick: function(c, b) {
				a(c, b, DATE_CATEGORY_TODAY)
			}
		});
		chrome.contextMenus.create({
			parentId: c,
			type: "normal",
			title: "Tomorrow",
			contexts: ["all"],
			onclick: function(c, b) {
				a(c, b, DATE_CATEGORY_TOMORROW)
			}
		});
		chrome.contextMenus.create({
			parentId: c,
			type: "normal",
			title: "This Week",
			contexts: ["all"],
			onclick: function(c, b) {
				a(c, b, DATE_CATEGORY_THIS_WEEK)
			}
		});
		chrome.contextMenus.create({
			parentId: c,
			type: "normal",
			title: "Later",
			contexts: ["all"],
			onclick: function(c, b) {
				a(c, b, DATE_CATEGORY_LATER)
			}
		})
	}

	function h(a) {
		e && (a === void 0 ? j.updateTaskCounter(b.getLeftTasks().length) : j.updateTaskCounter(a))
	}

	function l() {
		if (e) console.log("Initialization already done.");
		else {
			console.log("Background page: logging in.");
			u();
			b = new r;
			f = new s;
			b.bind("reset", function() {
				e = true;
				h();
				k()
			});
			f.fetch();
			b.fetch()
		}
	}

	function w(a) {
		setTimeout(function() {
			console.log("Recovering visibility... (toggling tab)");
			if (g[a.id] === void 0) {
				console.log("Tab not defined. Let's activate it. Man you click fast!");
				g[a.id] = true
			}
			g[a.id] && chrome.tabs.sendRequest(a.id, {
				action: "toggleTab",
				src: document.location.origin + "/index.html",
				hidden: m[a.id]
			})
		}, 1E3)
	}

	function x(a, c) {
		console.log("Injecting code...");
		chrome.tabs.executeScript(a.id, {
			file: "js/chrome/inject.js"
		}, function() {
			c()
		})
	}

	function y(a) {
		if (n[a.id]) {
			console.log("Toggling to code which was already injected");
			o(a)
		} else {
			n[a.id] = true;
			a.status == "complete" && chrome.tabs.executeScript(a.id, {
				file: "js/chrome/inject.js"
			}, function() {
				console.log("Toggling after script injected...");
				o(a)
			})
		}
	}

	function o(a) {
		console.log("Toggling tab...");
		g[a.id] = !g[a.id];
		chrome.tabs.sendRequest(a.id, {
			action: "toggleTab",
			src: document.location.origin + "/index.html",
			hidden: m[a.id]
		})
	}

	function p() {
		d == null ? q() : chrome.windows.get(d.id, function(a) {
			if (a) {
				console.log("Popup already exists, not opening a new one.");
				chrome.windows.update(d.id, {
					focused: true
				})
			} else q()
		})
	}

	function q() {
		chrome.windows.create({
			url: "/index.html#popup",
			width: 270,
			height: 600,
			focused: true,
			type: "panel"
		}, function(a) {
			d = a
		})
	}
	var b, f, n = {},
		g = {},
		m = {},
		d = null,
		e = false;
	OPEN_POPUP ? chrome.browserAction.setPopup({
		popup: "/index.html"
	}) : chrome.browserAction.onClicked.addListener(function(a) {
		console.log("Received click on tab", a);
		if (a.url.search(/^chrome/) >= 0) p();
		else {
			if (d) {
				chrome.windows.remove(d.id);
				d = null
			}
			y(a)
		}
	});
	chrome.tabs.onActiveChanged.addListener(function(a) {
		chrome.tabs.sendRequest(a, {
			action: "refreshTab"
		})
	});
	chrome.extension.onRequest.addListener(function(a, c, v) {
		switch (a.action) {
		case "facebookConnectComplete":
			i.logInWithFacebook(a.access_token, function() {
				localStorage.setItem("access_token", a.access_token);
				l();
				OPEN_POPUP && chrome.tabs.create({
					url: "/help.html"
				});
				chrome.extension.sendRequest({
					action: "facebookConnectComplete",
					success: true
				})
			}, function() {
				alert("There was an error logging in with Facebook. Please try again.");
				localStorage.removeItem("access_token");
				chrome.tabs.getSelected(null, function(a) {
					chrome.tabs.sendRequest(a.id, {
						action: "facebookConnectComplete",
						success: false
					})
				})
			});
			break;
		case "logIn":
			l();
			break;
		case "logOut":
			e = false;
			localStorage.clear();
			console.log("Background page: logging out.");
			j.updateTaskCounter(0);
			chrome.contextMenus.removeAll();
			break;
		case "alert":
			switch (a.alert) {
			case "done":
				if (b) if (b.get(a.id)) {
					b.get(a.id).markAsChecked();
					chrome.extension.sendRequest({
						action: "refreshTab"
					})
				} else console.error("can't find task ID!");
				else console.error("Can't find the tasks collection!");
				break;
			case "snooze":
				b ? b.get(a.id).snoozeTask(6E4 * a.minutes) : console.error("Can't find the tasks collection!");
				break;
			case "dismiss":
				b.get(a.id).dismissAlert(function() {
					chrome.extension.sendRequest({
						action: "refreshTab"
					})
				})
			}
			h();
			break;
		case "refresh":
			k();
			h();
			break;
		case "track":
			console.log("Tracking event " + a.track);
			_gaq.push(["_trackEvent", a.track, "clicked"]);
			break;
		case "openPage":
			console.log("Opening extenal page " + a.url);
			chrome.tabs.create({
				url: a.url
			});
			break;
		case "updateBadge":
			h(a.numTasks);
			break;
		case "updateHiddenStatus":
			m[c.tab.id] = a.hidden;
			console.log("tab", c.tab.id, "tabsHidden[sender.tab.id]", a.hidden);
			break;
		case "popupWindow":
			p();
			break;
		case "closePopup":
			if (d) {
				chrome.windows.remove(d.id);
				d = null
			}
		}
		v()
	});
	chrome.tabs.onUpdated.addListener(function(a, c, b) {
		if (c.status == "complete" && b.url.search(/^chrome/) != 0 && n[b.id]) {
			console.log("on update completed and already inject and not a chrome page");
			x(b, function() {
				w(b)
			})
		}
	});
	(function() {
		var a = document.createElement("script");
		a.type = "text/javascript";
		a.async = true;
		a.src = "https://ssl.google-analytics.com/ga.js";
		var b = document.getElementsByTagName("script")[0];
		b.parentNode.insertBefore(a, b)
	})();
	window.onerror = function(a, b, d) {
		_gaq.push(["_trackEvent", "Exceptions", "Application", "[" + b + " (" + d + ")] " + a, null, true])
	};
	console.log("Setting up timers...");
	setInterval(function() {
		if (e) {
			f.fetch();
			b.fetch()
		}
	}, 18E5);
	setInterval(k, 6E4);
	console.log("Background page initialized successfully.");
	i.credentialsSaved() && i.logInUsingStoredCredentials(function() {
		l()
	}, function() {
		console.log("Can't log in for some reason.")
	})
});