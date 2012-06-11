// »°≈‰÷√
function getPreference(name) {
	return localStorage.getItem(name);
}

// –¥≈‰÷√
function setPreference(name, value) {
	return localStorage.setItem(name, value);
}

// ∂¡ƒ¨»œ≈‰÷√
function getDefaultPreferences() {
	return {
		tabsize: 1,	// 1 tab character
		braces_on_new_line: 0,
		preserve_newlines: 1,
		detect_packers: 1,
		keep_array_indention: 1,
	};
}

$(function () {
	var tabsize = getPreference('tabsize');
	var braces_on_new_line = getPreference('braces_on_new_line');
	var preserve_newlines = getPreference('preserve_newlines');
	var detect_packers = getPreference('detect_packers');
	var keep_array_indention = getPreference('keep_array_indention');

	if (!tabsize) {
		var preferences = getDefaultPreferences();

		var tabsize = preferences.tabsize;
		var braces_on_new_line = preferences.braces_on_new_line;
		var preserve_newlines = preferences.preserve_newlines;
		var detect_packers = preferences.detect_packers;
		var keep_array_indention = preferences.keep_array_indention;

		setPreference('tabsize', tabsize);
		setPreference('braces_on_new_line', braces_on_new_line);
		setPreference('preserve_newlines', preserve_newlines);
		setPreference('detect_packers', detect_packers);
		setPreference('keep_array_indention', keep_array_indention);
	}

	if (tabsize) {
		document.getElementById('tabsize').value = tabsize;
		document.getElementById('tabsize').onchange = function () {
			setPreference('tabsize', this.value);
		}
	}

	if (braces_on_new_line) {
		document.getElementById('braces-on-own-line').checked = 'checked';
		document.getElementById('braces-on-own-line').onchange = function () {
			setPreference('braces_on_new_line', this.checked);
		}
	}

	if (preserve_newlines) {
		document.getElementById('preserve-newlines').checked = 'checked';
		document.getElementById('preserve-newlines').onchange = function () {
			setPreference('preserve_newlines', this.checked);
		}
	}

	if (detect_packers) {
		document.getElementById('detect-packers').checked = 'checked';
		document.getElementById('detect-packers').onchange = function () {
			setPreference('detect_packers', this.checked);
		}
	}

	if (keep_array_indention) {
		document.getElementById('keep-array-indentation').checked = 'checked';
		document.getElementById('keep-array-indentation').onchange = function () {
			setPreference('keep_array_indention', this.checked);
		}
	}

	document.getElementById('content').style.height = (window.outerHeight - 180) + 'px';
});

