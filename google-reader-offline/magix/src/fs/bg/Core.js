with($ns("fs.bg")) {
	fs.bg.CoreClass = function () {
		var me = this;

		me.backgroundView = chrome.extension.getBackgroundPage();
		me.gReaderListener = null;

		me.init = function () {
			_imgIcon = $new("img");
			_imgIcon.src = $mappath("~/icons/app_19.png");

			g.Reader.onTokenChanged.$(g_Reader_onTokenChanged);

			fs.bg.Storage.onUnreadsChanged.$(fs_bg_Storage_onUnreadsChanged);
		};




		me.listeners = [];

		me.icon = null;
		me.setIcon = function (value) {
			if (value == null) {
				value = "app_19";
			}
			if (me.icon != value) {
				me.icon = value;
				chrome.browserAction.setIcon({
					path: $mappath("~/icons/" + me.icon + ".png")
				});
			}
		};


		var _originIcon = null;
		var _imgIcon = null;
		var _aniIcon = null;
		var _aniIconContext = null;
		var _animating = false;
		me.animateIcon = function () {
			if (_animating) return;

			_animating = true;

			if (_aniIcon == null) {
				_aniIcon = $new("canvas");
				_aniIcon.setAttribute("width", 19);
				_aniIcon.setAttribute("height", 19);

				_aniIconContext = _aniIcon.getContext('2d');
				_aniIconContext.drawImage(_imgIcon, 0, 0);
			}

			_originIcon = me.icon;
			me.icon = "animation";
			_animateFlip(function () {
				_animating = false;
				me.setIcon(me.icon);
			});
		};




		var _titleInit = false;
		me.title = null;
		me.setTitle = function (value, p_arguments) {
			if (!_titleInit || me.title != value) {
				_titleInit = true;
				me.title = value != null ? value : null;

				var title = null;
				var userStatus = "\r\n - " + (g.Account.userID ? g.Account.userID : $msg("user_status_unauthenticated"));
				if (value == null) {
					title = $mainfest.browser_action.default_title;
				}
				else {
					title = $msg(value, p_arguments);
					if (title == null || title == "" || title == "null") {
						throw new Error("Unrecognized locale message key: " + value);
					}
				}

				chrome.browserAction.setTitle({
					title: title + userStatus
				});
			}
		};


		me.popup = null;
		me.setPopup = function (p_popup) {
			if (p_popup == null) {
				p_popup = "";
			}
			if (me.popup != p_popup) {
				me.popup = p_popup;
				chrome.browserAction.setPopup({
					popup: (me.popup != "" ? me.popup : "")
				});
			}
		};


		me.badge = -1;
		me.setBadge = function (value) {
			if (me.badge != value) {
				me.badge = value;
				if (value == 0) {
					chrome.browserAction.setBadgeText({
						text: ""
					});
				}
				else {
					chrome.browserAction.setBadgeText({
						text: me.badge.toString()
					});
				}
			}
		};



		var _tabs = {};
		me.showTab = function (p_tabName, p_url, p_callback) {
			if (me[p_tabName] == null) {
				chrome.tabs.create({
					url: $mappath(p_url)
				}, function (tab) {
					me[p_tabName] = tab;
					_tabs[tab.id] = p_tabName;
					if (typeof(p_callback) == "function") {
						p_callback(tab);
					}
				});
			}
			else {
				chrome.tabs.update(me[p_tabName].id, {
					selected: true
				}, p_callback);
			}
		};
		chrome.tabs.onRemoved.addListener(function (p_tabId) {
			if (_tabs[p_tabId] != null) {
				me[_tabs[p_tabId]] = null;
				delete _tabs[p_tabId];
			}
		});

		me.browserTab = null;
		me.showBrowserTab = function (p_path, p_callback) {
			me.showTab("browserTab", "~/pages/browser.html" + (p_path ? ("#" + p_path) : ""), p_callback);
		};

		function g_Reader_onTokenChanged(sender, e) {
			if (me.gReaderListener == null) {
				me.gReaderListener = new fs.listeners.GReaderListener();
			}

			me.gReaderListener.feedCheckInterval = fs.Pref.getSetting("gen", "feedCheckInterval");

			if (g.Reader.token != null) {
				me.gReaderListener.startListening();
			}
			else {
				me.gReaderListener.stopListening();
			}
		}

		function fs_bg_Storage_onUnreadsChanged(sender, e) {
			var unreads = fs.bg.Storage.unreads.length;
			if ((me.badge == -1 && unreads > 0) || (me.badge != -1 && me.badge < unreads)) {
				me.animateIcon();
			}
			me.setBadge(unreads);
		}






		var _rotation = 0,
			_numrotations = 504,
			_currrotation = 0,
			_aniCallback;

		function _animateFlip(p_callback) {
			if (p_callback != null) {
				_aniCallback = p_callback;
			}
			_rotation += 1 / 36;
			if (_rotation >= 1) {
				_rotation -= 1;
			}
			if (++_currrotation >= _numrotations) {
				_rotation = 0;
				if (_aniCallback != null) {
					_aniCallback();
					_aniCallback = null;
				}
			}
			else {
				setTimeout(_animateFlip, 10);
			}
			drawIconAtRotation(_rotation);
		}


		function drawIconAtRotation(p_rotation) {
			var c = _aniIconContext;
			c.save();
			c.clearRect(0, 0, 19, 19);
			c.translate(9, 9);
			c.rotate(2 * Math.PI * ease(p_rotation));
			c.drawImage(_imgIcon, -_imgIcon.width / 2, -_imgIcon.height / 2);
			c.restore();
			chrome.browserAction.setIcon({
				imageData: c.getImageData(0, 0, 19, 19)
			});
		}

		function ease(p_degree) {
			return (1 - Math.sin(Math.PI / 2 + p_degree * Math.PI)) / 2;
		}

		return me;
	};

	fs.bg.Core = new fs.bg.CoreClass();
}