define(["jquery", "underscore", "backbone", "windows/window"], function(a, p, v, q) {
	var r = "January,February,March,April,May,June,July,August,September,October,November,December".split(","),
		s = "S,S,M,T,W,T,F".split(","),
		t = "S,M,T,W,T,F,S".split(","),
		u = "M,T,W,T,F,S,S".split(","),
		j = "01,02,03,04,05,06,07,08,09,10,11,12".split(","),
		k = "00,05,10,15,20,25,30,35,40,45,50,55".split(","),
		g = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
		n = [["Off", null], ["On time", "0"], ["5 min before", "5"], ["10 min before", "10"], ["30 min before",
			"30"]],
		o = [["once", "TASK_REPEAT_OFF"], ["once a Day", "TASK_REPEAT_DAY"], ["once a Week", "TASK_REPEAT_WEEK"], ["once a Month", "TASK_REPEAT_MONTH"]];
	return q.extend({
		className: "window calendar-window",
		events: {
			"click .prevprev": "backOneYear",
			"click .prev": "backOneMonth",
			"click .next": "forwardOneMonth",
			"click .nextnext": "forwardOneYear",
			"click .current-month": "selectDay",
			"change .time-select": "updateTime",
			"change .alert-select": "updateAlert",
			"change .repeat-select": "updateRepeat",
			"click .back": "setAndClose",
			transitionEnd: "transitionEnd",
			webkitTransitionEnd: "transitionEnd"
		},
		initialize: function() {
			p.bindAll(this, "close", "show", "hide");
			this.userConfig = this.options.app.userConfig;
			this.date = this.options.date;
			this.callback = this.options.callback;
			this.alert = null == this.options.alert || "NONE" == this.options.alert.type ? null : this.options.alert.offset;
			this.repeatingMethod = this.options.repeatingMethod;
			"object" != typeof this.date && (this.date = new Date)
		},
		render: function() {
			a(this.el).empty();
			this.buildHeader();
			a(this.el).append(a("<h1>").text("Set Time"));
			this.calendarHeaderTitle = a("<h3>");
			a(this.el).append(this.calendarHeaderTitle);
			this.buildCalendarTable();
			this.buildCalendarTimeSelector();
			this.buildCalendarAlertSelector();
			this.update();
			return this
		},
		backOneYear: function() {
			this.options.app.trackClick("calendarwindow-backOneYear");
			this.date.setFullYear(this.date.getFullYear() - 1);
			this.update()
		},
		forwardOneYear: function() {
			this.options.app.trackClick("calendarwindow-forwardOneYear");
			this.date.setFullYear(this.date.getFullYear() + 1);
			this.update()
		},
		backOneMonth: function() {
			this.options.app.trackClick("calendarwindow-backOneMonth");
			var b = this.date.getMonth(),
				a = this.date.getFullYear();
			0 < b ? b -= 1 : (b = 11, a -= 1);
			this.date.getDate() > g[b] && this.date.setDate(g[b]);
			this.date.setMonth(b);
			this.date.setFullYear(a);
			this.update()
		},
		forwardOneMonth: function() {
			this.options.app.trackClick("calendarwindow-forwardOneMonth");
			var b = this.date.getMonth(),
				a = this.date.getFullYear();
			11 > b ? b += 1 : (b = 0, a += 1);
			this.date.getDate() > g[b] && this.date.setDate(g[b]);
			this.date.setMonth(b);
			this.date.setFullYear(a);
			this.update()
		},
		updateModel: function() {
			this.callback({
				date: this.date,
				alert: a(".alert-select").val(),
				repeatingMethod: this.repeatingMethod
			})
		},
		setAndClose: function() {
			this.updateModel();
			this.close()
		},
		transitionEnd: function() {
			this.closing && this.remove()
		},
		close: function() {
			this.closing = !0;
			this.hide()
		},
		selectDay: function(b) {
			this.options.app.trackClick("calendarwindow-selectDay");
			this.date.setDate(a(b.target).text());
			this.updateCalendarDateText();
			this.calendarTable.find("td.current-month.selected").removeClass("selected");
			a(b.target).addClass("selected")
		},
		turnAlertOnIfNeeded: function() {
			"" === a(".alert-select").val() && a(".alert-select").val("0")
		},
		getDaysInMonth: function(a, c) {
			return 1 == a && 0 == c % 4 && (0 != c % 100 || 0 == c % 400) ? 29 : g[a]
		},
		buildHeader: function() {
			a(this.el).append(a("<header>").append(a("<div>").addClass("back")))
		},
		buildCalendarTable: function() {
			this.calendarTable = a("<table>");
			var b = a("<thead>");
			this.calendarTable.append(b);
			this.calendarTextLabel = a("<td>").addClass("calendar-date").attr("colspan", 3);
			var c = a("<tr>").appendTo(b);
			c.append(a("<td>").addClass("calendar-control").addClass("prevprev"));
			c.append(a("<td>").addClass("calendar-control").addClass("prev"));
			c.append(this.calendarTextLabel);
			c.append(a("<td>").addClass("calendar-control").addClass("next"));
			c.append(a("<td>").addClass("calendar-control").addClass("nextnext"));
			b = a("<tr>").appendTo(b);
			for (c = 0; 7 > c; c++) 1 == this.userConfig.getCalendarDay() ? b.append(a("<th>").text(t[c])) : 2 == this.userConfig.getCalendarDay() ? b.append(a("<th>").text(u[c])) : 7 == this.userConfig.getCalendarDay() && b.append(a("<th>").text(s[c]));
			a(this.el).append(this.calendarTable)
		},
		buildCalendarTimeSelector: function() {
			var b = this.date.getHours() % 12,
				c = parseInt(this.date.getHours() / 12),
				f = 5 * parseInt(this.date.getMinutes() / 5),
				d = a("<div>").addClass("calendar-time");
			d.append(a("<span>").text("Set Time:"));
			this.hourSelect = a("<select>").addClass("time-select");
			this.minuteSelect = a("<select>").addClass("time-select");
			this.amPmSelect = a("<select>").addClass("time-select");
			for (var l in j) {
				var h = a("<option>").text(j[l]).val(j[l]);
				this.hourSelect.append(h);
				j[l] == b && h.attr("selected", "selected")
			}
			for (var e in k) b = a("<option>").text(k[e]).val(k[e]), this.minuteSelect.append(b), k[e] == f && b.attr("selected", "selected");
			this.amPmSelect.append(a("<option>").text("AM").val(0));
			this.amPmSelect.append(a("<option>").text("PM").val(1));
			a(this.amPmSelect.children().get(c)).attr("selected", "selected");
			d.append(this.hourSelect);
			d.append(a("<span>").text(":"));
			d.append(this.minuteSelect);
			d.append(this.amPmSelect);
			a(this.el).append(d)
		},
		buildCalendarAlertSelector: function() {
			var b = a("<div>").addClass("calendar-option");
			b.append(a("<img>").attr("src", "images/alert_bell_idle.png"));
			b.append(a("<span>").text("Reminder"));
			var c = a("<select>").addClass("alert-select"),
				f;
			for (f in n) {
				var d = n[f],
					d = a("<option>").text(d[0]).val(d[1]);
				n[f][1] == this.alert && d.attr("selected", "selected");
				c.append(d)
			}
			b.append(c);
			a(this.el).append(b)
		},
		buildCalendarRepeatSelector: function() {
			var b = a("<div>").addClass("calendar-option");
			b.append(a("<img>").attr("src", "images/alert_repeat.png"));
			b.append(a("<span>").text("Repeat"));
			var c = a("<select>").addClass("repeat-select"),
				f;
			for (f in o) {
				var d = o[f],
					d = a("<option>").text(d[0]).val(d[1]);
				c.append(d);
				o[f][1] == this.repeatingMethod && d.attr("selected", "selected")
			}
			b.append(c);
			a(this.el).append(b)
		},
		updateTime: function() {
			this.options.app.trackClick("calendarwindow-updateTime");
			this.date.setHours(12 * parseInt(this.amPmSelect.val()) + parseInt(this.hourSelect.val() % 12));
			this.date.setMinutes(parseInt(this.minuteSelect.val()));
			this.turnAlertOnIfNeeded()
		},
		updateAlert: function(b) {
			this.options.app.trackClick("calendarwindow-updateAlert");
			this.alert = null == a(b.target).val() ? null : parseInt(a(b.target).val())
		},
		updateRepeat: function(b) {
			this.options.app.trackClick("calendarwindow-updateRepeat");
			this.repeatingMethod = a(b.target).val()
		},
		updateCalendarDateText: function() {
			var a = new Date;
			this.calendarTextLabel.text(this.date.getDate() == a.getDate() && this.date.getMonth() == a.getMonth() && this.date.getFullYear() == a.getFullYear() ? "Today" : this.date.toDateString())
		},
		update: function() {
			this.updateCalendarDateText();
			var b = this.date.getFullYear(),
				c = this.date.getMonth(),
				f = new Date,
				d = f.getDate(),
				l = f.getFullYear(),
				f = f.getMonth(),
				h = new Date(b, c, 1),
				e = h.getDay(),
				g = 0 == c ? 11 : c - 1,
				g = this.getDaysInMonth(g, 11 == g ? b - 1 : b),
				e = 0 == e && h ? 7 : e;
			2 == this.userConfig.getCalendarDay() ? e = (e + 6) % 7 : 7 == this.userConfig.getCalendarDay() && (e = (e + 1) % 7);
			h = 0;
			this.calendarHeaderTitle.text(r[c] + " " + b);
			this.calendarTable.children("tbody").remove();
			var j = a("<tbody>");
			this.calendarTable.append(j);
			for (var k = a("<tr>").appendTo(j), i = 0; 42 > i; i++) {
				var m = a("<td>").appendTo(k);
				m.removeClass("other-month").removeClass("current-month");
				i < e ? m.addClass("other-month").text(g - e + i + 1) : i >= e + this.getDaysInMonth(c, b) ? (h += 1, m.addClass("other-month").text(h)) : (m.text(i - e + 1), i - e + 1 == this.date.getDate() && m.addClass("selected"), i - e + 1 < d && c == f && b == l || c < f && b == l || b < l ? m.addClass("other-month") : m.addClass("current-month"));
				6 == i % 7 && (k = a("<tr>").appendTo(j))
			}
		}
	})
});