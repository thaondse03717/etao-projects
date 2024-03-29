define("jquery,underscore,backbone,constants,server/auth,views/loading,helpers/view,windows/window,text!templates/registerwindow.html".split(","), function(d, a, h, i, e, b, f, c, g) {
	return c.extend({
		className: "window form-window",
		initialize: function() {
			a.bindAll(this)
		},
		events: {
			"click .already": "login",
			"click .fb-connect img": "facebookConnect",
			"click .register": "register"
		},
		render: function() {
			d(this.el).html(g);
			return this
		},
		login: function() {
			this.options.app.trackClick("registerwindow-login");
			this.options.app.mainLoginWindow.show()
		},
		facebookConnect: function() {
			this.options.app.trackClick("registerwindow-facebookConnect");
			var a = this.options.app,
				c = d(this.el).find(".fb-connect");
			b.show();
			e.facebookConnect(function() {
				b.hide();
				a.showTaskList()
			}, function() {
				b.hide();
				f.shake(c)
			})
		},
		register: function() {
			this.options.app.trackClick("registerwindow-register");
			this.options.app.mainNewUserWindow.show()
		}
	})
});