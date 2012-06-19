define(["jquery", "underscore", "backbone", "constants"], function(e, i, k) {
	var l = RegExp("^[^\u0591-\u07ff\ufb1d-\ufdfd\ufe70-\ufefc]*[A-Za-z\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u02b8\u0300-\u0590\u0800-\u1fff\u2c00-\ufb1c\ufdfe-\ufe6f\ufefd-\uffff]"),
		m = RegExp("^[^A-Za-z\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u02b8\u0300-\u0590\u0800-\u1fff\u2c00-\ufb1c\ufdfe-\ufe6f\ufefd-\uffff]*[\u0591-\u07ff\ufb1d-\ufdfd\ufe70-\ufefc]");
	return k.View.extend({
		tagName: "div",
		className: "autocomplete",
		events: {
			"click input": "toggle",
			"focusout input": "inputboxFocusOut",
			"focusin input": "inputboxFocusIn",
			"click .autocomplete-list li": "choosebymouse",
			"mouseenter .autocomplete-list li": "hoverin",
			"mouseleave .autocomplete-list li": "hoverout",
			"keydown input": "keydown",
			"keyup input": "keyup"
		},
		initialize: function(a) {
			this.grayedTextArtificialInterval = this.artificialCaret = this.grayedText = this.loadingElement = this.lastText = this.autocompleteRequest = null;
			this.autoCompleteCache = {};
			this.autoCompleteCachePriority = 0;
			this.textDir = "ltr";
			this.hideCallback = a.hideCallback
		},
		inputboxFocusOut: function() {
			this.taskBoxHideTimeout = setTimeout(i.bind(function() {
				this.hideCallback()
			}, this), 250)
		},
		inputboxFocusIn: function() {
			null != this.taskBoxHideTimeout && (clearTimeout(this.taskBoxHideTimeout), this.taskBoxHideTimeout = null)
		},
		inputField: function() {
			return this.inputField
		},
		showLoading: function() {
			this.loadingElement.css("display", "block")
		},
		hideLoading: function() {
			this.loadingElement.css("display", "none")
		},
		remove: function() {
			e(this.el).remove()
		},
		show: function() {
			this.inputField.offset();
			this.autocompleteList.css("top", this.inputField.outerHeight() + 12);
			this.autocompleteList.width(this.inputField.outerWidth() + 40);
			this.autocompleteList.fadeIn("fast")
		},
		_sizeValueToPixels: function(a) {
			if (null == a) return 0;
			if ("px" == a.substr(-2)) return parseFloat(a.substr(0, a.length - 2));
			if ("em" == a.substr(-2)) console.log("_sizeValueToPixels: em conversion not implemented");
			else return parseFloat(a);
			return a
		},
		_getElemInnerPosition: function(a) {
			return {
				left: this.inputField.position().left + this._sizeValueToPixels(a.css("margin-left")) + this._sizeValueToPixels(a.css("padding-left")) + this._sizeValueToPixels(a.css("border-left-width")) + 1,
				top: this.inputField.position().top + this._sizeValueToPixels(a.css("margin-top")) + this._sizeValueToPixels(a.css("padding-top")) + this._sizeValueToPixels(a.css("border-top-width"))
			}
		},
		showGrayedText: function(a) {
			if (this.is_combined_text(this.inputField.val())) this.hideGrayedText();
			else {
				this.grayedText.html(a);
				for (var b = this.inputField.caret().start, c = e(this.grayedText)[0].childNodes, d = 0, j = 0; j < c.length; j++) if (a = c[j], null == a.tagName) {
					var f = a.nodeValue,
						h = d,
						d = d + f.length;
					if (d >= b) {
						c = f.substring(0, b - h);
						b = f.substring(b - h);
						a.parentElement.insertBefore(document.createTextNode(c), a);
						a.parentElement.insertBefore(this.artificialCaret[0], a);
						a.parentElement.insertBefore(document.createTextNode(b), a);
						a.parentElement.removeChild(a);
						break
					}
				} else a.tagName.toLowerCase();
				"rtl" == this.textDir ? this.grayedTextContainer.css({
					display: "block",
					position: "absolute",
					left: this._getElemInnerPosition(this.inputField).left + this.inputField.width() - this.grayedTextContainer.width() - 2 + "px",
					top: this._getElemInnerPosition(this.inputField).top + "px",
					direction: "rtl"
				}) : this.grayedTextContainer.css({
					display: "block",
					position: "absolute",
					left: this._getElemInnerPosition(this.inputField).left + "px",
					top: this._getElemInnerPosition(this.inputField).top + "px",
					direction: "ltr"
				});
				null != this.grayedTextArtificialInterval && (clearInterval(this.grayedTextArtificialInterval), this.grayedTextArtificialInterval = null);
				this.artificialCaret.css("display", "inline-block");
				this.grayedTextArtificialInterval = setInterval(i.bind(this._handleArtificialCaret, this), 700)
			}
		},
		_handleArtificialCaret: function() {
			this.isGrayTextShown() ? "none" == this.artificialCaret.css("display") ? this.artificialCaret.css("display", "inline-block") : this.artificialCaret.css("display", "none") : this.artificialCaret.css("display", "none")
		},
		hideGrayedText: function() {
			null != this.grayedTextArtificialInterval && (clearInterval(this.grayedTextArtificialInterval), this.grayedTextArtificialInterval = null);
			this.grayedTextContainer.css("display", "none")
		},
		isGrayTextShown: function() {
			return "none" != this.grayedTextContainer.css("display")
		},
		render: function() {
			this.mainDiv = e("<div>");
			this.inputField = e("<input>").attr("placeholder", this.options.placeholder).attr("maxlength", 1E3);
			this.autocompleteList = e("<ul>").addClass("autocomplete-list");
			this.loadingElement = e("<div>").addClass("autocomplete-loading-element");
			this.grayedTextContainer = e("<div>").addClass("autocomplete-grayed-container");
			this.grayedText = e("<div>");
			this.artificialCaret = e("<div>").addClass("autocomplete-artificial-caret");
			this.grayedTextContainer.append(this.grayedText);
			this.grayedTextContainer.append(this.artificialCaret);
			this.mainDiv.append(this.grayedTextContainer);
			this.mainDiv.append(this.loadingElement);
			this.mainDiv.append(this.autocompleteList);
			this.mainDiv.append(this.inputField);
			e(this.el).append(this.mainDiv);
			return this
		},
		hideAutoComplete: function() {
			this.hideGrayedText();
			this.autocompleteList.fadeOut("fast");
			this.autocompleteList.empty();
			this.autocompleteList.children().removeClass("selected")
		},
		getAutoCompleteCacheSize: function() {
			var a = 0;
			for (item in this.autoCompleteCache) this.autoCompleteCache[item].results && a++;
			return a
		},
		queryAutoComplete: function(a, b) {
			var c = this.autoCompleteCache[a];
			null == c ? this.queryAutoCompleteNoCache(a, i.bind(function(d) {
				c = {};
				this.autoCompleteCachePriority++;
				c.priority = this.autoCompleteCachePriority;
				c.results = d;
				this.autoCompleteCache[a] = c;
				b(d)
			}, this)) : (this.autoCompleteCachePriority++, c.priority = this.autoCompleteCachePriority, b(c.results));
			for (; 20 < this.getAutoCompleteCacheSize();) {
				var d = -1,
					e = null,
					f;
				for (f in this.autoCompleteCache) {
					var h = this.autoCompleteCache[f];
					if (-1 == d || h.priority < d) d = h.priority, e = f
				}
				if (null == e) break;
				if (!1 == delete this.autoCompleteCache[e]) break
			}
		},
		queryAutoCompleteNoCache: function(a, b) {
			this.autocompleteRequest && this.autocompleteRequest.abort();
			this.autocompleteRequest = e.ajax({
				url: this.options.app.globalConfig.getAutoCompleteServiceUrl(),
				type: "GET",
				dataType: "json",
				data: {
					term: a
				},
				success: i.bind(b, this)
			})
		},
		fixCase: function(a, b) {
			var c = a.split(" "),
				d = 0,
				e;
			for (e in c) for (var f = c[e], h = f.toLowerCase(), g = d; g < b.length; g++) if (d = g + 1, (0 == g || " " == b[g - 1]) && b.substring(g, g + f.length).toLowerCase() == h) {
				b = b.substring(0, g) + f + b.substring(g + f.length);
				break
			}
			return b
		},
		alterAutocompleteResult: function(a, b) {
			b[JSON_ITEM_FIELD_NAME] = this.fixCase(a, b[JSON_ITEM_FIELD_NAME]);
			return b
		},
		isInflationResult: function(a) {
			for (var a = e("<span>" + a[JSON_ITEM_FIELD_NAME] + "</span>")[0].childNodes, b = !1, c = 0; c < a.length; c++) if (null == a[c].tagName) {
				if (b) return !0
			} else "b" == a[c].tagName.toLowerCase() && (b = !0);
			return !1
		},
		populate: function() {
			var a = this.inputField.val(),
				b = this.autocompleteList;
			2 > a.length ? this.hideAutoComplete() : this.lastText != a && (this.lastText = a, this.showLoading(), this.hideGrayedText(), this.queryAutoComplete(a.toLowerCase(), i.bind(function(c) {
				this.hideLoading();
				b.empty();
				for (var d in c) if (c[d][JSON_ITEM_FIELD_NAME] = this.fixCase(a, c[d][JSON_ITEM_FIELD_NAME]), e("<li>").appendTo(b).html(c[d][JSON_ITEM_FIELD_NAME]), 10 == d) break;
				0 < c.length ? (this.show(), this.isInflationResult(c[0]) ? this.hideGrayedText() : this.showGrayedText(c[0][JSON_ITEM_FIELD_NAME])) : this.hideAutoComplete()
			}, this)))
		},
		is_rtl_text: function(a) {
			return m.test(a)
		},
		is_ltr_text: function(a) {
			return l.test(a)
		},
		is_combined_text: function(a) {
			for (var b = !1, c = !1, d = 0; d < a.length; d++) this.is_ltr_text(a[d]) ? b = !0 : this.is_rtl_text(a[d]) && (c = !0);
			return b && c
		},
		fixRtl: function() {
			this.is_rtl_text(this.inputField.val()) ? (this.textDir = "rtl", this.inputField.css("direction", "rtl"), this.loadingElement.removeClass("ltr"), this.loadingElement.addClass("rtl")) : (this.textDir = "ltr", this.inputField.css("direction", "ltr"), this.loadingElement.removeClass("rtl"), this.loadingElement.addClass("ltr"))
		},
		keydown: function(a) {
			switch (a.keyCode) {
			case 13:
				if (0 < this.autocompleteList.children(".selected").length) return this.choose(this.autocompleteList.children(".selected")), !1;
				break;
			case 9:
			case 39:
			case 37:
				if (37 == a.keyCode && "ltr" == this.textDir || 39 == a.keyCode && "rtl" == this.textDir) break;
				if (this.isGrayTextShown()) return this.choose(this.autocompleteList.children(":first")), a.preventDefault(), !1;
				if (9 == a.keyCode) return a.preventDefault(), !1;
				break;
			case 38:
				return this.hideGrayedText(), 0 == this.autocompleteList.children(".selected").length ? (this.autocompleteList.children().removeClass("selected"), this.autocompleteList.children(":last").addClass("selected")) : this.autocompleteList.children(".selected").removeClass("selected").prev().addClass("selected"), 0 < this.autocompleteList.children(".selected").length && (this.inputField.val(this.autocompleteList.children(".selected").text()), this.lastText = this.inputField.val()), a.preventDefault(), !1;
			case 40:
				return this.hideGrayedText(), 0 == this.autocompleteList.children(".selected").length ? (this.autocompleteList.children().removeClass("selected"), this.autocompleteList.children(":first").addClass("selected")) : this.autocompleteList.children(".selected").removeClass("selected").next().addClass("selected"), 0 < this.autocompleteList.children(".selected").length && (this.inputField.val(this.autocompleteList.children(".selected").text()), this.lastText = this.inputField.val()), a.preventDefault(), !1;
			case 27:
				return this.hideAutoComplete(), !1
			}
		},
		keyup: function() {
			this.hideGrayedText();
			this.fixRtl();
			this.populate()
		},
		choosebymouse: function(a) {
			this.inputField.focus();
			this.choose(e(a.target));
			return !1
		},
		choose: function(a) {
			a = a.text();
			this.lastText = "";
			this.autocompleteList.children().removeClass("selected");
			this.inputField.val(a);
			this.inputField.focus();
			this.hideAutoComplete();
			this.populate()
		},
		hoverin: function(a) {
			this.autocompleteList.children().removeClass("selected");
			e(a.target).addClass("selected")
		},
		hoverout: function() {
			this.autocompleteList.children().removeClass("selected")
		},
		toggle: function() {
			this.autocompleteList.toggle()
		}
	})
});