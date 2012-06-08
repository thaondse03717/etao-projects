with ($ns("fs.entities"))
{
    fs.entities.Feed = function()
    {
        var me = this;
        
        me.id = null;
        me.title = null;
        me.published = null;
        
        me.author = null;
        me.origin = null;
        me.href = null;
        
        me.content = null;
        
        return me;
    };
}