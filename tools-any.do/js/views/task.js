define("jquery,underscore,backbone,constants,models/task,helpers/alert,views/notessection,views/folderoptionlist,views/dialog,windows/calendarwindow".split(","), function(b, c, f, m, g, h, i, j, k, l) {
	return f.View.extend({
		tagName: "li",
		className: "task",
		model: g,
		events: {
			mousedown: "mouseDown",
			mouseenter: "mouseEnter",
			mouseover: "mouseOver",
			mousemove: "mouseMove",
			mouseleave: "mouseLeave",
			mouseup: "mouseUp",
			mouseout: "mouseOut",
			click: "toggleExpanded",
			"click .task-properties li": "clickProperty",
			"click .summary": "clickSummary",
			"click .summary a": "clickSummaryLink",
			"keypress .summary": "typeTask",
			"click .check-button": "checkTask",
			"click .delete-button": "deleteTask",
			"mousemove .summary": "hoverOverInput"
		},
		clickSummary: function(a) {
			if (this.model.get("taskExpanded")) {
				this.summaryText.width() < a.offsetX && this.toggleExpanded();
				a.stopPropagation();
				return this.model.get("status") == TaskStatus.UNCHECKED
			}
		},
		clickSummaryLink: function(a) {
			a.stopPropagation();
			typeof chrome != "undefined" && chrome.extension.sendRequest({
				action: "openPage",
				url: b(a.target).attr("href")
			});
			return false
		},
		hoverOverInput: function(a) {
			this.summaryText.width() < a.offsetX ? this.summary.css("cursor", "pointer") : this.summary.css("cursor", "text")
		},
		leaveSummaryInput: function() {},
		initialize: function() {
			c.bindAll(this, "resetOptionList", "saveCalendarData", "update", "clickProperty", "changeListPosition", "changeCategory");
			this.taskWindow = this.options.taskWindow;
			this.model.bind("change", this.update);
			this.model.bind("destroy", this.removeAndUpdateParent);
			this.tasks = this.model.collection;
			this.movesToDrag = 0;
			this.optionList = null
		},
		changeListPosition: function() {},
		changeCategory: function() {},
		updateNumNotes: function() {
			if (this.noteIndicator != void 0) {
				var a = this.tasks.getUncheckedNotes(this.model).length;
				a > 0 ? this.noteIndicator.show().text(a) : this.noteIndicator.hide()
			}
		},
		update: function(a) {
			if (b(this.el).parent().length != 0 && this.summary) {
				this.summary.val(this.model.get("title"));
				this.summaryText.text(this.model.get("title"));
				this.summaryText.html(this.summaryText.text().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig, "<a href='$1'>$1</a>"));
				this.updateNumNotes();
				this.updateDescription();
				if (this.model.get("taskExpanded")) {
					b(this.el).css("height", "");
					b(this.el).addClass("selected");
					b("input").blur();
					this.summary && this.summary.focus();
					this.model.get("alert") && this.model.get("alert").type == "OFFSET" ? b(this.el).find(".icon-set-alert").addClass("selected") : b(this.el).find(".icon-set-alert").removeClass("selected")
				} else {
					b(this.el).removeClass("selected");
					if (this.notes) {
						this.notes.remove();
						this.notes = null
					}
				}
				if (this.model.get("taskExpanded")) {
					a = (typeof a == "number" ? a : 0) + (this.container ? this.container.outerHeight() : 0);
					a = a + (this.taskProperties ? this.taskProperties.outerHeight() : 0);
					a = a + (this.notes && this.notes.expanded ? b(this.notes.el).outerHeight() : 0);
					b(this.el).height(a)
				} else b(this.el).css("height", "");
				switch (this.model.get("status")) {
				case TaskStatus.UNCHECKED:
					b(this.el).removeClass("complete");
					break;
				case TaskStatus.CHECKED:
					b(this.el).addClass("complete");
					break;
				case TaskStatus.DONE:
					b(this.el).addClass("deleted").css("height", "0px").delay(200).queue(this.remove);
					break;
				case TaskStatus.DELETED:
					b(this.el).addClass("deleted").css("height", "0px").delay(200).queue(this.remove)
				}
				c.each(TaskPriority, function(a) {
					b(this.el).removeClass(a.toLowerCase())
				}, this);
				this.model.get("priority") && b(this.el).addClass(this.model.get("priority").toLowerCase())
			}
		},
		updateDescription: function() {
			if (this.summary && this.description) if (this.model.get("parentGlobalTaskId")) {
				this.summary.addClass("no-description");
				this.summaryText.addClass("no-description")
			} else {
				var a = this.getDescription();
				this.description.text(a);
				if (a) {
					this.summary.removeClass("no-description");
					this.summaryText.removeClass("no-description")
				} else {
					this.summary.addClass("no-description");
					this.summaryText.addClass("no-description")
				}
			}
		},
		getDescription: function() {
			if (!this.model.get("taskExpanded")) return "";
			switch (this.taskWindow.userConfig.getView()) {
			case VIEW_BY_CATEGORY:
				if (this.model.get("dueDate")) {
					var a = (new Date(this.model.get("dueDate"))).toDateString().split(" ", 4);
					return a[0] + " " + a[1] + " " + a[2]
				}
				return "";
			case VIEW_BY_DUE_DATE:
				return this.model.getCategoryName();
			case VIEW_BY_PRIORITY:
				return this.model.getCategoryName()
			}
		},
		getTitle: function() {
			return this.model.get("title")
		},
		render: function() {
			var a = b("<div>").addClass("container");
			this.container = a;
			a.append(b("<div>").addClass("check-button"));
			a.append(b("<div>").addClass("delete-button"));
			a.append(b("<div>").addClass("drag-button"));
			this.summary = b("<input>").addClass("summary").val(this.getTitle()).attr("maxlength", 1E3);
			this.summaryText = b("<div>").addClass("summary").val(this.getTitle());
			this.description = b("<div>").addClass("description");
			a.append(this.summary);
			a.append(this.summaryText);
			a.append(this.description);
			b(this.el).append(this.container);
			this.updateDescription();
			if (this.model.get("parentGlobalTaskId")) b(this.el).addClass("note");
			else {
				var a = b("<ul>").addClass("task-properties clearfix"),
					e;
				for (e in TASK_PROPERTY_LIST) {
					var c = TASK_PROPERTY_LIST[e][0],
						d = TASK_PROPERTY_LIST[e][1],
						d = b("<li>").addClass(d);
					d.append(b("<div>").addClass("icon"));
					d.append(b("<span>").text(c));
					if (c == TASK_PROPERTY_NOTES) {
						this.noteIndicator = b("<div>").addClass("icon-indicator");
						d.append(this.noteIndicator)
					}
					a.append(d)
				}
				this.taskProperties = a;
				b(this.el).append(a)
			}
			this.update();
			this.taskWindow.taskWithFolderListOpen == this.model.id && this.openFolderList();
			return this
		},
		typeTask: function(a) {
			var b = this.summary.val();
			if (a.keyCode == 13) {
				this.toggleExpanded(a);
				this.model.get("title") != b && this.model.save({
					title: b
				})
			}
		},
		setChecked: function() {
			this.model.save({
				status: TaskStatus.CHECKED,
				taskExpanded: false
			})
		},
		checkTask: function(a) {
			this.options.app.trackClick("task-checkTask");
			a.stopPropagation();
			if (this.model.get("status") == TaskStatus.CHECKED) {
				a = this.model.get("alert");
				if (h.nextAlertTime(this.model) < 0) a.type = "NONE";
				this.model.save({
					status: TaskStatus.UNCHECKED,
					alert: a
				})
			} else this.model.get("shared") == true ? (new k({
				title: "Shared Task",
				text: "You will no longer receive updates for this task. Continue?",
				yes: c.bind(function() {
					this.setChecked()
				}, this),
				no: function() {}
			})).render().show() : this.setChecked()
		},
		deleteTask: function(a) {
			this.options.app.trackClick("task-deleteTask");
			a.stopPropagation();
			this.model.save({
				status: TaskStatus.DELETED,
				taskExpanded: false
			});
			this.tasks.deleteTask(this.model);
			this.removeAndUpdateParent()
		},
		openFolderList: function() {
			this.optionList != null && this.optionList.remove();
			this.optionList = (new j({
				target: b(this.el).find(".icon-set-folder"),
				app: this.options.app,
				selectedItem: this.model.get("categoryId"),
				model: this.model,
				taskView: this,
				callback: c.bind(function() {
					this.optionList = null;
					this.taskWindow.taskWithFolderListOpen = null
				}, this)
			})).render()
		},
		clickProperty: function(a) {
			a = (b(a.target).is("li") ? b(a.target) : b(a.target).parent("li")).find("span").text();
			this.options.app.trackClick("task-" + a);
			switch (a) {
			case TASK_PROPERTY_PRIORITY:
				this.tasks.dropTaskIntoCategory(VIEW_BY_PRIORITY, this.model, nextPriority[this.model.get("priority")]);
				break;
			case TASK_PROPERTY_FOLDER:
				this.taskWindow.taskWithFolderListOpen = this.model.id;
				this.openFolderList();
				break;
			case TASK_PROPERTY_TIME:
				a = new Date;
				this.model.get("dueDate") > 0 && a.setTime(this.model.get("dueDate"));
				this.calendarWindow && this.calendarWindow.remove();
				this.calendarWindow = (new l({
					app: this.options.app,
					date: a,
					alert: this.model.get("alert"),
					repeatingMethod: this.model.get("repeatingMethod"),
					callback: this.saveCalendarData
				})).render();
				this.options.app.windowContainer.append(this.calendarWindow.el);
				setTimeout(c.bind(function() {
					this.calendarWindow.show()
				}, this), 10);
				break;
			case TASK_PROPERTY_NOTES:
				if (!this.notes) {
					this.notes = new i({
						parentTaskView: this
					});
					b(this.container).after(this.notes.el);
					this.notes.render()
				}
				this.notes.toggle()
			}
			return false
		},
		saveCalendarData: function(a) {
			this.model.save({
				alert: {
					customTime: 0,
					offset: parseInt(a.alert),
					type: a.alert == "" ? "NONE" : "OFFSET"
				},
				repeatingMethod: a.repeatingMethod,
				dueDate: a.date.getTime()
			});
			this.options.app.checkReminders()
		},
		resetOptionList: function() {
			this.optionList = null
		},
		mouseDown: function(a) {
			if (!b(a.target).hasClass("summary") || !this.model.get("taskExpanded")) {
				this.movesToDrag = DRAG_PIXELS_THRESHOLD;
				this.inTopPart = null
			}
		},
		mouseUp: function() {
			this.movesToDrag = 0
		},
		startDrag: function(a) {
			this.model.get("parentGlobalTaskId") || this.options.taskWindow.startDragDrop(this, a)
		},
		mouseMove: function(a) {
			if (this.movesToDrag > 0) {
				this.movesToDrag = this.movesToDrag - 1;
				this.movesToDrag == 0 && this.startDrag(a)
			}
			var c = a.pageY - b(this.el).offset().top < b(this.el).outerHeight() / 2;
			if (this.options.taskWindow.isDragDropInProgress() && (this.inTopPart == null || this.inTopPart != c)) {
				this.inTopPart = c;
				this.options.taskWindow.updateDragDrop(this, a)
			}
		},
		mouseEnter: function() {},
		mouseOver: function() {},
		mouseLeave: function(a) {
			this.movesToDrag > 0 && this.startDrag(a)
		},
		getTargetTask: function(a) {
			for (a = a.target; !b(a).hasClass("task");) a = a.parentNode;
			return this.options.category.getTaskViewByIndex(b(a).index())
		},
		mouseOut: function() {
			b(this.el).removeClass("hover")
		},
		toggleExpanded: function(a) {
			a && a.stopPropagation();
			if (!(this.model.get("parentGlobalTaskId") || this.model.get("status") != TaskStatus.UNCHECKED)) {
				a = this.model.get("taskExpanded");
				this.tasks.collapseAll();
				this.model.save({
					taskExpanded: !a
				});
				this.update();
				return false
			}
		},
		addNoteView: function(a) {
			return this.options.category.addTaskView(a)
		},
		removeAndUpdateParent: function() {
			this.options.parentTaskView && this.options.parentTaskView.update(b(this.el).height() * -1);
			b(this.el).slideUp("fast", this.remove)
		},
		remove: function() {
			if (this.model) {
				this.model.unbind("change", this.update);
				this.model.unbind("destroy", this.removeAndUpdateParent)
			}
			if (this.optionList) this.taskWindow.taskWithFolderListOpen = this.model.id;
			b(this.el).remove()
		}
	})
});