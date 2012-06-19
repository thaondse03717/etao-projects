define(["jquery", "underscore", "backbone", "constants", "text!templates/folder_options.html"], function(a, d, g, i, h) {
	return g.View.extend({
		tagName: "div",
		className: "folders-chooser",
		events: {
			"click .text": "itemClick",
			"click .delete-button": "deleteCategory",
			"click .edit-button": "editCategory",
			"keydown .new-folder": "newFolderEntered",
			"keydown .edit-box": "editBoxEntered",
			"click .popover-background": "leave"
		},
		initialize: function() {
			d.bindAll(this, "leave", "itemClick", "selectAndClose", "selectListViewItem", "close", "render");
			this.categories = this.options.app.categories;
			this.categories.bind("add", this.render);
			this.categories.bind("destroy", this.render)
		},
		render: function() {
			var b = [];
			if (this.options.target.length) if (0 == a(this.options.target).offset().left && 0 == a(this.options.target).offset().top) this.remove();
			else {
				d.each(this.categories.models, function(a) {
					var d = a.get("name"),
						c = !0;
					a.get("isDefault") && (c = !1);
					b.push({
						id: a.id,
						text: d,
						selected: a.id == this.options.selectedItem,
						canBeDeleted: c
					})
				}, this);
				var c = d.template(h, {
					categories: b
				});
				a(this.el).html(c);
				a(document.body).append(this.el);
				var c = a(this.options.target).offset().left + a(this.options.target).width() / 2,
					e = a(this.options.target).offset().top + a(this.options.target).height() / 2;
				this.popoverWindow = a(this.el).find(".popover-window");
				this.popoverAnchor = this.popoverWindow.find(".popover-anchor");
				var f = !1;
				10 > e - this.popoverWindow.height() && (f = !0);
				this.popoverWindow.css("left", c - this.popoverWindow.find("ul").width() / 2 - 2);
				this.popoverAnchor.css("left", this.popoverWindow.find("ul").width() / 2 - 2);
				f ? (this.popoverAnchor.removeClass("popover-anchor-top").addClass("popover-anchor-bottom"), this.popoverWindow.css("top", e + 5), this.popoverAnchor.css("top", -9)) : (this.popoverAnchor.removeClass("popover-anchor-bottom").addClass("popover-anchor-top"), this.popoverWindow.css("top", e - this.popoverWindow.height() - 20), this.popoverAnchor.css("top", this.popoverWindow.height() - 7));
				this.first = this.popoverWindow.find("li:first");
				this.last = this.popoverWindow.find("li:last");
				this.selectedItem = this.popoverWindow.find(".selected");
				this.selectedItem.focus();
				this.selectListViewItem();
				return this
			} else this.remove()
		},
		itemClick: function(b) {
			this.stopEditing();
			this.selectedItem = a(b.target);
			this.selectListViewItem();
			a(this.el).fadeOut("fast", this.selectAndClose)
		},
		deleteCategory: function(b) {
			this.categories.get(a(b.target).parent().data("id")).destroy()
		},
		editCategory: function(b) {
			b = a(b.target).parent("li");
			this.currentlyEditing = !0;
			this.editingText = b.find(".text");
			this.editingInput = b.find(".edit-box");
			this.editingCategory = b.data("id");
			this.startEditing()
		},
		startEditing: function() {
			this.editingText.hide();
			this.editingInput.show();
			this.editingInput.focus()
		},
		stopEditing: function() {
			this.currentlyEditing && (this.currentlyEditing = !1, this.editingText.text() != this.editingInput.val() && (this.categories.get(this.editingCategory).save({
				name: this.editingInput.val()
			}), this.editingText.text(this.editingInput.val())), this.editingText.show(), this.editingInput.hide())
		},
		editBoxEntered: function(a) {
			switch (a.keyCode) {
			case 13:
				this.stopEditing();
				break;
			case 27:
				this.editingInput.val(this.editingText.text()), this.stopEditing()
			}
		},
		selectAndClose: function() {
			this.stopEditing();
			this.selectedItem.parent().data("id") == this.model.id ? this.options.callback() : this.model.collection.dropTaskIntoCategory(VIEW_BY_CATEGORY, this.model, this.selectedItem.parent().data("id"));
			this.remove()
		},
		leave: function() {
			a(this.el).fadeOut("fast", this.close);
			this.options.callback()
		},
		close: function() {
			this.categories.unbind("add", this.render);
			this.categories.unbind("destroy", this.render);
			this.stopEditing();
			this.remove()
		},
		newFolderEntered: function(b) {
			switch (b.keyCode) {
			case 13:
				b = a(this.el).find(".new-folder").val();
				if (this.categories.getCategoryByName(b)) break;
				b = this.categories.create({
					name: b
				});
				a(this.el).find(".new-folder").val("");
				this.options.model.save({
					categoryId: b.id
				});
				this.render();
				break;
			case 27:
				this.leave()
			}
		},
		selectListViewItem: function() {
			a(this.el).children().removeClass("selected");
			this.selectedItem.find(".delete-button").addClass("selected")
		}
	})
});