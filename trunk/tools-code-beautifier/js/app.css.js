$(function () {
	$('#beautify').click(function () {
		document.getElementById('beautify').disabled = true;

		var source = document.getElementById('content').value.replace(/^\s+/, '');
		var indent_size = document.getElementById('tabsize').value;
		var preserve_newlines = document.getElementById('preserve-newlines').checked;
		var braces_on_own_line = document.getElementById('braces-on-own-line').checked;

		var formatter = new CssFormatter(source, {
			spaceWidth: indent_size == 1 ? 0 : indent_size,
			formatType: 'format'
		});
		formatter.formatCss();

		document.getElementById('content').value = formatter.source;

		document.getElementById('beautify').disabled = false;
		return false;
	});
});

