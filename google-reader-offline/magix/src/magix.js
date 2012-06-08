$appRoot = chrome.extension.getURL("");
$appRoot = $appRoot.substr(0, $appRoot.length - 1);
$mxRoot = $appRoot + "/magix";
$mxScriptRoot = $mxRoot + "/src";
$mxResRoot = $mxRoot + "/res";

Boolean.parse = function (p_text) {
	if (typeof(p_text) == "boolean") {
		return p_text;
	}
	t = p_text.toLowerCase();
	return (t == "true") || (t == "1");
};

Number.parse = function (p_text) {
	return parseFloat(p_text);
};

Number.format = function (p_value, p_formatString) {
	if (typeof(p_formatString) == "undefiend") {
		return p_value + "";
	}
	if (typeof(p_formatString) == "number") {
		return p_value + "";
	}
	var string = p_value + "";
	if (p_formatString) {
		var stringParts = string.split('.');
		var formatParts = p_formatString.split('.');

		if (stringParts[0].length < formatParts[0].length) {
			stringParts[0] =
			formatParts[0].substring(0, formatParts[0].length - stringParts[0].length) + stringParts[0];
		}
		if (formatParts.length == 1) {
			return stringParts[0];
		}
		else {
			if (stringParts.length > 1) {
				while (stringParts[1].length < formatParts[1].length) {
					stringParts[1] += "0";
				}
			}
			else {
				stringParts[1] = formatParts[1];
			}
			return stringParts[0] + "." + stringParts[1];
		}
	}
	else {
		return string;
	}
};


String.prototype.contains = function (p_subString) {
	return this.indexOf(p_subString) != -1;
};

String.prototype.startsWith = function (p_string) {
	return this.substring(0, p_string.length) == p_string;
};

String.prototype.endsWith = function (p_string) {
	return this.substring(this.length - p_string.length) == p_string;
};

String.prototype.trimLeft = function () {
	return this.replace(/^\s*/, "");
};

String.prototype.trimRight = function () {
	return this.replace(/\s*$/, "");
};

String.prototype.trim = function () {
	return this.trimRight().trimLeft();
};

String.prototype.getByteCount = function () {
	var text = this.replace(/[^\x00-\xff]/g, "**");
	return text.length;
};

String.prototype.containsAsianCharacters = function () {
	return (/.*[\u4e00-\u9fa5]+.*$/.test(this));
};

Date.getDaysInMonth = function (p_year, p_month) {
	switch (p_month) {
	case 2:
		if ((p_year % 400 == 0) || (p_year % 4 == 0) && (p_year % 100 != 0)) {
			return 29;
		}
		else {
			return 28;
		}
	case 1:
	case 3:
	case 5:
	case 7:
	case 8:
	case 10:
	case 12:
		return 31;
	default:
		return 30;
	}
};

Date.parse = function (p_text) {
	try {
		var p_text = p_text.trim();
		if (!p_text) return null;
		var year = p_text.substring(0, 4) * 1;
		var month = p_text.substring(5, 7) * 1 - 1;
		var day = p_text.substring(8, 10) * 1;
		var hour = p_text.substring(11, 13) * 1;
		var min = p_text.substring(14, 16) * 1;
		var sec = p_text.substring(17, 19) * 1;
		var ms = ("0." + p_text.substring(20)) * 1000;
		return new Date(year, month, day, hour, min, sec, ms);
	}
	catch (e) {
		return null;
	}
};

