define(["jquery", "underscore", "backbone", "helpers/view"], function(a, b, c, d) {
	return c.View.extend({
		tagName: "div",
		show: function() {
			a(".window.visible").length ? (a(this.el).addClass("visible"), setTimeout(b.bind(function() {
				a("input").blur();
				a(this.el).find("input:first").focus()
			}, this), 10)) : d.addClassNoTransition(a(this.el), "visible")
		},
		hide: function() {
			a(this.el).removeClass("visible")
		},
		back: function() {
			this.hide()
		}
	})
});