$(function () {
	$('#beautify').click(function () {
		document.getElementById('beautify').disabled = true;

		var js_source = document.getElementById('content').value.replace(/^\s+/, '');
		var indent_size = document.getElementById('tabsize').value;
		var preserve_newlines = document.getElementById('preserve-newlines').checked;
		var keep_array_indentation = document.getElementById('keep-array-indentation').checked;
		var braces_on_own_line = document.getElementById('braces-on-own-line').checked;

		if (indent_size == 1) {
			var indent_char = '\t';
		} else {
			var indent_char = ' ';
		}

		if (js_source && js_source[0] === '<' && js_source.substring(0, 4) !== '<!--') {
			document.getElementById('content').value = style_html(js_source, indent_size, indent_char, 80);
		} else {
			document.getElementById('content').value = js_beautify(unpacker_filter(js_source), {
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
	});
});

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