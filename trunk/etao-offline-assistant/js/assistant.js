var assistant = {
	// 系统通知消息
	notify: function(message, type) {
		var types = {
			error: 'alert-error',
			success: 'alert-success',
			info: 'alert-info'
		};

		var popup = jQuery('<div class="alert"></div>')
			.html('<button class="close" data-dismiss="alert">x</button><strong>' + type.capitalize() + '</strong>&nbsp;&nbsp;' + message).addClass(types[type])
			.prependTo($('#container'));

		window.setTimeout(function () {
			popup.hide().remove();
		}, 3000);

	},

	// 读取偏好
	getOption: function (key) {
		var value = window.localStorage.getItem(key);
		if (value === null) {
			value = assistant.defaults[key] ? assistant.defaults[key] : null;
		}
		return value;
	},

	// 读取所有偏好
	getOptions: function () {
		var keys = [
			'selector_entry', 'selector_link', 'server_url',
			'auto_extract', 'auto_memo', 'auto_close'
		];
		var options = {};
		for (i = 0; i < keys.length; i++) {
			options[keys[i]] = assistant.getOption(keys[i]);
		}
		return options;
	},

	// 设置偏好
	setOption: function (key, value) {
		return window.localStorage.setItem(key, value);
	},

	// 默认选项
	defaults: {
		'selector_entry': 'li.listitem, div.griditem, ul.p4p-list li',
		'selector_link': 'a:first',
		'server_url': 'http://psp.search.taobao.com:9999/eharmony/',
		'auto_extract': 'true',
		'auto_close': 'true',
		'auto_memo': 'true'
	},

	//添加所有已选宝贝到垃圾箱
	addItems: function() {
		jQuery('#datalist tr:has(td)').remove();

		// 从Background页抽取以选中的数据
		var selected = chrome.extension.getBackgroundPage().selected;
		var selectedNids = [];
		for (var nid in selected) {
			if (selected[nid] !== null) {
				selectedNids.push(nid);
			}
		}

		if (selectedNids.length == 0) {
			assistant.notify(chrome.i18n.getMessage("msg_none_selected"), 'error');
			if (jQuery('#datalist tr:has(td)').size() === 0) {
				jQuery('#datalist').hide();
			}
			return false;
		}

		jQuery("#datalist").show();

		var current = 0;
		addItem();


		// 添加1个宝贝到垃圾箱
		function addItem() {

			if (current === selectedNids.length) {
				jQuery("table.datalist tbody tr:nth-child(even)").addClass("altrow");
				jQuery("table.datalist tbody tr").hover(function () {
					jQuery(this).addClass('highlight');
				}, function () {
					jQuery(this).removeClass('highlight');
				});

				// assistant.notify(chrome.i18n.getMessage("msg_auction_count", current), 'success');

				return false;
			}

			var item = selected[selectedNids[current]];
			var close = jQuery('<a href="javascript:void(0)"></a>')
				.text(chrome.i18n.getMessage("action_delete"))
				.click(function () {
				jQuery(this).parents('tr').remove();
				if (jQuery('#datalist tr:has(td)').size() === 0) {
					jQuery('#datalist').hide();
				}
			});

			jQuery('<tr/>')
				.attr('id', item.nid)
				.append(jQuery('<td/>').text(item.nid))
				.append(jQuery('<td/>').html('<a target="_blank" href="' + item.url + '">' + item.title + '</a>' ))
				.append(jQuery('<td class="actions"/>').append(close))
				.appendTo(jQuery('#datalist tbody'));

			setTimeout(function () {
				current++;
				addItem();
			}, 120);
		}
	},

	// 自动翻译
	getTranslation: function() {
		$('[data-i18n-content]').each(function() {
			$(this).html(chrome.i18n.getMessage(this.getAttribute('data-i18n-content')));
		});

		$('[data-i18n-value]').each(function() {
			$(this).val(chrome.i18n.getMessage(this.getAttribute('data-i18n-value')));
		});

		$('[data-i18n-title]').each(function() {
			$(this).attr('title', chrome.i18n.getMessage(this.getAttribute('data-i18n-title')));
		});
	},

	// 注册按钮回调
	registerCallbacks: function() {
		jQuery('#submit').click(assistant.submitItems).removeClass('disabled');
		jQuery('#extract').click(assistant.addItems).removeClass('disabled');
	},

	// 取消按钮回调
	unregisterCallbacks: function() {
		jQuery('#submit, #extract').unbind('click').addClass('disabled');
	}

};

String.prototype.capitalize = function(){
	return this.replace( /(^|\s)([a-z])/g , function(m,p1,p2){
		return p1+p2.toUpperCase();
	});
};