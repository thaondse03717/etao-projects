chrome.extension.sendRequest({options: true}, onOptionsLoaded);

// 读取插件配置后, 在页面中查找NID节点, 并且注入复选框
function onOptionsLoaded(options) {
	if (!options.selector_entry || !options.selector_link) {
		alert(chrome.i18n.getMessage('msg_error_options'));
		return false;
	}

	var auctions = jQuery(options.selector_entry).css({ position: 'relative' });
	var checkbox = jQuery('<input type="checkbox"/>')
		.attr('title', chrome.i18n.getMessage('msg_click_hover'))
		.addClass('checkbox')
		.css({
			position: 'absolute',
			left: '0px',
			top: '0px',
			width: '3em',
			height: '3em'
		});

	var strong = jQuery('<strong contenteditable="true">NID</strong>')
		.addClass('link')
		.attr('title', chrome.i18n.getMessage('msg_click_copy'))
		.css({
			cursor: 'default',
			position: 'absolute',
			left: '3em',
			top: '0px',
			width: 'auto',
			lineHeight: '3em',
			height: '3em'
		});

	jQuery.each(auctions, function (i, item) {

		// 提取URI, 标题
		var auction = jQuery(options.selector_link, this);
		var url = auction.attr('href'),
			title = auction.attr('title'),
			stat = auction.attr('data-stat'),
			nid = false;

		if (!title) {
			title = auction.find('img').attr('title');
		}

		// 提取NID (内网商品和外网商品的连接不同)
		// 对于P4P商品需要额外的ajax请求来确定
		if (url != '') {
			var patterns = {
				id:			 /\?id=\d+/gi,									// 内网商品NID
				nid:			[/&nid=\d+/gi, /\?nid=\d+/gi],		// 外网商品NID
				p4p:			/&value=nid_\d+/gi,						// P4P商品NID
				rec:			/itemid:\"\d+\"/gi							// 推广商品NID
			};

			var matches = {
				id : url.match(patterns.id),
				nid : url.match(patterns.nid[0]) ? url.match(patterns.nid[0]) : url.match(patterns.nid[1]),
				p4p : stat !== undefined ? stat.match(patterns.p4p) : false
			};

			if (matches.id) {
				nid = matches.id[0].substring(4, matches.id[0].length);
				addCheckboxListener(auction, checkbox, nid, url, title);
				addCopyListener(auction, strong, nid, url, title, i);
			} else if (matches.nid) {
				nid = matches.nid[0].substring(5, matches.nid[0].length);
				addCheckboxListener(auction, checkbox, nid, url, title);
				addCopyListener(auction, strong, nid, url, title, i);
			} else if (matches.p4p) {
				nid = matches.p4p[0].substring(11, matches.p4p[0].length);
				addCheckboxListener(auction, checkbox, nid, url, title);
				addCopyListener(auction, strong, nid, url, title, i);
			} else {
				jQuery.get(url, function (data) {
					matches.rec = data.match(patterns.rec);
					if (matches.rec) {
						var nid = matches.rec[0].substring(8, matches.rec[0].length - 1);
						addCheckboxListener(auction, checkbox, nid, url, title);
						addCopyListener(auction, strong, nid, url, title, i);
					}
				});
			}
		}

	});

	// 创建隐藏的textarea
	jQuery(document.body).append('<textarea style="display:none" id="clipboard"></textarea>');

	// 如果是比价页默认选中当前的产品节点
	var matches = (/\/item\/(\d+)\.html/g).exec(window.location.href);
	if (matches) {
		var product = {};
		product.epid = matches[1];
		product.title = jQuery('div.title h3').text();
		chrome.extension.sendRequest(product, function(response) {
			//console.log(product);
		});
	}
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

function addCopyListener(auction, strong, nid, url, title, i) {
	if (nid) {
		auction.append(strong.clone().text(nid).click(function (event) {
			chrome.extension.sendRequest({ text: nid });
			return false;
		}));
	}
}