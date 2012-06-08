with($ns("fs.ui.renderers")) {
	fs.ui.renderers.FeedListRenderer = function (p_control) {
		var me = this;


		me.control = p_control;
		me.container = p_control.container;

		me.renderListItem = function (f, p_container) {};

		me.renderAsRead = function (f, p_container) {};

		me.renderAsSelected = function (f, p_container) {};

		me.renderAsUnselected = function (f, p_container) {};


		me.renderAsFavourites = function (f, p_container) {};

		me.renderAsNonFavourites = function (f, p_container) {};

		me._hasRead = function (f) {
			return !fs.bg.Storage.unreads.contains(f.id);
		};

		me._getContent = function (f) {
			var content = f.content;
			if (content != null && content.endsWith("<hr size=\"1\"></p>")) {
				try {
					content = content.substr(0, content.length - 17) + "</p>";
				}
				catch (e) {}
			}
			return content != null ? content : null;
		};


		return me;
	};

	fs.ui.renderers.FeedListRenderer.applyPrefStyle = function (styleSheet, name) {
		styleSheet.fontFamily = fs.Pref.getSetting("styles", name, "fontFamily");
		styleSheet.fontSize = fs.Pref.getSetting("styles", name, "fontSize") + "px";
		styleSheet.fontStyle = fs.Pref.getSetting("styles", name, "fontStyle");
		styleSheet.fontWeight = fs.Pref.getSetting("styles", name, "fontWeight");
		styleSheet.color = fs.Pref.getSetting("styles", name, "color");

		var lineSpacing = fs.Pref.getSetting("styles", name, "lineSpacing");
		if (lineSpacing) {
			styleSheet.lineHeight = (lineSpacing * fs.Pref.getSetting("styles", name, "fontSize") + 2) + "px";
		}
	};

	fs.ui.renderers.FeedListRenderer.applyStyle = function (styleSheet, styleObject) {
		if (styleObject.fontFamily) {
			styleSheet.fontFamily = styleObject.fontFamily;
		}

		if (styleObject.fontSize) {
			styleSheet.fontSize = styleObject.fontSize + "px";
		}

		if (styleObject.fontStyle) {
			styleSheet.fontStyle = styleObject.fontStyle;
		}

		if (styleObject.fontWeight) {
			styleSheet.fontWeight = styleObject.fontWeight;
		}

		if (styleObject.color) {
			styleSheet.color = styleObject.color;
		}

		if (styleObject.lineSpacing) {
			styleSheet.lineHeight = (styleObject.lineSpacing * styleObject.fontSize + 2) + "px";
		}
	};
}