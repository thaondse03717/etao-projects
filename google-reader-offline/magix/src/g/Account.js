with ($ns("g"))
{
    g.AccountClass = function()
    {
        var me = this;

        me.sessionID = null;
        me.userID = null;

        me.init = function()
        {
            me.doCheck();
        };


        me.authState = -1;
        me.onAuthStateChanged = new Event();
        me.setAuthState = function(value)
        {
            if (me.authState != value)
            {
                if (value == 1)
                {
                    me.authState = 1;
                    
                    if (localStorage["g.sid." + me.sessionID] != null)
                    {
                        me.userID =  localStorage["g.sid." + me.sessionID];
                        me.onAuthStateChanged.fire(me);
                    }
                    else
                    {
                        var request = new XMLHttpRequest();
                        request.open("GET", g.Urls["reader_api_user_info"], true);
                        request.onreadystatechange = function()
                        {
                            if (request.readyState == 4)
                            {
                                if (request.status == 200)
                                {
                                    var result = JSON.parse(request.responseText);
                                    me.userID = result.userEmail;
                                    
                                    localStorage["g.sid." + me.sessionID] = me.userID;
                                    me.onAuthStateChanged.fire(me);
                                }
                            }
                        };
                        request.send(null);
                    }
                }
                else
                {
                    me.userID = null;
                    me.authState = value;
                    me.onAuthStateChanged.fire(me);
                }
            }
        };


        var _timer = null;
        me.doCheck = function()
        {
            if (_timer != null)
            {
                clearTimeout(_timer);
                _timer = null;
            }

            g.Chrome.getCookie(
                "SID",
                $mappath("https://$google"),
                function(cookie)
                {
                    if (cookie != null)
                    {
                        me.sessionID = cookie.value;
                        me.setAuthState(1);
                    }
                    else
                    {
                        me.sessionID = null;
                        me.userID = null;
                        me.setAuthState(0);
                    }
                    _timer = setTimeout(me.doCheck, 5 * 1000);
                }
            );
        };

        return me;
    };
    
    g.Account = new g.AccountClass(); 
}