function $new(p_tag)
{
    return document.createElement(p_tag);
}



Event.prototype.__defineSetter__("returnValue",function(b)
{
    if(!b)this.preventDefault();
    return b;
});

Event.prototype.__defineSetter__("cancelBubble",function(b)
{
    if(b)this.stopPropagation();
    return b;
});

Event.prototype.__defineGetter__("srcElement",function()
{
    var node=this.target;
    while(node.nodeType!=1)node=node.parentNode;
    return node;
});

Event.prototype.__defineGetter__("fromElement",function()
{
    var node;
    if(this.type=="mouseover")
        node=this.relatedTarget;
    else if(this.type=="mouseout")
        node=this.target;
    if(!node)return;
    while(node.nodeType!=1)node=node.parentNode;
    return node;
});

Event.prototype.__defineGetter__("toElement",function()
{
    var node;
    if(this.type=="mouseout")
        node=this.relatedTarget;
    else if(this.type=="mouseover")
        node=this.target;
    if(!node)return;
    while(node.nodeType!=1)node=node.parentNode;
    return node;
});

Event.prototype.__defineGetter__("offsetX",function()
{
    return this.layerX;
});

Event.prototype.__defineGetter__("offsetY",function()
{
    return this.layerY;
});


Node.prototype.replaceNode = function(Node)
{
    this.parentNode.replaceChild(Node,this);
};

Node.prototype.removeNode = function(removeChildren)
{
    if(removeChildren)
    {
        return this.parentNode.removeChild(this);
    }
    else
    {
        var range=document.createRange();
        range.selectNodeContents(this);
        return this.parentNode.replaceChild(range.extractContents(),this);
    }
};

Node.prototype.swapNode = function(Node)
{
    var nextSibling=this.nextSibling;
    var parentNode=this.parentNode;
    node.parentNode.replaceChild(this,Node);
    parentNode.insertBefore(node,nextSibling);
};




HTMLElement.prototype.__defineGetter__("all",function(){
    var a=this.getElementsByTagName("*");
    var node=this;
    return a;
    });
HTMLElement.prototype.__defineGetter__("parentElement",function(){
    if(this.parentNode==this.ownerDocument)return null;
    return this.parentNode;
    });
HTMLElement.prototype.__defineGetter__("children",function(){
    var tmp=[];
    var j=0;
    var n;
    for(var i=0;i<this.childNodes.length;i++){
        n=this.childNodes[i];
        if(n.nodeType==1){
            tmp[j++]=n;
            /*
            if(n.name){
                if(!tmp[n.name])
                    tmp[n.name]=[];
                tmp[n.name][tmp[n.name].length]=n;
                }
            */
            if(n.id)
                tmp[n.id]=n;
            }
        }
    return tmp;
    });
HTMLElement.prototype.__defineGetter__("currentStyle", function(){
    return this.ownerDocument.defaultView.getComputedStyle(this,null);
    });
HTMLElement.prototype.__defineSetter__("outerHTML",function(sHTML){
    var r=this.ownerDocument.createRange();
    r.setStartBefore(this);
    var df=r.createContextualFragment(sHTML);
    this.parentNode.replaceChild(df,this);
    return sHTML;
    });
HTMLElement.prototype.__defineGetter__("outerHTML",function(){
    var attr;
    var attrs=this.attributes;
    var str="<"+this.tagName;
    for(var i=0;i<attrs.length;i++){
        attr=attrs[i];
        if(attr.specified)
            str+=" "+attr.name+'="'+attr.value+'"';
        }
    if(!this.canHaveChildren)
        return str+">";
    return str+">"+this.innerHTML+"</"+this.tagName+">";
    });
HTMLElement.prototype.__defineGetter__("canHaveChildren",function(){
    switch(this.tagName.toLowerCase()){
        case "area":
        case "base":
        case "basefont":
        case "col":
        case "frame":
        case "hr":
        case "img":
        case "br":
        case "input":
        case "isindex":
        case "link":
        case "meta":
        case "param":
            return false;
        }
    return true;
    });
HTMLElement.prototype.__defineSetter__("innerText",function(sText){
    var parsedText=document.createTextNode(sText);
    this.innerHTML=parsedText.data;
    return parsedText.data;
    });
HTMLElement.prototype.__defineGetter__("innerText",function(){
    var r=this.ownerDocument.createRange();
    r.selectNodeContents(this);
    return r.toString();
    });
