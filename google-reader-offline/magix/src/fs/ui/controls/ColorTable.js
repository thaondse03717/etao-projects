with ($namespace("fs.ui.controls"))
{
    fs.ui.controls.ColorTable = function(p_container)
    {
        var me = new mx.controls.Control(p_container);
        
        
        
        var _matrixCanvas = null;
        var _matrixC = null;
        var _matrixData = null;
        var _matrixW = 255;
        var _matrixH = 255;
        
        var _hueCanvas = null;
        
        var _imgCross = null;
        
        me.init = function()
        {
            me.container.style.border = "1px solid silver";
            me.container.style.webkitBoxShadow = "2px 2px 4px #888";
            me.container.style.webkitUserSelect = "none";
            me.container.style.cursor = "default";
            
            var table = $new("table");
            table.style.backgroundColor = "#F0F0F0";
            table.style.borderCollapse = "collapsed";
            
            _initMatrix();
            _initHue();
            
            me.container.appendChild(table);
            var row = table.insertRow(0);
            var cell = row.insertCell(0);
            cell.style.position = "relative";
            cell.style.cursor = "crosshair";
            cell.appendChild(_matrixCanvas);
            cell.appendChild(_imgCross);
            
            cell = row.insertCell(1);
            cell.style.cursor = "default";
            cell.appendChild(_hueCanvas);
            
            me.setHue(220);
        };
        
        
        me.color = null;
        me.onColorChanged = null;
        me.setColor = function(p_color)
        {
            me.color = p_color;
            var c = p_color.substr(1);
            var r = parseInt(c.substr(0, 2), 16);
            var g = parseInt(c.substr(2, 2), 16);
            var b = parseInt(c.substr(4, 2), 16);
            
            var hsb = rgbToHSB(r, g, b);
            me.setHue(hsb[0]);
            
            //_imgCross.style.posLeft = _matrixW* hsb[1] / 100 - 3;
            //_imgCross.style.posTop = _matrixH * (100 - hsb[2]) / 100 - 3;
        };

        
        
        me.hue = 0;
        me.setHue = function(h)
        {
            var p = _matrixData.data;
            for (var y = 0; y <= _matrixH; y++)
            {
                for (var x = 0; x <= _matrixW; x++)
                {
                    var i = (y * _matrixW + x) * 4;
                    
                    var rgb = hsbToRGB(h, x * 100 / _matrixW, 100 -y * 100 / _matrixH);
                    p[i + 0] = rgb[0];
                    p[i + 1] = rgb[1];
                    p[i + 2] = rgb[2];
                }
            }
            _matrixC.putImageData(_matrixData, 0, 0);
            
            me.hue = h;
        };
        
        
        
        function _changeColor(p_color)
        {
            var rgb = "#" + _hex(p_color[0]) + _hex(p_color[1]) + _hex(p_color[2]);
            me.color = rgb;
            
            if (me.onColorChanged != null)
            {
                me.onColorChanged();
            }
        }
        
        function _hex(n)
        {
            var result = n.toString(16);
            if (result.length == 1)
            {
                return "0" + result;
            }
            else
            {
                return result;
            }
        }
        
        
        
        
        function _initMatrix()
        {
            _imgCross = $new("img");
            _imgCross.src = $mappath("~/images/cross.png");
            _imgCross.style.position = "absolute";
            
            _matrixCanvas = $new("canvas");
            _matrixCanvas.width = _matrixW;
            _matrixCanvas.height = _matrixH;
            _matrixC = _matrixCanvas.getContext("2d");
            
            _matrixData = _matrixC.getImageData(0, 0, _matrixW,_matrixH);
            
            var p = _matrixData.data;
            for (var i = 0; i < _matrixW * _matrixH * 4; i += 4)
            {
                p[i + 3] = 255;
            }
            
            _matrixCanvas.addEventListener("mousedown",_matrixCanvas_onmousedown);
        }
        
        function _initHue()
        {
            _hueCanvas = $new("canvas");
            _hueCanvas.width = 20;
            _hueCanvas.height = _matrixH;
            var c = _hueCanvas.getContext("2d");
            var d = c.getImageData(0, 0, _hueCanvas.width,_matrixH);
            var p = d.data;
            for (var y = 0; y < _matrixH; y++)
            {
                var h = y / _matrixH * 360;
                var rgb = hsbToRGB(h, 100, 100);
                for (var x = 0; x <= _hueCanvas.width; x++)
                {
                    var i = (y * _hueCanvas.width + x) * 4;
                    p[i + 0] = rgb[0];
                    p[i + 1] = rgb[1];
                    p[i + 2] = rgb[2];
                    p[i + 3] = 255;
                }
            }
            c.putImageData(d, 0, 0);
            
            _hueCanvas.addEventListener("mousedown", _hueCanvas_onmousedown);
        }
        
        
        
        
        
        
        
        
        

        function _hueCanvas_onmousedown(e)
        {
            var y = event.offsetY;
            me.setHue(y / _matrixH * 360);
            
            document.addEventListener("mouseup", _hueCanvas_onmouseup);
            _hueCanvas.addEventListener("mousemove", _hueCanvas_onmousemove);
        }
        
        function _hueCanvas_onmousemove(e)
        {            
            var y = event.offsetY;
            me.setHue(y / _matrixH * 360);
        }
        
        function _hueCanvas_onmouseup(e)
        {
            document.removeEventListener("mouseup", _hueCanvas_onmouseup);
            _hueCanvas.removeEventListener("mousemove", _hueCanvas_onmousemove);
        }
        
        
        
        
        function _matrixCanvas_onmousedown(e)
        {
            var s = event.offsetX / _matrixW * 100;
            var b = 100 - event.offsetY / _matrixH * 100;
            
            var rgb = hsbToRGB(me.hue, s, b);
            _changeColor(rgb);
            
            document.addEventListener("mousemove", _matrixCanvas_onmousemove);
            _matrixCanvas.addEventListener("mouseup", _matrixCanvas_onmouseup);
        }
        
        function _matrixCanvas_onmousemove(e)
        {
            var s = event.offsetX / _matrixW * 100;
            var b = 100 - event.offsetY / _matrixH * 100;
            
            var rgb = hsbToRGB(me.hue, s, b);
            _changeColor(rgb);
        }
        
        function _matrixCanvas_onmouseup(e)
        {
            document.removeEventListener("mousemove", _matrixCanvas_onmousemove);
            _matrixCanvas.removeEventListener("mouseup", _matrixCanvas_onmouseup);
        }
        
        
        
        
        
        
        
        function hsbToRGB(h, s, b)
        {
            var br = Math.round(b / 100 * 255);
            if (s == 0)
            {
                return [br, br, br];
            }
            else
            {
                var hue = h % 360;
                var f = hue % 60;
                var p = Math.round((b * (100 - s)) / 10000 * 255);
                var q = Math.round((b * (6000 - s * f)) / 600000 * 255);
                var t = Math.round((b * (6000 - s * (60 - f))) / 600000 * 255);
                switch (Math.floor(hue / 60))    {
                    case 0: return [br, t, p];
                    case 1: return [q, br, p];
                    case 2: return [p, br, t];
                    case 3: return [p, q, br];
                    case 4: return [t, p, br];
                    case 5: return [br, p, q];
                }
            }
            return false;
        }
        
        function rgbToHSB(r, g, b)
        {
            var red = r,
                    green = g,
                    blue = b,
                    hue = 0;
            var max = Math.max(red, green, blue),
                    min = Math.min(red, green, blue);
            var delta = max - min;
            var brightness = max / 255,
                    saturation = (max != 0) ? delta / max : 0;
            if (saturation != 0){
                var rr = (max - red) / delta;
                var gr = (max - green) / delta;
                var br = (max - blue) / delta;
                if (red == max) hue = br - gr;
                else if (green == max) hue = 2 + rr - br;
                else hue = 4 + gr - rr;
                hue /= 6;
                if (hue < 0) hue++;
            }
            return [Math.round(hue * 360), Math.round(saturation * 100), Math.round(brightness * 100)];
        }
        
        return me;
    };
}