with($ns("g")) {
	g.ChromeClass = function () {
		var me = this;

		me.init = function () {

		};


		me.getCookie = function (p_name, p_url, p_callback) {
			chrome.cookies.get({
				url: p_url,
				name: p_name
			}, p_callback);
		};

		me.getCookies = function (p_url, p_callback) {
			chrome.cookies.getAll((p_url != null ? {
				url: p_url
			} : {}), p_callback);
		};

		return me;
	};

	g.Chrome = new g.ChromeClass();
}