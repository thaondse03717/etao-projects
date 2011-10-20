// 提取NID并且创建复选框
var items = $('li.entry');

//console.log('SRP items found: ' + items.length);

$.each(items, function (i, item) {
	// 提取NID
	$(this).css({position: 'relative'});
	var href = $('a:has(img):first', this).attr('href'),
		title = $('h3 a', this).attr('title'),
		nid = false;
	if (href != '') {
		var regex_id = /\?id=\d+/gi;
		var regex_nid = /&nid=\d+/gi;

		var matches_id = href.match(regex_id);
		var matches_nid = href.match(regex_nid);

		if (matches_id) {
			nid = matches_id[0].substring(4, matches_id[0].length);
		} else if (matches_nid) {
			nid = matches_nid[0].substring(5, matches_nid[0].length);
		}
	}

	// 创建复选框
	if (nid) {
		//console.log('#' + i + ', NID: ' + nid + ', TITLE: ' + title);
		var checkbox = $('<input type="checkbox" class="checkbox injected" title="单击将该商品加入垃圾箱" style="position: absolute; left: 0px; top: 0px; width: 3em; height: 3em;">');
		$('a:has(img):first', this).append(checkbox.click(function () {
			var request = {nid: nid, url: href, title: title, status: this.checked};
			chrome.extension.sendRequest(request, function(response) {
				//console.log('status:' + response.status + ', code: ' + response.code);
			});
		}));
	}

});
