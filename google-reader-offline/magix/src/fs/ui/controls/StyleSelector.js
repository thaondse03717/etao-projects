with($ns("fs.ui.controls")) {
	fs.ui.controls.StyleSelector = function (p_container) {
		var me = new mx.controls.Control(p_container);

		me.displayColor = false;
		me.displayLineSpacing = true;


		me.changed = false;
		me.onChanged = new Event();

		var _selFontFamily = $new("select");
		var _selFontSize = $new("select");
		var _btnBold = $new("button");
		var _btnItalic = $new("button");
		var _colorPicker = null;
		var _selLineSpacing = null;

		me.init = function () {
			me.container.style.lineHeight = "25px";

			_initFontFamily();
			_selFontFamily.style.float = "left";
			_selFontFamily.style.marginRight = "0px";
			_selFontFamily.title = $msg("font_family");
			_selFontFamily.addEventListener("change", _selFontFamily_onchange, false);


			_initFontSize();
			_selFontSize.style.float = "left";
			_selFontSize.style.marginLeft = "0px";
			_selFontSize.title = $msg("font_size");
			_selFontSize.addEventListener("change", _selFontSize_onchange, false);



			_btnBold.style.float = "left";
			_btnBold.style.marginLeft = "10px";
			_btnBold.style.marginTop = "2px";
			_btnBold.style.padding = "0";
			_btnBold.style.width = "22px";
			_btnBold.style.height = "22px";
			_btnBold.style.lineHeight = "22px";
			_btnBold.innerText = "B";
			_btnBold.addEventListener("click", _btnBold_onclick, false);



			_btnItalic.style.float = "left";
			_btnItalic.style.marginLeft = "2px";
			_btnItalic.style.marginTop = "2px";
			_btnItalic.style.padding = "0";
			_btnItalic.style.width = "22px";
			_btnItalic.style.height = "22px";
			_btnItalic.style.lineHeight = "22px";
			_btnItalic.innerText = "I";
			_btnItalic.addEventListener("click", _btnItalic_onclick, false);


			if (me.displayColor) {
				var cp_container = $new("div");
				cp_container.style.float = "left";
				cp_container.style.marginTop = "3px";
				cp_container.style.marginLeft = "10px";
				_colorPicker = new fs.ui.controls.ColorPicker(cp_container);
				_colorPicker.onColorChanged.$(_colorPicker_onColorChanged);
				_colorPicker.init();
			}



			if (me.displayLineSpacing) {
				_selLineSpacing = $new("select");
				_initLineSpacing();
				_selLineSpacing.style.float = "left";
				_selLineSpacing.style.marginLeft = "10px";
				_selLineSpacing.title = $msg("line_spacing");
				_selLineSpacing.addEventListener("change", _selLineSpacing_onchange, false);
			}

			me.container.appendChild(_selFontFamily);
			me.container.appendChild(_selFontSize);
			me.container.appendChild(_btnBold);
			me.container.appendChild(_btnItalic);

			if (me.displayColor) {
				me.container.appendChild(cp_container);
			}
			if (me.displayLineSpacing) {
				me.container.appendChild(_selLineSpacing);
			}
		};

		me.style = null;
		me.setStyle = function (p_style) {
			if (p_style.fontFamily != null) {
				_selFontFamily.value = p_style.fontFamily.split(",")[0];
			}
			if (p_style.fontSize != null) {
				_selFontSize.value = p_style.fontSize;
			}
			if (p_style.fontWeight != null) {
				_btnBold.className = (p_style.fontWeight == "bold" ? "checked" : "");
			}
			if (p_style.fontStyle != null) {
				_btnItalic.className = (p_style.fontStyle == "italic" ? "checked" : "");
			}
			if (p_style.color != null && _colorPicker != null) {
				_colorPicker.setColor(p_style.color);
			}
			if (p_style.lineSpacing != null && _selLineSpacing != null) {
				_selLineSpacing.value = p_style.lineSpacing;
			}
			me.changed = false;
			me.style = p_style;
		};

		function _initFontFamily() {
			var fonts = $msg("fonts").split(",");
			for (var i = 0; i < fonts.length; i++) {
				var opt = $new("option");
				opt.innerText = fonts[i];
				opt.value = fonts[i];
				_selFontFamily.appendChild(opt);
			}
		}

		function _initFontSize() {
			for (var i = 10; i < 18; i++) {
				var opt = $new("option");
				opt.innerText = i;
				opt.value = i;
				_selFontSize.appendChild(opt);
			}

			for (var i = 18; i <= 36; i += 2) {
				var opt = $new("option");
				opt.innerText = i;
				opt.value = i;
				_selFontSize.appendChild(opt);
			}

			var opt = $new("option");
			opt.innerText = 48;
			opt.value = 48;
			_selFontSize.appendChild(opt);

			opt = $new("option");
			opt.innerText = 72;
			opt.value = 72;
			_selFontSize.appendChild(opt);
		}

		function _initLineSpacing() {
			var opt = $new("option");
			opt.innerText = "1 " + $msg("line_spacing_line");
			opt.value = 1;
			_selLineSpacing.appendChild(opt);

			opt = $new("option");
			opt.innerText = "1.5 " + $msg("line_spacing_lines");
			opt.value = 1.5;
			_selLineSpacing.appendChild(opt);

			opt = $new("option");
			opt.innerText = "2 " + $msg("line_spacing_lines");
			opt.value = 2;
			_selLineSpacing.appendChild(opt);

			opt = $new("option");
			opt.innerText = "2.5 " + $msg("line_spacing_lines");
			opt.value = 2.5;
			_selLineSpacing.appendChild(opt);

			opt = $new("option");
			opt.innerText = "3 " + $msg("line_spacing_lines");
			opt.value = 3;
			_selLineSpacing.appendChild(opt);
		}



		function _selFontFamily_onchange() {
			me.style.fontFamily = _selFontFamily.value;

			me.changed = true;
			me.onChanged.fire(me);
		}

		function _selFontSize_onchange() {
			me.style.fontSize = parseInt(_selFontSize.value);

			me.changed = true;
			me.onChanged.fire(me);
		}

		function _btnBold_onclick() {
			if (_btnBold.className == "checked") {
				_btnBold.className = "";
				me.style.fontWeight = "normal";
			}
			else {
				_btnBold.className = "checked";
				me.style.fontWeight = "bold";
			}

			me.changed = true;
			me.onChanged.fire(me);
		}

		function _btnItalic_onclick() {
			if (_btnItalic.className == "checked") {
				_btnItalic.className = "";
				me.style.fontStyle = "normal";
			}
			else {
				_btnItalic.className = "checked";
				me.style.fontStyle = "italic";
			}

			me.changed = true;
			me.onChanged.fire(me);
		}

		function _selLineSpacing_onchange() {
			me.style.lineSpacing = parseFloat(_selLineSpacing.value);

			me.changed = true;
			me.onChanged.fire(me);
		}

		function _colorPicker_onColorChanged() {

			me.style.color = _colorPicker.color;

			me.changed = true;
			me.onChanged.fire(me);

		}

		return me;
	};
}