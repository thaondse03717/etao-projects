
var ReferrerMonitor=function(){return{handleBackgroundScriptRequest:function(request,sender){var response={};switch(request.message){case"saveOutgoingLink":response={'success':ReferrerMonitor.saveOutgoingLink()};break;}
return response;},saveOutgoingLink:function(){$('a[href]').each(function(){var href=$(this).attr('href');var pageBaseDomain=DomainParser.extractBaseDomain(window.location.href);if(href.indexOf('javascript:')==-1){$(this).click(function(){chrome.extension.sendRequest({'message':'saveOutgoingLink','outgoingLink':href});});}});},isBlockable:function(url,outgoingLink){if(url===undefined||url===null||url.length==0){return false;}
if(outgoingLink===undefined||outgoingLink===null||outgoingLink.length<2){return false;}
return url.indexOf(outgoingLink)>-1;}}}();