/**
 * 用JS美化javascript代码
 *
 * Copyright (c) 2011 tomato
 *
 * @author	 tomato <wangshijun2010@gmail.com>
 * @copyright	(c) 2011 www.taobao.com
 * @version	1.0
 * @link http://artwl.cnblogs.com
 * @link http://procssor.com/
 */

window.onload = function () {
	var submitBtn = document.getElementById("submit");
	var tabsize = document.getElementById("tabsize");
	var sourceCon = document.getElementById("source");
	var size = 4;
	var formatType = "format";
	submitBtn.onclick = function () {
		var radios = document.getElementsByName("format_type");
		for (i = 0; i < radios.length; i++) {
			if (radios[i].checked) {
				formatType = radios[i].value;
				break;
			}
		}
		var Formatter = new CssFormatter(sourceCon.value, size, formatType);
		Formatter.formatCss();
		sourceCon.value = Formatter.source;
	}

	tabsize.onchange = function () {
		size = this.options[this.options.selectedIndex].value;
		submitBtn.click();
		return false;
	}
}

function CssFormatter(source, spaceWidth, formatType) {
	this.source = source;
	this.spaceStr = "    ";
	if (!isNaN(spaceWidth)) {
		if (spaceWidth > 1) {
			this.spaceStr = "";
			for (var i = 0; i < spaceWidth; i++) {
				this.spaceStr += " ";
			}
		} else {
			this.spaceStr = "\t";
		}
	}
	this.formatType = formatType;
	this.output = [];
}

CssFormatter.prototype.trim = function (str) {
	return str.replace(/(^\s*)|(\s*$)/g, "");
}

CssFormatter.prototype.removeSpace = function () {
	this.source = this.source.replace(/\s+|\n/g, " ").replace(/\s*{\s*/g, "{").replace(/\s*}\s*/g, "}").replace(/\s*:\s*/g, ":").replace(/\s*;\s*/g, ";");
}

CssFormatter.prototype.split = function () {
	var bigqleft = this.source.split("{");
	var bigqright;
	for (var i = 0; i < bigqleft.length; i++) {
		if (bigqleft[i].indexOf("}") != -1) {
			bigqright = bigqleft[i].split("}");
			var pv = bigqright[0].split(";");
			for (var j = 0; j < pv.length; j++) {
				pv[j] = this.formatStatement(this.trim(pv[j]), true);
				if (pv[j].length > 0) {
					this.output.push(this.spaceStr + pv[j] + ";\n");
				}
			}
			this.output.push("}\n");
			bigqright[1] = this.trim(this.formatSelector(bigqright[1]));
			if (bigqright[1].length > 0) {
				this.output.push(bigqright[1], " {\n");
			}
		} else {
			this.output.push(this.trim(this.formatSelector(bigqleft[i])), " {\n");
		}
	}
}

CssFormatter.prototype.formatCss = function () {
	if (this.formatType == "compress") {
		this.removeSpace();
	} else {
		this.removeSpace();
		this.split();
		this.source = this.output.join("");
	}
}

CssFormatter.prototype.formatSelector = function (str) {
	return str.replace(/\./g, " .")
		.replace(/\s+/g, " ")
		.replace(/\. /g, ".")
		.replace(/\s*,\s*/g, ",");
}

CssFormatter.prototype.formatStatement = function (str) {
	str = str.replace(/:/g, " : ")
		.replace(/\s+/g, " ")
		.replace("# ", "#")
		.replace(/\s*px/ig, "px")
		.replace(/\s*-\s*/g, "-")
		.replace(/\s*:/g, ":");

	return str;
}