Date.format = function (p_value, p_formatString) {
	var text;
	if (!p_formatString) {
		text = "yyyy-MM-dd HH:mm:ss";
	}
	else {
		text = p_formatString;
	}
	var yy = p_value.getYear();
	var M = p_value.getMonth() + 1;
	var d = p_value.getDate();
	var h = p_value.getHours() % 12;
	var H = p_value.getHours();
	var m = p_value.getMinutes();
	var s = p_value.getSeconds();

	var yyyy = p_value.getFullYear();
	var MM = Number.format(M, "00");
	var dd = Number.format(d, "00");
	var hh = Number.format(h, "00");
	var HH = Number.format(H, "00");
	var mm = Number.format(m, "00");
	var ss = Number.format(s, "00");
	text = text.replace("yyyy", yyyy).replace("MM", MM).replace("dd", dd);
	text = text.replace("HH", HH).replace("hh", hh).replace("mm", mm).replace("ss", ss);
	text = text.replace("yy", yy).replace("M", M).replace("d", d);
	text = text.replace("H", H).replace("h", h).replace("m", m).replace("s", s);
	return text;
};

Date.prototype.toISOString = function (p_value) {
	return Date.format(p_value, "yyyy-MM-ddTHH:mm:ss.") + Number.format(p_value.getMilliseconds(), "000") + "000";
};

Date.prototype.addSeconds = function (p_seconds) {
	return new Date(this * 1 + p_seconds * 1000);
};

Date.prototype.addMinutes = function (p_minutes) {
	return this.addSeconds(p_minutes * 60);
};

Date.prototype.addHours = function (p_hours) {
	return this.addMinutes(p_hours * 60);
};

Date.prototype.addDays = function (p_days) {
	return this.addHours(p_days * 24);
};

Date.prototype.addWeeks = function (p_weeks) {
	return this.addDays(p_weeks * 7);
};

Date.prototype.addMonths = function (p_months) {
	var copy = new Date(this * 1);
	var months = copy.getMonth() + 1 + p_months;

	var years = Math.floor(months / 12);

	var year = copy.getFullYear() + years;
	var month = Math.abs(years * 12 - months) % 12;
	var date = copy.getDate();
	var daysInMonth = Date.getDaysInMonth(year, month);

	if (date > daysInMonth) {
		date = daysInMonth;
	}

	copy.setDate(1);
	copy.setFullYear(year);
	copy.setMonth(month - 1);
	copy.setDate(date);

	return copy;
};

Date.prototype.addYears = function (p_years) {
	var copy = this.addMonths(p_years * 12);
	return copy;
};

Date.prototype.clone = function () {
	return new Date(this * 1);
};

Array.prototype.indexOf = function (p_item) {
	for (var i = 0; i < this.length; i++) {
		if (this[i] == p_item) {
			return i;
		}
	}
	return -1;
};

Array.prototype.contains = function (p_item) {
	return this.indexOf(p_item) != -1;
};

Array.prototype.add = function (p_item) {
	return this[this.length] = p_item;
};

Array.prototype.insert = function (p_startIndex, p_item) {
	return this.splice(p_startIndex, 0, p_item);
};

Array.prototype.insertBefore = function (p_item, p_beforeItem) {
	var index = this.indexOf(p_beforeItem);
	if (index == -1) {
		return false;
	}

	this.insert(index, p_item);
	return true;
};

Array.prototype.insertAfter = function (p_item, p_afterItem) {
	var index = this.indexOf(p_beforeItem);
	if (index == -1) {
		return false;
	}
	else if (index == this.length) {
		this.add(p_item);
		return true;
	}
	else {
		this.insert(index + 1, p_item);
		return true;
	}
};

Array.prototype.remove = function (p_item) {
	return this.removeAt(this.indexOf(p_item));
};

Array.prototype.removeAt = function (p_index) {
	if (p_index >= 0 && p_index < this.length) {
		this.splice(p_index, 1);
		return true;
	}
	else {
		return false;
	}
};

Array.prototype.clear = function () {
	if (this.length > 0) {
		this.splice(0, this.length);
	}
};

Array.prototype.clone = function () {
	return this.slice(0, this.length);
};

Array.prototype.swap = function (p_item1, p_item2) {
	var index1 = this.indexOf(p_item1);
	var index2 = this.indexOf(p_item2);

	this[index1] = p_item2;
	this[index2] = p_item1;
};