HTMLElement.prototype.__defineSetter__("outerText",function(sText){
    var parsedText=document.createTextNode(sText);
    this.outerHTML=parsedText;
    return parsedText;
    });
HTMLElement.prototype.__defineGetter__("outerText",function(){
    var r=this.ownerDocument.createRange();
    r.selectNodeContents(this);
    return r.toString();
    });
HTMLElement.prototype.attachEvent=function(sType,fHandler){
    var shortTypeName=sType.replace(/on/,"");
    fHandler._ieEmuEventHandler=function(e){
        window.event=e;
        fHandler(e);
        if (e.returnValue == false)
            e.preventDefault();
        };
    this.addEventListener(shortTypeName,fHandler._ieEmuEventHandler,false);
    };
HTMLElement.prototype.detachEvent=function(sType,fHandler){
    var shortTypeName=sType.replace(/on/,"");
    if(typeof(fHandler._ieEmuEventHandler)=="function")
        this.removeEventListener(shortTypeName,fHandler._ieEmuEventHandler,false);
    else
        this.removeEventListener(shortTypeName,fHandler,true);
    };
HTMLElement.prototype.contains=function(node){
    do if(node==this)return true;
    while(node=node.parentNode);
    return false;
    };
HTMLElement.prototype.insertAdjacentElement=function(where,parsedNode){
    switch(where){
        case "beforeBegin":
            this.parentNode.insertBefore(parsedNode,this);
            break;
        case "afterBegin":
            this.insertBefore(parsedNode,this.firstChild);
            break;
        case "beforeEnd":
            this.appendChild(parsedNode);
            break;
        case "afterEnd":
            if(this.nextSibling)
                this.parentNode.insertBefore(parsedNode,this.nextSibling);
            else
                this.parentNode.appendChild(parsedNode);
            break;
        }
    };
HTMLElement.prototype.insertAdjacentHTML=function(where,htmlStr){
    var r=this.ownerDocument.createRange();
    r.setStartBefore(this);
    var parsedHTML=r.createContextualFragment(htmlStr);
    this.insertAdjacentElement(where,parsedHTML);
    };
HTMLElement.prototype.insertAdjacentText=function(where,txtStr){
    var parsedText=document.createTextNode(txtStr);
    this.insertAdjacentElement(where,parsedText);
    };
window.attachEvent=function(sType,fHandler){
    var shortTypeName=sType.replace(/on/,"");
    fHandler._ieEmuEventHandler=function(e){
        window.event=e;
        return fHandler();
        };
    this.addEventListener(shortTypeName,fHandler._ieEmuEventHandler,false);
    };
window.detachEvent=function(sType,fHandler){
    var shortTypeName=sType.replace(/on/,"");
    if(typeof(fHandler._ieEmuEventHandler)=="function")
        this.removeEventListener(shortTypeName,fHandler._ieEmuEventHandler,false);
    else
        this.removeEventListener(shortTypeName,fHandler,true);
    };

HTMLDocument.prototype.attachEvent=function(sType,fHandler){
    var shortTypeName=sType.replace(/on/,"");
    fHandler._ieEmuEventHandler=function(e){
        window.event=e;
        return fHandler();
        };
    this.addEventListener(shortTypeName,fHandler._ieEmuEventHandler,false);
    };
HTMLDocument.prototype.detachEvent=function(sType,fHandler){
    var shortTypeName=sType.replace(/on/,"");
    if(typeof(fHandler._ieEmuEventHandler)=="function")
        this.removeEventListener(shortTypeName,fHandler._ieEmuEventHandler,false);
    else
        this.removeEventListener(shortTypeName,fHandler,true);
    };
    
CSSStyleDeclaration.prototype.__defineSetter__("posWidth",function(sWidth){
    this.width = sWidth + "px";
    });
CSSStyleDeclaration.prototype.__defineGetter__("posWidth",function(){
    return this.width ? int.parse(this.width) : 0;
    });
    
CSSStyleDeclaration.prototype.__defineSetter__("posHeight",function(sHeight){
    this.height = sHeight + "px";
    });
CSSStyleDeclaration.prototype.__defineGetter__("posHeight",function(){
    return this.height ? int.parse(this.height) : 0;
    });
    
    
CSSStyleDeclaration.prototype.__defineSetter__("posLeft",function(sLeft){
    this.left = sLeft + "px";
    });
