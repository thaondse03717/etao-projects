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

		document.getElementById('content').value = style_html(js_source, {
			indent_size: indent_size,
			indent_char: indent_char,
			max_char: 10000
		});
		document.getElementById('beautify').disabled = false;
		return false;
	});
});
