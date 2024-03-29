define("jquery,underscore,backbone,server/auth,helpers/view,windows/window,text!templates/loginwindow.html".split(","), function(a, g, h, d, e, c, f) {
	return c.extend({
		className: "window form-window",
		events: {
			"click .login": "login",
			"click .back": "back",
			"click .already": "forgotMyPassword",
			"keypress .email": "goToPassword",
			"keypress .password": "goToLogin"
		},
		goToPassword: function(b) {
			b.keyCode == 13 && a(this.el).find(".password").focus()
		},
		goToLogin: function(b) {
			b.keyCode == 13 && this.login()
		},
		render: function() {
			a(this.el).html(f);
			this.emailField = a(this.el).find(".email");
			this.passwordField = a(this.el).find(".password");
			return this
		},
		login: function() {
			this.options.app.trackClick("loginwindow-login");
			var b = this.emailField.val(),
				a = this.passwordField.val(),
				c = this.passwordField;
			d.logIn(b, a, function() {
				d.saveCredentials(b, a);
				document.location.reload()
			}, function(a) {
				a.status == 401 ? e.shake(c) : alert("There was an unknown error while trying to log in, please try again later.")
			})
		},
		forgotMyPassword: function() {
			this.options.app.trackClick("loginwindow-forgotMyPassword");
			this.options.app.mainForgotWindow.show();
			a(this.options.app.mainForgotWindow.el).find("input").val(this.emailField.val())
		}
	})
});