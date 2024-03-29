define(["jquery", "underscore"], function() {
	var b = {};
	return {
		updateTaskCounter: function(a) {
			chrome.browserAction.setBadgeBackgroundColor({
				color: [225, 0, 0, 255]
			});
			a ? chrome.browserAction.setBadgeText({
				text: a.toString()
			}) : chrome.browserAction.setBadgeText({
				text: ""
			})
		},
		showAlert: function(a, c) {
			b[a.id] || (b[a.id] = webkitNotifications.createHTMLNotification("/js/chrome/notification.html#" + JSON.stringify(a)), b[a.id].onclose = function() {
				b[a.id] = null;
				c(a.id)
			});
			b[a.id].show()
		}
	}
});