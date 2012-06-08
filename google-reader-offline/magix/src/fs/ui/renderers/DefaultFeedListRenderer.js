$include("$res/fs/renderers/default.css");

with($ns("fs.ui.renderers")) {
	fs.ui.renderers.DefaultFeedListRenderer = function (p_container) {
		var me = new fs.ui.renderers.FeedListRenderer(p_container);

		me.renderListItem = function (f, p_container) {
			var li = $new("li");
			li.id = f.id;
			li.style.position = "relative";
			li.link = f.href;

			if (!me._hasRead(f)) {
				li.className = "unread";

				var imgNew = $new("img");
				imgNew.id = "imgNew";
				imgNew.src = $mappath("~/images/new.png");
				imgNew.style.zIndex = 10;
				imgNew.style.position = "absolute";
				imgNew.style.left = 0;
				imgNew.style.top = 0;
				li.appendChild(imgNew);
			}

			if (f.fav) {
				me.renderAsFavourites(f, li);
			}

			var lnkTitle = me._renderTitle(f, li);
			lnkTitle.style.position = "relative";
			me._renderInfo(f, li);
			me._renderContent(f, li);
			me._renderButtons(f, li).className = "bottom toolstrip";

			var topToolBar = lnkTitle.appendChild($new("div"));
			topToolBar.style.position = "absolute";
			topToolBar.style.bottom = "-2px";
			topToolBar.style.right = "0px";
			topToolBar.style.zIndex = 1000;
			me._renderButtons(f, topToolBar).className = "top toolstrip";

			return li;
		};

		me._renderTitle = function (f, p_container) {
			var lnkTitle = p_container.appendChild($new("a"));
			lnkTitle.id = "title";
			lnkTitle.link = f.href;
			lnkTitle.target = "_blank";
			lnkTitle.innerHTML = (f.title != null ? f.title : $msg("untitled"));
			lnkTitle.addEventListener("click", _lnkTitle_onclick, false);

			fs.ui.renderers.FeedListRenderer.applyPrefStyle(lnkTitle.style, "titleStyle");
			lnkTitle.style.borderBottom = "1px solid " + fs.Pref.getSetting("styles", "titleStyle", "color");

			if (!me._hasRead(f)) {
				var spanNew = lnkTitle.appendChild($new("span"));
				spanNew.id = "new";
				spanNew.innerText = $msg("new_feed");
			}
			return lnkTitle;
		};

		me._renderContent = function (f, p_container) {
			var divContent = p_container.appendChild($new("div"));
			divContent.id = "content";
			var content = me._getContent(f);
			divContent.innerHTML = content;

			fs.ui.renderers.FeedListRenderer.applyPrefStyle(divContent.style, "contentStyle");

			if (fs.Pref.getSetting("reading", "forceOpenInNewWindow")) {
				var links = divContent.getElementsByTagName("a");
				for (var i = 0; i < links.length; i++) {
					var lnk = links[i];
					if (!lnk.href.startsWith("javascript:") && !lnk.href.startsWith("#")) {
						lnk.target = "_blank";
					}
				}
			}
		};


		me._renderInfo = function (f, p_container) {
			var divInfo = p_container.appendChild($new("div"));
			divInfo.id = "info";
			me._renderPublished(f, divInfo);
			me._renderAuthor(f, divInfo);
			me._renderOrigin(f, divInfo);
			return divInfo;
		};

		me._renderPublished = function (f, p_container) {
			var divPublished = p_container.appendChild($new("div"));
			divPublished.id = "published";
			var publishDate = new Date(f.published);
			var publishedHint = me._getDateHint(publishDate);
			divPublished.innerText = Date.format(publishDate, $msg("date_time_format")) + publishedHint;
			return divPublished;
		};

		me._renderAuthor = function (f, p_container) {
			var divAuthor = p_container.appendChild($new("div"));
			divAuthor.id = "author";
			divAuthor.innerText = "| " + f.author;
			return divAuthor;
		};

		me._renderOrigin = function (f, p_container) {
			var divOrigin = p_container.appendChild($new("div"));
			divOrigin.id = "origin";

			var spanFrom = divOrigin.appendChild($new("span"));
			spanFrom.id = "from";
			spanFrom.innerText = $msg("from");


			var imgIcon = divOrigin.appendChild($new("img"));
			me._renderIcon(f, imgIcon);

			var lnkOrigin = divOrigin.appendChild($new("a"));
			lnkOrigin.target = "_blank";
			lnkOrigin.href = f.origin.htmlUrl;
			lnkOrigin.innerText = f.origin.title;

			return divOrigin;
		};

		me._renderButtons = function (f, p_container) {
			var toolStrip = p_container.appendChild($new("div"));
			toolStrip.className = "toolstrip";

			var toolBar = toolStrip.appendChild($new("ul"));
			toolBar.className = "toolbar";
			var button = null;

			button = toolBar.appendChild($new("li"));
			button.itemID = f.id;
			button.href = f.href;
			button.innerText = $msg("action_source");
			button.title = $msg("action_source");
			button.addEventListener("click", _btnSource_onclick, false);

			if (!me._hasRead(f)) {
				button = toolBar.appendChild($new("li"));
				button.id = "btnMarkAsRead";
				button.itemID = f.id;
				button.innerText = $msg("action_mark_as_read");
				button.title = $msg("action_mark_as_read");
				button.addEventListener("click", _btnMarkAsRead_onclick, false);
			}

			button = toolBar.appendChild($new("li"));
			button.id = "btnFavourite";
			button.itemID = f.id;
			button.appendChild($new("img")).src = $mappath("~/icons/favourite" + (f.fav ? "_yellow" : "") + "_16.png");
			button.title = f.fav ? $msg("action_remove_from_favourites") : $msg("action_add_to_favourites");
			button.addEventListener("click", _btnFavourite_onclick, false);

			if (me.control.path != "favourites") {
				button = toolBar.appendChild($new("li"));
				button.id = "btnDelete";
				button.itemID = f.id;
				button.className = "warning";
				button.appendChild($new("img")).src = $mappath("~/icons/delete_16.png");
				button.title = $msg("action_delete");
				button.addEventListener("click", _btnDelete_onclick, false);
			}
			return toolStrip;
		};

		me._renderIcon = function (f, p_img) {
			var sub = fs.bg.Storage.getSubscription(f.origin.streamId);
			if (sub != null) {
				p_img.addEventListener("error", function () {
					event.srcElement.src = $mappath("~/icons/subscription_16.png");
				}, false);

				if (sub.icon != null) {
					p_img.src = sub.icon;
				}
				else {
					var imgUrl = me._getFavIcon(f);
					var img = new Image();
					img.addEventListener("load", function () {
						if (sub.icon != imgUrl) {
							$trace(sub.title + " - " + imgUrl);
							p_img.src = img.src;
							sub.icon = img.src;
							fs.bg.Storage.saveSubscriptions({
								iconChangedOnly: true
							});
						}
					}, false);
					img.src = imgUrl;
				}
			}
			else {
				p_img.src = $mappath("~/icons/subscription_16.png");
			}
		};

		me._getFavIcon = function (f) {
			if (f.origin != null && typeof(f.origin.htmlUrl) != "undefined") {
				var url = f.origin.htmlUrl;
				if (url.startsWith("http://")) {
					var pos = url.indexOf("/", 7);
					if (pos == -1) {
						return url + "/favicon.ico";
					}
					else {
						return url.substr(0, pos) + "/favicon.ico";
					}
				}
				else {
					return url + "/favicon.ico";
				}
			}
		};


		me._getDateHint = function (p_date) {
			var result = "";
			var now = new Date();
			var deltaMin = parseInt((now.getTime() - p_date) / 1000 / 60);
			if (deltaMin < 1) {
				deltaMin = 1;
				result = " (" + $msg("minute_ago") + ")";
			}
			else if (deltaMin < 60) {
				result = " (" + $msg("minutes_ago", [deltaMin]) + ")";
			}
			else if (deltaMin == 60) {
				result = " (" + $msg("hour_ago") + ")";
			}
			else {
				var deltaHour = parseInt(deltaMin / 60);
				if (deltaHour < 24) {
					result = " (" + $msg("hours_ago", [deltaHour]) + ")";
				}
				else if (deltaHour == 24) {
					result = " (" + $msg("day_ago") + ")";
				}
				else {
					var deltaDay = parseInt(deltaHour / 24);
					if (deltaDay < 31) {
						result = " (" + $msg("days_ago", [deltaDay]) + ")";
					}
				}
			}
			return result;
		};

		me.markAsRead = function (f, p_container) {
			p_container.className = p_container.className.replace("unread", "");
			p_container.style.webkitTransition = "all 0.5s linear";

			var lnkTitle = p_container.childNodes["title"];

			var spanNew = lnkTitle.childNodes["new"];
			spanNew.style.webkitTransition = "opacity 1s linear";
			spanNew.style.opacity = "0";

			var imgNew = p_container.childNodes["imgNew"];
			imgNew.style.webkitTransition = "opacity 0.5s linear";
			imgNew.style.opacity = "0";

			var buttons = p_container.getElementsByTagName("li");
			for (var i = 0; i < buttons.length; i++) {
				if (buttons[i].id == "btnMarkAsRead") {
					buttons[i].parentNode.removeChild(buttons[i]);
				}
			}
			p_container.style.webkitTransition = "";
		};

		me.renderAsSelected = function (f, p_container) {
			if (p_container.className.indexOf("selected") == -1) {
				p_container.className += " selected";
			}
		};

		me.renderAsUnselected = function (f, p_container) {
			p_container.className = p_container.className.replace("selected", "");
		};

		me.renderAsFavourites = function (f, p_container, p_animate) {
			var imgRibbon = $new("img");
			imgRibbon.id = "imgRibbon";
			imgRibbon.title = $msg("your_favourite");
			imgRibbon.src = $mappath("~/images/ribbon.png");
			imgRibbon.style.position = "absolute";
			imgRibbon.style.posLeft = -9;
			imgRibbon.style.posTop = -6;
			imgRibbon.style.zIndex = 11;
			p_container.appendChild(imgRibbon);

			if (p_animate) {
				imgRibbon.style.opacity = "0";
				imgRibbon.style.webkitTransition = "opacity 1s linear";
				setTimeout(function () {
					imgRibbon.style.opacity = "1";
				}, 10);
			}
		};

		me.renderAsNonFavourites = function (f, p_container, p_animate) {
			var imgRibbon = p_container.childNodes["imgRibbon"];
			if (imgRibbon) {
				if (p_animate) {
					imgRibbon.style.webkitTransition = "opacity 0.5s linear";
					imgRibbon.style.opacity = "0";
					setTimeout(function () {
						p_container.removeChild(imgRibbon);
					}, 500);
				}
				else {
					p_container.removeChild(imgRibbon);
				}
			}
		};


		function _lnkTitle_onclick(e) {
			if (event.srcElement.id != "title") return;

			if (me.container.className.indexOf("list-view") != -1) {
				var li = event.srcElement;
				while (li.tagName != "LI") {
					li = li.parentNode;
					if (li == null) return;
				}


				if (li.className.indexOf("expand") == -1) {
					li.className += " expand";
				}
				else {
					li.className = li.className.replace("expand", "");
				}
				e.returnValue = false;
			}
			else {
				window.open(event.srcElement.link);
			}
		}



		function _btnSource_onclick(e) {
			e.stopPropagation();

			var btn = event.srcElement;
			var item = me.container.childNodes[btn.itemID];
			me.control.openSourceLink(item);
		}

		function _btnMarkAsRead_onclick(e) {
			e.stopPropagation();

			var btn = event.srcElement;
			var item = me.container.childNodes[btn.itemID];
			me.control.markAsRead(item);
		}

		function _btnFavourite_onclick(e) {
			e.stopPropagation();

			var btn = event.srcElement;
			while (btn.tagName != "LI") {
				btn = btn.parentNode;
				if (btn == null) {
					return;
				}
			}

			me.control.switchFavourites(me.container.childNodes[btn.itemID]);
		}

		function _btnDelete_onclick(e) {
			e.stopPropagation();

			var btn = event.srcElement;
			while (btn.tagName != "LI") {
				btn = btn.parentNode;
				if (btn == null) {
					return;
				}
			}

			var f = fs.bg.Storage.getFeed(btn.itemID);
			if (f != null) {
				if (fs.bg.Storage.containsFavourite(f.id)) {
					if (confirm($msg("confirm_remove_from_favourites"))) {
						fs.bg.Storage.removeFavourite(f.id);
					}
					else {
						return;
					}
				}

				var li = me.container.childNodes[btn.itemID];
				if (li != null) {
					me.control.removeItem(f);
					fs.bg.Storage.removeFeed(f);
				}
			}
		}

		return me;
	};
}