define(["jquery", "underscore", "backbone", "constants"], function(g, e, f) {
	return f.Model.extend({
		toggle: function(a) {
			var b = {};
			b[a] = !this.get(a);
			this.save(b)
		},
		defaults: function() {
			var a = (new Date).getTime();
			return {
				title: null,
				listPositionByCategory: 0,
				listPositionByPriority: 0,
				listPositionByDueDate: 0,
				status: TaskStatus.UNCHECKED,
				repeatingMethod: TASK_REPEAT.TASK_REPEAT_OFF,
				shared: !1,
				priority: TaskPriority.Normal,
				creationDate: a,
				taskExpanded: !1
			}
		},
		initialize: function() {
			e.bindAll(this, "getListPosition", "setListPosition", "getMatchingDueDateCategory", "setDueDateCategory", "dismissAlert", "markAsChecked", "snoozeTask", "validStatus", "getCategoryName")
		},
		getListPosition: function(a) {
			a || (a = app.userConfig.getView());
			return this.get(LIST_POSITION_KEY[a])
		},
		setListPosition: function(a) {
			var b = {};
			b[LIST_POSITION_KEY[app.userConfig.getView()]] = a;
			this.save(b)
		},
		getMatchingDueDateCategory: function() {
			var a = this.get("dueDate");
			if (a) {
				var b = new Date;
				b.setMilliseconds(0);
				b.setSeconds(0);
				b.setMinutes(0);
				b.setHours(0);
				var b = b.getTime(),
					c = b + DAY_SECONDS,
					d = b + 2 * DAY_SECONDS;
				return a < c ? DATE_CATEGORY_TODAY : a >= c && a < d ? DATE_CATEGORY_TOMORROW : a >= d && a < b + 7 * DAY_SECONDS ? DATE_CATEGORY_THIS_WEEK : DATE_CATEGORY_LATER
			}
			return DATE_CATEGORY_TODAY
		},
		setFolderCategory: function(a) {
			var b = {};
			b.categoryId = a;
			b[LIST_POSITION_KEY[VIEW_BY_CATEGORY]] = 0;
			this.save(b)
		},
		setPriorityCategory: function(a) {
			var b = {};
			b.priority = a;
			b[LIST_POSITION_KEY[VIEW_BY_PRIORITY]] = 0;
			this.save(b)
		},
		setDueDateCategory: function(a) {
			var b = this.get("dueDate") ? new Date(this.get("dueDate")) : new Date,
				c = b.getSeconds(),
				d = b.getMinutes(),
				b = b.getHours(),
				a = this.collection.generateDueDate(a);
			a.setSeconds(c);
			a.setMinutes(d);
			a.setHours(b);
			c = {};
			c.dueDate = a.getTime();
			c[LIST_POSITION_KEY[VIEW_BY_DUE_DATE]] = 0;
			this.save(c)
		},
		validStatus: function() {
			return this.get("status") == TaskStatus.CHECKED || this.get("status") == TaskStatus.UNCHECKED
		},
		getCategoryName: function() {
			var a = app.mainTaskWindow.categories.get(this.get("categoryId"));
			return a ? a.get("name") : "N/A"
		},
		markAsChecked: function() {
			this.save({
				status: TaskStatus.CHECKED
			})
		},
		dismissAlert: function(a) {
			this.save({
				alert: {
					type: "NONE",
					offset: 0
				}
			}, {
				success: a
			})
		},
		snoozeTask: function(a) {
			this.save({
				dueDate: Date.now() + a,
				alert: {
					type: "OFFSET",
					offset: 0,
					customTime: 0
				}
			})
		}
	})
});