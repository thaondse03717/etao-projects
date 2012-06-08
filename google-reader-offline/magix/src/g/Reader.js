with($ns("g")) {
	g.ReaderClass = function () {
		var me = this;

		me.init = function () {
			g.Account.onAuthStateChanged.$(_g_Account_onAuthStateChanged);
		};






		var _userIDInit = false;
		me.userID = null;
		me.onUserChanged = new Event();
		me.setUserID = function (value) {
			if (!_userIDInit || me.userID != value) {
				_userIDInit = true;
				me.userID = value;
				me.onUserChanged = new Event();
			}
		};


		var _tokenInit = false;
		me.token = null;
		me.onTokenChanged = new Event();
		me.setToken = function (value) {
			if (!_tokenInit || me.token != value) {
				_tokenInit = true;
				me.token = value;
				me.onTokenChanged.fire(me);
			}
		};



		me.fetchSubscriptions = function (p_callback, p_errorCallback) {
			var request = new XMLHttpRequest();
			request.open("GET", g.Urls["reader_api_subscription_list"], true);
			request.onreadystatechange = function () {
				if (request.readyState == 4) {
					if (request.status == 200) {
						var result = JSON.parse(request.responseText);
						if (typeof(p_callback) == "function") {
							p_callback(me, {
								result: result.subscriptions
							});
						}
					}
					else {
						if (typeof(p_errorCallback) == "function") {
							p_errorCallback(me, {
								httpStatus: request.status
							});
						}
					}
					_reportHttpStatus(request.status);
				}
			};
			request.send(null);
		};

		me.fetchReadingFeeds = function (p_condition, p_callback, p_errorCallback) {
			var queryParams = [];
			if (p_condition != null) {
				if (p_condition.exceptions != null) {
					queryParams.add("xt=" + escape(p_condition.exceptions));
				}
				if (p_condition.maxCount != null) {
					queryParams.add("n=" + p_condition.maxCount);
				}
				if (p_condition.beginTime != null) {
					queryParams.add("ot=" + p_condition.beginTime);
				}
			}

			var queryString = "";
			if (queryParams.length > 0) {
				queryString = "?" + queryParams.join("&");
			}
			var request = new XMLHttpRequest();
			request.open("GET", g.Urls["reader_api_reading_list"] + queryString, true);
			request.onreadystatechange = function () {
				if (request.readyState == 4) {
					if (request.status == 200) {
						var result = JSON.parse(request.responseText);
						if (typeof(p_callback) == "function") {
							p_callback(me, {
								result: result.items
							});
						}
					}
					else {
						if (typeof(p_errorCallback) == "function") {
							p_errorCallback(me, {
								httpStatus: request.status
							});
						}
					}
					_reportHttpStatus(request.status);
				}
			};
			request.send(null);
		};

		me.fetchUnreadFeeds = function (p_callback, p_errorCallback) {
			var args = {
				maxCount: 500,
				beginTime: fs.bg.Storage.getProfile("newestFeed", parseInt(new Date().getTime() / 1000)) + 1
			};


			if (fs.Pref.getSetting("gen", "downloadUnreadOnly")) {
				args.exceptions = "user/-/state/com.google/read";
			}

			me.fetchReadingFeeds(
			args, p_callback, p_errorCallback);
		};







		me.markAsRead = function (p_item, p_callback, p_errorCallback) {
			if (me.token == null || me.userID == null) {
				return;
			}

			var request = new XMLHttpRequest();
			request.open("POST", g.Urls["reader_api_edit_tag"], true);
			request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			var command = "a=" + encodeURIComponent("user/-/state/com.google/read") + "&async=true" + "&s=" + encodeURIComponent(p_item.origin.streamId) + "&i=" + encodeURIComponent(p_item.id) + "&T=" + encodeURIComponent(me.token);


			request.onreadystatechange = function () {
				if (request.readyState == 4) {
					if (request.status == 200) {
						if (typeof(p_callback) == "function") {
							if (request.responseText == "OK") {
								p_callback(me, {
									itemID: p_item.id
								});
							}
						}
					}
					else {
						if (typeof(p_errorCallback) == "function") {
							p_errorCallback(me, {
								httpStatus: request.status
							});
						}
					}
					_reportHttpStatus(request.status);
				}
			};
			request.send(command);
		};

		me.markAllAsRead = function (p_callback, p_errorCallback) {
			if (me.token == null || me.userID == null) {
				return;
			}

			var request = new XMLHttpRequest();
			request.open("POST", g.Urls["reader_api_mark_all_as_read"], true);
			request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			var command = "s=" + encodeURIComponent("user/-/state/com.google/reading-list") + "&T=" + encodeURIComponent(me.token);
			request.onreadystatechange = function () {
				if (request.readyState == 4) {
					if (request.status == 200) {
						if (typeof(p_callback) == "function") {
							if (request.responseText == "OK") {
								p_callback(me, null);
							}
						}
					}
					else {
						if (typeof(p_errorCallback) == "function") {
							p_errorCallback(me, {
								httpStatus: request.status
							});
						}
					}
					_reportHttpStatus(request.status);
				}
			};
			request.send(command);
		};




		function _renewToken() {
			var request = new XMLHttpRequest();
			request.open("GET", g.Urls["reader_api_token"], true);
			request.onreadystatechange = function () {
				if (request.readyState == 4) {
					if (request.status == 200) {
/*
                        if (!request.responseText.startsWith("//"))
                        {
                            me.setToken(request.responseText);
                        }
                        else
                        {
                            me.setToken(null);
                        }
                        */

						me.setToken(request.responseText);
						me.setUserID(request.getResponseHeader("X-Reader-User"));
					}
					else {
						me.setToken(null);
					}
					_reportHttpStatus(request.status);
				}
			};
			request.send(null);
		}




		function _g_Account_onAuthStateChanged(sender, e) {
			if (g.Account.authState == 1) {
				_renewToken();
			}
			else {
				fs.bg.Core.setIcon("app_unauthenticated_19");
				fs.bg.Core.setTitle("err_http_400");
				fs.bg.Core.setPopup("popups/unauthenticated.html");
				me.setToken(null);
			}
		}

		function _reportHttpStatus(p_status) {
			var msg = null;
			switch (p_status) {
			case 200:
				fs.bg.Core.setIcon();
				fs.bg.Core.setTitle();
				fs.bg.Core.setPopup();
				return;

			default:
				if ($msg("err_http_" + p_status)) {
					msg = "err_http_" + p_status;
				}
				else {
					msg = "err_http_common";
				}
				break;
			}

			if (p_status == 400 || p_status == 403) {
				fs.bg.Core.setIcon("app_unauthenticated_19");
			}
			else {
				fs.bg.Core.setIcon("app_warning_19");
			}
			fs.bg.Core.setTitle(msg, [p_status]);
		}

		return me;
	};

	g.Reader = new g.ReaderClass();
}