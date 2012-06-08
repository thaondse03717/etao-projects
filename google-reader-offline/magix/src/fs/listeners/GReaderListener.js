with ($ns("fs.listeners"))
{
    fs.listeners.GReaderListener = function()
    {
        var me = this;

        me.enabled = false;
        me.feedCheckInterval = fs.Pref.getSetting("gen", "feedCheckInterval");
        me.subscriptionInterval = 60 * 60 * 1000;

        me.startListening = function()
        {
            me.enabled = true;
            me.doCheck();
        };

        me.stopListening = function()
        {
            me.enabled = false;
            if (_subscriptionCheckTimer != null)
            {
                clearTimeout(_subscriptionCheckTimer);
                _subscriptionCheckTimer = null;
            }
            if (_feedCheckTimer != null)
            {
                clearTimeout(_feedCheckTimer);
                _feedCheckTimer = null;
            }
        };
        
        me.doCheck = function()
        {
            me.doFeedCheck();
            me.doSubscriptionCheck();
        };
        
        var _subscriptionCheckTimer = null;
        me.doSubscriptionCheck = function()
        {
            if (_subscriptionCheckTimer != null)
            {
                clearTimeout(_subscriptionCheckTimer);
                _subscriptionCheckTimer = null;
            }
            g.Reader.fetchSubscriptions(function(sender, e)
            {
                if (!me.enabled) return;
                
                var subs = e.result;
                var addings = [];
                var removings = [];
                var changed = false;
                for (var i = 0; i < fs.bg.Storage.subscriptions.length; i++)
                {
                    var exists = false;
                    for (var j = 0; j < subs.length; j++)
                    {
                        if (fs.bg.Storage.subscriptions[i].id == subs[j].id)
                        {
                            // 如果存在
                            exists = true;
                            
                            if (fs.bg.Storage.subscriptions[i].title != subs[j].title)
                            {
                                changed = true;
                                fs.bg.Storage.subscriptions[i].title = subs[j].title;
                            }
                            
                            if (fs.bg.Storage.subscriptions[i].categories.length != subs[j].categories.length)
                            {
                                changed = true;
                                fs.bg.Storage.subscriptions[i].categories = subs[j].categories;
                            }
                            else if (fs.bg.Storage.subscriptions[i].categories.length == subs[j].categories.length && fs.bg.Storage.subscriptions[i].categories.length > 0)
                            {
                                if (fs.bg.Storage.subscriptions[i].categories[0].id != subs[j].categories[0].id)
                                {
                                    changed = true;
                                    fs.bg.Storage.subscriptions[i].categories = subs[j].categories;
                                }
                                else if (fs.bg.Storage.subscriptions[i].categories[0].label != subs[j].categories[0].label)
                                {
                                    changed = true;
                                    fs.bg.Storage.subscriptions[i].categories = subs[j].categories;
                                }
                            }
                            
                            break;
                        }
                    }
                    if (!exists)
                    {
                        // 如果 subs 中不存在 Sorage 中的项
                        changed = true;
                        removings.add(fs.bg.Storage.subscriptions[i]);
                    }
                }
                
                for (var i = 0; i < removings.length; i++)
                {
                    fs.bg.Storage.subscriptions.remove(removings[i]);
                    removings[i] = null;
                }
                removings.clear();
                removings = null;
                
                for (var j = 0; j < subs.length; j++)
                {
                    var exists = false;
                    for (var i = 0; i < fs.bg.Storage.subscriptions.length; i++)
                    {
                        if (subs[j].id == fs.bg.Storage.subscriptions[i].id)
                        {
                            exists = true;
                        }
                    }
                    if (!exists)
                    {
                        // 如果 Storage 中不存在 subs 中的项
                        changed = true;
                        addings.add(subs[j]);
                    }
                }
                
                for (var i = 0; i < addings.length; i++)
                {
                    fs.bg.Storage.subscriptions.add(addings[i]);
                    addings[i] = null;
                }
                addings.clear();
                addings = null;
                
                if (changed)
                {
                    fs.bg.Storage.saveSubscriptions();
                }

                _subscriptionCheckTimer = setTimeout(me.doSubscriptionCheck, me.subscriptionInterval);
            },
            function(sender, e)
            {
                _subscriptionCheckTimer = setTimeout(me.doSubscriptionCheck, me.subscriptionInterval);                
            });
        };

        var _feedCheckTimer = null;
        me.doFeedCheck = function()
        {
            if (_feedCheckTimer != null)
            {
                clearTimeout(_feedCheckTimer);
                _feedCheckTimer = null;
            }
            g.Reader.fetchUnreadFeeds(function(sender, e)
            {
                if (!me.enabled) return;

                if (e.result.length > 0)
                {
                    _dealWithUnreadFeeds(e.result);
                }

                _feedCheckTimer = setTimeout(me.doFeedCheck, me.feedCheckInterval);
            },
            function(sender, e)
            {
                _feedCheckTimer = setTimeout(me.doFeedCheck, me.feedCheckInterval);                
            });
        };



        function _dealWithUnreadFeeds(p_feeds)
        {
            var maxDate = parseInt(p_feeds[0].crawlTimeMsec / 1000);            
            fs.bg.Storage.saveProfile("newestFeed", maxDate);
            
            fs.bg.Storage.insertFeeds(p_feeds);
            if (fs.Pref.getSetting("gen", "markAllAsReadAfterDownloading"))
            {
                g.Reader.markAllAsRead();
            }
        }
        
        
        
        
        fs.Pref.onSaved.addHandler(function()
                {
                    if (fs.Pref.changes.contains("gen/feedCheckInterval") || fs.Pref.changes.contains("*"))
                    {
                        me.stopListening();
                        me.startListening();
                    }
                });

        return me;
    };
}