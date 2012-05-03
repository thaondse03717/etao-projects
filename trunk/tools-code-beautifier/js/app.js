function add_onload_function(fn) {
	var oe = window.onload;
	window.onload = function () {
		if (oe) {
			oe();
		}
		fn();
	}
}

add_onload_function(get_default_settings);
add_onload_function(set_content_height);

function get_default_settings() {

	var tabsize = get_var('tabsize');
	var braces_on_own_line = get_var('braces');
	var c;

	if (tabsize) {
		document.getElementById('tabsize').value = tabsize;
	}

	if (braces_on_own_line) {
		document.getElementById('braces-on-own-line').checked = 'checked';
	}

}

function set_content_height() {
	document.getElementById('content').style.height = (window.outerHeight - 180) + 'px';
}

function trim_leading_comments(str) {
	// very basic. doesn't support /* ... */
	str = str.replace(/^(\s*\/\/[^\n]*\n)+/, '');
	str = str.replace(/^\s+/, '');
	return str;
}

function unpacker_filter(source) {

	if (document.getElementById('detect-packers').checked) {

		var stripped_source = trim_leading_comments(source);
		var unpacked = '';

		if (P_A_C_K_E_R.detect(stripped_source)) {
			unpacked = P_A_C_K_E_R.unpack(stripped_source);
			if (unpacked !== stripped_source) {
				return unpacker_filter(unpacked);
			}
		}

		if (EscapedBookmarklet.detect(source)) {
			unpacked = EscapedBookmarklet.unpack(source);
			if (unpacked !== stripped_source) {
				return unpacker_filter(unpacked);
			}
		}

		if (JavascriptObfuscator.detect(stripped_source)) {
			unpacked = JavascriptObfuscator.unpack(stripped_source);
			if (unpacked !== stripped_source) {
				return unpacker_filter(unpacked);
			}
		}
	}
	return source;

}

function do_js_beautify() {
	document.getElementById('beautify').disabled = true;
	var js_source = document.getElementById('content').value.replace(/^\s+/, '');
	var indent_size = document.getElementById('tabsize').value;
	var indent_char = ' ';
	var preserve_newlines = document.getElementById('preserve-newlines').checked;
	var keep_array_indentation = document.getElementById('keep-array-indentation').checked;
	var braces_on_own_line = document.getElementById('braces-on-own-line').checked;

	if (indent_size == 1) {
		indent_char = '\t';
	}


	if (js_source && js_source[0] === '<' && js_source.substring(0, 4) !== '<!--') {
		document.getElementById('content').value = style_html(js_source, indent_size, indent_char, 80);
	}
	else {
		document.getElementById('content').value =
		js_beautify(unpacker_filter(js_source), {
			indent_size: indent_size,
			indent_char: indent_char,
			preserve_newlines: preserve_newlines,
			braces_on_own_line: braces_on_own_line,
			keep_array_indentation: keep_array_indentation,
			space_after_anon_function: true
		});
	}

	document.getElementById('beautify').disabled = false;
	return false;
}


function get_var(name) {
	var res = new RegExp("[\\?&]" + name + "=([^&#]*)").exec(window.location.href);
	return res ? res[1] : "";
}

function run_tests() {
	var st = new SanityTest();
	run_beautifier_tests(st);
	JavascriptObfuscator.run_tests(st);
	P_A_C_K_E_R.run_tests(st);
	EscapedBookmarklet.run_tests(st);

	document.getElementById('testresults').style.display = 'block';
	document.getElementById('testresults').innerHTML = st.results();
}