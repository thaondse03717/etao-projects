define(["jquery", "underscore", "backbone"], function(b, c, a) {
	a = (new(a.View.extend({
		tagName: "div",
		className: "loading",
		initialize: function() {
			c.bindAll(this, "show", "hide")
		},
		show: function() {},
		hide: function() {
			b(this.el).fadeOut()
		},
		render: function() {
			var a = b("<img>").attr("src", "images/loading.gif"),
				c = b("<div>").addClass("text").text("Loading..."),
				a = b("<div>").addClass("modal").append(a).append(c);
			b(this.el).hide().append(a);
			return this
		}
	}))).render();
	b(document.body).append(a.el);
	return {
		show: a.show,
		hide: a.hide
	}
});