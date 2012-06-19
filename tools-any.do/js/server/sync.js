var methodMap = {
	create: "POST",
	update: "PUT",
	"delete": "DELETE",
	read: "GET"
},
	cachedAttributes = {
		listPositionByCategory: !0,
		listPositionByDueDate: !0,
		listPositionByPriority: !0,
		categoryCollapsed: !0
	},
	volatileAttributes = {
		taskExpanded: !0
	};
define("jquery,underscore,backbone,constants,base64,server/auth".split(","), function(l, m, g, n, h, i) {
	function k() {
		for (var b = "", a = 0; a < 16; a++) b = b + String.fromCharCode(Math.random() * 256);
		return h.encodeBase64(b).replace(/\//g, "_").replace(/\+/g, "-")
	}

	function d(b, a, d) {
		var c = typeof a.url == "string" ? a.url : a.url(),
			j = true,
			c = m.extend({
				type: methodMap[b],
				dataType: "json",
				url: c + "?responseType=flat&includeDeleted=false&includeDone=false",
				xhrFields: {
					withCredentials: true
				},
				crossDomain: true
			}, d);
		if (a && (b == "create" || b == "update")) {
			c.contentType = "application/json";
			if (b == "create") {
				var e = k();
				a.set({
					id: e
				})
			}
			e = a.toJSON();
			b == "update" && (j = false);
			for (var f in e) cachedAttributes[f] ? localStorage.setItem(a.get("id") + ":" + f, JSON.stringify(a.get(f))) : a.get(f) != a.previous(f) && b == "update" && f != "id" && !volatileAttributes[f] && (j = true);
			c.data = b == "create" ? JSON.stringify([e]) : JSON.stringify(e)
		}
		if (j) {
			var g = c.success;
			c.success = function(a, c, f) {
				var d = function(a) {
					if (a) for (var b in cachedAttributes) typeof a[b] == "undefined" && (a[b] = JSON.parse(localStorage.getItem(a.id + ":" + b)))
				};
				if (a instanceof Array) if (b == "create") {
					a = a[0];
					d(a)
				} else for (var e = 0; e < a.length; e++) d(a[e]);
				else d(a);
				return g(a, c, f)
			};
			var h = c.error;
			c.error = function(a, b, c) {
				b == "parsererror" ? i.logInUsingStoredCredentials(function() {
					typeof chrome != "undefined" && chrome.extension.sendRequest({
						action: "refresh"
					})
				}, function() {
					i.logOut()
				}) : b == 409 ? i.logOut() : h(a, b, c)
			};
			return l.ajax(c)
		}
		d.success()
	}
	g.sync = d;
	return {
		sync: d,
		createGlobalId: k
	}
});