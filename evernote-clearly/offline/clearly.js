// Use 'page.injectJs()' to load the script itself in the Page context

if ( typeof(phantom) !== "undefined" ) {
    var page = require('webpage').create();

    // Route "console.log()" calls from within the Page context to the main Phantom context (i.e. current "this")
    page.onConsoleMessage = function(msg) {
        console.log(msg);
    };

    page.onAlert = function(msg) {
        console.log(msg);
    };

	page.onError = function (msg, trace) {
		console.log(msg);
		trace.forEach(function(item) {
			console.log('  ', item.file, ':', item.line);
		});
	}

    console.log("* Script running in the Phantom context.");
    console.log("* Script will 'inject' itself in a page...");
    page.open("http://howtonode.org/node-js-and-mongodb-getting-started-with-mongojs", function(status) {
        if ( status === "success" ) {
			page.includeJs("http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js", function() {
				//page.includeJs("evernote.js");
				console.log(page.injectJs("evernote.js") ? "... done injecting itself!" : "... fail! Check the $PWD?!");
			});
            //console.log(page.injectJs("jquery.js") ? "... done injecting itself!" : "... fail! Check the $PWD?!");
        }
        phantom.exit();
    });
} else {
    alert("* Script running in the Page context.");
}
