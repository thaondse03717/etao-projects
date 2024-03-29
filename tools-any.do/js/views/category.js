define("jquery,underscore,backbone,constants,models/category,views/task,helpers/view".split(","), function(b, c, j, m, k, l, f) {
	return j.View.extend({
		tagName: "ul",
		className: "category-container",
		model: k,
		events: {
			mouseenter: "enterCategory",
			mouseleave: "leaveCategory",
			"click .category": "toggleCategory",
			"click .quickadd-button": "quickAddTask",
			mouseover: "mouseOver"
		},
		initialize: function() {
			c.bindAll(this, "initialize", "newTaskAdded", "changedCategory", "changedPriority", "addAllTasks", "addAllTasksNoEffect", "updateTask", "getTaskViewByGlobalTaskId", "addTaskViewNoEffect", "addTaskView", "getTaskViewByIndex", "getCategoryDetailsString", "getUncheckedTaskCount", "updateTaskCounter", "updateText", "quickAddTask", "render", "toggleCategory", "addTaskViewToContainer", "mouseOver", "dragDropEnter", "dragDropLeave", "reset", "remove");
			if (typeof this.model != "function") {
				this.model.bind("change", this.updateText);
				this.model.bind("destroy", this.remove)
			}
			this.tasks = this.options.taskWindow.tasks;
			this.taskViewById = {};
			this.taskWindow = this.options.taskWindow;
			this.tasks.bind("add", this.newTaskAdded);
			this.tasks.bind("change", this.updateTask);
			this.tasks.bind("reset", this.addAllTasksNoEffect)
		},
		newTaskAdded: function(a) {
			a.get("parentGlobalTaskId") || this.addAllTasks()
		},
		changedCategory: function(a) {
			this.taskWindow.userConfig.getView() != VIEW_BY_CATEGORY || a.get("parentGlobalTaskId") || this.addAllTasks()
		},
		changedPriority: function(a) {
			this.taskWindow.userConfig.getView() != VIEW_BY_PRIORITY || a.get("parentGlobalTaskId") || this.addAllTasks()
		},
		reset: function() {
			for (var a in this.taskViews) {
				this.taskViews[a].unbind();
				this.taskViews[a].remove();
				delete this.taskViews[a]
			}
			this.taskViews = [];
			this.taskContainer.empty()
		},
		addAllTasksNoEffect: function() {
			this.reset();
			var a;
			a = this.tasks.getTopLevelTasksInACategory(this.taskWindow.userConfig.getView(), this.getCategoryId());
			c.each(a, this.addTaskViewNoEffect);
			this.updateText()
		},
		addAllTasks: function() {
			this.reset();
			var a;
			a = this.tasks.getTopLevelTasksInACategory(this.taskWindow.userConfig.getView(), this.getCategoryId());
			c.each(a, this.addTaskView);
			this.updateText()
		},
		removeTaskView: function(a) {
			var b = this.taskViewById[a.cid];
			if (b) {
				b.remove();
				delete this.taskViewById[a.cid]
			}
		},
		updateTask: function(a) {
			this.updateTaskCounter();
			switch (this.taskWindow.userConfig.getView()) {
			case VIEW_BY_CATEGORY:
				if (this.model.id == null) return;
				if (this.model.id != a.get("categoryId")) {
					this.removeTaskView(a);
					return
				}
				break;
			case VIEW_BY_DUE_DATE:
				if (this.options.date != a.getMatchingDueDateCategory()) {
					this.removeTaskView(a);
					return
				}
				break;
			case VIEW_BY_PRIORITY:
				if (this.options.priority != a.get("priority")) {
					this.removeTaskView(a);
					return
				}
			}
			this.taskViewById[a.cid] == null && this.addTaskView(a)
		},
		getTaskViewByGlobalTaskId: function(a) {
			for (var b in this.taskViews) if (this.taskViews[b].model.get("id") == a) return this.taskViews[b]
		},
		addTaskViewNoEffect: function(a) {
			this.addTaskView(a, true)
		},
		addTaskView: function(a, b) {
			var c = !! a.get("parentGlobalTaskId");
			if (a.validStatus()) {
				var d = new l({
					model: a,
					taskWindow: this.options.taskWindow,
					app: this.options.app,
					category: this
				});
				if (c) return d;
				this.taskViewById[a.cid] = d;
				this.addTaskViewToContainer(d, b);
				d.render();
				this.updateTaskCounter();
				return d
			}
		},
		getTaskViewByIndex: function(a) {
			return this.taskViews[a]
		},
		getCategoryDetailsString: function(a, b) {
			return b ? "" : a > 1 ? "(" + a + " things)" : a == 1 ? "(1 thing)" : ""
		},
		getUncheckedTaskCount: function() {
			var a = 0;
			c.each(this.getCategoryTasks(), function(b) {
				b.get("status") == TaskStatus.UNCHECKED && a++
			});
			return a
		},
		updateTaskCounter: function() {
			this.categoryDetails.text(this.getCategoryDetailsString(this.getUncheckedTaskCount(), this.getExpanded()))
		},
		updateText: function() {
			this.options.date ? this.category.text(DATE_MAP[this.options.date]) : this.options.priority ? this.category.text(PRIORITY_MAP[this.options.priority]) : this.category.text(this.model.get("name"));
			this.updateTaskCounter()
		},
		quickAddTask: function() {
			this.taskWindow.showTaskBox(this);
			this.getExpanded() || this.expandCategory();
			return false
		},
		render: function() {
			this.category = b("<div>").addClass("name");
			this.quickAddTaskButton = b("<div>").addClass("quickadd-button");
			this.categoryDetails = b("<div>").addClass("details");
			var a = b("<li>").addClass("category clearfix");
			a.append(this.category);
			a.append(this.quickAddTaskButton);
			a.append(this.categoryDetails);
			b(this.el).append(a);
			this.taskViews = [];
			this.taskContainer = b("<ul>");
			b(this.el).append(this.taskContainer);
			this.getExpanded() ? this.expandCategory() : this.collapseCategory();
			return this
		},
		toggleCategory: function() {
			this.getExpanded() ? this.collapseCategory() : this.expandCategory()
		},
		expandCategory: function() {
			this.hideTasks();
			this.taskContainer.slideDown("fast", c.bind(function() {
				this.animateEntrance()
			}, this));
			this.setExpanded(true);
			this.updateTaskCounter()
		},
		collapseCategory: function() {
			this.taskContainer.slideUp("fast");
			this.setExpanded(false);
			this.updateTaskCounter();
			c.each(this.getCategoryTasks(), function(a) {
				a.save({
					taskExpanded: false
				})
			})
		},
		getCategoryTasks: function() {
			switch (this.taskWindow.userConfig.getView()) {
			case VIEW_BY_CATEGORY:
				return this.model ? this.tasks.getTasksInCategory(this.model.id) : [];
			case VIEW_BY_DUE_DATE:
				return this.tasks.getTasksInDueDate(this.options.date);
			case VIEW_BY_PRIORITY:
				return this.tasks.getTasksInPriority(this.options.priority)
			}
		},
		hideTasks: function() {
			f.addClassNoTransition(this.taskContainer.find(".task"), "shifted")
		},
		animateEntrance: function() {
			this.hideTasks();
			this.taskContainer.children().each(function() {
				var a = this;
				setTimeout(function() {
					b(a).removeClass("shifted")
				}, (b(a).index() + 1) * 50)
			})
		},
		addTaskViewToContainer: function(a, c) {
			this.taskContainer.append(a.el);
			this.taskViews.push(a);
			if (c === void 0) {
				b(a.el).css("height", "0px");
				a.update()
			}
		},
		mouseOver: function() {
			return true
		},
		dragDropEnter: function(a, c) {
			b(this.el).addClass("drag-drop-hover");
			a || this.taskViews.length > 0 && (a = this.taskViews[0]);
			var h = b(this.taskWindow.dragDropTask.el).height();
			a ? b(this.el).find(".name").css("margin-bottom", b(a.el).height()) : b(this.el).find(".name").css("margin-bottom", h);
			for (var d = true, e = 0; e < this.taskViews.length; e++) {
				var i = b(this.taskViews[e].el),
					g;
				a && this.taskViews[e] == a && a.inTopPart && (d = false);
				g = d ? -1 * h + "px" : "0px";
				c ? i.css({
					top: g
				}) : f.changeCssNoTransition(i, {
					top: g
				});
				a && this.taskViews[e] == a && !a.inTopPart && (d = false)
			}
		},
		dragDropLeave: function() {
			b(this.el).removeClass("drag-drop-hover");
			b(this.el).find(".name").css("margin-bottom", 0);
			var a = b(this.el).find(".task");
			f.changeCssNoTransition(a, {
				top: ""
			})
		},
		enterCategory: function(a) {
			this.taskWindow.enterCategory(this, a)
		},
		leaveCategory: function(a) {
			this.taskWindow.leaveCategory(this, a)
		},
		getCategoryId: function() {
			return this.options.date ? this.options.date : this.options.priority ? this.options.priority : this.model.id
		},
		getExpanded: function() {
			var a = JSON.parse(localStorage.getItem("categoryExpanded:" + this.taskWindow.userConfig.getView() + ":" + this.getCategoryId()));
			return a === null ? true : a
		},
		setExpanded: function(a) {
			localStorage.setItem("categoryExpanded:" + this.taskWindow.userConfig.getView() + ":" + this.getCategoryId(), JSON.stringify(a))
		},
		remove: function() {
			this.reset();
			if (typeof this.model != "function") {
				this.model.unbind("change", this.updateText);
				this.model.unbind("destroy", this.remove)
			}
			this.tasks.unbind("add", this.newTaskAdded);
			this.tasks.unbind("change", this.updateTask);
			this.tasks.unbind("reset", this.addAllTasks);
			b(this.el).remove()
		}
	})
});