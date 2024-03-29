define(["jquery", "underscore", "backbone", "constants", "models/task"], function(b, c, d) {
	return d.View.extend({
		tagName: "ul",
		className: "notes",
		events: {
			"keypress input": "keypress",
			"click input": "cancel",
			"click img": "cancel"
		},
		initialize: function() {
			c.bindAll(this, "addNoteView", "removeNoteView", "update", "addAllNotes", "render", "toggle", "focus");
			this.parentTaskView = this.options.parentTaskView;
			this.parentModel = this.parentTaskView.model;
			this.tasks = this.parentModel.collection;
			this.tasks.bind("add", this.addNoteView);
			this.expanded = !1
		},
		addAllNotes: function() {
			c.each(this.tasks.getNotes(this.parentModel), this.addNoteView);
			this.update()
		},
		addNoteView: function(a) {
			a.get("parentGlobalTaskId") == this.parentModel.get("id") && (a = this.parentTaskView.options.category.addTaskView(a, !1), a.options.parentTaskView = this.parentTaskView, this.noteContainer.append(a.el), a.render(), this.update(), this.focus())
		},
		removeNoteView: function(a) {
			a.get("status") != TaskStatus.DELETED || a.get("parentGlobalTaskId") != this.parentModel.get("id") || this.update()
		},
		addNoteViewToContainer: function(a) {
			this.noteContainer.append(a.el)
		},
		render: function() {
			b(this.el).hide();
			this.noteContainer = b("<ul>");
			var a = b("<li>").addClass("add-note");
			a.append(b("<img>").attr("src", "/images/plus_icon.png"));
			a.append(b("<input>").attr("placeholder", "Add a new note"));
			b(this.el).append(this.noteContainer);
			b(this.el).append(a);
			this.newNoteInput = b(this.el).find("input");
			this.addAllNotes();
			return this
		},
		update: function() {
			this.expanded ? b(this.el).show() : b(this.el).hide();
			this.options.parentTaskView.update()
		},
		toggle: function() {
			this.expanded = !this.expanded;
			this.update();
			setTimeout(this.focus, 200)
		},
		focus: function() {
			b("input").blur();
			this.newNoteInput.focus()
		},
		keypress: function(a) {
			if (13 == a.keyCode) {
				a = this.newNoteInput.val();
				if ("" == a) return;
				this.newNoteInput.val("");
				this.addNote(a);
				return !1
			}
			return !0
		},
		cancel: function() {
			return !1
		},
		addNote: function(a) {
			this.tasks.create({
				parentGlobalTaskId: this.parentModel.id,
				title: a,
				categoryId: this.parentModel.get("categoryId")
			})
		}
	})
});