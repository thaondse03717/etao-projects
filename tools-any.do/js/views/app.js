define("jquery,underscore,backbone,libs/jquery/jquery.caret.1.02,windows/loginwindow,windows/forgotwindow,windows/newuserwindow,windows/registerwindow,windows/taskwindow,collections/task,collections/category,server/auth,server/sync,views/loading,config/user,config/global,less".split(","), function(a, b, d, n, e, f, g, h, i, j, k, c, o, p, l, m) {
	return d.View.extend({
		el: a("#app"),
		initialize: function() {
			this.windowContainer = a(this.el).find(".window-container");
			this.tasks = new j([], {
				app: this
			});
			this.categories = new k;
			this.mainLoginWindow = (new e({
				app: this
			})).render();
			this.mainRegisterWindow = (new h({
				app: this
			})).render();
			this.mainNewUserWindow = (new g({
				app: this
			})).render();
			this.mainForgotWindow = (new f({
				app: this
			})).render();
			a(this.mainRegisterWindow.el).appendTo(this.windowContainer);
			a(this.mainNewUserWindow.el).appendTo(this.windowContainer);
			a(this.mainLoginWindow.el).appendTo(this.windowContainer);
			a(this.mainForgotWindow.el).appendTo(this.windowContainer);
			this.userConfig = null;
			this.globalConfig = new m;
			b.bindAll(this, "resize", "showTaskList");
			this.resize();
			a(window).on("resize", this.resize);
			a(window).scroll(function() {
				window.scrollTo(0, a(window).scrollLeft())
			});
			c.loggedIn(b.bind(function() {
				this.showTaskList()
			}, this), b.bind(function() {
				this.mainRegisterWindow.show()
			}, this));
			if (typeof chrome != "undefined") {
				chrome.extension.onRequest.addListener(b.bind(function(a) {
					switch (a.action) {
					case "refreshTab":
						this.mainTaskWindow && this.mainTaskWindow.tasks.fetch();
						break;
					case "facebookConnectComplete":
						this.mainTaskWindow || this.showTaskList();
						break;
					case "logOut":
						c.logOut()
					}
				}, this));
				this.popOutMode() || chrome.extension.sendRequest({
					action: "closePopup"
				})
			}
		},
		popOutMode: function() {
			return document.location.hash == "#popup"
		},
		showTaskList: function() {
			this.userConfig = new l(this.userId);
			this.mainLoginWindow.hide();
			this.mainRegisterWindow.hide();
			this.mainForgotWindow.hide();
			this.mainNewUserWindow.hide();
			this.mainTaskWindow = (new i({
				app: this
			})).render();
			a(this.mainTaskWindow.el).appendTo(this.windowContainer);
			this.mainTaskWindow.show();
			typeof chrome != "undefined" ? chrome.extension.sendRequest({
				action: "logIn"
			}) : console.log("Implement me!")
		},
		resize: function() {
			if (chrome) {
				a(window).off("resize", this.resize);
				window.resizeTo(286, window.outerHeight);
				a(window).on("resize", this.resize)
			}
		},
		validName: function(a) {
			return a.length >= 3
		},
		validEmail: function(a) {
			return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(a)
		},
		validPassword: function(a) {
			return a.length >= 6
		},
		refreshBackground: function() {
			typeof chrome != "undefined" ? chrome.extension.sendRequest({
				action: "refresh"
			}) : console.log("Implement me!")
		},
		checkReminders: function() {
			typeof chrome != "undefined" ? chrome.extension.sendRequest({
				action: "refresh"
			}) : console.log("Implement me!")
		},
		updateBadge: function(a) {
			typeof chrome != "undefined" ? chrome.extension.sendRequest({
				action: "updateBadge",
				numTasks: a
			}) : console.log("Implement me!")
		},
		trackClick: function(a) {
			typeof chrome != "undefined" ? chrome.extension.sendRequest({
				action: "track",
				track: a
			}) : console.log("Implement me!")
		}
	})
});