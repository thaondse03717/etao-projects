with($ns("fs.ui.views")) {
	fs.ui.views.NaviListView = function (p_container) {
		var me = new mx.controls.Control(p_container);

		var naviMap = [
			{
			id: "localstorage",
			items: [
				{
				id: "all",
				icon: "folders"},
			{
				id: "unreads",
				icon: "folder_unread"},
			{
				id: "favourites",
				icon: "folder_fav"},
			{
				id: "today",
				icon: "folder_time"},
			{
				id: "24hours",
				icon: "folder_time"}
			]},


		{
			id: "options",
			items: [
				{
				id: "preferences",
				icon: "preferences"}
			]},

		{
			id: "subscriptions"}
		];


		var _ulSubscription = null;

		me.selectedItem = null;
		me.selectedPath = null;
		me.onSelectionChanged = new Event();
		me.onSelectionChanging = new Event();


		me.init = function () {
			me.setCssClass("navi-list");

			_initList();
			_loadSubscriptions();

			setTimeout(_updateBadges, 500);
			setTimeout(_updateIcons, 300);

			me.container.addEventListener("click", _onclick);

			fs.bg.Storage.onSubscriptionsChanged.$(fs_bg_Storage_onSubscriptionsChanged);
			fs.bg.Storage.onUnreadsChanged.$(fs_bg_Storage_onUnreadsChanged);
		};



		me.getItem = function (p_id) {
			var item = me.container.all[p_id];
			return item != null ? item : null;
		};

		me.selectItem = function (p_id, p_callback, p_errorCallback) {
			var item = me.getItem(p_id);
			if (item != null) {
				if (me.selectedItem != item) {
					var args = {
						selectingPath: p_id,
						cancel: false
					};
					me.onSelectionChanging.fire(me, args);
					if (args.cancel) return;

					if (me.selectedItem != null) {
						me.selectedItem.className = me.selectedItem.className.replace("selected", "");
					}
					if (item.className.indexOf("selected") == -1) {
						item.className += " selected";
					}
					me.selectedItem = item;
					me.selectedPath = p_id;

					args = {
						lastSelectedPath: me.selectedPath
					};
					me.onSelectionChanged.fire(me, args);
				}
				if (typeof(p_callback) == "function") {
					p_callback();
				}
			}
			else {
				if (typeof(p_errorCallback) == "function") {
					p_errorCallback();
				}
			}
		};

		me.setBadge = function (p_id, p_badge) {
			var item = me.getItem(p_id);
			if (item != null) {
				if (item.childNodes.length > 1 && item.childNodes[item.childNodes.length - 1].className == "badge") {
					var node = item.childNodes[item.childNodes.length - 1];
					node.innerText = p_badge.toString();
					if (p_badge == 0) {
						item.className = item.className.replace("unread", "");
						node.style.display = "none";
					}
					else {
						if (item.className.indexOf("unread") == -1) {
							item.className += " unread";
						}
						node.style.display = "";
					}
				}
			}
		};

		me.getBadge = function (p_id) {
			var item = me.getItem(p_id);
			if (item != null) {
				if (item.childNodes.length > 1 && item.childNodes[item.childNodes.length - 1].className == "badge") {
					var node = item.childNodes[item.childNodes.length - 1];
					var text = node.innerText;
					if (text != null && text != "") {
						return parseInt(text);
					}
					else {
						return 0;
					}
				}
			}
			return null;
		};


		function _initList() {
			for (var i = 0; i < naviMap.length; i++) {
				var node1 = naviMap[i];

				if (g.Account.authState == 0) {
					continue;
				}

				var ul = _addListItem1(node1.id, $msg("navi_list_" + node1.id)).getElementsByTagName("UL")[0];
				if (node1.items != null) {
					for (var j = 0; j < node1.items.length; j++) {
						var node2 = node1.items[j];
						_addListItem2(node2.id, node2.icon, ul);
					}
				}
			}

			_ulSubscription = me.container.childNodes["subscriptions"].getElementsByTagName("UL")[0];
			_ulSubscription.addEventListener("mousedown", _ulSubscription_onmousedown);
		}

		function _loadSubscriptions() {
			while (_ulSubscription.childNodes.length > 0) {
				_ulSubscription.removeChild(_ulSubscription.firstChild);
			}

			var subs = fs.bg.Storage.subscriptions;
			for (var i = 0; i < subs.length; i++) {
				var s = subs[i];
				var c = subs[i].categories[0];

				var li = _createListItem2(s.id, s.title, $mappath("~/icons/subscription_16.png"), "#" + s.id);
				li.className = "subscription";
				var img = li.getElementsByTagName("img")[0];
				img.className = "fav";

				if (c != null) {
					if (me.container.childNodes[c.id] == null) {
						_addListItem1(c.id, c.label);
					}
					var cLI = me.container.childNodes[c.id];
					var cUL = cLI.getElementsByTagName("ul")[0];
					cUL.appendChild(li);
					cUL.addEventListener("mousedown", _ulSubscription_onmousedown);
				}
				else {
					_ulSubscription.appendChild(li);
				}
			}

			if (me.selectedPath != null) {
				var path = me.selectedPath;
				me.selectedItem = null;
				me.selectedPath = null;
				me.selectItem(path, null, function () {
					me.selectItem("favourites");
				});
			}
		}

		function _addListItem1(p_id, p_text) {
			var li = me.container.appendChild($new("li"));
			li.id = p_id;
			var img = $new("img");
			img.src = $mappath("~/icons/expand_16.png");
			img.style.webkitTransition = "all 0.1s linear";
			li.appendChild(img);
			var lnk = li.appendChild($new("a"));
			lnk.innerText = p_text;
			var ul = li.appendChild($new("ul"));

			lnk.addEventListener("click", _li_expandCollapse);
			img.addEventListener("click", _li_expandCollapse);

			return li;
		}

		function _addListItem2(p_id, p_iconName, p_ownerList) {
			var li = _createListItem2(p_id, $msg("navi_list_" + p_id), $mappath("~/icons/" + p_iconName + "_16.png"), "#" + p_id);
			p_ownerList.appendChild(li);
			return li;
		}

		function _addFolder(p_id, p_title) {
			var li = _createListItem2(p_id, $msg("navi_list_" + p_id), $mappath("~/icons/folder_16.png"), "#" + p_id);
			me.container.appendChild(li);
			return li;
		}

		function _createListItem2(p_id, p_text, p_iconUrl) {
			var li = $new("li");
			li.id = p_id;
			li.title = p_text;
			var img = li.appendChild($new("img"));
			img.src = p_iconUrl;
			var lnk = li.appendChild($new("a"));
			lnk.innerText = p_text;
			var badge = li.appendChild($new("span"));
			badge.className = "badge";
			badge.style.display = "none";
			return li;
		}

		function _onclick() {
			var e = event.srcElement;
			while (e.tagName != "LI") {
				e = e.parentNode;
				if (e == null) return;
			}

			if (e.parentNode != me.container) {
				me.selectItem(e.id);
			}
		}

		function _getSubscriptionItems() {
			var result = [];
			var children = me.container.getElementsByTagName("li");
			for (var i = 0; i < children.length; i++) {
				if (children[i].className.indexOf("subscription") != -1) {
					result.add(children[i]);
				}
			}
			return result;
		}

		function _updateBadges() {
			me.setBadge("unreads", fs.bg.Storage.unreads.length);

			var children = _getSubscriptionItems();
			var statistics = {};
			for (var i = 0; i < children.length; i++) {
				statistics[children[i].id] = 0;
			}

			var unreads = fs.bg.Storage.queryFeeds("unreads");

			for (var i = 0; i < unreads.length; i++) {
				var f = unreads[i];
				var id = f.origin.streamId;
				if (statistics[id] != null) {
					statistics[id]++;
				}
			}

			for (var i = 0; i < children.length; i++) {
				var id = children[i].id;
				me.setBadge(id, statistics[id]);
			}
		}

		function _updateIcons() {
			var children = _getSubscriptionItems();
			for (var i = 0; i < children.length; i++) {
				var node = children[i];
				var s = fs.bg.Storage.getSubscription(node.id);
				if (s != null && s.icon != null) {
					var img = node.getElementsByTagName("img")[0];
					if (img != null) {
						img.src = s.icon;
					}
				}
			}
		}

		function fs_bg_Storage_onUnreadsChanged(sender, e) {
			_updateBadges();
		}

		function fs_bg_Storage_onSubscriptionsChanged(sender, e) {
			if (e) {
				if (e.iconChangedOnly) {
					_updateIcons();
				}
				else if (e.action == "reorder") {
					// do nothing
				}
			}
		}







		var _mouseX = 0,
			_mouseY = 0;
		var _dragList = null;
		var _dragging = false,
			_dragItem = null,
			_dragItemClass = null,
			_dragIndicator = null,
			_dragIndex = -1;
		var _sensitivity = 4;

		function _ulSubscription_onmousedown() {
			if (event.srcElement.tagName != "A") {
				return;
			}
			if (event.srcElement.parentNode != me.selectedItem) {
				return;
			}

			_dragList = event.srcElement;
			while (!(_dragList.tagName == "UL")) {
				_dragList = _dragList.parentNode;
				if (_dragList == null) {
					return;
				}
			}

			if (_dragList.childNodes.length <= 1) {
				return;
			}

			_mouseX = event.x;
			_mouseY = event.y;
			document.body.style.webkitUserSelect = "none";
			document.addEventListener("mouseup", _ulSubscription_onmouseup, false);
			document.addEventListener("mousemove", _ulSubscription_onmousemove, false);
		}

		function _ulSubscription_onmousemove() {
			if (_dragging) {
				_dragIndicator.style.posLeft = event.x - _dragIndicator.offsetWidth * 0.38;
				_dragIndicator.style.posTop = event.y - _dragIndicator.offsetHeight * 0.5;

				var rect = _dragList.getClientRects()[0];
				if (event.x < rect.right) {
					_dragIndicator.style.opacity = "";
					document.body.style.cursor = "pointer";

					var offsetY = event.y - rect.top;
					if (offsetY < 0) return;
					var index = parseInt(offsetY / _dragItem.offsetHeight);

					if (index > _dragList.childNodes.length) {
						index = _dragList.childNodes.length;
					}

					if (index != _dragIndex) {
						if (_dragIndex != -1) {
							var li = null;
							if (_dragIndex == _dragList.childNodes.length) {
								li = _dragList.childNodes[_dragIndex - 1];
							}
							else {
								li = _dragList.childNodes[_dragIndex];
							}
							li.style.borderTop = "";
							li.style.borderBottom = "";
						}

						_dragIndex = index;
						if (_dragIndex < _dragList.childNodes.length) {
							var li = _dragList.childNodes[_dragIndex];
							li.style.borderTop = "1px solid black";
						}
						else if (_dragIndex == _dragList.childNodes.length) {
							var li = _dragList.childNodes[_dragIndex - 1];
							li.style.borderBottom = "1px solid black";
						}
					}
				}
				else {
					_dragIndicator.style.opacity = "0.15";
					document.body.style.cursor = "no-drop";
				}
			}
			else {
				if (event.srcElement.tagName != "A" && event.srcElment.parentNode.id != "subscriptions") {
					return;
				}

				if (Math.abs(_mouseX - event.x) >= _sensitivity || Math.abs(_mouseY - event.y) >= _sensitivity) {
					_dragging = true;
					_dragItem = event.srcElement.parentNode;
					_dragItemClass = _dragItem.className;
					_dragItem.className = "";
					_dragIndex = -1;

					_dragIndicator = $new("div");
					_dragIndicator.innerText = _dragItem.childNodes[1].innerText;
					_dragIndicator.className = "navi-list-drag-indicator";
					_dragIndicator.style.posWidth = _dragItem.offsetWidth;
					_dragIndicator.style.posHeight = _dragItem.offsetHeight;
					_dragIndicator.style.lineHeight = _dragIndicator.style.height;
					_dragIndicator.style.posLeft = event.x;
					_dragIndicator.style.posTop = event.y;
					document.body.style.cursor = "pointer";
					document.body.appendChild(_dragIndicator);
				}
			}
		}

		function _ulSubscription_onmouseup() {
			document.body.cursor = "";
			document.body.style.webkitUserSelect = "";
			document.removeEventListener("mouseup", _ulSubscription_onmouseup, false);
			document.removeEventListener("mousemove", _ulSubscription_onmousemove, false);

			if (_dragging) {
				document.body.removeChild(_dragIndicator);

				if (_dragIndex != -1) {
					if (_dragIndex == _dragList.childNodes.length) {
						borderLI = _dragList.childNodes[_dragIndex - 1];

						// append
						_dragItem.parentNode.appendChild(_dragItem);
					}
					else {
						borderLI = _dragList.childNodes[_dragIndex];

						// insert
						_dragItem.parentNode.insertBefore(_dragItem, _dragList.childNodes[_dragIndex]);
					}
					borderLI.style.borderTop = "";
					borderLI.style.borderBottom = "";

					fs.bg.Storage.reorderSubscription(_dragItem.id, _dragIndex);
				}

				_dragItem.className = _dragItemClass;
				_dragging = false;
				_dragItem = null;
				_dragIndicator = null;
				_dragIndex = -1;
			}
		}



		function _li_expandCollapse() {
			var li = null;
			if (event.srcElement.tagName == "A" || event.srcElement.tagName == "IMG") {
				li = event.srcElement.parentNode;
			}

			var li = event.srcElement.parentNode;
			var ul = li.getElementsByTagName("UL")[0];
			var img = li.getElementsByTagName("IMG")[0];

			if (ul.style.display == "") {
				// collapse
				ul.style.display = "none";
				img.style.webkitTransform = "rotate(-90deg)";
			}
			else {
				// expand
				ul.style.display = "";
				img.style.webkitTransform = "";
			}
		}

		return me;
	};
}