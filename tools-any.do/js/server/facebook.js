define(["jquery", "constants"], function(c) {
	return {
		load: function(b) {
			FB._domain = {
				api: "https://api.facebook.com/",
				cdn: "https://s-static.ak.fbcdn.net/",
				www: "https://www.facebook.com/"
			};
			window.fbAsyncInit = function() {
				FB.init({
					appId: FACEBOOK_APP_ID,
					status: !0,
					cookie: !0,
					xfbml: !0
				});
				b(FB)
			};
			var a;
			document.getElementById("facebook-jssdk") ? b(FB) : (c("<div>").attr("id", "fb-root").appendTo(document.body), a = document.createElement("script"), a.id = "facebook-jssdk", a.async = !0, a.src = "http://connect.facebook.net/en_US/all.js", document.getElementsByTagName("head")[0].appendChild(a))
		}
	}
});