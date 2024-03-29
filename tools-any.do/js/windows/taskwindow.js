define("jquery,underscore,backbone,constants,views/autocomplete,views/category,views/contextmenu,windows/window,server/auth,chrome/helpers,text!templates/taskwindow.html".split(","), function(c, e, m, n, j, f, g, k, i, o, l) {
	return k.extend({
		className: "window",
		events: {
			"click .task-box-input a": "addTaskFromBar",
			"submit .add-item": "addTaskFromBar",
			"click #menu-date": "showByDate",
			"click #menu-folders": "showByFolders",
			"click #menu-priority": "showByPriority",
			"click #menu-done": "clearCompleted",
			"click #menu-user": "showUserMenu",
			"click #menu-pop-out": "popOut",
			mousemove: "mouseMove",
			"keypress .new-folder-input": "addFolderFromInput",
			mouseover: "mouseOver",
			mouseup: "mouseUp"
		},
		initialize: function() {
			e.bindAll(this, "resize", "addCategoryView", "addAllCategories", "update", "removeCategoryView", "resetCategoryViews", "resetTaskViews", "reset", "show", "updateTotalTasks", "addFolderFromInput");
			this.dragDropInProgress = false;
			this.dragDropGhostTaskElement = null;
			this.categories = this.options.app.categories;
			this.tasks = this.options.app.tasks;
			this.userConfig = this.options.app.userConfig;
			this.categories.bind("add", this.addCategoryView);
			this.categories.bind("change", this.update);
			this.categories.bind("remove", this.removeCategoryView);
			this.categories.bind("reset", this.resetCategoryViews);
			this.tasks.bind("reset", this.resetTaskViews);
			this.tasks.bind("add", this.updateTotalTasks);
			this.tasks.bind("change", this.updateTotalTasks);
			this.shouldAnimate = true;
			this.refresh()
		},
		refresh: function() {
			var a = {
				error: function(a) {
					a == 401 && i.logOut()
				}
			};
			this.categories.fetch(a);
			this.tasks.fetch(a)
		},
		scroll: function() {},
		updateTotalTasks: function() {
			this.options.app.updateBadge(this.tasks.getLeftTasks().length)
		},
		updateTotalTasksIcon: function() {
			var a = this.tasks.getLeftTasks().length;
			if (typeof chrome != "undefined") {
				var b = {},
					h = c("canvas").get(0),
					d = h.getContext("2d"),
					e = new Image;
				e.onload = function() {
					h.width = e.width;
					h.height = e.height;
					d.drawImage(e, 0, 0, 19, 19);
					if (a > 0) {
						d.beginPath();
						d.arc(10, 10, 5, 0, 2 * Math.PI, false);
						d.strokeStyle = "none";
						d.fillStyle = "#0099cc";
						d.fill();
						d.fillStyle = "#fff";
						d.font = "10px";
						d.textBaseline = "top";
						a < 10 ? d.fillText(a, 6, 3) : a >= 10 && a < 100 ? d.fillText(a, 3, 3) : d.fillText(99, 3, 3);
						d.stroke()
					}
					b.imageData = d.getImageData(0, 0, 19, 19);
					chrome.browserAction.setIcon(b)
				};
				e.src = "/icons/anydo-16.png"
			}
		},
		addFolderFromInput: function(a) {
			if (a.keyCode == 13) {
				a = this.newFolderInput.val();
				this.newFolderInput.val("");
				this.categories.getCategoryByName(a) || this.categories.create({
					isDefault: false,
					name: a
				})
			}
		},
		changeSortType: function(a, b) {
			this.taskWithFolderListOpen = null;
			if (this.userConfig.getView() != a || b) {
				this.userConfig.setView(a);
				this.addAllCategories();
				if (this.shouldAnimate) {
					this.animateCategories();
					this.shouldAnimate = false
				}
				c(this.el).find(".icon-folders").removeClass("selected");
				c(this.el).find(".icon-priority").removeClass("selected");
				c(this.el).find(".icon-date").removeClass("selected");
				switch (a) {
				case VIEW_BY_CATEGORY:
					c(this.el).find(".icon-folders").addClass("selected");
					this.newFolderInput.show();
					break;
				case VIEW_BY_DUE_DATE:
					c(this.el).find(".icon-date").addClass("selected");
					this.newFolderInput.hide();
					break;
				case VIEW_BY_PRIORITY:
					c(this.el).find(".icon-priority").addClass("selected");
					this.newFolderInput.hide()
				}
			} else {
				var e = false,
					d;
				for (d in this.categoryViews) if (this.categoryViews[d].getExpanded()) {
					e = true;
					break
				}
				for (d in this.categoryViews) e ? this.categoryViews[d].collapseCategory() : this.categoryViews[d].expandCategory()
			}
		},
		showByDate: function() {
			this.options.app.trackClick("taskwindow-showByDate");
			this.shouldAnimate = true;
			this.changeSortType(VIEW_BY_DUE_DATE)
		},
		showByFolders: function() {
			this.options.app.trackClick("taskwindow-showByFolders");
			this.shouldAnimate = true;
			this.changeSortType(VIEW_BY_CATEGORY)
		},
		showByPriority: function() {
			this.options.app.trackClick("taskwindow-showByPriority");
			this.shouldAnimate = true;
			this.changeSortType(VIEW_BY_PRIORITY)
		},
		animateCategories: function() {
			e.each(this.categoryViews, function(a) {
				a.animateEntrance()
			})
		},
		removeCategoryView: function(a) {
			this.userConfig.getView() == VIEW_BY_CATEGORY && delete this.categoryViews[a.id]
		},
		resetCategoryViews: function() {
			this.createDefaultCategories();
			this.resetTaskViews()
		},
		addFolderCategories: function() {
			this.categoryViews = {};
			e.each(this.categories.models, function(a) {
				var b = new f({
					model: a,
					taskWindow: this,
					app: this.options.app
				});
				this.taskWindow.append(b.el);
				b.render();
				b.addAllTasks();
				this.categoryViews[a.id] = b
			}, this)
		},
		addDateCategories: function() {
			this.categoryViews = {};
			for (var a in DATES) {
				var b = new f({
					date: DATES[a],
					taskWindow: this,
					app: this.options.app
				});
				this.taskWindow.append(b.el);
				b.render();
				b.addAllTasks();
				this.categoryViews[DATES[a]] = b
			}
		},
		addPriorityCategories: function() {
			this.categoryViews = {};
			for (var a in PRIORITIES) {
				var b = new f({
					priority: PRIORITIES[a],
					taskWindow: this,
					app: this.options.app
				});
				this.taskWindow.append(b.el);
				b.render();
				b.addAllTasks();
				this.categoryViews[PRIORITIES[a]] = b
			}
		},
		createDefaultCategories: function() {
			if (!this.categories.models.length) for (var a in DEFAULT_CATEGORIES) {
				var b = DEFAULT_CATEGORIES[a];
				this.categories.create({
					isDefault: b == DEFAULT_CATEGORY,
					name: b
				})
			}
		},
		reset: function() {
			for (var a in this.categoryViews) {
				this.categoryViews[a].remove();
				delete this.categoryViews[a]
			}
			this.categoryViews = {};
			this.taskWindow.empty()
		},
		addCategoryView: function(a) {
			if (this.userConfig.getView() == VIEW_BY_CATEGORY) {
				var b = new f({
					model: a,
					taskWindow: this,
					app: this.options.app
				});
				this.taskWindow.append(b.el);
				b.render();
				this.categoryViews[a.id] = b
			}
		},
		render: function() {
			c(this.el).html(l);
			this.taskWindow = c(this.el).find(".tasks");
			this.windowHeader = c(this.el).find("header")[0];
			this.taskBox = c(this.el).find(".task-box")[0];
			this.tasksWrapper = c(this.el).find(".tasks-wrapper");
			this.newFolderInput = c(this.el).find(".new-folder-input");
			this.reset();
			this.taskInput = new j({
				app: this.options.app,
				placeholder: "Insert a new task...",
				hideCallback: e.bind(this.hideTaskBox, this)
			});
			c(this.el).find(".add-item").append(this.taskInput.el);
			this.taskInput.render();
			this.options.app.popOutMode() && c(this.el).find("#menu-pop-out").remove();
			c(window).resize(this.resize);
			this.resize();
			return this
		},
		update: function() {},
		clearCompleted: function() {
			this.options.app.trackClick("taskwindow-clearCompleted");
			this.tasks.clearCompleted();
			this.addAllCategories()
		},
		resetTaskViews: function() {
			this.tasks.fixListPositions(this.categories.models);
			this.changeSortType(this.userConfig.getView(), true);
			this.updateTotalTasks()
		},
		addAllCategories: function() {
			this.reset();
			switch (this.userConfig.getView()) {
			case VIEW_BY_CATEGORY:
				this.addFolderCategories();
				break;
			case VIEW_BY_DUE_DATE:
				this.addDateCategories();
				break;
			case VIEW_BY_PRIORITY:
				this.addPriorityCategories()
			}
		},
		hideTaskBox: function() {
			c(this.taskBox).slideUp("fast");
			for (var a in this.categoryViews) this.categoryViewToAddTo != this.categoryViews[a] && c(this.categoryViews[a].el).animate({
				opacity: 1
			}, 200, function() {
				c(this).slideDown(300)
			})
		},
		showTaskBox: function(a) {
			this.categoryViewToAddTo = a;
			c(this.taskBox).slideDown("fast");
			this.taskInput.inputField.val("");
			c(this.taskInput.el).find("input").focus();
			this.taskInput.hideAutoComplete();
			for (var b in this.categoryViews) this.categoryViewToAddTo != this.categoryViews[b] && c(this.categoryViews[b].el).animate({
				opacity: 0
			}, 200, function() {
				c(this).slideUp(200)
			})
		},
		addTaskFromBar: function(a) {
			this.options.app.trackClick("taskwindow-addTask");
			this.hideTaskBox();
			var b = this.taskInput.inputField.val();
			this.taskInput.inputField.val("");
			this.taskInput.inputField.blur();
			if (!b) return false;
			this.addTask(b);
			a.stopPropagation();
			a.preventDefault();
			return false
		},
		addTask: function(a) {
			a = {
				title: a
			};
			switch (this.userConfig.getView()) {
			case VIEW_BY_CATEGORY:
				a.categoryId = this.categoryViewToAddTo.model.id;
				break;
			case VIEW_BY_DUE_DATE:
				a.categoryId = this.categories.getDefaultCategory().id;
				a.dueDate = this.tasks.generateDueDate(this.categoryViewToAddTo.options.date);
				break;
			case VIEW_BY_PRIORITY:
				a.categoryId = this.categories.getDefaultCategory().id;
				a.priority = this.categoryViewToAddTo.options.priority
			}
			this.tasks.collapseAll();
			return this.tasks.create(a)
		},
		resize: function() {
			this.tasksWrapper.height(c(window).height() - 50)
		},
		popOut: function() {
			typeof chrome != "undefined" && chrome.extension.sendRequest({
				action: "popupWindow"
			})
		},
		showUserMenu: function(a) {
			this.options.app.trackClick("taskwindow-showUserMenu");
			a = c(a.target).attr("id") == "menu-user" ? c(a.target) : c(a.target).parent("#menu-user");
			a = new g(a, [{
				text: "<a href='mailto:feedback+chrome@any.do?subject=Any.DO feedback - Chrome extension&body=%0A%0A%0A%0A%0AUser%20Agent: " + encodeURIComponent(navigator.userAgent) + "%0ALocale: " + encodeURIComponent(navigator.language) + "' target='blank'>Send us Feedback</a>",
				icon_class: "icon-settings-feedback",
				type: g.TYPE_NORMAL,
				callback: function() {
					document.location.href = "mailto:feedback@any.do"
				}
			}, {
				text: "Week Start",
				icon_class: "icon-settings-calendar",
				type: g.TYPE_OPTIONS,
				options: {
					1: "SUN",
					2: "MON",
					7: "SAT"
				},
				value: this.userConfig.getCalendarDay(),
				callback: e.bind(function(a) {
					this.userConfig.setCalendarDay(a)
				}, this)
			}, {
				text: "Sign Out",
				icon_class: "icon-settings-sign-out",
				type: g.TYPE_NORMAL,
				callback: function() {
					i.logOut()
				}
			}]);
			a.render();
			a.show()
		},
		taskLeave: function(a) {
			c(a.el).css("top", 0)
		},
		updateDragDrop: function(a) {
			var b = true;
			this.lastTaskDraggedOver || (b = false);
			this.lastTaskDraggedOver = a;
			this.lastCategoryDraggedOver = a.options.category;
			this.lastCategoryDraggedOver.dragDropEnter(a, b)
		},
		updateGhostTaskElement: function(a) {
			this.isDragDropInProgress() && this.dragDropGhostTaskElement.offset({
				left: c(this.el).offset().left,
				top: a.pageY - c(this.el).offset().top
			})
		},
		startDragDrop: function(a, b) {
			this.tasks.collapseAll();
			this.lastTaskDraggedOver = null;
			this.dragDropInProgress = true;
			this.dragDropTask = a;
			this.dragDropGhostTaskElement = c(this.dragDropTask.el).clone().addClass("drag-drop-ghost").appendTo(this.el);
			this.dragDropGhostTaskElement.width(c(this.dragDropTask.el).width());
			this.updateGhostTaskElement(b);
			c(this.dragDropTask.el).addClass("drag-drop-invisible");
			this.updateDragDrop(a, b)
		},
		isDragDropInProgress: function() {
			return this.dragDropInProgress
		},
		cancelDragDrop: function() {},
		finishDragDrop: function() {
			var a = this.tasksWrapper.scrollTop();
			if (this.lastTaskDraggedOver) this.tasks.dropTaskIntoTask(this.userConfig.getView(), this.dragDropTask.model, this.lastTaskDraggedOver.model, this.lastTaskDraggedOver.inTopPart);
			else switch (this.userConfig.getView()) {
			case VIEW_BY_CATEGORY:
				this.tasks.dropTaskIntoCategory(this.userConfig.getView(), this.dragDropTask.model, this.lastCategoryDraggedOver.model.id);
				break;
			case VIEW_BY_DUE_DATE:
				this.tasks.dropTaskIntoCategory(this.userConfig.getView(), this.dragDropTask.model, this.lastCategoryDraggedOver.options.date);
				break;
			case VIEW_BY_PRIORITY:
				this.tasks.dropTaskIntoCategory(this.userConfig.getView(), this.dragDropTask.model, this.lastCategoryDraggedOver.options.priority)
			}
			this.dragDropGhostTaskElement.remove();
			c(this.dragDropTask.el).removeClass("drag-drop-invisible");
			this.dragDropInProgress = false;
			this.lastTaskDraggedOver = null;
			for (var b in this.categoryViews) this.categoryViews[b].dragDropLeave();
			this.addAllCategories();
			this.tasksWrapper.scrollTop(a)
		},
		mouseMove: function(a) {
			this.updateGhostTaskElement(a)
		},
		mouseOver: function() {
			return false
		},
		mouseUp: function() {
			this.isDragDropInProgress() && this.finishDragDrop()
		},
		enterCategory: function(a) {
			if (this.isDragDropInProgress()) {
				this.lastCategoryDraggedOver && this.lastCategoryDraggedOver.dragDropLeave(this.dragDropTask);
				this.lastTaskDraggedOver = a.taskViews.length > 0 ? a.taskViews[0] : null;
				a.dragDropEnter(this.lastTaskDraggedOver, false);
				this.lastCategoryDraggedOver = a
			}
		},
		leaveCategory: function() {},
		findTaskViewById: function(a) {
			for (var b in this.categoryViews) for (var c = 0; c < this.categoryViews[b].taskViews.length; c++) if (this.categoryViews[b].taskViews[c].model.id == a) return this.categoryViews[b].taskViews[c];
			return null
		}
	})
});