define("jquery,underscore,backbone,constants,models/category,views/task".split(","), function(b, g, d) {
	localConstants = {
		TYPE_NORMAL: 0,
		TYPE_ONOFF: 1,
		TYPE_OPTIONS: 2,
		ACTION_CLICK: "click",
		ACTION_ON: "on",
		ACTION_OFF: "off"
	};
	var d = d.View.extend({
		tagName: "div",
		className: "context-menu-container",
		events: {
			"click .menu-background": "hide"
		},
		initialize: function(a, b) {
			this.targetObject = a;
			this.contextMenuItems = b
		},
		show: function() {
			b(this.el).fadeIn("fast")
		},
		hide: function() {
			b(this.el).fadeOut("fast")
		},
		_createItemDOM: function(a) {
			var c, d = b("<div>").addClass("icon"),
				h = b("<div>").html(a.text),
				e = b("<li>").addClass(a.icon_class);
			if (a.type == localConstants.TYPE_OPTIONS) {
				c = b("<div>").addClass("option").html(a.options[a.value]);
				e.append(c)
			}
			e.append(d);
			e.append(h);
			a.optionlist = [];
			for (f in a.options) a.optionlist.push(f);
			e.click(g.bind(function() {
				switch (a.type) {
				case localConstants.TYPE_NORMAL:
					a.callback();
					this.hide();
					break;
				case localConstants.TYPE_OPTIONS:
					a.value = parseInt(a.optionlist[(a.optionlist.indexOf(a.value.toString()) + 1) % a.optionlist.length]);
					c.text(a.options[a.value]);
					a.callback(a.value)
				}
			}, this));
			return e
		},
		render: function() {
			b(this.el).empty();
			this.background = b("<div/>").addClass("menu-background");
			this.menuContent = b("<div>").addClass("menu-content");
			this.mainList = b("<ul/>");
			b(this.el).append(this.background);
			b(this.el).append(this.menuContent);
			this.menuContent.append(this.mainList);
			for (var a in this.contextMenuItems) this.mainList.append(this._createItemDOM(this.contextMenuItems[a]));
			b(document.body).append(b(this.el));
			a = this.targetObject.offset().top + this.targetObject.outerHeight() + 17;
			var c = this.targetObject.offset().left + this.targetObject.outerWidth();
			c + this.menuContent.outerWidth() > b(window).width() && (c = c - this.menuContent.outerWidth());
			this.menuContent.css({
				left: c + "px",
				top: a + "px"
			});
			return this
		}
	}),
		f;
	for (f in localConstants) d[f] = localConstants[f];
	return d
});