Guid = {
	newGuid: function (p_toLowerCase, p_length) {
		var toLowerCase = false;
		if (p_toLowerCase != null) {
			toLowerCase = p_toLowerCase;
		}
		var length = 32;
		if (p_length != null) {
			length = p_length;
		}
		var result = "";
		for (var i = 1; i <= length; i++) {
			var n = Math.floor(Math.random() * 16.0);
			if (n < 10) {
				result += n;
			}
			else if (n == 10) {
				result += "a";
			}
			else if (n == 11) {
				result += "b";
			}
			else if (n == 12) {
				result += "c";
			}
			else if (n == 13) {
				result += "d";
			}
			else if (n == 14) {
				result += "e";
			}
			else if (n == 15) {
				result += "f";
			}
			if ((i == 8) || (i == 12) || (i == 16) || (i == 20)) {
				result += "-";
			}
		}

		if (toLowerCase) {
			result = result.toLowerCase();
		}
		else {
			result = result.toUpperCase();
		}
		return result;
	}
};

function Event() {
	var me = this;

	me.handlers = new Array();

	me.addHandler = function (p_handler) {
		if (!me.handlers.contains(p_handler)) {
			me.handlers.add(p_handler);
		}
	};
	me.$ = me.addHandler;

	me.insertHandler = function (p_index, p_handler) {
		if (typeof(p_handler) == "function") {
			if (!me.handlers.contains(p_handler)) {
				me.handlers.insert(p_index, p_handler);
			}
		}
		else {
			throw new Error("p_handler can not be empty or null。");
		}
	};

	me.removeHandler = function (p_handler) {
		return me.handlers.remove(p_handler);
	};
	me._ = me.removeHandler;

	me.clear = function () {
		me.handlers.clear();
	};

	me.fire = function (sender, args) {
		for (var i = 0; i < me.handlers.length; i++) {
			var h = me.handlers[i];
			if (typeof(h) == "function") {
				me.handlers[i](sender, args);
			}
		}
	};

	return me;
}

if (typeof($mxScriptRoot) == "undefined" || $mxScriptRoot == null) {
	var scripts = document.getElementsByTagName("script");
	for (var i = 0; i < scripts.length; i++) {
		var script = scripts[i];
		if (script.src.endsWith("/mx/magix.js")) {
			$mxScriptRoot = script.src.replace("/mx/magix.js", "");

			//if (typeof($mxRoot) == "undefined" || $mxRoot == null)
			{
				if ($mxScriptRoot.endsWith("/src")) {
					$mxRoot = $mxScriptRoot.replace("/src", "");
					$debugMode = true;
				}
			}

			if (typeof($mxResRoot) == "undefined" || $mxResRoot == null) {
				$mxResRoot = $mxRoot + "/res";
			}

			if (typeof($appRoot) == "undefined" || $appRoot == null) {
				if ($mxRoot.endsWith("/magix")) {
					$appRoot = $mxRoot.replace("/magix", "");
				}
			}
		}
	}
}

if (
typeof($mxRoot) == "undefined" || $mxRoot == null || typeof($mxScriptRoot) == "undefined" || $mxScriptRoot == null || typeof($mxResRoot) == "undefined" || $mxResRoot == null || typeof($appRoot) == "undefined" || $appRoot == null) {
	throw new Error("Lost one or more Magix enviroment variables.");
}

if (typeof($debugMode) == "undefined" || $debugMode == null) {
	$debugMode = false;
}

function $mappath(p_url) {
	if (typeof(p_url) != "string") return null;
	if (p_url.startsWith("~/")) {
		p_url = $appRoot + p_url.substr(1);
	}
	else if (p_url.indexOf("$google") != -1) {
		p_url = p_url.replace(/\$google/g, $google);
	}
	else if (p_url.startsWith("$res")) {
		p_url = p_url.replace("$res", $mxResRoot);
	}
	return p_url;
}

var __head = null;
var __loaded = false;

