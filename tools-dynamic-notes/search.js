/**
 * ¶àÏß³ÌËÑË÷Worker
 *
 * Copyright (c) 2011 tomato
 *
 * @author	 tomato <wangshijun2010@gmail.com>
 * @copyright	(c) 2011 www.taobao.com
 * @version	1.0
 */

var engines = {
	google_text: function (query) {
		return 'search_google_text_' + query;
	},

	google_image: function(query) {
		return 'search_google_image_' + query;
	},

	baidu_text: function(query) {
		return 'search_baidu_text_' + query;
	},

	baidu_image: function(query) {
		return 'search_baidu_image_' + query;
	},

	wikipedia_text: function(query) {
		return 'search_wikipedia_text_' + query;
	},

	stackoverflow_text: function(query) {
		return 'search_stackoverflow_image_' + query;
	}
};

var apis = {
	google: {
		text: "https://www.google.com/search?q=",
		image: "https://www.google.com/search?q="
	},
	baidu: {
		text: "http://www.baidu.com/s?wd=",
		image: "http://image.baidu.com/i?&word="
	},
	stackoverflow: {
		text: "http://stackoverflow.com/search?q="
	},
	wikipedia: {
		text: "https://www.google.com/search?q=",
		image: "https://www.google.com/search?q="
	},
};

onmessage = function (request) {
	var args = request.data.split(/\s/);

	if (args.length !== 3) {
		postMessage('Invalid arguments: ' + request.data);
		return false;
	}

	var name = [args[0], args[1]].join('_');
	if (typeof engines[name] === 'undefined') {
		postMessage('Search engine not found: ' + name);
		return false;
	}

	var query = args[2].replace(/\s/, '+');
	var response = engines[name].call(this, query);
	postMessage(response);
};