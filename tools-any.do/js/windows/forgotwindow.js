define("jquery,underscore,backbone,windows/window,server/auth,helpers/view,text!templates/forgotwindow.html".split(","), function(a, d, i, e, f, g, h) {
	return e.extend({
		className: "window form-window",
		events: {
			"click .back": "back",
			"click button": "remindMe"
		},
		render: function() {
			a(this.el).html(h);
			return this
		},
		remindMe: function() {
			this.options.app.trackClick("forgotwindow-remindMe");
			var b = a(this.el).find("input"),
				c = b.val();
			c ? f.remindMe(c, d.bind(function() {
				this.back()
			}, this)) : g.shake(b)
		}
	})
});