var IS_FIREFOX = -1 < navigator.userAgent.indexOf("Firefox"),
	IS_CHROME = -1 < navigator.userAgent.indexOf("Chrome"),
	requireBaseUrl = "/js";
IS_FIREFOX && (requireBaseUrl = "chrome://linktargetfinder/content/src/js");
require.config({
	baseUrl: requireBaseUrl,
	paths: {
		jquery: "libs/jquery/jquery-min",
		underscore: "libs/underscore/underscore",
		backbone: "libs/backbone/backbone",
		text: "libs/require/text",
		less: "libs/less",
		base64: "libs/base64"
	},
	catchError: function(a) {
		console.log(a);
		return a
	}
});
define("main", function() {});