function $include(p_url, p_async, p_callback, p_context) {
	if (__loaded) {
		p_async = true;
	}

	if (__head == null) {
		__head = document.getElementsByTagName("head")[0];
	}

	if (document.getElementById(p_url)) {
		if (p_async && typeof(p_callback) == "function") {
			p_callback(document.getElementById(p_url), p_context != null ? p_context : null, false);
			return;
		}
	}

	var orgUrl = p_url;
	if (typeof(p_url) != "string") return;
	if (p_async == null) {
		p_async = false;
	}

	p_url = $mappath(p_url);

	if (p_url.toLowerCase().endsWith(".js")) {
		if (!p_async) {
			document.write("<script id='" + orgUrl + "' src='" + p_url + "'></script>");
		} else {
			var script = document.createElement("script");
			script.id = orgUrl;
			script.src = p_url;

			__head.appendChild(script);

			if (typeof(p_callback) == "function") {
				if ($isIE()) {
					script.onreadystatechange = function () {
						if (script.readyState == 4 || script.readyState == 'complete' || script.readyState == 'loaded') {
							script.loaded = true;
							script.onreadystatechange = null;
							p_callback(script, p_context != null ? p_context : null, true);
						}
					};
				} else {
					script.onload = function () {
						script.onload = null;
						p_callback(script, p_context != null ? p_context : null, true);
					};
				}
			}
		}
	} else if (p_url.toLowerCase().endsWith(".css")) {
		if (!p_async) {
			document.write("<link id='" + orgUrl + "' href='" + p_url + "' rel='stylesheet'/>");
		} else {
			var link = document.createElement("link");
			link.id = orgUrl;
			link.rel = "stylesheet";
			link.href = p_url;
			link.loaded = false;

			if (typeof(p_callback) == "function") {
				if ($isIE()) {
					link.onreadystatechange = function () {
						if (link.readyState == 4 || link.readyState == 'complete' || link.readyState == 'loaded') {
							link.loaded = true;
							link.onreadystatechange = null;
							p_callback(link, p_context != null ? p_context : null, true);
						}
					};
				} else {
					link.onload = function () {
						link.loaded = true;
						link.onload = null;
						p_callback(link, p_context != null ? p_context : null, true);
					};
				}
			}

			window.setTimeout(function () {
				if (!link.loaded) {
					if (typeof(p_callback) == "function") {
						p_callback(link, p_context != null ? p_context : null, true);
					}
				}
			}, 1000);

			__head.appendChild(link);
		}
	}
}

function $import(p_classFullName, p_async, p_callback, p_context) {
	if (__loaded) {
		p_async = true;
	}
	var url = $mxScriptRoot + "/" + p_classFullName.replace(/\./g, "/") + ".js";
	$include(url, p_async, p_callback, p_context ? p_context : p_classFullName);
}

function $namespace(p_namespace) {
	var parts = p_namespace.split(".");
	if (parts.length == 0) {
		return null;
	}
	try {
		eval(parts[0]);
	}
	catch (e) {
		eval(parts[0] + " = {};");
	}
	var root = eval(parts[0]);
	var space = parts[0];
	for (var i = 1; i < parts.length; i++) {
		space += "." + parts[i];
		if (!eval(space)) {
			eval(space + " = {};");
		}
	}
	return eval(p_namespace);
}
$ns = $namespace;




function $msg(p_name, p_values) {
	return chrome.i18n.getMessage(p_name, p_values != null ? p_values : null);
}

function $translate(p_container) {
	var html = p_container.innerHTML;
	var placeHolders = html.match(/(@@[a-z_0-9]*)/g);
	for (var i = 0; i < placeHolders.length; i++) {
		var name = placeHolders[i].substr(2);
		html = html.replace(placeHolders[i], $msg(name));
	}
	p_container.innerHTML = html;
}

function $trace(p_message) {
	console.debug("[TRACE] " + Date.format(new Date()) + " " + p_message);
}

$google = $msg("google_host");


$include("$res/magix.css");
$import("mx.dom.DomUtil");
$import("mx.controls.Control");