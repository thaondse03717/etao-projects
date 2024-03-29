define(["jquery", "underscore", "backbone", "models/category", "constants"], function(f, a, d, e) {
	return d.Collection.extend({
		url: CATEGORIES_URL,
		model: e,
		initialize: function() {
			this.bind("remove", this.categoryRemoved);
			this.bind("add", this.categoryAdded)
		},
		categoryRemoved: function(c) {
			a.each(app.mainTaskWindow.tasks.getTasksInCategory(c.id), a.bind(function(b) {
				b.save({
					categoryId: this.getDefaultCategory().id
				})
			}, this))
		},
		categoryAdded: function() {},
		getDefaultCategory: function() {
			var c = null;
			a.each(this.models, function(b) {
				!0 === b.get("isDefault") && (c = b)
			});
			return c
		},
		getCategoryByName: function(c) {
			var b = null;
			a.each(this.models, function(a) {
				a.get("name") == c && (b = a)
			});
			return b
		}
	})
});