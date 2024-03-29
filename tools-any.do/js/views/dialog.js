define(["jquery", "underscore", "backbone", "text!templates/dialog.html"], function(a, b, c, d) {
	return c.View.extend({
		tagName: "div",
		className: "dialog",
		events: {
			"click .yes": "yes",
			"click .no": "no",
			"click .popover-background": "no",
			"click .popover": "ignore"
		},
		initialize: function() {
			b.bindAll(this, "show", "hide", "yes", "no", "ignore")
		},
		ignore: function() {
			return !1
		},
		show: function() {
			a(this.el).fadeIn("fast");
			return this
		},
		hide: function() {
			a(this.el).fadeOut("fast");
			return this
		},
		render: function() {
			a(this.el).html(d).hide();
			a(this.el).find("h1").text(this.options.title);
			a(this.el).find("p").text(this.options.text);
			a(document.body).append(this.el);
			return this
		},
		yes: function() {
			this.options.yes && this.options.yes();
			a(this.el).fadeOut("fast", b.bind(this.remove, this))
		},
		no: function() {
			this.options.no && this.options.no();
			a(this.el).fadeOut("fast", b.bind(this.remove, this))
		}
	})
});