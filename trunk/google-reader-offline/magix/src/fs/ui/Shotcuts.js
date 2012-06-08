with ($ns("fs.ui"))
{
    fs.ui.ShotcutsClass = function()
    {
        var me = this;
        
        me.init = function()
        {
            document.body.addEventListener("keydown", _onkeydown, false);
        };
        
        var _keyMaps = {};
        me.registerKey = function(p_function, p_keyCode, p_shift)
        {
            var key = _getKeyName(p_keyCode, p_shift);
            if (typeof(_keyMaps[key]) == "undefined")
            {
                _keyMaps[key] = p_function;
            }
            else
            {
                throw new Error("'" + _getKeyAlias(p_keyCode, p_shift) + "' has been occupied.");
            }
        };
        
        
        function _getKeyName(p_keyCode, p_shift)
        {
            var result = p_shift ? "Shift_" : "";
            
            var keyName = null;
            if (typeof(p_keyCode) == "number")
            {
                switch (p_keyCode)
                {
                    case 13:
                        keyName = "Enter";
                        break;
                    case 32:
                        keyName = "Space";
                        break;
                    default:
                        keyName = String.fromCharCode(p_keyCode).toUpperCase();
                        break;
                }
            }
            else if (typeof(p_keyCode) == "string")
            {
                keyName = p_keyCode.toUpperCase();
            }
            
            result += keyName;
            
            return result;
        }
        
        function _getKeyAlias(p_keyCode, p_shift)
        {
            var keyName = _getKeyName(p_keyCode, p_shift);
            var alias = keyName.replace("Shift_", "<Shift> + ");
            alias = alias.replace("_", " + ");
            return alias;
        }
        
        function _onkeydown()
        {
            var keyCode = event.keyCode;
            var shift = event.shiftKey;
            
            var key = _getKeyName(keyCode, shift);
            if (typeof(_keyMaps[key]) == "function")
            {
                _keyMaps[key]();
            }
        }
        
        return me;
    };
    
    fs.ui.Shotcuts = new fs.ui.ShotcutsClass(); 
}