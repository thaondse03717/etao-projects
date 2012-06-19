define(["jquery"], function() {
	return {
		shake: function(a) {
			var b = 10;
			a.css("border-color", "red");
			var c = setInterval(function() {
				a.css("margin-left", b);
				b *= -0.8;
				0 == parseInt(b) && clearInterval(c)
			}, 40)
		},
		changeCssNoTransition: function(a, b) {
			a.css("-webkit-transition", "none").css(b);
			setTimeout(function() {
				a.css("-webkit-transition", "")
			}, 10)
		},
		addClassNoTransition: function(a, b) {
			a.css("-webkit-transition", "none").addClass(b);
			setTimeout(function() {
				a.css("-webkit-transition", "")
			}, 10)
		}
	}
});