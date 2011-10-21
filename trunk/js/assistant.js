var assistant = {
	// 系统通知消息
	notify: function(message, type, callback) {
		var callback = callback || function () {};

		var popup = jQuery('<div class="message"></div>')
			.text(message).addClass(type).hide()
			.appendTo(document.body);

		popup
			.css({ left: (jQuery(window).width() - popup.width() ) / 2 + 'px' })
			.fadeIn('fast');

		setTimeout(function () {
			popup.fadeOut('fast', callback);
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
		var keys = ['selector_entry', 'selector_link', 'server_url', 'auto_extract', 'auto_memo'];
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
		'selector_entry': 'li.entry',
		'selector_link': 'a:first',
		'server_url': 'http://eharmony.taobao.com/eharmony/',
		'auto_extract': true,
		'auto_memo': true
	}
};