define(["jquery", "underscore", "backbone"], function(b, c, a) {
	return a.Model.extend({
		defaults: function() {
			return {
				name: null,
				listPosition: null,
				"default": !1
			}
		},
		initialize: function() {}
	})
});