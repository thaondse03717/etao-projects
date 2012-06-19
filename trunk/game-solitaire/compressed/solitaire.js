(function () {
	this.Tab = new Class({
		Implements: [Options, Events],
		options: {
			tabs_button: "",
			tabs_content: "",
			default_tab: 0,
			active_tab_class: ""
		},
		initialize: function (a) {
			this.setOptions(a);
			this.tabs_button = $$(this.options.tabs_button);
			this.tabs_content = $$(this.options.tabs_content);
			this.initEvents();
			this.setDefaultTab()
		},
		show: function (a) {
			this.tabs_button[a].show()
		},
		hide: function (a) {
			if (!(this.tabs_button.length <= 1)) {
				this.changeTab(a > 0 ? 0 : 1);
				this.tabs_button[a].hide();
				this.tabs_content[a].hide()
			}
		},
		initEvents: function () {
			this.tabs_button.each(function (a, b) {
				a.get("tag") == "select" ? a.addEvent("change", function () {
					this.changeTab(a.selectedIndex)
				}.bind(this)) : a.addEvent("click", function (d) {
					this.changeTab(b);
					d.target.blur();
					d.preventDefault()
				}.bind(this))
			}.bind(this))
		},
		changeTab: function (a) {
			this.tabs_button.each(function (b, d) {
				a == d ? b.addClass(new String(this.options.active_tab_class)) : b.removeClass(this.options.active_tab_class)
			}.bind(this));
			this.tabs_content.each(function (b, d) {
				b[a == d ? "show" : "hide"]()
			}.bind(this));
			this.fireEvent("onChange", [a])
		},
		setDefaultTab: function () {
			this.changeTab(this.options.default_tab)
		}
	})
}).call(Solitaire);
(function () {
	this.Builder = new Class({
		buildDomModel: function (a, b, d, c) {
			var e, f;
			if (typeOf(a) == "string") a = $(a);
			if (b.tag) {
				c || (e = document.createDocumentFragment());
				var g;
				g = b.tag == "textNode" ? document.createTextNode("") : new Element(b.tag);
				for (var h in b) switch (h) {
				case null:
				case "tag":
				case "childs":
					break;
				case "show":
				case "hide":
					g[h]();
					break;
				case "rel":
				case "colspan":
				case "scrolling":
				case "frameborder":
				case "vspace":
				case "hspace":
				case "marginheight":
				case "marginwidth":
				case "allowtransparency":
					g.set(h, b[h]);
					break;
				case "styles":
					g.setStyles(b[h]);
					break;
				case "html":
					g.innerHTML = b.html;
					break;
				case "store":
					for (f in b[h]) g.store(f, b[h][f]);
					break;
				case "events":
					b[h].each(function (i) {
						for (var j in i) g.addEvent(j, i[j])
					}.bind(this));
					break;
				default:
					if (/^data-/.test(h)) g.set(h, b[h]);
					else g[h] = b[h]
				}
				switch (d) {
				case "after":
				case "before":
				case "top":
				case "bottom":
					g.inject(a, d);
					break;
				default:
					if (a) c ? a.appendChild(g) : e.appendChild(g)
				}
				b.childs && this.buildDomModel(g, b.childs, null, true);
				!c && a && a.appendChild(e);
				return g
			} else if (typeof b == "object") for (f in b) this.buildDomModel(a, b[f], null, true);
			return null
		}
	})
}).call(Solitaire);
(function () {
	this.Storage = new Class({
		_preKey: "solitaire_storage:",
		storage: null,
		initialize: function (a) {
			if (a) this._preKey += a + ":";
			this._test()
		},
		get: function (a) {
			return this.storage.getItem(this._preKey + a)
		},
		set: function (a, b) {
			this.storage.setItem(this._preKey + a, b);
			return true
		},
		clear: function (a) {
			this.storage.removeItem(this._preKey + a);
			return true
		},
		_test: function () {
			try {
				localStorage.setItem(this._preKey, "ok");
				if (localStorage.getItem(this._preKey) == "ok") this.storage = localStorage;
				else throw "Else";
			} catch (a) {
				this.storage = {
					setItem: function (b, d) {
						Cookie.write(b, d, {
							duration: 360
						})
					},
					getItem: function (b) {
						Cookie.read(b)
					},
					removeItem: function (b) {
						Cookie.dispose(b)
					}
				}
			}
		}
	})
}).call(Solitaire);
(function () {
	Fx.Shadow = new Class({
		Extends: Fx.Morph,
		step: function (a) {
			var b;
			b = Browser.firefox4 ? "-moz-box-shadow" : Browser.chrome || Browser.safari ? "-webkit-box-shadow" : "box-shadow";
			if (this.options.frameSkip) {
				var d = (this.time != null ? a - this.time : 0) / this.frameInterval;
				this.time = a;
				this.frame += d
			} else this.frame++;
			if (this.frame < this.frames) {
				a = this.compute(this.from, this.to, this.transition(this.frame / this.frames));
				this.set(a)
			} else {
				a = this.compute(this.from, this.to, 1);
				this.frame = this.frames;
				this.set(a);
				this.stop()
			}
			this.element.setStyle(b, "#000000 " + Math.round(a.test[0].value / 5) + "px " + Math.round(a.test[0].value / 4.16) + "px " + Math.round(a.test[0].value / 2.083) + "px -6px")
		}
	})
}).call(Solitaire);
(function () {
	this.CrossRequest = new Class({
		Implements: [Options, Events],
		Binds: ["onRequestComplete", "onRequestFailure"],
		options: {
			url: "",
			method: "post",
			data: {}
		},
		initialize: function (a) {
			this.setOptions(a)
		},
		send: function () {
			var a = function () {},
				b = "onprogress" in new Browser.Request,
				d, c = "http://" + location.host == FULLADDR;
			d = Browser.ie && !c ? new XDomainRequest : new Browser.Request;
			try {
				if (Browser.ie && !c) d.open(this.options.method.toUpperCase(), this.options.url);
				else {
					d.open(this.options.method.toUpperCase(), this.options.url, true);
					d.withCredentials = true
				}
				d.onreadystatechange = function () {
					if (d.readyState == 4) {
						var f = 0;
						Function.attempt(function () {
							var h = d.status;
							f = h == 1223 ? 204 : h
						}.bind(this));
						d.onreadystatechange = a;
						if (b) d.onprogress = d.onloadstart = a;
						var g = {
							text: d.responseText || "",
							xml: d.responseXML
						};
						if (f >= 200 && f < 300) this.onRequestComplete(JSON.decode(g.text), g.xml);
						else this.onRequestFailure()
					}
				}.bind(this);
				d.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=utf-8");
				d.send(Object.toQueryString(this.options.data))
			} catch (e) {}
			return this
		},
		onRequestComplete: function (a, b) {
			this.fireEvent("complete", [a, b])
		},
		onRequestFailure: function () {
			this.fireEvent("failure")
		}
	})
}).call(Solitaire);
(function () {
	this.Filter = this.Filter || {};
	this.Filter.Base = new Class({
		Implements: Options,
		options: {
			element_event: "keyup",
			element_property: "value",
			add_event: true
		},
		initialize: function (a, b) {
			this.element = $(a) ? $(a) : a;
			this.setOptions(b);
			this.initEvents()
		},
		initEvents: function () {
			this.options.add_event && typeOf(this.element) == "element" && this.element.addEvent(this.options.element_event, this._filter.bind(this))
		},
		set: function (a) {
			if (typeOf(this.element) == "element") {
				var b = this.element.selectionStart;
				this.element.set(this.options.element_property, a);
				this.element.selectionStart = b;
				this.element.selectionEnd = b
			}
			return a
		},
		_filter: function (a) {
			if (a) {
				if (a.type.test(/^key/)) if (~ [37, 38, 40, 39, 17].indexOf(a.code) || a.control && a.key == "a") return;
				this.filter(a.target.get(this.options.element_property))
			}
		}
	});
	this.Filter.LowerCase = new Class({
		Implements: this.Filter.Base,
		filter: function (a) {
			return this.set(a.toLowerCase())
		}
	});
	this.Filter.UpperCase = new Class({
		Implements: this.Filter.Base,
		filter: function (a) {
			return this.set(a.toUpperCase())
		}
	});
	this.Filter.Number = new Class({
		Implements: this.Filter.Base,
		filter: function (a) {
			var b = RegExp("[^0-9]", "g");
			if (b.exec(a)) return this.set(a.replace(b, ""));
			return false
		}
	});
	this.Filter.StringAndNumber = new Class({
		Implements: this.Filter.Base,
		filter: function (a) {
			if (!this.options.allow_uppercase) {
				a = a.toLowerCase();
				this.set(a)
			}
			var b = RegExp("[^a-z0-9]", "g");
			if (b.exec(a)) return this.set(a.replace(b, ""));
			return false
		}
	});
	this.Filter.StringNumberSpace = new Class({
		Implements: this.Filter.Base,
		filter: function (a) {
			if (!this.options.allow_uppercase) {
				a = a.toLowerCase();
				this.set(a)
			}
			var b =
			RegExp("[^a-z0-9 ]", "g");
			if (b.exec(a)) return this.set(a.replace(b, ""));
			return false
		}
	});
	this.Filter.Regex = new Class({
		Implements: this.Filter.Base,
		filter: function (a, b, d) {
			b = RegExp(b, d);
			if (b.exec(a)) return this.set(a.replace(b, ""));
			return false
		}
	});
	this.Filter.Url = new Class({
		Implements: this.Filter.Base,
		filter: function (a) {
			a.match(/http:\/\//) || (a = this.set("http://" + a));
			return a
		}
	});
	this.Filter.MaxLength = new Class({
		Implements: this.Filter.Base,
		filter: function (a) {
			var b = this.options.length || false,
				d = a.length;
			if (b) if (d >= b) a = this.set(a.substr(0, b));
			return a
		}
	});
	this.Filter.Nl2Br = new Class({
		Implements: this.Filter.Base,
		filter: function (a) {
			a || (a = typeOf(this.element) == "element" ? this.element.get("value") : this.element);
			var b = this.options.replace_string || "<br/>";
			if (this.options.max_lines) a = a.replace(RegExp("\\n\\s{" + (this.options.max_lines + 1) + ",}", "g"), b.repeat(this.options.max_lines + 1));
			a = a.replace(/\n/g, b);
			return this.set(a)
		}
	});
	this.Filter.UserName = new Class({
		Implements: this.Filter.Base,
		filter: function (a) {
			var b =
			RegExp("[ `\\~!\\%\\(\\)\\[\\]\\{\\}\\<\\>\\?\\/\\\"\\']", "g");
			if (b.exec(a)) return this.set(a.replace(b, ""));
			return false
		}
	})
}).call(Solitaire);
(function () {
	var a = function (b, d, c) {
		switch (typeOf(c)) {
		case "object":
			if (c.$constructor) {
				b[d] = c;
				break
			}
			if (typeOf(b[d]) == "object") Object.mergeExcludeClass(b[d], c);
			else b[d] = Object.clone(c);
			break;
		case "array":
			b[d] = c.clone();
			break;
		default:
			b[d] = c
		}
		return b
	};
	Object.extend({
		mergeExcludeClass: function (b, d, c) {
			if (typeOf(d) == "string") return a(b, d, c);
			for (var e = 1, f = arguments.length; e < f; e++) {
				var g = arguments[e],
					h;
				for (h in g) a(b, h, g[h])
			}
			return b
		}
	})
}).call();
(function () {
	var a = {},
		b, d;
	b = function (c, e) {
		var f = null,
			g;
		if (e === undefined) e = a;
		for (g in e) if (e.hasOwnProperty(g) && c[0] == g) {
			if (c.length <= 1) {
				f = e[g];
				break
			}
			e = e[g];
			if (e === null || e === undefined) {
				f = null;
				break
			}
			c = c.erase(g);
			f = c.length == 1 ? e[c] === undefined ? null : e[c] : b(c, e);
			break
		}
		return f
	};
	d = function (c, e) {
		var f = {},
			g, h;
		c = c.reverse();
		h = c.length;
		for (g = 0; g < h; g++) if (g == 0) f[c[0]] = e;
		else {
			f[c[g]] = Object.clone(f);
			delete f[c[g - 1]]
		}
		a = Object.mergeExcludeClass(a, f);
		e.$constructor && eval('data["' + c.reverse().join('"]["') + '"] = value;')
	};
	this.Store = {
		get: function (c, e) {
			var f = b(c.split("."));
			return f !== null ? f : e === undefined ? null : e
		},
		set: function (c, e) {
			d(c.split("."), e);
			return this
		},
		erase: function (c) {
			d(c.split("."), null);
			return this
		},
		fromJson: function (c) {
			a = Object.mergeExcludeClass(a, c || {});
			return this
		}
	};
	Object.each(this.Store, function (c, e) {
		Solitaire[e] = c
	})
}).call(Solitaire);
var $stop = function (a) {
	a.stop()
};
Browser.isMobile = !["mac", "linux", "win"].contains(Browser.Platform.name);
String.implement({
	ucFirst: function () {
		return this.substr(0, 1).toUpperCase() + this.substr(1, this.length)
	}
});
Number.implement({
	toTime: function () {
		var a = "00",
			b = "00",
			d = "00";
		b = this % 60;
		a = Math.floor(this / 60) % 60;
		d = Math.floor(this / 3600);
		return {
			sec: b < 10 ? "0" + b : b,
			min: a < 10 ? "0" + a : a,
			hour: d < 10 ? "0" + d : d
		}
	}
});
Array.implement({
	copyAppend: function () {
		return this.append(this)
	}
});
(function () {
	this.DragMove = new Class({
		Extends: Drag.Move,
		checkDroppables: function () {
			var a = this.element.getCoordinates();
			this.overed = this.droppables.filter(function (b, d) {
				b = this.positions ? this.positions[d] : this.getDroppableCoordinates(b);
				return a.right > b.left && a.left < b.right && a.bottom > b.top && a.top < b.bottom
			}, this)
		}
	})
}).call(Solitaire);
(function () {
	this.CssLoader = new Class({
		Implements: [Options, Events],
		options: {
			className: "",
			cssTestProp: "_css-loader",
			cssTestValue: 3
		},
		initialize: function (a, b) {
			this.setOptions(b);
			this.path = a;
			this._load()
		},
		getElement: function () {
			return this.link
		},
		_createLinkElement: function () {
			this.link = new Element("link", {
				type: "text/css",
				rel: "stylesheet",
				href: this.path
			});
			this.options.className && this.link.addClass(this.options.className);
			return this.link
		},
		_load: function () {
			var a = this._createLinkElement(),
				b, d, c;
			b = new Element("div", {
				styles: {
					position: "absolute",
					top: -100,
					left: -100,
					display: "block"
				},
				"class": this.options.cssTestProp
			});
			document.body.appendChild(b);
			document.head.appendChild(a);
			d = function () {
				c = b.getStyle("height").toInt();
				if (Browser.opera) c = b.getHeight();
				if (c == this.options.cssTestValue) {
					clearInterval(d);
					b.destroy();
					this.fireEvent("load", [a])
				}
			}.periodical(50, this)
		}
	})
}).call(Solitaire);
(function () {
	var a, b = true,
		d, c = {},
		e = true;
	a = function (f) {
		var g = f.changedTouches[0],
			h = f.type,
			i;
		switch (f.type) {
		case "touchstart":
			h = "mousedown";
			break;
		case "touchmove":
			h = "mousemove";
			break;
		case "touchend":
			h = "mouseup";
			break;
		case "touchcancel":
			h = "mouseup";
			break;
		default:
			return
		}
		i = document.createEvent("MouseEvent");
		i.initMouseEvent(h, true, true, window, 0, g.screenX, g.screenY, g.clientX, g.clientY, false, false, false, false, 0, null);
		g.target.dispatchEvent(i);
		e && f.preventDefault();
		if (h == "mouseup" && b) {
			f = "click";
			if ((new Date).getTime() - d < c.simulatedDblClickTimeout) f = "dblclick";
			d = (new Date).getTime();
			i = document.createEvent("MouseEvent");
			i.initMouseEvent(f, true, true, window, 0, g.screenX, g.screenY, g.clientX, g.clientY, false, false, false, false, 0, null);
			g.target.dispatchEvent(i)
		}
	};
	this.MouseEventSimulator = {
		init: function (f) {
			c = Object.merge({
				simulatedDblClickTimeout: 300
			}, f || {});
			if (!Browser.ie) {
				f = $(document);
				f.addEventListener("touchstart", a, true);
				f.addEventListener("touchmove", a, true);
				f.addEventListener("touchend", a, true);
				f.addEventListener("touchcancel", a, true)
			}
		},
		simulateClickEvent: function (f, g) {
			(function () {
				b = f
			}).delay(g || 10)
		},
		preventEvent: function (f) {
			e = f
		}
	};
	this.MouseEventSimulator.init()
}).call(Solitaire);
(function () {
	this.Type = {};
	this.Type.Base = new Class({
		name: "",
		variant: null,
		app: null,
		foundationContainer: "dock_section",
		tableauContainer: "board_section",
		_blockerDelay: 0,
		initialize: function (a) {
			this.variant = a;
			this.foundationContainer = $(this.foundationContainer);
			this.tableauContainer = $(this.tableauContainer);
			this.undoControl = new Solitaire.Control.Undo;
			this._buildHtml()
		},
		getName: function () {
			return this.name
		},
		getVariant: function () {
			return this.variant
		},
		getId: function () {
			return this.name + (this.variant ? ":" + this.variant : "")
		},
		setApplication: function (a) {
			this.app = a
		},
		isMoveAllowed: function () {},
		getDealRules: function () {
			return this.rules.deal_base
		},
		getCardIds: function () {
			return this.rules.deck_ids
		},
		getCardColors: function () {
			return this.rules.deck_colors
		},
		isAllowedToPuttingToFoundation: function () {
			return this.rules.allow_putting_to_foundation
		},
		isEnabledAutoMoveObvious: function () {
			return this.rules.enable_auto_move_obvious
		},
		isAllCardsFrontOnDelt: function () {
			return this.rules.all_cards_front_on_delt
		},
		isAllowReloopStack: function () {
			return this.rules.unlimited_stack_loop_count
		},
		getFoundationPileCount: function () {
			return this.rules.number_of_foundation_piles
		},
		getReverseRuleFoundationById: function (a, b) {
			var d = null;
			Object.each(this.rules.foundation, function (c, e) {
				var f = this._extractId(c[0]);
				if (this._isEqual(f.symbol, f.color, a)) d = e
			}.bind(this));
			if (b) return this._extractId(d);
			return d
		},
		getRuleBoardById: function () {},
		getRules: function (a, b, d) {
			var c = [];
			Object.filter(this.rules[d], function (e, f) {
				this._isEqual(a, b, f) && c.push(e)
			}.bind(this));
			return c
		},
		moveToFoundation: function () {},
		isFitsToRules: function (a, b, d) {
			var c = d ? true : a.isInFoundation();
			d = this.getRules(a.getSymbol(), a.getColor(), c ? "foundation" : "tableau");
			var e = false;
			d && d.flatten().each(function (f) {
				if (f == "empty") if (typeOf(b) == "element") {
					if (a.isInTableau() && b.hasClass("blank_tableau") && !c) e = true;
					if (c && b.hasClass("blank_foundation") && !this.app.foundation.getCardBySlotElement(b)) e = true
				}
				if (b instanceof Solitaire.Card && f != "empty") if (this._isEqual(b.getSymbol(), b.getColor(), f)) if (c && b.isInFoundation()) e = true;
				else if (!c && b.isInTableau()) e = true
			}.bind(this));
			return e
		},
		reset: function () {
			this.undoControl.reset()
		},
		moveAllowed: function () {},
		_isEqual: function (a, b, d) {
			d = this._extractId(d);
			if (a != d.symbol) return false;
			if (d.color == "a" || b == "a") return true;
			if (this._isBlackColor(b) && d.color == "b") return true;
			if (this._isRedColor(b) && d.color == "r") return true;
			if (b.substr(0, 1) == d.color) return true;
			return false
		},
		_extractId: function (a) {
			if (a === false) return {};
			if (a = a.match(/(A|K|Q|J|\d+)(\w+)/)) return {
				symbol: a[1],
				color: a[2]
			};
			return {
				symbol: null,
				color: null
			}
		},
		_isBlackColor: function (a) {
			a =
			a.substr(0, 1);
			return a == "c" || a == "s"
		},
		_isRedColor: function (a) {
			a = a.substr(0, 1);
			return a == "h" || a == "d"
		},
		_buildHtml: function () {
			var a, b;
			this.foundationContainer.getChildren().destroy();
			this.tableauContainer.getChildren().destroy();
			b = document.createDocumentFragment();
			for (a = 0; a < this.getFoundationPileCount(); a++) b.appendChild(this._getBlankCard("foundation", !a));
			this.foundationContainer.appendChild(b);
			b = document.createDocumentFragment();
			for (a = 0; a < this.getDealRules().length; a++) b.appendChild(this._getBlankCard("tableau", !a));
			this.tableauContainer.appendChild(b)
		},
		_getBlankCard: function (a, b) {
			return new Element("div", {
				"class": "blank " + ("blank_" + a) + (b ? " blank_" + a + "_first" : "")
			})
		},
		_blockTurn: function () {
			this._blockerDelay = 0;
			this._turnBlocker = true
		},
		_isTurnBlocked: function () {
			return this._turnBlocker
		},
		_unblockTurn: function (a) {
			a = a || 50;
			if (a > this._blockerDelay) this._blockerDelay = a;
			clearTimeout(this._blockerTimer);
			this._blockerTimer = function () {
				this._turnBlocker = false
			}.delay(this._blockerDelay, this)
		}
	})
}).call(Solitaire);
(function () {
	this.Type.Klondike = new Class({
		Extends: this.Type.Base,
		name: "klondike",
		rules: {
			deal_base: [1, 2, 3, 4, 5, 6, 7],
			deck_ids: [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"],
			deck_colors: ["club", "spade", "diamond", "heart"],
			number_of_foundation_piles: 4,
			allow_putting_to_foundation: true,
			enable_auto_move_obvious: true,
			unlimited_stack_loop_count: true,
			foundation: {
				Aa: ["empty"],
				Kc: ["Qc"],
				Ks: ["Qs"],
				Kh: ["Qh"],
				Kd: ["Qd"],
				Qc: ["Jc"],
				Qs: ["Js"],
				Qh: ["Jh"],
				Qd: ["Jd"],
				Jc: ["10c"],
				Js: ["10s"],
				Jh: ["10h"],
				Jd: ["10d"],
				"10c": ["9c"],
				"10s": ["9s"],
				"10h": ["9h"],
				"10d": ["9d"],
				"9c": ["8c"],
				"9s": ["8s"],
				"9h": ["8h"],
				"9d": ["8d"],
				"8c": ["7c"],
				"8s": ["7s"],
				"8h": ["7h"],
				"8d": ["7d"],
				"7c": ["6c"],
				"7s": ["6s"],
				"7h": ["6h"],
				"7d": ["6d"],
				"6c": ["5c"],
				"6s": ["5s"],
				"6h": ["5h"],
				"6d": ["5d"],
				"5c": ["4c"],
				"5s": ["4s"],
				"5h": ["4h"],
				"5d": ["4d"],
				"4c": ["3c"],
				"4s": ["3s"],
				"4h": ["3h"],
				"4d": ["3d"],
				"3c": ["2c"],
				"3s": ["2s"],
				"3h": ["2h"],
				"3d": ["2d"],
				"2c": ["Ac"],
				"2s": ["As"],
				"2h": ["Ah"],
				"2d": ["Ad"]
			},
			tableau: {
				Aa: [false],
				Kr: ["empty"],
				Kb: ["empty"],
				Qr: ["Kb"],
				Qb: ["Kr"],
				Jr: ["Qb"],
				Jb: ["Qr"],
				"10r": ["Jb"],
				"10b": ["Jr"],
				"9r": ["10b"],
				"9b": ["10r"],
				"8r": ["9b"],
				"8b": ["9r"],
				"7r": ["8b"],
				"7b": ["8r"],
				"6r": ["7b"],
				"6b": ["7r"],
				"5r": ["6b"],
				"5b": ["6r"],
				"4r": ["5b"],
				"4b": ["5r"],
				"3r": ["4b"],
				"3b": ["4r"],
				"2r": ["3b"],
				"2b": ["3r"]
			}
		},
		deal: function () {
			this.app.sound.play("deal", 300, 100);
			this._unblockTurn()
		},
		turnOver: function (a, b) {
			var d, c, e, f, g = this.app.deck,
				h = a;
			if (this._isTurnBlocked()) return [];
			this._blockTurn();
			this.app.sound.play("drop", 250);
			c = g._newDeckLoop;
			f = this.getVariant() == "turn-one" ? 1 : 3;
			if (f > 1) if (b) {
				if (g.freeCards.length) if (g.freeCards.getLast().getId() == a.getId() && (g.freeCards.length % 3 == 1 || g.undoCardsCountColl[g.stackLoopCount] == 1)) {
					a.setReversed(true, true, true);
					a.setZIndex(g.getZIndex());
					this._showCard.call(this, a, 0, true);
					a.addEvent("movedComplete:once", function () {
						this._unblockTurn()
					}.bind(this))
				}
				for (e = f - 1; e >= 0; e--) if (d = g.getNextFreeCard(a, e)) {
					d.setReversed(true, true, true);
					a.setZIndex(g.getZIndex());
					this._showCard.call(this, d, e, true)
				}
				c || g.updateStack(a, b, f)
			} else {
				this._showCard.call(this, a, 0, b);
				for (e = d = 1; e < f; e++) if (a) if (g.getNextFreeCard(a)) {
					a = g.getNextFreeCard(a);
					this._showCard.call(this, a, e, b);
					d++
				}
				a.attachDrag();
				g.updateStack(a, b, d)
			} else {
				a.updateDroppables();
				e = g.getShowedCardStackPos(b);
				a.addEvent("movedComplete:once", function (i) {
					(function () {
						if (!c) {
							i[b ? "detachDrag" : "attachDrag"]();
							this._unblockTurn()
						}
					}).delay(50, this)
				}.bind(this));
				a.setPosition(e, false, true, false);
				a.setReversed(b, true, true);
				g.updateStack(a, b);
				if (b)(e = g.getPrevFreeCard(a)) && e.setZIndex(g.getZIndex());
				a.setZIndex(g.getZIndex())
			}
			g.showedCardInStack = b ? g.getPrevFreeCard(a) : a;
			b || this.undoControl.add("deck", {
				movedCards: [h],
				loopIndex: g.stackLoopCount
			});
			return [h]
		},
		_showCard: function (a, b, d) {
			var c = this.app.deck,
				e = c.getShowedCardStackPos(d);
			if (typeOf(b) == "number" && !d) e.left += 20 * b;
			a.detachDrag();
			a.show();
			a.addEvent("movedComplete:once", function (f) {
				f.setReversed(d ? true : false);
				if (!d) {
					clearTimeout(this._showCardTimer);
					this._showCardTimer = function () {
						this._unblockTurn()
					}.delay(500, this)
				}
			}.bind(this));
			a.setPosition(e, false, true);
			d || a.setZIndex(c.getZIndex(d))
		},
		moveToFoundation: function (a) {
			var b = this.app.deck;
			if (this.isAllowedToPuttingToFoundation()) if (!(a.isReversed() || a.getNextCard() || this._isTurnBlocked())) {
				if (a.isInWaste() && b) {
					if (!b.getShowedCardInStack()) return;
					if (b.getShowedCardInStack().getElement() != a.getElement()) return
				}
				var d = b.getCard("A", a.getColor());
				if (d.length) for (b = 0; b < d.length; b++) {
					if (d[b].getElement() == a.getElement()) if (this.isMoveAllowed(a, this.app.foundation.getFreeSlot(), true)) {
						this.app.checkMove(a, this.app.foundation.getFreeSlot(), true, true);
						break
					}
					if (d[b].isFounded()) if (this.isMoveAllowed(a, d[b].getLastCard(), true)) {
						this.app.checkMove(a, d[b].getLastCard(), true, true);
						break
					}
				}
			}
		},
		removeCardFromStack: function (a) {
			var b = this.app.deck;
			b.updateStack(a, false, 4);
			var d = b.getPrevFreeCard(a);
			if (d) {
				b.showedCardInStack = d;
				d.drag.attach()
			}
			b.updateOpenedFreeCardPos(a);
			b.freeCards = b.freeCards.filter(function (c) {
				return a.getElement() != c.getElement()
			})
		},
		updateStack: function (a, b, d) {
			var c = this.app.deck;
			if (a) {
				d = d ? d : 3;
				var e, f = 0,
					g = false,
					h, i;
				i = this.getVariant() == "turn-one" ? 1 : 3;
				h = a.getZIndex();
				if (h > a.maxZIndex - 1E3) h = a.lastZIndex;
				if (b) {
					++d;
					for (e = c.getNextFreeCard(a, 4); e;) {
						e.hide();
						e = c.getNextFreeCard(e)
					}
				} else if (e = c.getNextFreeCard(a)) {
					e.drag.detach();
					e.show();
					if (i == 1) {
						e.setZIndex(c.getZIndex());
						if (Browser.isMobile) {
							var j = c.getNextFreeCard(e);
							if (j) {
								j.show();
								j.setZIndex(e.getZIndex() - 1)
							}
						}
					}
				}
				if (i == 1) e = c._newDeckLoop ? a : c.getPrevFreeCard(a);
				else(e = c._newDeckLoop ? null : c.getPrevFreeCard(a)) || a.attachDrag();
				c._newDeckLoop = false;
				a = c.getShowedCardStackPos(false);
				for (a.left += 60; e;) {
					f++;
					if (f < d) {
						e.setReversed(false, false);
						e[b && !g ? "attachDrag" : "detachDrag"]();
						e.show();
						f + 1 == d && i > 1 && !b && e.setPosition(c.getNextFreeCard(e).getElement(), false, false);
						e.setZIndex(--h);
						if (b && i > 1) {
							a.left -= 20;
							e.setPosition(Object.merge({}, a), false, false)
						}
						g = true
					} else {
						e.setReversed(true);
						Browser.ie ? e.setZIndex(b ? --h : 0) : e.setZIndex(--h);
						e.hide()
					}
					e = c.getPrevFreeCard(e)
				}
			}
		},
		moveAllowed: function (a, b, d) {
			var c = false,
				e, f, g, h, i = null;
			if (a == "old_pile") {
				e = this.app.deck.getFreeCards().invoke("getElement").indexOf(b.getElement());
				f = b.getPrevCard();
				g = Object.merge({}, b.retPosition);
				h = b.lastZIndex !== null ? b.lastZIndex : b.getZIndex();
				if (f) {
					if (f.isReversed()) c = true;
					this.app.isRunningAutoMoveObvious() || f.attachDrag()
				} else i = this.app.tableau.getSlotIdByCard(b);
				this._undoData = {
					cardStackPos: e,
					lastPrev: f,
					lastPos: g,
					lastZIndex: h,
					lastTableauId: i,
					boardId: f ? null : this.app.tableau.getSlotIdByCard(b),
					forceFront: c,
					scores: this.app.score.getScores()
				}
			}
			if (a == "new_pile") {
				if (d instanceof Solitaire.Card) d[b.isFounded() ? "detachDrag" : "attachDrag"]();
				this._undoData.moved = b;
				this._undoData.dropped = d;
				this._undoData.foundationId = b.getFoundationId();
				this.undoControl.add("move", this._undoData);
				this._undoData = null
			}
		},
		isMoveAllowed: function (a, b, d) {
			if (!b) return false;
			if (a.getNextCard() && a.isInFoundation()) return false;
			d = this.isFitsToRules(a, b, d === undefined || d === false ? false : true);
			if (b instanceof Solitaire.Card) if (b.getNextCard()) d = false;
			d && a.addEvent("movedComplete:once", function () {
				this.app.sound.play("drop")
			}.bind(this));
			return d
		},
		isWin: function () {
			return this.app.deck.getNotFoundedCards().length == 0
		},
		undo: function () {
			var a = this.app.deck,
				b = this.app.foundation,
				d = this.app.tableau,
				c = this.app.score,
				e, f;
			if (!this._isTurnBlocked()) if (this.undoControl.hasItems()) {
				f =
				this.undoControl.get();
				e = f.data;
				if (f.type == "move") {
					this._blockTurn();
					this.app.sound.play("drop", 400);
					if (e.cardStackPos != -1) {
						a.addToStack(e.moved, e.cardStackPos);
						a.showedCardInStack = e.moved;
						e.moved.getPrevCard() || d.removeCard(e.moved)
					}
					e.dropped instanceof Solitaire.Card || d.removeCard(e.moved);
					typeOf(e.scores) == "number" && c.setScores(e.scores);
					typeOf(e.foundationId) == "number" && b.clearSlot(e.moved.foundationId);
					e.moved.setFoundation(false);
					e.moved.getPrevCard() && e.moved.getPrevCard().setNextCard(null);
					if (e.lastPrev) {
						if (e.lastPrev.isFront() && !e.lastPrev.isFounded()) if (b = e.lastPrev.getPrevCard()) b.isReversed() && e.lastPrev.setReversed(true);
						else {
							e.dropped instanceof Solitaire.Card && e.dropped.isReversed() && e.dropped.setReversed(false);
							e.forceFront && e.lastPrev.setReversed(true)
						}
						e.moved.setPrevCard(e.lastPrev, false);
						e.moved.step = e.lastPrev.step;
						e.lastPrev.setNextCard(e.moved)
					} else {
						e.moved.setPrevCard(null);
						e.cardStackPos == -1 && d.setCardBySlotId(e.moved, e.lastTableauId)
					}
					b = e.moved.getNextCard();
					e.moved.attachDrag();
					e.moved.addEvent("movedComplete:once", function (g) {
						e.cardStackPos != -1 && g.setZIndex(a.getZIndex());
						this._unblockTurn();
						a.updateOpenedFreeCardPos(g, true);
						this.app._setStep()
					}.bind(this));
					if (b) e.moved.setUndoPosition(e.lastPos);
					else e.lastPrev ? e.moved.setPosition({
						left: e.lastPos.left,
						top: e.lastPrev.getElement().getTop() + (e.lastPrev.inFoundation ? 0 : e.lastPrev.step)
					}, true, true, true) : e.moved.setPosition(e.lastPos, true, true, true)
				}
				if (f.type == "deck") {
					b = this.undoControl.getNearby("deck") || {
						data: {}
					};
					if (a.stackLoopCount > 0 && b.data.loopIndex != a.stackLoopCount) {
						e.movedCards[0].addEvent("movedComplete:once", function () {
							e.movedCards[0].addEvent("movedComplete:once", function () {
								a.getShowedCardInStack() && this.undoControl.add(f.type, e);
								this._unblockTurn(200)
							}.bind(this));
							(function () {
								a.moveCardsToStack(true)
							}).delay(50, this)
						}.bind(this));
						a._newDeckLoop = true;
						a.turnOver(e.movedCards[0], true)
					} else {
						a.turnOver(e.movedCards[0], true);
						e.movedCards[0].addEvent("movedComplete:once", function () {
							this._unblockTurn()
						}.bind(this))
					}
				}
			} else this._unblockTurn()
		}
	})
}).call(Solitaire);
(function () {
	this.Type.DoubleKlondike = new Class({
		Extends: this.Type.Klondike,
		name: "double-klondike",
		rules: {
			deal_base: [1, 2, 3, 4, 5, 6, 7, 8, 9],
			deck_ids: [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"].copyAppend(),
			number_of_foundation_piles: 8
		}
	})
}).call(Solitaire);
(function () {
	this.Type.Spider = new Class({
		Extends: this.Type.Base,
		name: "spider",
		rules: {
			deal_base: [6, 6, 6, 6, 5, 5, 5, 5, 5, 5],
			deck_ids: [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"].copyAppend(),
			deck_colors: ["club", "spade", "heart", "diamond"],
			number_of_foundation_piles: 8,
			allow_putting_to_foundation: false,
			enable_auto_move_obvious: false,
			foundation: {
				Aa: [],
				Kc: ["Qc"],
				Ks: ["Qs"],
				Kh: ["Qh"],
				Kd: ["Qd"],
				Qc: ["Jc"],
				Qs: ["Js"],
				Qh: ["Jh"],
				Qd: ["Jd"],
				Jc: ["10c"],
				Js: ["10s"],
				Jh: ["10h"],
				Jd: ["10d"],
				"10c": ["9c"],
				"10s": ["9s"],
				"10h": ["9h"],
				"10d": ["9d"],
				"9c": ["8c"],
				"9s": ["8s"],
				"9h": ["8h"],
				"9d": ["8d"],
				"8c": ["7c"],
				"8s": ["7s"],
				"8h": ["7h"],
				"8d": ["7d"],
				"7c": ["6c"],
				"7s": ["6s"],
				"7h": ["6h"],
				"7d": ["6d"],
				"6c": ["5c"],
				"6s": ["5s"],
				"6h": ["5h"],
				"6d": ["5d"],
				"5c": ["4c"],
				"5s": ["4s"],
				"5h": ["4h"],
				"5d": ["4d"],
				"4c": ["3c"],
				"4s": ["3s"],
				"4h": ["3h"],
				"4d": ["3d"],
				"3c": ["2c"],
				"3s": ["2s"],
				"3h": ["2h"],
				"3d": ["2d"],
				"2c": ["Ac"],
				"2s": ["As"],
				"2h": ["Ah"],
				"2d": ["Ad"]
			},
			tableau: {
				Ac: ["2c", "empty"],
				As: ["2s", "empty"],
				Ah: ["2h", "empty"],
				Ad: ["2d", "empty"],
				Kc: ["empty"],
				Ks: ["empty"],
				Kh: ["empty"],
				Kd: ["empty"],
				Qc: ["Kc", "empty"],
				Qs: ["Ks", "empty"],
				Qh: ["Kh", "empty"],
				Qd: ["Kd", "empty"],
				Jc: ["Qc", "empty"],
				Js: ["Qs", "empty"],
				Jh: ["Qh", "empty"],
				Jd: ["Qd", "empty"],
				"10c": ["Jc", "empty"],
				"10s": ["Js", "empty"],
				"10h": ["Jh", "empty"],
				"10d": ["Jd", "empty"],
				"9c": ["10c", "empty"],
				"9s": ["10s", "empty"],
				"9h": ["10h", "empty"],
				"9d": ["10d", "empty"],
				"8c": ["9c", "empty"],
				"8s": ["9s", "empty"],
				"8h": ["9h", "empty"],
				"8d": ["9d", "empty"],
				"7c": ["8c", "empty"],
				"7s": ["8s", "empty"],
				"7h": ["8h", "empty"],
				"7d": ["8d", "empty"],
				"6c": ["7c", "empty"],
				"6s": ["7s", "empty"],
				"6h": ["7h", "empty"],
				"6d": ["7d", "empty"],
				"5c": ["6c", "empty"],
				"5s": ["6s", "empty"],
				"5h": ["6h", "empty"],
				"5d": ["6d", "empty"],
				"4c": ["5c", "empty"],
				"4s": ["5s", "empty"],
				"4h": ["5h", "empty"],
				"4d": ["5d", "empty"],
				"3c": ["4c", "empty"],
				"3s": ["4s", "empty"],
				"3h": ["4h", "empty"],
				"3d": ["4d", "empty"],
				"2c": ["3c", "empty"],
				"2s": ["3s", "empty"],
				"2h": ["3h", "empty"],
				"2d": ["3d", "empty"]
			}
		},
		initialize: function (a) {
			var b = [];
			b = a == "one-suit" ? [this._getRandomColor()].copyAppend().copyAppend() : a == "two-suits" ? [this._getRandomColor("black"),
				this._getRandomColor("red")].copyAppend() : ["club", "spade", "heart", "diamond"];
			this.rules.deck_colors = b;
			this.parent(a)
		},
		deal: function () {
			this.app.sound.play("deal", 300, 50)
		},
		turnOver: function (a, b) {
			var d, c, e = 0,
				f, g, h = null,
				i, j = this.app.deck,
				k = [];
			if (this._isTurnBlocked()) return [];
			this._blockTurn();
			this.app.sound.play("deal", 320);
			var m = this.app.tableau.cards.map(function (l, n) {
				if (!l) return this.app.tableau.getSlot(n);
				return l.getLastCard()
			}.bind(this));
			g = j.freeCards;
			for (c = 0; c < 10; c++) {
				if (!g[c]) break;
				f = g[c];
				if (m[c] instanceof Solitaire.Card) {
					h = m[c];
					i = h.getPosition();
					i.top += f.step;
					d = h.getZIndex();
					d++
				} else {
					h = null;
					i = {
						top: m[c].getTop(),
						left: m[c].getLeft()
					};
					d = 1
				}
				j.fireEvent("dealToBlankBoardCard", [f, m[c]]);
				f.attachDrag();
				f.show();
				f.addEvent("movedComplete:once", function (l) {
					e++;
					l.setReversed(b ? true : false);
					j.removeFromStack(l);
					e >= 10 && this._unblockTurn(200)
				}.bind(this));
				f.setPosition.delay(70 * c + 10, f, [i, false, true]);
				f.setPrevCard(h);
				if (h) {
					if (!this.isFitsToRules(f, h)) for (i = h; i;) {
						i.detachDrag();
						i = i.getPrevCard()
					}
					h.setNextCard(f)
				}
				b || f.setZIndex(d);
				k.push(f)
			}
			this.updateStack(f ? f : a, b, 11);
			this._updatePiles();
			b || this.undoControl.add("deck", {
				movedCards: k
			});
			return k
		},
		updateStack: function (a, b) {
			var d = this.app.deck;
			if (a) if (!b) if (d = d.getNextFreeCard(a)) {
				d.detachDrag();
				d.show()
			}
		},
		removeCardFromStack: function (a) {
			var b = this.app.deck;
			b.freeCards = b.freeCards.filter(function (d) {
				return a.getElement() != d.getElement()
			})
		},
		moveAllowed: function (a, b, d) {
			var c, e, f = false,
				g, h, i = [],
				j = null;
			if (a == "old_pile") {
				if (c = b.getPrevCard()) {
					c.attachDrag();
					c = b.getPrevCard();
					g = c.getColor()
				}
				for (; c;) {
					e = c.getPrevCard();
					if (!e || e.isReversed()) break;
					if (this.isFitsToRules(c, e) && g == e.getColor()) {
						c.attachDrag();
						e.attachDrag()
					} else break;
					c = e
				}
				c = this.app.deck.getFreeCards().invoke("getElement").indexOf(b.getElement());
				e = b.getPrevCard();
				g = Object.merge({}, b.retPosition);
				h = b.lastZIndex !== null ? b.lastZIndex : b.getZIndex();
				if (e) {
					if (e.isReversed()) f = true
				} else j = this.app.tableau.getSlotIdByCard(b);
				this._undoData = {
					cardStackPos: c,
					lastPrev: e,
					lastPos: g,
					lastZIndex: h,
					lastTableauId: j,
					boardId: e ? null : this.app.tableau.getSlotIdByCard(b),
					forceFront: f,
					scores: this.app.score.getScores(),
					movedNextCards: b.getNextCards()
				}
			}
			if (a == "new_pile") {
				a = null;
				if (d instanceof Solitaire.Card) {
					a = d.getPrevCards();
					j = this.app.tableau.getBlankByCard(d.getFirstCard())
				}
				if ((f = this._updatePile(b)) && a) {
					f = a.length;
					i.push(f ? d : null);
					for (c = 0; c < f; c++) {
						i.push(a[c]);
						if (a[c].getSymbol() == "K") {
							this._undoData.droppedNewFrontCard = a[c + 1] ? a[c + 1] : j;
							break
						}
					}
					this._undoData.droppedPrevCards = i
				}
				this._undoData.moved = b;
				this._undoData.dropped =
				d;
				this._undoData.foundationId = b.getFoundationId();
				this.undoControl.add("move", this._undoData);
				this._undoData = null
			}
		},
		isMoveAllowed: function (a, b) {
			if (!b) return false;
			if (a.getNextCard() && a.isInFoundation()) return false;
			var d = false;
			if (b instanceof Solitaire.Card) if (b.getNextCard()) d = false;
			else {
				if (a.toInt() == b.toInt() - 1 && b.getSymbol() != "A") d = true;
				if (a.getSymbol() == "A" && b.getSymbol() == "2") d = true
			} else if (typeOf(b) == "element" && b.hasClass("blank_tableau")) d = true;
			d && this.app.sound.play("drop");
			return d
		},
		isWin: function () {
			return this.app.deck.getNotFoundedCards().length == 0
		},
		undo: function () {
			var a = this.app.deck,
				b = this.app.foundation,
				d = this.app.tableau,
				c = this.app.score,
				e = this.app.moves,
				f, g, h, i = 0;
			h = h = 0;
			var j, k;
			if (!this._isTurnBlocked()) if (this.undoControl.hasItems()) {
				this._blockTurn();
				g = this.undoControl.get();
				f = g.data;
				if (g.type == "move") {
					this.app.sound.play("drop", 400);
					typeOf(f.scores) == "number" && c.setScores(f.scores);
					typeOf(f.foundationId) == "number" && b.clearSlot(f.moved.foundationId);
					f.moved.getPrevCard() && !f.moved.isFounded() && f.moved.getPrevCard().setNextCard(null);
					f.dropped instanceof Solitaire.Card ? f.dropped.attachDrag() : d.removeCard(f.moved);
					f.moved.setFoundation(false);
					if (f.lastPrev) {
						if (f.lastPrev.isFront() && !f.lastPrev.isFounded()) if (h = f.lastPrev.getPrevCard()) h.isReversed() && f.lastPrev.setReversed(true);
						else {
							f.lastPrev.setReversed(true);
							f.lastPrev.detachDrag();
							f.dropped instanceof Solitaire.Card && f.dropped.isReversed() && f.dropped.setReversed(false)
						}
						f.moved.setPrevCard(f.lastPrev, false);
						f.moved.step = f.lastPrev.step;
						f.lastPrev.setNextCard(f.moved);
						b = f.movedNextCards.length;
						if (b == 1) {
							f.movedNextCards[0].setPrevCard(f.moved);
							f.movedNextCards[0].setNextCard(null);
							f.movedNextCards[0].inFoundation = false
						} else for (h = 0; h < b; h++) {
							f.movedNextCards[h].inFoundation = false;
							if (h == 0) {
								f.movedNextCards[h].setPrevCard(f.moved);
								f.movedNextCards[h].setNextCard(f.movedNextCards[h + 1])
							} else {
								f.movedNextCards[h].setPrevCard(f.movedNextCards[h - 1]);
								f.movedNextCards[h].setNextCard(f.movedNextCards[h + 1] ? f.movedNextCards[h + 1] : null)
							}
						}
					} else {
						f.moved.setPrevCard(null);
						d.setCardBySlotId(f.moved, f.lastTableauId)
					}
					h =
					f.moved.getNextCard();
					f.moved.attachDrag();
					f.moved.show();
					f.moved.addEvent("movedComplete:once", function () {
						this._unblockTurn();
						this.app._setStep()
					}.bind(this));
					if (h) f.moved.setUndoPosition(f.lastPos);
					else f.lastPrev ? f.moved.setPosition({
						left: f.lastPos.left,
						top: f.lastPrev.getElement().getTop() + f.lastPrev.step
					}, true, true, true) : f.moved.setPosition(f.lastPos, true, true, true);
					b = f.droppedNewFrontCard;
					c = false;
					var m;
					if (b instanceof Solitaire.Card) c = true;
					m = c ? b.step : f.moved.step;
					if (f.droppedPrevCards) {
						if (c) {
							h =
							b.getPrevCard();
							if (b.isFront() && h && h.isReversed()) {
								b.setReversed(true);
								b.detachDrag()
							}
						}
						j = f.droppedPrevCards.length;
						var l = f.droppedPrevCards.reverse();
						for (h = 0; h < j; h++) {
							l[h].show();
							l[h].attachDrag();
							l[h].step = m;
							l[h].inFoundation = false;
							if (h == 0) {
								c && b.setNextCard(l[h]);
								l[h].setPrevCard(c ? b : null);
								l[h].setNextCard(l[h + 1])
							} else {
								l[h].setPrevCard(l[h - 1]);
								l[h].setNextCard(l[h + 1] ? l[h + 1] : null)
							}
						}
						l[0].addEvent("movedComplete:once", function () {
							this._unblockTurn();
							this.app._setStep()
						}.bind(this));
						h = {};
						if (c) {
							h = b.retPosition;
							h.top += m
						} else {
							h = {
								top: b.getTop(),
								left: b.getLeft()
							};
							this.app.tableau.setCardBySlotElement(l[0], b)
						}
						l[0].setUndoPosition(h)
					}
				}
				if (g.type == "deck") {
					var n = a.getShowedCardStackPos(true);
					k = function () {
						i++;
						if (i >= f.movedCards.length) {
							this._unblockTurn();
							this._updatePiles()
						}
					}.bind(this);
					a.freeCards.reverse();
					f.movedCards.reverse().each(function (o, p) {
						o.addEvent("movedComplete:once", k);
						(function () {
							o.setReversed(true, true, true);
							o.setPosition(n, true, true, true)
						}).delay(70 * p + 10);
						o.setNextCard(null);
						o.setPrevCard(null);
						d.removeCard(o);
						a.freeCards.push(o)
					}.bind(this));
					a.freeCards.reverse();
					this.app.sound.play("deal", 320)
				}
				e.decrease()
			} else this._unblockTurn()
		},
		_updatePiles: function () {
			this.app.tableau.cards.filter(function (a) {
				if (!a) return false;
				return true
			}).each(this._updatePile.bind(this))
		},
		_updatePile: function (a) {
			var b = this.app.foundation,
				d = this.app.tableau,
				c = null,
				e = [],
				f, g, h, i, j;
			g = a.getLastCard();
			if (!g) return false;
			g.attachDrag();
			j = g.getColor();
			for (e.push(g); g;) {
				a = g.getPrevCard();
				if (!a || a.isReversed()) break;
				if (this.isFitsToRules(g, a) && j == a.getColor() && c === null) {
					a.attachDrag();
					e.push(a);
					if (a.getSymbol() == "K" && e.length == 13) {
						if (c = a.getPrevCard()) {
							c.setNextCard(null);
							c.attachDrag();
							c.isReversed() && this.app.getOption("autoFlip") && c.setReversed(false)
						}
						a.setPrevCard(null);
						c && this._updatePile(c);
						c = true;
						break
					}
				} else {
					a.detachDrag();
					c = false
				}
				g = a
			}
			if (c) {
				h = b.getFreeSlot();
				f = b.setAsBusySlot(h);
				a = e.length;
				e[a - 1].getPrevCard() || d.removeCard(e[a - 1]);
				i = {
					top: h.getTop(),
					left: h.getLeft()
				};
				e = e.reverse();
				e.each(function (k, m) {
					k.getSymbol() == "K" && b.setCardBySlotElement(k, h);
					k.detachDrag();
					k.inFoundation = true;
					k.setFoundationId(f);
					k.addEvent("movedComplete:once", function () {});
					k.setPosition.delay(70 * m + 10, k, [i, false, true, false, false])
				})
			}
			c && this.app.sound.play("deal", 320);
			return c
		},
		_getRandomColor: function (a) {
			var b = {
				black: ["club", "spade"],
				red: ["heart", "diamond"]
			};
			b = a ? b[a] : Array.combine(b.black, b.red);
			return b[Number.random(0, b.length - 1)]
		}
	})
}).call(Solitaire);
(function () {
	this.Type.FortyThieves = new Class({
		Extends: this.Type.Base,
		name: "forty-thieves",
		rules: {
			deal_base: [4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
			deck_ids: [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"].copyAppend(),
			deck_colors: ["club", "spade", "diamond", "heart"],
			number_of_foundation_piles: 8,
			allow_putting_to_foundation: true,
			enable_auto_move_obvious: true,
			all_cards_front_on_delt: true,
			unlimited_stack_loop_count: false,
			foundation: {
				Aa: ["empty"],
				Kc: ["Qc"],
				Ks: ["Qs"],
				Kh: ["Qh"],
				Kd: ["Qd"],
				Qc: ["Jc"],
				Qs: ["Js"],
				Qh: ["Jh"],
				Qd: ["Jd"],
				Jc: ["10c"],
				Js: ["10s"],
				Jh: ["10h"],
				Jd: ["10d"],
				"10c": ["9c"],
				"10s": ["9s"],
				"10h": ["9h"],
				"10d": ["9d"],
				"9c": ["8c"],
				"9s": ["8s"],
				"9h": ["8h"],
				"9d": ["8d"],
				"8c": ["7c"],
				"8s": ["7s"],
				"8h": ["7h"],
				"8d": ["7d"],
				"7c": ["6c"],
				"7s": ["6s"],
				"7h": ["6h"],
				"7d": ["6d"],
				"6c": ["5c"],
				"6s": ["5s"],
				"6h": ["5h"],
				"6d": ["5d"],
				"5c": ["4c"],
				"5s": ["4s"],
				"5h": ["4h"],
				"5d": ["4d"],
				"4c": ["3c"],
				"4s": ["3s"],
				"4h": ["3h"],
				"4d": ["3d"],
				"3c": ["2c"],
				"3s": ["2s"],
				"3h": ["2h"],
				"3d": ["2d"],
				"2c": ["Ac"],
				"2s": ["As"],
				"2h": ["Ah"],
				"2d": ["Ad"]
			},
			tableau: {
				Ac: ["2c", "empty"],
				As: ["2s",
					"empty"],
				Ah: ["2h", "empty"],
				Ad: ["2d", "empty"],
				Kc: ["empty"],
				Ks: ["empty"],
				Kh: ["empty"],
				Kd: ["empty"],
				Qc: ["Kc", "empty"],
				Qs: ["Ks", "empty"],
				Qh: ["Kh", "empty"],
				Qd: ["Kd", "empty"],
				Jc: ["Qc", "empty"],
				Js: ["Qs", "empty"],
				Jh: ["Qh", "empty"],
				Jd: ["Qd", "empty"],
				"10c": ["Jc", "empty"],
				"10s": ["Js", "empty"],
				"10h": ["Jh", "empty"],
				"10d": ["Jd", "empty"],
				"9c": ["10c", "empty"],
				"9s": ["10s", "empty"],
				"9h": ["10h", "empty"],
				"9d": ["10d", "empty"],
				"8c": ["9c", "empty"],
				"8s": ["9s", "empty"],
				"8h": ["9h", "empty"],
				"8d": ["9d", "empty"],
				"7c": ["8c", "empty"],
				"7s": ["8s", "empty"],
				"7h": ["8h", "empty"],
				"7d": ["8d", "empty"],
				"6c": ["7c", "empty"],
				"6s": ["7s", "empty"],
				"6h": ["7h", "empty"],
				"6d": ["7d", "empty"],
				"5c": ["6c", "empty"],
				"5s": ["6s", "empty"],
				"5h": ["6h", "empty"],
				"5d": ["6d", "empty"],
				"4c": ["5c", "empty"],
				"4s": ["5s", "empty"],
				"4h": ["5h", "empty"],
				"4d": ["5d", "empty"],
				"3c": ["4c", "empty"],
				"3s": ["4s", "empty"],
				"3h": ["4h", "empty"],
				"3d": ["4d", "empty"],
				"2c": ["3c", "empty"],
				"2s": ["3s", "empty"],
				"2h": ["3h", "empty"],
				"2d": ["3d", "empty"]
			}
		},
		initialize: function () {
			this.parent()
		},
		deal: function () {
			this.app.sound.play("deal", 300, 50)
		},
		turnOver: function (a, b) {
			var d, c, e = this.app.deck;
			if (this._isTurnBlocked()) return [];
			this._blockTurn();
			this.app.sound.play("drop", 250);
			d = e._newDeckLoop;
			a.updateDroppables();
			c = e.getShowedCardStackPos(b);
			a.addEvent("movedComplete:once", function (f) {
				(function () {
					if (!d) f[b ? "detachDrag" : "attachDrag"]();
					d || this._unblockTurn()
				}).delay(50, this)
			}.bind(this));
			a.setPosition(c, false, true);
			a.setReversed(b, true, true);
			e.updateStack(a, b);
			if (b)(c = e.getPrevFreeCard(a)) && c.setZIndex(e.getZIndex());
			a.setZIndex(e.getZIndex());
			e.showedCardInStack = b ? e.getPrevFreeCard(a) : a;
			b || this.undoControl.add("deck", {
				movedCards: [a],
				loopIndex: e.stackLoopCount
			});
			return [a]
		},
		_showCard: function (a, b, d) {
			var c = this.app.deck,
				e = c.getShowedCardStackPos(d);
			if (typeOf(b) == "number" && !d) e.left += 20 * b;
			a.detachDrag();
			a.show();
			a.addEvent("movedComplete:once", function (f) {
				f.setReversed(d ? true : false);
				if (!this._showCardTimer) this._showCardTimer = function () {
					this._unblockTurn();
					clearTimeout(this._showCardTimer);
					this._showCardTimer = null
				}.delay(650, this)
			}.bind(this));
			a.setPosition(e, false, true);
			d || a.setZIndex(c.getZIndex(d))
		},
		moveToFoundation: function (a) {
			var b = this.app.deck;
			if (this.isAllowedToPuttingToFoundation()) if (!(a.isReversed() || a.getNextCard() || this._isTurnBlocked())) {
				if (a.isInWaste() && b) {
					if (!b.getShowedCardInStack()) return;
					if (b.getShowedCardInStack().getElement() != a.getElement()) return
				}
				var d = b.getCard("A", a.getColor());
				if (d.length) for (b = 0; b < d.length; b++) {
					if (d[b].getElement() == a.getElement()) if (this.isMoveAllowed(a, this.app.foundation.getFreeSlot(), true)) {
						this.app.checkMove(a, this.app.foundation.getFreeSlot(), true, true);
						break
					}
					if (d[b].isFounded()) if (this.isMoveAllowed(a, d[b].getLastCard(), true)) {
						this.app.checkMove(a, d[b].getLastCard(), true, true);
						break
					}
				}
			}
		},
		removeCardFromStack: function (a) {
			var b = this.app.deck;
			b.updateStack(a, false, 4);
			var d = b.getPrevFreeCard(a);
			if (d) {
				b.showedCardInStack = d;
				d.drag.attach()
			}
			b.updateOpenedFreeCardPos(a);
			b.freeCards = b.freeCards.filter(function (c) {
				return a.getElement() != c.getElement()
			})
		},
		updateStack: function (a, b, d) {
			var c = this.app.deck;
			if (a) {
				d = d ? d : 3;
				var e, f = 0,
					g = false,
					h;
				h = a.getZIndex();
				if (h > a.maxZIndex - 1E3) h = a.lastZIndex;
				if (b) {
					++d;
					for (e = c.getNextFreeCard(a, 4); e;) {
						e.hide();
						e = c.getNextFreeCard(e)
					}
				} else if (e = c.getNextFreeCard(a)) {
					e.drag.detach();
					e.show();
					e.setZIndex(c.getZIndex());
					if (Browser.isMobile) {
						var i = c.getNextFreeCard(e);
						if (i) {
							i.show();
							i.setZIndex(e.getZIndex() - 1)
						}
					}
				}
				a = c._newDeckLoop ? a : c.getPrevFreeCard(a);
				c._newDeckLoop = false;
				for (c.getShowedCardStackPos(false).left += 60; a;) {
					f++;
					if (f < d) {
						a.setReversed(false, false);
						a[b && !g ? "attachDrag" : "detachDrag"]();
						a.show();
						a.setZIndex(--h);
						g = true
					} else {
						a.setReversed(true);
						Browser.ie ? a.setZIndex(b ? --h : 0) : a.setZIndex(--h);
						a.hide()
					}
					a = c.getPrevFreeCard(a)
				}
			}
		},
		moveAllowed: function (a, b, d) {
			var c = false,
				e, f, g, h, i = null;
			if (a == "old_pile") {
				e = this.app.deck.getFreeCards().invoke("getElement").indexOf(b.getElement());
				f = b.getPrevCard();
				g = Object.merge({}, b.retPosition);
				h = b.lastZIndex !== null ? b.lastZIndex : b.getZIndex();
				if (f) {
					if (f.isReversed()) c = true;
					this.app.isRunningAutoMoveObvious() || f.attachDrag()
				} else i = this.app.tableau.getSlotIdByCard(b);
				this._undoData = {
					cardStackPos: e,
					lastPrev: f,
					lastPos: g,
					lastZIndex: h,
					lastTableauId: i,
					boardId: f ? null : this.app.tableau.getSlotIdByCard(b),
					forceFront: c,
					scores: this.app.score.getScores()
				}
			}
			if (a == "new_pile") {
				d instanceof Solitaire.Card && d.detachDrag();
				this._undoData.moved = b;
				this._undoData.dropped = d;
				this._undoData.foundationId = b.getFoundationId();
				this.undoControl.add("move", this._undoData);
				this._undoData = null
			}
		},
		isMoveAllowed: function (a, b, d) {
			if (!b) return false;
			if (a.getNextCard() && a.isInFoundation()) return false;
			d = this.isFitsToRules(a, b, d === undefined || d === false ? false : true);
			if (b instanceof Solitaire.Card) if (b.getNextCard()) d = false;
			d && a.addEvent("movedComplete:once", function () {
				this.app.sound.play("drop")
			}.bind(this));
			return d
		},
		isWin: function () {
			return this.app.deck.getNotFoundedCards().length == 0
		},
		undo: function () {
			var a = this.app.deck,
				b = this.app.foundation,
				d = this.app.tableau,
				c = this.app.score,
				e, f;
			if (!this._isTurnBlocked()) if (this.undoControl.hasItems()) {
				f = this.undoControl.get();
				e = f.data;
				if (f.type == "move") {
					this._blockTurn();
					this.app.sound.play("drop", 400);
					if (e.cardStackPos != -1) {
						a.addToStack(e.moved, e.cardStackPos);
						a.showedCardInStack = e.moved;
						e.moved.getPrevCard() || d.removeCard(e.moved)
					}
					e.dropped instanceof Solitaire.Card ? e.dropped.attachDrag() : d.removeCard(e.moved);
					typeOf(e.scores) == "number" && c.setScores(e.scores);
					typeOf(e.foundationId) == "number" && b.clearSlot(e.moved.foundationId);
					e.moved.setFoundation(false);
					e.moved.getPrevCard() && e.moved.getPrevCard().setNextCard(null);
					if (e.lastPrev) {
						e.lastPrev.detachDrag();
						if (e.lastPrev.isFront() && !e.lastPrev.isFounded()) if (b = e.lastPrev.getPrevCard()) b.isReversed() && e.lastPrev.setReversed(true);
						else {
							e.dropped instanceof Solitaire.Card && e.dropped.isReversed() && e.dropped.setReversed(false);
							e.forceFront && e.lastPrev.setReversed(true)
						}
						e.moved.setPrevCard(e.lastPrev, false);
						e.moved.step = e.lastPrev.step;
						e.lastPrev.setNextCard(e.moved)
					} else {
						e.moved.setPrevCard(null);
						e.cardStackPos == -1 && d.setCardBySlotId(e.moved, e.lastTableauId)
					}
					b = e.moved.getNextCard();
					e.moved.attachDrag();
					e.moved.addEvent("movedComplete:once", function (g) {
						e.cardStackPos != -1 && g.setZIndex(a.getZIndex());
						this._unblockTurn();
						a.updateOpenedFreeCardPos(g, true);
						this.app._setStep()
					}.bind(this));
					if (b) e.moved.setUndoPosition(e.lastPos);
					else e.lastPrev ? e.moved.setPosition({
						left: e.lastPos.left,
						top: e.lastPrev.getElement().getTop() + (e.lastPrev.inFoundation ? 0 : e.lastPrev.step)
					}, true, true, true) : e.moved.setPosition(e.lastPos, true, true, true)
				}
				if (f.type == "deck") {
					b = this.undoControl.getNearby("deck") || {
						data: {}
					};
					if (a.stackLoopCount > 0 && b.data.loopIndex != a.stackLoopCount) {
						e.movedCards[0].addEvent("movedComplete:once", function () {
							e.movedCards[0].addEvent("movedComplete:once", function () {
								a.getShowedCardInStack() && this.undoControl.add(f.type, e);
								this._unblockTurn(200)
							}.bind(this));
							(function () {
								a.moveCardsToStack(true)
							}).delay(50, this)
						}.bind(this));
						a._newDeckLoop = true;
						a.turnOver(e.movedCards[0], true)
					} else {
						a.turnOver(e.movedCards[0], true);
						e.movedCards[0].addEvent("movedComplete:once", function () {
							this._unblockTurn()
						}.bind(this))
					}
				}
			} else this._unblockTurn()
		}
	})
}).call(Solitaire);
(function () {
	this.Language = this.Language || {};
	this.Language.ar = {
		menuButton: "\u0627\u0644\u0642\u0627\u0626\u0645\u0629",
		menuNewGameButton: "\u0644\u0639\u0628\u0629 \u062c\u062f\u064a\u062f\u0629",
		menuRestartGameButton: "\u0625\u0639\u0627\u062f\u0629 \u0627\u0644\u0644\u0639\u0628\u0629",
		menuSelectGameButton: "\u0627\u062e\u062a\u0631 \u0644\u0639\u0628\u0629",
		menuOptionButton: "\u0627\u0644\u062e\u064a\u0627\u0631\u0627\u062a",
		menuSkinButton: "\u0627\u0644\u0645\u0638\u0647\u0631",
		menuInfoButton: '<img src="' + SS + 'images/info.png" alt="" />',
		menuUndo: '\u062a\u0631\u0627\u062c\u0639&nbsp;&nbsp;<img src="' + SS + 'images/undo.png" alt="">',
		labelTime: "{var} :\u0627\u0644\u0648\u0642\u062a",
		labelScore: "{var} :\u0627\u0644\u0646\u0642\u0627\u0637",
		labelMoves: "{var} :\u0627\u0644\u062d\u0631\u0643\u0627\u062a",
		"game.play": "\u0644\u0639\u0628",
		"game.show-on-startup": "\u062a\u0638\u0647\u0631 \u0646\u0627\u0641\u0630\u0629 \u064a\u062a\u0645 \u062a\u062d\u062f\u064a\u062b \u0627\u0644\u0635\u0641\u062d\u0629 \u0643\u0644 \u0645\u0631\u0629",
		optionWindowHeader: "\u0627\u0644\u062e\u064a\u0627\u0631\u0627\u062a",
		optionWindowTabGameHeader: "\u0646\u0648\u0639 \u0627\u0644\u0644\u0639\u0628\u0629",
		"klondike:turn-one": "\u0643\u0644\u0648\u0646\u062f\u064a\u0643 - \u0633\u062d\u0628 \u0648\u0631\u0642\u0629 \u0648\u0627\u062d\u062f\u0629",
		"klondike:turn-three": "\u0643\u0644\u0648\u0646\u062f\u064a\u0643 - \u0633\u062d\u0628 \u062b\u0644\u0627\u062b \u0648\u0631\u0642\u0627\u062a",
		"double-klondike:turn-one": "\u062f\u0628\u0644 \u0643\u0644\u0648\u0646\u062f\u064a\u0643 - \u0633\u062d\u0628 \u0648\u0631\u0642\u0629 \u0648\u0627\u062d\u062f\u0629",
		"double-klondike:turn-three": "\u062f\u0628\u0644 \u0643\u0644\u0648\u0646\u062f\u064a\u0643 - \u0633\u062d\u0628 \u062b\u0644\u0627\u062b \u0648\u0631\u0642\u0627\u062a",
		"spider:one-suit": "\u0627\u0644\u0639\u0646\u0643\u0628\u0648\u062a - \u0645\u0646\u0638\u0648\u0645\u0629 \u0648\u0627\u062d\u062f\u0629",
		"spider:two-suits": "\u0627\u0644\u0639\u0646\u0643\u0628\u0648\u062a - \u0645\u0646\u0638\u0648\u0645\u062a\u0627\u0646",
		"spider:four-suits": "\u0627\u0644\u0639\u0646\u0643\u0628\u0648\u062a - \u0623\u0631\u0628\u0639 \u0645\u0646\u0638\u0648\u0645\u0627\u062a",
		"forty-thieves": "Forty Thievies",
		"coming-soon": "coming soon",
		"difficulty-level": "\u0635\u0639\u0648\u0628\u0629",
		optionWindowTabScoringHeader: "\u0637\u0631\u064a\u0642\u0629 \u0627\u0644\u0646\u0642\u0627\u0637",
		scoringStandardMode: "\u0646\u0638\u0627\u0645 \u0627\u062d\u062a\u0633\u0627\u0628 \u0627\u0644\u0646\u0642\u0627\u0637 \u0627\u0644\u0625\u0639\u062a\u064a\u0627\u062f\u064a",
		scoringTimedMode: "\u0646\u0638\u0627\u0645 \u0627\u062d\u062a\u0633\u0627\u0628 \u0627\u0644\u0646\u0642\u0627\u0637 \u0628\u0627\u0644\u0648\u0642\u062a",
		optionWindowTabSettingsHeader: "\u0627\u0644\u0625\u0639\u062f\u0627\u062f\u0627\u062a",
		"option.settings-sound-header": "\u0627\u0644\u0623\u0635\u0648\u0627\u062a:",
		"option.settings-sound-header-not-supported": "not supported by your browser",
		"option.settings-sound-pack-wood": "\u0627\u0644\u0628\u0627\u0642\u0629 \u0627\u0644\u062e\u0634\u0628\u064a\u0629",
		"option.settings-sound-pack-plastic": "\u0627\u0644\u0628\u0627\u0642\u0629 \u0627\u0644\u0628\u0644\u0627\u0633\u062a\u064a\u0643\u064a\u0629",
		"option.settings-sound-off": "\u0644\u0627 \u062a\u0624\u062f\u064a \u0623\u064a \u0635\u0648\u062a",
		optionWindowTabSettingsAutoHeader: "\u0627\u0644\u062d\u0631\u0643\u0629 \u0627\u0644\u062a\u0644\u0642\u0627\u0626\u064a\u0629:",
		optionWindowTabSettingsAutoFlip: "\u0627\u0642\u0644\u0628 \u0627\u0644\u0648\u0631\u0642 \u062a\u0644\u0642\u0627\u0626\u064a\u0627\u064b",
		optionWindowTabSettingsAutoMoveWhenWon: "\u0623\u0643\u0645\u0644 \u0628\u0642\u064a\u0629 \u0627\u0644\u0644\u0639\u0628 \u0639\u0646\u062f \u0627\u0644\u0641\u0648\u0632",
		optionWindowTabSettingsAutoMoveOff: "\u0644\u0627 \u062a\u0643\u0645\u0644 \u0628\u0642\u064a\u0629 \u0627\u0644\u0644\u0639\u0628",
		optionWindowTabSettingsControlHeader: "\u0627\u0644\u062a\u062d\u0643\u0645:",
		optionWindowTabSettingsControlTime: "\u0623\u0638\u0647\u0631 \u0639\u062f\u0627\u062f \u0627\u0644\u0648\u0642\u062a",
		optionWindowTabSettingsControlScores: "\u0623\u0638\u0647\u0631 \u0639\u062f\u062f \u0627\u0644\u0646\u0642\u0627\u0637",
		optionWindowTabSettingsControlMoves: "\u0623\u0638\u0647\u0631 \u0639\u062f\u062f \u0627\u0644\u062e\u0637\u0648\u0627\u062a",
		optionWindowTabLanguageHeader: "\u0627\u0644\u0644\u063a\u0629",
		optionWindowTabSettingsLangLabel: "You have changed the language to <b>{lang}</b> to show changes it is required to refresh page. Do you want to do it now?.",
		optionSkinHeader: "\u0627\u0644\u0645\u0638\u0647\u0631",
		optionSkinTabThemeHeader: "\u0627\u0644\u0645\u0638\u0647\u0631",
		optionSkinTabCardHeader: "\u0625\u0639\u062f\u0627\u062f\u0627\u062a \u0645\u062a\u0642\u062f\u0645\u0629",
		optionWindowSelectedSkinItem: " (\u0645\u062e\u062a\u0627\u0631)",
		optionWindowChangedThemeSkinItem: " \u0627\u0633\u062a\u0639\u0627\u062f\u0629 \u0645\u0648\u0636\u0648\u0639",
		winHeader: "\u0644\u0639\u0628\u0629 \u062a\u0631\u062a\u064a\u0628",
		winGameTypeHead: "\u0646\u0648\u0639 \u0627\u0644\u0644\u0639\u0628\u0629",
		"win.klondike:turn-one": "1 \u0643\u0644\u0648\u0646\u062f\u064a\u0643",
		"win.klondike:turn-three": "3 \u0643\u0644\u0648\u0646\u062f\u064a\u0643",
		"win.double-klondike:turn-one": "1 \u062f\u0628\u0644 \u0643\u0644\u0648\u0646\u062f\u064a\u0643",
		"win.double-klondike:turn-three": "3 \u062f\u0628\u0644 \u0643\u0644\u0648\u0646\u062f\u064a\u0643",
		"win.spider:one-suit": "1 \u0627\u0644\u0639\u0646\u0643\u0628\u0648\u062a",
		"win.spider:two-suits": "2 \u0627\u0644\u0639\u0646\u0643\u0628\u0648\u062a",
		"win.spider:four-suits": "4 \u0627\u0644\u0639\u0646\u0643\u0628\u0648\u062a",
		"win.forty-thieves": "Forty Thieves",
		winScoringSystemHead: "\u0637\u0631\u064a\u0642\u0629 \u0627\u0644\u0646\u0642\u0627\u0637:",
		winScoringSystemStandard: "\u0645\u0639\u064a\u0627\u0631",
		winScoringSystemTimed: "\u0627\u0644\u062a\u0648\u0642\u064a\u062a",
		winMovesHead: "\u0627\u0644\u062d\u0631\u0643\u0627\u062a",
		winTimeHead: "\u0627\u0644\u0648\u0642\u062a",
		winBonusHead: "\u0639\u0644\u0627\u0648\u0629",
		winScoresHead: "\u0627\u0644\u0646\u0642\u0627\u0637",
		winBestScoresHead: "\u0623\u0641\u0636\u0644 \u0646\u0642\u0637\u0629",
		winRedealButton: "\u0625\u0639\u0627\u062f\u0629 \u0627\u0644\u0644\u0639\u0628\u0629",
		winNewGameButton: "\u0644\u0639\u0628\u0629 \u062c\u062f\u064a\u062f\u0629",
		pauseHeader: "\u0648\u0642\u0641\u0629",
		pauseContent: "\u0643\u0633\u0631 \u0641\u064a \u0627\u0644\u0644\u0639\u0628\u0629<br/>...",
		pauseButtonResume: "\u0627\u0633\u062a\u0626\u0646\u0627\u0641",
		cancel: "\u0625\u0644\u063a\u0627\u0621"
	}
}).call(Solitaire);
(function () {
	this.Language = this.Language || {};
	this.Language.bg = {
		menuButton: "\u041c\u0435\u043d\u044e",
		menuNewGameButton: "\u041d\u043e\u0432\u0430 \u0438\u0433\u0440\u0430",
		menuRestartGameButton: "\u041e\u043f\u0438\u0442\u0430\u0439 \u043f\u0430\u043a",
		menuSelectGameButton: "\u0418\u0437\u0431\u0435\u0440\u0435\u0442\u0435 \u0438\u0433\u0440\u0430",
		menuOptionButton: "\u041e\u043f\u0446\u0438\u0438",
		menuSkinButton: "\u0422\u0435\u043c\u0430",
		menuInfoButton: '<img src="' + SS + 'images/info.png" alt="" />',
		menuUndo: '<img src="' + SS + 'images/undo.png" alt="">&nbsp;&nbsp;\u0425\u043e\u0434 \u043d\u0430\u0437\u0430\u0434',
		labelTime: "\u0412\u0440\u0435\u043c\u0435: {var}",
		labelScore: "\u0420\u0435\u0437\u0443\u043b\u0442\u0430\u0442: {var}",
		labelMoves: "\u0425\u043e\u0434\u043e\u0432\u0435: {var}",
		"game.play": "\u0438\u0433\u0440\u0430\u044f",
		"game.show-on-startup": "\u041f\u043e\u043a\u0430\u0437\u0432\u0430\u043d\u0435 \u043d\u0430 \u043f\u0440\u043e\u0437\u043e\u0440\u0435\u0446\u0430 \u0421\u0442\u0440\u0430\u043d\u0438\u0446\u0430\u0442\u0430 \u0441\u0435 \u043e\u0431\u043d\u043e\u0432\u044f\u0432\u0430 \u0432\u0441\u0435\u043a\u0438 \u043f\u044a\u0442",
		optionWindowHeader: "\u041e\u043f\u0446\u0438\u0438",
		optionWindowTabGameHeader: "\u0418\u0433\u0440\u0438",
		"klondike:turn-one": "Klondike - \u041f\u043e \u0435\u0434\u043d\u0430 \u043a\u0430\u0440\u0442\u0430",
		"klondike:turn-three": "Klondike - \u041f\u043e \u0442\u0440\u0438 \u043a\u0430\u0440\u0442\u0438",
		"double-klondike:turn-one": "\u0434\u0432\u043e\u0439\u043d\u043e\u0439 Klondike - \u041f\u043e \u0435\u0434\u043d\u0430 \u043a\u0430\u0440\u0442\u0430",
		"double-klondike:turn-three": "\u0434\u0432\u043e\u0439\u043d\u043e\u0439 Klondike - \u041f\u043e \u0442\u0440\u0438 \u043a\u0430\u0440\u0442\u0438",
		"spider:one-suit": "\u041f\u0430\u044f\u043a - \u043e\u0442 \u0435\u0434\u043d\u0430 \u0431\u043e\u044f",
		"spider:two-suits": "\u041f\u0430\u044f\u043a - \u0434\u0432\u0435 \u043a\u043e\u0441\u0442\u044e\u043c\u0438",
		"spider:four-suits": "\u041f\u0430\u044f\u043a - \u0447\u0435\u0442\u0438\u0440\u0438 \u043a\u043e\u0441\u0442\u044e\u043c\u0438",
		"forty-thieves": "Forty Thievies",
		"coming-soon": "\u043e\u0447\u0430\u043a\u0432\u0430\u0439\u0442\u0435 \u0441\u043a\u043e\u0440\u043e",
		"difficulty-level": "\u0442\u0440\u0443\u0434\u043d\u043e\u0441\u0442",
		optionWindowTabScoringHeader: "\u0420\u0435\u0437\u0443\u043b\u0442\u0430\u0442\u0438",
		scoringStandardMode: "\u041d\u043e\u0440\u043c\u0430\u043b\u043d\u0430 \u0442\u043e\u0447\u043a\u043e\u0432\u0430 \u0441\u0438\u0441\u0442\u0435\u043c\u0430",
		scoringTimedMode: "\u0412\u0440\u0435\u043c\u0435\u0432\u0430 \u0442\u043e\u0447\u043a\u043e\u0432\u0430 \u0441\u0438\u0441\u0442\u0435\u043c\u0430",
		optionWindowTabSettingsHeader: "\u041d\u0430\u0441\u0442\u0440\u043e\u0439\u043a\u0438",
		"option.settings-sound-header": "\u0437\u0432\u0443\u043a:",
		"option.settings-sound-header-not-supported": "\u043d\u0435 \u043f\u043e\u0434\u0434\u044a\u0440\u0436\u0430 \u043e\u0442 \u0432\u0430\u0448\u0438\u044f \u0431\u0440\u0430\u0443\u0437\u044a\u0440",
		"option.settings-sound-pack-wood": "\u043f\u0430\u043a\u0435\u0442 - \u0434\u044a\u0440\u0432\u043e",
		"option.settings-sound-pack-plastic": "\u043f\u0430\u043a\u0435\u0442 - \u043f\u043b\u0430\u0441\u0442\u043c\u0430\u0441\u0430",
		"option.settings-sound-off": "\u0414\u0430 \u043d\u0435 \u0441\u0435 \u0438\u0433\u0440\u0430\u044f\u0442 \u043d\u0438\u043a\u0430\u043a\u0432\u0430 \u0437\u0432\u0443\u0446\u0438",
		optionWindowTabSettingsAutoHeader: "\u0410\u0432\u0442\u043e\u0445\u043e\u0434\u043e\u0432\u0435:",
		optionWindowTabSettingsAutoFlip: "\u0410\u0432\u0442\u043e\u043c\u0430\u0442\u0438\u0447\u043d\u043e \u043e\u0431\u0440\u044a\u0449\u0430\u0439 \u043a\u0430\u0440\u0442\u0438\u0442\u0435",
		optionWindowTabSettingsAutoMoveWhenWon: "\u0410\u0432\u0442\u043e\u043c\u0430\u0442\u0438\u0447\u043d\u0430 \u043d\u043e\u0432\u0430 \u0438\u0433\u0440\u0430",
		optionWindowTabSettingsAutoMoveOff: "\u0418\u0437\u043a\u043b\u044e\u0447\u0438 \u0430\u0432\u0442\u043e\u043c\u0430\u0442\u0438\u0447\u043d\u0430\u0442\u0430 \u043d\u043e\u0432\u0430 \u0438\u0433\u0440\u0430",
		optionWindowTabSettingsControlHeader: "\u041a\u043e\u043d\u0442\u0440\u043e\u043b\u0438:",
		optionWindowTabSettingsControlTime: "\u041f\u043e\u043a\u0430\u0436\u0438 \u0431\u0440\u043e\u044f\u0447",
		optionWindowTabSettingsControlScores: "\u041f\u043e\u043a\u0430\u0436\u0438 \u0440\u0435\u0437\u0443\u043b\u0442\u0430\u0442",
		optionWindowTabSettingsControlMoves: "\u041f\u043e\u043a\u0430\u0436\u0438 \u043d\u0430\u043f\u0440\u0430\u0432\u0435\u043d\u0438 \u0445\u043e\u0434\u043e\u0432\u0435",
		optionWindowTabLanguageHeader: "\u0415\u0437\u0438\u043a",
		optionWindowTabSettingsLangLabel: "You have changed the language to <b>{lang}</b> to show changes it is required to refresh page. Do you want to do it now?.",
		optionSkinHeader: "\u0422\u0435\u043c\u0430",
		optionSkinTabThemeHeader: "\u0422\u0435\u043c\u0430",
		optionSkinTabCardHeader: "\u0414\u043e\u043f\u044a\u043b\u043d\u0438\u0442\u0435\u043b\u043d\u0438",
		optionWindowSelectedSkinItem: " (\u0438\u0437\u0431\u0440\u0430\u043d\u0438)",
		optionWindowChangedThemeSkinItem: " \u0432\u044a\u0437\u0441\u0442\u0430\u043d\u043e\u0432\u044f\u0432\u0430\u043d\u0435 \u043d\u0430 \u0442\u0435\u043c\u0430",
		winHeader: "\u0418\u0433\u0440\u0430 \u0441\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043a\u0430",
		winGameTypeHead: "\u0432\u0438\u0434 \u0438\u0433\u0440\u0430:",
		"win.klondike:turn-one": "Klondike 1",
		"win.klondike:turn-three": "Klondike 3",
		"win.double-klondike:turn-one": "2 Klondike 1",
		"win.double-klondike:turn-three": "2 Klondike 3",
		"win.spider:one-suit": "\u041f\u0430\u044f\u043a 1",
		"win.spider:two-suits": "\u041f\u0430\u044f\u043a 2",
		"win.spider:four-suits": "\u041f\u0430\u044f\u043a 4",
		"win.forty-thieves": "Forty Thieves",
		winScoringSystemHead: "\u0420\u0435\u0437\u0443\u043b\u0442\u0430\u0442\u0438:",
		winScoringSystemStandard: "\u0441\u0442\u0430\u043d\u0434\u0430\u0440\u0442",
		winScoringSystemTimed: "\u041e\u0433\u0440\u0430\u043d\u0438\u0447\u0438",
		winMovesHead: "\u043d\u0430\u043f\u0440\u0430\u0432\u0438 Moves:",
		winTimeHead: "\u0432\u0440\u0435\u043c\u0435 \u0432 \u0438\u0433\u0440\u0430\u0442\u0430:",
		winBonusHead: "\u043f\u0440\u0435\u043c\u0438\u044f:",
		winScoresHead: "\u0440\u0435\u0437\u0443\u043b\u0442\u0430\u0442:",
		winBestScoresHead: "\u041d\u0430\u0439-\u0434\u043e\u0431\u044a\u0440 \u0440\u0435\u0437\u0443\u043b\u0442\u0430\u0442:",
		winRedealButton: "\u041e\u043f\u0438\u0442\u0430\u0439 \u043f\u0430\u043a",
		winNewGameButton: "\u041d\u043e\u0432\u0430 \u0438\u0433\u0440\u0430",
		pauseHeader: "\u043f\u0430\u0443\u0437\u0430",
		pauseContent: "\u041f\u0440\u043e\u0431\u0438\u0432 \u0432 \u0438\u0433\u0440\u0430\u0442\u0430<br/>...",
		pauseButtonResume: "\u043e\u0431\u043e\u0431\u0449\u0435\u043d\u0438\u0435",
		cancel: "\u043e\u0442\u043c\u0435\u043d\u044f\u043c"
	}
}).call(Solitaire);
(function () {
	this.Language = this.Language || {};
	this.Language.bs = {
		menuButton: "Meni",
		menuNewGameButton: "Nova igra",
		menuRestartGameButton: "Ponoviti igru",
		menuSelectGameButton: "Select game",
		menuOptionButton: "Opcije",
		menuSkinButton: "Tema",
		menuInfoButton: '<img src="' + SS + 'images/info.png" alt="" />',
		menuUndo: '<img src="' + SS + 'images/undo.png" alt="">&nbsp;&nbsp;Nazad',
		labelTime: "Vrijeme: {var}",
		labelScore: "Uspjeh: {var}",
		labelMoves: "Potezi: {var}",
		"game.play": "Play",
		"game.show-on-startup": "Show the window every time page is refreshed",
		optionWindowHeader: "Opcije",
		optionWindowTabGameHeader: "Igre",
		"klondike:turn-one": "Klondike - Vuci jednu",
		"klondike:turn-three": "Klondike - Vuci tri",
		"double-klondike:turn-one": "Dupli Klondike - Vuci jednu",
		"double-klondike:turn-three": "Dupli Klondike - Vuci tri",
		"spider:one-suit": "Pauk - Jedna boja",
		"spider:two-suits": "Pauk - Dvije boje",
		"spider:four-suits": "Pauk - \u010cetiri boje",
		"forty-thieves": "Forty Thievies",
		"coming-soon": "coming soon",
		"difficulty-level": "Te\u0161koc\u0301a",
		optionWindowTabScoringHeader: "Uspjeh",
		scoringStandardMode: "Standardni sistem uspjeha",
		scoringTimedMode: "Vremenski sistem uspjeha",
		optionWindowTabSettingsHeader: "Pode\u0161avanje",
		"option.settings-sound-header": "Tonovi:",
		"option.settings-sound-header-not-supported": "not supported by your browser",
		"option.settings-sound-pack-wood": "Paket - Drvo",
		"option.settings-sound-pack-plastic": "Paket - Plastika",
		"option.settings-sound-off": "Bez tonova",
		optionWindowTabSettingsAutoHeader: "Automatski potez:",
		optionWindowTabSettingsAutoFlip: "Automatsko okretanje karata",
		optionWindowTabSettingsAutoMoveWhenWon: "Automatsko igranje kada pobijedite",
		optionWindowTabSettingsAutoMoveOff: "Nemoj automatski igrati",
		optionWindowTabSettingsControlHeader: "Kontrole:",
		optionWindowTabSettingsControlTime: "Poka\u017ei broja\u010d vremena",
		optionWindowTabSettingsControlScores: "Poka\u017ei uspjeh",
		optionWindowTabSettingsControlMoves: "Poka\u017ei broj poteza",
		optionWindowTabLanguageHeader: "Jezik",
		optionWindowTabSettingsLangLabel: "You have changed the language to <b>{lang}</b> to show changes it is required to refresh page. Do you want to do it now?.",
		optionSkinHeader: "Tema",
		optionSkinTabThemeHeader: "Tema",
		optionSkinTabCardHeader: "Napredno",
		optionWindowSelectedSkinItem: " (Izabran)",
		optionWindowChangedThemeSkinItem: " Vratite temu",
		winHeader: "Statistika",
		winGameTypeHead: "Igra:",
		"win.klondike:turn-one": "Klondike 1",
		"win.klondike:turn-three": "Klondike 3",
		"win.double-klondike:turn-one": "Dupli Klondike 1",
		"win.double-klondike:turn-three": "Dupli Klondike 3",
		"win.spider:one-suit": "Pauk 1",
		"win.spider:two-suits": "Pauk 2",
		"win.spider:four-suits": "Pauk 4",
		"win.forty-thieves": "Forty Thieves",
		winScoringSystemHead: "Uspjeh:",
		winScoringSystemStandard: "Standard",
		winScoringSystemTimed: "Timed",
		winMovesHead: "Potezi:",
		winTimeHead: "Vrijeme:",
		winBonusHead: "Bonus:",
		winScoresHead: "Uspjeh:",
		winBestScoresHead: "Najbolji rezultat:",
		winRedealButton: "Ponoviti igru",
		winNewGameButton: "Nova igra",
		pauseHeader: "Pauza",
		pauseContent: "Pauza u igri<br/>...",
		pauseButtonResume: "Nastavi",
		cancel: "Cancel"
	}
}).call(Solitaire);
(function () {
	this.Language = this.Language || {};
	this.Language.ca = {
		menuButton: "Men\u00fa",
		menuNewGameButton: "Joc nou",
		menuRestartGameButton: "Tornar a provar",
		menuSelectGameButton: "seleccionar joc",
		menuOptionButton: "Opcions",
		menuSkinButton: "Aparen\u00e7a",
		menuInfoButton: '<img src="' + SS + 'images/info.png" alt="" />',
		menuUndo: '<img src="' + SS + 'images/undo.png" alt="">&nbsp;&nbsp;Desf\u00e9s',
		labelTime: "Temps: {var}",
		labelScore: "Puntuaci\u00f3: {var}",
		labelMoves: "Moviments: {var}",
		"game.play": "Jugar",
		"game.show-on-startup": "Mostra en l'inici",
		optionWindowHeader: "Opcions",
		optionWindowTabGameHeader: "Jocs",
		"klondike:turn-one": "Klondike - una carta",
		"klondike:turn-three": "Klondike - tres cartes",
		"double-klondike:turn-one": "Doble klondike - una carta",
		"double-klondike:turn-three": "Doble klondike - tres cartes",
		"spider:one-suit": "Spider - una suit",
		"spider:two-suits": "Spider - dos suits",
		"spider:four-suits": "Spider - quatre suits",
		"forty-thieves": "Quaranta lladres",
		"coming-soon": "coming soon",
		"difficulty-level": "dificultat",
		optionWindowTabScoringHeader: "Puntuaci\u00f3",
		scoringStandardMode: "Sistema est\u00e0ndard de puntuaci\u00f3",
		scoringTimedMode: "Sistema de puntuaci\u00f3 per temps",
		optionWindowTabSettingsHeader: "Ajustaments",
		"option.settings-sound-header": "So::",
		"option.settings-sound-header-not-supported": "not supported by your browser",
		"option.settings-sound-pack-wood": "Empaquetat - Fusta",
		"option.settings-sound-pack-plastic": "Empaquetat - Pl\u00e0stic",
		"option.settings-sound-off": "No reproduir sons",
		optionWindowTabSettingsAutoHeader: "Auto-moure:",
		optionWindowTabSettingsAutoFlip: "Auto girar cartes",
		optionWindowTabSettingsAutoMoveWhenWon: "Auto jugar quan guanyo",
		optionWindowTabSettingsAutoMoveOff: "No-auto jugar",
		optionWindowTabSettingsControlHeader: "Controls:",
		optionWindowTabSettingsControlTime: "Mostra temps",
		optionWindowTabSettingsControlScores: "Mostra puntuaci\u00f3",
		optionWindowTabSettingsControlMoves: "Mostra moviments fets",
		optionWindowTabLanguageHeader: "Idioma",
		optionWindowTabSettingsLangLabel: "You have changed the language to <b>{lang}</b> to show changes it is required to refresh page. Do you want to do it now?.",
		optionSkinHeader: "Aparen\u00e7a",
		optionSkinTabThemeHeader: "Aparen\u00e7a",
		optionSkinTabCardHeader: "Avan\u00e7at",
		optionWindowSelectedSkinItem: " (seleccionat)",
		optionWindowChangedThemeSkinItem: " restaurar el tema",
		winHeader: "Estad\u00edstiques",
		winGameTypeHead: "Joc:",
		"win.klondike:turn-one": "Klondike 1",
		"win.klondike:turn-three": "Klondike 3",
		"win.double-klondike:turn-one": "Doble klondike 1",
		"win.double-klondike:turn-three": "Doble klondike 3",
		"win.spider:one-suit": "Spider 1",
		"win.spider:two-suits": "Spider 2",
		"win.spider:four-suits": "Spider 4",
		"win.forty-thieves": "Quaranta lladres",
		winScoringSystemHead: "Puntuaci\u00f3:",
		winScoringSystemStandard: "Est\u00e0ndard",
		winScoringSystemTimed: "Programat",
		winMovesHead: "Moviments:",
		winTimeHead: "Temps:",
		winBonusHead: "Prima:",
		winScoresHead: "Puntuaci\u00f3:",
		winBestScoresHead: "Millor puntuaci\u00f3:",
		winRedealButton: "Tornar a provar",
		winNewGameButton: "Joc nou",
		pauseHeader: "Fer una pausa",
		pauseContent: "Trencament en el joc<br/>...",
		pauseButtonResume: "Reprendre",
		cancel: "cancel\u00b7lar"
	}
}).call(Solitaire);
(function () {
	this.Language = this.Language || {};
	this.Language.cs = {
		menuButton: "Menu",
		menuNewGameButton: "Nov\u00e1 hra",
		menuRestartGameButton: "Opakuj hru",
		menuSelectGameButton: "Zvolit hru",
		menuOptionButton: "Mo\u017enosti",
		menuSkinButton: "T\u00e9mata",
		menuInfoButton: '<img src="' + SS + 'images/info.png" alt="" />',
		menuUndo: '<img src="' + SS + 'images/undo.png" alt="">&nbsp;&nbsp;Zp\u011bt',
		labelTime: "\u010cas: {var}",
		labelScore: "Bod\u016f: {var}",
		labelMoves: "Tah\u016f: {var}",
		"game.play": "Hr\u00e1t",
		"game.show-on-startup": "Zobrazit na startu",
		optionWindowHeader: "Mo\u017enosti",
		optionWindowTabGameHeader: "Typ hry",
		"klondike:turn-one": "Klondike - obracet 1 kartu",
		"klondike:turn-three": "Klondike - obracet 3 karty",
		"double-klondike:turn-one": "Zdvojn\u00e1sobit Klondike - obracet 1 kartu",
		"double-klondike:turn-three": "Zdvojn\u00e1sobit Klondike - obracet 3 karty",
		"spider:one-suit": "Pavouk - jeden oblek",
		"spider:two-suits": "Pavouk - dva obleky",
		"spider:four-suits": "Pavouk - \u010dty\u0159i obleky",
		"forty-thieves": "Forty Thieves",
		"coming-soon": "Ji\u017e brzy",
		"difficulty-level": "obt\u00ed\u017e",
		optionWindowTabScoringHeader: "Bodov\u00e1n\u00ed",
		scoringStandardMode: "Klasick\u00e9",
		scoringTimedMode: "\u010casov\u011b z\u00e1visl\u00e9",
		optionWindowTabSettingsHeader: "Dal\u0161\u00ed nastaven\u00ed",
		"option.settings-sound-header": "Zvuk:",
		"option.settings-sound-header-not-supported": "nen\u00ed prohl\u00ed\u017ee\u010d nepodporuje",
		"option.settings-sound-pack-wood": "Bal\u00ed\u010dek - D\u0159evo",
		"option.settings-sound-pack-plastic": "Bal\u00ed\u010dek - Plast",
		"option.settings-sound-off": "Nehraj\u00ed \u017e\u00e1dn\u00e9 zvuky",
		optionWindowTabSettingsAutoHeader: "Automatick\u00e9 tahy:",
		optionWindowTabSettingsAutoFlip: "Automaticky ot\u00e1\u010det karty",
		optionWindowTabSettingsAutoMoveWhenWon: "Automaticky dohr\u00e1t pokud zv\u00edt\u011bz\u00edm",
		optionWindowTabSettingsAutoMoveOff: "\u017d\u00e1dn\u00e1 automatick\u00e1 hra",
		optionWindowTabSettingsControlHeader: "Zobrazen\u00ed:",
		optionWindowTabSettingsControlTime: "Uk\u00e1zat \u010das",
		optionWindowTabSettingsControlScores: "Uk\u00e1zat body",
		optionWindowTabSettingsControlMoves: "Uk\u00e1zat tahy",
		optionWindowTabLanguageHeader: "Jazyk",
		optionWindowTabSettingsLangLabel: "You have changed the language to <b>{lang}</b> to show changes it is required to refresh page. Do you want to do it now?.",
		optionSkinHeader: "Motiv",
		optionSkinTabThemeHeader: "Motiv",
		optionSkinTabCardHeader: "Roz\u0161\u00ed\u0159en\u00e9 mo\u017enosti",
		optionWindowSelectedSkinItem: " (vybran\u00fd)",
		optionWindowChangedThemeSkinItem: " obnoven\u00ed motiv",
		winHeader: "Hra Stats",
		winGameTypeHead: "Typ hry:",
		"win.klondike:turn-one": "Klondike 1",
		"win.klondike:turn-three": "Klondike 3",
		"win.double-klondike:turn-one": "2 Klondike 1",
		"win.double-klondike:turn-three": "2 Klondike 3",
		"win.spider:one-suit": "Pavouk 1",
		"win.spider:two-suits": "Pavouk 2",
		"win.spider:four-suits": "Pavouk 4",
		"win.forty-thieves": "Forty Thieves",
		winScoringSystemHead: "Bodovac\u00ed syst\u00e9m:",
		winScoringSystemStandard: "Standardn\u00ed",
		winScoringSystemTimed: "Do\u010dasn\u00fd",
		winMovesHead: "P\u0159esune se:",
		winTimeHead: "Hern\u00ed \u010das:",
		winBonusHead: "Pr\u00e9mie:",
		winScoresHead: "Sk\u00f3re:",
		winBestScoresHead: "Nejlep\u0161\u00ed sk\u00f3re:",
		winRedealButton: "Opakuj hru",
		winNewGameButton: "Nov\u00e1 hra",
		pauseHeader: "Pauza",
		pauseContent: "P\u0159est\u00e1vka ve h\u0159e<br/>...",
		pauseButtonResume: "Pokra\u010dovat",
		cancel: "Anulovat"
	}
}).call(Solitaire);
(function () {
	this.Language = this.Language || {};
	this.Language.cy = {
		menuButton: "Dewislen",
		menuNewGameButton: "G\u00eam Newydd",
		menuRestartGameButton: "Ail ddechrau'r g\u00eam",
		menuSelectGameButton: "Dewiswch g\u00eam",
		menuOptionButton: "Opsiynau",
		menuSkinButton: "Thema",
		menuInfoButton: '<img src="' + SS + 'images/info.png" alt="" />',
		menuUndo: '<img src="' + SS + 'images/undo.png" alt="">&nbsp;&nbsp;Dadwneud',
		labelTime: "Amser: {var}",
		labelScore: "Sg\u00f4r: {var}",
		labelMoves: "Symudiadau: {var}",
		"game.play": "Chwarae",
		"game.show-on-startup": "Dangos wrth gychwyn",
		optionWindowHeader: "Opsiynau",
		optionWindowTabGameHeader: "Gemau",
		"klondike:turn-one": "Tro Cyntaf - Klondike",
		"klondike:turn-three": "Trydydd tro - Klondike",
		"double-klondike:turn-one": "Klondike Dwbl - Tro Cyntaf",
		"double-klondike:turn-three": "Klondike Dwbl - Trydydd Tro",
		"spider:one-suit": "Corryn - 1 Cyfres o gardiau",
		"spider:two-suits": "Corryn - 2 Gyfres o gardiau",
		"spider:four-suits": "Corryn - 4 Gyfres o gardiau",
		"forty-thieves": "Forty Thievies",
		"coming-soon": "coming soon",
		"difficulty-level": "",
		optionWindowTabScoringHeader: "Sgorio",
		scoringStandardMode: "System sgorio gyffredin",
		scoringTimedMode: "System sgorio wedi'i hamseru",
		optionWindowTabSettingsHeader: "Gosodiadau",
		"option.settings-sound-header": "Seiniau:",
		"option.settings-sound-header-not-supported": "not supported by your browser",
		"option.settings-sound-pack-wood": "Pecyn - Pren",
		"option.settings-sound-pack-plastic": "Pecyn - Plastig",
		"option.settings-sound-off": "Distewi pob sain",
		optionWindowTabSettingsAutoHeader: "Symudiad Cyfrifiadurol:",
		optionWindowTabSettingsAutoFlip: "Dangos y cardiau heb orfod eu clicio",
		optionWindowTabSettingsAutoMoveWhenWon: "Chwarae yn syth ar \u00f4l ennill",
		optionWindowTabSettingsAutoMoveOff: "Peidiwch \u00e2 chwarae yn awtomatig",
		optionWindowTabSettingsControlHeader: "Cyfarwyddiadau:",
		optionWindowTabSettingsControlTime: "Dangos yr amserydd",
		optionWindowTabSettingsControlScores: "Dangos y sg\u00f4r",
		optionWindowTabSettingsControlMoves: "Dangos y nifer o symudiadau",
		optionWindowTabLanguageHeader: "Iaith",
		optionWindowTabSettingsLangLabel: "You have changed the language to <b>{lang}</b> to show changes it is required to refresh page. Do you want to do it now?.",
		optionSkinHeader: "Thema",
		optionSkinTabThemeHeader: "Thema",
		optionSkinTabCardHeader: "Datblygedig",
		optionWindowSelectedSkinItem: " (a ddewiswyd)",
		optionWindowChangedThemeSkinItem: " adfer thema",
		winHeader: "G\u00eam ystadegau",
		winGameTypeHead: "G\u00eam:",
		"win.klondike:turn-one": "Klondike 1",
		"win.klondike:turn-three": "Klondike 3",
		"win.double-klondike:turn-one": "Dwbl Klondike 1",
		"win.double-klondike:turn-three": "Dwbl Klondike 3",
		"win.spider:one-suit": "Corryn 1",
		"win.spider:two-suits": "Corryn 2",
		"win.spider:four-suits": "Corryn 4",
		"win.forty-thieves": "Forty Thieves",
		winScoringSystemHead: "Sgorio:",
		winScoringSystemStandard: "Safonol",
		winScoringSystemTimed: "Hamseru",
		winMovesHead: "Symudiadau:",
		winTimeHead: "Amser:",
		winBonusHead: "Bonws:",
		winScoresHead: "Sg\u00f4r:",
		winBestScoresHead: "Sg\u00f4r gorau:",
		winRedealButton: "Ail ddechrau'r g\u00eam",
		winNewGameButton: "G\u00eam Newydd",
		pauseHeader: "Oedi",
		pauseContent: "Toriad yn y g\u00eam<br/>...",
		pauseButtonResume: "Ailddechrau",
		cancel: "Ganslo"
	}
}).call(Solitaire);
(function () {
	this.Language = this.Language || {};
	this.Language.da = {
		menuButton: "Menu",
		menuNewGameButton: "Nyt spil",
		menuRestartGameButton: "Pr\u00f8v igen",
		menuSelectGameButton: "V\u00e6lg spil",
		menuOptionButton: "Funktioner",
		menuSkinButton: "Udseende",
		menuInfoButton: '<img src="' + SS + 'images/info.png" alt="" />',
		menuUndo: '<img src="' + SS + 'images/undo.png" alt="">&nbsp;&nbsp;Fortryd',
		labelTime: "Tid: {var}",
		labelScore: "Points: {var}",
		labelMoves: "Tr\u00e6k: {var}",
		"game.play": "Spil",
		"game.show-on-startup": "Vis p\u00e5 opstart",
		optionWindowHeader: "Funktioner",
		optionWindowTabGameHeader: "Spil",
		"klondike:turn-one": "7 Kabale - Vend 1",
		"klondike:turn-three": "7 Kabale - Vend 3",
		"double-klondike:turn-one": "7 Kabale dobbelt - Vend 1",
		"double-klondike:turn-three": "7 Kabale dobbelt - Vend 3",
		"spider:one-suit": "Spider - En",
		"spider:two-suits": "Spider - To",
		"spider:four-suits": "Spider - Fire",
		"forty-thieves": "Forty Thievies",
		"coming-soon": "kommer snart",
		"difficulty-level": "besv\u00e6r",
		optionWindowTabScoringHeader: "Points",
		scoringStandardMode: "Standard points system",
		scoringTimedMode: "Tidspoints system",
		optionWindowTabSettingsHeader: "Indstillinger",
		"option.settings-sound-header": "Lyd:",
		"option.settings-sound-header-not-supported": "not supported by your browser",
		"option.settings-sound-pack-wood": "Tr\u00e6 lyde",
		"option.settings-sound-pack-plastic": "Plastik lyde",
		"option.settings-sound-off": "Ingen lyde",
		optionWindowTabSettingsAutoHeader: "Autoflyt:",
		optionWindowTabSettingsAutoFlip: "Auto vend kort",
		optionWindowTabSettingsAutoMoveWhenWon: "Autospil ved vind",
		optionWindowTabSettingsAutoMoveOff: "Autospil ikke",
		optionWindowTabSettingsControlHeader: "Kontrol:",
		optionWindowTabSettingsControlTime: "Vis timer",
		optionWindowTabSettingsControlScores: "Vis points",
		optionWindowTabSettingsControlMoves: "Vis antal tr\u00e6k",
		optionWindowTabLanguageHeader: "Sprog",
		optionWindowTabSettingsLangLabel: "You have changed the language to <b>{lang}</b> to show changes it is required to refresh page. Do you want to do it now?.",
		optionSkinHeader: "Udseende",
		optionSkinTabThemeHeader: "Udseende",
		optionSkinTabCardHeader: "Advanceret",
		optionWindowSelectedSkinItem: " (valgt)",
		optionWindowChangedThemeSkinItem: " gendanne tema",
		winHeader: "Statistik",
		winGameTypeHead: "Spil:",
		"win.klondike:turn-one": "7 Kabale - 1",
		"win.klondike:turn-three": "7 Kabale - 3",
		"win.double-klondike:turn-one": "7 Kabale dobbelt - 1",
		"win.double-klondike:turn-three": "7 Kabale dobbelt - 3",
		"win.spider:one-suit": "Spider - 1",
		"win.spider:two-suits": "Spider - 2",
		"win.spider:four-suits": "Spider - 4",
		"win.forty-thieves": "Forty Thieves",
		winScoringSystemHead: "Points:",
		winScoringSystemStandard: "Standard",
		winScoringSystemTimed: "Tidsindstillet",
		winMovesHead: "Tr\u00e6k:",
		winTimeHead: "Tid:",
		winBonusHead: "Bonus:",
		winScoresHead: "Points:",
		winBestScoresHead: "Bedste score:",
		winRedealButton: "Pr\u00f8v igen",
		winNewGameButton: "Nyt spil",
		pauseHeader: "Pause",
		pauseContent: "Bryde i spillet<br/>...",
		pauseButtonResume: "Genoptag",
		cancel: "Annullere"
	}
}).call(Solitaire);
(function () {
	this.Language = this.Language || {};
	this.Language.de = {
		menuButton: "Menu",
		menuNewGameButton: "Neues Spiel",
		menuRestartGameButton: "Neu starten",
		menuSelectGameButton: "Spiel w\u00e4hlen",
		menuOptionButton: "Optionen",
		menuSkinButton: "Darstellung",
		menuInfoButton: '<img src="' + SS + 'images/info.png" alt="" />',
		menuUndo: '<img src="' + SS + 'images/undo.png" alt="">&nbsp;&nbsp;R\u00fcckg\u00e4ngig',
		labelTime: "Zeit: {var}",
		labelScore: "Spielstand: {var}",
		labelMoves: "Z\u00fcge: {var}",
		"game.play": "Spielen",
		"game.show-on-startup": "Zeigen Sie auf Start",
		optionWindowHeader: "Optionen",
		optionWindowTabGameHeader: "Spiele",
		"klondike:turn-one": "Klondike - Eine Ziehen",
		"klondike:turn-three": "Klondike - Drei Ziehen",
		"double-klondike:turn-one": "Doppelt klondike - Eine Ziehen",
		"double-klondike:turn-three": "Doppelt klondike - Drei Ziehen",
		"spider:one-suit": "Spinne - Eine Farbe",
		"spider:two-suits": "Spinne - Zwei Farben",
		"spider:four-suits": "Spinne - Vier Farben",
		"forty-thieves": "Forty Thievies",
		"coming-soon": "in K\u00fcrze",
		"difficulty-level": "schwierigkeit",
		optionWindowTabScoringHeader: "Spielstand",
		scoringStandardMode: "Standard-Punktez\u00e4hlung",
		scoringTimedMode: "Zeit-Punktez\u00e4hlung",
		optionWindowTabSettingsHeader: "Einstellungen",
		"option.settings-sound-header": "Sounds:",
		"option.settings-sound-header-not-supported": "von Ihrem Browser nicht unterst\u00fctzt",
		"option.settings-sound-pack-wood": "Holz-Sounds",
		"option.settings-sound-pack-plastic": "Plastik-Sounds",
		"option.settings-sound-off": "Keine Sounds wiedergeben",
		optionWindowTabSettingsAutoHeader: "Automatisch spielen:",
		optionWindowTabSettingsAutoFlip: "Karten automatisch umdrehen",
		optionWindowTabSettingsAutoMoveWhenWon: "Automatisch fertig spielen",
		optionWindowTabSettingsAutoMoveOff: "Nicht automatisch spielen",
		optionWindowTabSettingsControlHeader: "Anzeigen:",
		optionWindowTabSettingsControlTime: "Zeit anzeigen",
		optionWindowTabSettingsControlScores: "Spielstand anzeigen",
		optionWindowTabSettingsControlMoves: "Z\u00fcge anzeigen",
		optionWindowTabLanguageHeader: "Sprache",
		optionWindowTabSettingsLangLabel: "You have changed the language to <b>{lang}</b> to show changes it is required to refresh page. Do you want to do it now?.",
		optionSkinHeader: "Darstellung",
		optionSkinTabThemeHeader: "Darstellung",
		optionSkinTabCardHeader: "Erweitert",
		optionWindowSelectedSkinItem: " (ausgew\u00e4hlt)",
		optionWindowChangedThemeSkinItem: " Haut wiederherzustellen",
		winHeader: "Spielstatistiken",
		winGameTypeHead: "Spiel:",
		"win.klondike:turn-one": "Klondike 1",
		"win.klondike:turn-three": "Klondike 3",
		"win.double-klondike:turn-one": "Doppelt klondike 1",
		"win.double-klondike:turn-three": "Doppelt klondike 3",
		"win.spider:one-suit": "Spinne 1",
		"win.spider:two-suits": "Spinne 2",
		"win.spider:four-suits": "Spinne 4",
		"win.forty-thieves": "Forty Thieves",
		winScoringSystemHead: "Punkte system:",
		winScoringSystemStandard: "Standard",
		winScoringSystemTimed: "Zeit",
		winMovesHead: "Bewegt sich:",
		winTimeHead: "Spielzeit:",
		winBonusHead: "Bonus:",
		winScoresHead: "Spielstand:",
		winBestScoresHead: "Beste ergebnis:",
		winRedealButton: "Neu starten",
		winNewGameButton: "Neues Spiel",
		pauseHeader: "Pause",
		pauseContent: "Pause im Spiel<br/>...",
		pauseButtonResume: "Res\u00fcmee",
		cancel: "Annullieren"
	}
}).call(Solitaire);
(function () {
	this.Language = this.Language || {};
	this.Language.el = {
		menuButton: "\u039c\u03b5\u03bd\u03bf\u03c5",
		menuNewGameButton: "\u039d\u03b5\u03bf \u03a0\u03b1\u03b9\u03c7\u03bd\u03b9\u03b4\u03b9",
		menuRestartGameButton: "\u039e\u03b1\u03bd\u03b1 \u0391\u03c0\u03bf \u03a4\u03b7\u03bd \u0391\u03c1\u03c7\u03b7",
		menuSelectGameButton: "\u0395\u03c0\u03b9\u03bb\u03ad\u03be\u03c4\u03b5 \u03c4\u03bf \u03c0\u03b1\u03b9\u03c7\u03bd\u03af\u03b4\u03b9",
		menuOptionButton: "\u0395\u03c0\u03bb\u03bf\u03b3\u03b5\u03c2",
		menuSkinButton: "\u0398\u03b5\u03bc\u03b1",
		menuInfoButton: '<img src="' + SS + 'images/info.png" alt="" />',
		menuUndo: '<img src="' + SS + 'images/undo.png" alt="">&nbsp;&nbsp;\u0391\u03ba\u03c5\u03c1\u03c9\u03c3\u03b7',
		labelTime: "\u03a7\u03c1\u03bf\u03bd\u03bf\u03c2: {var}",
		labelScore: "\u03a3\u03ba\u03bf\u03c1: {var}",
		labelMoves: "\u039a\u03b9\u03bd\u03b7\u03c3\u03b5\u03b9\u03c2: {var}",
		"game.play": "\u03a0\u03b1\u03af\u03be\u03c4\u03b5",
		"game.show-on-startup": "\u0395\u03bc\u03c6\u03ac\u03bd\u03b9\u03c3\u03b7 \u03ba\u03b1\u03c4\u03ac \u03c4\u03b7\u03bd \u03b5\u03ba\u03ba\u03af\u03bd\u03b7\u03c3\u03b7",
		optionWindowHeader: "\u0395\u03c0\u03bb\u03bf\u03b3\u03b5\u03c2",
		optionWindowTabGameHeader: "\u03a0\u03b1\u03b9\u03c7\u03bd\u03b9\u03b4\u03b9\u03b1",
		"klondike:turn-one": "\u03a0\u03b1\u03c3\u03b9\u03b5\u03bd\u03c4\u03b6\u03b1 \u039c\u03bf\u03bd\u03bf \u0393\u03c5\u03c1\u03b9\u03c3\u03bc\u03b1",
		"klondike:turn-three": "\u03a0\u03b1\u03c3\u03b9\u03b5\u03bd\u03c4\u03b6\u03b1 \u03a4\u03c1\u03b9\u03c0\u03bb\u03bf \u0393\u03c5\u03c1\u03b9\u03c3\u03bc\u03b1",
		"double-klondike:turn-one": "\u0394\u03b9\u03c0\u03bb\u03b7 \u03a0\u03b1\u03c3\u03b9\u03b5\u03bd\u03c4\u03b6\u03b1 - \u039c\u03bf\u03bd\u03bf \u0393\u03c5\u03c1\u03b9\u03c3\u03bc\u03b1",
		"double-klondike:turn-three": "\u0394\u03b9\u03c0\u03bb\u03b7 \u03a0\u03b1\u03c3\u03b9\u03b5\u03bd\u03c4\u03b6\u03b1 - \u03a4\u03c1\u03b9\u03c0\u03bb\u03bf \u0393\u03c5\u03c1\u03b9\u03c3\u03bc\u03b1",
		"spider:one-suit": "\u0391\u03c1\u03b1\u03c7\u03bd\u03b7",
		"spider:two-suits": "\u0391\u03c1\u03b1\u03c7\u03bd\u03b7 - \u0394\u03b9\u03c0\u03bb\u03b7 \u03a3\u03c4\u03bf\u03b9\u03b2\u03b1",
		"spider:four-suits": "\u0391\u03c1\u03b1\u03c7\u03bd\u03b7 - \u03a4\u03b5\u03c4\u03c1\u03b1\u03c0\u03bb\u03b7 \u03a3\u03c4\u03bf\u03b9\u03b2\u03b1",
		"forty-thieves": "\u03a3\u03b1\u03c1\u03ac\u03bd\u03c4\u03b1 \u03ba\u03bb\u03ad\u03c6\u03c4\u03b5\u03c2",
		"coming-soon": "coming soon",
		"difficulty-level": "\u03b4\u03c5\u03c3\u03ba\u03bf\u03bb\u03af\u03b1",
		optionWindowTabScoringHeader: "\u03a3\u03ba\u03bf\u03c1\u03b1\u03c1\u03b9\u03c3\u03bc\u03b1",
		scoringStandardMode: "\u0392\u03b1\u03c3\u03b9\u03ba\u03bf \u03a3\u03c5\u03c3\u03c4\u03b7\u03bc\u03b1 \u03a3\u03ba\u03bf\u03c1\u03b1\u03c1\u03b9\u03c3\u03bc\u03b1\u03c4\u03bf\u03c2",
		scoringTimedMode: "\u03a3\u03ba\u03bf\u03c1 \u03a7\u03c1\u03bf\u03bd\u03bf\u03c5",
		optionWindowTabSettingsHeader: "\u0395\u03c0\u03b9\u03bb\u03bf\u03b3\u03b5\u03c2",
		"option.settings-sound-header": "\u0397\u03c7\u03bf\u03b9:",
		"option.settings-sound-header-not-supported": "not supported by your browser",
		"option.settings-sound-pack-wood": "\u0395\u03c0\u03b9\u03c6\u03b1\u03bd\u03b5\u03b9\u03b1 \u03be\u03c5\u03bb\u03bf\u03c5",
		"option.settings-sound-pack-plastic": "\u0395\u03c0\u03b9\u03c6\u03b1\u03bd\u03b5\u03b9\u03b1 \u03a0\u03bb\u03b1\u03c3\u03c4\u03b9\u03ba\u03b7",
		"option.settings-sound-off": "\u03a3\u03b9\u03b3\u03b1\u03c3\u03b7",
		optionWindowTabSettingsAutoHeader: "\u0391\u03c5\u03c4\u03bf\u03bc\u03b1\u03c4\u03b7 \u039a\u03b9\u03bd\u03b7\u03c3\u03b7:",
		optionWindowTabSettingsAutoFlip: "\u0391\u03c5\u03c4\u03bf\u03bc\u03b1\u03c4\u03bf \u0391\u03bd\u03bf\u03b9\u03b3\u03bc\u03b1 \u03a7\u03b1\u03c1\u03c4\u03b9\u03c9\u03bd",
		optionWindowTabSettingsAutoMoveWhenWon: "Auto \u039d\u03b9\u03ba\u03b7\u03c2",
		optionWindowTabSettingsAutoMoveOff: "\u039c\u03b7 \u0391\u03c5\u03c4\u03bf\u03bc\u03b1\u03c4\u03bf",
		optionWindowTabSettingsControlHeader: "\u03a7\u03b5\u03b9\u03c1\u03b9\u03c3\u03bc\u03bf\u03c2:",
		optionWindowTabSettingsControlTime: "\u0395\u03bc\u03c6\u03b1\u03bd\u03b9\u03c3\u03b7 \u03a7\u03c1\u03bf\u03bd\u03bf\u03c5",
		optionWindowTabSettingsControlScores: "\u0395\u03bc\u03c6\u03b1\u03bd\u03b9\u03c3\u03b7 \u03a3\u03ba\u03bf\u03c1",
		optionWindowTabSettingsControlMoves: "\u0395\u03bc\u03c6\u03b1\u03bd\u03b9\u03c3\u03b7 \u039a\u03b9\u03bd\u03b7\u03c3\u03b5\u03c9\u03bd",
		optionWindowTabLanguageHeader: "\u0393\u03bb\u03c9\u03c3\u03c3\u03b5\u03c2",
		optionWindowTabSettingsLangLabel: "You have changed the language to <b>{lang}</b> to show changes it is required to refresh page. Do you want to do it now?.",
		optionSkinHeader: "\u0398\u03b5\u03bc\u03b1",
		optionSkinTabThemeHeader: "\u0398\u03b5\u03bc\u03b1",
		optionSkinTabCardHeader: "\u0395\u03be\u03c4\u03c1\u03b1",
		optionWindowSelectedSkinItem: " (\u03b5\u03c0\u03b9\u03bb\u03ad\u03b3\u03bf\u03bd\u03c4\u03b1\u03b9)",
		optionWindowChangedThemeSkinItem: " \u03b5\u03c0\u03b1\u03bd\u03b1\u03c6\u03ad\u03c1\u03b5\u03c4\u03b5 \u03c4\u03bf \u03b8\u03ad\u03bc\u03b1",
		winHeader: "\u03a3\u03c4\u03b1\u03c4\u03b9\u03c3\u03c4\u03b9\u03ba\u03ac",
		winGameTypeHead: "\u03c0\u03b1\u03b9\u03c7\u03bd\u03af\u03b4\u03b9:",
		"win.klondike:turn-one": "\u03a0\u03b1\u03c3\u03b9\u03b5\u03bd\u03c4\u03b6\u03b1 1",
		"win.klondike:turn-three": "\u03a0\u03b1\u03c3\u03b9\u03b5\u03bd\u03c4\u03b6\u03b1 3",
		"win.double-klondike:turn-one": "\u0394\u03b9\u03c0\u03bb\u03b7 \u03a0\u03b1\u03c3\u03b9\u03b5\u03bd\u03c4\u03b6\u03b1 1",
		"win.double-klondike:turn-three": "\u0394\u03b9\u03c0\u03bb\u03b7 \u03a0\u03b1\u03c3\u03b9\u03b5\u03bd\u03c4\u03b6\u03b1 3",
		"win.spider:one-suit": "\u0391\u03c1\u03b1\u03c7\u03bd\u03b7 1",
		"win.spider:two-suits": "\u0391\u03c1\u03b1\u03c7\u03bd\u03b7 2",
		"win.spider:four-suits": "\u0391\u03c1\u03b1\u03c7\u03bd\u03b7 4",
		"win.forty-thieves": "\u03a3\u03b1\u03c1\u03ac\u03bd\u03c4\u03b1 \u03ba\u03bb\u03ad\u03c6\u03c4\u03b5\u03c2",
		winScoringSystemHead: "\u03a3\u03ba\u03bf\u03c1\u03b1\u03c1\u03b9\u03c3\u03bc\u03b1:",
		winScoringSystemStandard: "\u03c0\u03c1\u03cc\u03c4\u03c5\u03c0\u03bf",
		winScoringSystemTimed: "\u03a0\u03b1\u03c1\u03bf\u03b4\u03b9\u03ba\u03cc",
		winMovesHead: "\u039a\u03b9\u03bd\u03b7\u03c3\u03b5\u03b9\u03c2:",
		winTimeHead: "\u03a7\u03c1\u03bf\u03bd\u03bf\u03c2:",
		winBonusHead: "\u039c\u03c0\u03cc\u03bd\u03bf\u03c5\u03c2:",
		winScoresHead: "\u03a3\u03ba\u03bf\u03c1:",
		winBestScoresHead: "\u03ba\u03b1\u03bb\u03cd\u03c4\u03b5\u03c1\u03b7 \u03b2\u03b1\u03b8\u03bc\u03bf\u03bb\u03bf\u03b3\u03af\u03b1:",
		winRedealButton: "\u039e\u03b1\u03bd\u03b1 \u0391\u03c0\u03bf \u03a4\u03b7\u03bd \u0391\u03c1\u03c7\u03b7",
		winNewGameButton: "\u039d\u03b5\u03bf \u03a0\u03b1\u03b9\u03c7\u03bd\u03b9\u03b4\u03b9",
		pauseHeader: "\u03c0\u03b1\u03cd\u03c3\u03b7",
		pauseContent: "\u0394\u03b9\u03ac\u03bb\u03b5\u03b9\u03bc\u03bc\u03b1 \u03c3\u03c4\u03bf \u03c0\u03b1\u03b9\u03c7\u03bd\u03af\u03b4\u03b9<br/>...",
		pauseButtonResume: "\u03a3\u03c5\u03bd\u03ad\u03c7\u03b9\u03c3\u03b7",
		cancel: "\u03b1\u03ba\u03c5\u03c1\u03ce\u03bd\u03c9"
	}
}).call(Solitaire);
(function () {
	this.Language = this.Language || {};
	this.Language["en-us"] = {
		menuButton: "Menu",
		menuNewGameButton: "New game",
		menuRestartGameButton: "Retry game",
		menuSelectGameButton: "Select game",
		menuOptionButton: "Option",
		menuSkinButton: "Theme",
		menuInfoButton: '<img src="' + SS + 'images/info.png" alt="" />',
		menuUndo: '<img src="' + SS + 'images/undo.png" alt="">&nbsp;&nbsp;Undo',
		labelTime: "Time: {var}",
		labelScore: "Score: {var}",
		labelMoves: "Moves: {var}",
		"game.play": "Play",
		"game.show-on-startup": "Show the window every time page is refreshed",
		optionWindowHeader: "Option",
		optionWindowTabGameHeader: "Games",
		"klondike:turn-one": "Klondike - Turn one",
		"klondike:turn-three": "Klondike - Turn three",
		"double-klondike:turn-one": "Double klondike - Turn one",
		"double-klondike:turn-three": "Double klondike - Turn three",
		"spider:one-suit": "Spider - One suit",
		"spider:two-suits": "Spider - Two suits",
		"spider:four-suits": "Spider - Four suits",
		"forty-thieves": "Forty Thievies",
		"coming-soon": "coming soon",
		"difficulty-level": "difficulty",
		optionWindowTabScoringHeader: "Scoring",
		scoringStandardMode: "Standard scoring system",
		scoringTimedMode: "Timed scoring system",
		optionWindowTabSettingsHeader: "Settings",
		"option.settings-sound-header": "Sounds:",
		"option.settings-sound-header-not-supported": "not supported by your browser",
		"option.settings-sound-pack-wood": "Package - Wood",
		"option.settings-sound-pack-plastic": "Package - Plastic",
		"option.settings-sound-off": "Do not play any sounds",
		optionWindowTabSettingsAutoHeader: "Automove:",
		optionWindowTabSettingsAutoFlip: "Auto flip cards",
		optionWindowTabSettingsAutoMoveWhenWon: "Auto play when won",
		optionWindowTabSettingsAutoMoveOff: "Do not auto play",
		optionWindowTabSettingsControlHeader: "Controls:",
		optionWindowTabSettingsControlTime: "Show timer",
		optionWindowTabSettingsControlScores: "Show score",
		optionWindowTabSettingsControlMoves: "Show moves made",
		optionWindowTabLanguageHeader: "Language",
		optionWindowTabSettingsLangLabel: "You have changed the language to <b>{lang}</b> to show changes it is required to refresh page. Do you want to do it now?.",
		optionSkinHeader: "Theme",
		optionSkinTabThemeHeader: "Theme",
		optionSkinTabCardHeader: "Advanced",
		optionWindowSelectedSkinItem: " (selected)",
		optionWindowChangedThemeSkinItem: " restore theme",
		winHeader: "Game Stats",
		winGameTypeHead: "Game type:",
		"win.klondike:turn-one": "Klondike 1",
		"win.klondike:turn-three": "Klondike 3",
		"win.double-klondike:turn-one": "Dbl Klondike 1",
		"win.double-klondike:turn-three": "Dbl Klondike 3",
		"win.spider:one-suit": "Spider 1",
		"win.spider:two-suits": "Spider 2",
		"win.spider:four-suits": "Spider 4",
		"win.forty-thieves": "Forty Thieves",
		winScoringSystemHead: "Scoring system:",
		winScoringSystemStandard: "Standard",
		winScoringSystemTimed: "Timed",
		winMovesHead: "Moves made:",
		winTimeHead: "Game time:",
		winBonusHead: "Bonus:",
		winScoresHead: "Score:",
		winBestScoresHead: "Best score:",
		winRedealButton: "Retry game",
		winNewGameButton: "New game",
		pauseHeader: "Pause",
		pauseContent: "Break in the game<br/>...",
		pauseButtonResume: "Resume",
		cancel: "Cancel"
	}
}).call(Solitaire);
(function () {
	this.Language = this.Language || {};
	this.Language["es-es"] = {
		menuButton: "Menu",
		menuNewGameButton: "Nuevo",
		menuRestartGameButton: "Re-intentar",
		menuSelectGameButton: "Seleccionar juego",
		menuOptionButton: "Opciones",
		menuSkinButton: "Temas",
		menuInfoButton: '<img src="' + SS + 'images/info.png" alt="" />',
		menuUndo: '<img src="' + SS + 'images/undo.png" alt="">&nbsp;&nbsp;Deshacer',
		labelTime: "Tiempo: {var}",
		labelScore: "Punteo: {var}",
		labelMoves: "Movimientos: {var}",
		"game.play": "Jugar",
		"game.show-on-startup": "Mostrar en el inicio",
		optionWindowHeader: "Opciones",
		optionWindowTabGameHeader: "Juegos",
		"klondike:turn-one": "Klondike - Girar una carta",
		"klondike:turn-three": "Klondike - Girar 3 cartas",
		"double-klondike:turn-one": "Doble klondike - Girar una carta",
		"double-klondike:turn-three": "Doble klondike - Girar 3 cartas",
		"spider:one-suit": "Ara\u00f1a - Un traje",
		"spider:two-suits": "Ara\u00f1a - Dos trajes",
		"spider:four-suits": "Ara\u00f1a - Cuatro palos",
		"forty-thieves": "Forty Thievies",
		"coming-soon": "muy pronto",
		"difficulty-level": "dificultad",
		optionWindowTabScoringHeader: "Marcadores",
		scoringStandardMode: "Sistema de Resultados",
		scoringTimedMode: "Resultados por tiempo",
		optionWindowTabSettingsHeader: "Configuracion",
		"option.settings-sound-header": "Sonidos:",
		"option.settings-sound-header-not-supported": "no es compatible con el navegador",
		"option.settings-sound-pack-wood": "Paquete - Madera",
		"option.settings-sound-pack-plastic": "Paquete - De pl\u00e1stico",
		"option.settings-sound-off": "No reproduce ning\u00fan sonido",
		optionWindowTabSettingsAutoHeader: "Automover:",
		optionWindowTabSettingsAutoFlip: "Auto Voltear Cartas",
		optionWindowTabSettingsAutoMoveWhenWon: "Auto Animar cuando ganas",
		optionWindowTabSettingsAutoMoveOff: "No Animar",
		optionWindowTabSettingsControlHeader: "Controles:",
		optionWindowTabSettingsControlTime: "Mostrar Timer",
		optionWindowTabSettingsControlScores: "Mostrar Marcador",
		optionWindowTabSettingsControlMoves: "Mostrar Movimientos Hechos",
		optionWindowTabLanguageHeader: "Idioma",
		optionWindowTabSettingsLangLabel: "You have changed the language to <b>{lang}</b> to show changes it is required to refresh page. Do you want to do it now?.",
		optionSkinHeader: "Temas",
		optionSkinTabThemeHeader: "Temas",
		optionSkinTabCardHeader: "Avanzado",
		optionWindowSelectedSkinItem: " (seleccionado)",
		optionWindowChangedThemeSkinItem: " restaurar tema",
		winHeader: "Estad\u00edsticas del Juego",
		winGameTypeHead: "Juego:",
		"win.klondike:turn-one": "Klondike 1",
		"win.klondike:turn-three": "Klondike 3",
		"win.double-klondike:turn-one": "Doble klondike 1",
		"win.double-klondike:turn-three": "Doble klondike 3",
		"win.spider:one-suit": "Ara\u00f1a 1",
		"win.spider:two-suits": "Ara\u00f1a 2",
		"win.spider:four-suits": "Ara\u00f1a 4",
		"win.forty-thieves": "Forty Thieves",
		winScoringSystemHead: "Marcadores:",
		winScoringSystemStandard: "Est\u00e1ndar",
		winScoringSystemTimed: "Tiempo de espera",
		winMovesHead: "Movimientos realizados:",
		winTimeHead: "Tiempo de juego:",
		winBonusHead: "Prima:",
		winScoresHead: "Puntuaci\u00f3n:",
		winBestScoresHead: "Mejor puntuaci\u00f3n:",
		winRedealButton: "Re-intentar",
		winNewGameButton: "Nuevo",
		pauseHeader: "Pausa",
		pauseContent: "Quiebre en el juego<br/>...",
		pauseButtonResume: "Resumen",
		cancel: "Cancelar"
	}
}).call(Solitaire);
(function () {
	this.Language = this.Language || {};
	this.Language.et = {
		menuButton: "Men\u00fc\u00fc",
		menuNewGameButton: "Uus m\u00e4ng",
		menuRestartGameButton: "Proovi uuesti",
		menuSelectGameButton: "Vali m\u00e4ng",
		menuOptionButton: "Seaded",
		menuSkinButton: "V\u00e4limus",
		menuInfoButton: '<img src="' + SS + 'images/info.png" alt="" />',
		menuUndo: '<img src="' + SS + 'images/undo.png" alt="">&nbsp;&nbsp;Tagasi',
		labelTime: "Aeg: {var}",
		labelScore: "Skoor: {var}",
		labelMoves: "K\u00e4igud: {var}",
		"game.play": "M\u00e4ngima",
		"game.show-on-startup": "N\u00e4ita k\u00e4ivitamisel",
		optionWindowHeader: "Seaded",
		optionWindowTabGameHeader: "M\u00e4ngud",
		"klondike:turn-one": "Klondike - Keera \u00fcks",
		"klondike:turn-three": "Klondike - Keera kolm",
		"double-klondike:turn-one": "Topelt klondike - Keera \u00fcks",
		"double-klondike:turn-three": "Topelt klondike - Keera kolm",
		"spider:one-suit": "Spider - \u00dcks mast",
		"spider:two-suits": "Spider - Kaks masti",
		"spider:four-suits": "Spider - Neli masti",
		"forty-thieves": "Forty Thievies",
		"coming-soon": "varsti",
		"difficulty-level": "raskus",
		optionWindowTabScoringHeader: "Skoor",
		scoringStandardMode: "Tavaline skoorimis s\u00fcsteem",
		scoringTimedMode: "Ajaga skoorimis s\u00fcsteem",
		optionWindowTabSettingsHeader: "Seaded",
		"option.settings-sound-header": "H\u00e4\u00e4led:",
		"option.settings-sound-header-not-supported": "not supported by your browser",
		"option.settings-sound-pack-wood": "Pakk - Puit",
		"option.settings-sound-pack-plastic": "Pakk - Plastik",
		"option.settings-sound-off": "H\u00e4\u00e4letu",
		optionWindowTabSettingsAutoHeader: "Automaatne liigutamine:",
		optionWindowTabSettingsAutoFlip: "Automaatne kaartide keeramine",
		optionWindowTabSettingsAutoMoveWhenWon: "Automaatne liigutamine, kui v\u00f5idetud",
		optionWindowTabSettingsAutoMoveOff: "\u00c4ra m\u00e4ngi automaatselt",
		optionWindowTabSettingsControlHeader: "Nupud:",
		optionWindowTabSettingsControlTime: "N\u00e4ita taimerit",
		optionWindowTabSettingsControlScores: "N\u00e4ita skoori",
		optionWindowTabSettingsControlMoves: "N\u00e4ita tehtud liigutusi",
		optionWindowTabLanguageHeader: "Keel",
		optionWindowTabSettingsLangLabel: "You have changed the language to <b>{lang}</b> to show changes it is required to refresh page. Do you want to do it now?.",
		optionSkinHeader: "V\u00e4limus",
		optionSkinTabThemeHeader: "V\u00e4limus",
		optionSkinTabCardHeader: "Lisaseaded",
		optionWindowSelectedSkinItem: " (v\u00e4ljavalitud)",
		optionWindowChangedThemeSkinItem: " taastada teema",
		winHeader: "Statistika",
		winGameTypeHead: "M\u00e4ng:",
		"win.klondike:turn-one": "Klondike 1",
		"win.klondike:turn-three": "Klondike 3",
		"win.double-klondike:turn-one": "Topelt klondike 1",
		"win.double-klondike:turn-three": "Topelt klondike 3",
		"win.spider:one-suit": "Spider 1",
		"win.spider:two-suits": "Spider 2",
		"win.spider:four-suits": "Spider 4",
		"win.forty-thieves": "Forty Thieves",
		winScoringSystemHead: "Skoor:",
		winScoringSystemStandard: "Standard",
		winScoringSystemTimed: "Ajastatud",
		winMovesHead: "K\u00e4igud:",
		winTimeHead: "Aeg:",
		winBonusHead: "Boonus:",
		winScoresHead: "Skoor:",
		winBestScoresHead: "Parim Skoor:",
		winRedealButton: "Proovi uuesti",
		winNewGameButton: "Uus m\u00e4ng",
		pauseHeader: "Paus",
		pauseContent: "Murda m\u00e4ngus<br/>...",
		pauseButtonResume: "J\u00e4tkama",
		cancel: "T\u00fchistama"
	}
}).call(Solitaire);
(function () {
	this.Language = this.Language || {};
	this.Language.fi = {
		menuButton: "Valikko",
		menuNewGameButton: "Uusi peli",
		menuRestartGameButton: "Yrit\u00e4 uudelleen",
		menuSelectGameButton: "Valitse peli",
		menuOptionButton: "Valinnat",
		menuSkinButton: "Teema",
		menuInfoButton: '<img src="' + SS + 'images/info.png" alt="" />',
		menuUndo: '<img src="' + SS + 'images/undo.png" alt="">&nbsp;&nbsp;Kumoa',
		labelTime: "Aika: {var}",
		labelScore: "Pisteet: {var}",
		labelMoves: "Siirrot: {var}",
		"game.play": "Pelata",
		"game.show-on-startup": "N\u00e4yt\u00e4 k\u00e4ynnistett\u00e4ess\u00e4",
		optionWindowHeader: "Valinnat",
		optionWindowTabGameHeader: "Pelit",
		"klondike:turn-one": "Klondike - K\u00e4\u00e4nn\u00e4 yksi",
		"klondike:turn-three": "Klondike - K\u00e4\u00e4nn\u00e4 yksi",
		"double-klondike:turn-one": "Double Klondike - K\u00e4\u00e4nn\u00e4 yksi",
		"double-klondike:turn-three": "Double Klondike - K\u00e4\u00e4nn\u00e4 yksi",
		"spider:one-suit": "Spider - Yksi maa",
		"spider:two-suits": "Spider - Kaksi maata",
		"spider:four-suits": "Spider - Nelj\u00e4 maata",
		"forty-thieves": "Forty Thievies",
		"coming-soon": "tulossa",
		"difficulty-level": "vaikeus",
		optionWindowTabScoringHeader: "Pisteytys",
		scoringStandardMode: "Tavallinen pisteytysj\u00e4rjestelm\u00e4",
		scoringTimedMode: "Ajastettu pisteytysj\u00e4rjestelm\u00e4",
		optionWindowTabSettingsHeader: "Asetukset",
		"option.settings-sound-header": "Kuulostaa:",
		"option.settings-sound-header-not-supported": "ei tue selaimesi",
		"option.settings-sound-pack-wood": "Paketti - Puu",
		"option.settings-sound-pack-plastic": "Paketti - Muovi",
		"option.settings-sound-off": "\u00c4l\u00e4 pelaa mit\u00e4\u00e4n \u00e4\u00e4ni\u00e4",
		optionWindowTabSettingsAutoHeader: "Automaattinen siirto:",
		optionWindowTabSettingsAutoFlip: "K\u00e4\u00e4nn\u00e4 kortit automaattisesti",
		optionWindowTabSettingsAutoMoveWhenWon: "Pelaa loput kortit automaattisesti voiton j\u00e4lkeen",
		optionWindowTabSettingsAutoMoveOff: "\u00c4l\u00e4 pelaa automaattisesti",
		optionWindowTabSettingsControlHeader: "Valvonta:",
		optionWindowTabSettingsControlTime: "N\u00e4yt\u00e4 ajastin",
		optionWindowTabSettingsControlScores: "N\u00e4yt\u00e4 pisteet",
		optionWindowTabSettingsControlMoves: "N\u00e4yt\u00e4 tehdyt siirrot",
		optionWindowTabLanguageHeader: "Kieli",
		optionWindowTabSettingsLangLabel: "You have changed the language to <b>{lang}</b> to show changes it is required to refresh page. Do you want to do it now?.",
		optionSkinHeader: "Teema",
		optionSkinTabThemeHeader: "Teema",
		optionSkinTabCardHeader: "Edistynyt",
		optionWindowSelectedSkinItem: " (valittu)",
		optionWindowChangedThemeSkinItem: " palauttaa teema",
		winHeader: "Pelin tilastot",
		winGameTypeHead: "Pelit:",
		"win.klondike:turn-one": "Klondike 1",
		"win.klondike:turn-three": "Klondike 3",
		"win.double-klondike:turn-one": "Dbl Klondike 1",
		"win.double-klondike:turn-three": "Dbl Klondike 3",
		"win.spider:one-suit": "Spider 1",
		"win.spider:two-suits": "Spider 2",
		"win.spider:four-suits": "Spider 4",
		"win.forty-thieves": "Forty Thieves",
		winScoringSystemHead: "Pisteytys:",
		winScoringSystemStandard: "Standardi",
		winScoringSystemTimed: "Ajoitettu",
		winMovesHead: "Siirrot:",
		winTimeHead: "Aika:",
		winBonusHead: "Bonus:",
		winScoresHead: "Pisteet:",
		winBestScoresHead: "Paras pisteet:",
		winRedealButton: "Yrit\u00e4 uudelleen",
		winNewGameButton: "Uusi peli",
		pauseHeader: "Tauko",
		pauseContent: "Tauko peli<br/>...",
		pauseButtonResume: "Jatka",
		cancel: "Peruuttaa"
	}
}).call(Solitaire);
(function () {
	this.Language = this.Language || {};
	this.Language.fr = {
		menuButton: "Menu",
		menuNewGameButton: "Nouveau jeu",
		menuRestartGameButton: "R\u00e9essayer jeu",
		menuSelectGameButton: "Valitse peli",
		menuOptionButton: "Options",
		menuSkinButton: "Th\u00e8me",
		menuInfoButton: '<img src="' + SS + 'images/info.png" alt="" />',
		menuUndo: '<img src="' + SS + 'images/undo.png" alt="">&nbsp;&nbsp;Annuler',
		labelTime: "Temps: {var}",
		labelScore: "Points: {var}",
		labelMoves: "Coups: {var}",
		"game.play": "Jouer",
		"game.show-on-startup": "Afficher au d\u00e9marrage",
		optionWindowHeader: "Options",
		optionWindowTabGameHeader: "Jeux",
		"klondike:turn-one": "Klondike - Tirer une carte",
		"klondike:turn-three": "Klondike - Tirer trois cartes",
		"double-klondike:turn-one": "Doubl\u00e9 klondike - Tirer une carte",
		"double-klondike:turn-three": "Doubl\u00e9 klondike - Tirer trois cartes",
		"spider:one-suit": "Spider - Une couleur",
		"spider:two-suits": "Spider - Deux couleurs",
		"spider:four-suits": "Spider - Quatre couleurs",
		"forty-thieves": "Forty Thievies",
		"coming-soon": "bient\u00f4t",
		"difficulty-level": "difficult\u00e9s",
		optionWindowTabScoringHeader: "Type de Score",
		scoringStandardMode: "Score standard",
		scoringTimedMode: "Jeux chronom\u00e9tr\u00e9",
		optionWindowTabSettingsHeader: "R\u00e9glages",
		"option.settings-sound-header": "Sons:",
		"option.settings-sound-header-not-supported": "pas support\u00e9 par votre navigateur",
		"option.settings-sound-pack-wood": "Forfait - Bois",
		"option.settings-sound-pack-plastic": "Forfait - Plastique",
		"option.settings-sound-off": "Ne pas jouer tous les sons",
		optionWindowTabSettingsAutoHeader: "D\u00e9placements:",
		optionWindowTabSettingsAutoFlip: "Retourner les cartes automatiquement",
		optionWindowTabSettingsAutoMoveWhenWon: "Jouer automatiquement quand gagn\u00e9",
		optionWindowTabSettingsAutoMoveOff: "Ne pas jouer automatiquement",
		optionWindowTabSettingsControlHeader: "Affichage:",
		optionWindowTabSettingsControlTime: "Afficher le temps",
		optionWindowTabSettingsControlScores: "Afficher les points",
		optionWindowTabSettingsControlMoves: "Afficher le nombre de coups",
		optionWindowTabLanguageHeader: "Langue",
		optionWindowTabSettingsLangLabel: "You have changed the language to <b>{lang}</b> to show changes it is required to refresh page. Do you want to do it now?.",
		optionSkinHeader: "Th\u00e8me",
		optionSkinTabThemeHeader: "Th\u00e8me",
		optionSkinTabCardHeader: "Jeu de cartes",
		optionWindowSelectedSkinItem: " (s\u00e9lectionn\u00e9s)",
		optionWindowChangedThemeSkinItem: " restauration th\u00e9matique",
		winHeader: "Stats de jeu",
		winGameTypeHead: "Jeux:",
		"win.klondike:turn-one": "Klondike 1",
		"win.klondike:turn-three": "Klondike 3",
		"win.double-klondike:turn-one": "Doubl\u00e9 klondike 1",
		"win.double-klondike:turn-three": "Doubl\u00e9 klondike 3",
		"win.spider:one-suit": "Spider 1",
		"win.spider:two-suits": "Spider 2",
		"win.spider:four-suits": "Spider 4",
		"win.forty-thieves": "Forty Thieves",
		winScoringSystemHead: "Type de Score:",
		winScoringSystemStandard: "Standard",
		winScoringSystemTimed: "Chronom\u00e9tr\u00e9",
		winMovesHead: "D\u00e9placement:",
		winTimeHead: "Temps:",
		winBonusHead: "Prime:",
		winScoresHead: "Points:",
		winBestScoresHead: "Meilleurs points:",
		winRedealButton: "R\u00e9essayer jeu",
		winNewGameButton: "Nouveau jeu",
		pauseHeader: "Pause",
		pauseContent: "Pause dans le jeu<br/>...",
		pauseButtonResume: "R\u00e9sum\u00e9",
		cancel: "Annuler"
	}
}).call(Solitaire);
(function () {
	this.Language = this.Language || {};
	this.Language.gl = {
		menuButton: "Men\u00fa",
		menuNewGameButton: "Novo xogo",
		menuRestartGameButton: "Reiniciar xogo",
		menuSelectGameButton: "Seleccione xogo",
		menuOptionButton: "Opci\u00f3ns",
		menuSkinButton: "Tema",
		menuInfoButton: '<img src="' + SS + 'images/info.png" alt="" />',
		menuUndo: '<img src="' + SS + 'images/undo.png" alt="">&nbsp;&nbsp;Desfacer',
		labelTime: "Tempo: {var}",
		labelScore: "Puntuaci\u00f3n: {var}",
		labelMoves: "Movementos: {var}",
		"game.play": "Xogar",
		"game.show-on-startup": "Amosar no inicio",
		optionWindowHeader: "Opci\u00f3ns",
		optionWindowTabGameHeader: "Xogos",
		"klondike:turn-one": "Klondike - Unha carta",
		"klondike:turn-three": "Klondike - Tres cartas",
		"double-klondike:turn-one": "Doble Klondike - Unha carta",
		"double-klondike:turn-three": "Doble Klondike - Tres cartas",
		"spider:one-suit": "Spider - Un pau",
		"spider:two-suits": "Spider -  Dous paus",
		"spider:four-suits": "Spider - Catro paus",
		"forty-thieves": "Corenta ladr\u00f3ns",
		"coming-soon": "coming soon",
		"difficulty-level": "dificultade",
		optionWindowTabScoringHeader: "Puntuaci\u00f3n",
		scoringStandardMode: "Puntuaci\u00f3n est\u00e1ndar",
		scoringTimedMode: "Puntuaci\u00f3n por tempo",
		optionWindowTabSettingsHeader: "Opci\u00f3ns",
		"option.settings-sound-header": "Sons:",
		"option.settings-sound-header-not-supported": "not supported by your browser",
		"option.settings-sound-pack-wood": "Madeira",
		"option.settings-sound-pack-plastic": "Pl\u00e1stico",
		"option.settings-sound-off": "Sen son",
		optionWindowTabSettingsAutoHeader: "Automover:",
		optionWindowTabSettingsAutoFlip: "Auto baraxar cartas",
		optionWindowTabSettingsAutoMoveWhenWon: "Auto-xogar cando ga\u00f1e",
		optionWindowTabSettingsAutoMoveOff: "Non auto-xogar",
		optionWindowTabSettingsControlHeader: "Controis:",
		optionWindowTabSettingsControlTime: "Mostrar tempo",
		optionWindowTabSettingsControlScores: "Mostrar puntuaci\u00f3n",
		optionWindowTabSettingsControlMoves: "Mostrar movementos feitos",
		optionWindowTabLanguageHeader: "Idioma",
		optionWindowTabSettingsLangLabel: "You have changed the language to <b>{lang}</b> to show changes it is required to refresh page. Do you want to do it now?.",
		optionSkinHeader: "Tema",
		optionSkinTabThemeHeader: "Tema",
		optionSkinTabCardHeader: "Avanzado",
		optionWindowSelectedSkinItem: " (seleccionado)",
		optionWindowChangedThemeSkinItem: " restaurar tema",
		winHeader: "Estat\u00edsticas",
		winGameTypeHead: "Xogo:",
		"win.klondike:turn-one": "Klondike 1",
		"win.klondike:turn-three": "Klondike 3",
		"win.double-klondike:turn-one": "Doble Klondike 1",
		"win.double-klondike:turn-three": "Doble Klondike 3",
		"win.spider:one-suit": "Spider 1",
		"win.spider:two-suits": "Spider 2",
		"win.spider:four-suits": "Spider 4",
		"win.forty-thieves": "Corenta ladr\u00f3ns",
		winScoringSystemHead: "Puntuaci\u00f3n:",
		winScoringSystemStandard: "Defecto",
		winScoringSystemTimed: "Temporal",
		winMovesHead: "Movementos:",
		winTimeHead: "Tempo:",
		winBonusHead: "Bonos:",
		winScoresHead: "Puntuaci\u00f3n:",
		winBestScoresHead: "Mellor puntuaci\u00f3n:",
		winRedealButton: "Reiniciar xogo",
		winNewGameButton: "Novo xogo",
		pauseHeader: "Pausa",
		pauseContent: "Salto de xogo<br/>...",
		pauseButtonResume: "Recuperar",
		cancel: "Cancelar"
	}
}).call(Solitaire);
(function () {
	this.Language = this.Language || {};
	this.Language.he = {
		menuButton: "\u05ea\u05e4\u05e8\u05d9\u05d8",
		menuNewGameButton: "\u05de\u05e9\u05d7\u05e7 \u05d7\u05d3\u05e9",
		menuRestartGameButton: "\u05e0\u05d9\u05e1\u05d9\u05d5\u05df \u05d7\u05d5\u05d6\u05e8",
		menuSelectGameButton: "\u05d1\u05d7\u05e8 \u05de\u05e9\u05d7\u05e7",
		menuOptionButton: "\u05d0\u05e4\u05e9\u05e8\u05d5\u05d9\u05d5\u05ea",
		menuSkinButton: "\u05e2\u05e8\u05db\u05ea \u05e0\u05d5\u05e9\u05d0",
		menuInfoButton: '<img src="' + SS + 'images/info.png" alt="" />',
		menuUndo: '<img src="' + SS + 'images/undo.png" alt="">&nbsp;&nbsp;\u05d1\u05d8\u05dc',
		labelTime: "{var} :\u05d6\u05de\u05df",
		labelScore: "{var} :\u05e0\u05d9\u05e7\u05d5\u05d3",
		labelMoves: "{var} :\u05de\u05d4\u05dc\u05db\u05d9\u05dd",
		"game.play": "\u05dc\u05e9\u05d7\u05e7",
		"game.show-on-startup": "\u05d4\u05e6\u05d2 \u05d1\u05d4\u05e4\u05e2\u05dc\u05d4",
		optionWindowHeader: "\u05d0\u05e4\u05e9\u05e8\u05d5\u05d9\u05d5\u05ea",
		optionWindowTabGameHeader: "\u05de\u05e9\u05d7\u05e7\u05d9\u05dd",
		"klondike:turn-one": "\u05e7\u05dc\u05d5\u05e0\u05d3\u05d9\u05d9\u05e7 - \u05e1\u05d5\u05d1\u05d1 \u05d0\u05d7\u05d3",
		"klondike:turn-three": "\u05e7\u05dc\u05d5\u05e0\u05d3\u05d9\u05d9\u05e7 - \u05e1\u05d5\u05d1\u05d1 \u05e9\u05dc\u05d5\u05e9\u05d4",
		"double-klondike:turn-one": "\u05e7\u05dc\u05d5\u05e0\u05d3\u05d9\u05d9\u05e7 \u05db\u05e4\u05d5\u05dc - \u05e1\u05d5\u05d1\u05d1 \u05d0\u05d7\u05d3",
		"double-klondike:turn-three": "\u05e7\u05dc\u05d5\u05e0\u05d3\u05d9\u05d9\u05e7 \u05db\u05e4\u05d5\u05dc - \u05e1\u05d5\u05d1\u05d1 \u05e9\u05dc\u05d5\u05e9\u05d4",
		"spider:one-suit": "\u05e2\u05db\u05d1\u05d9\u05e9 - \u05d7\u05e4\u05d9\u05e1\u05d4 \u05d0\u05d7\u05ea",
		"spider:two-suits": "\u05e2\u05db\u05d1\u05d9\u05e9 - \u05e9\u05ea\u05d9 \u05d7\u05e4\u05d9\u05e1\u05d5\u05ea",
		"spider:four-suits": "\u05e2\u05db\u05d1\u05d9\u05e9 - \u05d0\u05e8\u05d1\u05e2 \u05d7\u05e4\u05d9\u05e1\u05d5\u05ea",
		"forty-thieves": "\u05d0\u05e8\u05d1\u05e2\u05d9\u05dd \u05d4\u05d2\u05e0\u05d1\u05d9\u05dd",
		"coming-soon": "coming soon",
		"difficulty-level": "\u05e7\u05d5\u05e9\u05d9",
		optionWindowTabScoringHeader: "\u05e0\u05d9\u05e7\u05d5\u05d3",
		scoringStandardMode: "\u05de\u05e2\u05e8\u05db\u05ea \u05e0\u05d9\u05e7\u05d5\u05d3 \u05e8\u05d2\u05d9\u05dc\u05d4",
		scoringTimedMode: "\u05de\u05e2\u05e8\u05db\u05ea \u05e0\u05d9\u05e7\u05d5\u05d3 \u05de\u05ea\u05d5\u05d6\u05de\u05e0\u05ea",
		optionWindowTabSettingsHeader: "\u05d0\u05e4\u05e9\u05e8\u05d5\u05d9\u05d5\u05ea",
		"option.settings-sound-header": "\u05e6\u05dc\u05d9\u05dc\u05d9\u05dd",
		"option.settings-sound-header-not-supported": "not supported by your browser",
		"option.settings-sound-pack-wood": "\u05d7\u05e4\u05d9\u05e1\u05d4 - \u05e2\u05e5",
		"option.settings-sound-pack-plastic": "\u05d7\u05e4\u05d9\u05e1\u05d4 - \u05e4\u05dc\u05e1\u05d8\u05d9\u05e7",
		"option.settings-sound-off": "\u05d0\u05dc \u05ea\u05e0\u05d2\u05df \u05e6\u05dc\u05d9\u05dc\u05d9\u05dd",
		optionWindowTabSettingsAutoHeader: "\u05de\u05d4\u05dc\u05da \u05d0\u05d5\u05d8\u05d5\u05de\u05d8\u05d9",
		optionWindowTabSettingsAutoFlip: "\u05d4\u05d9\u05e4\u05d5\u05da \u05e7\u05dc\u05e4\u05d9\u05dd \u05d0\u05d5\u05d8\u05d5\u05de\u05d8\u05d9",
		optionWindowTabSettingsAutoMoveWhenWon: "\u05e0\u05d9\u05d2\u05d5\u05df \u05d0\u05d5\u05d8\u05d5\u05de\u05d8\u05d9 \u05d1\u05e0\u05d9\u05e6\u05d7\u05d5\u05df",
		optionWindowTabSettingsAutoMoveOff: "\u05d0\u05dc \u05ea\u05d1\u05e6\u05e2 \u05e0\u05d9\u05d2\u05d5\u05df \u05d0\u05d5\u05d8\u05d5\u05de\u05d8\u05d9",
		optionWindowTabSettingsControlHeader: "\u05d1\u05e7\u05e8\u05d9\u05dd",
		optionWindowTabSettingsControlTime: "\u05d4\u05e6\u05d2 \u05d8\u05d9\u05d9\u05de\u05e8",
		optionWindowTabSettingsControlScores: "\u05d4\u05e6\u05d2 \u05e0\u05d9\u05e7\u05d5\u05d3",
		optionWindowTabSettingsControlMoves: "\u05d4\u05e6\u05d3 \u05de\u05d4\u05dc\u05db\u05d9\u05dd \u05e9\u05e9\u05d5\u05d7\u05e7\u05d5",
		optionWindowTabLanguageHeader: "\u05e9\u05e4\u05d5\u05ea",
		optionWindowTabSettingsLangLabel: "You have changed the language to <b>{lang}</b> to show changes it is required to refresh page. Do you want to do it now?.",
		optionSkinHeader: "\u05e2\u05e8\u05db\u05ea \u05e0\u05d5\u05e9\u05d0",
		optionSkinTabThemeHeader: "\u05e2\u05e8\u05db\u05ea \u05e0\u05d5\u05e9\u05d0",
		optionSkinTabCardHeader: "\u05de\u05ea\u05e7\u05d3\u05dd",
		optionWindowSelectedSkinItem: " (\u05e0\u05d1\u05d7\u05e8)",
		optionWindowChangedThemeSkinItem: " \u05dc\u05d4\u05d7\u05d6\u05d9\u05e8 \u05d0\u05ea \u05d4\u05e0\u05d5\u05e9\u05d0",
		winHeader: "\u05e1\u05d8\u05d8\u05d9\u05e1\u05d8\u05d9\u05e7\u05d5\u05ea",
		winGameTypeHead: "\u05de\u05e9\u05d7\u05e7",
		"win.klondike:turn-one": "\u05e7\u05dc\u05d5\u05e0\u05d3\u05d9\u05d9\u05e7 - \u05e1\u05d5\u05d1\u05d1 \u05d0\u05d7\u05d3",
		"win.klondike:turn-three": "\u05e7\u05dc\u05d5\u05e0\u05d3\u05d9\u05d9\u05e7 - \u05e1\u05d5\u05d1\u05d1 \u05e9\u05dc\u05d5\u05e9\u05d4",
		"win.double-klondike:turn-one": "\u05e7\u05dc\u05d5\u05e0\u05d3\u05d9\u05d9\u05e7 \u05db\u05e4\u05d5\u05dc - \u05e1\u05d5\u05d1\u05d1 \u05d0\u05d7\u05d3",
		"win.double-klondike:turn-three": "\u05e7\u05dc\u05d5\u05e0\u05d3\u05d9\u05d9\u05e7 \u05db\u05e4\u05d5\u05dc - \u05e1\u05d5\u05d1\u05d1 \u05e9\u05dc\u05d5\u05e9\u05d4",
		"win.spider:one-suit": "\u05e2\u05db\u05d1\u05d9\u05e9 - \u05d7\u05e4\u05d9\u05e1\u05d4 \u05d0\u05d7\u05ea",
		"win.spider:two-suits": "\u05e2\u05db\u05d1\u05d9\u05e9 - \u05e9\u05ea\u05d9 \u05d7\u05e4\u05d9\u05e1\u05d5\u05ea",
		"win.spider:four-suits": "\u05e2\u05db\u05d1\u05d9\u05e9 - \u05d0\u05e8\u05d1\u05e2 \u05d7\u05e4\u05d9\u05e1\u05d5\u05ea",
		"win.forty-thieves": "\u05d0\u05e8\u05d1\u05e2\u05d9\u05dd \u05d4\u05d2\u05e0\u05d1\u05d9\u05dd",
		winScoringSystemHead: "\u05e0\u05d9\u05e7\u05d5\u05d3",
		winScoringSystemStandard: "\u05ea\u05e7\u05df",
		winScoringSystemTimed: "\u05de\u05ea\u05d5\u05d6\u05de\u05df",
		winMovesHead: "\u05de\u05d4\u05dc\u05db\u05d9\u05dd",
		winTimeHead: "\u05d6\u05de\u05df",
		winBonusHead: "\u05de\u05e2\u05e0\u05e7",
		winScoresHead: "\u05e0\u05d9\u05e7\u05d5\u05d3",
		winBestScoresHead: "\u05d4\u05d8\u05d5\u05d1 \u05d1\u05d9\u05d5\u05ea\u05e8 \u05e6\u05d9\u05d5\u05df",
		winRedealButton: "\u05e0\u05d9\u05e1\u05d9\u05d5\u05df \u05d7\u05d5\u05d6\u05e8",
		winNewGameButton: "\u05de\u05e9\u05d7\u05e7 \u05d7\u05d3\u05e9",
		pauseHeader: "\u05d4\u05e4\u05e1\u05e7\u05d4",
		pauseContent: "\u05dc\u05e9\u05d1\u05d5\u05e8 \u05d1\u05de\u05e9\u05d7\u05e7<br/>...",
		pauseButtonResume: "\u05e7\u05d5\u05e8\u05d5\u05ea \u05d7\u05d9\u05d9\u05dd",
		cancel: "\u05dc\u05d1\u05d8\u05dc"
	}
}).call(Solitaire);
(function () {
	this.Language = this.Language || {};
	this.Language.hu = {
		menuButton: "Men\u00fc",
		menuNewGameButton: "\u00daj j\u00e1t\u00e9k",
		menuRestartGameButton: "\u00dajra j\u00e1t\u00e9k",
		menuSelectGameButton: "V\u00e1lassz j\u00e1t\u00e9kot",
		menuOptionButton: "Be\u00e1ll\u00edt\u00e1sok",
		menuSkinButton: "T\u00e9ma",
		menuInfoButton: '<img src="' + SS + 'images/info.png" alt="" />',
		menuUndo: '<img src="' + SS + 'images/undo.png" alt="">&nbsp;Visszavon\u00e1s',
		labelTime: "Id\u0151: {var}",
		labelScore: "Pontsz\u00e1m: {var}",
		labelMoves: "L\u00e9p\u00e9sek: {var}",
		"game.play": "J\u00e1tszik",
		"game.show-on-startup": "Mutasd ind\u00edt\u00e1skor",
		optionWindowHeader: "Be\u00e1ll\u00edt\u00e1sok",
		optionWindowTabGameHeader: "J\u00e1t\u00e9kok",
		"klondike:turn-one": "Klondike - egy lapos",
		"klondike:turn-three": "Klondike - h\u00e1rom lapos",
		"double-klondike:turn-one": "Dupla klondike - egy lapos",
		"double-klondike:turn-three": "Dupla klondike - h\u00e1rom lapos",
		"spider:one-suit": "P\u00f3k - Egy \u00f6lt\u00f6nyt",
		"spider:two-suits": "P\u00f3k - K\u00e9t \u00f6lt\u00f6ny",
		"spider:four-suits": "P\u00f3k - N\u00e9gy sz\u00edn",
		"forty-thieves": "Forty Thievies",
		"coming-soon": "hamarosan",
		"difficulty-level": "neh\u00e9zs\u00e9g",
		optionWindowTabScoringHeader: "Pontoz\u00e1s",
		scoringStandardMode: "Szok\u00e1sos pontoz\u00e1s",
		scoringTimedMode: "Id\u0151alap\u00fa pontoz\u00e1s",
		optionWindowTabSettingsHeader: "Be\u00e1ll\u00edt\u00e1sok",
		"option.settings-sound-header": "Hangok:",
		"option.settings-sound-header-not-supported": "\u00e1ltal nem t\u00e1mogatott b\u00f6ng\u00e9sz\u0151",
		"option.settings-sound-pack-wood": "Csomag - Erd\u0151",
		"option.settings-sound-pack-plastic": "Csomag - M\u0171anyag",
		"option.settings-sound-off": "Nem j\u00e1tszik olyan hangok",
		optionWindowTabSettingsAutoHeader: "Automatikus mozgat\u00e1s:",
		optionWindowTabSettingsAutoFlip: "Automatikus lapford\u00edt\u00e1s",
		optionWindowTabSettingsAutoMoveWhenWon: "Automatikus befejez\u00e9s",
		optionWindowTabSettingsAutoMoveOff: "Ne j\u00e1tsszon automatikusan",
		optionWindowTabSettingsControlHeader: "Vez\u00e9rl\u00e9s:",
		optionWindowTabSettingsControlTime: "Id\u0151m\u00e9r\u0151 mutat\u00e1sa",
		optionWindowTabSettingsControlScores: "Pontsz\u00e1m mutat\u00e1sa",
		optionWindowTabSettingsControlMoves: "L\u00e9p\u00e9ssz\u00e1m mutat\u00e1sa",
		optionWindowTabLanguageHeader: "Nyelv",
		optionWindowTabSettingsLangLabel: "You have changed the language to <b>{lang}</b> to show changes it is required to refresh page. Do you want to do it now?.",
		optionSkinHeader: "T\u00e9ma",
		optionSkinTabThemeHeader: "T\u00e9ma",
		optionSkinTabCardHeader: "Halad\u00f3",
		optionWindowSelectedSkinItem: " (kiv\u00e1lasztott)",
		optionWindowChangedThemeSkinItem: " helyre\u00e1ll\u00edt\u00e1sa t\u00e9ma",
		winHeader: "J\u00e1t\u00e9k statisztik\u00e1k",
		winGameTypeHead: "J\u00e1t\u00e9k t\u00edpusa:",
		"win.klondike:turn-one": "Klondike 1",
		"win.klondike:turn-three": "Klondike 3",
		"win.double-klondike:turn-one": "Dupla klondike 1",
		"win.double-klondike:turn-three": "Dupla klondike 3",
		"win.spider:one-suit": "P\u00f3k 1",
		"win.spider:two-suits": "P\u00f3k 2",
		"win.spider:four-suits": "P\u00f3k 4",
		"win.forty-thieves": "Forty Thieves",
		winScoringSystemHead: "Pontoz\u00e1si rendszer:",
		winScoringSystemStandard: "Szabv\u00e1ny",
		winScoringSystemTimed: "Id\u0151z\u00edtett",
		winMovesHead: "Mozgatja k\u00e9sz\u00fclt:",
		winTimeHead: "J\u00e1t\u00e9k id\u0151:",
		winBonusHead: "Pr\u00e9mium:",
		winScoresHead: "Pontsz\u00e1m:",
		winBestScoresHead: "Legjobb pontsz\u00e1m:",
		winRedealButton: "\u00dajra j\u00e1t\u00e9k",
		winNewGameButton: "\u00daj j\u00e1t\u00e9k",
		pauseHeader: "Sz\u00fcnet",
		pauseContent: "Sz\u00fcnet a j\u00e1t\u00e9k<br/>...",
		pauseButtonResume: "Folytat\u00e1s",
		cancel: "T\u00f6r\u00f6l"
	}
}).call(Solitaire);
(function () {
	this.Language = this.Language || {};
	this.Language.it = {
		menuButton: "Menu",
		menuNewGameButton: "Nuova Partita",
		menuRestartGameButton: "Riprova",
		menuSelectGameButton: "Scegli il gioco",
		menuOptionButton: "Opzioni",
		menuSkinButton: "Temi",
		menuInfoButton: '<img src="' + SS + 'images/info.png" alt="" />',
		menuUndo: '<img src="' + SS + 'images/undo.png" alt="">&nbsp;&nbsp;Annulla',
		labelTime: "Tempo: {var}",
		labelScore: "Punteggio: {var}",
		labelMoves: "Mosse: {var}",
		"game.play": "Giocare",
		"game.show-on-startup": "Mostra all'avvio",
		optionWindowHeader: "Opzioni",
		optionWindowTabGameHeader: "Giochi",
		"klondike:turn-one": "Klondike - Turno uno",
		"klondike:turn-three": "Klondike - Turno tre",
		"double-klondike:turn-one": "Doppio klondike - Turno uno",
		"double-klondike:turn-three": "Doppio klondike - Turno tre",
		"spider:one-suit": "Ragno - Un vestito",
		"spider:two-suits": "Ragno - Due abiti",
		"spider:four-suits": "Ragno - Quattro semi",
		"forty-thieves": "Forty Thievies",
		"coming-soon": "presto",
		"difficulty-level": "difficolt\u00e0",
		optionWindowTabScoringHeader: "Punteggi",
		scoringStandardMode: "Punteggio standard",
		scoringTimedMode: "Punteggio a tempo",
		optionWindowTabSettingsHeader: "Impostazioni",
		"option.settings-sound-header": "Suoni:",
		"option.settings-sound-header-not-supported": "non \u00e8 supportato dal browser",
		"option.settings-sound-pack-wood": "Pacchetto - Legno",
		"option.settings-sound-pack-plastic": "Pacchetto - Plastica",
		"option.settings-sound-off": "Non emette alcun segnale acustico",
		optionWindowTabSettingsAutoHeader: "Mosse automatiche:",
		optionWindowTabSettingsAutoFlip: "Ruota automaticamente le carte",
		optionWindowTabSettingsAutoMoveWhenWon: "Gioca automaticamente quando vinci",
		optionWindowTabSettingsAutoMoveOff: "Non giocare automaticamente",
		optionWindowTabSettingsControlHeader: "Controlli:",
		optionWindowTabSettingsControlTime: "Mostra timer",
		optionWindowTabSettingsControlScores: "Mostra punteggio",
		optionWindowTabSettingsControlMoves: "Mostra mosse fatte",
		optionWindowTabLanguageHeader: "Lingua",
		optionWindowTabSettingsLangLabel: "You have changed the language to <b>{lang}</b> to show changes it is required to refresh page. Do you want to do it now?.",
		optionSkinHeader: "Temi",
		optionSkinTabThemeHeader: "Temi",
		optionSkinTabCardHeader: "Avanzate",
		optionWindowSelectedSkinItem: " (selezionati)",
		optionWindowChangedThemeSkinItem: " ripristinare tema",
		winHeader: "Statistiche Gioco",
		winGameTypeHead: "Tipo di gioco:",
		"win.klondike:turn-one": "Klondike 1",
		"win.klondike:turn-three": "Klondike 3",
		"win.double-klondike:turn-one": "Doppio klondike 1",
		"win.double-klondike:turn-three": "Doppio klondike 3",
		"win.spider:one-suit": "Ragno 1",
		"win.spider:two-suits": "Ragno 2",
		"win.spider:four-suits": "Ragno 4",
		"win.forty-thieves": "Forty Thieves",
		winScoringSystemHead: "Sistema di punteggio:",
		winScoringSystemStandard: "Standard",
		winScoringSystemTimed: "Temporizzato",
		winMovesHead: "Mosse:",
		winTimeHead: "Tempo di gioco:",
		winBonusHead: "Indennit\u00e0:",
		winScoresHead: "Punteggio:",
		winBestScoresHead: "Miglior punteggio:",
		winRedealButton: "Riprova",
		winNewGameButton: "Nuova Partita",
		pauseHeader: "Pausa",
		pauseContent: "Pausa nel gioco<br/>...",
		pauseButtonResume: "Riprendere",
		cancel: "Annullare"
	}
}).call(Solitaire);
(function () {
	this.Language = this.Language || {};
	this.Language.ja = {
		menuButton: "\u30e1\u30cb\u30e5\u30fc",
		menuNewGameButton: "\u65b0\u3057\u3044\u30b2\u30fc\u30e0",
		menuRestartGameButton: "\u30b2\u30fc\u30e0\u306e\u3084\u308a\u76f4\u3057",
		menuSelectGameButton: "\u30b2\u30fc\u30e0\u3092\u9078\u629e\u3057\u307e\u3059\u3002",
		menuOptionButton: "\u30aa\u30d7\u30b7\u30e7\u30f3",
		menuSkinButton: "\u30c6\u30fc\u30de",
		menuInfoButton: '<img src="' + SS + 'images/info.png" alt="" />',
		menuUndo: '<img src="' + SS + 'images/undo.png" alt="">&nbsp;&nbsp;\u5143\u306b\u623b\u3059',
		labelTime: "\u7d4c\u904e\u6642\u9593: {var}",
		labelScore: "\u30b9\u30b3\u30a2: {var}",
		labelMoves: "\u624b\u6570: {var}",
		"game.play": "\u904a\u3076",
		"game.show-on-startup": "\u8d77\u52d5\u6642\u306b\u8868\u793a",
		optionWindowHeader: "\u30aa\u30d7\u30b7\u30e7\u30f3",
		optionWindowTabGameHeader: "\u30b2\u30fc\u30e0\u306e\u7a2e\u985e",
		"klondike:turn-one": "\u30af\u30ed\u30f3\u30c0\u30a4\u30af - 1\u679a\u3081\u304f\u308a",
		"klondike:turn-three": "\u30af\u30ed\u30f3\u30c0\u30a4\u30af - 3\u679a\u3081\u304f\u308a",
		"double-klondike:turn-one": "\u30c0\u30d6\u30eb\u30fb\u30af\u30ed\u30f3\u30c0\u30a4\u30af - 1\u679a\u3081\u304f\u308a",
		"double-klondike:turn-three": "\u30c0\u30d6\u30eb\u30fb\u30af\u30ed\u30f3\u30c0\u30a4\u30af - 3\u679a\u3081\u304f\u308a",
		"spider:one-suit": "\u30b9\u30d1\u30a4\u30c0\u30bd\u30ea\u30c6\u30a3\u30a2 - 1\u30b9\u30fc\u30c8",
		"spider:two-suits": "\u30b9\u30d1\u30a4\u30c0\u30bd\u30ea\u30c6\u30a3\u30a2 - 2\u30b9\u30fc\u30c8",
		"spider:four-suits": "\u30b9\u30d1\u30a4\u30c0\u30bd\u30ea\u30c6\u30a3\u30a2 - 4\u30b9\u30fc\u30c8",
		"forty-thieves": "\u30d5\u30a9\u30fc\u30c6\u30a3\u30fb\u30b7\u30fc\u30f4\u30b9",
		"coming-soon": "coming soon",
		"difficulty-level": "\u96e3\u6613\u5ea6",
		optionWindowTabScoringHeader: "\u5f97\u70b9\u8a08\u7b97",
		scoringStandardMode: "\u30b9\u30bf\u30f3\u30c0\u30fc\u30c9",
		scoringTimedMode: "\u7d4c\u904e\u6642\u9593",
		optionWindowTabSettingsHeader: "\u8a2d\u5b9a",
		"option.settings-sound-header": "\u30b5\u30a6\u30f3\u30c9:",
		"option.settings-sound-header-not-supported": "not supported by your browser",
		"option.settings-sound-pack-wood": "\u6728\u76ee\u8abf",
		"option.settings-sound-pack-plastic": "\u30d7\u30e9\u30b9\u30c1\u30c3\u30af",
		"option.settings-sound-off": "\u3059\u3079\u3066\u306e\u97f3\u3092\u30df\u30e5\u30fc\u30c8",
		optionWindowTabSettingsAutoHeader: "\u30aa\u30fc\u30c8\u30d7\u30ec\u30a4:",
		optionWindowTabSettingsAutoFlip: "\u81ea\u52d5\u30ab\u30fc\u30c9\u3081\u304f\u308a",
		optionWindowTabSettingsAutoMoveWhenWon: "\u30b2\u30fc\u30e0\u52dd\u5229\u6642\u306b\u30aa\u30fc\u30c8\u30d7\u30ec\u30a4",
		optionWindowTabSettingsAutoMoveOff: "\u30aa\u30fc\u30c8\u30d7\u30ec\u30a4\u3057\u306a\u3044",
		optionWindowTabSettingsControlHeader: "\u753b\u9762\u8868\u793a:",
		optionWindowTabSettingsControlTime: "\u7d4c\u904e\u6642\u9593\u3092\u8868\u793a",
		optionWindowTabSettingsControlScores: "\u5f97\u70b9\u3092\u8868\u793a",
		optionWindowTabSettingsControlMoves: "\u624b\u6570\u3092\u8868\u793a",
		optionWindowTabLanguageHeader: "\u8a00\u8a9e",
		optionWindowTabSettingsLangLabel: "You have changed the language to <b>{lang}</b> to show changes it is required to refresh page. Do you want to do it now?.",
		optionSkinHeader: "\u30c6\u30fc\u30de",
		optionSkinTabThemeHeader: "\u30c6\u30fc\u30de",
		optionSkinTabCardHeader: "\u305d\u306e\u4ed6\u306e\u8a2d\u5b9a",
		optionWindowSelectedSkinItem: " (\u73fe\u5728\u306e\u30c6\u30fc\u30de)",
		optionWindowChangedThemeSkinItem: " \u30c6\u30fc\u30de\u3092\u5fa9\u5143\u3059\u308b",
		winHeader: "\u7d71\u8a08\u60c5\u5831",
		winGameTypeHead: "\u30b2\u30fc\u30e0:",
		"win.klondike:turn-one": "\u30af\u30ed\u30f3\u30c0\u30a4\u30af 1",
		"win.klondike:turn-three": "\u30af\u30ed\u30f3\u30c0\u30a4\u30af 3",
		"win.double-klondike:turn-one": "\u30c0\u30d6\u30eb\u30fb\u30af\u30ed\u30f3\u30c0\u30a4\u30af 1",
		"win.double-klondike:turn-three": "\u30c0\u30d6\u30eb\u30fb\u30af\u30ed\u30f3\u30c0\u30a4\u30af 3",
		"win.spider:one-suit": "\u30b9\u30d1\u30a4\u30c0\u30bd\u30ea\u30c6\u30a3\u30a2 1",
		"win.spider:two-suits": "\u30b9\u30d1\u30a4\u30c0\u30bd\u30ea\u30c6\u30a3\u30a2 2",
		"win.spider:four-suits": "\u30b9\u30d1\u30a4\u30c0\u30bd\u30ea\u30c6\u30a3\u30a2 4",
		"win.forty-thieves": "\u30d5\u30a9\u30fc\u30c6\u30a3\u30fb\u30b7\u30fc\u30f4\u30b9",
		winScoringSystemHead: "\u5f97\u70b9\u8a08\u7b97:",
		winScoringSystemStandard: "\u6a19\u6e96",
		winScoringSystemTimed: "\u6642\u9650",
		winMovesHead: "\u624b\u6570:",
		winTimeHead: "\u7d4c\u904e\u6642\u9593:",
		winBonusHead: "\u30dc\u30fc\u30ca\u30b9:",
		winScoresHead: "\u30b9\u30b3\u30a2:",
		winBestScoresHead: "\u6700\u9ad8\u30b9\u30b3\u30a2:",
		winRedealButton: "\u30b2\u30fc\u30e0\u306e\u3084\u308a\u76f4\u3057",
		winNewGameButton: "\u65b0\u3057\u3044\u30b2\u30fc\u30e0",
		pauseHeader: "\u4e00\u6642\u505c\u6b62",
		pauseContent: "\u30b2\u30fc\u30e0\u3067\u30d6\u30ec\u30a4\u30af<br/>...",
		pauseButtonResume: "\u518d\u958b\u3059\u308b",
		cancel: "\u53d6\u308a\u6d88\u3059   "
	}
}).call(Solitaire);
(function () {
	this.Language = this.Language || {};
	this.Language.ka = {
		menuButton: "\u10db\u10d4\u10dc\u10d8\u10e3",
		menuNewGameButton: "\u10d0\u10ee\u10d0\u10da\u10d8 \u10d7\u10d0\u10db\u10d0\u10e8\u10d8",
		menuRestartGameButton: "\u10ee\u10d4\u10da\u10d0\u10ee\u10da\u10d0 \u10ea\u10d3\u10d0",
		menuSelectGameButton: "\u10d0\u10d8\u10e0\u10e9\u10d8\u10d4\u10d7 \u10d7\u10d0\u10db\u10d0\u10e8\u10d8",
		menuOptionButton: "\u10de\u10d0\u10e0\u10d0\u10db\u10d4\u10e2\u10e0\u10d4\u10d1\u10d8",
		menuSkinButton: "\u10d2\u10d0\u10e4\u10dd\u10e0\u10db\u10d4\u10d1\u10d0",
		menuInfoButton: '<img src="' + SS + 'images/info.png" alt="" />',
		menuUndo: '<img src="' + SS + 'images/undo.png" alt="">&nbsp;&nbsp;\u10d3\u10d0\u10d1\u10e0\u10e3\u10dc\u10d4\u10d1\u10d0',
		labelTime: "\u10d3\u10e0\u10dd: {var}",
		labelScore: "\u10e5\u10e3\u10da\u10d0: {var}",
		labelMoves: "\u10db\u10dd\u10e5\u10db\u10d4\u10d3\u10d4\u10d1\u10d0: {var}",
		"game.play": "\u10d7\u10d0\u10db\u10d0\u10e8\u10d8",
		"game.show-on-startup": "\u10e9\u10d5\u10d4\u10dc\u10d4\u10d1\u10d0 \u10e9\u10d0\u10e0\u10d7\u10e3\u10da\u10d8\u10d0",
		optionWindowHeader: "\u10de\u10d0\u10e0\u10d0\u10db\u10d4\u10e2\u10e0\u10d4\u10d1\u10d8",
		optionWindowTabGameHeader: "\u10d7\u10d0\u10db\u10d0\u10e8\u10d4\u10d1\u10d8",
		"klondike:turn-one": "\u10d9\u10da\u10dd\u10dc\u10d3\u10d0\u10d8\u10d9\u10d8 - \u10d4\u10e0\u10d7\u10d9\u10d0\u10e0\u10e2\u10d8\u10d0\u10dc\u10d8",
		"klondike:turn-three": "\u10d9\u10da\u10dd\u10dc\u10d3\u10d0\u10d8\u10d9\u10d8 - \u10e1\u10d0\u10db\u10d9\u10d0\u10e0\u10e2\u10d8\u10d0\u10dc\u10d8",
		"double-klondike:turn-one": "\u10dd\u10e0\u10db\u10d0\u10d2\u10d8 \u10d9\u10da\u10dd\u10dc\u10d3\u10d0\u10d8\u10d9\u10d8 - \u10d4\u10e0\u10d7\u10d9\u10d0\u10e0\u10e2\u10d8\u10d0\u10dc\u10d8",
		"double-klondike:turn-three": "\u10dd\u10e0\u10db\u10d0\u10d2\u10d8 \u10d9\u10da\u10dd\u10dc\u10d3\u10d0\u10d8\u10d9\u10d8 - \u10e1\u10d0\u10db\u10d9\u10d0\u10e0\u10e2\u10d8\u10d0\u10dc\u10d8",
		"spider:one-suit": "\u10dd\u10d1\u10dd\u10d1\u10d0 - \u10d4\u10e0\u10d7\u10d8 \u10dc\u10d0\u10d9\u10e0\u10d4\u10d1\u10d8",
		"spider:two-suits": "\u10dd\u10d1\u10dd\u10d1\u10d0 - \u10dd\u10e0\u10d8 \u10dc\u10d0\u10d9\u10e0\u10d4\u10d1\u10d8",
		"spider:four-suits": "\u10dd\u10d1\u10dd\u10d1\u10d0 - \u10dd\u10d7\u10ee\u10d8 \u10dc\u10d0\u10d9\u10e0\u10d4\u10d1\u10d8",
		"forty-thieves": "Forty Thievies",
		"coming-soon": "coming soon",
		"difficulty-level": "",
		optionWindowTabScoringHeader: "\u10d3\u10d0\u10d0\u10dc\u10d2\u10d0\u10e0\u10d8\u10e8\u10d4\u10d1\u10d0",
		scoringStandardMode: "\u10e1\u10e2\u10d0\u10dc\u10d3\u10d0\u10e0\u10e2\u10e3\u10da\u10d8 \u10d3\u10d0\u10d0\u10dc\u10d2\u10d0\u10e0\u10d8\u10e8\u10d4\u10d1\u10d0",
		scoringTimedMode: "\u10d3\u10e0\u10dd\u10d8\u10e1 \u10db\u10d8\u10ee\u10d4\u10d3\u10d5\u10d8\u10d7 \u10d3\u10d0\u10d0\u10dc\u10d2\u10d0\u10e0\u10d8\u10e8\u10d4\u10d1\u10d0",
		optionWindowTabSettingsHeader: "\u10de\u10d0\u10e0\u10d0\u10db\u10d4\u10e2\u10e0\u10d4\u10d1\u10d8",
		"option.settings-sound-header": "\u10ee\u10db\u10d4\u10d1\u10d8:",
		"option.settings-sound-header-not-supported": "not supported by your browser",
		"option.settings-sound-pack-wood": "\u10de\u10d0\u10d9\u10d4\u10e2\u10d8 - \u10ee\u10d4",
		"option.settings-sound-pack-plastic": "\u10de\u10d0\u10d9\u10d4\u10e2\u10d8 - \u10de\u10da\u10d0\u10e1\u10e2\u10db\u10d0\u10e1\u10d8",
		"option.settings-sound-off": "\u10ee\u10db\u10d4\u10d1\u10d8\u10e1 \u10d2\u10d0\u10e0\u10d4\u10e8\u10d4",
		optionWindowTabSettingsAutoHeader: "\u10d0\u10d5\u10e2\u10dd-\u10db\u10dd\u10eb\u10e0\u10d0\u10dd\u10d1\u10d0:",
		optionWindowTabSettingsAutoFlip: "\u10d9\u10d0\u10e0\u10e2\u10d4\u10d1\u10d8\u10e1 \u10d0\u10d5\u10e2\u10dd\u10db\u10d0\u10e2\u10e3\u10e0\u10d0\u10d3 \u10d0\u10db\u10dd\u10e2\u10e0\u10d8\u10d0\u10da\u10d4\u10d1\u10d0",
		optionWindowTabSettingsAutoMoveWhenWon: "\u10d0\u10d5\u10e2\u10dd\u10db\u10d0\u10e2\u10e3\u10e0\u10d0\u10d3 \u10d7\u10d0\u10db\u10d0\u10e8\u10d8 \u10db\u10dd\u10d2\u10d4\u10d1\u10d8\u10e1\u10d0\u10e1",
		optionWindowTabSettingsAutoMoveOff: "\u10d0\u10d5\u10e2\u10dd\u10db\u10d0\u10e2\u10e3\u10e0\u10d8 \u10d7\u10d0\u10db\u10d0\u10e8\u10d8\u10e1 \u10d2\u10d0\u10db\u10dd\u10e0\u10d7\u10d5\u10d0",
		optionWindowTabSettingsControlHeader: "\u10db\u10d0\u10e0\u10d7\u10d5\u10d0:",
		optionWindowTabSettingsControlTime: "\u10e2\u10d0\u10d8\u10db\u10d4\u10e0\u10d8\u10e1 \u10e9\u10d5\u10d4\u10dc\u10d4\u10d1\u10d0",
		optionWindowTabSettingsControlScores: "\u10e5\u10e3\u10da\u10d4\u10d1\u10d8\u10e1 \u10e9\u10d5\u10d4\u10dc\u10d4\u10d1\u10d0",
		optionWindowTabSettingsControlMoves: "\u10db\u10dd\u10e5\u10db\u10d4\u10d3\u10d4\u10d1\u10d4\u10d1\u10d8\u10e1 \u10e0\u10d0\u10dd\u10d3\u10d4\u10dc\u10dd\u10d1\u10d8\u10e1 \u10e9\u10d5\u10d4\u10dc\u10d4\u10d1\u10d0",
		optionWindowTabLanguageHeader: "\u10d4\u10dc\u10d0",
		optionWindowTabSettingsLangLabel: "You have changed the language to <b>{lang}</b> to show changes it is required to refresh page. Do you want to do it now?.",
		optionSkinHeader: "\u10d2\u10d0\u10e4\u10dd\u10e0\u10db\u10d4\u10d1\u10d0",
		optionSkinTabThemeHeader: "\u10d2\u10d0\u10e4\u10dd\u10e0\u10db\u10d4\u10d1\u10d0",
		optionSkinTabCardHeader: "\u10d3\u10d0\u10db\u10d0\u10e2\u10d4\u10d1\u10d8\u10d7\u10d8",
		optionWindowSelectedSkinItem: " (\u10dc\u10d0\u10e0\u10e9\u10d4\u10d5\u10d8)",
		optionWindowChangedThemeSkinItem: " \u10d0\u10e6\u10d3\u10d2\u10d4\u10dc\u10d0 \u10d2\u10d0\u10e4\u10dd\u10e0\u10db\u10d4\u10d1\u10d0",
		winHeader: "\u10e1\u10e2\u10d0\u10e2\u10d8\u10e1\u10e2\u10d8\u10d9\u10d0",
		winGameTypeHead: "\u10d7\u10d0\u10db\u10d0\u10e8\u10d4\u10d1\u10d8:",
		"win.klondike:turn-one": "\u10d9\u10da\u10dd\u10dc\u10d3\u10d0\u10d8\u10d9\u10d8 1",
		"win.klondike:turn-three": "\u10d9\u10da\u10dd\u10dc\u10d3\u10d0\u10d8\u10d9\u10d8 3",
		"win.double-klondike:turn-one": "\u10dd\u10e0\u10db\u10d0\u10d2\u10d8 \u10d9\u10da\u10dd\u10dc\u10d3\u10d0\u10d8\u10d9\u10d8 1",
		"win.double-klondike:turn-three": "\u10dd\u10e0\u10db\u10d0\u10d2\u10d8 \u10d9\u10da\u10dd\u10dc\u10d3\u10d0\u10d8\u10d9\u10d8 3",
		"win.spider:one-suit": "\u10dd\u10d1\u10dd\u10d1\u10d0 1",
		"win.spider:two-suits": "\u10dd\u10d1\u10dd\u10d1\u10d0 2",
		"win.spider:four-suits": "\u10dd\u10d1\u10dd\u10d1\u10d0 4",
		"win.forty-thieves": "Forty Thieves",
		winScoringSystemHead: "\u10d3\u10d0\u10d0\u10dc\u10d2\u10d0\u10e0\u10d8\u10e8\u10d4\u10d1\u10d0:",
		winScoringSystemStandard: "\u10e1\u10e2\u10d0\u10dc\u10d3\u10d0\u10e0\u10e2\u10e3\u10da\u10d8 \u10d3\u10d0\u10d0\u10dc\u10d2\u10d0\u10e0\u10d8\u10e8\u10d4\u10d1\u10d0",
		winScoringSystemTimed: "\u10d3\u10e0\u10dd\u10d8\u10e1 \u10db\u10d8\u10ee\u10d4\u10d3\u10d5\u10d8\u10d7 \u10d3\u10d0\u10d0\u10dc\u10d2\u10d0\u10e0\u10d8\u10e8\u10d4\u10d1\u10d0",
		winMovesHead: "\u10db\u10dd\u10e5\u10db\u10d4\u10d3\u10d4\u10d1\u10d0:",
		winTimeHead: "\u10d3\u10e0\u10dd:",
		winBonusHead: "\u10ef\u10d8\u10da\u00ad\u10d3\u10dd:",
		winScoresHead: "\u10e5\u10e3\u10da\u10d0:",
		winBestScoresHead: "\u10e1\u10d0\u00ad\u10e3\u00ad\u10d9\u10d4\u00ad\u10d7\u10d4\u00ad\u10e1\u10dd \u10e5\u10e3\u10da\u10d0:",
		winRedealButton: "\u10ee\u10d4\u10da\u10d0\u10ee\u10da\u10d0 \u10ea\u10d3\u10d0",
		winNewGameButton: "\u10d0\u10ee\u10d0\u10da\u10d8 \u10d7\u10d0\u10db\u10d0\u10e8\u10d8",
		pauseHeader: "Pause",
		pauseContent: "Break in the game<br/>...",
		pauseButtonResume: "Resume",
		cancel: "\u10d2\u10d0\u10e3\u10e5\u10db\u10d4\u10d1\u10d0"
	}
}).call(Solitaire);
(function () {
	this.Language = this.Language || {};
	this.Language.ko = {
		menuButton: "\uba54\ub274",
		menuNewGameButton: "\uc0c8 \uac8c\uc784",
		menuRestartGameButton: "\ub2e4\uc2dc \uc2dc\uc791",
		menuSelectGameButton: "\uac8c\uc784\uc744 \uc120\ud0dd",
		menuOptionButton: "\uc635\uc158",
		menuSkinButton: "\ud14c\ub9c8",
		menuInfoButton: '<img src="' + SS + 'images/info.png" alt="" />',
		menuUndo: '<img src="' + SS + 'images/undo.png" alt="">&nbsp;&nbsp;\uc2e4\ud589\ucde8\uc18c',
		labelTime: "\uc2dc\uac04: {var}",
		labelScore: "\uc810\uc218: {var}",
		labelMoves: "\uc774\ub3d9 \uc218: {var}",
		"game.play": "\ud558\ub2e4",
		"game.show-on-startup": "\uc2dc\uc791\uc2dc \ud45c\uc2dc",
		optionWindowHeader: "\uc635\uc158",
		optionWindowTabGameHeader: "\uac8c\uc784 \uc885\ub958",
		"klondike:turn-one": "\ud074\ub860\ub2e4\uc774\ud06c - \ud55c \uc7a5\uc529",
		"klondike:turn-three": "\ud074\ub860\ub2e4\uc774\ud06c - \uc138 \uc7a5\uc529",
		"double-klondike:turn-one": "\ub354\ube14 \ud074\ub860\ub2e4\uc774\ud06c - \ud55c \uc7a5\uc529",
		"double-klondike:turn-three": "\ub354\ube14 \ud074\ub860\ub2e4\uc774\ud06c - \uc138 \uc7a5\uc529",
		"spider:one-suit": "\uc2a4\ud30c\uc774\ub354 - \ud55c \uc9dd\ud328",
		"spider:two-suits": "\uc2a4\ud30c\uc774\ub354 - \ub450 \uc9dd\ud328",
		"spider:four-suits": "\uc2a4\ud30c\uc774\ub354 - \ub124 \uc9dd\ud328",
		"forty-thieves": "Forty Thievies",
		"coming-soon": "\ucd9c\uc2dc\uc608\uc815",
		"difficulty-level": "\uc5b4\ub824\uc6c0",
		optionWindowTabScoringHeader: "\uc810\uc218 \uacc4\uc0b0",
		scoringStandardMode: "\ud45c\uc900 \uacc4\uc0b0",
		scoringTimedMode: "\uc2dc\uac04 \uacc4\uc0b0",
		optionWindowTabSettingsHeader: "\uc124\uc815",
		"option.settings-sound-header": "\uc18c\ub9ac:",
		"option.settings-sound-header-not-supported": "\uadc0\ud558\uc758 \ube0c\ub77c\uc6b0\uc800\uc5d0\uc11c \uc9c0\uc6d0\ub418\uc9c0 \uc54a\uc2b5\ub2c8\ub2e4",
		"option.settings-sound-pack-wood": "\uafb8\ub7ec\ubbf8 - \ub098\ubb34",
		"option.settings-sound-pack-plastic": "\uafb8\ub7ec\ubbf8 - \ud50c\ub77c\uc2a4\ud2f1",
		"option.settings-sound-off": "\uc5b4\ub5a4 \uc18c\ub9ac\ub97c \uc7ac\uc0dd\ud558\uc9c0 \ub9c8\uc2ed\uc2dc\uc624",
		optionWindowTabSettingsAutoHeader: "\uc790\ub3d9\ud654:",
		optionWindowTabSettingsAutoFlip: "\uc790\ub3d9\uc73c\ub85c \uce74\ub4dc \ub4a4\uc9d1\uae30",
		optionWindowTabSettingsAutoMoveWhenWon: "\uc774\uacbc\uc744 \ub54c \uc790\ub3d9\uc73c\ub85c \ub05d\ub0b4\uae30",
		optionWindowTabSettingsAutoMoveOff: "\uc790\ub3d9\ud654 \uc5c6\uc74c",
		optionWindowTabSettingsControlHeader: "\uc870\uc791:",
		optionWindowTabSettingsControlTime: "\ud0c0\uc774\uba38 \ubcf4\uc774\uae30",
		optionWindowTabSettingsControlScores: "\ud0c0\uc774\uba38 \ubcf4\uc774\uae30",
		optionWindowTabSettingsControlMoves: "\uc774\ub3d9 \uc218 \ubcf4\uc774\uae30",
		optionWindowTabLanguageHeader: "\uc5b8\uc5b4",
		optionWindowTabSettingsLangLabel: "You have changed the language to <b>{lang}</b> to show changes it is required to refresh page. Do you want to do it now?.",
		optionSkinHeader: "\ud14c\ub9c8",
		optionSkinTabThemeHeader: "\ud14c\ub9c8",
		optionSkinTabCardHeader: "\uace0\uae09 \uc124\uc815",
		optionWindowSelectedSkinItem: " (\uc120\ud0dd\ub41c)",
		optionWindowChangedThemeSkinItem: " \ud14c\ub9c8\ub97c \ubcf5\uc6d0",
		winHeader: "\uacbd\uae30 \ud1b5\uacc4",
		winGameTypeHead: "\uc7ac\ubbf8:",
		"win.klondike:turn-one": "\ud074\ub860\ub2e4\uc774\ud06c 1",
		"win.klondike:turn-three": "\ud074\ub860\ub2e4\uc774\ud06c 3",
		"win.double-klondike:turn-one": "\ub354\ube14 \ud074\ub860\ub2e4\uc774\ud06c 1",
		"win.double-klondike:turn-three": "\ub354\ube14 \ud074\ub860\ub2e4\uc774\ud06c 3",
		"win.spider:one-suit": "\uc2a4\ud30c\uc774\ub354 1",
		"win.spider:two-suits": "\uc2a4\ud30c\uc774\ub354 2",
		"win.spider:four-suits": "\uc2a4\ud30c\uc774\ub354 4",
		"win.forty-thieves": "Forty Thieves",
		winScoringSystemHead: "\uc2dc\uc2a4\ud15c\uc744 \uc810\uc218:",
		winScoringSystemStandard: "\ud45c\uc900",
		winScoringSystemTimed: "\uc2dc\uac04",
		winMovesHead: "\uc774\ub3d9:",
		winTimeHead: "\uc2dc\uac04:",
		winBonusHead: "\ubcf4\ub108\uc2a4:",
		winScoresHead: "\uc810\uc218:",
		winBestScoresHead: "\ucd5c\uace0 \uc810\uc218:",
		winRedealButton: "\ub2e4\uc2dc \uc2dc\uc791",
		winNewGameButton: "\uc0c8 \uac8c\uc784",
		pauseHeader: "\uc911\uc9c0",
		pauseContent: "\uc911\uc9c0<br/>...",
		pauseButtonResume: "\uacc4\uc18d",
		cancel: "\ucde8\uc18c\ud558\ub2e4"
	}
}).call(Solitaire);
(function () {
	this.Language = this.Language || {};
	this.Language.lv = {
		menuButton: "Meniu",
		menuNewGameButton: "Naujas \u017eaidimas",
		menuRestartGameButton: "Kartoti \u017eaidim\u0105",
		menuSelectGameButton: "Pasirinkite \u017eaidim\u0105",
		menuOptionButton: "Nustatymai",
		menuSkinButton: "Temos",
		menuInfoButton: '<img src="' + SS + 'images/info.png" alt="" />',
		menuUndo: '<img src="' + SS + 'images/undo.png" alt="">&nbsp;&nbsp;Atstatyti',
		labelTime: "Laikas: {var}",
		labelScore: "Ta\u0161kai: {var}",
		labelMoves: "\u0116jim\u0173: {var}",
		"game.play": "\u017eaisti",
		"game.show-on-startup": "Rodyti Paleid\u017eiant",
		optionWindowHeader: "Nustatymai",
		optionWindowTabGameHeader: "\u017daidimai",
		"klondike:turn-one": "Klondaikas - Po vien\u0105 kort\u0105",
		"klondike:turn-three": "Klondaikas - Po tris kortas",
		"double-klondike:turn-one": "Dvigubas klondaikas - Po kort\u0105",
		"double-klondike:turn-three": "Dvigubas klondaikas - Po tris",
		"spider:one-suit": "Spider - Vienas rinkinys",
		"spider:two-suits": "Spider - Du rinkiniai",
		"spider:four-suits": "Spider - Keturi rinkiniai",
		"forty-thieves": "Forty Thievies",
		"coming-soon": "netrukus",
		"difficulty-level": "sunkumas",
		optionWindowTabScoringHeader: "Ta\u0161kai",
		scoringStandardMode: "Standartin\u0117 skai\u010diavimo sistema",
		scoringTimedMode: "Per laik\u0105 skai\u010diavimo sistema",
		optionWindowTabSettingsHeader: "Nustatymai",
		"option.settings-sound-header": "Garsai:",
		"option.settings-sound-header-not-supported": "not supported by your browser",
		"option.settings-sound-pack-wood": "Paketas - Medis",
		"option.settings-sound-pack-plastic": "Paketas - Plastikas",
		"option.settings-sound-off": "Negroti joki\u0173 gars\u0173",
		optionWindowTabSettingsAutoHeader: "Automatinis \u0117jimas:",
		optionWindowTabSettingsAutoFlip: "Automatinis kort\u0173 atvertimas",
		optionWindowTabSettingsAutoMoveWhenWon: "Automati\u0161kai \u017eaisti kai laimima",
		optionWindowTabSettingsAutoMoveOff: "Ne\u017eaisti automati\u0161kai",
		optionWindowTabSettingsControlHeader: "Valdymas:",
		optionWindowTabSettingsControlTime: "Rodyti laik\u0105",
		optionWindowTabSettingsControlScores: "Rodyti ta\u0161kus",
		optionWindowTabSettingsControlMoves: "Rodyti atliktus \u0117jimus",
		optionWindowTabLanguageHeader: "Kalba",
		optionWindowTabSettingsLangLabel: "You have changed the language to <b>{lang}</b> to show changes it is required to refresh page. Do you want to do it now?.",
		optionSkinHeader: "Tema",
		optionSkinTabThemeHeader: "Tema",
		optionSkinTabCardHeader: "Patyrusiems",
		optionWindowSelectedSkinItem: " (pasirinktos)",
		optionWindowChangedThemeSkinItem: " atkurti tema",
		winHeader: "\u017eaidimo statistika",
		winGameTypeHead: "\u017eaidimo tipas:",
		"win.klondike:turn-one": "Klondaikas 1",
		"win.klondike:turn-three": "Klondaikas 3",
		"win.double-klondike:turn-one": "Dvigubas klondaikas 1",
		"win.double-klondike:turn-three": "Dvigubas klondaikas 3",
		"win.spider:one-suit": "Spider 1",
		"win.spider:two-suits": "Spider 2",
		"win.spider:four-suits": "Spider 4",
		"win.forty-thieves": "Forty Thieves",
		winScoringSystemHead: "Bal\u0173 sistema:",
		winScoringSystemStandard: "Standartas",
		winScoringSystemTimed: "Laiku",
		winMovesHead: "\u0116jim\u0173:",
		winTimeHead: "Laikas:",
		winBonusHead: "Premija:",
		winScoresHead: "Ta\u0161kai:",
		winBestScoresHead: "Geriausias ta\u0161kai:",
		winRedealButton: "Kartoti \u017eaidim\u0105",
		winNewGameButton: "Naujas \u017eaidimas",
		pauseHeader: "Pauz\u0117",
		pauseContent: "Pertraukos \u017eaidim\u0105<br/>...",
		pauseButtonResume: "Atnaujinti",
		cancel: "At\u0161aukti"
	}
}).call(Solitaire);
(function () {
	this.Language = this.Language || {};
	this.Language.nl = {
		menuButton: "Menu",
		menuNewGameButton: "Nieuw spel",
		menuRestartGameButton: "Herspeel",
		menuSelectGameButton: "Selecteer spel",
		menuOptionButton: "Opties",
		menuSkinButton: "Thema",
		menuInfoButton: '<img src="' + SS + 'images/info.png" alt="" />',
		menuUndo: '<img src="' + SS + 'images/undo.png" alt="">&nbsp;&nbsp;Terug',
		labelTime: "Tijd: {var}",
		labelScore: "Score: {var}",
		labelMoves: "Zetten: {var}",
		"game.play": "Spelen",
		"game.show-on-startup": "Laat bij het opstarten",
		optionWindowHeader: "Opties",
		optionWindowTabGameHeader: "Spellen",
		"klondike:turn-one": "Klondike - 1 kaart draaien",
		"klondike:turn-three": "Klondike - 3 kaarten draaien",
		"double-klondike:turn-one": "Dobbelt klondike - 1 kaart draaien",
		"double-klondike:turn-three": "Dobbelt klondike - 3 kaarten draaien",
		"spider:one-suit": "Edderkop - En farve",
		"spider:two-suits": "Edderkop - To jakkes\u00e6t",
		"spider:four-suits": "Edderkop - Fire jakkes\u00e6t",
		"forty-thieves": "Forty Thievies",
		"coming-soon": "kommer snart",
		"difficulty-level": "besv\u00e6r",
		optionWindowTabScoringHeader: "Scoretelling",
		scoringStandardMode: "Standaard scoretelling",
		scoringTimedMode: "Tijd gebaseerde scoretelling",
		optionWindowTabSettingsHeader: "Instellingen",
		"option.settings-sound-header": "Lyder:",
		"option.settings-sound-header-not-supported": "ikke underst\u00f8ttes af din browser",
		"option.settings-sound-pack-wood": "Pakke - Tr\u00e6",
		"option.settings-sound-pack-plastic": "Pakke - Plast",
		"option.settings-sound-off": "M\u00e5 ikke spille nogen lyde",
		optionWindowTabSettingsAutoHeader: "Automatische zetten:",
		optionWindowTabSettingsAutoFlip: "Automatisch omdraaien",
		optionWindowTabSettingsAutoMoveWhenWon: "Automatisch spelen als gewonnen",
		optionWindowTabSettingsAutoMoveOff: "Niet automatisch spelen",
		optionWindowTabSettingsControlHeader: "Tellers:",
		optionWindowTabSettingsControlTime: "Laat tijdteller zien",
		optionWindowTabSettingsControlScores: "Laat score zien",
		optionWindowTabSettingsControlMoves: "Laat aantal zetten zien",
		optionWindowTabLanguageHeader: "Taal",
		optionWindowTabSettingsLangLabel: "You have changed the language to <b>{lang}</b> to show changes it is required to refresh page. Do you want to do it now?.",
		optionSkinHeader: "Thema",
		optionSkinTabThemeHeader: "Thema",
		optionSkinTabCardHeader: "Geavanceerd",
		optionWindowSelectedSkinItem: " (gekozen)",
		optionWindowChangedThemeSkinItem: " herstellen thema",
		winHeader: "Spel Statistieken",
		winGameTypeHead: "Spel:",
		"win.klondike:turn-one": "Klondike 1",
		"win.klondike:turn-three": "Klondike 3",
		"win.double-klondike:turn-one": "Dobbelt klondike 1",
		"win.double-klondike:turn-three": "Dobbelt klondike 3",
		"win.spider:one-suit": "Edderkop 1",
		"win.spider:two-suits": "Edderkop 2",
		"win.spider:four-suits": "Edderkop 4",
		"win.forty-thieves": "Forty Thieves",
		winScoringSystemHead: "Scoresysteem:",
		winScoringSystemStandard: "Standaard",
		winScoringSystemTimed: "Getimede",
		winMovesHead: "Skridt:",
		winTimeHead: "Speeltijd:",
		winBonusHead: "Bonus:",
		winScoresHead: "Score:",
		winBestScoresHead: "Beste score:",
		winRedealButton: "Herspeel",
		winNewGameButton: "Nieuw spel",
		pauseHeader: "Pauze",
		pauseContent: "Breuk in het spel    <br/>...",
		pauseButtonResume: "Hervatten",
		cancel: "Annuleren"
	}
}).call(Solitaire);
(function () {
	this.Language = this.Language || {};
	this.Language["nn-no"] = {
		menuButton: "Meny",
		menuNewGameButton: "Nytt spill",
		menuRestartGameButton: "Spill p\u00e5 nytt",
		menuSelectGameButton: "Velg spill",
		menuOptionButton: "Valg",
		menuSkinButton: "Tema",
		menuInfoButton: '<img src="' + SS + 'images/info.png" alt="" />',
		menuUndo: '<img src="' + SS + 'images/undo.png" alt="">&nbsp;&nbsp;Angre',
		labelTime: "Tid: {var}",
		labelScore: "Poeng: {var}",
		labelMoves: "Trekk: {var}",
		"game.play": "Spill",
		"game.show-on-startup": "Vis ved oppstart",
		optionWindowHeader: "Valg",
		optionWindowTabGameHeader: "Spill",
		"klondike:turn-one": "Klondike - F\u00f8rste gang",
		"klondike:turn-three": "Klondike - Tredje gang",
		"double-klondike:turn-one": "Dobbel klondike - F\u00f8rste gang",
		"double-klondike:turn-three": "Dobbel klondike - Tredje gang",
		"spider:one-suit": "Spider - En kortstokk",
		"spider:two-suits": "Spider - To kortstokker",
		"spider:four-suits": "Spider - Fire kortstokker",
		"forty-thieves": "Forty Thievies",
		"coming-soon": "kommer snart",
		"difficulty-level": "vanskeligheter",
		optionWindowTabScoringHeader: "Poeng",
		scoringStandardMode: "Standard poengsystem",
		scoringTimedMode: "Tidsstyrt poengsystem",
		optionWindowTabSettingsHeader: "Instillinger",
		"option.settings-sound-header": "Lyder:",
		"option.settings-sound-header-not-supported": "ikke st\u00f8ttes av nettleseren din",
		"option.settings-sound-pack-wood": "Pakke - Tre",
		"option.settings-sound-pack-plastic": "Pakke - Plastikk",
		"option.settings-sound-off": "Ikke spill av lyd",
		optionWindowTabSettingsAutoHeader: "Autoflytt:",
		optionWindowTabSettingsAutoFlip: "Snu kort automatisk",
		optionWindowTabSettingsAutoMoveWhenWon: "Spill automatisk n\u00e5r vunnet",
		optionWindowTabSettingsAutoMoveOff: "Ikke spill automatisk",
		optionWindowTabSettingsControlHeader: "Kontroller:",
		optionWindowTabSettingsControlTime: "Vis tid",
		optionWindowTabSettingsControlScores: "Vis poengsum",
		optionWindowTabSettingsControlMoves: "Vis spill",
		optionWindowTabLanguageHeader: "Spr\u00e5k",
		optionWindowTabSettingsLangLabel: "You have changed the language to <b>{lang}</b> to show changes it is required to refresh page. Do you want to do it now?.",
		optionSkinHeader: "Tema",
		optionSkinTabThemeHeader: "Tema",
		optionSkinTabCardHeader: "Avansert",
		optionWindowSelectedSkinItem: " (valgt)",
		optionWindowChangedThemeSkinItem: " gjenopprette tema",
		winHeader: "Spillstatistikk",
		winGameTypeHead: "Spill:",
		"win.klondike:turn-one": "Klondike 1",
		"win.klondike:turn-three": "Klondike 3",
		"win.double-klondike:turn-one": "Dobbel klondike 1",
		"win.double-klondike:turn-three": "Dobbel klondike 3",
		"win.spider:one-suit": "Spider 1",
		"win.spider:two-suits": "Spider 2",
		"win.spider:four-suits": "Spider 4",
		"win.forty-thieves": "Forty Thieves",
		winScoringSystemHead: "Poeng:",
		winScoringSystemStandard: "Standard",
		winScoringSystemTimed: "Tidsbestemt",
		winMovesHead: "Flytter gjort:",
		winTimeHead: "Spilletid:",
		winBonusHead: "Bonus:",
		winScoresHead: "Poeng:",
		winBestScoresHead: "Best poengsum:",
		winRedealButton: "Spill p\u00e5 nytt",
		winNewGameButton: "Nytt spill",
		pauseHeader: "Pause",
		pauseContent: "Brudd i spillet<br/>...",
		pauseButtonResume: "Fortsett",
		cancel: "Avbryte"
	}
}).call(Solitaire);
(function () {
	this.Language = this.Language || {};
	this.Language["pl-pl"] = {
		menuButton: "Menu",
		menuNewGameButton: "Nowa gra",
		menuRestartGameButton: "Pon\u00f3w gr\u0119",
		menuSelectGameButton: "Wybierz gr\u0119",
		menuOptionButton: "Opcje",
		menuSkinButton: "Wygl\u0105d",
		menuInfoButton: '<img src="' + SS + 'images/info.png" alt="" />',
		menuUndo: '<img src="' + SS + 'images/undo.png" alt="">&nbsp;&nbsp;Cofnij',
		menuAuth: '<img src="' + SS + 'images/flags/unknown.png" alt="">&nbsp;&nbsp;Zaloguj si\u0119',
		menuAuthLogged: '<img src="{flag_src}" alt="">&nbsp;&nbsp;Witaj {player_name}!',
		labelTime: "Czas: {var}",
		labelScore: "Punkty: {var}",
		labelMoves: "Ruchy: {var}",
		"game.play": "Graj",
		"game.show-on-startup": "Pokazuj okno przy ka\u017cdym od\u015bwie\u017ceniu strony",
		"auth.login-header": "Zaloguj si\u0119",
		"auth.register-header": "Zarejestruj si\u0119",
		"auth.info-header": "Informacje o graczu",
		"auth.label-player-name": "Nazwa gracza: ",
		"auth.placeholder-player-name": "Tutaj wpisz nazw\u0119 gracza",
		"auth.label-password": "Has\u0142o: ",
		"auth.placeholder-password": "Tutaj wpisz has\u0142o",
		"auth.register-button": "Zarejestruj si\u0119",
		"auth.login-button": "Zaloguj si\u0119",
		"auth.register-link-form": "Przejd\u017a do formularza rejestracji",
		"auth.login-link-form": "Przejd\u017a do formularza logowania",
		"auth.logout-link": "Wyloguj si\u0119",
		"auth.login-desc": 'Zaloguj si\u0119 jako gracz w <b>pasjans-online.pl</b> lub je\u015bli nie masz jeszcze konta zarejestruj si\u0119 klikaj\u0105c w link "Przejd\u017a do formularza rejestracji".',
		"auth.login-error": "Wprowadzone dane s\u0105 b\u0142\u0119dne. Sprawd\u017a poprawno\u015b\u0107 loginu i/lub has\u0142a i spr\u00f3buj ponownie.",
		"auth.register-desc": "Zarejestruj swoj\u0105 nazw\u0119 gracza. Rejestruj\u0105c si\u0119 w <b>pasjans-online.pl</b> uzyskasz dost\u0119p do funkcjonalno\u015bci oferowanych tylko zarejestrowanym u\u017cytkownikom.",
		"auth.register-error": "Wprowadzone dane s\u0105 b\u0142\u0119dne. Sprawd\u017a poprawno\u015b\u0107 loginu i/lub has\u0142a i spr\u00f3buj ponownie.",
		"auth.valid-info": "W obu polach wymagane jest min. 3 i max. 20 znak\u00f3w.",
		"auth.info-welcome": "Witaj <b>{player_name}</b>!",
		"auth.info-created": "Konto od: <b>{signup_time}</b>",
		"auth.info-last-login": "Ostatnie poprawne logowanie: <b>{login_time}</b>",
		"auth.info-country": 'Kraj gracza: <b>{country_name}</b> / <img src="{flag_src}" alt="">',
		optionWindowHeader: "Opcje",
		optionWindowTabGameHeader: "Gry",
		"klondike:turn-one": "Klondike - Rozdawanie co jedn\u0105 kart\u0119",
		"klondike:turn-three": "Klondike - Rozdawanie co trzy karty",
		"double-klondike:turn-one": "Podw\u00f3jny Klondike - Rozdawanie co jedn\u0105 kart\u0119",
		"double-klondike:turn-three": "Podw\u00f3jny Klondike - Rozdawanie co trzy karty",
		"spider:one-suit": "Paj\u0105k - Jeden kolor",
		"spider:two-suits": "Paj\u0105k - Dwa kolory",
		"spider:four-suits": "Paj\u0105k - Cztery kolory",
		"forty-thieves": "Czterdziestu rozb\u00f3jnik\u00f3w",
		"coming-soon": "wkr\u00f3tce",
		"difficulty-level": "poziom trudno\u015bci",
		optionWindowTabScoringHeader: "Punktacja",
		scoringStandardMode: "Standardowy system punktacji",
		scoringTimedMode: "Czasowy system punktacji",
		optionWindowTabSettingsHeader: "Ustawienia",
		"option.settings-sound-header": "Dzwi\u0119ki:",
		"option.settings-sound-header-not-supported": "brak wsparcia ze strony przegl\u0105darki",
		"option.settings-sound-pack-wood": "Pakiet - Drewno",
		"option.settings-sound-pack-plastic": "Pakiet - Plastik",
		"option.settings-sound-off": "Wy\u0142\u0105cz odtwarzanie dzwi\u0119k\u00f3w",
		optionWindowTabSettingsAutoHeader: "Automatyka:",
		optionWindowTabSettingsAutoFlip: "Automatycznie odkrywaj odwr\u00f3cone karty",
		optionWindowTabSettingsAutoMoveWhenWon: "Automatycznie odk\u0142adaj pasuj\u0105ce karty gdy rozdanie jest wygrane",
		optionWindowTabSettingsAutoMoveOff: "Wy\u0142\u0105cz automatyczne odk\u0142adanie kart",
		optionWindowTabSettingsControlHeader: "Kontrolki:",
		optionWindowTabSettingsControlTime: "Poka\u017c czas gry",
		optionWindowTabSettingsControlScores: "Poka\u017c punktacj\u0119",
		optionWindowTabSettingsControlMoves: "Poka\u017c liczb\u0119 ruch\u00f3w",
		optionWindowTabLanguageHeader: "J\u0119zyk",
		optionWindowTabSettingsLangLabel: "Zmieni\u0142e\u015b j\u0119zyk na <b>{lang}</b>, aby uwidoczni\u0107 zmiany wymagane jest od\u015bwie\u017cenie strony. Czy chcesz to teraz zrobi\u0107?",
		optionSkinHeader: "Wygl\u0105d",
		optionSkinTabThemeHeader: "Motyw",
		optionSkinTabCardHeader: "Zaawansowane",
		optionWindowSelectedSkinItem: " (wybrany)",
		optionWindowChangedThemeSkinItem: " przywr\u00f3\u0107 motyw",
		winHeader: "Statystyki gry",
		winGameTypeHead: "Rodzaj gry:",
		"win.klondike:turn-one": "Klondike 1",
		"win.klondike:turn-three": "Klondike 3",
		"win.double-klondike:turn-one": "Podw. Klondike 1",
		"win.double-klondike:turn-three": "Podw. Klondike 3",
		"win.spider:one-suit": "Paj\u0105k 1",
		"win.spider:two-suits": "Paj\u0105k 2",
		"win.spider:four-suits": "Paj\u0105k 4",
		"win.forty-thieves": "40 rozb\u00f3jnik\u00f3w",
		winScoringSystemHead: "System punktacji:",
		winScoringSystemStandard: "Standardowy",
		winScoringSystemTimed: "Czasowy",
		winMovesHead: "Wykonane ruchy:",
		winTimeHead: "Czas gry:",
		winBonusHead: "Bonus:",
		winScoresHead: "Punkty:",
		winBestScoresHead: "Najlepszy wynik:",
		winRedealButton: "Rozdaj ponownie",
		winNewGameButton: "Nowa gra",
		"win.share-score": "Podziel si\u0119 wynikiem",
		"win.share-title": "W\u0142a\u015bnie u\u0142o\u017cy\u0142em pasjansa - {game_type}",
		"win.share-description": "Zaje\u0142o mi to {time} sekund, wymaga\u0142o {moves} ruch\u00f3w i da\u0142o w sumie {score} punkt\u00f3w :) Sprawd\u017a!",
		pauseHeader: "Pauza",
		pauseContent: "Przerwa w grze<br/>...",
		pauseButtonResume: "Graj dalej",
		cancel: "Anuluj",
		or: "lub",
		infoHeader: "Info",
		infoTabContactHeader: "Kontakt",
		infoTabChangeLogHeader: "Historia zmian",
		infoTabContactLabel: "Masz jakie\u015b sugestie? Znalaz\u0142e\u015b jakie\u015b b\u0142\u0119dy? Nie kr\u0119puj si\u0119, napisz do nas.",
		infoTabContactMessagePlaceholder: "Wpisz tutaj swoje pytanie lub znaleziony b\u0142\u0105d.",
		infoTabContactEmailPlaceholder: "Wpisz sw\u00f3j email je\u015bli oczekujesz odpowiedzi na pytanie.",
		infoTabContactSubmit: "Wy\u015blij",
		infoTabContactSending: "Wysy\u0142am ...",
		infoTabContactSent: "Wiadomo\u015b\u0107 zosta\u0142a wys\u0142ana.",
		infoTabContactBack: "Powr\u00f3\u0107",
		infoTabContactChromeApp: "Sprawd\u017a wersje offline jako dodatki do przegl\u0105darki: ",
		infoTabChangeLogItems: {
			"25-04-2012 (v. 1.3.9)": "Dodano mo\u017cliwo\u015b\u0107 rejestrowania nazwy gracza. Pierwszy krok do zbierania indywidualnych statystyk jako kolejna przysz\u0142a funkcjonalno\u015b\u0107 strony.",
			"06-04-2012 (v. 1.3.8.5)": "Dodano mo\u017cliwo\u015b\u0107 dzielenia si\u0119 wynikami u\u0142o\u017conego pasjansa poprzez facebooka, google plusa i twittera.",
			"31-03-2012 (v. 1.3.8.4)": "Naprawa dzia\u0142ania przycisku 'cofnij' dla gry Czterdziestu rozb\u00f3jnik\u00f3w.",
			"26-03-2012 (v. 1.3.8.3)": "Poprawiono kilka bug\u00f3w.",
			"22-03-2012 (v. 1.3.8.2)": "Poprawiono t\u0142o dla motywu 'Modern' dla wy\u017cszych rozdzielczo\u015bci oraz poprawiono funkcjonalno\u015b\u0107 wybierania j\u0119zyka.",
			"19-03-2012 (v. 1.3.8.1)": "Dodano nowe okienko (domy\u015blnie otwierane przy wej\u015bciu na stron\u0119) wy\u015bwietlaj\u0105ce list\u0119 obs\u0142ugiwanych wariant\u00f3w pasjansa.",
			"14-03-2012 (v. 1.3.8.0)": "Poprawono b\u0142\u0105d nie odgrywania dzwi\u0119k\u00f3w na chromie.",
			"07-03-2012 (v. 1.3.7.9)": "Dobra wiadomo\u015b\u0107 dla esto\u0144czyk\u00f3w, rumu\u0144czyk\u00f3w i du\u0144czyk\u00f3w - dodano obs\u0142ug\u0119 3 kolejnych j\u0119zyk\u00f3w.",
			"05-03-2012 (v. 1.3.7.7)": "Dodano nowy motyw zrobiony przez <b><a href='http://twitter.com/johnkappa'>@johnkappa</a></b> oraz tymczasowo wy\u0142\u0105czono dzwi\u0119ki dla chroma - problem przegl\u0105darki przy odtwarzniu kr\u00f3tkich plik\u00f3w dzwi\u0119kowych.",
			"01-03-2012 (v. 1.3.7.6)": "Znaleziono oraz poprawiono b\u0142\u0105d wyst\u0119puj\u0105cy po wybraniu czasowej punktacji (powinno zabiera\u0107 2 pkt. po ka\u017cdych 10 sekundach gry) oraz dodano do tre\u015bci zasad ka\u017cdej gry maksymaln\u0105 mo\u017cliw\u0105 do zdobycia ilo\u015b\u0107 punkt\u00f3w (ikona wykrzyknika na dole po lewej stronie).",
			"28-02-2012 (v. 1.3.7.5)": "Poprawiono kilka bug\u00f3w - brak reakcji na klikni\u0119cie w tali\u0119 (b\u0142\u0105d wyst\u0119powa\u0142 tylko na niekt\u00f3rych rozdzielczo\u015bciach), poprawiono t\u0142umaczenie japo\u0144skie oraz poprawiono symbol karty As pik (zamiast pik by\u0142o czarne serce).",
			"19-02-2012 (v. 1.3.7.4)": "Naprawiono krytyczny b\u0142\u0105d - zawieszanie si\u0119 przegl\u0105darki w przypadku kiedy ostatni\u0105 kart\u0105 odkrywan\u0105 by\u0142 As.",
			"17-02-2012 (v. 1.3.7.3)": "Dodano 8 nowych j\u0119zyk\u00f3w oraz poprawiono bug zwi\u0105zany z kart\u0105 J pik.",
			"09-02-2012 (v. 1.3.7.2)": "Dodano przycisk (w menu skr\u00f3t\u00f3w - lewy dolny r\u00f3g) dzi\u0119ki kt\u00f3remu mo\u017cna zatrzyma\u0107 gr\u0119.",
			"05-02-2012 (v. 1.3.7.1)": "Ups! W pasjansie 'Czterdziestu rozb\u00f3jnik\u00f3w' system rozdawa\u0142 9 kolumn, powinno by\u0107 10. Poprawiono :)",
			"02-02-2012 (v. 1.3.7)": "Dodano nowego pasjansa 'Forty Thieves' oraz skr\u00f3t w\u0142\u0105czaj\u0105cy/wy\u0142\u0105czaj\u0105cy dzwi\u0119k kart.",
			"02-01-2012 (v. 1.3.6.4)": "Usuni\u0119to widget \u015bwi\u0105teczny oraz dodano dwa nowe j\u0119zyki: Arabski i Litewski.",
			"21-12-2011 (v. 1.3.6.3)": "Dodano animowane dzwoneczki z okazji \u015awi\u0105t Bo\u017cego Narodzenia. Wszystkiego najlepszego! :)",
			"16-11-2011 (v. 1.3.6)": 'Dodano nowy motyw "Strips blue", obs\u0142ug\u0119 dw\u00f3ch kolejnych j\u0119zyk\u00f3w oraz poprawiono bug zwi\u0105zany ze znikaj\u0105c\u0105 kart\u0105.',
			"02-11-2011 (v. 1.3.3)": 'Dodano pasjansa "Podw\u00f3jny Klondike", dodan\u0105 obs\u0142ug\u0119 4 j\u0119zyk\u00f3w oraz poprawiono kilka bug\u00f3w.',
			"24-10-2011 (v. 1.3)": 'Dodano kompletn\u0105 wersj\u0119 pasjansa "Paj\u0105k", mo\u017cliwo\u015b\u0107 w\u0142\u0105czenia dzwi\u0119k\u00f3w kart oraz system powiadomie\u0144 o wa\u017cnych zmianach na stronie.',
			"17-10-2011 (v. 1.2)": "Nowy pasjans - Paj\u0105k zago\u015bci\u0142 w kodzie, dodano j\u0119zyk norweski oraz poprawiono szereg bug\u00f3w.",
			"07-09-2011 (v. 1.1.6)": "Dodano mo\u017cliwo\u015b\u0107 gry w pasjana na urz\u0105dzeniach mobilnych, tabletach o rozdzielczo\u015bci nawet 300 pikseli w szeroko\u015bci. Dodano j\u0119zyk hiszpa\u0144ski oraz poprawiono kilka bug\u00f3w.",
			"03-08-2011 (v. 1.1.5.5)": "Dodano jeszcze wi\u0119cej... t\u0142umacze\u0144. <b>Wielkie dzi\u0119ki!</b> dla wszystkich anonimowych ludzi kt\u00f3rzy wys\u0142ali do mnie propozycje t\u0142umacze\u0144 swoich natywnych j\u0119zyk\u00f3w.",
			"29-07-2011 (v. 1.1.5.4)": "Dodano obs\u0142ug\u0119 innych j\u0119zyk\u00f3w tj: Niemiecki, Holenderski, Turecki i inne.",
			"30-06-2011 (v. 1.1.5.3)": "Dodano mo\u017cliwo\u015b\u0107 zatrzymania gry/spauzowania (klawisz 'P') oraz dodano Google +1 :)",
			"29-05-2011 (v. 1.1.5.2)": 'Dodano nowy motyw "Honeycomb".',
			"24-05-2011 (v. 1.1.5)": "-&nbsp;Dodano okienko statystyk pokazywane po ka\u017cdym wygranym rozdaniu; <br/> -&nbsp;Dodano nowy, czasowy system zliczania punkt\u00f3w. Rodzaj punktacji mo\u017cna wybra\u0107 w opcjach gry.",
			"10-05-2011 (v. 1.1.4)": "-&nbsp;Dodano system zliczania punkt\u00f3w, czasu oraz ilo\u015bci wykonanych ruch\u00f3w; <br/> -&nbsp;Usuni\u0119to bug zwi\u0105zany z niemo\u017cno\u015bci\u0105 przeniesienia kr\u00f3la na wolne pole (w rzadkich przypadkach).",
			"02-05-2011 (v. 1.1.3)": "Usuni\u0119to bug zwi\u0105zany z przenoszeniem as\u00f3w na g\u00f3rne pola oraz poprawiono kilka innych drobnych problem\u00f3w.",
			"20-04-2011 (v. 1.1.2)": "Usuni\u0119to kilka bug\u00f3w.",
			"19-04-2011 (v. 1.1.1)": "Naprawiono drobne bugi zwi\u0105zane z b\u0142\u0119dnym odkrywniem si\u0119 kart.",
			"12-04-2011 (v. 1.1.0)": "-&nbsp;Dodano motyw 'Pattern dark' oraz nowy rodzaj kart 'Animals'; <br/> -&nbsp;Funkcjonalno\u015b\u0107 nieograniczonego cofnia kart (CTRL + Z); <br/> -&nbsp;Funkcjonalno\u015b\u0107 ponowienia gry bez tasowania talii; <br/> -&nbsp;Od teraz prawy przycisk myszy jest aliasem dla podw\u00f3jnego LMB.",
			"03-04-2011 (v. 1.0.4)": 'Dodano nowy motyw "Saloon".',
			"16-02-2011 (v. 1.0.3)": "Poprawiono wygl\u0105d te\u0142 dla du\u017cych rozdzielczo\u015bci ekranu.",
			"09-02-2011 (v. 1.0.2)": "Dodano okno informacyjn\u0119 (kontakt i historia zmian).",
			"05-02-2011 (v. 1.0.1)": "Dodano mo\u017cliwo\u015b\u0107 \u015bci\u0105gania kart z p\u00f3l asowych.",
			"01-01-2011 (v. 1.0.0)": "Pierwsze wydanie."
		},
		"whatsNew.header": "Nowo\u015bci na stronie",
		"whatsNew.content": "Dodano mo\u017cliwo\u015b\u0107 rejestracji nazwy gracza. Ka\u017cde za\u0142o\u017cone konto uzyskuje dost\u0119p do nowych funkcjonalno\u015bci kt\u00f3re b\u0119d\u0105 pojawia\u0142y si\u0119 w serwisie.",
		"rules.content.klondike:turn-one": "Gra opiera si\u0119 na 52 kartach. Nie ma Joker\u00f3w. S\u0105 4 stosy bazowe i 7 kolumn roboczych. Na g\u00f3rnej lewej kupce znajduje si\u0119 tylko jedna karta, kt\u00f3ra jest obr\u00f3cona przodem i tylko t\u0105 kart\u0119 mo\u017cesz po\u0142o\u017cy\u0107 na inne. Karty na stosie bazowym musz\u0105 by\u0107 u\u0142o\u017cone od najmniejszej do najwi\u0119kszej (od asa do kr\u00f3la). As w tej grze ma najni\u017csz\u0105 warto\u015b\u0107. W Klondike mo\u017cesz uk\u0142ada\u0107 na sobie tylko kolory naprzemiennie. Czerwony na czarny i na odwr\u00f3t. W pustym miejscu w polu kolumn mo\u017cesz po\u0142o\u017cy\u0107 jedynie kr\u00f3la b\u0105d\u017a kombinacj\u0119 u\u0142o\u017conych kart z kr\u00f3lem na spodzie. Celem gry jest spowodowanie, aby wszystkie karty trafi\u0142y na stos bazowy. <br />W trybie punktacji standardowej maksymalnie mo\u017cna zdoby\u0107 760 punkt\u00f3w. <br /><br />Klondike to najpopularniejszy pasjans ze wszystkich i posiada blisko 90% szans na zwyci\u0119sk\u0105 parti\u0119.<br /><a target='_blank' href='http://wikipedia.org/wiki/Klondike_(solitaire)'>wi\u0119cej...</a><br />",
		"rules.content.klondike:turn-three": "Gra opiera si\u0119 na 52 kartach. Nie ma Joker\u00f3w. S\u0105 4 stosy bazowe i 7 kolumn roboczych. Na g\u00f3rnej lewej kupce znajduj\u0105 si\u0119 trzy karty, kt\u00f3re s\u0105 obr\u00f3cone przodem. Tylk\u0105 jedn\u0105 (g\u00f3rn\u0105) kart\u0119 mo\u017cesz przesun\u0105\u0107 w pole gry. Karty na stosie bazowym musz\u0105 by\u0107 u\u0142o\u017cone od najmniejszej do najwi\u0119kszej (od asa do kr\u00f3la). As w tej grze ma najni\u017csz\u0105 warto\u015b\u0107. W Klondike mo\u017cesz uk\u0142ada\u0107 na sobie tylko kolory naprzemiennie. Czerwony na czarny i na odwr\u00f3t. W pustym miejscu w polu kolumn mo\u017cesz po\u0142o\u017cy\u0107 jedynie kr\u00f3la b\u0105d\u017a kombinacj\u0119 u\u0142o\u017conych kart z kr\u00f3lem na spodzie. Celem gry jest spowodowanie, aby wszystkie karty trafi\u0142y na stos bazowy. <br />W trybie punktacji standardowej maksymalnie mo\u017cna zdoby\u0107 760 punkt\u00f3w. <br /><br />Klondike to najpopularniejszy pasjans ze wszystkich i posiada blisko 90% szans na zwyci\u0119sk\u0105 parti\u0119.<br /><a target='_blank' href='http://wikipedia.org/wiki/Klondike_(solitaire)'>wi\u0119cej...</a><br />",
		"rules.content.double-klondike:turn-one": "Gra opiera si\u0119 na 104 kartach. Nie ma Joker\u00f3w. Jest 8 stos\u00f3w bazowych i 9 kolumn roboczych. Na g\u00f3rnej lewej kupce znajduje si\u0119 tylko jedna karta, kt\u00f3ra jest obr\u00f3cona przodem i tylko t\u0105 kart\u0119 mo\u017cesz przesun\u0105\u0107 w pole gry. Karty na stosach bazowych musz\u0105 by\u0107 u\u0142o\u017cone od najmniejszej do najwi\u0119kszej (od asa do kr\u00f3la). As w tej grze ma najni\u017csz\u0105 warto\u015b\u0107. W Podw\u00f3jnym Klondike mo\u017cesz uk\u0142ada\u0107 na sobie tylko kolory przeciwstawne - czerwony na czarny i na odwr\u00f3t. W pustym miejscu w polu kolumn roboczych mo\u017cesz po\u0142o\u017cy\u0107 jedynie kr\u00f3la b\u0105d\u017a kombinacj\u0119 u\u0142o\u017conych kart z kr\u00f3lem na spodzie. Celem gry jest spowodowanie, aby wszystkie karty trafi\u0142y na stos bazowy. W trybie punktacji standardowej maksymalnie mo\u017cna zdoby\u0107 1520 punkt\u00f3w. <br /><br /><a target='_blank' href='http://wikipedia.org/wiki/Double_Klondike'>wi\u0119cej...</a><br />",
		"rules.content.double-klondike:turn-three": "Gra opiera si\u0119 na 104 kartach. Nie ma Joker\u00f3w. Jest 8 stos\u00f3w bazowych i 9 kolumn roboczych. Na g\u00f3rnej lewej kupce znajduj\u0105 si\u0119 trzy karty, kt\u00f3re s\u0105 obr\u00f3cone przodem i tylko ostatni\u0105 kart\u0119 mo\u017cesz przenie\u015b\u0107 w pole gry. Karty na stosach bazowych musz\u0105 by\u0107 u\u0142o\u017cone od najmniejszej do najwi\u0119kszej (od asa do kr\u00f3la). As w tej grze ma najni\u017csz\u0105 warto\u015b\u0107. W Podw\u00f3jnym Klondike mo\u017cesz uk\u0142ada\u0107 na sobie tylko kolory przeciwstawne - czerwony na czarny i na odwr\u00f3t. W pustym miejscu w polu kolumn roboczych mo\u017cesz po\u0142o\u017cy\u0107 jedynie kr\u00f3la b\u0105d\u017a kombinacj\u0119 u\u0142o\u017conych kart z kr\u00f3lem na spodzie. Celem gry jest spowodowanie, aby wszystkie karty trafi\u0142y na stos bazowy. W trybie punktacji standardowej maksymalnie mo\u017cna zdoby\u0107 1520 punkt\u00f3w. <br /><br /><a target='_blank' href='http://wikipedia.org/wiki/Double_Klondike'>wi\u0119cej...</a><br />",
		"rules.content.spider:one-suit": "W grze bior\u0105 udzia\u0142 104 karty. Jest tylko jeden (losowy) kolor kart. Na stole jest 10 kolumn oraz 8 stos\u00f3w bazowych. Wszystkie karty (opr\u00f3cz tych na wierzchu) s\u0105 odwr\u00f3cone ty\u0142em. Mo\u017cesz jedynie przesuwa\u0107 karty, kt\u00f3re s\u0105 ods\u0142oni\u0119te. Gra si\u0119 ko\u0144czy kiedy wszystkie karty trafi\u0105 na stosy bazowe. <br /><br />Jeden z bardziej znanych i cz\u0119sto grywanych gier typu pasjans. W trybie punktacji standardowej maksymalnie mo\u017cna zdoby\u0107 515 punkt\u00f3w. <br /><br /><a target='_blank' href='http://wikipedia.org/wiki/Spider_solitaire'>wi\u0119cej...</a><br />",
		"rules.content.spider:two-suits": "W grze bior\u0105 udzia\u0142 104 karty. W grze s\u0105 dwa (losowe) kolory kart. Na stole jest 10 kolumn oraz 8 stos\u00f3w bazowych. Wszystkie karty (opr\u00f3cz tych na wierzchu) s\u0105 odwr\u00f3cone ty\u0142em. Mo\u017cesz jedynie przesuwa\u0107 karty, kt\u00f3re s\u0105 ods\u0142oni\u0119te. Gra si\u0119 ko\u0144czy kiedy wszystkie karty trafi\u0105 na stosy bazowe. <br /><br />Jeden z bardziej znanych i cz\u0119sto grywanych gier typu pasjans. W trybie punktacji standardowej maksymalnie mo\u017cna zdoby\u0107 515 punkt\u00f3w. <br /><br /><a target='_blank' href='http://wikipedia.org/wiki/Spider_solitaire'>wi\u0119cej...</a><br />",
		"rules.content.spider:four-suits": "W grze bior\u0105 udzia\u0142 104 karty. W grze s\u0105 wszystkie kolory. Na stole jest 10 kolumn oraz 8 stos\u00f3w bazowych. Wszystkie karty (opr\u00f3cz tych na wierzchu) s\u0105 odwr\u00f3cone ty\u0142em. Mo\u017cesz jedynie przesuwa\u0107 karty, kt\u00f3re s\u0105 ods\u0142oni\u0119te. Gra si\u0119 ko\u0144czy kiedy wszystkie karty trafi\u0105 na stosy bazowe. <br /><br />Jeden z bardziej znanych i cz\u0119sto grywanych gier typu pasjans. Paj\u0105k na cztery kolory jest uwa\u017cany za jeden z najtrudniejszych gier typu pasjans. W trybie punktacji standardowej maksymalnie mo\u017cna zdoby\u0107 515 punkt\u00f3w. <br /><br /><a target='_blank' href='http://wikipedia.org/wiki/Spider_solitaire'>wi\u0119cej...</a><br />",
		"rules.content.forty-thieves": "W grze bior\u0105 udzia\u0142 dwie talie. Gra jest tym trudniejsza ni\u017c zwyk\u0142y Klondike poniewa\u017c mo\u017cesz jednocze\u015bnie przesuwa\u0107 mi\u0119dzy kolumnami tylko jedn\u0105 kart\u0119. U\u0142atwieniem jednak jest to, \u017ce na puste pole mo\u017cesz wstawi\u0107 dowoln\u0105 kart\u0119. Celem gry jest zbudowanie sekwencjii na stosie bazowym w kolejno\u015bci od Asa do Kr\u00f3la. Musisz wiedzie\u0107 r\u00f3wnie\u017c, \u017ce mo\u017cesz jedynie raz ods\u0142oni\u0107 karty z lewej g\u00f3rnej kupki dlatego dobrze jest pami\u0119ta\u0107 jakie karty by\u0142y tam przedtem. <br /><br />Jedna z najtrudniejszych gier typu pasjans. Posiada nieca\u0142e 10% szans na wygrane rozdanie. W trybie punktacji standardowej maksymalnie mo\u017cna zdoby\u0107 oko\u0142o 1550 punkt\u00f3w. <br /><br /><a target='_blank' href='http://wikipedia.org/wiki/Forty_Thieves_(card_game)'>wi\u0119cej...</a><br />"
	}
}).call(Solitaire);
(function () {
	this.Language = this.Language || {};
	this.Language["pt-br"] = {
		menuButton: "Menu",
		menuNewGameButton: "Novo jogo",
		menuRestartGameButton: "Repetir jogo",
		menuSelectGameButton: "Selecione jogo",
		menuOptionButton: "Op\u00e7\u00f5es",
		menuSkinButton: "Tema",
		menuInfoButton: '<img src="' + SS + 'images/info.png" alt="" />',
		menuUndo: '<img src="' + SS + 'images/undo.png" alt="">&nbsp;&nbsp;Desfazer',
		labelTime: "Tempo: {var}",
		labelScore: "Pontua\u00e7\u00e3o: {var}",
		labelMoves: "Movimentos: {var}",
		"game.play": "Jogar",
		"game.show-on-startup": "Mostrar na inicializa\u00e7\u00e3o",
		optionWindowHeader: "Op\u00e7\u00f5es",
		optionWindowTabGameHeader: "Jogos",
		"klondike:turn-one": "Klondike - Uma virada",
		"klondike:turn-three": "Klondike - Tr\u00eas viradas",
		"double-klondike:turn-one": "Duplo klondike - Uma virada",
		"double-klondike:turn-three": "Duplo klondike - Tr\u00eas viradas",
		"spider:one-suit": "Aranha - Um terno",
		"spider:two-suits": "Aranha - Dois ternos",
		"spider:four-suits": "Aranha - Quatro naipes",
		"forty-thieves": "Forty Thievies",
		"coming-soon": "em breve",
		"difficulty-level": "dificuldade",
		optionWindowTabScoringHeader: "Pontua\u00e7\u00e3o",
		scoringStandardMode: "Sistema de pontua\u00e7\u00e3o tradicional",
		scoringTimedMode: "Sistema de pontua\u00e7\u00e3o por tempo",
		optionWindowTabSettingsHeader: "Configura\u00e7\u00f5es",
		"option.settings-sound-header": "Sons:",
		"option.settings-sound-header-not-supported": "n\u00e3o suportado pelo seu navegador",
		"option.settings-sound-pack-wood": "Pacote - Madeira",
		"option.settings-sound-pack-plastic": "Pacote - Pl\u00e1stico",
		"option.settings-sound-off": "N\u00e3o emitir quaisquer sons",
		optionWindowTabSettingsAutoHeader: "Movimenta\u00e7\u00e3o autom\u00e1tica:",
		optionWindowTabSettingsAutoFlip: "Virar cartas automaticamente",
		optionWindowTabSettingsAutoMoveWhenWon: "Jogar automaticamente quando vencer",
		optionWindowTabSettingsAutoMoveOff: "N\u00e3o jogar automaticamente",
		optionWindowTabSettingsControlHeader: "Controles:",
		optionWindowTabSettingsControlTime: "Mostrar cron\u00f4metro",
		optionWindowTabSettingsControlScores: "Mostrar pontua\u00e7\u00e3o",
		optionWindowTabSettingsControlMoves: "Mostrar movimentos feitos",
		optionWindowTabLanguageHeader: "Idioma",
		optionWindowTabSettingsLangLabel: "You have changed the language to <b>{lang}</b> to show changes it is required to refresh page. Do you want to do it now?.",
		optionSkinHeader: "Tema",
		optionSkinTabThemeHeader: "Tema",
		optionSkinTabCardHeader: "Avan\u00e7ado",
		optionWindowSelectedSkinItem: " (selecionado)",
		optionWindowChangedThemeSkinItem: " restaurar tema",
		winHeader: "Jogo Stats",
		winGameTypeHead: "Tipo de jogo:",
		"win.klondike:turn-one": "Klondike 1",
		"win.klondike:turn-three": "Klondike 3",
		"win.double-klondike:turn-one": "Duplo klondike 1",
		"win.double-klondike:turn-three": "Duplo klondike 3",
		"win.spider:one-suit": "Aranha 1",
		"win.spider:two-suits": "Aranha 2",
		"win.spider:four-suits": "Aranha 4",
		"win.forty-thieves": "Forty Thieves",
		winScoringSystemHead: "Sistema de pontua\u00e7\u00e3o:",
		winScoringSystemStandard: "Standard",
		winScoringSystemTimed: "Padr\u00e3o",
		winMovesHead: "Movimentos feitos:",
		winTimeHead: "Tempo de jogo:",
		winBonusHead: "B\u00f4nus:",
		winScoresHead: "Partitura:",
		winBestScoresHead: "Melhor pontua\u00e7\u00e3o:",
		winRedealButton: "Repetir jogo",
		winNewGameButton: "Novo jogo",
		pauseHeader: "Pausa",
		pauseContent: "Ruptura no jogo<br/>...",
		pauseButtonResume: "Retomar",
		cancel: "Cancelar"
	}
}).call(Solitaire);
(function () {
	this.Language = this.Language || {};
	this.Language.ro = {
		menuButton: "Meniu",
		menuNewGameButton: "Joc nou",
		menuRestartGameButton: "Re\u00eencearc\u0103",
		menuSelectGameButton: "Selecta\u0163i joc",
		menuOptionButton: "Optiuni",
		menuSkinButton: "Tem\u0103",
		menuInfoButton: '<img src="' + SS + 'images/info.png" alt="" />',
		menuUndo: '<img src="' + SS + 'images/undo.png" alt="">&nbsp;&nbsp;Anuleaz\u0103',
		labelTime: "Timp: {var}",
		labelScore: "Scor: {var}",
		labelMoves: "Mut\u0103ri: {var}",
		"game.play": "Joac\u0103",
		"game.show-on-startup": "Afi\u015fare la pornire",
		optionWindowHeader: "Optiuni",
		optionWindowTabGameHeader: "Jocuri",
		"klondike:turn-one": "Klondike - \u00centoarce una",
		"klondike:turn-three": "Klondike - \u00centoarce trei",
		"double-klondike:turn-one": "Dublu Klondike - \u00centoarce una",
		"double-klondike:turn-three": "Dublu Klondike - \u00centoarce trei",
		"spider:one-suit": "Spider - O culoare",
		"spider:two-suits": "Spider - Dou\u0103 culori",
		"spider:four-suits": "Spider - Patru culori",
		"forty-thieves": "Forty Thievies",
		"coming-soon": "\u00een cur\u00e2nd",
		"difficulty-level": "dificultate",
		optionWindowTabScoringHeader: "Punctaj",
		scoringStandardMode: "Sistem standard de punctare",
		scoringTimedMode: "Sistem de punctare temporizat",
		optionWindowTabSettingsHeader: "Set\u0103ri",
		"option.settings-sound-header": "Sunete:",
		"option.settings-sound-header-not-supported": "not supported by your browser",
		"option.settings-sound-pack-wood": "Pachet - Lemn",
		"option.settings-sound-pack-plastic": "Pachet - Plastic",
		"option.settings-sound-off": "F\u0103r\u0103 sunet",
		optionWindowTabSettingsAutoHeader: "Mutare automat\u0103:",
		optionWindowTabSettingsAutoFlip: "\u00centoarce c\u0103r\u0163ile automat",
		optionWindowTabSettingsAutoMoveWhenWon: "Rulare automat\u0103 la c\u00e2\u015ftigarea jocului",
		optionWindowTabSettingsAutoMoveOff: "Nu rula automat",
		optionWindowTabSettingsControlHeader: "Controale:",
		optionWindowTabSettingsControlTime: "Arat\u0103 temporizator",
		optionWindowTabSettingsControlScores: "Arat\u0103 punctaj",
		optionWindowTabSettingsControlMoves: "Arat\u0103 mut\u0103ri efectuate",
		optionWindowTabLanguageHeader: "Limb\u0103",
		optionWindowTabSettingsLangLabel: "You have changed the language to <b>{lang}</b> to show changes it is required to refresh page. Do you want to do it now?.",
		optionSkinHeader: "Tem\u0103",
		optionSkinTabThemeHeader: "Tem\u0103",
		optionSkinTabCardHeader: "Avansat",
		optionWindowSelectedSkinItem: " (selectate)",
		optionWindowChangedThemeSkinItem: " restabili tem\u0103",
		winHeader: "Statistici",
		winGameTypeHead: "Joc:",
		"win.klondike:turn-one": "Klondike 1",
		"win.klondike:turn-three": "Klondike 3",
		"win.double-klondike:turn-one": "Dublu Klondike 1",
		"win.double-klondike:turn-three": "Dublu Klondike 3",
		"win.spider:one-suit": "Spider 1",
		"win.spider:two-suits": "Spider 2",
		"win.spider:four-suits": "Spider 4",
		"win.forty-thieves": "Forty Thieves",
		winScoringSystemHead: "Punctaj:",
		winScoringSystemStandard: "Standard",
		winScoringSystemTimed: "Temporizat",
		winMovesHead: "Mut\u0103ri:",
		winTimeHead: "Timp:",
		winBonusHead: "Prim\u0103:",
		winScoresHead: "Scor:",
		winBestScoresHead: "Cel mai bun scor:",
		winRedealButton: "Re\u00eencearc\u0103",
		winNewGameButton: "Joc nou",
		pauseHeader: "Pauz\u0103",
		pauseContent: "Timp de cafea<br/>...",
		pauseButtonResume: "Relua",
		cancel: "Anula"
	}
}).call(Solitaire);
(function () {
	this.Language = this.Language || {};
	this.Language.ru = {
		menuButton: "\u041c\u0435\u043d\u044e",
		menuNewGameButton: "\u041d\u043e\u0432\u0430\u044f \u0438\u0433\u0440\u0430",
		menuRestartGameButton: "\u041f\u043e\u0432\u0442\u043e\u0440\u0438\u0442\u044c \u0438\u0433\u0440\u0443",
		menuSelectGameButton: "\u0412\u044b\u0431\u0440\u0430\u0442\u044c \u0438\u0433\u0440\u0443",
		menuOptionButton: "\u0432\u0430\u0440\u0438\u0430\u043d\u0442",
		menuSkinButton: "\u0442\u0435\u043c\u0430",
		menuInfoButton: '<img src="' + SS + 'images/info.png" alt="" />',
		menuUndo: '<img src="' + SS + 'images/undo.png" alt="">&nbsp;&nbsp;\u041e\u0442\u043c\u0435\u043d\u0438\u0442\u044c',
		labelTime: "\u0432\u0440\u0435\u043c\u044f: {var}",
		labelScore: "\u0441\u0447\u0435\u0442: {var}",
		labelMoves: "\u0434\u0432\u0438\u0436\u0435\u0442\u0441\u044f: {var}",
		"game.play": "\u0438\u0433\u0440\u0430\u0442\u044c",
		"game.show-on-startup": "\u041f\u043e\u043a\u0430\u0437\u0430\u0442\u044c \u043d\u0430 \u0441\u0442\u0430\u0440\u0442\u0435",
		optionWindowHeader: "\u0432\u0430\u0440\u0438\u0430\u043d\u0442",
		optionWindowTabGameHeader: "\u0418\u0433\u0440\u044b",
		"klondike:turn-one": "\u041a\u043e\u0441\u044b\u043d\u043a\u0430 - \u0421\u0434\u0430\u0432\u0430\u0442\u044c \u043f\u043e \u043e\u0434\u043d\u043e\u0439 \u043a\u0430\u0440\u0442\u0435",
		"klondike:turn-three": "\u041a\u043e\u0441\u044b\u043d\u043a\u0430 - \u0421\u0434\u0430\u0432\u0430\u0442\u044c \u043f\u043e \u0442\u0440\u0438 \u043a\u0430\u0440\u0442\u044b",
		"double-klondike:turn-one": "\u0434\u0432\u043e\u0439\u043d\u043e\u0439 k\u043e\u0441\u044b\u043d\u043a\u0430 - \u0421\u0434\u0430\u0432\u0430\u0442\u044c \u043f\u043e \u043e\u0434\u043d\u043e\u0439 \u043a\u0430\u0440\u0442\u0435",
		"double-klondike:turn-three": "\u0434\u0432\u043e\u0439\u043d\u043e\u0439 k\u043e\u0441\u044b\u043d\u043a\u0430 - \u0421\u0434\u0430\u0432\u0430\u0442\u044c \u043f\u043e \u0442\u0440\u0438 \u043a\u0430\u0440\u0442\u044b",
		"spider:one-suit": "\u043f\u0430\u0443\u043a\u0430 - \u043e\u0434\u0438\u043d \u043a\u043e\u0441\u0442\u044e\u043c",
		"spider:two-suits": "\u043f\u0430\u0443\u043a\u0430 - \u0434\u0432\u0430 \u043a\u043e\u0441\u0442\u044e\u043c\u0430",
		"spider:four-suits": "\u043f\u0430\u0443\u043a\u0430 - \u0447\u0435\u0442\u044b\u0440\u0435\u0445 \u043c\u0430\u0441\u0442\u0435\u0439",
		"forty-thieves": "Forty Thievies",
		"coming-soon": "\u0431\u043b\u0438\u0436\u0430\u0439\u0448\u0435\u0435 \u0432\u0440\u0435\u043c\u044f",
		"difficulty-level": "\u0442\u0440\u0443\u0434\u043d\u043e\u0441\u0442\u044c",
		optionWindowTabScoringHeader: "\u0421\u0447\u0435\u0442",
		scoringStandardMode: "\u0411\u0435\u0437 \u0443\u0447\u0435\u0442\u0430 \u0432\u0440\u0435\u043c\u0435\u043d\u0438",
		scoringTimedMode: "\u0421 \u0443\u0447\u0435\u0442\u043e\u043c \u0432\u0440\u0435\u043c\u0435\u043d\u0438",
		optionWindowTabSettingsHeader: "\u041f\u0430\u0440\u0430\u043c\u0435\u0442\u0440\u044b",
		"option.settings-sound-header": "\u0437\u0432\u0443\u043a\u0438:",
		"option.settings-sound-header-not-supported": "\u043d\u0435 \u043f\u043e\u0434\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u0435\u0442\u0441\u044f \u0431\u0440\u0430\u0443\u0437\u0435\u0440\u043e\u043c",
		"option.settings-sound-pack-wood": "\u043f\u0430\u043a\u0435\u0442 - \u0434\u0435\u0440\u0435\u0432\u043e",
		"option.settings-sound-pack-plastic": "\u043f\u0430\u043a\u0435\u0442 - \u043f\u043b\u0430\u0441\u0442\u043c\u0430\u0441\u0441\u0430",
		"option.settings-sound-off": "\u041d\u0435 \u0438\u0433\u0440\u0430\u0439\u0442\u0435 \u0432 \u043b\u044e\u0431\u044b\u0435 \u0437\u0432\u0443\u043a\u0438",
		optionWindowTabSettingsAutoHeader: "\u0410\u0432\u0442\u043e\u043f\u0435\u0440\u0435\u043c\u0435\u0449\u0435\u043d\u0438\u0435:",
		optionWindowTabSettingsAutoFlip: "\u041f\u0435\u0440\u0435\u043c\u0435\u0449\u0430\u0442\u044c \u0432 \u0434\u043e\u043c \u043f\u0440\u0438 \u0434\u0432\u043e\u0439\u043d\u043e\u043c \u0449\u0435\u043b\u0447\u043a\u0435",
		optionWindowTabSettingsAutoMoveWhenWon: "\u0410\u0432\u0442\u043e \u0438\u0433\u0440\u0430\u0442\u044c, \u043a\u043e\u0433\u0434\u0430 \u0432\u044b\u0438\u0433\u0440\u0430\u043b",
		optionWindowTabSettingsAutoMoveOff: "\u041d\u0435 \u043f\u0435\u0440\u0435\u043c\u0435\u0449\u0430\u0442\u044c \u043f\u0440\u0438 \u0432\u044b\u0438\u0433\u0440\u044b\u0448\u0435",
		optionWindowTabSettingsControlHeader: "\u0421\u0447\u0435\u0442\u0447\u0438\u043a\u0438:",
		optionWindowTabSettingsControlTime: "\u041f\u043e\u043a\u0430\u0437\u044b\u0432\u0430\u0442\u044c \u0432\u0440\u0435\u043c\u044f",
		optionWindowTabSettingsControlScores: "\u041f\u043e\u043a\u0430\u0437\u044b\u0432\u0430\u0442\u044c \u0441\u0447\u0435\u0442",
		optionWindowTabSettingsControlMoves: "\u041f\u043e\u043a\u0430\u0437\u044b\u0432\u0430\u0442\u044c \u043a\u043e\u043b\u0438\u0447\u0435\u0441\u0442\u0432\u043e \u0445\u043e\u0434\u043e\u0432",
		optionWindowTabLanguageHeader: "\u042f\u0437\u044b\u043a",
		optionWindowTabSettingsLangLabel: "You have changed the language to <b>{lang}</b> to show changes it is required to refresh page. Do you want to do it now?.",
		optionSkinHeader: "\u0442\u0435\u043c\u0430",
		optionSkinTabThemeHeader: "\u0442\u0435\u043c\u0430",
		optionSkinTabCardHeader: "\u041a\u0430\u0440\u0442\u044b",
		optionWindowSelectedSkinItem: " (\u0432\u044b\u0431\u0440\u0430\u043d\u043d\u044b\u0439)",
		optionWindowChangedThemeSkinItem: " \u0432\u043e\u0441\u0441\u0442\u0430\u043d\u043e\u0432\u043b\u0435\u043d\u0438\u0435 \u0442\u0435\u043c\u0443",
		winHeader: "\u0421\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043a\u0430 \u0438\u0433\u0440\u044b",
		winGameTypeHead: "\u0442\u0438\u043f \u0438\u0433\u0440\u044b:",
		"win.klondike:turn-one": "\u041a\u043e\u0441\u044b\u043d\u043a\u0430 1",
		"win.klondike:turn-three": "\u041a\u043e\u0441\u044b\u043d\u043a\u0430 3",
		"win.double-klondike:turn-one": "\u0434\u0432\u043e\u0439\u043d\u043e\u0439 k\u043e\u0441\u044b\u043d\u043a\u0430 1",
		"win.double-klondike:turn-three": "\u0434\u0432\u043e\u0439\u043d\u043e\u0439 k\u043e\u0441\u044b\u043d\u043a\u0430 3",
		"win.spider:one-suit": "\u043f\u0430\u0443\u043a\u0430 1",
		"win.spider:two-suits": "\u043f\u0430\u0443\u043a\u0430 2",
		"win.spider:four-suits": "\u043f\u0430\u0443\u043a\u0430 4",
		"win.forty-thieves": "Forty Thieves",
		winScoringSystemHead: "\u0441\u0438\u0441\u0442\u0435\u043c\u0430 \u0431\u0430\u043b\u043b\u043e\u0432:",
		winScoringSystemStandard: "\u0441\u0442\u0430\u043d\u0434\u0430\u0440\u0442",
		winScoringSystemTimed: "\u0412\u0440\u0435\u043c\u0435\u043d\u043d\u044b\u0439",
		winMovesHead: "\u0441\u0434\u0435\u043b\u0430\u043d\u043d\u044b\u0445 \u0445\u043e\u0434\u043e\u0432:",
		winTimeHead: "\u0432\u0440\u0435\u043c\u044f \u0438\u0433\u0440\u044b:",
		winBonusHead: "\u0431\u043e\u043d\u0443\u0441:",
		winScoresHead: "\u0441\u0447\u0435\u0442:",
		winBestScoresHead: "\u041b\u0443\u0447\u0448\u0430\u044f \u043e\u0446\u0435\u043d\u043a\u0430:",
		winRedealButton: "\u041f\u043e\u0432\u0442\u043e\u0440\u0438\u0442\u044c \u0438\u0433\u0440\u0443",
		winNewGameButton: "\u041d\u043e\u0432\u0430\u044f \u0438\u0433\u0440\u0430",
		pauseHeader: "\u043f\u0430\u0443\u0437\u0430",
		pauseContent: "\u041f\u0435\u0440\u0435\u0440\u044b\u0432 \u0432 \u0438\u0433\u0440\u0435<br/>...",
		pauseButtonResume: "P\u0435\u0437\u044e\u043c\u0435",
		cancel: "\u0430\u043d\u043d\u0443\u043b\u0438\u0440\u043e\u0432\u0430\u0442\u044c"
	}
}).call(Solitaire);
(function () {
	this.Language = this.Language || {};
	this.Language.sl = {
		menuButton: "Menu",
		menuNewGameButton: "Nova igra",
		menuRestartGameButton: "Ponovi igro",
		menuSelectGameButton: "Izbira igre",
		menuOptionButton: "Mo\u017enosti",
		menuSkinButton: "Teme",
		menuInfoButton: '<img src="' + SS + 'images/info.png" alt="" />',
		menuUndo: '<img src="' + SS + 'images/undo.png" alt="">&nbsp;&nbsp;Razveljavi',
		labelTime: "\u010cas: {var}",
		labelScore: "Sk\u00f3re: {var}",
		labelMoves: "Potez: {var}",
		"game.play": "Igraj",
		"game.show-on-startup": "Poka\u017ei na zagon",
		optionWindowHeader: "Mo\u017enosti",
		optionWindowTabGameHeader: "Igre",
		"klondike:turn-one": "Klondike - Obrni eno",
		"klondike:turn-three": "Klondike - Obrni tri",
		"double-klondike:turn-one": "Dvojni klondike - Obrni eno",
		"double-klondike:turn-three": "Dvojni klondike - Obrni tri",
		"spider:one-suit": "Spider - En paket",
		"spider:two-suits": "Spider - Dva paketa",
		"spider:four-suits": "Spider - \u0160tiri paketi",
		"forty-thieves": "Forty Thievies",
		"coming-soon": "coming soon",
		"difficulty-level": "obtia\u017e",
		optionWindowTabScoringHeader: "Sk\u00f3re",
		scoringStandardMode: "Standardni sk\u00f3re",
		scoringTimedMode: "Sk\u00f3re po \u010dasu",
		optionWindowTabSettingsHeader: "Nastavitve",
		"option.settings-sound-header": "Zvuky:",
		"option.settings-sound-header-not-supported": "not supported by your browser",
		"option.settings-sound-pack-wood": "Bal\u00ed\u010dek - drevo",
		"option.settings-sound-pack-plastic": "Bal\u00ed\u010dek - plast",
		"option.settings-sound-off": "Ni predvajaj nobenega zvoka",
		optionWindowTabSettingsAutoHeader: "Avtomatska poteza:",
		optionWindowTabSettingsAutoFlip: "Avtomatsko obra\u010da karte",
		optionWindowTabSettingsAutoMoveWhenWon: "Avtomatska igra po zmagi",
		optionWindowTabSettingsAutoMoveOff: "Ne uporabi avtomatske poteze",
		optionWindowTabSettingsControlHeader: "Kontrole:",
		optionWindowTabSettingsControlTime: "Prika\u017ei \u010das",
		optionWindowTabSettingsControlScores: "Prika\u017ei sk\u00f3re",
		optionWindowTabSettingsControlMoves: "Prika\u017ei narejene poteze",
		optionWindowTabLanguageHeader: "Jezik",
		optionWindowTabSettingsLangLabel: "You have changed the language to <b>{lang}</b> to show changes it is required to refresh page. Do you want to do it now?.",
		optionSkinHeader: "Teme",
		optionSkinTabThemeHeader: "Teme",
		optionSkinTabCardHeader: "Napredno",
		optionWindowSelectedSkinItem: " (vybran\u00fd)",
		optionWindowChangedThemeSkinItem: " obnovi\u0165 teme",
		winHeader: "\u0160tatistiky",
		winGameTypeHead: "Igre:",
		"win.klondike:turn-one": "Klondike 1",
		"win.klondike:turn-three": "Klondike 3",
		"win.double-klondike:turn-one": "Dbl Klondike 1",
		"win.double-klondike:turn-three": "Dbl Klondike 3",
		"win.spider:one-suit": "Spider 1",
		"win.spider:two-suits": "Spider 2",
		"win.spider:four-suits": "Spider 4",
		"win.forty-thieves": "Forty Thieves",
		winScoringSystemHead: "Sk\u00f3re:",
		winScoringSystemStandard: "Standard",
		winScoringSystemTimed: "\u010casovan\u00fd",
		winMovesHead: "Potez:",
		winTimeHead: "\u010cas:",
		winBonusHead: "Pr\u00e9mie:",
		winScoresHead: "Sk\u00f3re:",
		winBestScoresHead: "Najlep\u0161\u00ed sk\u00f3re:",
		winRedealButton: "Ponovi igro",
		winNewGameButton: "Nova igra",
		pauseHeader: "Pause",
		pauseContent: "Prest\u00e1vka v hre<br/>...",
		pauseButtonResume: "Pokra\u010dova\u0165",
		cancel: "Preklicati"
	}
}).call(Solitaire);
(function () {
	this.Language = this.Language || {};
	this.Language.sr = {
		menuButton: "\u041c\u0435\u043d\u0438",
		menuNewGameButton: "\u041d\u043e\u0432\u0430 \u0438\u0433\u0440\u0430",
		menuRestartGameButton: "\u041f\u043e\u043d\u043e\u0432\u0438\u0442\u0438 \u0438\u0433\u0440\u0443",
		menuSelectGameButton: "\u0418\u0437\u0430\u0431\u0435\u0440\u0438\u0442\u0435 \u0438\u0433\u0440\u0443",
		menuOptionButton: "\u041e\u043f\u0446\u0438\u0458\u0435",
		menuSkinButton: "\u0422\u0435\u043c\u0435",
		menuInfoButton: '<img src="' + SS + 'images/info.png" alt="" />',
		menuUndo: '<img src="' + SS + 'images/undo.png" alt="">&nbsp;&nbsp;\u041e\u043f\u043e\u0437\u0438\u0432',
		labelTime: "\u0412\u0440\u0435\u043c\u0435: {var}",
		labelScore: "\u0420\u0435\u0437\u0443\u043b\u0442\u0430\u0442: {var}",
		labelMoves: "\u041f\u043e\u043a\u0440\u0435\u0442\u0430: {var}",
		"game.play": "\u0438\u0433\u0440\u0430\u0442\u0438",
		"game.show-on-startup": "\u041f\u0440\u0438\u043a\u0430\u0436\u0438 \u043d\u0430 \u043f\u043e\u043a\u0440\u0435\u0442\u0430\u045a\u0435",
		optionWindowHeader: "\u041e\u043f\u0446\u0438\u0458\u0435",
		optionWindowTabGameHeader: "\u0418\u0433\u0440\u0435",
		"klondike:turn-one": "\u041f\u0430\u0441\u0438\u0458\u0430\u043d\u0441 - \u041e\u043a\u0440\u0435\u043d\u0438 \u0458\u0435\u0434\u043d\u0443",
		"klondike:turn-three": "\u041f\u0430\u0441\u0438\u0458\u0430\u043d\u0441 - \u041e\u043a\u0440\u0435\u043d\u0438 \u0434\u0432\u0435",
		"double-klondike:turn-one": "\u0414\u0443\u043f\u043b\u0438 \u043f\u0430\u0441\u0438\u0458\u0430\u043d\u0441 - \u041e\u043a\u0440\u0435\u043d\u0438 \u0458\u0435\u0434\u043d\u0443",
		"double-klondike:turn-three": "\u0414\u0443\u043f\u043b\u0438 \u043f\u0430\u0441\u0438\u0458\u0430\u043d\u0441 - \u041e\u043a\u0440\u0435\u043d\u0438 \u0434\u0432\u0435",
		"spider:one-suit": "\u041f\u0430\u0443\u043a - \u0408\u0435\u0434\u043d\u0430 \u0441\u0435\u0440\u0438\u0458\u0430",
		"spider:two-suits": "\u041f\u0430\u0443\u043a - \u0414\u0432\u0435 \u0441\u0435\u0440\u0438\u0458\u0435",
		"spider:four-suits": "\u041f\u0430\u0443\u043a - \u0427\u0435\u0442\u0438\u0440\u0438 \u0441\u0435\u0440\u0438\u0458\u0435",
		"forty-thieves": "Forty Thievies",
		"coming-soon": "coming soon",
		"difficulty-level": "\u0442\u0435\u0448\u043a\u043e\u045b\u0430",
		optionWindowTabScoringHeader: "\u0411\u043e\u0434\u043e\u0432\u0430\u045a\u0435",
		scoringStandardMode: "\u0421\u0442\u0430\u043d\u0434\u0430\u0440\u0434\u043d\u0438 \u0441\u0438\u0441\u0442\u0435\u043c \u0431\u043e\u0434\u043e\u0432\u0430\u045a\u0430",
		scoringTimedMode: "\u0412\u0440\u0435\u043c\u0435\u043d\u0441\u043a\u0438 \u0441\u0438\u0441\u0442\u0435\u043c \u0431\u043e\u0434\u043e\u0432\u0430\u045a\u0430",
		optionWindowTabSettingsHeader: "\u041f\u043e\u0434\u0435\u0448\u0430\u0432\u0430\u045a\u0430",
		"option.settings-sound-header": "\u0417\u0432\u0443\u043a:",
		"option.settings-sound-header-not-supported": "not supported by your browser",
		"option.settings-sound-pack-wood": "\u041f\u0430\u043a\u043e\u0432\u0430\u045a\u0435 - \u0414\u0440\u0432\u043e",
		"option.settings-sound-pack-plastic": "\u041f\u0430\u043a\u043e\u0432\u0430\u045a\u0435 - \u041f\u043b\u0430\u0441\u0442\u0438\u043a\u0430",
		"option.settings-sound-off": "\u041d\u0435\u043c\u043e\u0458 \u043f\u0443\u0441\u0442\u0430\u0442\u0438 \u0431\u0438\u043b\u043e \u043a\u0430\u043a\u0430\u0432 \u0437\u0432\u0443\u043a",
		optionWindowTabSettingsAutoHeader: "\u0410\u0443\u0442\u043e\u043f\u043e\u043a\u0440\u0435\u0442:",
		optionWindowTabSettingsAutoFlip: "\u0410\u0443\u0442\u043e\u043c\u0430\u0442\u0441\u043a\u0438 \u043e\u043a\u0440\u0435\u0442 \u043a\u0430\u0440\u0442a",
		optionWindowTabSettingsAutoMoveWhenWon: "\u0410\u0443\u0442\u043e\u043c\u0430\u0442\u0441\u043a\u0430 \u0438\u0433\u0440\u0430 \u043f\u043e\u0441\u043b\u0435 \u043f\u043e\u0431\u0435\u0434\u0435",
		optionWindowTabSettingsAutoMoveOff: "\u041d\u0435\u043c\u043e\u0458 \u0438\u0433\u0440\u0430\u0442\u0438 \u0430\u0443\u0442\u043e\u043c\u0430\u0442\u0441\u043a\u0438",
		optionWindowTabSettingsControlHeader: "\u041a\u043e\u043d\u0442\u0440\u043e\u043b\u0435:",
		optionWindowTabSettingsControlTime: "\u041f\u043e\u043a\u0430\u0436\u0438 \u0442\u0430\u0458\u043c\u0435\u0440",
		optionWindowTabSettingsControlScores: "\u041f\u043e\u043a\u0430\u0436\u0438 \u0440\u0435\u0437\u0443\u043b\u0442\u0430\u0442",
		optionWindowTabSettingsControlMoves: "\u041f\u043e\u043a\u0430\u0436\u0438 \u043d\u0430\u043f\u0440\u0430\u0432\u0459\u0435\u043d\u0438 \u043f\u043e\u043a\u0440\u0435\u0442",
		optionWindowTabLanguageHeader: "\u0408\u0435\u0437\u0438\u0446\u0438",
		optionWindowTabSettingsLangLabel: "You have changed the language to <b>{lang}</b> to show changes it is required to refresh page. Do you want to do it now?.",
		optionSkinHeader: "\u0422\u0435\u043c\u0435",
		optionSkinTabThemeHeader: "\u0422\u0435\u043c\u0435",
		optionSkinTabCardHeader: "\u041d\u0430\u043f\u0440\u0435\u0434\u043d\u043e",
		optionWindowSelectedSkinItem: " (\u0438\u0437\u0430\u0431\u0440\u0430\u043d)",
		optionWindowChangedThemeSkinItem: " \u0432\u0440\u0430\u0442\u0438\u0442\u0435 \u0442\u0435\u043c\u0443",
		winHeader: "\u0421\u0442\u0430\u0442\u0441",
		winGameTypeHead: "\u0438\u0433\u0440\u0430:",
		"win.klondike:turn-one": "\u041f\u0430\u0441\u0438\u0458\u0430\u043d\u0441 1",
		"win.klondike:turn-three": "\u041f\u0430\u0441\u0438\u0458\u0430\u043d\u0441 3",
		"win.double-klondike:turn-one": "\u0414\u0443\u043f\u043b\u0438 \u043f\u0430\u0441\u0438\u0458\u0430\u043d\u0441 1",
		"win.double-klondike:turn-three": "\u0414\u0443\u043f\u043b\u0438 \u043f\u0430\u0441\u0438\u0458\u0430\u043d\u0441 3",
		"win.spider:one-suit": "\u041f\u0430\u0443\u043a 1",
		"win.spider:two-suits": "\u041f\u0430\u0443\u043a 2",
		"win.spider:four-suits": "\u041f\u0430\u0443\u043a 4",
		"win.forty-thieves": "Forty Thieves",
		winScoringSystemHead: "\u0411\u043e\u0434\u043e\u0432\u0430\u045a\u0435:",
		winScoringSystemStandard: "C\u0442\u0430\u043d\u0434\u0430\u0440\u0434\u043d\u0438",
		winScoringSystemTimed: "\u0422\u0438\u043c\u0435\u0434",
		winMovesHead: "\u041f\u043e\u043a\u0440\u0435\u0442\u0430:",
		winTimeHead: "\u0412\u0440\u0435\u043c\u0435:",
		winBonusHead: "\u0431\u043e\u043d\u0443\u0441:",
		winScoresHead: "\u0420\u0435\u0437\u0443\u043b\u0442\u0430\u0442:",
		winBestScoresHead: "\u041d\u0430\u0458\u0431\u043e\u0459\u0438 \u0440\u0435\u0437\u0443\u043b\u0442\u0430\u0442:",
		winRedealButton: "\u041f\u043e\u043d\u043e\u0432\u0438\u0442\u0438 \u0438\u0433\u0440\u0443",
		winNewGameButton: "\u041d\u043e\u0432\u0430 \u0438\u0433\u0440\u0430",
		pauseHeader: "\u043f\u0430\u0443\u0437\u0430",
		pauseContent: "\u041f\u0430\u0443\u0437\u0430 \u0443 \u0438\u0433\u0440\u0438<br/>...",
		pauseButtonResume: "\u043d\u0430\u0441\u0442\u0430\u0432\u0438",
		cancel: "O\u0442\u043a\u0430\u0437\u0430\u0442\u0438"
	}
}).call(Solitaire);
(function () {
	this.Language = this.Language || {};
	this.Language["sv-se"] = {
		menuButton: "Meny",
		menuNewGameButton: "Nytt Spel",
		menuRestartGameButton: "Pr\u00f6va Om Spel",
		menuSelectGameButton: "V\u00e4lj spel",
		menuOptionButton: "Alternativ",
		menuSkinButton: "Tema",
		menuInfoButton: '<img src="' + SS + 'images/info.png" alt="" />',
		menuUndo: '<img src="' + SS + 'images/undo.png" alt="">&nbsp;&nbsp;G\u00f6r om',
		labelTime: "Tid: {var}",
		labelScore: "Po\u00e4ng: {var}",
		labelMoves: "Drag: {var}",
		"game.play": "Spela",
		"game.show-on-startup": "Visa p\u00e5 start",
		optionWindowHeader: "Alternativ",
		optionWindowTabGameHeader: "Spel",
		"klondike:turn-one": "Klondike - Dra Ett",
		"klondike:turn-three": "Klondike - Dra Tre",
		"double-klondike:turn-one": "Dubbel klondike - Dra Ett",
		"double-klondike:turn-three": "Dubbel klondike - Dra Tre",
		"spider:one-suit": "Spindeln - Ett Set",
		"spider:two-suits": "Spindeln - Tv\u00e5 Set",
		"spider:four-suits": "Spindeln - Tre Set",
		"forty-thieves": "Forty Thievies",
		"coming-soon": "coming soon",
		"difficulty-level": "sv\u00e5righet",
		optionWindowTabScoringHeader: "Po\u00e4ngen",
		scoringStandardMode: "Standard Po\u00e4ng System",
		scoringTimedMode: "Tidtaget Po\u00e4ng System",
		optionWindowTabSettingsHeader: "Inst\u00e4llningar",
		"option.settings-sound-header": "Ljud:",
		"option.settings-sound-header-not-supported": "inte st\u00f6ds av din webbl\u00e4sare",
		"option.settings-sound-pack-wood": "Paket - Tr\u00e4",
		"option.settings-sound-pack-plastic": "Paket - Plast",
		"option.settings-sound-off": "Spela inte n\u00e5got ljud",
		optionWindowTabSettingsAutoHeader: "Autodrag:",
		optionWindowTabSettingsAutoFlip: "Auto V\u00e4nd Kort",
		optionWindowTabSettingsAutoMoveWhenWon: "Auto Spela Efter Vinst",
		optionWindowTabSettingsAutoMoveOff: "Auto Spela Inte",
		optionWindowTabSettingsControlHeader: "Kontroller:",
		optionWindowTabSettingsControlTime: "Visa Timer",
		optionWindowTabSettingsControlScores: "Visa Po\u00e4ng",
		optionWindowTabSettingsControlMoves: "Visa Varje Drag",
		optionWindowTabLanguageHeader: "Spr\u00e5k",
		optionWindowTabSettingsLangLabel: "You have changed the language to <b>{lang}</b> to show changes it is required to refresh page. Do you want to do it now?.",
		optionSkinHeader: "Tema",
		optionSkinTabThemeHeader: "Tema",
		optionSkinTabCardHeader: "Avancerad",
		optionWindowSelectedSkinItem: " (utvalda)",
		optionWindowChangedThemeSkinItem: " \u00e5terst\u00e4lla tema",
		winHeader: "Spelstatistik",
		winGameTypeHead: "Spel:",
		"win.klondike:turn-one": "Klondike 1",
		"win.klondike:turn-three": "Klondike 3",
		"win.double-klondike:turn-one": "Dubbel klondike 1",
		"win.double-klondike:turn-three": "Dubbel klondike 3",
		"win.spider:one-suit": "Spindeln 1",
		"win.spider:two-suits": "Spindeln 2",
		"win.spider:four-suits": "Spindeln 4",
		"win.forty-thieves": "Forty Thieves",
		winScoringSystemHead: "Po\u00e4ngen:",
		winScoringSystemStandard: "Standard",
		winScoringSystemTimed: "Tidsinst\u00e4llda",
		winMovesHead: "Drag:",
		winTimeHead: "Tid:",
		winBonusHead: "Bonus:",
		winScoresHead: "Po\u00e4ng:",
		winBestScoresHead: "B\u00e4sta po\u00e4ng:",
		winRedealButton: "Pr\u00f6va Om Spel",
		winNewGameButton: "Nytt Spel",
		pauseHeader: "Paus",
		pauseContent: "Avbrott i spelet<br/>...",
		pauseButtonResume: "\u00e5terupptas",
		cancel: "Avbryta"
	}
}).call(Solitaire);
(function () {
	this.Language = this.Language || {};
	this.Language.tr = {
		menuButton: "Men\u00fc",
		menuNewGameButton: "Yeni Oyun",
		menuRestartGameButton: "Oyunu Tekrar Et",
		menuSelectGameButton: "Oyun se\u00e7",
		menuOptionButton: "Se\u00e7enek",
		menuSkinButton: "Tema",
		menuInfoButton: '<img src="' + SS + 'images/info.png" alt="" />',
		menuUndo: '<img src="' + SS + 'images/undo.png" alt="">&nbsp;&nbsp;Geri Al',
		labelTime: "S\u00fcre: {var}",
		labelScore: "Skor: {var}",
		labelMoves: "Hareket: {var}",
		"game.play": "Oynamak",
		"game.show-on-startup": "Ba\u015flang\u0131\u00e7ta g\u00f6ster",
		optionWindowHeader: "Se\u00e7enek",
		optionWindowTabGameHeader: "Oyunlar",
		"klondike:turn-one": "Klondike - Birinci El",
		"klondike:turn-three": "Klondike - \u00dc\u00e7\u00fcnc\u00fc El",
		"double-klondike:turn-one": "\u00c7ift Klondike - Birinci El",
		"double-klondike:turn-three": "\u00c7ift Klondike - \u00dc\u00e7\u00fcnc\u00fc El",
		"spider:one-suit": "\u00d6r\u00fcmcek - Tek \u00c7ift",
		"spider:two-suits": "\u00d6r\u00fcmcek - \u0130ki \u00c7ift",
		"spider:four-suits": "\u00d6r\u00fcmcek - D\u00f6rt \u00c7ift",
		"forty-thieves": "Forty Thievies",
		"coming-soon": "yak\u0131nda",
		"difficulty-level": "zorluk",
		optionWindowTabScoringHeader: "Sonu\u00e7lar",
		scoringStandardMode: "Standart Sonu\u00e7 Sistemi",
		scoringTimedMode: "Zamana Kar\u015f\u0131 Sonu\u00e7 Sistemi",
		optionWindowTabSettingsHeader: "Ayarlar",
		"option.settings-sound-header": "Sesler:",
		"option.settings-sound-header-not-supported": "taray\u0131c\u0131n\u0131z taraf\u0131ndan desteklenmiyor",
		"option.settings-sound-pack-wood": "A\u011fa\u00e7 Paket",
		"option.settings-sound-pack-plastic": "Plastik Paket",
		"option.settings-sound-off": "Sesiz",
		optionWindowTabSettingsAutoHeader: "Otomatik Oyna:",
		optionWindowTabSettingsAutoFlip: "Otomatik Kart \u00c7evir",
		optionWindowTabSettingsAutoMoveWhenWon: "Kazan\u0131nca Otomatik Oyna",
		optionWindowTabSettingsAutoMoveOff: "Otomatik Oynama",
		optionWindowTabSettingsControlHeader: "Kontroller:",
		optionWindowTabSettingsControlTime: "Zaman\u0131 G\u00f6ster",
		optionWindowTabSettingsControlScores: "Sonucu G\u00f6ster",
		optionWindowTabSettingsControlMoves: "Toplam Hamle",
		optionWindowTabLanguageHeader: "Dil",
		optionWindowTabSettingsLangLabel: "You have changed the language to <b>{lang}</b> to show changes it is required to refresh page. Do you want to do it now?.",
		optionSkinHeader: "Tema",
		optionSkinTabThemeHeader: "Tema",
		optionSkinTabCardHeader: "Geli\u015fmi\u015f",
		optionWindowSelectedSkinItem: " (se\u00e7ilmi\u015f)",
		optionWindowChangedThemeSkinItem: " tema geri",
		winHeader: "Oyun \u0130statistikler",
		winGameTypeHead: "Oyun:",
		"win.klondike:turn-one": "Klondike 1",
		"win.klondike:turn-three": "Klondike 3",
		"win.double-klondike:turn-one": "\u00c7ift klondike 1",
		"win.double-klondike:turn-three": "\u00c7ift klondike 3",
		"win.spider:one-suit": "\u00d6r\u00fcmcek 1",
		"win.spider:two-suits": "\u00d6r\u00fcmcek 2",
		"win.spider:four-suits": "\u00d6r\u00fcmcek 4",
		"win.forty-thieves": "Forty Thieves",
		winScoringSystemHead: "Sonu\u00e7lar:",
		winScoringSystemStandard: "Standart",
		winScoringSystemTimed: "Zamanlanm\u0131\u015f",
		winMovesHead: "Hareket:",
		winTimeHead: "S\u00fcre:",
		winBonusHead: "Bonus:",
		winScoresHead: "Puan:",
		winBestScoresHead: "En iyi Puan:",
		winRedealButton: "Oyunu Tekrar Et",
		winNewGameButton: "Yeni Oyun",
		pauseHeader: "Duraklatmak",
		pauseContent: "Oyunun Duraklat<br/>...",
		pauseButtonResume: "\u00d6zge\u00e7mi\u015f",
		cancel: "Iptal"
	}
}).call(Solitaire);
(function () {
	this.Language = this.Language || {};
	this.Language.uk = {
		menuButton: "\u041c\u0435\u043d\u044e",
		menuNewGameButton: "\u041d\u043e\u0432\u0430 \u0433\u0440\u0430",
		menuRestartGameButton: "\u041f\u043e\u0432\u0442\u043e\u0440\u0438\u0442\u0438 \u0433\u0440\u0443",
		menuSelectGameButton: "\u0412\u0438\u0431\u0435\u0440\u0456\u0442\u044c \u0433\u0440\u0443",
		menuOptionButton: "\u041e\u043f\u0446\u0456\u0457",
		menuSkinButton: "\u0422\u0435\u043c\u0438",
		menuInfoButton: '<img src="' + SS + 'images/info.png" alt="" />',
		menuUndo: '<img src="' + SS + 'images/undo.png" alt="">&nbsp;&nbsp;\u041d\u0430\u0437\u0430\u0434',
		labelTime: "\u0427\u0430\u0441: {var}",
		labelScore: "\u0420\u0430\u0445\u0443\u043d\u043e\u043a: {var}",
		labelMoves: "\u0425\u043e\u0434\u0456\u0432: {var}",
		"game.play": "\u0433\u0440\u0430\u0442\u0438",
		"game.show-on-startup": "\u041f\u043e\u043a\u0430\u0437\u0430\u0442\u0438 \u043d\u0430 \u0441\u0442\u0430\u0440\u0442\u0456",
		optionWindowHeader: "\u041e\u043f\u0446\u0456\u0457",
		optionWindowTabGameHeader: "\u0406\u0433\u0440\u0438",
		"klondike:turn-one": "\u041a\u043b\u043e\u043d\u0434\u0430\u0439\u043a - \u0437\u0434\u0430\u0432\u0430\u0442\u0438 \u043f\u043e \u043e\u0434\u043d\u0456\u0439",
		"klondike:turn-three": "\u041a\u043b\u043e\u043d\u0434\u0430\u0439\u043a - \u0437\u0434\u0430\u0432\u0430\u0442\u0438 \u043f\u043e \u0442\u0440\u0438",
		"double-klondike:turn-one": "\u043f\u043e\u0434\u0432\u0456\u0439\u043d\u0438\u0439 \u041a\u043b\u043e\u043d\u0434\u0430\u0439\u043a - \u0437\u0434\u0430\u0432\u0430\u0442\u0438 \u043f\u043e \u043e\u0434\u043d\u0456\u0439",
		"double-klondike:turn-three": "\u043f\u043e\u0434\u0432\u0456\u0439\u043d\u0438\u0439 \u041a\u043b\u043e\u043d\u0434\u0430\u0439\u043a - \u0437\u0434\u0430\u0432\u0430\u0442\u0438 \u043f\u043e \u0442\u0440\u0438",
		"spider:one-suit": "\u041f\u0430\u0432\u0443\u043a - \u041e\u0434\u043d\u0456\u0454\u0457 \u043c\u0430\u0441\u0442\u0456",
		"spider:two-suits": "\u041f\u0430\u0432\u0443\u043a - \u0414\u0432\u0456 \u043c\u0430\u0441\u0442\u0456",
		"spider:four-suits": "\u041f\u0430\u0432\u0443\u043a - \u0427\u043e\u0442\u0438\u0440\u0438 \u043c\u0430\u0441\u0442\u0456",
		"forty-thieves": "Forty Thievies",
		"coming-soon": "coming soon",
		"difficulty-level": "\u0441\u043a\u043b\u0430\u0434\u043d\u0456\u0441\u0442\u044c",
		optionWindowTabScoringHeader: "\u0420\u0430\u0445\u0443\u043d\u043e\u043a",
		scoringStandardMode: "\u0421\u0442\u0430\u043d\u0434\u0430\u0440\u0442\u043d\u0438\u0439 \u043f\u0456\u0434\u0440\u0430\u0445\u0443\u043d\u043e\u043a",
		scoringTimedMode: "\u041d\u0430 \u0447\u0430\u0441",
		optionWindowTabSettingsHeader: "\u041d\u0430\u043b\u0430\u0448\u0442\u0443\u0432\u0430\u043d\u043d\u044f",
		"option.settings-sound-header": "\u0437\u0432\u0443\u043a\u0438:",
		"option.settings-sound-header-not-supported": "\u043d\u0435 \u043f\u0456\u0434\u0442\u0440\u0438\u043c\u0443\u0454\u0442\u044c\u0441\u044f \u0431\u0440\u0430\u0443\u0437\u0435\u0440\u043e\u043c",
		"option.settings-sound-pack-wood": "\u043f\u0430\u043a\u0435\u0442 - \u0434\u0435\u0440\u0435\u0432\u043e",
		"option.settings-sound-pack-plastic": "\u043f\u0430\u043a\u0435\u0442 - \u043f\u043b\u0430\u0441\u0442\u0438\u043a",
		"option.settings-sound-off": "\u041d\u0435 \u0433\u0440\u0430\u0439\u0442\u0435 \u0432 \u0431\u0443\u0434\u044c-\u044f\u043a\u0456 \u0437\u0432\u0443\u043a\u0438",
		optionWindowTabSettingsAutoHeader: "\u0410\u0432\u0442\u043e\u043c\u0430\u0442\u0438\u0447\u043d\u0438\u0439 \u0445\u0456\u0434:",
		optionWindowTabSettingsAutoFlip: "\u0410\u0432\u0442\u043e\u043c\u0430\u0442\u0438\u0447\u043d\u0430 \u0437\u0434\u0430\u0447\u0430 \u043a\u0430\u0440\u0442",
		optionWindowTabSettingsAutoMoveWhenWon: "\u0410\u0432\u0442\u043e\u043c\u0430\u0442\u0438\u0447\u043d\u0430 \u0433\u0440\u0430 \u043f\u0440\u0438 \u0432\u0438\u0433\u0440\u0430\u0448\u0456",
		optionWindowTabSettingsAutoMoveOff: "\u041d\u0435 \u0433\u0440\u0430\u0442\u0438 \u0430\u0432\u0442\u043e\u043c\u0430\u0442\u0438\u0447\u043d\u043e",
		optionWindowTabSettingsControlHeader: "\u0423\u043f\u0440\u0430\u0432\u043b\u0456\u043d\u043d\u044f:",
		optionWindowTabSettingsControlTime: "\u041f\u043e\u043a\u0430\u0437\u0443\u0432\u0430\u0442\u0438 \u0442\u0430\u0439\u043c\u0435\u0440",
		optionWindowTabSettingsControlScores: "\u041f\u043e\u043a\u0430\u0437\u0443\u0432\u0430\u0442\u0438 \u0440\u0430\u0445\u0443\u043d\u043e\u043a",
		optionWindowTabSettingsControlMoves: "\u041f\u043e\u043a\u0430\u0437\u0443\u0432\u0430\u0442\u0438 \u0437\u0440\u043e\u0431\u043b\u0435\u043d\u0456 \u0445\u043e\u0434\u0438",
		optionWindowTabLanguageHeader: "\u041c\u043e\u0432\u0430",
		optionWindowTabSettingsLangLabel: "You have changed the language to <b>{lang}</b> to show changes it is required to refresh page. Do you want to do it now?.",
		optionSkinHeader: "\u0422\u0435\u043c\u0438",
		optionSkinTabThemeHeader: "\u0422\u0435\u043c\u0438",
		optionSkinTabCardHeader: "\u041f\u0435\u0440\u0435\u0434\u043e\u0432\u0456 \u043d\u0430\u043b\u0430\u0448\u0442\u0443\u0432\u0430\u043d\u043d\u044f",
		optionWindowSelectedSkinItem: " (\u0432\u0438\u0431\u0440\u0430\u043d\u0438\u0439)",
		optionWindowChangedThemeSkinItem: " \u0432\u0456\u0434\u043d\u043e\u0432\u043b\u0435\u043d\u043d\u044f \u0442\u0435\u043c\u0443",
		winHeader: "\u0456\u0433\u0440\u043e\u0432\u0438\u0439 \u0441\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043a\u043e\u044e",
		winGameTypeHead: "\u0433\u0440\u0430:",
		"win.klondike:turn-one": "\u041a\u043b\u043e\u043d\u0434\u0430\u0439\u043a 1",
		"win.klondike:turn-three": "\u041a\u043b\u043e\u043d\u0434\u0430\u0439\u043a 3",
		"win.double-klondike:turn-one": "2 \u041a\u043b\u043e\u043d\u0434\u0430\u0439\u043a 1",
		"win.double-klondike:turn-three": "2 \u041a\u043b\u043e\u043d\u0434\u0430\u0439\u043a 3",
		"win.spider:one-suit": "\u041f\u0430\u0432\u0443\u043a 1",
		"win.spider:two-suits": "\u041f\u0430\u0432\u0443\u043a 2",
		"win.spider:four-suits": "\u041f\u0430\u0432\u0443\u043a 4",
		"win.forty-thieves": "Forty Thieves",
		winScoringSystemHead: "\u0441\u0438\u0441\u0442\u0435\u043c\u0430 \u0431\u0430\u043b\u0456\u0432:",
		winScoringSystemStandard: "\u0441\u0442\u0430\u043d\u0434\u0430\u0440\u0442",
		winScoringSystemTimed: "\u043f\u0440\u0438\u0443\u0440\u043e\u0447\u0435\u043d\u0438\u0439",
		winMovesHead: "\u0437\u0440\u043e\u0431\u043b\u0435\u043d\u0438\u0445 \u0445\u043e\u0434\u0456\u0432:",
		winTimeHead: "\u0427\u0430\u0441:",
		winBonusHead: "\u0431\u043e\u043d\u0443\u0441:",
		winScoresHead: "\u0420\u0430\u0445\u0443\u043d\u043e\u043a:",
		winBestScoresHead: "\u043a\u0440\u0430\u0449\u0438\u0439 \u0440\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442:",
		winRedealButton: "\u041f\u043e\u0432\u0442\u043e\u0440\u0438\u0442\u0438 \u0433\u0440\u0443",
		winNewGameButton: "\u041d\u043e\u0432\u0430 \u0433\u0440\u0430",
		pauseHeader: "\u043f\u0430\u0443\u0437\u0430",
		pauseContent: "\u041f\u0435\u0440\u0435\u0440\u0432\u0430 \u0432 \u0433\u0440\u0456<br/>...",
		pauseButtonResume: "\u0440\u0435\u0437\u044e\u043c\u0435",
		cancel: "\u0441\u043a\u0430\u0441\u0443\u0432\u0430\u0442\u0438"
	}
}).call(Solitaire);
(function () {
	this.Language = this.Language || {};
	this.Language.vi = {
		menuButton: "B\u1ea3ng \u0110i\u1ec1u Khi\u1ec3n",
		menuNewGameButton: "Tr\u00f2 Ch\u01a1i M\u1edbi",
		menuRestartGameButton: "Ch\u01a1i L\u1ea1i",
		menuSelectGameButton: "Ch\u1ecdn tr\u00f2 ch\u01a1i",
		menuOptionButton: "L\u1ef1a Ch\u1ecdn",
		menuSkinButton: "Giao Di\u1ec7n",
		menuInfoButton: '<img src="' + SS + 'images/info.png" alt="" />',
		menuUndo: '<img src="' + SS + 'images/undo.png" alt="">&nbsp;&nbsp;Quay L\u1ea1i',
		labelTime: "Th\u1eddi Gian: {var}",
		labelScore: "\u0110i\u1ec3m: {var}",
		labelMoves: "L\u1ea7n \u0110i B\u00e0i: {var}",
		"game.play": "Ch\u01a1i",
		"game.show-on-startup": "Hi\u1ec3n th\u1ecb khi kh\u1edfi \u0111\u1ed9ng",
		optionWindowHeader: "L\u1ef1a Ch\u1ecdn",
		optionWindowTabGameHeader: "Ki\u1ec3u Ch\u01a1i",
		"klondike:turn-one": "Solitaire - M\u1ed9t L\u00e1",
		"klondike:turn-three": "Solitaire - Ba L\u00e1",
		"double-klondike:turn-one": "2 x Solitaire - M\u1ed9t L\u00e1",
		"double-klondike:turn-three": "2 x Solitaire - Ba L\u00e1",
		"spider:one-suit": "T\u00e1m B\u1ed9 (B\u00e0i Nh\u1ec7n) - \u0110\u1ed3ng Ch\u1ea5t",
		"spider:two-suits": "T\u00e1m B\u1ed9 (B\u00e0i Nh\u1ec7n) - Hai Ch\u1ea5t",
		"spider:four-suits": "T\u00e1m B\u1ed9 (B\u00e0i Nh\u1ec7n)  - B\u1ed1n Ch\u1ea5t",
		"forty-thieves": "Forty Thievies",
		"coming-soon": "coming soon",
		"difficulty-level": "kh\u00f3 kh\u0103n",
		optionWindowTabScoringHeader: "Ch\u1ebf \u0110\u1ed9 T\u00ednh \u0110i\u1ec3m",
		scoringStandardMode: "Ki\u1ec3u Ti\u00eau Chu\u1ea9n",
		scoringTimedMode: "Kh\u00f4ng X\u00e9t Th\u1eddi Gian",
		optionWindowTabSettingsHeader: "L\u1ef1a Chon Kh\u00e1c",
		"option.settings-sound-header": "\u00c2m Thanh:",
		"option.settings-sound-header-not-supported": "not supported by your browser",
		"option.settings-sound-pack-wood": "Gi\u1ea3 G\u1ed7",
		"option.settings-sound-pack-plastic": "Gi\u1ea3 Nh\u1ef1a",
		"option.settings-sound-off": "T\u1eaft \u00c2m Thanh",
		optionWindowTabSettingsAutoHeader: "T\u1ef1 \u0110\u1ed9ng:",
		optionWindowTabSettingsAutoFlip: "T\u1ef1 \u0110\u1ed9ng L\u1eadt B\u00e0i",
		optionWindowTabSettingsAutoMoveWhenWon: "T\u1ef1 \u0110\u1ed9ng L\u00ean B\u1ed9 Khi \u0110\u00e3 Th\u1eafng",
		optionWindowTabSettingsAutoMoveOff: "T\u1eaft T\u1ef1 \u0110\u1ed9ng",
		optionWindowTabSettingsControlHeader: "\u0110i\u1ec1u Khi\u1ec3n:",
		optionWindowTabSettingsControlTime: "Hi\u1ec7n Th\u1eddi Gian",
		optionWindowTabSettingsControlScores: "Hi\u1ec7n \u0110i\u1ec3m \u0110\u00e3 \u0110\u01b0\u1ee3c",
		optionWindowTabSettingsControlMoves: "Hi\u1ec7n L\u1ea7n \u0110i B\u00e0i",
		optionWindowTabLanguageHeader: "Ng\u00f4n Ng\u1eef",
		optionWindowTabSettingsLangLabel: "You have changed the language to <b>{lang}</b> to show changes it is required to refresh page. Do you want to do it now?.",
		optionSkinHeader: "Giao Di\u1ec7n",
		optionSkinTabThemeHeader: "Giao Di\u1ec7n",
		optionSkinTabCardHeader: "N\u00e2ng Cao",
		optionWindowSelectedSkinItem: " (cho\u0323n)",
		optionWindowChangedThemeSkinItem: " kh\u00f4i ph\u1ee5c l\u1ea1i ch\u1ee7 \u0111\u1ec1",
		winHeader: "Th\u1ed1ng k\u00ea",
		winGameTypeHead: "Ki\u1ec3u Ch\u01a1i:",
		"win.klondike:turn-one": "Solitaire 1",
		"win.klondike:turn-three": "Solitaire 3",
		"win.double-klondike:turn-one": "2 x Solitaire 1",
		"win.double-klondike:turn-three": "2 x Solitaire 3",
		"win.spider:one-suit": "T\u00e1m B\u1ed9 (B\u00e0i Nh\u1ec7n) 1",
		"win.spider:two-suits": "T\u00e1m B\u1ed9 (B\u00e0i Nh\u1ec7n) 2",
		"win.spider:four-suits": "T\u00e1m B\u1ed9 (B\u00e0i Nh\u1ec7n) 4",
		"win.forty-thieves": "Forty Thieves",
		winScoringSystemHead: "Ch\u1ebf \u0110\u1ed9 T\u00ednh \u0110i\u1ec3m:",
		winScoringSystemStandard: "Ki\u1ec3u Ti\u00eau Chu\u1ea9n",
		winScoringSystemTimed: "Kh\u00f4ng X\u00e9t Th\u1eddi Gian",
		winMovesHead: "L\u1ea7n \u0110i B\u00e0i:",
		winTimeHead: "Th\u1eddi Gian:",
		winBonusHead: "ti\u1ec1n th\u01b0\u1edfng:",
		winScoresHead: "\u0110i\u1ec3m:",
		winBestScoresHead: "T\u1ed1t nh\u1ea5t s\u1ed1 \u0111i\u1ec3m:",
		winRedealButton: "Ch\u01a1i L\u1ea1i",
		winNewGameButton: "Tr\u00f2 Ch\u01a1i M\u1edbi",
		pauseHeader: "T\u1ea1m d\u1eebng",
		pauseContent: "Ph\u00e1 v\u1ee1 trong tr\u00f2 ch\u01a1i<br/>...",
		pauseButtonResume: "ti\u1ebfp t\u1ee5c",
		cancel: "h\u1ee7y b\u1ecf"
	}
}).call(Solitaire);
(function () {
	this.Language = this.Language || {};
	this.Language["zh-cn"] = {
		menuButton: "\u83dc\u5355",
		menuNewGameButton: "\u65b0\u6e38\u620f",
		menuRestartGameButton: "\u91cd\u65b0\u5f00\u59cb",
		menuSelectGameButton: "\u9009\u62e9\u6e38\u620f",
		menuOptionButton: "\u8bbe\u7f6e",
		menuSkinButton: "\u4e3b\u9898",
		menuInfoButton: '<img src="' + SS + 'images/info.png" alt="" />',
		menuUndo: '<img src="' + SS + 'images/undo.png" alt="">&nbsp;&nbsp;\u64a4\u9500',
		labelTime: "\u65f6\u95f4: {var}",
		labelScore: "\u5f97\u5206: {var}",
		labelMoves: "\u64cd\u4f5c\u6570: {var}",
		"game.play": "\u73a9",
		"game.show-on-startup": "\u5728\u542f\u52a8\u65f6\u663e\u793a",
		optionWindowHeader: "\u8bbe\u7f6e",
		optionWindowTabGameHeader: "\u6e38\u620f",
		"klondike:turn-one": "\u7eb8\u724c-\u7ffb\u4e00\u5f20",
		"klondike:turn-three": "\u7eb8\u724c-\u7ffb\u4e09\u5f20",
		"double-klondike:turn-one": "\u53cc \u7eb8\u724c-\u7ffb\u4e00\u5f20",
		"double-klondike:turn-three": "\u53cc \u7eb8\u724c-\u7ffb\u4e09\u5f20",
		"spider:one-suit": "\u8718\u86db - \u897f\u88c5",
		"spider:two-suits": "\u8718\u86db - \u897f\u670d",
		"spider:four-suits": "\u8718\u86db - \u56db\u4e2a\u897f\u88c5\u3002",
		"forty-thieves": "Forty Thievies",
		"coming-soon": "\u5373\u5c06\u63a8\u51fa\u3002",
		"difficulty-level": "\u56f0\u96be",
		optionWindowTabScoringHeader: "\u8ba1\u5206",
		scoringStandardMode: "\u6807\u51c6\u8ba1\u5206\u7cfb\u7edf",
		scoringTimedMode: "\u65f6\u95f4\u8ba1\u5206\u7cfb\u7edf",
		optionWindowTabSettingsHeader: "\u8bbe\u7f6e",
		"option.settings-sound-header": "\u58f0\u97f3:",
		"option.settings-sound-header-not-supported": "\u60a8\u7684\u6d4f\u89c8\u5668\u4e0d\u652f\u6301",
		"option.settings-sound-pack-wood": "\u5305 - \u6728",
		"option.settings-sound-pack-plastic": "\u5305 - \u5851\u6599",
		"option.settings-sound-off": "\u4e0d\u64ad\u653e\u4efb\u4f55\u58f0\u97f3",
		optionWindowTabSettingsAutoHeader: "\u81ea\u52a8\u8bbe\u7f6e:",
		optionWindowTabSettingsAutoFlip: "\u81ea\u52a8\u7ffb\u8f6c\u6251\u514b",
		optionWindowTabSettingsAutoMoveWhenWon: "\u5141\u8bb8\u81ea\u52a8\u5b8c\u6210\u6e38\u620f",
		optionWindowTabSettingsAutoMoveOff: "\u4e0d\u5141\u8bb8\u81ea\u52a8\u5b8c\u6210\u6e38\u620f",
		optionWindowTabSettingsControlHeader: "\u63a7\u5236\u8bbe\u7f6e:",
		optionWindowTabSettingsControlTime: "\u663e\u793a\u8ba1\u65f6\u5668",
		optionWindowTabSettingsControlScores: "\u663e\u793a\u5f97\u5206",
		optionWindowTabSettingsControlMoves: "\u663e\u793a\u64cd\u4f5c\u6570",
		optionWindowTabLanguageHeader: "\u8bed\u8a00",
		optionWindowTabSettingsLangLabel: "You have changed the language to <b>{lang}</b> to show changes it is required to refresh page. Do you want to do it now?.",
		optionSkinHeader: "\u4e3b\u9898",
		optionSkinTabThemeHeader: "\u4e3b\u9898",
		optionSkinTabCardHeader: "\u9ad8\u7ea7",
		optionWindowSelectedSkinItem: " (\u9009\u5b9a)",
		optionWindowChangedThemeSkinItem: " \u6062\u590d\u7684\u4e3b\u9898",
		winHeader: "\u6e38\u620f\u72b6\u6001",
		winGameTypeHead: "\u6e38\u620f:",
		"win.klondike:turn-one": "\u7eb8\u724c-\u7ffb\u4e00\u5f20",
		"win.klondike:turn-three": "\u7eb8\u724c-\u7ffb\u4e00\u5f203",
		"win.double-klondike:turn-one": "\u53cc \u7eb8\u724c-\u7ffb\u4e00\u5f20",
		"win.double-klondike:turn-three": "\u53cc \u7eb8\u724c-\u7ffb\u4e00\u5f203",
		"win.spider:one-suit": "\u8718\u86db 1",
		"win.spider:two-suits": "\u8718\u86db 2",
		"win.spider:four-suits": "\u8718\u86db 4",
		"win.forty-thieves": "Forty Thieves",
		winScoringSystemHead: "\u8bc4\u5206\u7cfb\u7edf:",
		winScoringSystemStandard: "\u6807\u51c6\u8ba1\u5206\u7cfb\u7edf",
		winScoringSystemTimed: "\u65f6\u95f4\u8ba1\u5206\u7cfb\u7edf",
		winMovesHead: "\u79fb\u52a8\u4f5c\u51fa:",
		winTimeHead: "\u6e38\u620f\u65f6\u95f4:",
		winBonusHead: "\u5956\u91d1:",
		winScoresHead: "\u8bc4\u5206:",
		winBestScoresHead: "\u6700\u597d\u6210\u7ee9:",
		winRedealButton: "\u91cd\u65b0\u5f00\u59cb",
		winNewGameButton: "\u65b0\u6e38\u620f",
		pauseHeader: "\u6682\u505c",
		pauseContent: "\u5728\u6bd4\u8d5b\u4e2d\u65ad<br/>...",
		pauseButtonResume: "\u6062\u590d",
		cancel: "\u53d6\u6d88"
	}
}).call(Solitaire);
(function () {
	this.Language = this.Language || {};
	var a = {
		optionWindowTabSettingsLangAr: "Arabic - \u0639\u0631\u0628\u064a",
		optionWindowTabSettingsLangBg: "Bulgarian - \u0411\u044a\u043b\u0433\u0430\u0440\u0441\u043a\u0438",
		optionWindowTabSettingsLangBs: "Bosnian - Bosanski",
		optionWindowTabSettingsLangCa: "Catalan - catal\u00e0",
		optionWindowTabSettingsLangCs: "Czech - \u010ce\u0161tina",
		optionWindowTabSettingsLangCy: "Welsh - Cymraeg",
		optionWindowTabSettingsLangDa: "Danish - Dansk",
		optionWindowTabSettingsLangDe: "German - Deutsch",
		optionWindowTabSettingsLangEl: "Greek - \u0395\u03bb\u03bb\u03b7\u03bd\u03b9\u03ba\u03ac",
		optionWindowTabSettingsLangEnUs: "English (US) - English (US)",
		optionWindowTabSettingsLangEsEs: "Spanish (Spain) - Espa\u00f1ol (de Espa\u00f1a)",
		optionWindowTabSettingsLangEt: "Estonian - Eesti keel",
		optionWindowTabSettingsLangFi: "Finnish - Suomi",
		optionWindowTabSettingsLangFr: "French - Fran\u00e7ais",
		optionWindowTabSettingsLangGl: "Galician - Galego",
		optionWindowTabSettingsLangHe: "Hebrew - \u05e2\u05d1\u05e8\u05d9\u05ea",
		optionWindowTabSettingsLangHu: "Hungarian - Magyar",
		optionWindowTabSettingsLangIt: "Italian - Italiano",
		optionWindowTabSettingsLangJa: "Japanese - \u65e5\u672c\u8a9e",
		optionWindowTabSettingsLangKa: "Georgian - \u10e5\u10d0\u10e0\u10d7\u10e3\u10da\u10d8",
		optionWindowTabSettingsLangKo: "Korean - \ud55c\uad6d\uc5b4",
		optionWindowTabSettingsLangLv: "Lithuanian - lietuvi\u0173",
		optionWindowTabSettingsLangNl: "Dutch - Nederlands",
		optionWindowTabSettingsLangNnNo: "Norwegian (Nynorsk) - Norsk (Nynorsk)",
		optionWindowTabSettingsLangPl: "Polish - Polski",
		optionWindowTabSettingsLangPtBr: "Portuguese (Brazilian) - Portugu\u00eas (do Brasil)",
		optionWindowTabSettingsLangRo: "Romanian - rom\u00e2n\u0103",
		optionWindowTabSettingsLangRu: "Russian - \u0420\u0443\u0441\u0441\u043a\u0438\u0439",
		optionWindowTabSettingsLangSl: "Slovenian - Sloven\u0161\u010dina",
		optionWindowTabSettingsLangSr: "Serbian - \u0421\u0440\u043f\u0441\u043a\u0438",
		optionWindowTabSettingsLangSvSe: "Swedish - Svenska",
		optionWindowTabSettingsLangTr: "Turkish - T\u00fcrk\u00e7e",
		optionWindowTabSettingsLangUk: "Ukrainian - \u0423\u043a\u0440\u0430\u0457\u043d\u0441\u044c\u043a\u0430",
		optionWindowTabSettingsLangVi: "Vietnamese - Ti\u1ebfng Vi\u1ec7t",
		optionWindowTabSettingsLangZhCn: "Chinese (Simplified) - \u4e2d\u6587 (\u7b80\u4f53)",
		menuAuth: '<img src="' + SS + 'images/flags/unknown.png" alt="">&nbsp;&nbsp;Login',
		menuAuthLogged: '<img src="{flag_src}" alt="">&nbsp;&nbsp;Hello {player_name}!',
		"auth.login-header": "Login",
		"auth.register-header": "Register",
		"auth.info-header": "Player info",
		"auth.label-player-name": "Player nickname: ",
		"auth.placeholder-player-name": "Type player nickname here",
		"auth.label-password": "Password: ",
		"auth.placeholder-password": "Type password here",
		"auth.register-button": "Register",
		"auth.login-button": "Login",
		"auth.register-link-form": "Go to register form",
		"auth.login-link-form": "Go to login form",
		"auth.logout-link": "Logout",
		"auth.login-desc": 'Login as a player in <b>pasjans-online.pl</b> or if you don\'t have account yet register with link "Go to register form".',
		"auth.login-error": "Wrong data entered. Check login and/or password and try again.",
		"auth.register-desc": "Register your player name by registering in <b>pasjans-online.pl</b> you will get access to functionalities that only registered users have.",
		"auth.register-error": "Wrong data entered. Check login and/or password and try again.",
		"auth.valid-info": "In both inputs you can type min 3 and max 20 chars.",
		"auth.info-welcome": "Hello <b>{player_name}</b>!",
		"auth.info-created": "Account from: <b>{signup_time}</b>",
		"auth.info-last-login": "Last valid login: <b>{login_time}</b>",
		"auth.info-country": 'Player country: <b>{country_name}</b> / <img src="{flag_src}" alt="">',
		"win.share-score": "Share your score",
		"win.share-title": "I just arranged solitaire - {game_type}",
		"win.share-description": "It took me {time} seconds, it required {moves} moves and it gave me {score} points :) Check it!",
		infoHeader: "Info",
		infoTabContactHeader: "Contact",
		infoTabChangeLogHeader: "Changelog",
		infoTabPartnersHeader: "Partners",
		infoTabContactLabel: "Do you have any suggestions? Did you found any bugs? Feel free to write to us.",
		infoTabContactMessagePlaceholder: "Type here your question or bug.",
		infoTabContactEmailPlaceholder: "Type your email if you're looking for answer to your question.",
		infoTabContactSubmit: "Send",
		infoTabContactSending: "Sending ...",
		infoTabContactSent: "Message has been sent.",
		infoTabContactBack: "Back",
		infoTabContactChromeApp: "See offline Solitaire version addon on: ",
		infoTabChangeLogItems: {
			"25-04-2012 (v. 1.3.9)": "Ability to register player name was added. It is a first step to collect stats as a next game functionality.",
			"06-04-2012 (v. 1.3.8.5)": "Abillity to share your score in Solitaire was added. It can be done by Facebook, Google Plus or Twitter.",
			"31-03-2012 (v. 1.3.8.4)": "Fixed undo in forty thieves.",
			"26-03-2012 (v. 1.3.8.3)": "Fixed a couple of bugs.",
			"22-03-2012 (v. 1.3.8.2)": "'Modern' theme background was fixed for higher resolutions. Language change option now has better funcionality.",
			"19-03-2012 (v. 1.3.8.1)": "New window was added and it is shown on every entrance that shows you Solitaire games choice.",
			"14-03-2012 (v. 1.3.8.0)": "Fixed 'no sounds' bug in online version of game. Unfortunetly in chrome app version to play sounds user must manualy add protocol 'chrome-extension:' in this site http://goo.gl/RL9cE. Bug will be fixed probably in chrome version 18 or 19.",
			"07-03-2012 (v. 1.3.7.9)": "Good news for estonians, romanians and danes - 3 new languages was added.",
			"05-03-2012 (v. 1.3.7.7)": "Added new theme 'Modern' made by <b><a href='http://twitter.com/johnkappa'>@johnkappa</a></b> (thanks!) and temporarily sound is off in chrome browser.",
			"01-03-2012 (v. 1.3.7.6)": "Founded and fixed timed scoring system (it should take 2 points each 10 seconds from score) and added maximum score of each game (you can find it in left bottom interjection icon).",
			"28-02-2012 (v. 1.3.7.5)": "Few bugs were fixed - no reaction for clicking on deck (occurred at several resolutions), japanese translation is fixed and Ace of Club (in pattern dark theme) has it's correct symbol (not black heart any more).",
			"19-02-2012 (v. 1.3.7.4)": "Fixed critical bug - Infinity loop (crash browser) when last flipped card is Ace.",
			"17-02-2012 (v. 1.3.7.3)": "Added 8 new languages and fixed bug related with Jack of Spades card.",
			"09-02-2012 (v. 1.3.7.2)": "Game pause shortcut was added at the left down corner.",
			"05-02-2012 (v. 1.3.7.1)": "Ups! At the Forty Thieves Solitaire there were 9 piles and there have to be 10. <br />It's fixed :)",
			"02-02-2012 (v. 1.3.7)": "Added new game 'Forty Thieves' and turn on/off game sounds button (down left corner)",
			"02-01-2012 (v. 1.3.6.4)": "Removed christmas widget and added two new languages: Arabic and Lithuanian.",
			"21-12-2011 (v. 1.3.6.3)": "Added christmas widget. Merry Christmas! :)",
			"16-11-2011 (v. 1.3.6)": "'Strips blue' theme was added. We have two new languages and 'missing card' bug was fixed.",
			"02-11-2011 (v. 1.3.3)": "Double Klondike was added, new languages (french, korean, swedish, ukrainian) and some bugs were fixed.",
			"24-10-2011 (v. 1.3)": "Full version of Spider Solitaire was added, new sound options and alert window with new important changes.",
			"17-10-2011 (v. 1.2)": "Code has hosted new solitaire - Spider (one color - for now), norwegian language was added and few bugs were fixed.",
			"07-09-2011 (v. 1.1.6)": "We added possibility to play in Solitaire on mobile devices, tablets with resolution 300px and greater. Spanish language was added and few bugs were fixed.",
			"03-08-2011 (v. 1.1.5.5)": "more... and more... languages was added. <b>Big Thanks!</b> for all anonymous people who send me their own language translations.",
			"29-07-2011 (v. 1.1.5.4)": "New languages was added: dutch, german, turkish, etc. ",
			"30-06-2011 (v. 1.1.5.3)": "Pausing Game option was added ('P' button) and Google +1 :)",
			"29-05-2011 (v. 1.1.5.2)": 'The new theme "Honeycomb" was added.',
			"24-05-2011 (v. 1.1.5)": "-&nbsp;We added pop up window with game stats at the end of every deal; <br/> -&nbsp;New score system was added - timed score. You can choose timed or standard score system at settings window.",
			"10-05-2011 (v. 1.1.4)": "-&nbsp;Scoring, time and moves counting system was added; <br/> -&nbsp;Old bug was fixed acording to moving king from tableau section.",
			"02-05-2011 (v. 1.1.3)": "Fixed a bug related to the relocation of aces on the top of the field and fixed some other minor issues.",
			"20-04-2011 (v. 1.1.2)": "Removed some bugs.",
			"19-04-2011 (v. 1.1.1)": "Fixed bugs related to incorrectly appear cards in stock.",
			"12-04-2011 (v. 1.1.0)": "-&nbsp;'Pattern dark' theme and 'Animals' card pattern were added; <br/> -&nbsp;Option Unlimited undo (CTRL + Z); <br/> -&nbsp;Retry option for starting new game with same cards. <br/> -&nbsp;Double LMB click now can be used by RMB.",
			"03-04-2011 (v. 1.0.4)": 'The new theme "Saloon" was added.',
			"16-02-2011 (v. 1.0.3)": "Improving the appearance of backgrounds for high screen resolution.",
			"09-02-2011 (v. 1.0.2)": "We added info button where you can easily write to us and see latest site changes.",
			"05-02-2011 (v. 1.0.1)": "From now on you can take back all cards from Ace sections.",
			"01-01-2011 (v. 1.0.0)": "First relase."
		},
		"whatsNew.header": "What's new",
		"whatsNew.content": "Ability to register player name was added. Every created account gets access to new funcionalities that will appear in the game.",
		"rules.content.klondike:turn-one": "You have 52 cards at deck. There's no Jokers. There are 4 foundations and 7 tableau piles. There is one face-up card at the left top pile and you can move only this one card at once. Cards in foundation are build up by suit from Ace to King. Ace is the lowest card in the game. You can combine colors by building down a tableau pile. An empty pile (without any card) can by placed only by a King or cards ending with king. Goal is to place all the cards in the foundation. <br /><br />From all solitaire games this one's most popular it has even 90% chance of winning. In standard score counting maximum score value is 760 points. <br /><br /><a target='_blank' href='http://wikipedia.org/wiki/Klondike_(solitaire)'>more...</a><br />",
		"rules.content.klondike:turn-three": "You have 52 cards at deck. There's no Jokers. There are 4 foundations and 7 tableau piles. There are three face-up cards at the left top pile but you can move only one at the top. Cards in foundation are build up by suit from Ace to King. Ace is the lowest card in the game. You can combine colors by building down a tableau pile. An empty pile (without any card) can by placed only by a King or cards ending with king. Goal is to place all the cards in the foundation. <br /><br />From all solitaire games this one's most popular it has even 90% chance of winning. In standard score counting maximum score value is 760 points. <br /><br /><a target='_blank' href='http://wikipedia.org/wiki/Klondike_(solitaire)'>more...</a><br />",
		"rules.content.double-klondike:turn-one": "You have 104 cards at deck. There's no Jokers. There are 4 foundations and 9 tableau piles. There is one face-up card at the left top pile and you can move only this one card at once.Cards in foundation are build up by suit from Ace to King. Ace is the lowest card in the game.You can combine colors by building down a tableau pile. An empty pile (without any card) can by placed only by a King or cards ending with king. Goal is to place all the cards in the foundation. <br /><br />From all solitaire games this one's most popular it has even 90% chance of winning. In standard score counting maximum score value is 1520 points. <br /><br /><a target='_blank' href='http://wikipedia.org/wiki/Double_Klondike'>more...</a><br />",
		"rules.content.double-klondike:turn-three": "You have 104 cards at deck. There's no Jokers. There are 4 foundations and 9 tableau piles. There are three face-up cards at the left top pile but you can move only one at the top.Cards in foundation are build up by suit from Ace to King. Ace is the lowest card in the game.You can combine colors by building down a tableau pile. An empty pile (without any card) can by placed only by a King or cards ending with king. Goal is to place all the cards in the foundation. <br /><br />From all solitaire games this one's most popular it has even 90% chance of winning. In standard score counting maximum score value is 1520 points. <br /><br /><a target='_blank' href='http://wikipedia.org/wiki/Double_Klondike'>more...</a><br />",
		"rules.content.spider:one-suit": "There are 104 cards at the table. There is only one (random) color. You have ten tableau and 8 foundations. All cards (except first one from a pile) is face-down and can't be moved. Cards have to be placed from Ace to King. Ace has the smallest value. You can move every card or empty tableau. Game ends when all cards are at foundation. <br /><br />One of the most popular Solitaires than can give you a lot of fun. In standard score counting maximum score value is 515 points. <br /><br /><a target='_blank' href='http://wikipedia.org/wiki/Spider_solitaire'>more...</a><br />",
		"rules.content.spider:two-suits": "There are 104 cards at the table. There is only two (random) color. You have ten tableau and 8 foundations. All cards (except first one from a pile) is face-down and can't be moved. Cards have to be placed from Ace to King. Ace has the smallest value. You can move every card or empty tableau. Game ends when all cards are at foundation. <br /><br />One of the most popular Solitaires than can give you a lot of fun. In standard score counting maximum score value is 515 points. <br /><br /><a target='_blank' href='http://wikipedia.org/wiki/Spider_solitaire'>more...</a><br />",
		"rules.content.spider:four-suits": "There are 104 cards at the table. There are all colors. You have ten tableau and 8 foundations. All cards (except first one from a pile) is face-down and can't be moved. Cards have to be placed from Ace to King. Ace has the smallest. You can move every card or empty tableau. Game ends when all cards are at foundation. <br /><br />One of the most popular Solitaires than can give you a lot of fun. In standard score counting maximum score value is 515 points. <br /><br /><a target='_blank' href='http://wikipedia.org/wiki/Spider_solitaire'>more...</a><br />",
		"rules.content.forty-thieves": "There are 104 cards from 2 decks and 10 tableau. You have 8 foundation piles. Difficulty of this game is bigger cause you can move only the top card from any tableau, but you can place any card on empty tableau. You can built a suit from Ace to King. You may go thought the left top stock only once so try to remember all the cards that were before. <br /><br />Most difficult solitaire of all. Hint: Try to make a empty tableau as soon as possible. In standard score counting maximum score value about 1550 points. <br /><br /><a target='_blank' href='http://wikipedia.org/wiki/Forty_Thieves_(card_game)'>more...</a><br />"
	};
	this.Lang = {
		data: {},
		_code: null,
		init: function (b) {
			this.setLanguage(b)
		},
		setLanguage: function (b) {
			this._code = b;
			this.data = Object.merge(a, Solitaire.Language[b])
		},
		getLanguageCode: function () {
			return this._lang
		},
		getLanguageName: function (b) {
			b = b ? b : this._code;
			if (b == "pl-pl") b = "pl";
			b = b.camelCase().ucFirst();
			return Solitaire.Lang.getString("optionWindowTabSettingsLang" + b)
		},
		getString: function (b, d) {
			return this.data[b] || d || ""
		},
		exists: function (b) {
			return Solitaire.Language[b] !== undefined
		}
	};
	this.Lang.init()
}).call(Solitaire);
(function () {
	this.Control = this.Control || {};
	this.Control.Abstract = new Class({
		Implements: [Events, Options],
		Binds: [],
		element: "",
		options: {},
		initialize: function (a) {
			this.setOptions(a);
			this.element = $(this.element)
		},
		update: function (a) {
			this.element.innerHTML = a
		},
		reset: function () {
			this.update("")
		},
		getElement: function () {
			return this.element
		}
	})
}).call(Solitaire);
(function () {
	this.Control.Auth = new Class({
		Extends: this.Control.Abstract,
		element: "game_action_auth",
		login: function (a) {
			this.update(Solitaire.Lang.getString("menuAuthLogged").substitute(a))
		},
		logout: function () {
			this.reset()
		},
		reset: function () {
			this.getElement().get("html") != Solitaire.Lang.getString("menuAuth") && this.update(Solitaire.Lang.getString("menuAuth"))
		}
	})
}).call(Solitaire);
(function () {
	this.Control.Moves = new Class({
		Extends: this.Control.Abstract,
		Binds: ["increase", "decrease"],
		element: "label_moves",
		moves: 0,
		maxMoves: 999,
		getMoves: function () {
			return this.moves
		},
		increase: function () {
			if (!(this.moves >= this.maxMoves)) {
				this.moves++;
				this.update();
				this.fireEvent("movementsChange", [this.moves])
			}
		},
		decrease: function () {
			if (!(this.moves <= 0)) {
				this.moves--;
				this.update();
				this.fireEvent("movementsChange", [this.moves])
			}
		},
		reset: function () {
			this.moves = 0;
			this.update();
			this.fireEvent("movementsChange", [this.moves])
		},
		update: function () {
			this.parent(Solitaire.Lang.getString("labelMoves").substitute({
				"var": this.moves
			}))
		}
	})
}).call(Solitaire);
(function () {
	this.Control.Score = new Class({
		Extends: this.Control.Abstract,
		Binds: ["increase", "decrease", "onTimeTick"],
		element: "label_score",
		types: {
			standard: {
				waste_to_tableau: 5,
				waste_to_foundation: 10,
				tableau_to_foundation: 10,
				tableau_to_tableau: 5,
				foundation_to_tableau: -15
			},
			timed: {
				waste_to_tableau: 5,
				waste_to_foundation: 10,
				tableau_to_foundation: 10,
				tableau_to_tableau: 5,
				foundation_to_tableau: -15,
				decrease_every_tick: 2,
				every: 10,
				bonus: 1
			}
		},
		score: 0,
		maxScore: 9999,
		type: "",
		initialize: function (a) {
			this.type = a;
			this.parent()
		},
		setType: function (a) {
			this.type = a
		},
		getScores: function () {
			return this.score
		},
		setScores: function (a) {
			this.score = a;
			this._updateScore();
			this.fireEvent("scoreChange", [this.score])
		},
		increase: function (a) {
			this.score += this.types[this.type][a];
			if (this.score >= this.maxScore) this.score = this.maxScore;
			this._updateScore();
			this.fireEvent("scoreChange", [this.score])
		},
		decrease: function (a) {
			this.score -= this.types[this.type][a];
			if (this.score <= -this.maxScore) this.score = this.maxScore;
			this._updateScore();
			this.fireEvent("scoreChange", [this.score])
		},
		onTimeTick: function (a) {
			this.type == "timed" && a % this.types[this.type].every === 0 && a > 0 && this.decrease("decrease_every_tick")
		},
		reset: function () {
			this.score = 0;
			this._updateScore();
			this.fireEvent("scoreChange", [this.score])
		},
		_updateScore: function () {
			this.update(Solitaire.Lang.getString("labelScore").substitute({
				"var": this.score
			}))
		}
	})
}).call(Solitaire);
(function () {
	this.Control.Time = new Class({
		Extends: this.Control.Abstract,
		element: "label_time",
		_timer: null,
		_time: 0,
		getTime: function () {
			return this._time
		},
		start: function (a) {
			this.stop(a);
			this._timer = function () {
				this._time++;
				if (!(this._time > 3600)) {
					var b = this._time.toTime();
					this.update(Solitaire.Lang.getString("labelTime").substitute({
						"var": b.min + ":" + b.sec
					}));
					this.fireEvent("timeTick", [this._time])
				}
			}.periodical(1E3, this)
		},
		stop: function (a) {
			a && this.reset();
			clearInterval(this._timer);
			this._timer = null
		},
		reset: function () {
			this._time =
			0;
			this.update(Solitaire.Lang.getString("labelTime").substitute({
				"var": "00:00"
			}))
		}
	})
}).call(Solitaire);
(function () {
	this.Control.Undo = new Class({
		Extends: this.Control.Abstract,
		element: "game_action_undo",
		items: [],
		add: function (a, b) {
			this.items.push({
				type: a,
				data: b
			});
			this.element.hasClass("inactive") && this.element.removeClass("inactive");
			return this
		},
		get: function (a) {
			var b = this.items[this.items.length - 1];
			if (a === undefined || a === true) {
				delete this.items[this.items.length - 1];
				this.items = this.items.clean()
			}
			this.hasItems() || this.element.addClass("inactive");
			return b
		},
		getNearby: function (a) {
			var b;
			for (b = this.items.length - 1; b >= 0; b--) if (this.items[b].type == a) return this.items[b];
			return null
		},
		hasItems: function (a) {
			if (!a) return this.items.length ? true : false;
			return this.items.filter(function (b) {
				return b.type == a
			}).length ? true : false
		},
		reset: function () {
			this.items = [];
			this.element.addClass("inactive")
		}
	})
}).call(Solitaire);
(function () {
	this.Indicator = new Class({
		Implements: [Options],
		_timer: null,
		indicator: null,
		showed: false,
		options: {
			element: "ind_container",
			duration: 500,
			reaction_delay: 100
		},
		initialize: function (b) {
			this.setOptions(b)
		},
		show: function () {
			this._init();
			if (this._timer === null) {
				this._timer = function () {
					this.showed = true;
					this.indicator.start({
						top: 0
					})
				}.delay(this.options.reaction_delay, this);
				Browser.opera && this.hide.delay(3E3, this)
			}
		},
		hide: function () {
			this._init();
			this.showed &&
			function () {
				this.indicator.start({
					top: -(this.indicator.element.getHeight() + 20)
				})
			}.delay(1E3, this);
			clearTimeout(this._timer);
			this._timer = null;
			this.showed = false
		},
		_init: function () {
			if (!this.indicator) this.indicator = new Fx.Morph($(this.options.element), {
				duration: this.options.duration,
				link: "chain"
			})
		}
	});
	var a = new Solitaire.Indicator;
	Solitaire.Indicator = function () {
		return a
	}
}).call(Solitaire);
(function () {
	this.Layout = new Class({
		Implements: [Options, Events],
		Binds: ["onWindowResize"],
		options: {
			layoutType: "spider"
		},
		linkClassName: "dynamic_css",
		linkWideElementId: "wide_css",
		linkNaviWideClass: "navi_wide_css",
		contentId: "main",
		screenSizeMap: {
			320: {
				min: 0,
				max: 379
			},
			480: {
				min: 380,
				max: 559,
				wideMinHeight: 300
			},
			640: {
				min: 560,
				max: 719,
				wideMinHeight: 350
			},
			800: {
				min: 720,
				max: 959,
				wideMinHeight: 550
			},
			1024: {
				min: 960,
				max: 1099,
				wideMinHeight: 650
			},
			1280: {
				min: 1100,
				max: 9999,
				wideMinHeight: 650
			}
		},
		initialize: function (a) {
			Browser.isMobile && Asset.css(SS + "css/mobile.css");
			this.setOptions(a);
			this.content = $(this.contentId);
			this.initEvents();
			this.onWindowResize()
		},
		initEvents: function () {
			$(window).addEvent("orientationchange" in window ? "orientationchange" : "resize", this.onWindowResize);
			this.addEvent("screenHeightChange", function () {
				Browser.isMobile && setTimeout(function () {
					window.scrollTo(0, 1)
				}, 1E3)
			})
		},
		setGameType: function (a) {
			this.options.layoutType = a;
			this._lastWindowHeight = this._lastWindowWidth = null;
			this.onWindowResize()
		},
		getGameType: function () {
			return this.options.layoutType
		},
		isWide: function () {
			return this._isWide
		},
		onWindowResize: function () {
			var a = false,
				b = false;
			this._windowWidth = window.getWidth();
			this._windowHeight = window.getHeight();
			this._isWide = false;
			if (this._windowWidth != this._lastWindowWidth) {
				this._lastWindowWidth = this._windowWidth;
				a = true
			}
			if (this._windowHeight != this._lastWindowHeight) {
				this._lastWindowHeight = this._windowHeight;
				b = true
			}
			if (a) this._appendStyle() || this.fireEvent("screenWidthChange");
			if (b) {
				this.content.setStyle("height", this._windowHeight + (Browser.isMobile ? 50 : 0));
				if ((a = this._getSizeMap()) && a.wideMinHeight) {
					$(this.linkWideElementId) && $(this.linkWideElementId).destroy();
					$$(this.linkNaviWideClass) && $$(this.linkNaviWideClass).destroy();
					if (this._windowHeight < a.wideMinHeight) {
						this._isWide = true;
						Asset.css(this._getStyleSrc("game_wide"), {
							id: this.linkWideElementId
						});
						new Solitaire.CssLoader(this._getStyleSrc("navi_wide"), {
							className: this.linkNaviWideClass,
							cssTestProp: "_css-loader-navi-wide",
							cssTestValue: 10,
							onLoad: function () {
								this.fireEvent("naviWideChange")
							}.bind(this)
						})
					}
				}
				this.fireEvent("screenHeightChange")
			}
		},
		_appendStyle: function () {
			var a = this._getStyleSrc("game"),
				b;
			if (this._lastStyleAppend == a) return false;
			b = function (d) {
				$$("link." + this.linkClassName).destroy();
				d.addClass(this.linkClassName);
				new Solitaire.CssLoader(this._getStyleSrc("navi"), {
					className: this.linkClassName,
					cssTestProp: "_css-loader-navi",
					cssTestValue: 11,
					onLoad: function () {
						this.fireEvent("naviChange")
					}.bind(this)
				});
				this.fireEvent("change");
				Browser.isMobile && setTimeout(function () {
					window.scrollTo(0, 1)
				}, 1E3)
			}.bind(this);
			new Solitaire.CssLoader(a, {
				onLoad: function (d) {
					b.delay(250, this, d)
				}
			});
			this._lastStyleAppend = a;
			return true
		},
		_getStyleSrc: function (a) {
			var b = null;
			b = this._getSizeMap();
			if (!b) return "";
			return SS + "css/" + (a == "navi" || a == "navi_wide" ? "navi/" : this.options.layoutType + "/") + b.name + "/" + a + (Browser.isMobile && (a == "navi" || a == "navi_wide") ? "_mobile" : "") + ".css"
		},
		_getSizeMap: function () {
			var a, b;
			for (a in this.screenSizeMap) {
				b = this.screenSizeMap[a];
				if (this._windowWidth >= b.min && this._windowWidth <= b.max) {
					b.name = a;
					return b
				}
			}
			return null
		}
	})
}).call(Solitaire);
(function () {
	this.Card = new Class({
		Implements: [Events],
		step: 25,
		defaultStep: 25,
		animDuration: 300,
		maxZIndex: 1E4,
		lastZIndex: 0,
		reversed: true,
		nextCard: null,
		prevCard: null,
		foundationId: null,
		options: {
			animType: "src"
		},
		initialize: function (a, b, d, c) {
			this.symbol = a || "";
			this.color = b || "";
			this.setOption("deckType", d || "classic");
			this.setOption("backType", c || "classic");
			this.stackContainer = $("stack_section");
			this.boardContainer = $("board_section");
			this.dockContainer = $("dock_section");
			this.retPosition = {
				top: this.stackContainer.getElement("#stack").getTop(),
				left: this.stackContainer.getElement("#stack").getLeft()
			};
			this.builder = new Solitaire.Builder;
			this._buildCard();
			this._shadowFx = new Fx.Shadow(this.element, {
				duration: 200,
				link: "cancel"
			})
		},
		setOption: function (a, b) {
			this.options[a] = b;
			if (a == "deckType") this.isReversed() || this._setResource();
			a == "backType" && this.isReversed() && this._setResource()
		},
		getOption: function (a) {
			return this.options[a]
		},
		initDrag: function () {
			this.drag = new Solitaire.DragMove(this.element, {
				droppables: this.getDroppables(),
				snap: 6,
				checkDroppables: false
			});
			this.drag.addEvent("snap", function () {
				this.reversed && this.drag.stop()
			}.bind(this));
			this.drag.addEvent("drop", function () {
				this.fireEvent("drop", arguments)
			}.bind(this));
			this.drag.addEvent("drag", function (a) {
				for (var b = 0, d = this.getNextCard(); d;) {
					b++;
					d.element.setStyles({
						top: a.getTop() + this.step * b,
						left: a.getLeft()
					});
					d = d.getNextCard()
				}
				this.fireEvent("drag", arguments)
			}.bind(this));
			this.drag.addEvent("start", function () {
				if (!this.dragProcess) {
					this.dragProcess = true;
					if (!this.isReversed()) {
						this.updateDroppables();
						if (this.getZIndex() < this.maxZIndex - 1E3) this.lastZIndex = this.getZIndex();
						var a = 0,
							b;
						this.setZIndex(this.maxZIndex);
						this.shadowIn();
						for (b = this.getNextCard(); b;) {
							a++;
							b.setZIndex(this.maxZIndex + a);
							b.shadowIn();
							b = b.getNextCard()
						}
					}
					this.fireEvent("dragStart", arguments)
				}
			}.bind(this));
			this.drag.addEvent("complete", function () {
				this.dragProcess = false;
				if (!Browser.isMobile) {
					this.shadowOut();
					for (var a = this.getNextCard(); a;) {
						a.shadowOut();
						a = a.getNextCard()
					}
				}
			}.bind(this))
		},
		shadowIn: function () {
			Browser.isMobile || this._shadowFx.start({
				test: [0,
					25]
			})
		},
		shadowOut: function () {
			Browser.isMobile || this._shadowFx.start({
				test: [25, 0]
			})
		},
		detachDrag: function () {
			this.drag.detach()
		},
		attachDrag: function () {
			this.drag.attach()
		},
		getDroppables: function () {
			return $$(".blank_foundation, .blank_tableau, .card").erase(this.getElement())
		},
		updateDroppables: function () {
			this.drag.droppables = this.getDroppables()
		},
		getSymbol: function () {
			return this.symbol
		},
		getColor: function () {
			return this.color
		},
		getId: function () {
			return this.symbol + this.color.substr(0, 1)
		},
		toInt: function () {
			if (isNaN(parseInt(this.symbol))) return 11 + ["J", "Q", "K", "A"].indexOf(this.symbol);
			return parseInt(this.symbol)
		},
		setReversed: function (a, b, d) {
			if (this.reversed != a) {
				this.reversed = a;
				if (b === undefined) b = true;
				if (b) {
					b = this.getElement().getLeft();
					var c = this.getElement().getWidth();
					a = {
						width: 5,
						left: b + c / 2
					};
					b = {
						width: c,
						left: b
					};
					if (d === true) {
						delete a.left;
						delete b.left
					}(new Fx.Morph(this.getElement(), {
						duration: 110,
						link: "chain",
						transition: Fx.Transitions.linear,
						onComplete: function (e) {
							e.getWidth() <= 5 ? this._setResource() : e.setStyle("width", null)
						}.bind(this)
					})).start(a).start(b)
				} else this._setResource()
			}
		},
		isReversed: function () {
			return this.reversed
		},
		isFront: function () {
			return !this.reversed
		},
		setFoundation: function (a) {
			if (this.inFoundation != a) {
				var b = function () {
					for (var d = this.getPrevCard(), c = 2; d;) {
						d[c <= 0 ? "hide" : "show"]();
						d = d.getPrevCard();
						c--
					}
				}.bind(this);
				if (a) this.addEvent("movedComplete:once", b);
				else this.inFoundation && b();
				this.inFoundation = a
			}
		},
		isFounded: function () {
			return this.inFoundation
		},
		setFoundationId: function (a) {
			this.foundationId = a
		},
		getFoundationId: function () {
			return this.foundationId
		},
		increaseStep: function () {
			this.isDecreased() && this.setStep(this.step + 10)
		},
		decreaseStep: function () {
			this.isIncreased() && this.setStep(this.step - 10)
		},
		isIncreased: function () {
			return this.step > 15
		},
		isDecreased: function () {
			return this.step < 25
		},
		setStep: function (a) {
			if (this.step != a) {
				if (this.getPrevCard()) {
					var b = this.getPrevCard().getElement().getTop() + a;
					this.element.setStyle("top", b);
					this.retPosition.top = b
				}
				this.step = a;
				(a = this.getNextCard()) && a.setStep(this.step)
			}
		},
		isInWaste: function (a) {
			var b;
			a = a ? {
				left: this.retPosition.left,
				top: this.retPosition.top,
				width: this.getElement().getWidth(),
				height: this.getElement().getHeight()
			} : this.element.getCoordinates();
			b = this.stackContainer.getCoordinates();
			if (a.left >= b.left && b.left + b.width >= a.left + a.width && a.top >= b.top && b.top + b.height >= a.top + a.height) return true;
			return false
		},
		isInTableau: function (a) {
			var b, d;
			a = a ? {
				left: this.retPosition.left,
				top: this.retPosition.top,
				width: this.getElement().getWidth(),
				height: this.getElement().getHeight()
			} : this.element.getCoordinates();
			d = a.height / 2;
			b = this.boardContainer.getCoordinates();
			if (a.left + a.width >= b.left && b.left + b.width >= a.left && a.top + d >= b.top && b.top + b.height >= a.top + a.height) return true;
			return false
		},
		isInFoundation: function () {
			var a, b;
			a = this.element.getCoordinates();
			b = this.dockContainer.getCoordinates();
			return a.right >= b.left && a.left <= b.right && a.bottom >= b.top && a.top <= b.bottom
		},
		getLastSectionPos: function () {},
		returnPosition: function () {
			var a = function () {
				if (!this.dragProcess) if (this.lastZIndex) {
					this.setZIndex(this.lastZIndex);
					var b = this.getNextCard();
					b && b.setZIndex(this.lastZIndex + 1)
				}
			}.bind(this);
			(new Fx.Morph(this.element, {
				duration: this.animDuration,
				onComplete: a
			})).start(this.retPosition);
			(a = this.getNextCard()) && a.returnPosition.delay(25, a)
		},
		setPosition: function (a, b, d, c, e) {
			var f, g, h, i;
			h = 0;
			var j = 1;
			g = a;
			i = this.getPrevCard();
			if (typeOf(a) == "element") g = {
				top: a.getTop(),
				left: a.getLeft()
			};
			if (i) j = i.getZIndex() + 1;
			if (i && typeOf(a) == "element") {
				for (; i;) {
					if (i.element == a) {
						h++;
						break
					}
					i = i.getPrevCard();
					h++
				}
				if (i = a.retrieve("solitaire:card:model")) {
					if (i.isInTableau()) g.top += h * this.step
				} else if (a.hasClass("blank_tableau")) g.top += h * this.step
			}
			this.retPosition =
			g;
			h = function () {
				if (b === undefined || b === true) this.setZIndex(j);
				if (e === undefined || e === true) if (this.getNextCard()) {
					if (this.isInTableau() && typeOf(a) != "element") {
						f = Object.merge({}, a);
						f.top += this.step;
						a = f
					}
					this.getNextCard().setPosition(a)
				}
				this.fireEvent("movedComplete", [this])
			};
			if (d) {
				if (b) this.setZIndex(c ? 9999 : 1);
				(new Fx.Morph(this.element, {
					duration: this.animDuration,
					frameSkip: true,
					onComplete: h.bind(this)
				})).start(g)
			} else {
				this.element.setStyles(g);
				d === undefined ? h.apply(this, []) : h.delay(1, this, [])
			}
		},
		setUndoPosition: function (a) {
			var b =
			1,
				d, c = 0;
			if (this.getPrevCard()) b = this.getPrevCard().getZIndex() + 1;
			a = Object.merge({}, a);
			this.retPosition = Object.merge({}, a);
			var e = function (f, g, h) {
				this.setZIndex(9999 + h);
				(new Fx.Morph(f, {
					duration: this.animDuration,
					onComplete: function () {
						this.setZIndex(b + h);
						h || this.fireEvent("movedComplete", [this])
					}.bind(this)
				})).start(g)
			};
			e.apply(this, [this.getElement(), a, c]);
			for (d = this.getNextCard(); d;) {
				c++;
				a.top += this.step;
				e.apply(d, [d.getElement(), a, c]);
				d.retPosition = Object.merge({}, a);
				d.step = this.step;
				d.show();
				d =
				d.getNextCard()
			}
		},
		getPosition: function () {
			return {
				top: this.element.getTop(),
				left: this.element.getLeft()
			}
		},
		setNextCard: function (a) {
			(this.nextCard = a) && a.setFoundationId(this.getFoundationId())
		},
		getNextCard: function () {
			return this.nextCard
		},
		getNextCards: function () {
			for (var a = [], b = this.getNextCard(); b;) {
				a.push(b);
				b = b.getNextCard()
			}
			return a
		},
		setPrevCard: function (a, b) {
			a === null && this.prevCard && this.prevCard.setNextCard(null);
			if ((this.prevCard = a) && b === undefined || b === true) this.isFounded() || this.setStep(a.step)
		},
		getPrevCard: function () {
			return this.prevCard
		},
		getPrevCards: function () {
			for (var a = [], b = this.getPrevCard(); b;) {
				a.push(b);
				b = b.getPrevCard()
			}
			return a
		},
		getFirstCard: function () {
			var a = this.getPrevCard();
			if (!a) return this;
			for (; a.getPrevCard();) a = a.getPrevCard();
			return a
		},
		getLastCard: function () {
			var a = this.getNextCard();
			if (!a) return this;
			for (; a.getNextCard();) a = a.getNextCard();
			return a
		},
		getLastCardIndex: function () {
			var a = this.getNextCard();
			if (!a) return 0;
			for (var b = 1; a.getNextCard();) {
				a = a.getNextCard();
				b++
			}
			return b
		},
		reset: function () {
			this.removeEvents("movedComplete");
			this.setNextCard(null);
			this.setPrevCard(null);
			this.show();
			this.setReversed(true, false);
			this.inFoundation = false;
			this.foundationId = null;
			this.step = this.defaultStep;
			this.retPosition = {
				top: this.stackContainer.getElement("#stack").getTop(),
				left: this.stackContainer.getElement("#stack").getLeft()
			};
			this.setZIndex(0);
			this.lastZIndex = 0;
			this.detachDrag()
		},
		show: function () {
			this.element.show();
			return this
		},
		hide: function () {
			this.element.hide();
			return this
		},
		destroy: function () {
			this.element.destroy()
		},
		getElement: function () {
			return this.element
		},
		getZIndex: function () {
			return this.element.getStyle("zIndex") >> 0
		},
		setZIndex: function (a) {
			if (a < this.maxZIndex - 1E3) this.lastZIndex = a;
			this.element.setStyle("zIndex", a)
		},
		_buildCard: function () {
			var a;
			if (this.options.animType == "src") a = {
				tag: "img",
				className: "card",
				src: this._getReverseImgSrc()
			};
			else if (this.options.animType == "bg") a = {
				tag: "div",
				className: "card"
			};
			a.styles = {
				top: -160,
				left: 0
			};
			if (this.options.animType == "bg") a.styles.background = 'transparent url("' + this._getReverseImgSrc() + '") top left no-repeat scroll';
			this.element = this.builder.buildDomModel(document.body, a);
			this.element.store("solitaire:card:model", this);
			this.element.addEvent("click", function (b) {
				this.fireEvent("click", b)
			}.bind(this));
			this.element.addEvent("dblclick", function (b) {
				this.fireEvent("dblclick", b)
			}.bind(this));
			this.element.addEvent("contextmenu", function (b) {
				this.fireEvent("dblclick", b)
			}.bind(this))
		},
		_getImgSrc: function () {
			return SS + "images/cards/" + this.getOption("deckType") + "/{id}.png".replace("{id}", this.getId())
		},
		_getReverseImgSrc: function () {
			return SS + "images/backs/" + this.getOption("backType") + "/preview.png"
		},
		_getClassName: function () {
			return "card card-" + (this.isReversed() ? "back" : this.getId())
		},
		_setResource: function () {
			if (this.element) if (this.isReversed()) if (this.options.animType == "src") this.element.src = this._getReverseImgSrc();
			else this.options.animType == "bg" && this.element.setStyle("backgroundImage", 'url("' + this._getReverseImgSrc() + '")');
			else if (this.options.animType == "src") this.element.src = this._getImgSrc();
			else this.options.animType == "bg" && this.element.setStyle("backgroundImage", 'url("' + this._getImgSrc() + '")')
		}
	})
}).call(Solitaire);
(function () {
	this.Deck = new Class({
		Implements: [Events],
		Binds: ["onCardDrop", "onCardClick", "onCardDragStart", "onCardDrag", "onClickEmptyStack", "onCardDblClick", "onShuffled"],
		options: {
			deckType: "",
			cardBackType: ""
		},
		stackLoopCount: 0,
		undoCardsCountColl: [],
		freeCards: [],
		cards: [],
		initialize: function (a, b, d) {
			this.boardContainer = $("board_section");
			this.stack = $("stack");
			this.setOption("deckType", b);
			this.setOption("cardBackType", d);
			this.setGameType(a);
			this.initEvents()
		},
		initEvents: function () {
			this.stack.addEvent("click", this.onClickEmptyStack);
			this.addEvent("shuffled", this.onShuffled)
		},
		setGameType: function (a) {
			this.gameType = a;
			this._destroyCards();
			this.stackLoopCount = 0;
			this.undoCardsCountColl = [];
			this.freeCards = [];
			this.cards = [];
			this._buildCards()
		},
		setOption: function (a, b) {
			this.options[a] = b;
			a == "deckType" && this.cards.invoke("setOption", "deckType", b);
			a == "cardBackType" && this.cards.invoke("setOption", "backType", b)
		},
		getOption: function (a) {
			return this.options[a]
		},
		deal: function () {
			var a = 0,
				b, d, c;
			c = function () {
				var e = 0,
					f = 0,
					g = 0,
					h, i, j;
				this.gameType.deal();
				this.gameType.getDealRules().each(function (m) {
					g += m
				});
				var k = function () {
					e++;
					if (e >= g) {
						this.freeCards[0].show().setZIndex(2);
						this.shuffling = false;
						this.fireEvent("delt")
					}
				}.bind(this);
				h = this.boardContainer.getElements(".blank_tableau");
				this.gameType.getDealRules().each(function (m, l) {
					j = [];
					for (f = 0; f < m; f++) {
						i = this.popCard();
						i.show();
						j.push(i)
					}
					j.each(function (n, o) {
						var p = o == j.length - 1;
						if (p || this.gameType.isAllCardsFrontOnDelt()) {
							n.setReversed(false, false);
							p && n.attachDrag()
						}
						o > 0 && n.setPrevCard(j[o - 1]);
						!p && j.length > 1 && n.setNextCard(j[o + 1]);
						n.setPosition(h[l], false, true, false, false);
						o == 0 && this.fireEvent("dealToBlankBoardCard", [n, h[l]]);
						n.setZIndex(o + 1);
						n.addEvent("movedComplete:once", k)
					}.bind(this))
				}.bind(this))
			}.bind(this);
			d = this.freeCards.invoke("getElement").splice(0, 3);
			b = function (e) {
				d.indexOf(e.getElement()) == -1 && e.hide();
				a++;
				a >= this.cards.length && c()
			}.bind(this);
			this.cards.each(function (e, f) {
				e.addEvent("movedComplete:once", b);
				e.show();
				(function () {
					e.setPosition(this.stack, false, true)
				}).delay((this.cards.length - f) * 8, this)
			}.bind(this))
		},
		shuffle: function (a, b) {
			if (!this.shuffling) {
				var d = 0,
					c, e;
				this.shuffling = true;
				this.stackLoopCount = 0;
				this.undoCardsCountColl = [];
				this.lastZIndex = 0;
				this.showedCardInStack = null;
				this._newDeckLoop = false;
				c = function () {
					d++;
					if (d >= this.cards.length) {
						this.freeCards = Array.clean(this.freeCards);
						if (b) this.freeCards = Array.clean(this.lastDealCards);
						else this.lastDealCards = Array.clean(this.freeCards);
						this.fireEvent("shuffled", [a])
					}
				}.bind(this);
				this.freeCards = [];
				e = this.cards.length;
				this.cards.each(function (f) {
					if (!b) if (Solitaire.DEAL_EASY) {
						this.freeCards.push(f);
						this.freeCards.reverse()
					} else {
						for (var g = this._getRandom(e + 100); this.freeCards[g] instanceof Solitaire.Card;) g = this._getRandom(e + 100);
						this.freeCards[g] = f
					}
					f.reset();
					f.addEvent("movedComplete:once", c);
					f.setPosition({
						left: 0,
						top: -160
					}, false, true)
				}.bind(this))
			}
		},
		turnOver: function (a, b) {
			if (this.shuffling || !a.isReversed() && !b) return [];
			this.showedCardInStack = null;
			return this.gameType.turnOver(a, b)
		},
		getZIndex: function (a) {
			if (!this.lastZIndex) this.lastZIndex = 1;
			return this.lastZIndex = a ? --this.lastZIndex : ++this.lastZIndex
		},
		getShowedCardStackPos: function (a) {
			var b = this.boardContainer.getChildren().getLast().getStyle("margin-left").toInt(),
				d = {
					top: this.stack.getTop(),
					left: this.stack.getLeft()
				};
			if (a) return d;
			d.left = d.left + this.stack.getWidth() + b;
			return d
		},
		moveCardsToStack: function (a) {
			var b = this.gameType.getVariant() == "turn-one" || !this.gameType.getVariant() ? 1 : 3,
				d = this.freeCards.length,
				c, e = this.getShowedCardStackPos(!a),
				f = this.freeCards.length % b;
			if (!a) {
				this.undoCardsCountColl[this.stackLoopCount] = this.stackLoopCount ? this._dealModulo : b;
				this._dealModulo = f || b
			}
			this.stackLoopCount = a ? --this.stackLoopCount : ++this.stackLoopCount;
			if (a) f = this.undoCardsCountColl[this.stackLoopCount];
			this.freeCards.each(function (g, h) {
				c = d - (h + 1);
				var i = b >= c;
				if (a) {
					i && g.setZIndex(h + 1);
					h >= d - 1 && g.addEvent("movedComplete:once", function () {
						this._newDeckLoop = true;
						this.updateStack(g, true)
					}.bind(this));
					g.setReversed(!(i && c < f), false);
					g[i && c < f ? "show" : "hide"]()
				} else {
					g.setReversed(true, false);
					g[h ? "hide" : "show"]()
				}
				if (a && b > 1 && h > d - b) e.left += 20;
				g.setPosition(e, false, true)
			}.bind(this))
		},
		updateStack: function (a, b, d) {
			this.gameType.updateStack(a, b, d)
		},
		getShowedCardInStack: function () {
			return this.showedCardInStack
		},
		addToStack: function (a, b) {
			if (b != -1) this.freeCards.splice(b, 0, a);
			else {
				this.freeCards.reverse().push(a);
				this.freeCards.reverse()
			}
		},
		removeFromStack: function (a) {
			this.gameType.removeCardFromStack(a)
		},
		updateOpenedFreeCardPos: function (a, b) {
			var d = 0,
				c, e, f, g, h;
			h = this.gameType.getVariant() == "turn-one" || !this.gameType.getVariant() ? 1 : 3;
			if (h > 1) if (g = this.getPrevFreeCard(a)) {
				e = {
					left: g.getElement().getLeft(),
					top: g.getElement().getTop()
				};
				e.left = b ? e.left - 20 : e.left + 20;
				f = g.getZIndex();
				for (d = 0; g;) {
					if (d >= h - 1) break;
					g[d == 0 && !b ? "attachDrag" : "detachDrag"]();
					c = {
						left: e.left - 20 * d,
						top: e.top
					};
					g.setPosition(c, false, true);
					g.setZIndex(f--);
					g = this.getPrevFreeCard(g);
					++d
				}
			}
		},
		getCard: function (a, b) {
			var d, c, e, f = this.cards.length,
				g = [];
			a += "";
			b = b.length != 1 ? b.substr(0, 1) : b;
			for (d = 0; d < f; d++) {
				c = this.cards[d].getSymbol() + "";
				c = c.toLowerCase();
				e = this.cards[d].getColor().substr(0, 1);
				c == a.toLowerCase() && e == b && g.push(this.cards[d])
			}
			return g
		},
		getCardByOrder: function (a, b) {
			var d = [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"];
			if (a.getSymbol() == "A" && b == "next") return null;
			if (a.getSymbol() == 2 && b == "prev") return null;
			if (b == "next") return this.getCard(d[d.indexOf(a.getSymbol()) + 1], a.getColor());
			if (b == "prev") return this.getCard(d[d.indexOf(a.getSymbol()) - 1], a.getColor());
			return null
		},
		getNextFreeCard: function (a, b) {
			for (var d = 0, c = this.freeCards.length; d < c; d++) if (a.getElement() == this.freeCards[d].getElement()) {
				if (d + 1 >= c) break;
				return this.freeCards[d + (b !== undefined ? b >> 0 : 1)]
			}
			return null
		},
		getPrevFreeCard: function (a, b) {
			for (var d = 0, c = this.freeCards.length; d < c; d++) if (a.getElement() == this.freeCards[d].getElement()) {
				if (d == 0) break;
				return this.freeCards[d - (b !== undefined ? b >> 0 : 1)]
			}
			return null
		},
		getFreeCards: function () {
			return this.freeCards
		},
		getNotFoundedCards: function () {
			return this.cards.filter(function (a) {
				return !a.isFounded()
			})
		},
		getCardsInFoundation: function () {
			return this.cards.filter(function (a) {
				return a.isFounded()
			})
		},
		getReversedCards: function () {
			return this.cards.filter(function (a) {
				return a.isReversed()
			})
		},
		disable: function () {
			this.cards.invoke("detachDrag")
		},
		getLastCardByFoundationId: function (a) {
			var b = this.getCardsInFoundation(),
				d = 0,
				c;
			c = b.length;
			for (d = 0; d < c; d++) if (b[d].getFoundationId() == a) return b[d].getLastCard();
			return null
		},
		isInStack: function (a) {
			return this.freeCards.filter(function (b) {
				return a.getElement() == b.getElement()
			}).length ? true : false
		},
		onShuffled: function (a) {
			a && this.deal.delay(500, this)
		},
		onCardDrop: function () {
			this.fireEvent("cardDrop", arguments)
		},
		onCardClick: function () {
			this.fireEvent("cardClick", arguments)
		},
		onCardDblClick: function () {
			this.fireEvent("cardDblClick", arguments)
		},
		onCardDragStart: function () {
			this.fireEvent("cardDragStart", arguments)
		},
		onCardDrag: function () {
			this.fireEvent("cardDrag", arguments)
		},
		onClickEmptyStack: function (a) {
			a.preventDefault();
			if (this.gameType.isAllowReloopStack() && !this._stackClickBlocker && !this.gameType._isTurnBlocked()) {
				this._stackClickBlocker = true;
				this.moveCardsToStack();
				this._newDeckLoop = true;
				this.fireEvent("clickEmptyStack", arguments);
				var b = this.getFreeCards();
				b.length && b[b.length - 1].addEvent("movedComplete:once", function () {
					(function () {
						if (this.gameType.getVariant() == "turn-one") this._newDeckLoop = false;
						this.turnOver(b[0]);
						if (this.gameType.getVariant() == "turn-three") for (var d = 0; d < 2; d++) b[d] && b[d].setReversed(false, false);
						this._stackClickBlocker = false
					}).delay(100, this)
				}.bind(this))
			}
		},
		popCard: function () {
			var a, b;
			a = this.freeCards[0];
			(b = this.getNextFreeCard(a)) && b.show();
			delete this.freeCards[0];
			this.freeCards = Array.clean(this.freeCards);
			return a
		},
		_getRandom: function (a) {
			return Math.round(Math.random() * a) + a
		},
		_destroyCards: function () {
			this.cards.invoke("destroy")
		},
		_buildCards: function () {
			this.gameType.getCardIds().each(function (a) {
				this.gameType.getCardColors().each(function (b) {
					b = new Solitaire.Card(a, b, this.getOption("deckType"), this.getOption("cardBackType"));
					b.addEvent("drop", this.onCardDrop);
					b.addEvent("dragStart", this.onCardDragStart);
					b.addEvent("drag", this.onCardDrag);
					b.addEvent("click", this.onCardClick);
					b.addEvent("dblclick", function (d) {
						this.onCardDblClick(d)
					}.bind(this));
					this.cards.push(b)
				}.bind(this))
			}.bind(this));
			this.cards.invoke("initDrag");
			this.cards = this.cards.reverse()
		}
	})
}).call(Solitaire);
(function () {
	this.Tableau = new Class({
		Implements: Options,
		options: {
			selector: ".blank_tableau"
		},
		cards: [],
		initialize: function (a) {
			this.setOptions(a)
		},
		setCardBySlotElement: function (a, b) {
			var d = $$(this.options.selector).indexOf(b);
			if (d == -1) return null;
			return this.setCardBySlotId(a, d)
		},
		getCardBySlotElement: function (a) {
			a = $$(this.options.selector).indexOf(a);
			if (a == -1) return null;
			return this.getCardBySlotId(a)
		},
		setCardBySlotId: function (a, b) {
			this.removeCard(a);
			this.cards[b] = a;
			return b
		},
		getCardBySlotId: function (a) {
			return this.cards[a] ? this.cards[a] : null
		},
		getSlotIdByCard: function (a) {
			for (var b = 0, d = this.cards.length; b < d; b++) if (this.cards[b]) if (this.cards[b].getElement() == a.getElement()) return b;
			return null
		},
		getBlankByCard: function (a) {
			return this.getSlot(this.getSlotIdByCard(a))
		},
		getCards: function () {
			return this.cards
		},
		getSlot: function (a) {
			return $$(this.options.selector)[a]
		},
		removeCard: function (a) {
			for (var b = 0, d = this.cards.length; b < d; b++) if (this.cards[b]) if (this.cards[b].getElement() == a.getElement()) {
				this.cards[b] = null;
				return b
			}
			return null
		},
		clearSlots: function () {
			this.cards = []
		}
	})
}).call(Solitaire);
(function () {
	this.Foundation = new Class({
		Implements: Options,
		options: {
			selector: ".blank_foundation"
		},
		cards: [],
		busyFoundation: [],
		freeFoundation: [],
		initialize: function (a) {
			this.setOptions(a);
			this.clearSlots()
		},
		getFreeSlot: function () {
			if (this.freeFoundation.length) return this.freeFoundation[0];
			return null
		},
		setAsBusySlot: function (a) {
			this.busyFoundation.indexOf(a) == -1 && this.busyFoundation.push(a);
			this.freeFoundation.erase(a);
			return $$(this.options.selector).indexOf(a)
		},
		setCardBySlotElement: function (a, b) {
			var d =
			$$(this.options.selector).indexOf(b);
			this.cards[d] = a;
			return d
		},
		getCardBySlotId: function (a) {
			return this.cards[a] ? this.cards[a] : null
		},
		getCardBySlotElement: function (a) {
			a = $$(this.options.selector).indexOf(a);
			if (a == -1) return null;
			return this.getCardBySlotId(a)
		},
		getCards: function () {
			return this.cards
		},
		getSlot: function (a) {
			return $$(this.options.selector)[a]
		},
		clearSlot: function (a) {
			this.busyFoundation.erase(this.getSlot(a));
			this.freeFoundation.push(this.getSlot(a));
			delete this.cards[a]
		},
		clearSlots: function () {
			this.freeFoundation =
			$$(this.options.selector);
			this.busyFoundation = [];
			this.cards = []
		}
	})
}).call(Solitaire);
(function () {
	this.Menu = new Class({
		Implements: [Options, Events],
		Binds: ["onClickMenu", "onClickAction", "onClickOption", "onClickSkin", "onSkinWindowChange", "onOptionWindowChange", "onClickNewGame", "onWindowClose", "onClickInfo", "onToggleMenu", "onClickToggleSound", "onClickToggleRules", "onClickTogglePause", "onPauseWindowClose", "onGamesWindowChange", "onClickSelectGame"],
		options: {
			menu_button: "menu_button",
			menu_content: "menu_content",
			menu_bottom_content: "footer_menu_left",
			game_buttons: "game_status",
			game_labels: "game_labels",
			duration: 200
		},
		initialize: function (a) {
			this.gameOptions = a;
			this.button = $(this.options.menu_button);
			this.button.set("text", Solitaire.Lang.getString("menuButton"));
			this.content = $(this.options.menu_content);
			this.contentBottom = $(this.options.menu_bottom_content);
			this.gameButtonCont = $(this.options.game_buttons);
			this.gameLabelsCont = $(this.options.game_labels);
			this._setElementsLocaleText();
			this.buttonFx = new Fx.Morph(this.button, {
				duration: this.options.duration
			});
			this.contentFx = new Fx.Morph(this.content, {
				duration: this.options.duration
			});
			this.gameLabelsFx = new Fx.Morph(this.gameLabelsCont, {
				duration: this.options.duration
			});
			this.gameButtonContFx = new Fx.Morph(this.gameButtonCont, {
				duration: this.options.duration
			});
			this.contentBottom.setStyle("opacity", 0).show();
			this.contentBottomFx = new Fx.Morph(this.contentBottom, {
				duration: this.options.duration
			});
			this.buttonFx.start.delay(1500, this.buttonFx, [{
				top: 0}]);
			this.gameLabelsFx.start.delay(1500, this.gameLabelsFx, [{
				top: 0}]);
			this.gameButtonContFx.start.delay(1500, this.gameButtonContFx, [{
				top: 0}]);
			this.contentBottomFx.start.delay(1500, this.contentBottomFx, [{
				opacity: 0.7}]);
			this.optionsWindow = new Solitaire.Window.Options(this.gameOptions.getDefaultOptionWindowParams());
			this.gamesWindow = new Solitaire.Window.Games(this.gameOptions.getDefaultOptionWindowParams());
			this.themesWindow = new Solitaire.Window.Themes(this.gameOptions.getDefaultSkinWindowParams());
			this.infoWindow = new Solitaire.Window.Info;
			this.rulesWindow = new Solitaire.Window.Rules;
			this.pauseWindow = new Solitaire.Window.Pause;
			this.initEvents();
			this._markSoundTickAsMuted(this.gameOptions.getOptionWindowParam("sound") == "off")
		},
		initEvents: function () {
			this.button.addEvent("click", this.onClickMenu);
			this.content.getElements("a.menu_action").addEvent("click", this.onClickAction);
			this.contentBottom.getElements("a.menu_action").addEvent("click", this.onClickAction);
			this.addEvent("clickOption", this.onClickOption);
			this.addEvent("clickSkin", this.onClickSkin);
			this.addEvent("clickNewGame", this.onClickNewGame);
			this.addEvent("clickRestartGame", this.onClickNewGame);
			this.addEvent("clickSelectGame", this.onClickSelectGame);
			this.addEvent("clickInfo", this.onClickInfo);
			this.addEvent("clickToggleSound", this.onClickToggleSound);
			this.addEvent("clickToggleRules", this.onClickToggleRules);
			this.addEvent("clickTogglePause", this.onClickTogglePause);
			this.pauseWindow.addEvent("close", this.onPauseWindowClose);
			this.optionsWindow.addEvent("change", this.onOptionWindowChange);
			this.optionsWindow.addEvent("close", this.onWindowClose);
			this.gamesWindow.addEvent("change", this.onGamesWindowChange);
			this.gamesWindow.addEvent("close", this.onWindowClose);
			this.themesWindow.addEvent("change", this.onSkinWindowChange);
			this.themesWindow.addEvent("close", this.onWindowClose);
			this.infoWindow.addEvent("close", this.onWindowClose);
			this.contentFx.addEvent("start", function (a) {
				this.fireEvent("toggle", [a.getTop() < 2 && a.getTop() > -2 ? "hide" : "show"])
			}.bind(this));
			Browser.isMobile || $(Browser.ie ? document : window).addEvent("keyup", this.onClickTogglePause);
			this.addEvent("optionWindowChange", function () {
				this._markSoundTickAsMuted(this.gameOptions.getOptionWindowParam("sound") == "off")
			}.bind(this))
		},
		onClickAction: function (a) {
			a.preventDefault();
			a.target.blur();
			a = a.target;
			a.hasClass("menu_action") || (a = a.getParent(".menu_action"));
			a = this._getActionName(a);
			this.fireEvent(("on-click-" + a).camelCase())
		},
		onClickSelectGame: function () {
			this.gamesWindow.toggle(this.gameOptions.getDefaultOptionWindowParams())
		},
		onClickOption: function () {
			this.optionsWindow.toggle(this.gameOptions.getDefaultOptionWindowParams())
		},
		onClickSkin: function () {
			this.themesWindow.toggle(this.gameOptions.getDefaultSkinWindowParams())
		},
		onClickInfo: function () {
			if (!Solitaire.DEBUG) document.onmousedown = function () {
				return true
			};
			this.infoWindow.toggle()
		},
		onClickToggleSound: function () {
			var a = this.gameOptions.getOptionWindowParam("sound");
			a = a == "off" ? "wood" : "off";
			this._markSoundTickAsMuted(a == "off");
			this.gameOptions.setOptionWindowParam("sound", a);
			this.fireEvent("optionWindowChange", ["sound", a]);
			this.gameOptions.save()
		},
		onClickToggleRules: function () {
			this.rulesWindow.toggle(this.gameOptions.getOptionWindowParam("game"))
		},
		onClickTogglePause: function (a) {
			if (!(this.infoWindow.isOpened() || $$(".lbx_auth").length)) {
				if (typeOf(a) == "domevent") if (a.code != 80) return;
				this.pauseWindow.toggle();
				this._markPauseTick(this.pauseWindow.isOpened())
			}
		},
		onPauseWindowClose: function () {
			this._markPauseTick(this.pauseWindow.isOpened())
		},
		onClickNewGame: function () {
			if (!(this.optionsWindow.isOpened() || this.themesWindow.isOpened())) {
				clearTimeout(this._menuHoverTimer);
				this._menuHoverTimer = function () {
					if (this.isMenuShowed) this.onClickMenu()
				}.delay(3E3, this)
			}
		},
		onWindowClose: function () {
			if (!Solitaire.DEBUG) document.onmousedown = function () {
				return false
			};
			this.onClickNewGame()
		},
		onSkinWindowChange: function (a) {
			var b = function (d) {
				if (d.type == "cardBackType") if (d.data != this.gameOptions.getSkinWindowParam(d.type)) {
					this.gameOptions.setSkinWindowParam(d.type, d.data);
					this.fireEvent("skinWindowChange", [d.type, d.data])
				}
				if (d.type == "backgroundType" || d.type == "deckType") if (d.data != this.gameOptions.getSkinWindowParam(d.type)) {
					this.gameOptions.setSkinWindowParam(d.type, d.data);
					Solitaire.Indicator().show();
					Asset.images(this.gameOptions.getBackgroundSrc(), {
						onComplete: function () {
							Solitaire.Indicator().hide();
							this.fireEvent("skinWindowChange", [d.type, d.data])
						}.bind(this)
					})
				}
			};
			if (a.type == "themeType") {
				Object.each(a.data, function (d, c) {
					b.apply(this, [{
						type: c,
						data: d}])
				}.bind(this));
				if (a.data.themeType) {
					this.gameOptions.setSkinWindowParam(a.type, a.data.themeType);
					this.gameOptions.setSkinWindowParam("themeAuthor", a.data.author)
				}
			} else b.apply(this, [a]);
			this.gameOptions.save()
		},
		onOptionWindowChange: function (a, b) {
			this.gameOptions.setOptionWindowParam(a, b);
			this.gameOptions.save();
			this.fireEvent("optionWindowChange", [a, b])
		},
		onGamesWindowChange: function (a, b) {
			this.gameOptions.setOptionWindowParam(a, b);
			this.gameOptions.save();
			if (a == "game") {
				this.gamesWindow.close();
				this.fireEvent("gamesWindowChange", [b])
			}
		},
		onClickMenu: function (a) {
			if (a) {
				a.preventDefault();
				a.target.blur()
			}
			a = {};
			var b = window.getWidth(),
				d = $("event_widget");
			if (this.isMenuShowed) {
				a.top = -(this.content.getHeight() + 10);
				if (b < 1E3 || this.gameLabelsCont.getStyle("opacity") >> 0 < 1) this.gameLabelsFx.start({
					opacity: 1
				});
				d && d.hide.delay(300, d)
			} else {
				a.top = 0;
				b < 1E3 && this.gameLabelsFx.start({
					opacity: 0.1
				});
				d && d.show("inline")
			}
			this.isMenuShowed = !this.isMenuShowed;
			this.contentFx.start(a)
		},
		_markSoundTickAsMuted: function (a) {
			this.contentBottom.getElement(".menu_toggle_sound img").src = SS + "images/sound" + (a ? "_mute" : "") + ".png"
		},
		_markPauseTick: function (a) {
			this.contentBottom.getElement(".menu_toggle_pause img").src = a ? SS + "images/pause_on.png" : SS + "images/pause_off.png"
		},
		_getActionName: function (a) {
			return a.className.replace(/(menu_|action| )/ig, "").replace(/_/g, "-")
		},
		_setElementsLocaleText: function () {
			this.content.getElements("a.menu_action").each(function (a) {
				var b = this._getActionName(a);
				a.set("html", Solitaire.Lang.getString(("menu-" + b + "-button").camelCase()))
			}.bind(this));
			this.gameButtonCont.getElements("a").each(function (a) {
				if (a.id.test(/game_action_/)) {
					var b = "menu-" + a.id.replace("game_action_", "");
					a.set("html", Solitaire.Lang.getString(b.camelCase()))
				}
			}.bind(this));
			this.gameLabelsCont.getElements("span").each(function (a) {
				if (a.id.test(/label_/)) {
					var b = a.id.replace("_", "-");
					a.set("html", Solitaire.Lang.getString(b.camelCase()).substitute({
						"var": b == "label-time" ? "00:00" : "0"
					}))
				}
			}.bind(this))
		}
	})
}).call(Solitaire);
(function () {
	this.Options = new Class({
		Implements: [Options, Events],
		Binds: ["onResourcesLoaded"],
		options: {
			defaultParams: {
				skin: {
					deckType: "classic_old",
					cardBackType: "classic_old",
					backgroundType: "classic_old",
					themeType: "classic_old"
				},
				option: {
					game: "klondike:turn-one",
					sound: "bank_1",
					scoring: "timed",
					autoMove: "when_won",
					autoFlip: true,
					showOnStartup: true,
					showTime: true,
					showScore: true,
					showMoves: false,
					lang: "pl-pl"
				}
			},
			cardBackFiles: "{type}.png",
			backgroundFiles: ["background.jpg", "empty.png"],
			cookieName: "opt"
		},
		initialize: function (a) {
			this.setOptions(a);
			this.load();
			a = this.getOptionWindowParam("lang") || "pl-pl";
			if (a.length == 2 && !Solitaire.Lang.exists(a)) a = a + "-" + a;
			Solitaire.Lang.exists(a) || (a = "en-us");
			Solitaire.Lang.init(a)
		},
		loadResources: function () {
			Solitaire.Indicator().show();
			Asset.images(this.getAllSources(), {
				onComplete: this.onResourcesLoaded
			})
		},
		save: function () {
			Cookie.write(this.options.cookieName, JSON.encode(this.options.defaultParams), {
				duration: 30
			})
		},
		load: function () {
			var a = Cookie.read(this.options.cookieName);
			a = JSON.decode(a);
			typeOf(a) == "object" && Object.each(a, function (b, d) {
				typeOf(b) == "object" && Object.each(b, function (c, e) {
					this.options.defaultParams[d][e] = c
				}.bind(this))
			}.bind(this))
		},
		getGame: function (a) {
			a || (a = "klondike:turn-one");
			var b, d;
			b = (a + "").split(":")[0];
			d = (a + "").split(":")[1];
			if (!b) {
				b = "klondike";
				d = "turn-one"
			}
			if (Solitaire.Type[b.ucFirst().camelCase()]) {
				this.setOptionWindowParam("game", a);
				return new(Solitaire.Type[b.ucFirst().camelCase()])(d)
			}
			this.setOptionWindowParam("game", "klondike:turn-one");
			return new Solitaire.Type.Klondike("turn-one")
		},
		getDefaultSkinWindowParams: function () {
			return this.options.defaultParams.skin
		},
		getDefaultOptionWindowParams: function () {
			return this.options.defaultParams.option
		},
		setSkinWindowParam: function (a, b) {
			this.options.defaultParams.skin[a] = b
		},
		getSkinWindowParam: function (a) {
			return this.options.defaultParams.skin[a]
		},
		setOptionWindowParam: function (a, b) {
			this.options.defaultParams.option[a] = b
		},
		getOptionWindowParam: function (a) {
			return this.options.defaultParams.option[a]
		},
		getDeckSrc: function () {
			var a = [];[2, 3, 4, 5, 6, 7,
				8, 9, 10, "J", "Q", "K", "A"].each(function (b) {["c", "s", "h", "d"].each(function (d) {
					a.push((new String(SS + "images/cards/" + this.getSkinWindowParam("deckType") + "/{s}{c}.png")).substitute({
						s: b,
						c: d
					}))
				}.bind(this))
			}.bind(this));
			return a
		},
		getCardBackSrc: function () {
			return SS + "images/backs/" + this.getSkinWindowParam("cardBackType") + "/preview.png"
		},
		getBackgroundSrc: function () {
			return SS + "images/backgrounds/" + this.getSkinWindowParam("backgroundType") + "/" + this.options.backgroundFiles[0]
		},
		getCardEmptySrc: function () {
			return SS + "images/backgrounds/" + this.getSkinWindowParam("backgroundType") + "/" + this.options.backgroundFiles[1]
		},
		onResourcesLoaded: function () {
			Solitaire.Indicator().hide();
			this.fireEvent("loaded", this)
		},
		getAllSources: function () {
			var a = this.getDeckSrc();
			a.push(this.getCardBackSrc());
			this.options.backgroundFiles.each(function (b) {
				a.push(SS + "images/backgrounds/" + this.getSkinWindowParam("backgroundType") + "/" + b)
			}.bind(this));
			return a
		}
	})
}).call(Solitaire);
(function () {
	this.Player = new Class({
		Implements: [Events],
		Binds: [],
		_storageNs: "player-data",
		_backendUrl: "http://pasjans-online." + TLD + "/auth/",
		_publicSalt: '$vx78V";w2',
		_isLogged: false,
		_playerData: {},
		initialize: function () {
			this.storage = new Solitaire.Storage(this._storageNs);
			this.initEvents()
		},
		initEvents: function () {},
		getData: function (a) {
			if (a == null) return this._playerData;
			return this._playerData[a]
		},
		silentLogin: function () {
			this._auth("login", null, null, true)
		},
		login: function (a, b) {
			this._auth("login", a, b)
		},
		logout: function () {
			this._isLogged =
			false;
			this._playerData = {};
			this.storage.clear("name");
			this.storage.clear("hash");
			this._request("logout", null, function (a) {
				this.fireEvent("logout", a)
			}.bind(this))
		},
		register: function (a, b) {
			this._auth("register", a, b)
		},
		isLogged: function () {
			return this._isLogged
		},
		_auth: function (a, b, d, c) {
			var e = {
				result: "ok"
			},
				f;
			if (d) f = this._getHash(d);
			if (b) this.storage.set("name", b);
			else b = this.storage.get("name");
			if (f) this.storage.set("hash", f);
			else f = this.storage.get("hash");
			if (!b || !f) {
				e.result = "invalid";
				if (c) e.silentMode = true;
				this.fireEvent(a, e)
			} else this._request(a, {
				name: b,
				hash: f
			}, function (g) {
				this._isLogged = g.result == "ok";
				if (c) g.silentMode = true;
				if (this._isLogged) this._playerData = g.response;
				this.fireEvent(a, g)
			}.bind(this))
		},
		_request: function (a, b, d) {
			var c = Solitaire.CrossRequest;
			if (Browser.ie) c = Request.JSON;
			(new c({
				url: this._backendUrl + a + ".html",
				data: b || {},
				onComplete: function (e) {
					e || (e = {
						result: "error"
					});
					d(e)
				},
				onFailure: function () {
					d({
						result: "error"
					})
				}
			})).send()
		},
		_getHash: function (a) {
			return hex_md5(this._publicSalt + a)
		}
	})
}).call(Solitaire);
(function () {
	this.Sound = new Class({
		Implements: [Events],
		Binds: [],
		_types: ["off", "wood", "plastic"],
		_availables: ["drop", "deal", "win"],
		_global: ["win"],
		_audio: {},
		_disabled: false,
		_support: !! document.createElement("audio").canPlayType,
		initialize: function (a) {
			this.setBankType(a || "wood")
		},
		setBankType: function (a) {
			if (this._bankType != a) {
				if (this._types.indexOf(a) == -1) a = "off";
				this._bankType = a;
				if (this._bankType == "off") this.setAsDisabled(true);
				else {
					this.setAsDisabled(false);
					Object.each(this._audio, function (b) {
						if (typeOf(b) == "element") b.destroy();
						else try {
							b.destruct();
							delete b
						} catch (d) {}
					}, this);
					this._buildHtml()
				}
			}
		},
		play: function (a, b, d) {
			this._disabled || !this._support || (Browser.chrome && Browser.version == 17 && Browser.Platform.win ? this._audio[a].play() : function () {
				this._audio[a].play();
				d && this.stop(a, d)
			}.delay(b || 5, this))
		},
		stop: function (a, b) {
			this._disabled || !this._support ||
			function () {
				this._audio[a].pause();
				this._audio[a].currentTime = 0
			}.delay(b || 5, this)
		},
		setAsDisabled: function (a) {
			this._disabled = a === undefined || a === true ? true : false
		},
		isSupported: function () {
			return this._support
		},
		_buildHtml: function () {
			var a = document.createDocumentFragment();
			this._availables.each(function (b) {
				this._audio[b] = this._getAudioElement(b);
				typeOf(this._audio[b]) == "element" && a.appendChild(this._audio[b])
			}, this);
			$(document.body).appendChild(a)
		},
		_getAudioElement: function (a) {
			var b;
			if (Browser.chrome && Browser.version == 17 && Browser.Platform.win) {
				soundManager.onready(function () {
					var d = soundManager.createSound({
						id: a,
						url: this._getResourceSrc(a, "mp3"),
						autoLoad: true,
						autoPlay: false,
						onload: function () {
							this._audio[a] = d
						}.bind(this),
						volume: 100
					})
				}.bind(this));
				b || (b = {
					play: function () {},
					pause: function () {}
				})
			} else {
				b = new Element("audio", {
					preload: true,
					hidden: true,
					autoplay: false
				});["ogg", "mp3"].each(function (d) {
					b.appendChild(this._getSourceElement(a, d))
				}, this)
			}
			return b
		},
		_getSourceElement: function (a, b) {
			var d = this._getResourceSrc(a, b);
			return new Element("source", {
				src: d,
				type: "audio/" + b
			})
		},
		_getResourceSrc: function (a, b) {
			var d = this._bankType + "/";
			if (this._global.indexOf(a) != -1) d = "";
			return SS + "sounds/" + d + a + "." + b.substr(0, 3)
		}
	})
}).call(Solitaire);
(function () {
	this.Window = this.Window || {};
	this.Window.Abstract = new Class({
		Implements: [Events, Options],
		Binds: ["model", "header"],
		className: "",
		showOverlay: false,
		header: function () {},
		model: function () {},
		options: {},
		_closeTimer: null,
		initialize: function (a) {
			this.setOptions(a);
			this.builder = new Solitaire.Builder;
			this.workingHeader = this.header();
			this.workingModel = this.model()
		},
		open: function (a) {
			clearTimeout(this._closeTimer);
			this.setOptions(a);
			this.workingHeader = this.header();
			this.workingModel = this.model();
			this._buildHtml();
			this.content.addClass("lbx_showed");
			this.fireEvent("open")
		},
		close: function () {
			if (this.content) {
				this.content.removeClass("lbx_showed");
				this._closeTimer = function () {
					this.content.destroy();
					this.content = null;
					if (this.overlay) {
						this.overlay.destroy();
						this.overlay = null
					}
					this.fireEvent("close")
				}.delay(400, this)
			}
		},
		toggle: function (a) {
			this[this.isOpened() ? "close" : "open"](a)
		},
		isOpened: function () {
			return this.content && this.content.hasClass("lbx_showed") ? true : false
		},
		setTitle: function (a) {
			this.isOpened() && this.content.getElement(".lbx_header").set("text", a)
		},
		_buildHtml: function () {
			if (this.content) return this;
			var a;
			a = {
				tag: "div",
				className: "lbx_overlay"
			};
			if (this.showOverlay) this.overlay = this.builder.buildDomModel(document.body, a);
			a = {
				tag: "div",
				className: "lbx_window " + (this.className || ""),
				styles: {
					position: "absolute",
					visibility: "hidden",
					zIndex: 10050
				},
				childs: [{
					tag: "div",
					className: "lbx_container",
					childs: [{
						tag: "a",
						id: "exit",
						events: [{
							click: this.close.bind(this)}]},
					{
						tag: "span",
						className: "lbx_header",
						html: this.workingHeader},
					{
						tag: "div",
						className: "lbx_content",
						childs: []}]}]
			};
			if (typeOf(this.workingModel) == "object") a.childs[0].childs[2].childs[0] = this.workingModel;
			else a.childs[0].childs[2].childs.push({
				tag: "p",
				className: "simple_text",
				html: this.workingModel
			});
			this.content = this.builder.buildDomModel(document.body, a);
			this.content.setStyles(this._center());
			this.content.setStyle("visibility", "visible");
			Browser.isMobile || new Drag(this.content, {
				handle: this.content.getElement(".lbx_header"),
				checkDroppables: false,
				limit: {
					x: [0, window.getWidth() - this.content.getWidth()],
					y: [0, window.getHeight() - this.content.getHeight()]
				}
			});
			return this
		},
		_center: function () {
			var a = {
				top: 0,
				left: 0
			};
			a.left = window.getWidth() / 2 - this.content.getWidth() / 2;
			a.top = window.getScroll().y + window.getHeight() / 2 - this.content.getHeight() / 2;
			a.left = a.left > 0 ? a.left : 0;
			a.top = a.top > 0 ? a.top : 0;
			return a
		}
	})
}).call(Solitaire);
(function () {
	this.Window.Alert = new Class({
		Extends: Solitaire.Window.Abstract,
		className: "lbx_alert",
		header: function () {
			return this.options.alertTitle
		},
		model: function () {
			return {
				tag: "div",
				className: "tab_contents",
				childs: [{
					tag: "div",
					className: "rules_cont",
					html: this.options.alertText},
				{
					tag: "div",
					className: "rules_buttons",
					childs: [{
						tag: "input",
						type: "button",
						value: "OK",
						events: [{
							click: this.close.bind(this)}]}]}]
			}
		},
		open: function (a, b) {
			this.parent({
				alertTitle: a,
				alertText: b
			})
		}
	})
}).call(Solitaire);
(function () {
	this.Window.Auth = new Class({
		Extends: Solitaire.Window.Abstract,
		Binds: ["onGoToLoginFormClick", "onGoToRegistryFormClick", "onClickNewGame", "onLogoutClick", "onCloseClick"],
		forms: {
			REGISTER: "register",
			LOGIN: "login",
			INFO: "info"
		},
		className: "lbx_auth",
		header: function () {
			return ""
		},
		model: function () {
			return {
				tag: "div",
				className: "tab_contents",
				childs: [{
					tag: "div",
					className: "auth_cont lbx_cont",
					childs: [{
						tag: "div",
						className: "auth_register lbx_cont_row",
						styles: {
							display: "none"
						},
						childs: [{
							tag: "form",
							action: "#",
							"data-form": "register",
							childs: [{
								tag: "div",
								className: "rows",
								childs: [{
									tag: "div",
									className: "row",
									childs: [{
										tag: "p",
										className: "register_desc",
										html: Solitaire.Lang.getString("auth.register-desc")}]},
								{
									tag: "div",
									className: "row",
									childs: [{
										tag: "span",
										html: Solitaire.Lang.getString("auth.label-player-name")},
									{
										tag: "input",
										type: "text",
										value: "",
										name: "name",
										placeholder: Solitaire.Lang.getString("auth.placeholder-player-name"),
										maxLength: 20,
										required: "true",
										pattern: ".{3,20}"}]},
								{
									tag: "div",
									className: "row",
									childs: [{
										tag: "span",
										html: Solitaire.Lang.getString("auth.label-password")},
									{
										tag: "input",
										type: "password",
										value: "",
										name: "password",
										placeholder: Solitaire.Lang.getString("auth.placeholder-password"),
										maxLength: 20,
										required: "true",
										pattern: ".{3,20}"}]},
								{
									tag: "div",
									className: "auth_valid_info",
									html: Solitaire.Lang.getString("auth.valid-info")}]},
							{
								tag: "div",
								className: "auth_register lbx_buttons",
								styles: {
									display: "none"
								},
								childs: [{
									tag: "input",
									type: "submit",
									value: Solitaire.Lang.getString("auth.register-button")},
								{
									tag: "span",
									className: "or",
									html: " " + Solitaire.Lang.getString("or") + " "},
								{
									tag: "a",
									href: "#",
									html: Solitaire.Lang.getString("auth.login-link-form"),
									events: [{
										click: this.onGoToLoginFormClick}]}]}]}]},
					{
						tag: "div",
						className: "auth_login lbx_cont_row",
						styles: {
							display: "none"
						},
						childs: [{
							tag: "form",
							action: "#",
							"data-form": "login",
							childs: [{
								tag: "div",
								className: "rows",
								childs: [{
									tag: "div",
									className: "row",
									childs: [{
										tag: "p",
										className: "login_desc",
										html: Solitaire.Lang.getString("auth.login-desc")}]},
								{
									tag: "div",
									className: "row",
									childs: [{
										tag: "span",
										html: Solitaire.Lang.getString("auth.label-player-name")},
									{
										tag: "input",
										type: "text",
										value: "",
										name: "name",
										placeholder: Solitaire.Lang.getString("auth.placeholder-player-name"),
										maxLength: 20,
										required: "true",
										pattern: ".{3,20}"}]},
								{
									tag: "div",
									className: "row",
									childs: [{
										tag: "span",
										html: Solitaire.Lang.getString("auth.label-password")},
									{
										tag: "input",
										type: "password",
										value: "",
										name: "password",
										placeholder: Solitaire.Lang.getString("auth.placeholder-password"),
										maxLength: 20,
										required: "true",
										pattern: ".{3,20}"}]},
								{
									tag: "div",
									className: "auth_valid_info",
									html: Solitaire.Lang.getString("auth.valid-info")}]},
							{
								tag: "div",
								className: "auth_login lbx_buttons",
								styles: {
									display: "none"
								},
								childs: [{
									tag: "input",
									type: "submit",
									value: Solitaire.Lang.getString("auth.login-button")},
								{
									tag: "span",
									className: "or",
									html: " " + Solitaire.Lang.getString("or") + " "},
								{
									tag: "a",
									href: "#",
									html: Solitaire.Lang.getString("auth.register-link-form"),
									events: [{
										click: this.onGoToRegistryFormClick}]}]}]}]},
					{
						tag: "div",
						className: "auth_info lbx_cont_row",
						styles: {
							display: "none"
						},
						childs: [{
							tag: "div",
							className: "rows",
							childs: [{
								tag: "div",
								className: "row",
								childs: [{
									tag: "p",
									className: "welcome_player",
									html: Solitaire.Lang.getString("auth.info-welcome").substitute(this.options.player_data || {})},
								{
									tag: "p",
									className: "info_desc",
									html: Solitaire.Lang.getString("auth.info-created").substitute(this.options.player_data || {})},
								{
									tag: "p",
									className: "info_desc",
									html: Solitaire.Lang.getString("auth.info-last-login").substitute(this.options.player_data || {})},
								{
									tag: "p",
									className: "info_desc",
									html: Solitaire.Lang.getString("auth.info-country").substitute(this.options.player_data || {})}]}]},
						{
							tag: "div",
							className: "auth_info lbx_buttons",
							styles: {
								display: "none"
							},
							childs: [{
								tag: "input",
								type: "button",
								value: "Ok",
								events: [{
									click: this.onCloseClick}]},
							{
								tag: "span",
								className: "or",
								html: " " + Solitaire.Lang.getString("or") + " "},
							{
								tag: "a",
								href: "#",
								html: Solitaire.Lang.getString("auth.logout-link"),
								events: [{
									click: this.onLogoutClick}]}]}]}]}]
			}
		},
		options: {},
		initialize: function (a) {
			this.storage = new Solitaire.Storage;
			this.parent(a)
		},
		open: function (a, b) {
			if (!Solitaire.DEBUG) document.onmousedown = function () {
				return true
			};
			Browser.isMobile && Solitaire.MouseEventSimulator.preventEvent(false);
			this.parent();
			this.initEvents();
			this._showForm(a, b);
			new Solitaire.Filter.UserName(this.content.getElement(".auth_login input[name=name]"));
			new Solitaire.Filter.UserName(this.content.getElement(".auth_register input[name=name]"))
		},
		close: function (a) {
			if (!Solitaire.DEBUG) document.onmousedown = function () {
				return false
			};
			Browser.isMobile && Solitaire.MouseEventSimulator.preventEvent(true);
			this.parent(a)
		},
		initEvents: function () {
			var a = this.content.getElements;
			a(".auth_cont form").addEvent("submit", function (b) {
				b.preventDefault();
				if (b.target.get("data-form")) {
					this._fireAction(b.target.get("data-form"));
					this.close()
				}
			}.bind(this))
		},
		onLogoutClick: function (a) {
			a.preventDefault();
			this.fireEvent("clickLogout");
			this.close()
		},
		onCloseClick: function () {
			this.close()
		},
		onGoToLoginFormClick: function (a) {
			a.preventDefault();
			this._showForm(this.forms.LOGIN)
		},
		onGoToRegistryFormClick: function (a) {
			a.preventDefault();
			this._showForm(this.forms.REGISTER)
		},
		_showForm: function (a, b) {
			var d = this.content.getElements;
			d(".lbx_cont_row, .lbx_buttons").hide();
			d(".auth_" + a).show();
			if (a != "info") {
				d = this.content.getElement("." + a + "_desc");
				d.set("html", Solitaire.Lang.getString("auth." + a + "-" + (b ? "error" : "desc")));
				d[b ? "addClass" : "removeClass"]("form_error")
			}(function () {
				var c = this.content.getElement(".auth_" + a + " input[type=text]");
				c && c.focus()
			}).delay(200, this);
			this.content.getElement(".lbx_header").setStyle("background-color", a == "register" ? "#3D7AAD" : "#91b57b");
			this.setTitle(Solitaire.Lang.getString("auth." + a + "-header"))
		},
		_fireAction: function (a) {
			var b = this.content.getElements,
				d = {};
			b(".auth_" + a + " input").each(function (c) {
				d[c.name] = c.value
			}.bind(this));
			this.fireEvent("click" + a.ucFirst(), d)
		}
	})
}).call(Solitaire);
(function () {
	this.Window.Confirm = new Class({
		Extends: Solitaire.Window.Abstract,
		className: "lbx_confirm",
		showOverlay: true,
		header: function () {
			return this.options.confirmTitle
		},
		model: function () {
			return {
				tag: "div",
				className: "tab_contents",
				childs: [{
					tag: "div",
					className: "rules_cont",
					html: this.options.confirmText},
				{
					tag: "div",
					className: "rules_buttons",
					childs: [{
						tag: "input",
						type: "button",
						value: Solitaire.Lang.getString("cancel"),
						events: [{
							click: function () {
								this.fireEvent("change", ["cancel"])
							}.bind(this)}]},
					{
						tag: "input",
						type: "button",
						value: "OK",
						events: [{
							click: function () {
								this.fireEvent("change", ["ok"])
							}.bind(this)}]}]}]
			}
		},
		open: function (a, b) {
			this.parent({
				confirmTitle: a,
				confirmText: b
			})
		}
	})
}).call(Solitaire);
(function () {
	this.Window.Games = new Class({
		Extends: Solitaire.Window.Abstract,
		Binds: ["onOptionClick", "onPlayClick", "onRulesClick"],
		className: "lbx_games",
		showOverlay: true,
		header: function () {
			return Solitaire.Lang.getString("optionWindowTabGameHeader")
		},
		model: function () {
			return {
				tag: "div",
				className: "games_wrapper",
				childs: [{
					tag: "div",
					className: "games_window",
					childs: []},
				{
					tag: "div",
					className: "option_item show_on_start checkbox",
					childs: []},
				{
					tag: "div",
					className: "ads",
					childs: [{
						tag: "iframe",
						src: FULLADDR + "ads-" + (Solitaire.PLATFORM == "chrome" ? "chrome" : "web") + ".html/games",
						scrolling: "no",
						frameborder: "0",
						vspace: "0",
						marginheight: "0",
						marginwidth: "0",
						hspace: "0",
						allowtransparency: "true",
						styles: {
							width: 468,
							height: 60
						}}]},
				{
					tag: "div",
					className: "game_button_cont",
					childs: [{
						tag: "input",
						type: "button",
						value: Solitaire.Lang.getString("game.play"),
						events: [{
							click: this.onPlayClick}]}]}]
			}
		},
		games: [{
			type: "radio",
			id: "game",
			items: [{
				name: function () {
					return Solitaire.Lang.getString("klondike:turn-one")
				},
				desc: function () {
					return Solitaire.Lang.getString("rules.content.klondike:turn-one")
				},
				value: "klondike:turn-one",
				difficulty_level: 2},
			{
				name: function () {
					return Solitaire.Lang.getString("klondike:turn-three")
				},
				desc: function () {
					return Solitaire.Lang.getString("rules.content.klondike:turn-three")
				},
				value: "klondike:turn-three",
				difficulty_level: 4},
			{
				name: function () {
					return Solitaire.Lang.getString("double-klondike:turn-one")
				},
				desc: function () {
					return Solitaire.Lang.getString("rules.content.double-klondike:turn-one")
				},
				value: "double-klondike:turn-one",
				difficulty_level: 3},
			{
				name: function () {
					return Solitaire.Lang.getString("double-klondike:turn-three")
				},
				desc: function () {
					return Solitaire.Lang.getString("rules.content.double-klondike:turn-three")
				},
				value: "double-klondike:turn-three",
				difficulty_level: 4},
			{
				name: function () {
					return Solitaire.Lang.getString("spider:one-suit")
				},
				desc: function () {
					return Solitaire.Lang.getString("rules.content.spider:one-suit")
				},
				value: "spider:one-suit",
				difficulty_level: 1},
			{
				name: function () {
					return Solitaire.Lang.getString("spider:two-suits")
				},
				desc: function () {
					return Solitaire.Lang.getString("rules.content.spider:two-suits")
				},
				value: "spider:two-suits",
				difficulty_level: 3},
			{
				name: function () {
					return Solitaire.Lang.getString("spider:four-suits")
				},
				desc: function () {
					return Solitaire.Lang.getString("rules.content.spider:four-suits")
				},
				value: "spider:four-suits",
				difficulty_level: 5},
			{
				name: function () {
					return Solitaire.Lang.getString("forty-thieves")
				},
				desc: function () {
					return Solitaire.Lang.getString("rules.content.forty-thieves")
				},
				value: "forty-thieves",
				difficulty_level: 5}]}],
		options: {
			game: "klondike:turn-one",
			showOnStartup: true
		},
		selectedGame: "",
		onOptionClick: function (a) {
			var b, d, c;
			b = a.target;
			b.hasClass("option_item") || (d = b.getParent(".option_item"));
			b.hasClass("option_item_entry") || (b = a.target.getParent(".option_item_entry"));
			a.preventDefault();
			d.hasClass("radio") && d.getChildren().each(function (e) {
				e.removeClass("selected");
				if (e == b) {
					e.addClass("selected");
					c = b.get("rel").split("|")[1];
					if (b.get("rel").split("|")[0] == "game") this.selectedGame = c
				}
			}.bind(this));
			if (d.hasClass("checkbox")) {
				if (b.hasClass("selected")) {
					b.removeClass("selected");
					c = 0
				} else {
					b.addClass("selected");
					c = 1
				}
				this.fireEvent("change", ["showOnStartup", c])
			}
		},
		onPlayClick: function () {
			this.fireEvent("change", ["game", this.selectedGame || this.options.game])
		},
		onRulesClick: function () {
			(new Solitaire.Window.Rules).open(this.selectedGame || this.options.game)
		},
		open: function (a) {
			this.parent(a)
		},
		close: function (a) {
			Browser.isMobile && Solitaire.MouseEventSimulator.preventEvent(true);
			this.parent(a)
		},
		_buildHtml: function () {
			var a, b = [],
				d, c;
			this.games.each(function (e) {
				d = {
					tag: "div",
					className: "option_item " + e.type,
					childs: []
				};
				e.items.each(function (f) {
					c = e.type == "checkbox" ? this.options[e.id] ? "selected" : "" : this.options[e.id] == f.value ? "selected" : "";
					b = [];
					for (a = 0; a < 5; a++) b.push({
						tag: "img",
						src: SS + "images/star" + (f.difficulty_level > a ? "" : "_gray") + ".png",
						alt: ""
					});
					b.push({
						tag: "span",
						className: "caption",
						html: Solitaire.Lang.getString("difficulty-level", "")
					});
					var g = f.name(),
						h;
					h = f.desc().substr(0, 150) + " ... ";
					if (f.disabled) {
						g += " (" + Solitaire.Lang.getString("coming-soon") + ")";
						h = ""
					}
					d.childs.push({
						tag: "a",
						rel: e.id + "|" + f.value,
						className: "option_item_entry " + c + (f.disabled ? " disabled" : ""),
						events: [{
							click: f.disabled ? $stop : this.onOptionClick}],
						childs: [{
							tag: "img",
							className: "game_preview",
							src: SS + "images/games/" + f.value.replace(":", "-") + ".jpg"},
						{
							tag: "span",
							className: "stars",
							childs: b},
						{
							tag: "span",
							className: "game_name",
							html: g},
						{
							tag: "p",
							className: "game_desc",
							childs: [{
								tag: "TextNode",
								html: h},
							{
								tag: "a",
								href: "#",
								className: "more",
								html: "wi\u0119cej",
								events: [{
									click: this.onRulesClick}]}]}]
					})
				}.bind(this));
				this.workingModel.childs[0].childs.push(d)
			}.bind(this));
			this.workingModel.childs[1].childs.push({
				tag: "a",
				className: "option_item_entry min " + (this.options.showOnStartup ? "selected" : ""),
				events: [{
					click: this.onOptionClick}],
				html: Solitaire.Lang.getString("game.show-on-startup")
			});
			this.parent()
		}
	})
}).call(Solitaire);
(function () {
	this.Window.Info = new Class({
		Extends: Solitaire.Window.Abstract,
		Binds: ["onSendClick", "onBackClick"],
		className: "lbx_info",
		header: function () {
			return Solitaire.Lang.getString("infoHeader")
		},
		model: function () {
			return {
				tag: "div",
				className: "info_content",
				childs: [{
					tag: "div",
					className: "tab_buttons",
					childs: [{
						tag: "a",
						html: Solitaire.Lang.getString("infoTabContactHeader"),
						className: "tab_selected"},
					{
						tag: "a",
						html: Solitaire.Lang.getString("infoTabChangeLogHeader")}]},
				{
					tag: "div",
					className: "tab_contents",
					styles: {
						display: "block"
					},
					childs: [{
						tag: "div",
						className: "contact_cont",
						childs: [{
							tag: "div",
							id: "contact_form",
							childs: [{
								tag: "div",
								className: "contact_label",
								html: Solitaire.Lang.getString("infoTabContactLabel")},
							{
								tag: "div",
								className: "contact_form",
								childs: [{
									tag: "textarea",
									id: "contact_message",
									placeholder: Solitaire.Lang.getString("infoTabContactMessagePlaceholder")},
								{
									tag: "input",
									id: "contact_email",
									type: "input",
									value: "",
									placeholder: Solitaire.Lang.getString("infoTabContactEmailPlaceholder")},
								{
									tag: "input",
									id: "contact_send",
									type: "button",
									value: Solitaire.Lang.getString("infoTabContactSubmit"),
									events: [{
										click: this.onSendClick}]}]},
							{
								tag: "span",
								className: "",
								html: Solitaire.Lang.getString("infoTabContactChromeApp")},
							{
								tag: "a",
								href: "https://chrome.google.com/webstore/detail/blpebaehgfgkcmmjjknibibbjacnplim",
								className: "contact_addon",
								target: "_blank",
								html: "chrome"},
							{
								tag: "textNode",
								data: ", "},
							{
								tag: "a",
								href: "https://addons.mozilla.org/firefox/addon/solitairepasjans/",
								className: "contact_addon",
								target: "_blank",
								html: "firefox"},
							{
								tag: "textNode",
								data: ", "},
							{
								tag: "a",
								href: "https://addons.opera.com/addons/extensions/details/pasjanssolitaire",
								className: "contact_addon",
								target: "_blank",
								html: "opera"},
							{
								tag: "form",
								target: "_blank",
								id: "donate",
								action: "https://www.paypal.com/cgi-bin/webscr",
								method: "post",
								childs: [{
									tag: "input",
									type: "hidden",
									name: "cmd",
									value: "_s-xclick"},
								{
									tag: "input",
									type: "hidden",
									name: "encrypted",
									value: "-----BEGIN PKCS7-----MIIHNwYJKoZIhvcNAQcEoIIHKDCCByQCAQExggEwMIIBLAIBADCBlDCBjjELMAkGA1UEBhMCVVMxCzAJBgNVBAgTAkNBMRYwFAYDVQQHEw1Nb3VudGFpbiBWaWV3MRQwEgYDVQQKEwtQYXlQYWwgSW5jLjETMBEGA1UECxQKbGl2ZV9jZXJ0czERMA8GA1UEAxQIbGl2ZV9hcGkxHDAaBgkqhkiG9w0BCQEWDXJlQHBheXBhbC5jb20CAQAwDQYJKoZIhvcNAQEBBQAEgYAqBvk6IWxgZifR8L7kjg93mlaQS7x3uZnHIwqyZbI7AnSRCQOyJq/euPpDfhIxfTKFnhD5mx8bcodyH7YYrW+8o/4823H9BWZipdSR1SXEQh1drkGwnwTdcyDr3Muf59HsGthvkK19XFqIdCRhsbvTj3OTupwluArZeIeW0m7rfDELMAkGBSsOAwIaBQAwgbQGCSqGSIb3DQEHATAUBggqhkiG9w0DBwQIvuBjBfeIaKGAgZDgpsVbdqg3i/t8P0kC8WVAKy6wUho4rNVXQfW7wenWM9ldsB/SWlsJXrWuUABJvUBlnuZug1T5OcokEop3peZsWblvqqAZo/Ty86hdgai6KjZN36v8l6lU6jQit9zcGCVNQRHLcbnBypG/z3h/mQjOjzax4wa1ET9XLE1vp90Rix26nyW7zvHw6Jk7ITun132gggOHMIIDgzCCAuygAwIBAgIBADANBgkqhkiG9w0BAQUFADCBjjELMAkGA1UEBhMCVVMxCzAJBgNVBAgTAkNBMRYwFAYDVQQHEw1Nb3VudGFpbiBWaWV3MRQwEgYDVQQKEwtQYXlQYWwgSW5jLjETMBEGA1UECxQKbGl2ZV9jZXJ0czERMA8GA1UEAxQIbGl2ZV9hcGkxHDAaBgkqhkiG9w0BCQEWDXJlQHBheXBhbC5jb20wHhcNMDQwMjEzMTAxMzE1WhcNMzUwMjEzMTAxMzE1WjCBjjELMAkGA1UEBhMCVVMxCzAJBgNVBAgTAkNBMRYwFAYDVQQHEw1Nb3VudGFpbiBWaWV3MRQwEgYDVQQKEwtQYXlQYWwgSW5jLjETMBEGA1UECxQKbGl2ZV9jZXJ0czERMA8GA1UEAxQIbGl2ZV9hcGkxHDAaBgkqhkiG9w0BCQEWDXJlQHBheXBhbC5jb20wgZ8wDQYJKoZIhvcNAQEBBQADgY0AMIGJAoGBAMFHTt38RMxLXJyO2SmS+Ndl72T7oKJ4u4uw+6awntALWh03PewmIJuzbALScsTS4sZoS1fKciBGoh11gIfHzylvkdNe/hJl66/RGqrj5rFb08sAABNTzDTiqqNpJeBsYs/c2aiGozptX2RlnBktH+SUNpAajW724Nv2Wvhif6sFAgMBAAGjge4wgeswHQYDVR0OBBYEFJaffLvGbxe9WT9S1wob7BDWZJRrMIG7BgNVHSMEgbMwgbCAFJaffLvGbxe9WT9S1wob7BDWZJRroYGUpIGRMIGOMQswCQYDVQQGEwJVUzELMAkGA1UECBMCQ0ExFjAUBgNVBAcTDU1vdW50YWluIFZpZXcxFDASBgNVBAoTC1BheVBhbCBJbmMuMRMwEQYDVQQLFApsaXZlX2NlcnRzMREwDwYDVQQDFAhsaXZlX2FwaTEcMBoGCSqGSIb3DQEJARYNcmVAcGF5cGFsLmNvbYIBADAMBgNVHRMEBTADAQH/MA0GCSqGSIb3DQEBBQUAA4GBAIFfOlaagFrl71+jq6OKidbWFSE+Q4FqROvdgIONth+8kSK//Y/4ihuE4Ymvzn5ceE3S/iBSQQMjyvb+s2TWbQYDwcp129OPIbD9epdr4tJOUNiSojw7BHwYRiPh58S1xGlFgHFXwrEBb3dgNbMUa+u4qectsMAXpVHnD9wIyfmHMYIBmjCCAZYCAQEwgZQwgY4xCzAJBgNVBAYTAlVTMQswCQYDVQQIEwJDQTEWMBQGA1UEBxMNTW91bnRhaW4gVmlldzEUMBIGA1UEChMLUGF5UGFsIEluYy4xEzARBgNVBAsUCmxpdmVfY2VydHMxETAPBgNVBAMUCGxpdmVfYXBpMRwwGgYJKoZIhvcNAQkBFg1yZUBwYXlwYWwuY29tAgEAMAkGBSsOAwIaBQCgXTAYBgkqhkiG9w0BCQMxCwYJKoZIhvcNAQcBMBwGCSqGSIb3DQEJBTEPFw0xMTAyMDkxODUwMDBaMCMGCSqGSIb3DQEJBDEWBBTl7I6JtfKZfXqJyk4M96KVkL0RYDANBgkqhkiG9w0BAQEFAASBgCYxn81wyqd/7GO6U3TN4s+j1T1HimFYJm3zM7E+T/TwbFqB6K4Ey9e1kzTpN2fcr/igie8uRiHMkeAV7LN4UQDYBpy2l4I3LIVmRu1OORTpASzuUoBRM4wNjzUOxEHffcOK0nIhVW85FjXry8ldtJalRI+vDWhU0fW5TqvfPowz-----END PKCS7-----"}]}]},
						{
							tag: "div",
							id: "contact_sent",
							styles: {
								display: "none"
							},
							childs: [{
								tag: "div",
								className: "contact_sent",
								html: Solitaire.Lang.getString("infoTabContactSent")},
							{
								tag: "input",
								styles: {
									display: "none"
								},
								type: "button",
								id: "contact_back",
								value: Solitaire.Lang.getString("infoTabContactBack"),
								events: [{
									click: this.onBackClick}]}]}]}]},
				{
					tag: "div",
					className: "tab_contents",
					styles: {
						display: "none"
					},
					childs: [{
						tag: "div",
						className: "changelog_cont",
						childs: [{
							tag: "div",
							className: "changelog_items",
							childs: []}]}]}]
			}
		},
		open: function (a) {
			Browser.isMobile && Solitaire.MouseEventSimulator.preventEvent(false);
			this.parent(a)
		},
		close: function (a) {
			Browser.isMobile && Solitaire.MouseEventSimulator.preventEvent(true);
			this.parent(a)
		},
		onSendClick: function () {
			if ($("contact_message").value) {
				$("contact_form").hide();
				$("contact_email").hide();
				$("contact_sent").show();
				$("contact_sent").getElement(".contact_sent").innerHTML = Solitaire.Lang.getString("infoTabContactSending");
				var a = "";
				a += navigator.userAgent + "\n\n";
				a += "Screen roboczy: " + window.getWidth() + "x" + window.getHeight() + "\n\n";
				if (Cookie.read("opt")) a += "Ustawienia: " + Cookie.read("opt") + "\n\n";
				if ($("contact_email").value) a += "Email: " + $("contact_email").value + "\n\n";
				if ($("contact_message").value) a += "Tre\u015b\u0107: " + $("contact_message").value + "\n\n";
				a = new Element("iframe", {
					src: "http://backend.pasjans-online.pl/contact.html?" + encodeURIComponent("\u0179r\u00f3d\u0142o: (" + Solitaire.PLATFORM + "-" + Solitaire.VERSION + ")\n\n" + a)
				});
				$(document.body).appendChild(a);
				a.setStyle("display", "none");
				$("contact_sent").getElement(".contact_sent").innerHTML =
				Solitaire.Lang.getString("infoTabContactSent");
				$("contact_back").show();
				$("contact_message").value = "";
				$("contact_email").value = ""
			}
		},
		onBackClick: function () {
			$("contact_form").show();
			$("contact_email").show();
			$("contact_sent").hide();
			$("contact_message").focus()
		},
		_buildHtml: function () {
			var a = 0;
			Object.each(Solitaire.Lang.getString("infoTabChangeLogItems"), function (b, d) {
				a++;
				this.workingModel.childs[2].childs[0].childs[0].childs.push({
					tag: "div",
					className: a % 2 ? "item even" : "item",
					childs: [{
						tag: "div",
						className: "date",
						html: d},
					{
						tag: "div",
						className: "text",
						html: b}]
				})
			}.bind(this));
			this.parent();
			$("contact_message").focus();
			new Solitaire.Tab({
				tabs_button: this.content.getElements(".tab_buttons a"),
				tabs_content: this.content.getElements(".tab_contents"),
				active_tab_class: "tab_selected"
			});
			return this
		}
	})
}).call(Solitaire);
(function () {
	this.Window.Options = new Class({
		Extends: Solitaire.Window.Abstract,
		Binds: ["onOptionClick"],
		header: function () {
			return Solitaire.Lang.getString("optionWindowHeader")
		},
		model: function () {
			return {
				tag: "div",
				className: "options_window",
				childs: [{
					tag: "div",
					className: "tab_buttons",
					childs: [{
						tag: "a",
						html: Solitaire.Lang.getString("optionWindowTabScoringHeader")},
					{
						tag: "a",
						html: Solitaire.Lang.getString("optionWindowTabSettingsHeader"),
						className: "tab_selected"},
					{
						tag: "a",
						html: Solitaire.Lang.getString("optionWindowTabLanguageHeader")}]},
				{
					tag: "div",
					className: "tab_contents",
					styles: {
						display: "none"
					},
					childs: []},
				{
					tag: "div",
					className: "tab_contents",
					styles: {
						display: "block"
					},
					childs: []},
				{
					tag: "div",
					className: "tab_contents",
					styles: {
						display: "none"
					},
					childs: []}]
			}
		},
		scoring: [{
			type: "radio",
			id: "scoring",
			items: [{
				name: function () {
					return Solitaire.Lang.getString("scoringStandardMode")
				},
				value: "standard"},
			{
				name: function () {
					return Solitaire.Lang.getString("scoringTimedMode")
				},
				value: "timed"}]}],
		main: [{
			type: "label",
			value: function () {
				return Solitaire.Lang.getString("optionWindowTabSettingsAutoHeader")
			}},
		{
			type: "checkbox",
			id: "autoFlip",
			items: [{
				name: function () {
					return Solitaire.Lang.getString("optionWindowTabSettingsAutoFlip")
				}}]},
		{
			type: "radio",
			id: "autoMove",
			items: [{
				name: function () {
					return Solitaire.Lang.getString("optionWindowTabSettingsAutoMoveWhenWon")
				},
				value: "when_won"},
			{
				name: function () {
					return Solitaire.Lang.getString("optionWindowTabSettingsAutoMoveOff")
				},
				value: "off"}]},
		{
			type: "label",
			value: function () {
				var a = Solitaire.Lang.getString("option.settings-sound-header");
				document.createElement("audio").canPlayType || (a += " (" + Solitaire.Lang.getString("option.settings-sound-header-not-supported") + ")");
				return a
			}},
		{
			type: "radio",
			id: "sound",
			items: [{
				name: function () {
					return Solitaire.Lang.getString("option.settings-sound-pack-wood")
				},
				value: "wood"},
			{
				name: function () {
					return Solitaire.Lang.getString("option.settings-sound-pack-plastic")
				},
				value: "plastic"},
			{
				name: function () {
					return Solitaire.Lang.getString("option.settings-sound-off")
				},
				value: "off"}]},
		{
			type: "label",
			value: function () {
				return Solitaire.Lang.getString("optionWindowTabSettingsControlHeader")
			}},
		{
			type: "checkbox",
			id: "showTime",
			items: [{
				name: function () {
					return Solitaire.Lang.getString("optionWindowTabSettingsControlTime")
				}}]},
		{
			type: "checkbox",
			id: "showScore",
			items: [{
				name: function () {
					return Solitaire.Lang.getString("optionWindowTabSettingsControlScores")
				}}]},
		{
			type: "checkbox",
			id: "showMoves",
			items: [{
				name: function () {
					return Solitaire.Lang.getString("optionWindowTabSettingsControlMoves")
				}}]}],
		languages: [{
			type: "radio",
			id: "lang",
			items: [{
				name: function () {
					return Solitaire.Lang.getString("optionWindowTabSettingsLangAr")
				},
				value: "ar"},
			{
				name: function () {
					return Solitaire.Lang.getString("optionWindowTabSettingsLangBg")
				},
				value: "bg"},
			{
				name: function () {
					return Solitaire.Lang.getString("optionWindowTabSettingsLangBs")
				},
				value: "bs"},
			{
				name: function () {
					return Solitaire.Lang.getString("optionWindowTabSettingsLangZhCn")
				},
				value: "zh-cn"},
			{
				name: function () {
					return Solitaire.Lang.getString("optionWindowTabSettingsLangCa")
				},
				value: "ca"},
			{
				name: function () {
					return Solitaire.Lang.getString("optionWindowTabSettingsLangCs")
				},
				value: "cs"},
			{
				name: function () {
					return Solitaire.Lang.getString("optionWindowTabSettingsLangDa")
				},
				value: "da"},
			{
				name: function () {
					return Solitaire.Lang.getString("optionWindowTabSettingsLangNl")
				},
				value: "nl"},
			{
				name: function () {
					return Solitaire.Lang.getString("optionWindowTabSettingsLangEnUs")
				},
				value: "en-us"},
			{
				name: function () {
					return Solitaire.Lang.getString("optionWindowTabSettingsLangEt")
				},
				value: "et"},
			{
				name: function () {
					return Solitaire.Lang.getString("optionWindowTabSettingsLangFi")
				},
				value: "fi"},
			{
				name: function () {
					return Solitaire.Lang.getString("optionWindowTabSettingsLangFr")
				},
				value: "fr"},
			{
				name: function () {
					return Solitaire.Lang.getString("optionWindowTabSettingsLangGl")
				},
				value: "gl"},
			{
				name: function () {
					return Solitaire.Lang.getString("optionWindowTabSettingsLangKa")
				},
				value: "ka"},
			{
				name: function () {
					return Solitaire.Lang.getString("optionWindowTabSettingsLangDe")
				},
				value: "de"},
			{
				name: function () {
					return Solitaire.Lang.getString("optionWindowTabSettingsLangEl")
				},
				value: "el"},
			{
				name: function () {
					return Solitaire.Lang.getString("optionWindowTabSettingsLangHe")
				},
				value: "he"},
			{
				name: function () {
					return Solitaire.Lang.getString("optionWindowTabSettingsLangHu")
				},
				value: "hu"},
			{
				name: function () {
					return Solitaire.Lang.getString("optionWindowTabSettingsLangIt")
				},
				value: "it"},
			{
				name: function () {
					return Solitaire.Lang.getString("optionWindowTabSettingsLangJa")
				},
				value: "ja"},
			{
				name: function () {
					return Solitaire.Lang.getString("optionWindowTabSettingsLangKo")
				},
				value: "ko"},
			{
				name: function () {
					return Solitaire.Lang.getString("optionWindowTabSettingsLangLv")
				},
				value: "lv"},
			{
				name: function () {
					return Solitaire.Lang.getString("optionWindowTabSettingsLangNnNo")
				},
				value: "nn-no"},
			{
				name: function () {
					return Solitaire.Lang.getString("optionWindowTabSettingsLangPl")
				},
				value: "pl-pl"},
			{
				name: function () {
					return Solitaire.Lang.getString("optionWindowTabSettingsLangPtBr")
				},
				value: "pt-br"},
			{
				name: function () {
					return Solitaire.Lang.getString("optionWindowTabSettingsLangRo")
				},
				value: "ro"},
			{
				name: function () {
					return Solitaire.Lang.getString("optionWindowTabSettingsLangRu")
				},
				value: "ru"},
			{
				name: function () {
					return Solitaire.Lang.getString("optionWindowTabSettingsLangSr")
				},
				value: "sr"},
			{
				name: function () {
					return Solitaire.Lang.getString("optionWindowTabSettingsLangSl")
				},
				value: "sl"},
			{
				name: function () {
					return Solitaire.Lang.getString("optionWindowTabSettingsLangEsEs")
				},
				value: "es-es"},
			{
				name: function () {
					return Solitaire.Lang.getString("optionWindowTabSettingsLangSvSe")
				},
				value: "sv-se"},
			{
				name: function () {
					return Solitaire.Lang.getString("optionWindowTabSettingsLangTr")
				},
				value: "tr"},
			{
				name: function () {
					return Solitaire.Lang.getString("optionWindowTabSettingsLangUk")
				},
				value: "uk"},
			{
				name: function () {
					return Solitaire.Lang.getString("optionWindowTabSettingsLangVi")
				},
				value: "vi"},
			{
				name: function () {
					return Solitaire.Lang.getString("optionWindowTabSettingsLangCy")
				},
				value: "cy"}]}],
		options: {
			autoFlip: true,
			autoMove: "when_won",
			sound: "wood",
			lang: "en-us",
			scoring: "timed",
			showMoves: true,
			showScore: true,
			showTime: true
		},
		open: function (a) {
			Browser.isMobile && Solitaire.MouseEventSimulator.preventEvent(false);
			this.parent(a)
		},
		close: function (a) {
			Browser.isMobile && Solitaire.MouseEventSimulator.preventEvent(true);
			this.parent(a)
		},
		onOptionClick: function (a) {
			var b, d, c;
			b = a.target;
			b.hasClass("option_item") || (d = b.getParent(".option_item"));
			b.hasClass("option_item_entry") || (b = a.target.getParent(".option_item_entry"));
			a.preventDefault();
			d.hasClass("radio") && d.getChildren().each(function (e) {
				e.removeClass("selected");
				if (e == b) {
					e.addClass("selected");
					c = b.get("rel").split("|")[1]
				}
			});
			if (d.hasClass("checkbox")) if (b.hasClass("selected")) {
				b.removeClass("selected");
				c = 0
			} else {
				b.addClass("selected");
				c = 1
			}
			a = b.get("rel").split("|")[0];
			this.fireEvent("change", [a, c]);
			if (a == "lang" && this.options.lang != c) {
				a = new Solitaire.Window.Confirm;
				a.open(Solitaire.Lang.getString("optionWindowTabLanguageHeader"), Solitaire.Lang.getString("optionWindowTabSettingsLangLabel").substitute({
					lang: Solitaire.Lang.getLanguageName(c)
				}));
				a.addEvent("change", function (e) {
					e == "ok" ? location.reload() : this.close()
				})
			}
		},
		_buildHtml: function () {
			var a, b;
			this.scoring.each(function (d) {
				a = {
					tag: "div",
					className: "option_item " + d.type,
					childs: []
				};
				d.items.each(function (c) {
					b = d.type == "checkbox" ? this.options[d.id] ? "selected" : "" : this.options[d.id] == c.value ? "selected" : "";
					a.childs.push({
						tag: "a",
						rel: d.id + "|" + c.value,
						className: "option_item_entry " + b,
						html: c.name(),
						events: [{
							click: this.onOptionClick}]
					})
				}.bind(this));
				this.workingModel.childs[1].childs.push(a)
			}.bind(this));
			this.main.each(function (d) {
				a = {
					tag: "div",
					className: "option_item " + d.type,
					childs: []
				};
				if (d.type == "label") a.childs.push({
					tag: "div",
					className: "header_label",
					html: d.value()
				});
				else {
					d.items.each(function (c) {
						c.value = c.value ? c.value : "";
						b = d.type == "checkbox" ? this.options[d.id] ? "selected" : "" : this.options[d.id] == c.value ? "selected" : "";
						c = {
							tag: "a",
							rel: d.id + "|" + c.value,
							className: "option_item_entry " + b,
							html: c.name(),
							events: [{
								click: this.onOptionClick}]
						};
						a.childs.push(c)
					}.bind(this));
					d.label && a.childs.push({
						tag: "div",
						className: "label",
						html: d.label()
					})
				}
				this.workingModel.childs[2].childs.push(a)
			}.bind(this));
			this.languages.each(function (d) {
				a = {
					tag: "div",
					className: "option_item " + d.type,
					childs: []
				};
				if (d.type == "label") a.childs.push({
					tag: "div",
					className: "header_label",
					html: d.value()
				});
				else {
					d.items.each(function (c) {
						c.value = c.value ? c.value : "";
						b = d.type == "checkbox" ? this.options[d.id] ? "selected" : "" : this.options[d.id] == c.value ? "selected" : "";
						c = {
							tag: "a",
							rel: d.id + "|" + c.value,
							className: "option_item_entry " + b,
							html: c.name(),
							events: [{
								click: this.onOptionClick}]
						};
						a.childs.push(c)
					}.bind(this));
					d.label && a.childs.push({
						tag: "div",
						className: "label",
						html: d.label()
					})
				}
				this.workingModel.childs[3].childs.push(a)
			}.bind(this));
			this.parent();
			new Solitaire.Tab({
				tabs_button: this.content.getElements(".tab_buttons a"),
				tabs_content: this.content.getElements(".tab_contents"),
				active_tab_class: "tab_selected"
			})
		}
	})
}).call(Solitaire);
(function () {
	this.Window.Pause = new Class({
		Extends: Solitaire.Window.Abstract,
		showOverlay: true,
		className: "lbx_pause",
		header: function () {
			return Solitaire.Lang.getString("pauseHeader")
		},
		model: function () {
			return {
				tag: "div",
				className: "tab_contents",
				childs: [{
					tag: "div",
					className: "pause_cont",
					childs: [{
						tag: "table",
						childs: [{
							tag: "tr",
							childs: [{
								tag: "td",
								className: "name td_content",
								html: Solitaire.Lang.getString("pauseContent")}]}]}]},
				{
					tag: "div",
					className: "win_buttons",
					childs: [{
						tag: "input",
						type: "button",
						value: Solitaire.Lang.getString("pauseButtonResume"),
						events: [{
							click: this.close.bind(this)}]}]}]
			}
		}
	})
}).call(Solitaire);
(function () {
	this.Window.StatsWin = new Class({
		Extends: Solitaire.Window.Abstract,
		Binds: ["onRequestComplete", "onRequestFailure", "onClickNewGame"],
		className: "lbx_win",
		header: function () {
			return Solitaire.Lang.getString("winHeader")
		},
		model: function () {
			return {
				tag: "div",
				className: "tab_contents",
				childs: [{
					tag: "div",
					className: "win_cont",
					childs: [{
						tag: "table",
						childs: [{
							tag: "tr",
							childs: [{
								tag: "td",
								className: "name td_game_type",
								html: Solitaire.Lang.getString("winGameTypeHead")},
							{
								tag: "td",
								className: "value td_game_type",
								html: Solitaire.Lang.getString("win." + this.options.game_type)}]},
						{
							tag: "tr",
							childs: [{
								tag: "td",
								className: "name td_score_type",
								html: Solitaire.Lang.getString("winScoringSystemHead")},
							{
								tag: "td",
								className: "value td_score_type",
								html: Solitaire.Lang.getString("winScoringSystem" + this.options.score_type.ucFirst())}]},
						{
							tag: "tr",
							childs: [{
								tag: "td",
								className: "name td_moves win_inactive",
								html: Solitaire.Lang.getString("winMovesHead")},
							{
								tag: "td",
								id: "win_moves",
								className: "value win_inactive td_moves",
								html: "0"}]},
						{
							tag: "tr",
							childs: [{
								tag: "td",
								className: "name td_time win_inactive",
								html: Solitaire.Lang.getString("winTimeHead")},
							{
								tag: "td",
								id: "win_time",
								className: "value win_inactive td_time",
								html: "00:00"}]},
						{
							tag: "tr",
							childs: [{
								tag: "td",
								className: "name td_bonus win_inactive",
								html: Solitaire.Lang.getString("winBonusHead")},
							{
								tag: "td",
								id: "win_bonus",
								className: "value win_inactive td_bonus",
								html: "-"}]},
						{
							tag: "tr",
							childs: [{
								tag: "td",
								className: "name td_score win_inactive",
								html: Solitaire.Lang.getString("winScoresHead")},
							{
								tag: "td",
								id: "win_score",
								className: "value win_inactive td_score",
								html: "0"}]},
						{
							tag: "tr",
							childs: [{
								tag: "td",
								className: "name td_best_score win_inactive",
								html: Solitaire.Lang.getString("winBestScoresHead")},
							{
								tag: "td",
								id: "win_best_score",
								className: "value win_inactive td_best_score",
								html: "0"}]},
						{
							tag: "tr",
							childs: [{
								tag: "td",
								className: "name td_share_label win_inactive",
								colspan: 2,
								html: Solitaire.Lang.getString("win.share-score")}]},
						{
							tag: "tr",
							childs: [{
								tag: "td",
								className: "name td_share_buttons win_inactive",
								colspan: 2,
								childs: [{
									tag: "a",
									href: "#",
									className: "share_facebook",
									childs: [{
										tag: "img",
										src: SS + "images/fb_share_button.png",
										alt: ""}]},
								{
									tag: "a",
									href: "#",
									className: "share_google",
									childs: [{
										tag: "img",
										src: SS + "images/google_share_button.png",
										alt: ""}]},
								{
									tag: "a",
									href: "#",
									className: "share_twitter",
									childs: [{
										tag: "img",
										src: SS + "images/twitter_share_button.png",
										alt: ""}]}]}]}]},
					{
						tag: "table",
						className: "ads",
						childs: [{
							tag: "tr",
							childs: [{
								tag: "td",
								id: "win_ads",
								childs: [{
									tag: "iframe",
									src: FULLADDR + "ads-" + (Solitaire.PLATFORM == "chrome" ? "chrome" : "web") + ".html/win",
									scrolling: "no",
									frameborder: "0",
									vspace: "0",
									marginheight: "0",
									marginwidth: "0",
									hspace: "0",
									allowtransparency: "true",
									styles: {
										width: 468,
										marginLeft: -5
									}}]}]}]}]},
				{
					tag: "div",
					className: "win_buttons",
					childs: [{
						tag: "input",
						className: "new_game",
						type: "button",
						value: Solitaire.Lang.getString("winNewGameButton"),
						events: [{
							click: function () {
								this.fireEvent("clickNewGame")
							}.bind(this)}]},
					{
						tag: "input",
						className: "redeal_game",
						type: "button",
						value: Solitaire.Lang.getString("winRedealButton"),
						events: [{
							click: function () {
								this.fireEvent("clickRedealGame")
							}.bind(this)}]}]}]
			}
		},
		share: {
			facebook: {
				url: "http://www.facebook.com/sharer.php?s=100&p[title]={title}&p[summary]={desc}&p[url]={url}&p[images][0]=http://static.pasjans-online.pl/images/icons/icon_128.png",
				opt: "width=675,height=400"
			},
			google: {
				url: "https://plus.google.com/share?url={url}",
				opt: "width=600,height=500"
			},
			twitter: {
				url: "http://twitter.com/intent/tweet?source=sharethiscom&text={title}&url={url}",
				opt: "width=600,height=400"
			}
		},
		shareUrl: "http://pasjans-online." + TLD + "/my-score/{hash}.html",
		winStatsUrl: "http://pasjans-online." + TLD + "/stats/save-win.html",
		options: {
			moves: 0,
			time: 10,
			bonus: null,
			score: 0,
			best_score: 0,
			score_type: "",
			game_type: "",
			preview: false
		},
		_data: {},
		initialize: function (a) {
			this.storage = new Solitaire.Storage;
			this.parent(a);
			this.initEvents()
		},
		initEvents: function () {
			this.addEvent("clickNewGame", this.onClickNewGame)
		},
		open: function (a) {
			var b = "best-score-" + a.score_type + "-" + a.game_type,
				d = null,
				c = 0,
				e = a.score;
			a.time >>= 0;
			a.score >>= 0;
			a.preview || (c = Math.max(this.storage.get(b) >> 0, a.score));
			if (a.score_type == "timed" && a.time <= 1E3) d = Math.floor(1E3 / Math.max(a.time / 10, 5));
			a.preview || (e = a.score + (d >> 0));
			this.parent(Object.merge(a, {
				bonus: d,
				score: e,
				best_score: Math.max(c, e)
			}));
			a.score >= c && !a.preview && this.storage.set(b, a.score);
			a.score = e;
			this._data = a;
			a.preview || this._saveWinStats()
		},
		onRequestComplete: function (a) {
			!a || a.result != "ok" || this._activateShareButtons(a.response.id)
		},
		onRequestFailure: function () {},
		onClickNewGame: function () {
			if (this.options.preview && Solitaire.PLATFORM == "web") location.href = "http://pasjans-online." + TLD
		},
		_buildHtml: function () {
			var a, b, d, c;
			this.parent();
			c = this.content.getElement;
			a = new Chain;
			if (d = this.options.preview) {
				c("td.td_best_score").setStyle("visibility", "hidden");
				c(".win_buttons .redeal_game").hide();
				c("td.td_share_label").set("text", "");
				this._activateShareButtons(Solitaire.get("place_id"))
			}["moves", "time", "bonus", "score", "best_score"].each(function (e) {
				if (!(d && e == "best_score")) {
					e = function (f) {
						var g = 0,
							h;
						if (this.content) {
							h = this.content.getElement("table #win_" + f);
							if (Browser.isMobile) {
								h.setStyle("opacity", 1);
								h.getPrevious().setStyle("opacity", 1)
							} else {
								(new Fx.Morph(h, {
									duration: 500
								})).start({
									opacity: 1
								});
								(new Fx.Morph(h.getPrevious(), {
									duration: 500
								})).start({
									opacity: 1
								})
							}
							var i = function (j) {
								this.options[f] || (g = 1);
								var k = Math.floor(Fx.Transitions.Quad.easeInOut(g) * this.options[f]);
								if (f == "time") k = k.toTime().hour + ":" + k.toTime().min + ":" + k.toTime().sec;
								h.set("text", k);
								g += 0.01;
								if (g >= 1 || j) {
									g = 0;
									k = this.options[f];
									if (f == "time") k = k.toTime().hour + ":" + k.toTime().min + ":" + k.toTime().sec;
									if (f == "bonus") k = k || 0;
									h.set("text", k);
									clearInterval(b);
									a.callChain()
								}
							};
							if (Browser.isMobile) i.call(this, [true]);
							else b = i.periodical(20, this)
						}
					}.bind(this, [e]);
					a.chain(e)
				}
			}.bind(this));
			a.callChain();
			return this
		},
		_saveWinStats: function () {
			var a = Solitaire.CrossRequest;
			if (Browser.ie) a = Request.JSON;
			a = new a({
				url: this.winStatsUrl,
				data: {
					game_type: this._data.game_type,
					scoring_type: this._data.score_type,
					time: this._data.time,
					score: this._data.score,
					moves: this._data.moves
				}
			});
			a.send();
			a.addEvent("complete", this.onRequestComplete);
			a.addEvent("failure", this.onRequestFailure)
		},
		_activateShareButtons: function (a) {
			var b =
			this.content.getElement,
				d;
			b(".td_share_label").fade(1);
			b(".td_share_buttons").fade(1);
			d = Solitaire.get("place_params") || this._data;
			this.content.getElements(".td_share_buttons a").each(function (c) {
				var e = c.get("class").replace("share_", ""),
					f, g;
				this.share[e] && c.addEvent("click", function (h) {
					h.preventDefault();
					f = this.share[e].url.substitute({
						url: encodeURIComponent(this.shareUrl.substitute({
							hash: a
						})),
						title: encodeURIComponent(Solitaire.Lang.getString("win.share-title").substitute(d)),
						desc: encodeURIComponent(Solitaire.Lang.getString("win.share-description").substitute(d))
					});
					g = this.share[e].opt;
					window.open(f, "Share", "resizable=yes,scrollbars=no,status=no," + g)
				}.bind(this))
			}.bind(this))
		}
	})
}).call(Solitaire);
(function () {
	this.Window.Themes = new Class({
		Extends: Solitaire.Window.Abstract,
		Binds: ["onClick"],
		className: "lbx_opt_skin",
		header: function () {
			return Solitaire.Lang.getString("optionSkinHeader")
		},
		model: function () {
			return {
				tag: "div",
				className: "skin_content",
				childs: [{
					tag: "div",
					className: "tab_buttons",
					childs: [{
						tag: "a",
						html: Solitaire.Lang.getString("optionSkinTabThemeHeader"),
						className: "tab_selected"},
					{
						tag: "a",
						html: Solitaire.Lang.getString("optionSkinTabCardHeader")}]},
				{
					tag: "div",
					className: "tab_contents",
					styles: {
						display: "block"
					},
					childs: [{
						tag: "div",
						className: "",
						childs: []}]},
				{
					tag: "div",
					className: "tab_contents",
					styles: {
						display: "none"
					},
					childs: []}]
			}
		},
		definedThemesList: [{
			type: "select_theme",
			id: "themeType",
			items: [{
				name: "Retro",
				id: "classic_old",
				cardType: "classic_old",
				backType: "classic_old",
				backgroundType: "classic_old"},
			{
				name: "Modern",
				id: "modern",
				cardType: "modern",
				backType: "modern",
				backgroundType: "modern",
				author: 'theme made by <a href="http://twitter.com/johnkappa" target="_blank">@johnkappa</a>'},
			{
				name: "Saloon",
				id: "classic_saloon",
				cardType: "classic_old",
				backType: "classic_old",
				backgroundType: "classic_saloon"},
			{
				name: "Classic green",
				id: "classic_green",
				cardType: "classic",
				backType: "classic_blue",
				backgroundType: "classic_green"},
			{
				name: "Strips blue",
				id: "strips_blue",
				cardType: "strips",
				backType: "strips_blue",
				backgroundType: "strips_blue"},
			{
				name: "Classic red",
				id: "classic_red",
				cardType: "classic",
				backType: "classic_red",
				backgroundType: "classic_red"},
			{
				name: "Pattern blue",
				id: "pattern_blue",
				cardType: "classic",
				backType: "classic_blue",
				backgroundType: "pattern_blue"},
			{
				name: "Pattern green",
				id: "pattern_green",
				cardType: "classic",
				backType: "classic_green",
				backgroundType: "pattern_green"},
			{
				name: "Honeycomb",
				id: "honeycomb",
				cardType: "honeycomb",
				backType: "honeycomb",
				backgroundType: "honeycomb"},
			{
				name: "Pattern dark",
				id: "pattern_dark",
				cardType: "animals",
				backType: "animals",
				backgroundType: "pattern_dark"}]}],
		cards: ["classic_old", "modern", "classic", "strips", "honeycomb", "animals"],
		backs: ["classic_old", "modern", "classic_blue", "classic_red", "classic_green", "strips_blue", "honeycomb",
			"animals"],
		options: {
			themeType: "classic_old"
		},
		open: function (a) {
			Browser.isMobile && Solitaire.MouseEventSimulator.preventEvent(false);
			this.parent(a)
		},
		close: function (a) {
			Browser.isMobile && Solitaire.MouseEventSimulator.preventEvent(true);
			this.parent(a)
		},
		onClick: function (a) {
			var b = a.target;
			a.preventDefault();
			if (b.hasClass("skin_item_default")) {
				a = b.retrieve("solitaire:reset-data");
				this._loadCardResource(a.cardType, false);
				this._updateContent(b, {
					data: {
						cardBackType: a.backType
					}
				}, "updateTheme");
				this.fireEvent("change", [{
					type: "deckType",
					data: a.cardType}]);
				this._loadBackResource(a.backType, false);
				this._updateContent(b, {
					data: {
						deckType: a.cardType
					}
				}, "updateTheme");
				this.fireEvent("change", [{
					type: "cardBackType",
					data: a.backType}]);
				b.hide()
			} else {
				if (!b.hasClass("skin_item") && b.get("tag") != "a") b = b.getParent(".skin_item");
				a = {};
				if (b.hasClass("select_theme")) {
					a = Object(b.retrieve("item_data"));
					b.getParent().getChildren().each(function (d) {
						var c = d.getElement(".label_bg"),
							e = c.firstChild.data.replace(Solitaire.Lang.getString("optionWindowSelectedSkinItem"), "");
						if (d == b) {
							d.addClass("selected");
							e += Solitaire.Lang.getString("optionWindowSelectedSkinItem")
						} else {
							d.removeClass("selected");
							d.getElement(".skin_item_default").hide();
							var f = d.retrieve("item_data");
							if (f.data.cardBackType) {
								var g = d.getElement(".back_card");
								if (g) g.src = this._getBackSrcPattern().substitute({
									id: f.data.cardBackType
								})
							}
							if (f.data.deckType) {
								var h = ["Ks", "Qh", "Jd", "10c"];
								d.getElements(".card").each(function (i, j) {
									i.src = this._getCardSrcPattern().substitute({
										id: f.data.deckType
									}) + h[j] + ".png"
								}.bind(this))
							}
						}
						c.firstChild.data =
						e
					}.bind(this));
					if (a.data.themeType == this.options.themeType) {
						a.data.deckType = this.options.deckType;
						a.data.cardBackType = this.options.cardBackType
					}
				}
				if (b.hasClass("theme_item_navi")) {
					a = null;
					switch (b.id) {
					case "theme_n_c_l":
						if (this._pageCard > 0) {
							this._pageCard--;
							a = {
								type: "themeType",
								data: {
									deckType: this.cards[this._pageCard]
								}
							};
							this._loadCardResource(a.data.deckType)
						}
						this._updatePagination("c");
						break;
					case "theme_n_c_r":
						if (this._pageCard < this.cards.length - 1) {
							this._pageCard++;
							a = {
								type: "themeType",
								data: {
									deckType: this.cards[this._pageCard]
								}
							};
							this._loadCardResource(a.data.deckType)
						}
						this._updatePagination("c");
						break;
					case "theme_n_b_l":
						if (this._pageBackCard > 0) {
							this._pageBackCard--;
							a = {
								type: "themeType",
								data: {
									cardBackType: this.backs[this._pageBackCard]
								}
							};
							this._loadBackResource(a.data.cardBackType)
						}
						this._updatePagination("b");
						break;
					case "theme_n_b_r":
						if (this._pageBackCard < this.backs.length - 1) {
							this._pageBackCard++;
							a = {
								type: "themeType",
								data: {
									cardBackType: this.backs[this._pageBackCard]
								}
							};
							this._loadBackResource(a.data.cardBackType)
						}
						this._updatePagination("b")
					}
				}
				if (a) {
					this._updateContent(b, a);
					this.fireEvent("change", [a])
				}
			}
		},
		_buildHtml: function () {
			var a = this.cards.length - 1,
				b = this.backs.length - 1;
			this.definedThemesList.each(function (f) {
				f.items.each(function (g) {
					var h, i, j = false;
					if (this.options[f.id] == g.id) {
						h = SS + "images/cards/" + (this.options.deckType ? this.options.deckType : g.cardType) + "/";
						i = SS + "images/backs/" + (this.options.cardBackType ? this.options.cardBackType : g.backType) + "/preview.png";
						if (this.options.deckType != g.cardType || this.options.cardBackType != g.backType) j = true
					} else {
						h = SS + "images/cards/" + g.cardType + "/";
						i = SS + "images/backs/" + g.backType + "/preview.png"
					}
					h = {
						tag: "div",
						className: "skin_item " + f.type,
						href: "#",
						styles: {
							backgroundImage: "url(" + SS + "images/backgrounds/" + g.backgroundType + "/preview.jpg)"
						},
						store: {
							item_data: {
								type: f.id,
								data: {
									deckType: g.cardType,
									cardBackType: g.backType,
									backgroundType: g.backgroundType,
									themeType: g.id,
									author: g.author
								}
							}
						},
						childs: [{
							tag: "img",
							src: h + "Ks.png",
							className: "card"},
						{
							tag: "img",
							src: h + "Qh.png",
							className: "card"},
						{
							tag: "img",
							src: h + "Jd.png",
							className: "card"},
						{
							tag: "img",
							src: h + "10c.png",
							className: "card"},
						{
							tag: "img",
							src: i,
							className: "back_card"},
						{
							tag: "div",
							className: "label_bg",
							html: g.name,
							childs: [{
								tag: "a",
								className: "skin_item_default",
								href: "#",
								html: Solitaire.Lang.getString("optionWindowChangedThemeSkinItem"),
								events: [{
									click: this.onClick}],
								store: {
									"solitaire:reset-data": g
								},
								styles: {
									display: j ? "block" : "none"
								}}]}],
						events: [{
							click: this.onClick}]
					};
					if (this.options[f.id] == g.id) {
						h.className += " selected";
						h.childs[h.childs.length - 1].html += Solitaire.Lang.getString("optionWindowSelectedSkinItem")
					}
					this.workingModel.childs[1].childs[0].childs.push(h)
				}.bind(this))
			}.bind(this));
			var d = SS + "images/cards/" + this.options.deckType + "/",
				c = SS + "images/backs/" + this.options.cardBackType + "/preview.png";
			this._pageCard = this.cards.indexOf(this.options.deckType);
			this._pageBackCard = this.backs.indexOf(this.options.cardBackType);
			a = {
				tag: "div",
				className: "skin_item select_advanced_theme",
				styles: {
					backgroundImage: "url(" + SS + "images/backgrounds/" + this.options.backgroundType + "/background.jpg)"
				},
				childs: [{
					tag: "div",
					className: "theme_board_top",
					childs: []},
				{
					tag: "div",
					className: "theme_board_bottom",
					childs: [{
						tag: "div",
						className: "theme_board_bottom_left",
						childs: [{
							tag: "a",
							id: "theme_n_c_l",
							className: (this._pageCard == 0 ? "no_more_item" : "") + " theme_item_card theme_item_navi",
							href: "#",
							html: "<",
							events: [{
								click: this.onClick}]},
						{
							tag: "a",
							id: "theme_n_c_r",
							className: (this._pageCard == a ? "no_more_item" : "") + " theme_item_card theme_item_navi",
							href: "#",
							html: ">",
							events: [{
								click: this.onClick}]}]},
					{
						tag: "div",
						className: "theme_board_bottom_right",
						childs: [{
							tag: "a",
							id: "theme_n_b_l",
							className: (this._pageBackCard == 0 ? "no_more_item" : "") + " theme_item_back_card theme_item_navi",
							href: "#",
							html: "<",
							events: [{
								click: this.onClick}]},
						{
							tag: "a",
							id: "theme_n_b_r",
							className: (this._pageBackCard == b ? "no_more_item" : "") + " theme_item_back_card theme_item_navi",
							href: "#",
							html: ">",
							events: [{
								click: this.onClick}]}]}]}]
			};
			var e = {
				tag: "div",
				className: "cards_content",
				childs: []
			};["2c", "3h", "4s", "5d", "6c", "7h", "8s", "9d", "10c", "Jh", "Qs", "Kd", "Ac"].each(function (f, g, h) {
				e.childs.push({
					tag: "img",
					src: d + f + ".png",
					className: "card",
					styles: {
						left: 515 - 36 * (h.length - g)
					}
				})
			}.bind(this));
			e.childs.push({
				tag: "img",
				src: c,
				className: "back_card"
			});
			a.childs[0].childs.push(e);
			this.workingModel.childs[2].childs.push(a);
			this.parent();
			new Solitaire.Tab({
				tabs_button: this.content.getElements(".tab_buttons a"),
				tabs_content: this.content.getElements(".tab_contents"),
				active_tab_class: "tab_selected"
			});
			return this
		},
		_updateContent: function (a, b, d) {
			if (a.hasClass("select_theme") && b) {
				this._loadBackResource(b.data.cardBackType, false);
				this._loadCardResource(b.data.deckType, false);
				this.content.getElement(".select_advanced_theme").setStyle("background-image", "url(" + this._getBackgroundSrcPattern().substitute({
					id: b.data.backgroundType
				}) + ")")
			}
			if (a.hasClass("theme_item_navi") && b || d == "updateTheme") {
				a = false;
				if (b.data.cardBackType) {
					a = true;
					if (d = this.content.getElement(".selected .back_card")) d.src = this._getBackSrcPattern().substitute({
						id: b.data.cardBackType
					})
				}
				if (b.data.deckType) {
					a = true;
					var c = ["Ks", "Qh", "Jd", "10c"];
					this.content.getElements(".selected .card").each(function (e, f) {
						e.src = this._getCardSrcPattern().substitute({
							id: b.data.deckType
						}) + c[f] + ".png"
					}.bind(this))
				}
				a && this.content.getElement(".selected .skin_item_default") && this.content.getElement(".selected .skin_item_default").show()
			}
			if (b) {
				if (b.data.cardBackType) {
					this._pageBackCard = this.backs.indexOf(b.data.cardBackType);
					this._updatePagination("b")
				}
				if (b.data.deckType) {
					this._pageCard = this.cards.indexOf(b.data.deckType);
					this._updatePagination("c")
				}
			}
		},
		_updatePagination: function (a) {
			var b = this.backs.length - 1,
				d = this._pageCard,
				c = this.cards.length - 1;
			if (a == "b") {
				d = this._pageBackCard;
				c = b
			}
			$("theme_n_" + a + "_l")[d > 0 ? "removeClass" : "addClass"]("no_more_item");
			$("theme_n_" + a + "_r")[d < c ? "removeClass" : "addClass"]("no_more_item")
		},
		_loadCardResource: function (a, b) {
			var d = 0,
				c = this.content.getElements(".select_advanced_theme .card"),
				e;
			e = function () {["2c", "3h", "4s", "5d", "6c", "7h", "8s", "9d", "10c", "Jh", "Qs", "Kd", "Ac"].each(function (g, h) {
					c[h].set("src", this._getCardSrcPattern().substitute({
						id: a
					}) + g + ".png")
				}.bind(this))
			}.bind(this);
			var f = function () {
				this.removeEvent("complete", f);
				d++;
				if (d >= c.length) {
					e();
					Asset.images(c.get("src"), {
						onComplete: function () {
							c.each(function (g) {
								(new Fx.Morph(g, {
									duration: 300
								})).start({
									left: g.retrieve("solitaire:orig-left")
								})
							})
						}
					})
				}
			};
			b === undefined || b === true ? c.each(function (g) {
				g.store("solitaire:orig-left", g.getStyle("left").toInt());
				(new Fx.Morph(g, {
					duration: 300,
					onComplete: f
				})).start({
					left: 515
				}).addEvent("complete", f)
			}.bind(this)) : e()
		},
		_loadBackResource: function (a, b) {
			var d = this.content.getElement(".select_advanced_theme .back_card");
			d.retrieve("solitaire:back_card_resource_left") || d.store("solitaire:back_card_resource_left", d.getStyle("left").toInt());
			var c =
			d.retrieve("solitaire:back_card_resource_left"),
				e = d.getStyle("width").toInt();
			if (Browser.isMobile) b = false;
			b === undefined || b === true ? (new Fx.Morph(d, {
				duration: 100,
				link: "chain",
				transition: Fx.Transitions.linear,
				onComplete: function (f) {
					d.getWidth() <= 5 && f.set("src", this._getBackSrcPattern().substitute({
						id: a
					}))
				}.bind(this)
			})).start({
				width: 5,
				left: c + e / 2
			}).start({
				width: 109,
				left: c
			}) : d.set("src", this._getBackSrcPattern().substitute({
				id: a
			}))
		},
		_getCardSrcPattern: function () {
			return SS + "images/cards/{id}/"
		},
		_getBackSrcPattern: function () {
			return SS + "images/backs/{id}/preview.png"
		},
		_getBackgroundSrcPattern: function () {
			return SS + "images/backgrounds/{id}/background.jpg"
		}
	})
}).call(Solitaire);
(function () {
	this.Window.WhatsNew = new Class({
		Extends: Solitaire.Window.Abstract,
		_storageKey: "whatsNew-last-content",
		className: "lbx_what_new",
		showOverlay: true,
		header: function () {
			return Solitaire.Lang.getString("whatsNew.header")
		},
		model: function () {
			var a = [],
				b = Solitaire.Lang.getString("whatsNew.content").split("|");
			b.each(function (d) {
				a.push({
					tag: "li",
					html: d
				})
			});
			return {
				tag: "div",
				className: "tab_contents",
				childs: [{
					tag: "div",
					className: "what_new_cont",
					childs: [{
						tag: "ul",
						childs: a,
						className: b.length == 1 ? "one_item" : ""}]},
				{
					tag: "div",
					className: "what_new_buttons",
					childs: [{
						tag: "input",
						type: "button",
						value: "OK",
						events: [{
							click: this.close.bind(this)}]}]}]
			}
		},
		initialize: function () {
			this.storage = new Solitaire.Storage;
			this.parent()
		},
		open: function () {
			var a = Solitaire.Lang.getString("whatsNew.content");
			if (this.storage.get(this._storageKey) != a && this.storage.get(this._storageKey)) {
				this.parent();
				this.storage.set(this._storageKey, a)
			}
			this.storage.get(this._storageKey) || this.storage.set(this._storageKey, a)
		}
	})
}).call(Solitaire);
(function () {
	this.Window.Rules = new Class({
		Extends: Solitaire.Window.Abstract,
		className: "lbx_rules",
		header: function () {
			return this.options.gameHeaderRules
		},
		model: function () {
			return {
				tag: "div",
				className: "tab_contents",
				childs: [{
					tag: "div",
					className: "rules_cont",
					html: this.options.gameTextRules},
				{
					tag: "div",
					className: "rules_buttons",
					childs: [{
						tag: "input",
						type: "button",
						value: "OK",
						events: [{
							click: this.close.bind(this)}]}]}]
			}
		},
		open: function (a) {
			this.parent({
				gameTextRules: Solitaire.Lang.getString("rules.content." + a),
				gameHeaderRules: Solitaire.Lang.getString(a)
			})
		}
	})
}).call(Solitaire);
(function () {
	var a = document,
		b = window,
		d = location;
	this.VERSION = "1.3.9.1";
	this.DEBUG = a.domain == "pasjans-online.k" ? true : false;
	this.DEAL_EASY = false;
	if (a.domain != "pasjans-online.k") this.DEAL_EASY = false;
	this.PLATFORM = function () {
		if (d.href.test(/^chrome\-extension:\/\//)) return "chrome";
		if (d.href.test(/^widget:\/\//)) return "opera";
		if (d.href.test(/^resource:\/\//)) return "firefox";
		return "web"
	}();
	this.Game = new Class({
		Implements: Events,
		Binds: ["onCardDrop", "onCardClick", "onCardDrag", "onCardDblClick", "onMenuClickNewGame",
			"onDeckShuffled", "onMenuSkinWindowChange", "onOptionsLoaded", "onMenuOptionWindowChange", "onWindowResize", "onDeckDealToBlankBoardCard", "onDeckDelt", "onKeyDown", "onMenuToggle", "onPlayerLogin", "onPlayerLogout", "onClickEmptyStack", "onMenuClickRestartGame", "onClickResumeOnPausedGame", "onTouch", "onLayoutWidthChange", "onLayoutHeightChange", "onLayoutChange", "onMenuGamesWindowChange", "onAuthClickLogin", "onAuthClickRegister", "onAuthClickLogout", "onPlayerRegister"],
		gameStatusContent: "game_status",
		cardEmptyPattern: ".blank_foundation, .blank_tableau, #stack",
		labelBg: "game_labels",
		options: {
			duration: 200
		},
		initialize: function (c) {
			if (!Solitaire.DEBUG && !Browser.isMobile) a.onmousedown = function () {
				return false
			};
			if (Browser.ie6) {
				$("no_support_box").show();
				$(a.body).setStyle("background-image", "url(" + SS + "images/backgrounds/classic_old/background.jpg)")
			} else {
				this.gameStatusContent = $(this.gameStatusContent);
				this.labelBg = $(this.labelBg);
				this.gameStatusContentFx = new Fx.Morph(this.gameStatusContent, {
					duration: this.options.duration
				});
				this.statsWinWindow = new Solitaire.Window.StatsWin;
				this.authWindow = new Solitaire.Window.Auth;
				this.gameOptions = c;
				this.gameOptions.addEvent("loaded", this.onOptionsLoaded);
				this.gameOptions.loadResources();
				this._setBackground()
			}
		},
		initEvents: function () {
			Browser.isMobile || $(Browser.ie ? a : b).addEvent("keydown", this.onKeyDown);
			this.player.addEvent("login", this.onPlayerLogin);
			this.player.addEvent("logout", this.onPlayerLogout);
			this.player.addEvent("register", this.onPlayerRegister);
			this.authWindow.addEvent("clickLogin", this.onAuthClickLogin);
			this.authWindow.addEvent("clickRegister", this.onAuthClickRegister);
			this.authWindow.addEvent("clickLogout", this.onAuthClickLogout);
			this.statsWinWindow.addEvent("clickNewGame", this.onMenuClickNewGame);
			this.statsWinWindow.addEvent("clickRedealGame", this.onMenuClickRestartGame);
			this.deck.addEvent("cardDrop", this.onCardDrop);
			this.deck.addEvent("cardClick", this.onCardClick);
			this.deck.addEvent("cardDblClick", this.onCardDblClick);
			this.deck.addEvent("shuffled", this.onDeckShuffled);
			this.deck.addEvent("delt", this.onDeckDelt);
			this.deck.addEvent("dealToBlankBoardCard", this.onDeckDealToBlankBoardCard);
			this.deck.addEvent("clickEmptyStack", this.onClickEmptyStack);
			this.menu.addEvent("clickNewGame", this.onMenuClickNewGame);
			this.menu.addEvent("clickRestartGame", this.onMenuClickRestartGame);
			this.menu.addEvent("skinWindowChange", this.onMenuSkinWindowChange);
			this.menu.addEvent("optionWindowChange", this.onMenuOptionWindowChange);
			this.menu.addEvent("gamesWindowChange", this.onMenuGamesWindowChange);
			this.menu.addEvent("toggle", this.onMenuToggle);
			this.menu.pauseWindow.addEvent("open", function () {
				this.time.stop()
			}.bind(this));
			this.menu.pauseWindow.addEvent("close", function () {
				this.time.start()
			}.bind(this));
			this.time.addEvent("timeTick", this.score.onTimeTick);
			this.layout.addEvent("screenWidthChange", this.onLayoutWidthChange);
			this.layout.addEvent("screenHeightChange", this.onLayoutHeightChange);
			this.layout.addEvent("change", this.onLayoutChange);
			this.gameStatusContent.getElements("a").each(function (c) {
				c.id.test(/game_action_/) && c.addEvent("click", this["on" + c.id.replace("game_action_", "").ucFirst() + "Click"].bind(this))
			}.bind(this));
			this.layout.addEvent((this.layout.isWide() ? "naviWideChange" : "naviChange") + ":once", function () {
				var c = this.menu.gamesWindow,
					e;
				if (Solitaire.get("place_name") != "my-score") {
					e = 0;
					if (!Browser.isMobile && this.menu.gameOptions.getOptionWindowParam("showOnStartup") >> 0) {
						e += 250;
						(function () {
							c.open()
						}).delay(e, this)
					}
					e += 250;
					(function () {
						(new Solitaire.Window.WhatsNew).open()
					}).delay(e, this)
				}
			}.bind(this))
		},
		onMenuToggle: function (c) {
			var e = {};
			e.top = c == "show" ? -(this.gameStatusContent.getHeight() + 10) : 0;
			this.gameStatusContentFx.start(e)
		},
		onKeyDown: function (c) {
			if (c.event && c.event.ctrlKey && c.code == 90) if (!this._timerUndoKey) {
				this._timerUndoKey = function () {
					clearTimeout(this._timerUndoKey);
					this._timerUndoKey = null
				}.delay(500, this);
				this.onUndoClick()
			}
		},
		setOption: function (c, e) {
			this.options[c] = e
		},
		getOption: function (c) {
			return this.options[c]
		},
		checkMove: function (c, e, f, g) {
			var h = false,
				i = false,
				j = false,
				k = null,
				m, l;
			this._fireUserActivityEvent();
			f = f ? true : false;
			if (this.gameType.isMoveAllowed(c, e, f)) {
				this.gameType.moveAllowed("old_pile", c, e);
				j = c.isInWaste(true);
				m = c.isInTableau(true);
				l = c.isFounded();
				!c.isInFoundation() && !f && c.setFoundation(false);
				if (c.isInFoundation() || f) c.setFoundation(true);
				var n = c.getPrevCard();
				if (n) {
					n.setNextCard(null);
					if (n.isReversed()) h = true;
					this.getOption("autoFlip") && n.isReversed() && n.setReversed(false)
				}
				if (e instanceof Solitaire.Card) {
					c.setPrevCard(e);
					e.setNextCard(c);
					c.setPosition(e.getElement(), true, f, g)
				} else {
					c.setPrevCard(null);
					c.setPosition(e, true, f, g);
					if (e.hasClass("blank_foundation")) {
						c.getFoundationId() != null && this.foundation.clearSlot(c.getFoundationId());
						k = this.foundation.setAsBusySlot(e);
						c.setFoundationId(k);
						this.foundation.setCardBySlotElement(c, e)
					}
					if (e.hasClass("blank_tableau")) {
						this.tableau.setCardBySlotElement(c, e);
						i = true
					}
				}
				if (c.isFounded() || !n && !i) this.tableau.removeCard(c);
				j && this.deck.removeFromStack(c);
				if (j) {
					c.isFounded() && this.score.increase("waste_to_foundation");
					c.isInTableau() && this.score.increase("waste_to_tableau")
				}
				if (m) if (c.isFounded()) this.score.increase("tableau_to_foundation");
				else if (n) if (h) this.score.increase("tableau_to_tableau");
				else this.gameType.isMoveAllowed(c, n) || this.score.increase("tableau_to_tableau");
				else e instanceof Solitaire.Card && this.score.increase("tableau_to_tableau");
				l && c.isInTableau() && this.score.increase("foundation_to_tableau");
				!this.deck.freeCards.length && this.getOption("autoMove") != "off" && this.autoMoveObvious();
				this._setStep();
				this.moves.increase();
				this.gameType.moveAllowed("new_pile", c, e);
				j = true
			} else c.returnPosition();
			if (this.gameType.isWin()) {
				this.deck.disable();
				this._animGameOver.delay(750, this)
			}
			return j
		},
		_animGameOver: function () {
			this.time.stop();
			this._isAnimGameOver = true;
			this.deck.cards.each(function (c) {
				c.toInt() <= 9 ? (new Fx.Morph(c.getElement(), {
					duration: 1E3,
					onComplete: function () {
						this.element.setStyles({
							top: -200,
							left: 0,
							opacity: 1
						})
					}
				})).start({
					opacity: 0
				}) : function () {
					var e = Math.random() * 500 + 3E3,
						f;
					f = function () {
						c.getElement().setStyles({
							top: -200,
							left: 0,
							opacity: 1
						}).show()
					};
					(new Fx.Morph(c.getElement(), {
						duration: e,
						transition: Fx.Transitions.Bounce.easeOut,
						onComplete: f
					})).start({
						top: window.getHeight() + 15
					});
					(new Fx.Morph(c.getElement(), {
						duration: e,
						onComplete: f
					})).start({
						left: Math.random() * window.getWidth() - 90
					});
					c.retPosition = {
						top: -100,
						left: 0
					}
				}.delay(Math.random() * 1E3, this)
			}.bind(this));
			(function () {
				this.statsWinWindow.open({
					game_type: this.gameType.getId(),
					score_type: this.getOption("scoring"),
					score: this.score.getScores(),
					moves: this.moves.getMoves(),
					time: this.time.getTime()
				});
				(function () {
					this._isAnimGameOver = false
				}).delay(1E3, this);
				this.sound.play("win")
			}).delay(3E3, this)
		},
		isRunningAutoMoveObvious: function () {
			return this._autoMoveTimer
		},
		autoMoveObvious: function () {
			if (!(!this.deck.getNotFoundedCards().length || this.deck.getReversedCards().length || this._autoMoveTimer || !this.gameType.isEnabledAutoMoveObvious()))(this._autoMoveTimer = function () {
				var c;
				if (this.deck.getNotFoundedCards().length) {
					if (this._winMoveFoundationIndex === undefined || this._winMoveFoundationIndex >= this.gameType.getFoundationPileCount()) this._winMoveFoundationIndex = 0;
					for (var e = true; e;) {
						var f = this.deck.getLastCardByFoundationId(this._winMoveFoundationIndex),
							g = [];
						if (f) {
							if (f.getSymbol() != "K") {
								c = this.gameType.getReverseRuleFoundationById(f.getId(), true);
								g = this.deck.getCard(c.symbol, c.color);
								for (c = 0; c < g.length; c++) if (!(g[c].getNextCard() || g[c].isFounded())) if (this.checkMove(g[c], f, true, true)) {
									e = false;
									break
								}
							}
						} else {["c", "s", "h", "d"].each(function (h) {
								this.deck.getCard("A", h).each(function (i) {
									g.push(i)
								})
							}.bind(this));
							for (c = 0; c < g.length; c++) if (!(g[c].getNextCard() || g[c].isFounded())) if (this.checkMove(g[c], this.foundation.getSlot(this._winMoveFoundationIndex), true, true)) {
								e = false;
								break
							}
						}
						this._winMoveFoundationIndex++;
						if (this._winMoveFoundationIndex >= this.gameType.getFoundationPileCount()) this._winMoveFoundationIndex = 0
					}
				} else this.stopMoveObvious()
			}.periodical(400, this)) && this.deck.getNotFoundedCards().invoke("detachDrag")
		},
		stopMoveObvious: function () {
			clearInterval(this._autoMoveTimer);
			this._autoMoveTimer = null
		},
		onDeckDealToBlankBoardCard: function (c, e) {
			this.tableau.setCardBySlotElement(c, e)
		},
		onMenuClickNewGame: function () {
			if (!this.isBusy()) {
				this.statsWinWindow.close();
				this.time.stop();
				this._clean();
				this.deck.shuffle(true, false)
			}
		},
		onMenuClickRestartGame: function () {
			if (!this.isBusy()) {
				this.statsWinWindow.close();
				this.time.stop();
				this._clean();
				this.deck.shuffle(true, true)
			}
		},
		onClickResumeOnPausedGame: function () {
			this.time.start()
		},
		onMenuSkinWindowChange: function (c, e) {
			if (c == "deckType" || c == "cardBackType") this.deck.setOption(c, e);
			if (c == "backgroundType") {
				this._setBackground();
				this._setBackgroundBlankCard()
			}
		},
		onMenuOptionWindowChange: function (c, e) {
			this.setOption(c, e);["showTime", "showScore", "showMoves"].indexOf(c) != -1 && this._setControlLabelsVisibility();
			c == "sound" && this.sound.setBankType(e)
		},
		onMenuGamesWindowChange: function (c) {
			this.setOption("game", c);
			if (c != this.gameType.getId() && !this.shuffling) {
				Solitaire.Indicator().show();
				this._clean();
				this.deck.shuffle();
				this.deck.addEvent("shuffled:once", function () {
					this.gameType = this.gameOptions.getGame(c);
					this.gameType.setApplication(this);
					this.deck.setGameType(this.gameType);
					this._setBackgroundBlankCard();
					var e = function () {
						this.deck.shuffling = false;
						this.deck.shuffle(true);
						this.deck.addEvent("delt:once", function () {
							if (this.getOption("game") != this.gameType.getId()) this.onMenuGamesWindowChange(this.getOption("game"));
							else Solitaire.Indicator().hide()
						}.bind(this))
					}.bind(this);
					if (this.gameType.getName() == this.layout.getGameType()) e.call(this);
					else {
						this.layout.setGameType(this.gameType.getName());
						this.layout.addEvent("change:once", e)
					}
				}.bind(this))
			}
		},
		onCardDrop: function (c, e) {
			if (!this.shuffling) {
				var f, g = false,
					h = false,
					i = 0,
					j = 0,
					k, m;
				m = function () {
					if (e.length) {
						h = false;
						for (j = 0; j < e.length; j++) {
							if (f.isInTableau()) if (!this.tableau.getCardBySlotElement(e[j])) {
								this.checkMove(f, e[j]);
								h = true;
								break
							}
							if (f.isInFoundation()) if (!this.foundation.getCardBySlotElement(e[j])) {
								this.checkMove(f, e[j]);
								h = true;
								break
							}
						}
						h || this.checkMove(f, null)
					} else this.checkMove(f, null)
				};
				f = c.retrieve("solitaire:card:model");
				g = false;
				if (typeOf(e) == "elements") {
					g = e.retrieve("solitaire:card:model").clean();
					g = g.filter(function (l) {
						if (l instanceof Solitaire.Card) return l.isFront();
						return false
					});
					if (g.length) {
						i = 0;
						for (k = g.length; i < k; i++) if (this.gameType.isMoveAllowed(f, g[i])) {
							h = true;
							this.checkMove(f, g[i]);
							break
						}
						h || m.call(this)
					} else m.call(this)
				}
			}
		},
		onUndoClick: function (c) {
			c && c.preventDefault();
			this.isBusy() || this.gameType.undo()
		},
		onAuthClick: function (c) {
			c.preventDefault();
			if (this.player.isLogged()) {
				this.authWindow.setOptions({
					player_data: this.player.getData()
				});
				this.authWindow.open("info")
			} else this.authWindow.open("login")
		},
		onPlayerLogin: function (c) {
			if (c.result == "ok") {
				this.auth.login(c.response);
				Solitaire.Indicator().hide()
			} else {
				this.auth.logout();
				c.silentMode ? Solitaire.Indicator().hide() : function () {
					this.authWindow.open("login", true);
					Solitaire.Indicator().hide()
				}.delay(1E3, this)
			}
		},
		onPlayerRegister: function (c) {
			if (c.result == "ok") {
				this.auth.login(c.response);
				Solitaire.Indicator().hide()
			} else {
				this.auth.logout();
				c.silentMode ? Solitaire.Indicator().hide() : function () {
					this.authWindow.open("register", true);
					Solitaire.Indicator().hide()
				}.delay(1E3, this)
			}
		},
		onPlayerLogout: function () {
			Solitaire.Indicator().hide()
		},
		onAuthClickLogin: function (c) {
			Solitaire.Indicator().show();
			this.player.login(c.name, c.password)
		},
		onAuthClickRegister: function (c) {
			Solitaire.Indicator().show();
			this.player.register(c.name, c.password)
		},
		onAuthClickLogout: function () {
			Solitaire.Indicator().show();
			this.player.logout();
			this.auth.logout()
		},
		onLayoutWidthChange: function () {
			if (this.loaded) {
				this._updateTableauCardsPosition();
				this._updateFoundationCardsPosition();
				this._updateFreeCardsPosition()
			}
		},
		onLayoutHeightChange: function () {
			if (this.loaded) {
				this._setStep();
				this._updateTableauCardsPosition()
			}
		},
		onLayoutChange: function () {
			this.onLayoutWidthChange();
			this.onLayoutHeightChange()
		},
		onCardClick: function (c) {
			if (!this.isBusy()) {
				c =
				c.target;
				this.deck._newDeckLoop = false;
				c.hasClass("card") || (c = c.getParent(".card"));
				c = c.retrieve("solitaire:card:model");
				if (c.isInWaste() && this.deck.isInStack(c)) {
					c = this.deck.turnOver(c);
					if (c.length) {
						this.moves.increase();
						this._fireUserActivityEvent()
					}
				} else if (c.isReversed() && c.isInTableau()) c.getNextCard() || c.setReversed(false)
			}
		},
		onCardDblClick: function (c) {
			if (!this.isBusy()) {
				c = c.target;
				c.hasClass("card") || (c = c.getParent(".card"));
				c = c.retrieve("solitaire:card:model");
				this.gameType.moveToFoundation(c)
			}
		},
		onDeckShuffled: function () {
			this.foundation.clearSlots();
			this.tableau.clearSlots();
			this.time.stop();
			this._setStep.delay(1E3, this)
		},
		onDeckDeal: function () {
			this.foundation.clearSlots()
		},
		onDeckDelt: function () {
			this._setStep();
			this.shuffling = false;
			this.moves.reset();
			this.time.reset();
			this.score.setType(this.getOption("scoring"));
			this.score.reset()
		},
		onOptionsLoaded: function (c) {
			this.setOption("autoFlip", c.getOptionWindowParam("autoFlip"));
			this.setOption("autoMove", c.getOptionWindowParam("autoMove"));
			this.setOption("showTime", c.getOptionWindowParam("showTime"));
			this.setOption("showScore", c.getOptionWindowParam("showScore"));
			this.setOption("showMoves", c.getOptionWindowParam("showMoves"));
			this.setOption("scoring", c.getOptionWindowParam("scoring"));
			this.player = new Solitaire.Player;
			var e = this._getGameTypeFromUrl();
			e || (e = c.getOptionWindowParam("game"));
			this.gameType = this.gameOptions.getGame(e);
			this.gameType.setApplication(this);
			this._setBackgroundBlankCard();
			this.layout = new Solitaire.Layout({
				layoutType: this.gameType.getName()
			});
			this.sound = new Solitaire.Sound(c.getOptionWindowParam("sound"));
			this.deck = new Solitaire.Deck(this.gameType, c.getSkinWindowParam("deckType"), c.getSkinWindowParam("cardBackType"));
			this.deck.shuffle(true);
			this.score = new Solitaire.Control.Score(c.getOptionWindowParam("scoring"));
			this.moves = new Solitaire.Control.Moves;
			this.time = new Solitaire.Control.Time;
			this.auth = new Solitaire.Control.Auth;
			this.tableau = new Solitaire.Tableau;
			this.foundation = new Solitaire.Foundation;
			this.menu = new Solitaire.Menu(c);
			this.initEvents();
			this._setControlLabelsVisibility();
			this.gameStatusContentFx.start.delay(1500, this.gameStatusContentFx, {
				top: 0
			});
			this.loaded = true;
			this.player.silentLogin();
			Solitaire.get("place_name") == "my-score" &&
			function () {
				this.statsWinWindow.open(Object.merge(Solitaire.get("place_params"), {
					preview: true
				}))
			}.delay(500, this)
		},
		onClickEmptyStack: function () {},
		isBusy: function () {
			return this.shuffling || this._autoMoveTimer || this._isAnimGameOver || false
		},
		_clean: function () {
			this.stopMoveObvious();
			this._isStartPlaying = false;
			this.gameType.reset();
			this.shuffling = true
		},
		_fireUserActivityEvent: function () {
			if (!this._isStartPlaying) {
				this._isStartPlaying = true;
				this.time.start()
			}
		},
		_setStep: function () {
			if (!this.deck.shuffling) {
				var c = window.getHeight();
				this.tableau.getCards().each(function (e) {
					if (e) {
						var f = e.getElement(),
							g = e.getLastCardIndex(),
							h = f.getTop() + f.getHeight() + g * e.step;
						f = f.getTop() + f.getHeight() + g * e.defaultStep;
						if (h > c && !e.isDecreased()) e.decreaseStep();
						else h < c && f < c && !e.isIncreased() && e.increaseStep()
					}
				}.bind(this))
			}
		},
		_setBackground: function () {
			$(document.body).setStyle("background-image", "url(" + this.gameOptions.getBackgroundSrc() + ")");
			this.gameOptions.getSkinWindowParam("themeAuthor") ? $("footer_theme_author").set("html", this.gameOptions.getSkinWindowParam("themeAuthor")).show() : $("footer_theme_author").hide()
		},
		_setBackgroundBlankCard: function () {
			$$(this.cardEmptyPattern).setStyle("background-image", "url(" + this.gameOptions.getCardEmptySrc() + ")")
		},
		_setControlLabelsVisibility: function () {
			var c = 0,
				e = 0;["Time", "Score", "Moves"].each(function (f) {
				var g = this[f.toLowerCase()].getElement();
				if (this.getOption("show" + f)) {
					g.show();
					c += (g.getWidth() || 110) + g.getStyle("margin-left").toInt();
					e++
				} else g.hide()
			}.bind(this));
			if (c) {
				this.labelBg.show();
				this.labelBg.getElement("#bg_label").setStyles({
					width: c + 3
				});
				this.labelBg.setStyles({
					width: c + 20
				})
			} else this.labelBg.hide()
		},
		_updateTableauCardsPosition: function () {
			this.deck.shuffling || this.tableau.getCards().each(function (c, e) {
				if (c) c.getPrevCard() || c.setPosition(this.tableau.getSlot(e), false)
			}.bind(this))
		},
		_updateFoundationCardsPosition: function () {
			this.deck.shuffling || this.foundation.getCards().each(function (c, e) {
				c && c.setPosition(this.foundation.getSlot(e), false)
			}.bind(this))
		},
		_updateFreeCardsPosition: function () {
			this.deck.shuffling || this.deck.getFreeCards().each(function (c) {
				c.isReversed() ? c.setPosition(this.deck.stack, false, undefined, false, false) : c.setPosition(this.deck.getShowedCardStackPos(), false, undefined, false, false)
			}.bind(this))
		},
		_getGameTypeFromUrl: function () {
			var c = location.hash.replace("#", "");
			if (c) location.hash = "";
			if (Solitaire.get("place_name") == "my-score") c = Solitaire.get("place_params").game_type;
			return c || false
		}
	})
}).call(Solitaire);
var $info = function () {
	if (Solitaire.DEBUG) try {
		console.log.apply(this, arguments)
	} catch (a) {
		console.log(arguments.length == 1 ? arguments[0] : arguments)
	}
};

function init() {
	var a = function () {
		var d = String.toLowerCase(function () {
			if (navigator.language) return navigator.language;
			return navigator.browserLanguage
		}());
		return d == "pl" ? "pl-pl" : d
	},
		b = new Solitaire.Options({
			defaultParams: {
				skin: {
					deckType: "classic_old",
					cardBackType: "classic_old",
					backgroundType: "classic_old",
					themeType: "classic_old"
				},
				option: {
					game: "klondike:turn-one",
					sound: Browser.isMobile ? "off" : "wood",
					autoMove: "when_won",
					autoFlip: true,
					showTime: true,
					showScore: true,
					showMoves: true,
					lang: a()
				}
			}
		});
	b = new Solitaire.Game(b);
	if (document.domain == "pasjans-online.k") window._po = b;
	if (!Solitaire.Lang.exists(a()) && !Browser.isMobile) if ($("translate_me")) {
		$$("#footer_menu_left .footer_separator_last").show("inline-block");
		$("translate_me").show("inline-block")
	}
};