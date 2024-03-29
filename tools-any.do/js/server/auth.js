define(["jquery", "underscore", "constants"], function(e, f) {
	return {
		createUser: function(a, b, c, d, g, f) {
			e.ajax({
				url: USER_URL,
				type: "post",
				dataType: "json",
				contentType: "application/json",
				xhrFields: {
					withCredentials: !0
				},
				crossDomain: !0,
				data: JSON.stringify({
					name: a,
					username: b,
					password: c,
					emails: [d],
					phoneNumbers: []
				}),
				success: g,
				error: f
			})
		},
		remindMe: function(a, b, c) {
			e.ajax({
				url: FORGOT_URL,
				type: "post",
				xhrFields: {
					withCredentials: !0
				},
				crossDomain: !0,
				data: {
					email: a
				},
				success: b,
				error: c
			})
		},
		logIn: function(a, b, c, d) {
			e.ajax({
				url: LOGIN_URL,
				type: "post",
				xhrFields: {
					withCredentials: !0
				},
				crossDomain: !0,
				data: {
					j_username: a,
					j_password: b,
					_spring_security_remember_me: "on"
				},
				success: c,
				error: function(a) {
					0 == a.status ? c(a) : d(a)
				}
			})
		},
		getFacebookAccessToken: function() {
			return localStorage.getItem("access_token")
		},
		saveFacebookAccessToken: function(a) {
			localStorage.setItem("access_token", a)
		},
		logInWithFacebook: function(a, b, c) {
			e.ajax({
				url: FACEBOOK_URL,
				type: "post",
				xhrFields: {
					withCredentials: !0
				},
				crossDomain: !0,
				data: {
					access_token: a,
					_spring_security_remember_me: "on"
				},
				success: f.bind(function(a) {
					b(a)
				}, this),
				error: f.bind(function(a) {
					0 == a.status ? b(a) : c(a)
				}, this)
			})
		},
		logOut: function() {
			"undefined" != typeof chrome ? chrome.extension.sendRequest({
				action: "logOut"
			}, function() {
				document.location.href = ""
			}) : (localStorage.clear(), document.location.href = "")
		},
		logInUsingStoredCredentials: function(a, b) {
			if (localStorage.getItem("access_token")) this.logInWithFacebook(this.getFacebookAccessToken(), a, b);
			else if (localStorage.getItem("username")) {
				var c = localStorage.getItem("username"),
					d = localStorage.getItem("password");
				this.logIn(c, d, a, b)
			} else b()
		},
		credentialsSaved: function() {
			return null != localStorage.getItem("username") || null != localStorage.getItem("access_token")
		},
		saveCredentials: function(a, b) {
			localStorage.setItem("username", a);
			localStorage.setItem("password", b)
		},
		loggedIn: function(a, b) {
			this.credentialsSaved() ? a() : b()
		},
		getUserName: function() {
			return localStorage.getItem("username")
		},
		facebookConnect: function(a, b) {
			this.getFacebookAccessToken() ? this.logInWithFacebook(this.getFacebookAccessToken(), a, b) : "undefined" != typeof chrome && this.facebookConnectChrome(a, b)
		},
		facebookConnectChrome: function() {
			window.open(FACEBOOK_OAUTH_URL, "facebook", "width=640,height=320")
		}
	}
});