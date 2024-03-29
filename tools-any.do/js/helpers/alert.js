define(["chrome/helpers"], function(g) {
	var f = {
		nextAlertTime: function(d) {
			var c = d.get("alert"),
				e = d.get("dueDate");
			d.get("status");
			return !c || "NONE" == c.type ? null : (e - c.offset - Date.now()) / 1E3
		},
		popUpReminder: function(d, c) {
			var e = c.getTopLevelTasks();
			console.log("pop up reminder for tasks", e);
			for (var h in e) {
				var b = e[h];
				if (b.get("status") != TaskStatus.UNCHECKED) break;
				var a = f.nextAlertTime(b);
				0 > a && -3600 < a ? (a = new Date(b.get("dueDate")), a = (10 > a.getHours() ? "0" : "") + a.getHours() + ":" + (10 > a.getMinutes() ? "0" : "") + a.getMinutes(), b = {
					id: b.id,
					category: d.get(b.get("categoryId")).get("name"),
					alertTime: a,
					title: b.get("title")
				}, "undefined" != typeof chrome && g.showAlert(b, function(a) {
					c.get(a).dismissAlert(function() {
						chrome.extension.sendRequest({
							action: "refreshTab"
						})
					})
				})) : console.log("Ignoring alert with secondsLeft", a)
			}
		}
	};
	return f
});