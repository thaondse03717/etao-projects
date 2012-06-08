with ($ns("fs.bg"))
{
    fs.PreferencesClass = function()
    {
        var me = this;
        
        me.enabled = false;
        
        
        me.gen = null;
        me.default_gen = {
                "startPage": "today",
                "jumpToUnreadsFirst": true,
                "feedCheckInterval": 60 * 1000,
                "downloadUnreadOnly": false,
                "markAllAsReadAfterDownloading": false
        };
        
        
        
        me.reading = null;
        me.default_reading = {
                "pageSize": 10,
                "viewMode": "detail",
                "autoPaging": true,
                "forceOpenInNewWindow": true
        };
        
        
        me.storage = null;
        me.default_storage = {
                "maxAge": 7 * 24,
                "maxCount": 200
        };
        
        
        me.access = null;
        me.default_access = {
                "scrollTrackingInDetailView": true,
                "scrollTrackingInListView": false
        };
        
        
        me.styles = null;
        me.default_styles = {
                "titleStyle":
                {
                    "fontFamily": $msg("default_font"),
                    "fontSize": 26,
                    "fontStyle": "normal",
                    "fontWeight": "bold",
                    "color": "#3165C6"
                },
                "contentStyle": 
                {
                    "fontFamily": $msg("default_font"),
                    "fontSize": 13,
                    "fontStyle": "normal",
                    "fontWeight": "normal",
                    "color": "#000000",
                    "lineSpacing": 1.5
                }
        };
        

        me.init = function()
        {
            g.Account.onAuthStateChanged.$(_g_Account_onAuthStateChanged);
        };
        
        me.load = function()
        {
            if (g.Account.authState == 1)
            {
                // 如果已验证
                me.enabled = true;
                
                me.changes.clear();
                
                me.gen = fs.bg.Storage.getProfile("pref.gen", _clone(me.default_gen));
                me.reading = fs.bg.Storage.getProfile("pref.reading", _clone(me.default_reading));
                me.storage = fs.bg.Storage.getProfile("pref.storage", _clone(me.default_storage));
                me.access = fs.bg.Storage.getProfile("pref.access", _clone(me.default_access));
                me.styles = fs.bg.Storage.getProfile("pref.styles", _clone(me.default_styles));
            }
            else
            {
                me.enabled = false;
                me.changes.clear();
                _reset();
            }
        };
        
        me.restore = function()
        {
            me.changes.clear();
            me.changes.add("*");
            
            _reset();
            
            me.save();
        };
        
        
        me.onSaving = new Event();
        me.onSaved = new Event();
        me.save = function()
        {
            me.onSaving.fire(me, null);
            
            fs.bg.Storage.saveProfile("pref.gen", me.gen);
            fs.bg.Storage.saveProfile("pref.reading", me.reading);
            fs.bg.Storage.saveProfile("pref.storage", me.storage);
            fs.bg.Storage.saveProfile("pref.access", me.access);
            fs.bg.Storage.saveProfile("pref.styles", me.styles);
            
            me.onSaved.fire(me, null);
            me.changes.clear();
        };
        
        me.getSetting = function(p_category, p_name, p_subName)
        {
            var value = null;
            if (p_subName == null)
            {
                value = me[p_category][p_name];                
            }
            else
            {
                if (me[p_category][p_name] == null)
                {
                    value = undefined;
                }
                else
                {
                    value = me[p_category][p_name][p_subName];
                }
            }
            
            if (value === undefined)
            {
                if (p_subName == null)
                {
                    value = me["default_" + p_category][p_name];
                }
                else
                {
                    value = me["default_" + p_category][p_name][p_subName];
                }
            }
            return value;
        };
        
        
        me.changes = [];
        me.setSetting = function(p_category, p_name, p_value)
        {            
            if (me[p_category][p_name] != p_value)
            {
                me[p_category][p_name] = p_value;
                if (!me.changes.contains(p_category + "/" + p_name))
                {
                    me.changes.add(p_category + "/" + p_name);
                }
            }
        };
        
        
        
        function _reset()
        {
            me.gen = _clone(me.default_gen);
            me.reading = _clone(me.default_reading);
            me.storage = _clone(me.default_storage);
            me.access = _clone(me.default_access);
            me.styles = _clone(me.default_styles);
        }
        
        function _clone(obj)
        {
            return JSON.parse(JSON.stringify(obj));
        }
        
        function _g_Account_onAuthStateChanged()
        {
            me.load();
        }
        
        return me;
    };
    
    fs.Pref = new fs.PreferencesClass();
}