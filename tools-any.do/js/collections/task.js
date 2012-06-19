define(["jquery", "underscore", "backbone", "models/task", "constants"], function(k, c, i, j) {
	return i.Collection.extend({
		url: TASKS_URL,
		model: j,
		getLeftTasks: function() {
			return c.select(this.getTasksInDueDate(DATE_CATEGORY_TODAY), function(a) {
				return a.get("status") == TaskStatus.UNCHECKED
			})
		},
		getTasksInCategory: function(a) {
			return this.select(function(b) {
				return a == b.get("categoryId") && b.validStatus() && null == b.get("parentGlobalTaskId")
			}, this)
		},
		getTasksInDueDate: function(a) {
			return this.select(function(b) {
				return a == b.getMatchingDueDateCategory() && b.validStatus() && null == b.get("parentGlobalTaskId")
			}, this)
		},
		getTasksInPriority: function(a) {
			return this.select(function(b) {
				return a == b.get("priority") && b.validStatus() && null == b.get("parentGlobalTaskId")
			}, this)
		},
		getTopLevelTasks: function() {
			return this.select(function(a) {
				return null == a.get("parentGlobalTaskId") && a.validStatus()
			}, this)
		},
		getExpandedTasks: function() {
			return this.select(function(a) {
				return !0 === a.get("taskExpanded") && a.validStatus()
			}, this)
		},
		fixListPositions: function(a) {
			var b = 0;
			c.each(a, c.bind(function(a) {
				a = this.getTasksInCategory(a.id);
				a = c.sortBy(a, function(a) {
					return a.get(LIST_POSITION_KEY[VIEW_BY_CATEGORY])
				});
				b = 0;
				c.each(a, function(a) {
					var f = {};
					f[LIST_POSITION_KEY[VIEW_BY_CATEGORY]] = b;
					a.set(f);
					b++
				})
			}, this));
			c.each(TaskPriority, c.bind(function(a) {
				a = this.getTasksInPriority(a);
				a = c.sortBy(a, function(a) {
					return a.get(LIST_POSITION_KEY[VIEW_BY_PRIORITY])
				});
				b = 0;
				c.each(a, function(a) {
					var f = {};
					f[LIST_POSITION_KEY[VIEW_BY_PRIORITY]] = b;
					a.set(f);
					b++
				})
			}, this));
			for (var d in DATES) a = this.getTasksInDueDate(DATES[d]), a = c.sortBy(a, function(a) {
				return a.get(LIST_POSITION_KEY[VIEW_BY_DUE_DATE])
			}), b = 0, c.each(a, function(a) {
				var d = {};
				d[LIST_POSITION_KEY[VIEW_BY_DUE_DATE]] = b;
				a.set(d);
				b++
			})
		},
		getTopLevelTasksInACategory: function(a, b) {
			var d;
			switch (a) {
			case VIEW_BY_DUE_DATE:
				d = this.select(function(a) {
					return void 0 == a.get("parentGlobalTaskId") && b == a.getMatchingDueDateCategory() && a.validStatus()
				}, this);
				break;
			case VIEW_BY_PRIORITY:
				d = this.select(function(a) {
					return void 0 == a.get("parentGlobalTaskId") && a.validStatus() && b == a.get("priority")
				}, this);
				break;
			case VIEW_BY_CATEGORY:
				d = this.select(function(a) {
					return void 0 == a.get("parentGlobalTaskId") && b == a.get("categoryId") && a.validStatus()
				}, this)
			}
			return c.sortBy(d, function(b) {
				return b.getListPosition(a)
			})
		},
		getNotes: function(a) {
			return this.select(function(b) {
				return a.id == b.get("parentGlobalTaskId") && b.validStatus()
			}, this)
		},
		getUncheckedNotes: function(a) {
			return this.select(function(b) {
				return a.id == b.get("parentGlobalTaskId") && b.get("status") == TaskStatus.UNCHECKED
			}, this)
		},
		clearCompleted: function() {
			c.each(this.models, function(a) {
				a.get("status") == TaskStatus.CHECKED && a.save({
					status: TaskStatus.DONE
				})
			}, this)
		},
		initialize: function() {
			c.bindAll(this, "addTask");
			this.bind("add", this.addTask)
		},
		addTask: function(a) {
			void 0 == a.get("parentGlobalTaskId") && (this.shiftTasks(VIEW_BY_CATEGORY, null, a, 1), this.shiftTasks(VIEW_BY_DUE_DATE, null, a, 1), this.shiftTasks(VIEW_BY_PRIORITY, null, a, 1))
		},
		deleteTask: function(a) {
			void 0 == a.get("parentGlobalTaskId") && (this.shiftTasks(VIEW_BY_CATEGORY, a.get(LIST_POSITION_KEY[VIEW_BY_CATEGORY]), a, -1), this.shiftTasks(VIEW_BY_DUE_DATE, a.get(LIST_POSITION_KEY[VIEW_BY_DUE_DATE]), a, -1), this.shiftTasks(VIEW_BY_PRIORITY, a.get(LIST_POSITION_KEY[VIEW_BY_PRIORITY]), a, -1))
		},
		shiftTasks: function(a, b, d, f) {
			var e;
			switch (a) {
			case VIEW_BY_CATEGORY:
				e = this.getTasksInCategory(d.get("categoryId"));
				break;
			case VIEW_BY_DUE_DATE:
				e = this.getTasksInDueDate(d.getMatchingDueDateCategory());
				break;
			case VIEW_BY_PRIORITY:
				e = this.getTasksInPriority(d.get("priority"))
			}
			e = c.sortBy(e, function(b) {
				return b.getListPosition(a)
			});
			c.each(e, function(c) {
				var e = c.get(LIST_POSITION_KEY[a]);
				if (c != d && (e >= b || null == b)) {
					var h = {};
					h[LIST_POSITION_KEY[a]] = e + f;
					c.save(h, {
						silent: !0
					})
				}
			})
		},
		dropTaskIntoCategory: function(a, b, d) {
			this.shiftTasks(a, b.get(LIST_POSITION_KEY[a]), b, -1);
			switch (a) {
			case VIEW_BY_CATEGORY:
				b.setFolderCategory(d);
				break;
			case VIEW_BY_DUE_DATE:
				b.setDueDateCategory(d);
				break;
			case VIEW_BY_PRIORITY:
				b.setPriorityCategory(d)
			}
			this.shiftTasks(a, 0, b, 1)
		},
		dropTaskIntoTask: function(a, b, d, c) {
			this.shiftTasks(a, b.get(LIST_POSITION_KEY[a]), b, -1);
			switch (a) {
			case VIEW_BY_CATEGORY:
				b.save({
					categoryId: d.get("categoryId")
				});
				break;
			case VIEW_BY_DUE_DATE:
				b.setDueDateCategory(d.getMatchingDueDateCategory());
				break;
			case VIEW_BY_PRIORITY:
				b.save({
					priority: d.get("priority")
				})
			}
			var e = d.get(LIST_POSITION_KEY[a]) + (c ? 0 : 1);
			this.shiftTasks(a, e, b, 1);
			var g = {},
				e = d.get(LIST_POSITION_KEY[a]) + (c ? -1 : 1);
			g[LIST_POSITION_KEY[a]] = e;
			b.save(g)
		},
		generateDueDate: function(a) {
			var b = (new Date).getTime();
			switch (a) {
			case DATE_CATEGORY_TOMORROW:
				b += DAY_SECONDS;
				break;
			case DATE_CATEGORY_THIS_WEEK:
				b += 2 * DAY_SECONDS;
				break;
			case DATE_CATEGORY_LATER:
				b += 8 * DAY_SECONDS
			}
			return new Date(b)
		},
		collapseAll: function() {
			c.each(this.getExpandedTasks(), function(a) {
				a.save({
					taskExpanded: !1
				})
			}, this)
		}
	})
});