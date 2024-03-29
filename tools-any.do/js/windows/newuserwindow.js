define("jquery,underscore,backbone,helpers/view,windows/window,server/auth,text!templates/newuserwindow.html".split(","), function(a, d, i, c, g, f, h) {
	return g.extend({
		className: "window form-window",
		events: {
			"submit form": "register",
			"click .register": "register",
			"click .back": "back",
			"click .already": "alreadyMember",
			"keypress .name": "goToName",
			"keypress .email": "goToPassword",
			"keypress .password": "goToLogin"
		},
		initialize: function(b) {
			this.constructor.__super__.initialize.apply(this, [b]);
			d.bindAll(this, "register")
		},
		goToName: function(b) {
			b.keyCode == 13 && a(this.el).find(".email").focus()
		},
		goToPassword: function(b) {
			b.keyCode == 13 && a(this.el).find(".password").focus()
		},
		goToLogin: function(b) {
			b.keyCode == 13 && this.login()
		},
		render: function() {
			a(this.el).html(h);
			this.nameField = a(this.el).find(".name");
			this.emailField = a(this.el).find(".email");
			this.passwordField = a(this.el).find(".password");
			return this
		},
		register: function() {
			this.options.app.trackClick("newuserwindow-login");
			var b = this.nameField.val(),
				a = this.emailField.val(),
				e = this.passwordField.val();
			if (this.options.app.validName(b)) if (this.options.app.validEmail(a)) {
				if (this.options.app.validPassword(e)) {
					f.createUser(b, a, e, a, d.bind(function() {
						f.logIn(a, e, d.bind(function() {
							this.options.app.showTaskList();
							f.saveCredentials(a, e)
						}, this), d.bind(function() {
							c.shake(this.passwordField)
						}, this))
					}, this), d.bind(function(a) {
						a.status == 401 ? c.shake(this.passwordField) : a.status == 409 ? c.shake(this.emailField) : alert("We couldn't create a user for you. Please try again.")
					}, this));
					return false
				}
				c.shake(this.passwordField)
			} else c.shake(this.emailField);
			else c.shake(this.nameField)
		},
		alreadyMember: function() {
			this.options.app.trackClick("newuserwindow-alreadyMember");
			a(this.el).hide();
			this.options.app.mainLoginWindow.show()
		}
	})
});