with ($ns("fs.ui.views"))
{
    fs.ui.views.FeedListView = function(p_container)
    {
        var me = new mx.controls.Control(p_container);
        
        me.items = [];
        me.path = null;
        
        me.pageSize = fs.Pref.getSetting("reading", "pageSize");
        
        me.renderer = null;
        
        
        var _divMessage = $new("div");
        var _pager = $new("div");

        me.init = function()
        {
            me.setCssClass("feed-list");
            me.renderer = new fs.ui.renderers.DefaultFeedListRenderer(me);
            
            me.container.addEventListener("scroll", _onscroll, false);
            me.container.addEventListener("click", _onclick, false);
            
            _divMessage.className = "message";
            
            _pager.className = "pager";
            _pager.addEventListener("click", _pager_onclick);
            
            fs.bg.Storage.onUnreadsChanged.$(_fs_bg_Storage_onUnreadsChanged);
        };
        
        me.load = function()
        {
            me.items = fs.bg.Storage.queryFeeds(me.path);
            me.clear();
            me.moveToNextPage();
            me.container.scrollTop = 0;
            me.onLoad.fire(me, null);
        };
        
        me.render = function()
        {
            // 移除分页器
            if (_pager.parentNode != null)
            {
                me.container.removeChild(_pager);
            }
            
            // 如果当前没有可显示的条目
            if (me.items != null && me.items.length > 0)
            {
                me.container.style.overflow = "auto";
            }
            else
            {
                me.container.style.overflow = "";
                _divMessage.innerText = $msg("feed_list_item_not_found");
                me.container.appendChild(_divMessage);
            }
        };
        
        me.refresh = function()
        {
            me.load();
        };
        
        me.clear = function()
        {
            while (me.container.childNodes.length > 0)
            {
                me.container.removeChild(me.container.firstChild);
            }
        };
        
        me.moveToNextPage = function()
        {
            me.render();
            if (me.items.length == 0)
            {
                return;
            }
            
            
            var lastIndex = _getLastItemIndex();
            var count = 0;
            var li, f, first;
            for (var i = lastIndex + 1; i < me.items.length; i++)
            {
                count++;
                f = me.items[i];
                if (count == 1)
                {
                    first = f;
                }
                li = me.renderer.renderListItem(f, me.container);
                me.container.appendChild(li);
                
                if (count == me.pageSize) break;
            }
            
            var delta = me.items.length - ((lastIndex + 1) + count);
            if (delta != 0)
            {
                _pager.innerText = $msg("feed_list_pager", [(me.pageSize > delta ? delta : me.pageSize), delta]);
                me.container.appendChild(_pager);
            }
            
            if (first != null)
            {
                me.selectItem(first.id);
            }
        };
        
        me.getUnreadCount = function()
        {
            var count = 0;
            for (var i = 0; i < me.items.length; i++)
            {
                if (fs.bg.Storage.unreads.contains(me.items[i].id))
                {
                    count++;
                }
            }
            return count;
        };
        
        me.markAllAsRead = function()
        {
            var items = [];
            for (var i = 0; i < me.items.length; i++)
            {
                if (fs.bg.Storage.unreads.contains(me.items[i].id))
                {
                    items.add(me.items[i]);
                }
            }
            if (items.length > 0)
            {
                fs.bg.Storage.markAsRead(items);
            }
        };
        
        me.viewMode = "detail";
        me.setViewMode = function(p_viewMode)
        {
            if (me.viewMode != p_viewMode)
            {
                if (p_viewMode == "detail")
                {
                    me.viewMode = p_viewMode;
                    me.setCssClass("feed-list");
                }
                else if (p_viewMode == "list")
                {
                    me.viewMode = p_viewMode;
                    me.setCssClass("feed-list list-view");
                    for (var i = 0; i < me.container.childNodes.length; i++)
                    {
                        var node = me.container.childNodes[i];
                        if (node.tagName == "LI" && node.className.indexOf("expand") != -1)
                        {
                            node.className = node.className.replace("expand", "");
                        }
                    }
                }
            }
        };


        
        me.removeItem = function(f)
        {
            if (me.items.contains(f))
            {
                me.items.remove(f);
            }
            
            var li = me.container.childNodes[f.id];
            if (li != null)
            {
                li.style.webkitTransition = "opacity 0.5s linear";
                li.style.opacity = "0";
                setTimeout(function()
                        {
                            try
                            {
                                me.container.removeChild(li);
                                
                                if (me.items.length == 0)
                                {
                                    me.render();
                                }
                            }
                            catch (e) {}
                        }, 500);
            }
        };
        
        me.selectedItem = null;
        me.selectItem = function(p_id, p_makeVisible)
        {            
            var li = me.container.childNodes[p_id];
            if (me.selectedItem != li)
            {
                if (me.selectedItem != null)
                {
                    me.renderer.renderAsUnselected(null, me.selectedItem);
                }
                me.selectedItem = li;
                me.renderer.renderAsSelected(null, me.selectedItem);
                
                if (p_makeVisible && me.selectedItem)
                {
                    me.container.scrollTop = me.selectedItem.offsetTop - 63;
                }
            }
        };
        
        me.selectNextItem = function()
        {
            if (me.selectedItem == null)
            {
                return;
            }
            
            var li = me.selectedItem.nextSibling;
            if (li != null && li.tagName == "LI" && li.id.startsWith("tag:"))
            {
                me.selectItem(li.id, true);
            }
            else
            {
                if (_pager.parentNode != null && _pager.style.display == "")
                {
                    _pager_onclick();
                }
            }
        };
        
        me.selectPreviousItem = function()
        {
            if (me.selectedItem == null)
            {
                return;
            }
            
            var li = me.selectedItem.previousSibling;
            if (li != null && li.tagName == "LI" && li.id.startsWith("tag:"))
            {
                me.selectItem(li.id, true);
            }
        };
        
        me.markAsRead = function(p_item)
        {
            var id = p_item.id;
            if (fs.bg.Storage.unreads.contains(id))
            {
                var f = fs.bg.Storage.getFeed(id);
                if (f != null)
                {
                    fs.bg.Storage.markAsRead([f]);
                }
            }
        };
        
        me.openSourceLink = function(p_item)
        {
            var id = p_item.id;
            var f = fs.bg.Storage.getFeed(id);
            if (f != null)
            {
                window.open(f.href);
            }
        };
        
        me.switchFavourites = function(p_item)
        {
            var id = p_item.id;
            
            var f = fs.bg.Storage.getFeed(id);
            if (me.path == "favourites")
            {
                f = fs.bg.Storage.getFavourite(id);
            }
            
            if (f != null)
            {
                var li = me.container.childNodes[id];
                if (li != null)
                {
                    var buttons = li.getElementsByTagName("li");
                    for (var i = 0; i < buttons.length; i++)
                    {
                        if (buttons[i].id == "btnFavourite")
                        {
                            btn = buttons[i];
                            var img = btn.getElementsByTagName("img")[0];
                            img.src = $mappath("~/icons/favourite" + (!f.fav ? "_yellow" : "") + "_16.png");
                            btn.title = !f.fav ? $msg("action_remove_from_favourites") : $msg("action_add_to_favourites");
                        }
                    }
                }
                
                setTimeout(function()
                {
                    if (typeof(f.fav) == "boolean" && f.fav == true)
                    {
                        // 移除收藏
                        fs.bg.Storage.removeFavourite(f.id);
                        if (me.path == "favourites")
                        {
                            me.removeItem(f);
                        }
                        else
                        {
                            me.renderer.renderAsNonFavourites(f, li, true);
                        }
                    }
                    else
                    {
                        // 添加到收藏
                        fs.bg.Storage.insertFavourite(f);
                        me.renderer.renderAsFavourites(f, li, true);
                    }
                }, 10);
            }
        };
        
        
        function _getLastItemIndex()
        {
            var lastIndex = -1;
            if (me.container.lastChild != null)
            {
                var id = me.container.lastChild.id;
                for (var i = 0; i < me.items.length; i++)
                {
                    if (me.items[i].id == id)
                    {
                        lastIndex = i;
                        break;
                    }
                }
            }
            return lastIndex;
        }
        
        function _onscroll(e)
        {
            if (me.viewMode == "detail" && !fs.Pref.getSetting("access", "scrollTrackingInDetailView")) return;
            if (me.viewMode == "list" && !fs.Pref.getSetting("access", "scrollTrackingInListView")) return;
            
            var scrollTop = me.container.scrollTop + me.container.offsetHeight / 2;
            var selectedItem = null;
            for (var i = 0; i < me.container.childNodes.length; i++)
            {
                var li = me.container.childNodes[i];
                if (li.tagName == "LI")
                {
                    if (li.offsetTop < scrollTop)
                    {
                        me.markAsRead(li);
                        selectedItem = li;
                    }
                    else
                    {
                        break;
                    }
                }
            }
            
            if (_pager.parentNode != null)
            {
                if (scrollTop > _pager.offsetTop - me.container.offsetHeight * 0.8)
                {
                    if (fs.Pref.getSetting("reading", "autoPaging"))
                    {
                        me.moveToNextPage();
                    }
                }
            }
            
            if (selectedItem != null && selectedItem != me.selectedItem)
            {
                me.selectItem(selectedItem.id);
            }
        }
        
        
        
        function _fs_bg_Storage_onUnreadsChanged(sender, p_args)
        {
            if (p_args == null) return;
            
            if (p_args.removings)
            {
                for (var i = 0; i < p_args.removings.length; i++)
                {
                    var f = p_args.removings[i];
                    var li = me.container.childNodes[f.id];
                    if (li != null)
                    {
                        me.renderer.markAsRead(f, li);
                    }
                }
            }
            if (p_args.addings)
            {
                var reload = false;
                if (me.path == "all" || me.path == "unreads" || me.path == "24hours" || me.path == "today")
                {
                    reload = true;
                }
                else
                {
                    for (var i = p_args.addings.length - 1; i >= 0; i--)
                    {
                        var f = p_args.addings[i];
                        if (f.origin.streamId == me.path)
                        {
                            reload = true;
                            break;
                        }
                    }
                }
                if (reload)
                {
                    if (confirm($msg("confirm_new_feed_fresh")))
                    {
                        me.load();
                    }
                }
            }
            if (typeof(_updateStatus) == "function")
            {
                _updateStatus();
            }
        }
        
        function _onclick()
        {
            var li = event.srcElement;
            while (li.tagName != "LI" || !li.id.startsWith("tag:"))
            {
                li = li.parentNode;
                if (li == null) return;
            }
            
            me.selectItem(li.id, true);
        }
        
        function _pager_onclick()
        {
            me.moveToNextPage();
            
            _animateScrollEnd = me.container.scrollTop + me.container.offsetHeight / 2;
            _animateScrollStep = 50;
            _animateScroll();
        }
        
        
        var _animateScrollEnd = 0;
        var _animateScrollStep = 0;
        function _animateScroll()
        {
            if (me.container.scrollTop <= _animateScrollEnd) 
            {
                if (_animateScrollStep > 8)
                {
                    _animateScrollStep -= 2;
                }
                me.container.scrollTop += _animateScrollStep;
                setTimeout(_animateScroll, 1);
            }
        }
        
        
        
        
        fs.Pref.onSaved.addHandler(function()
                {
                    if (fs.Pref.changes.contains("reading/pageSize") || fs.Pref.changes.contains("*"))
                    {
                        me.pageSize = fs.Pref.getSetting("reading", "pageSize");
                    }
                });

        return me;
    };
}