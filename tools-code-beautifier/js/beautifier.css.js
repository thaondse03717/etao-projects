/**
 * ��JS����javascript����
 *
 * Copyright (c) 2011 tomato
 *
 * @author	 tomato <wangshijun2010@gmail.com>
 * @copyright	(c) 2011 www.taobao.com
 * @version	1.0
 * @link http://artwl.cnblogs.com
 * @link http://procssor.com/
 */

function CssFormatter(source, options) {
	var options = {} || options;

	this.options = options;
	this.source = source;
	this.spaceStr = "    ";

	if (!isNaN(options.spaceWidth)) {
		if (options.spaceWidth > 1) {
			this.spaceStr = "";
			for (var i = 0; i < options.spaceWidth; i++) {
				this.spaceStr += " ";
			}
		} else {
			this.spaceStr = "\t";
		}
	}

	this.formatType = options.formatType;
	this.output = [];
}

CssFormatter.prototype.trim = function (str) {
	return str.replace(/(^\s*)|(\s*$)/g, "");
}

CssFormatter.prototype.removeSpace = function () {
	this.source = this.source.replace(/\s+|\n/g, " ").replace(/\s*{\s*/g, "{").replace(/\s*}\s*/g, "}").replace(/\s*:\s*/g, ":").replace(/\s*;\s*/g, ";");
}

CssFormatter.prototype.split = function () {
	var blocks = this.source.split("{");
	var subblocks;
	for (var i = 0; i < blocks.length; i++) {
		if (blocks[i].indexOf("}") != -1) {
			subblocks = blocks[i].split("}");
			var pv = subblocks[0].split(";");
			for (var j = 0; j < pv.length; j++) {
				pv[j] = this.formatStatement(this.trim(pv[j]), true);
				if (pv[j].length > 0) {
					this.output.push(this.spaceStr + pv[j] + ";\n");
				}
			}
			this.output.push("}\n");
			if (this.options.preserve_newlines) {
				this.output.push("\n");
			}
			subblocks[1] = this.trim(this.formatSelector(subblocks[1]));
			if (subblocks[1].length > 0) {
				this.output.push(subblocks[1], " {\n");
			}
		} else {
			this.output.push(this.trim(this.formatSelector(blocks[i])), " {\n");
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
	return this.source;
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