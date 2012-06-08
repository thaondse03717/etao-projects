with($ns("mx.controls")) {
	mx.controls.Control = function (p_container) {
		var me = this;

		me.container = p_container;

		me.id = null;

		me.onLoad = new Event();

		me.init = function () {

		};

		me.setCssClass = function (p_className) {
			me.container.className = p_className;
		};

		me.setWidth = function (p_width) {
			if (typeof(p_width) == "number") {
				p_width = p_width + "px";
			}
			me.container.style.width = p_width;
		};

		me.setHeight = function (p_height) {
			if (typeof(p_height) == "number") {
				p_height = p_height + "px";
			}
			me.container.style.height = p_height;
		};

		me.isVisible = function () {
			return me.container.style.display != "none";
		};

		me.setVisible = function (p_visible) {
			me.container.style.display = (p_visible ? "" : "none");
		};

		me.hide = function () {
			me.setVisible(false);
		};

		me.resizeTo = function (p_width, p_height) {
			me.setWidth(p_width);
			me.setHeight(p_height);
		};

		return me;
	};
}