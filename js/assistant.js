var assistant = {
	// 系统通知消息
	notify: function(message, type, callback) {
		var callback = callback || function () {};

		var popup = $('<div class="message"></div>')
			.text(message).addClass(type).hide()
			.appendTo(document.body);

		popup
			.css({ left: ($(window).width() - popup.width() ) / 2 + 'px' })
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