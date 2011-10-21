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
		if (url != '') {
			var regex_id = /\?id=\d+/gi;
			var regex_nid = /&nid=\d+/gi;

			var matches_id = url.match(regex_id);
			var matches_nid = url.match(regex_nid);

			if (matches_id) {
				nid = matches_id[0].substring(4, matches_id[0].length);
			} else if (matches_nid) {
				nid = matches_nid[0].substring(5, matches_nid[0].length);
			}
		}

		// 注入复选框
		if (nid) {
			//console.log('#' + (i+1) + ', NID: ' + nid + ', 标题: ' + title);
			auction.append(checkbox.clone().click(function () {
				var request = {nid: nid, url: url, title: title, status: this.checked};
				chrome.extension.sendRequest(request, function(response) {
					//console.log('status:' + response.status + ', code: ' + response.code);
				});
			}));
		}
	});
}
