with($ns("fs.ui.controls")) {
	fs.ui.controls.ColorPicker = function (p_container) {
		var me = new mx.controls.Control(p_container);

		me.init = function () {
			me.container.style.cursor = "pointer";
			me.container.style.display = "inline-block";
			me.container.style.backgroundColor = "black";
			me.container.title = "(auto)";
			me.container.style.position = "relative";
			me.container.style.backgroundImage = "url(" + $mappath("$res/fs/controls/colorPicker.png") + ")";
			me.resizeTo(21, 20);

			me.container.addEventListener("click", _onclick);
		};

		me.color = null;
		me.onColorChanged = new Event();
		me.setColor = function (p_color) {
			if (p_color != me.color) {
				me.container.style.backgroundColor = p_color;
				me.container.title = p_color;
				me.color = p_color;
			}
		};


		me.getColorTable = function () {
			if (fs.ui.controls.ColorPicker.colorTable == null) {
				var c = $new("div");
				c.style.zIndex = 100000;
				c.style.position = "absolute";
				c.style.posTop = me.container.offsetHeight;
				fs.ui.controls.ColorPicker.colorTable = new fs.ui.controls.ColorTable(c);
				fs.ui.controls.ColorPicker.colorTable.init();
			}
			return fs.ui.controls.ColorPicker.colorTable;
		};



		function _onclick() {
			if (event.srcElement == me.container) {
				var ct = me.getColorTable();
				ct.onColorChanged = null;
				ct.setColor(me.color);
				ct.onColorChanged = _colorTable_onColorChanged;
				me.container.appendChild(ct.container);
				document.body.addEventListener("mouseup", _document_onclick, false);
			}
		}

		function _document_onclick() {
			var ct = me.getColorTable();
			if (event.srcElement != ct.container && !ct.container.contains(event.srcElement)) {
				me.container.removeChild(ct.container);
				ct.onColorChanged = null;

				document.body.removeEventListener("mouseup", _document_onclick, false);
			}
		}

		function _colorTable_onColorChanged() {
			var ct = me.getColorTable();
			me.setColor(ct.color);
			me.onColorChanged.fire(me, null);
		}

		return me;
	};

	fs.ui.controls.ColorPicker.colorTable = null;
}