chrome.extension.sendRequest({options: true}, onOptionsLoaded);

// 读取插件配置后, 在页面中查找NID节点, 并且注入复选框
function onOptionsLoaded(options) {
	if (!options.selector_entry || !options.selector_link) {
		alert('Oops! cannot load extension settings, please contact the developer');
		return false;
	}

	var auctions = jQuery(options.selector_entry).css({ position: 'relative' });
	var checkbox = jQuery('<input type="checkbox"/>')
		.attr('title', 'Click to offline!')
		.addClass('checkbox injected')
		.css({
			position: 'absolute',
			left: '0px',
			top: '0px',
			width: '3em',
			height: '3em'
		});

	jQuery.each(auctions, function (i, item) {

		// 提取URI, 标题
		var auction = jQuery(options.selector_link, this);
		var url = auction.attr('href'), title = auction.attr('title'), nid = false;

		// 提取NID (内网商品和外网商品的连接不同)
		// 对于P4P商品需要额外的ajax请求来确定
		if (url != '') {
			var patterns = {
				id: /\?id=\d+/gi,						// 内网商品NID
				nid: /&nid=\d+/gi,					// 外网商品NID
				item_id: /itemid:\"\d+\"/gi	// P4P商品NID
			};

			var matches = {
				id : url.match(patterns.id),
				nid : url.match(patterns.nid)
			};

			if (matches.id) {
				nid = matches.id[0].substring(4, matches.id[0].length);
				addCheckboxListener(auction, checkbox, nid, url, title);
			} else if (matches.nid) {
				nid = matches.nid[0].substring(5, matches.nid[0].length);
				addCheckboxListener(auction, checkbox, nid, url, title);
			} else {
				jQuery.get(url, function (data) {
					matches.item_id = data.match(patterns.item_id);
					if (matches.item_id) {
						var nid = matches.item_id[0].substring(8, matches.item_id[0].length - 1);
						addCheckboxListener(auction, checkbox, nid, url, title);
					}
				});
			}
		}

	});
}

function addCheckboxListener(auction, checkbox, nid, url, title) {
	if (nid) {
		// console.log('NID: ' + nid + ', 标题: ' + title);
		auction.append(checkbox.clone().click(function () {
			var request = {nid: nid, url: url, title: title, status: this.checked};
			chrome.extension.sendRequest(request, function(response) {
				//console.log('status:' + response.status + ', code: ' + response.code);
			});
		}));
	}
}