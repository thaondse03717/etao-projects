$.extend(assistant, {
	// 递归提交所有的下架请求
	submitItems: function() {
		var memo = jQuery('#memo').val();
		if (memo == '') {
			assistant.notify(chrome.i18n.getMessage("msg_none_selected"), 'error');
			return false;
		}

		assistant.unregisterCallbacks();

		if (options.auto_memo === 'true') {
			assistant.setLastMemo(memo);
		}

		var server = options.server_url;
		var selected = jQuery('tbody tr');

		var current = 0;
		submitItem();

		// 提交单个的宝贝下架请求, 每次Ajax结束后都会对当前状态调整
		function submitItem() {
			if (current === selected.length) {
				assistant.notify(chrome.i18n.getMessage("msg_revise_succeed"), 'success');
				onSubmitComplete();
				return false;
			}

			var item = jQuery(selected[current]);
			var nid = item.attr('id');
			var loader = jQuery('<span class="loader">&nbsp;</span>').hide();

			item.find('td.actions').empty().append(loader);

			jQuery.ajax({
				url: server,
				data: {
					c: 'auction_offlines',
					f: 'add',
					nid: nid,
					memo: memo,
					ajax: 1
				},
				method: 'POST',
				dataType: 'json',
				beforeSend: function () {
					loader.show();
				},
				complete: function (response) {
					try {
						var json = JSON.parse(response.responseText);
					} catch (error) {
						assistant.notify(chrome.i18n.getMessage("msg_login_required"), 'error');
						item.find('td.actions').text('Oops!');
						assistant.registerCallbacks(); /* 出错之后需要重新监听 */
						return false;
					}

					loader.removeClass('loader').addClass('icon');
					loader.addClass(json.status ? 'accept' : 'block');
					item.find('td.actions').append(json.code);

					setTimeout(function () {
						current++;
						submitItem();
					}, 250);
				}
			});
		}

		// 所有请求处理完毕之后给出提示
		function onSubmitComplete() {
			chrome.tabs.getSelected(null, function (tab) {
				chrome.extension.getBackgroundPage().resetCheckBoxes();

				// 回到SRP页
				if (options.auto_close === 'true') {
					var selectedIndex = chrome.extension.getBackgroundPage().selectedIndex;
					if (selectedIndex !== null) {
						chrome.tabs.update(selectedIndex, {selected: true});
					}
					chrome.tabs.remove(tab.id, function () { });

				// 如果不关闭当前页, 则重新注册事件
				} else {
					assistant.registerCallbacks();
				}
			});
		}
	}

});