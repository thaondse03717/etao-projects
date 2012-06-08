with ($ns("fs.bg"))
{
    fs.bg.StorageClass = function()
    {
        var me = this;

        me.readyState = 0;
        me.onReadyStateChanged = new Event();

        me.init = function()
        {
            if (localStorage["fs.users"] != null)
            {
                _users = JSON.parse(localStorage["fs.users"]);
            }
            else
            {
                me.initUsers();
            }
            
            g.Account.onAuthStateChanged.$(g_Account_onAuthStateChanged);
        };





        var _users = null;
        me.getUser = function(p_userID)
        {
            for (var i = 0; i < _users.length; i++)
            {
                if (_users[i].userID == p_userID)
                {
                    return _users[i];
                }
            }
        };
        me.hasUser = function(p_userID)
        {
            return me.getUser(p_userID) != null;
        };
        me.initUsers = function()
        {
            _users = [];
            me.saveUsers();
        };
        me.insertUser = function(p_user)
        {
            _users.add(p_user);
            me.saveUsers();
        };
        me.deleteUser = function(p_userID)
        {
            // TO-DO: Clear All
            var user = me.getUser(p_userID);
            if (user != null)
            {
                me.clearProfile(p_userID);
                _users.remove(user);
                me.saveUsers();
            }
        };
        me.saveUsers = function()
        {
            localStorage["fs.users"] = JSON.stringify(_users);
        };






        me.getProfile = function(p_key, p_defaultValue)
        {
            if (g.Account.userID != null)
            {
                var key = "fs.profiles[" + g.Account.userID + "]." + p_key;

                if (localStorage[key] != null)
                {
                    return JSON.parse(localStorage[key]);
                }
                else
                {
                    if (typeof (p_defaultValue) != "undefined")
                    {
                        me.saveProfile(p_key, p_defaultValue);
                    }
                    return p_defaultValue;
                }
            }
            else
            {
                return null;
            }
        };
        me.saveProfile = function(p_key, p_value)
        {
            if (g.Account.userID != null)
            {
                var key = "fs.profiles[" + g.Account.userID + "]." + p_key;
                var json = JSON.stringify(p_value);
                localStorage[key] = json;
            }
        };
        me.clearProfile = function(p_userID)
        {
            var userKey = "fs.profiles[" + p_userID + "].";
            var deleteArray = [];
            for (var key in localStorage)
            {
                if (key.startsWith(userKey))
                {
                    deleteArray.add(key);
                }
            }
            for (var i = 0; i < deleteArray.length; i++)
            {
                delete localStorage[deleteArray[i]];
            }
        };
        me.hasProfile = function()
        {
            return me.getProfile("feeds") == null;
        };



        me.subscriptions = [];
        me.onSubscriptionsChanged = new Event();
        me.getSubscription = function(p_id)
        {
            for (var i = 0; i < me.subscriptions.length; i++)
            {
                var s = me.subscriptions[i];
                if (s.id == p_id)
                {
                    return s;
                }
            }
            return null;
        };
        me.saveSubscriptions = function(p_args)
        {
            me.saveProfile("subscriptions", me.subscriptions);
            me.onSubscriptionsChanged.fire(me, p_args);
        };
        me.reorderSubscription = function(p_id, p_index)
        {
            var s = me.getSubscription(p_id);
            if (s == null) return;
            
            if (p_index == me.subscriptions.length)
            {
                me.subscriptions.remove(s);
                me.subscriptions.add(s);
            }
            else
            {
                var sBefore = me.subscriptions[p_index];
                me.subscriptions.remove(s);
                me.subscriptions.insertBefore(s, sBefore);
            }
            me.saveSubscriptions({ "action": "reorder" });
        };
        
        
        
        me.feeds = [];
        me.onFeedsChanged = new Event();
        me.initFeeds = function()
        {
            me.saveProfile("feeds", me.feeds);
        };
        me.insertFeeds = function(p_feeds, p_unread)
        {
            var items = [];
            for (var i = p_feeds.length - 1; i >= 0; i--)
            {
                if (!me.containsFeed(p_feeds[i].id))
                {
                    var f = _toLocalFeed(p_feeds[i]);
                    me.feeds.insert(0, f);
                    if (!me.unreads.contains(f.id))
                    {
                        if (p_unread != false)
                        {
                            me.unreads.insert(0, f.id);
                        }
                        items.insert(0, f);
                    }
                }
            }

            if (items.length > 0)
            {
                me.saveFeeds();
                if (p_unread != false && items.length > 0)
                {
                    me.saveUnreads({ addings: items });
                }
            }
        };
        me.removeFeed = function(p_feed)
        {
            if (me.unreads.indexOf(p_feed.id) != -1)
            {
                me.markAsRead([p_feed]);
            }
            me.feeds.remove(p_feed);
            me.saveFeeds();
        };
        me.getFeed = function(p_id)
        {
            for (var i = 0; i < me.feeds.length; i++)
            {
                if (me.feeds[i].id == p_id)
                {
                    return me.feeds[i];
                }
            }
            return null;
        };
        me.queryFeeds = function(p_path)
        {
            if (p_path == null || p_path == "all")
            {
                return me.feeds.clone();
            }
            else if (p_path == "today")
            {
                var result = [];
                var now = new Date();
                var after = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
                for (var i = 0; i < me.feeds.length; i++)
                {
                    var f = me.feeds[i];
                    if (f.published >= after)
                    {
                        result.add(f);
                    }
                }
                return result;
            }
            else if (p_path == "24hours")
            {
                var result = [];
                var now = new Date().getTime();
                var after = now - 24 * 60 * 60 * 1000;
                for (var i = 0; i < me.feeds.length; i++)
                {
                    var f = me.feeds[i];
                    if (f.published >= after)
                    {
                        result.add(f);
                    }
                }
                return result;
            }
            else if (p_path == "unreads")
            {
                var result = [];
                for (var i = 0; i < me.unreads.length; i++)
                {
                    var id = me.unreads[i];
                    var f = me.getFeed(id);
                    if (f != null)
                    {
                        result.add(f);
                    }
                }
                return result;
            }
            else if (p_path == "favourites")
            {
                return me.favourites.clone();
            }
            else
            {
                var result = [];
                for (var i = 0; i < me.feeds.length; i++)
                {
                    var f = me.feeds[i];
                    if (f.origin.streamId == p_path)
                    {
                        result.add(f);
                    }
                }
                return result;
            }
        };
        me.containsFeed = function(p_id)
        {
            return me.getFeed(p_id) != null;
        };
        me.saveFeeds = function(p_args)
        {
            me.saveProfile("feeds", me.feeds);
            me.onFeedsChanged.fire(me, p_args);
        };


        me.unreads = null;
        me.onUnreadsChanged = new Event();
        me.markAsRead = function(p_items)
        {
            var removings = [];
            if (p_items.length ==0) return;
            for (var i = 0; i < p_items.length; i++)
            {
                var f = p_items[i];
                if (me.unreads.contains(f.id))
                {
                    removings.add(f);
                }
            }
            for (var i = 0; i < removings.length; i++)
            {
                me.unreads.remove(removings[i].id);
            }
            if (removings.length > 0)
            {
                me.saveUnreads({removings: removings});
            }
        };
        me.markAllAsRead = function()
        {
            var removings = me.queryFeeds("unreads");
            me.unreads.clear();
            me.saveUnreads({removings: removings});
        };
        me.saveUnreads = function(p_args)
        {
            me.saveProfile("unreads", me.unreads);
            me.onUnreadsChanged.fire(me, p_args);
        };
        
        
        me.favourites = null;
        me.onFavouritesChanged = new Event();
        me.insertFavourite = function(p_feed)
        {
            if (p_feed != null)
            {
                p_feed.fav = true;
                me.favourites.add(p_feed);
                me.saveFavourites();
                me.saveFeeds();
            }
        };
        me.removeFavourite = function(p_id)
        {
            var f = me.getFeed(p_id);
            if (f != null)
            {
                delete f.fav;
                me.saveFeeds();
            }
            
            for (var i = 0; i < me.favourites.length; i++)      
            {
                var f =  me.favourites[i];
                if (f.id == p_id)
                {
                    me.favourites.remove(f);
                    me.saveFavourites();
                    return;
                }
            }
        };
        me.getFavourite = function(p_id)
        {
            for (var i = 0; i < me.favourites.length; i++)      
            {
                var f =  me.favourites[i];
                if (f.id == p_id)
                {
                    return f;
                }
            }
            return null;
        };
        me.containsFavourite = function(p_id)
        {
            return me.getFavourite(p_id) != null;
        };
        me.saveFavourites = function(p_args)
        {
            me.saveProfile("favourites", me.favourites);
            me.onFavouritesChanged.fire(me, p_args);
        };


        me.loadLocalStorage = function()
        {
            if (g.Account.authState == 1)
            {                
                if (!me.hasUser(g.Account.userID))
                {
                    me.insertUser({ userID: g.Account.userID });
                    if (confirm($msg("confirm_import_feeds")))
                    {
                        g.Reader.fetchReadingFeeds({"maxCount": 100}, function(sender, e)
                        {
                            if (e.result.length > 0)
                            {
                                fs.bg.Storage.insertFeeds(e.result);
                            }
                        });
                    }
                }
                
                me.feeds = me.getProfile("feeds", []);
                me.unreads = me.getProfile("unreads", []);
                _checkFeeds();
                me.favourites = me.getProfile("favourites", []);
                me.subscriptions = me.getProfile("subscriptions", []);
                me.readyState = 1;
                me.onReadyStateChanged.fire(me, null);
            }
            else
            {
                me.feeds = [];
                me.unreads = [];
                me.subscriptions = [];
                me.readyState = 0;
                me.onReadyStateChanged.fire(me, null);
            }
            me.onFeedsChanged.fire(me, null);
            me.onUnreadsChanged.fire(me, null);
            me.onSubscriptionsChanged.fire(me, null);
        };
        
        
        me.clearLocalStorage = function()
        {
            if (g.Account.authState == 1)
            {
                me.feeds = [];
                me.saveFeeds();
                
                me.unreads = [];
                me.saveUnreads();
                
                me.readyState = 1;
                me.onReadyStateChanged.fire(me, null);
            }
        };
        
        
        
        function _checkFeeds()
        {
            var changed = false;
            
            var now = new Date();
            var deadLine = now - fs.Pref.getSetting("storage", "maxAge") * 60 * 60 * 1000;
            var maxCount = fs.Pref.getSetting("storage", "maxCount");
            
            while (me.feeds.length > 0 && (me.feeds[me.feeds.length - 1].published < deadLine || me.feeds.length > maxCount))
            {
                changed = true;
                
                var f = me.feeds[me.feeds.length - 1];
                if (me.unreads.contains(f.id))
                {
                    me.markAsRead([f]);
                }
                me.feeds.removeAt(me.feeds.length - 1);
            }
            
            if (changed)
            {
                me.saveFeeds();
            }
        };



        function _toLocalFeed(p_feed)
        {
            var result = new fs.entities.Feed();
            result.id = p_feed.id;
            result.title = (p_feed.title != null ? p_feed.title : null);
            result.published = parseInt(p_feed.crawlTimeMsec);
            if (p_feed.alternate != null && p_feed.alternate.length > 0 && p_feed.alternate[0].href != null)
            {
                result.href = p_feed.alternate[0].href;
            }
            result.author = (p_feed.author != null ? p_feed.author : null);
            result.origin = (p_feed.origin != null ? p_feed.origin : null);
            result.content = (p_feed.content ? p_feed.content.content : (p_feed.summary ? p_feed.summary.content : ""));
            return result;
        }




        function g_Account_onAuthStateChanged()
        {
            me.loadLocalStorage();
        }

        return me;
    };
    
    fs.bg.Storage = new fs.bg.StorageClass();
}