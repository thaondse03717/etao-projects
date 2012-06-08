with($ns("fs.actions")) {
	fs.actions.AppIconClickAction = function () {
		var me = this;

		me.doAction = function () {
			fs.bg.Core.showBrowserTab();
		};

		return me;
	};
}