CSSStyleDeclaration.prototype.__defineGetter__("posLeft",function(){
    return this.left ? int.parse(this.left) : 0;
    });
    
CSSStyleDeclaration.prototype.__defineSetter__("posTop",function(sTop){
    this.top = sTop + "px";
    });
CSSStyleDeclaration.prototype.__defineGetter__("posTop",function(){
    return this.top ? int.parse(this.top) : 0;
    });




XMLDocument.prototype.loadXML = function(xmlString)
{
    var childNodes = this.childNodes;
    for (var i = childNodes.length - 1; i >= 0; i--)
        this.removeChild(childNodes[i]);

    var dp = new DOMParser();
    var newDOM = dp.parseFromString(xmlString, "text/xml");
    var newElt = this.importNode(newDOM.documentElement, true);
    this.appendChild(newElt);
};

XMLDocument.prototype.__defineGetter__("xml", function ()
{ 
    try
    { 
        return new XMLSerializer().serializeToString(this); 
    }
    catch(ex)
    { 
        var d = document.createElement("div"); 
        d.appendChild(this.cloneNode(true)); 
        return d.innerHTML; 
    } 
});

Element.prototype.__defineGetter__("xml", function ()
{ 
    try
    { 
        return new XMLSerializer().serializeToString(this); 
    }
    catch(ex)
    { 
        var d = document.createElement("div"); 
        d.appendChild(this.cloneNode(true)); 
        return d.innerHTML; 
    }
}); 

XMLDocument.prototype.__defineGetter__("text", function ()
{ 
    return this.firstChild.textContent; 
}); 

Element.prototype.__defineGetter__("text", function ()
{ 
    return this.textContent; 
}); 

Element.prototype.__defineSetter__("text", function (value)
{ 
    this.textContent = value;
}); 

CDATASection.prototype.__defineGetter__("text", function ()
{ 
    return this.textContent; 
}); 

CDATASection.prototype.__defineSetter__("text", function (value)
{ 
    this.textContent = value;
}); 

XMLDocument.prototype.selectSingleNode = Element.prototype.selectSingleNode = function (xpath)
{ 
    var x = this.selectNodes(xpath); 
    if (!x || x.length < 1) return null; 
    return x[0]; 
};

XMLDocument.prototype.selectNodes = Element.prototype.selectNodes = function (xpath)
{ 
    var xpe = new  XPathEvaluator(); 
    var nsResolver = xpe.createNSResolver(this.ownerDocument == null ? this.documentElement: this .ownerDocument.documentElement); 
    var result = xpe.evaluate(xpath, this, nsResolver, 0, null); 
    var found = []; 
    var res; 
    while (res = result.iterateNext()) found.push(res); 
    return  found; 
};

var XmlDocument = function()
{
    var result = document.implementation.createDocument("", "", null);
    result.async = false;
    return result;
};


var __eventHandlers = [];
function $attachEvent(p_control, p_eventName, p_handler)
{
    __eventHandlers.add({element: p_control, eventName: p_eventName, handler:p_handler});
    p_control.attachEvent(p_eventName, p_handler);
}

function $detachEvent(p_control, p_eventName, p_handler)
{
    p_control.detachEvent(p_eventName, p_handler);
}



$onLoad = new Event();
$attachEvent(window, "onload", function()
{
    $onLoad.fire(window);
    $onResize.fire(window);
});


$onResize = new Event();
$onResize.fire = function()
{
    for (var i = $onResize.handlers.length; i >= 0; i--)
    {
        if (typeof($onResize.handlers[i]) == "function")
        {
            $onResize.handlers[i](window);
        }
    }
};
$attachEvent(window, "onresize", function()
{
    $onResize.fire(window);
});


$onDisposing = new Event();
function __window_onunload()
{
    if (__eventHandlers)
    {
        for (var i = 0; i < __eventHandlers.length; i++)
        {
            try
            {
                __eventHandlers[i].element.detachEvent(__eventHandlers[i].eventName, __eventHandlers[i].handler);
            }
            catch(e)
            {
            
            }
            __eventHandlers[i] = null;
        }
        __eventHandlers = null;
    }
    
    if ($onDisposing)
    {
        try
        {
            $onDisposing.fire();
        }
        catch (e)
        {
        
        }
        $onDisposing = null;
    }
    window.detachEvent("onunload", __window_onunload);
}
window.attachEvent("onunload", __window_onunload);