
var DomainParser=function(){return{getCurrentURL:function(){chrome.tabs.getSelected(null,function(tab){if(tab!==undefined){return tab.url;}});},extractFullDomain:function(url){var matches=url.match(/:\/\/(.[^/]+)/);if(matches==null||matches.length<2){var urlArray=url.split('/');return urlArray[0];}
var fullDomain=matches[1];return fullDomain;},extractBaseDomain:function(url){var fullDomain=this.extractFullDomain(url);if(fullDomain.length===0){return'';}
var domainArray=fullDomain.split('.');if(domainArray.length===1){return fullDomain;}
var baseDomain=domainArray[(domainArray.length-1)];baseDomain=domainArray[(domainArray.length-2)]+'.'+baseDomain;if(this.isMultiPartDomain(fullDomain)){baseDomain=domainArray[(domainArray.length-3)]+'.'+baseDomain;}
return baseDomain;},extractURLSegments:function(url){var urlSegments={};var domainArray=[];var pathArray=[];var keyValuePairs=[];var urlArray=url.split('?');if(urlArray.length>1){var queryParams=urlArray[1];urlSegments.pairs=queryParams.split('&');}
urlArray[0]=this.stripProtocol(urlArray[0]);urlSegments.path=urlArray[0].split('/');urlSegments.domain=urlSegments.path.shift().split('.');return urlSegments;},isMultiPartDomain:function(fullDomain){var domainArray=fullDomain.split('.');if(domainArray.length===1){return false;}
var penultimate=domainArray[(domainArray.length-2)];if(penultimate.length==1){return true;}
if(penultimate.length==2&&domainArray.length>=3){return true;}
if(penultimate.length==3&&domainArray.length>=3){var domainTokens=['com','edu','gov','mil','net','org','biz','www','pro','int','web'];for(key in domainTokens){if(penultimate==domainTokens[key]){return true;}}}
if(penultimate.length==4&&domainArray.length>=3){var domainTokens=['info','mobi','name'];for(key in domainTokens){if(penultimate==domainTokens[key]){return true;}}}
return false;},isMoreGeneralURL:function(domainToCheck,domainToCompare){domainToCheck=this.stripProtocol(domainToCheck);domainToCompare=this.stripProtocol(domainToCompare);var baseDomainToCompare=this.extractBaseDomain(domainToCompare);if(domainToCheck==domainToCompare){return true;}
if(domainToCheck==baseDomainToCompare){return true;}
if(domainToCompare.indexOf(domainToCheck)===0){return true;}
var baseDomainToCheck=this.extractBaseDomain(domainToCheck);if(baseDomainToCheck==baseDomainToCompare&&domainToCheck.length<=domainToCompare.length&&domainToCompare.indexOf(domainToCheck)>=0&&(domainToCompare.indexOf('/')>=0||domainToCompare.indexOf('?')>=0))
{return true;}
if(baseDomainToCompare.length>baseDomainToCheck.length&&baseDomainToCompare.indexOf(domainToCheck)===0){return true;}
return false;},matchesWildcard:function(wildcard,domainToCompare){var rawWildcardString=wildcard.replace('*','');if(domainToCompare.indexOf(rawWildcardString)==-1){return false;}
var domainUpToWildcard=domainToCompare.substring(0,domainToCompare.indexOf(rawWildcardString)+rawWildcardString.length);var domainSubstring=domainToCompare.substring(domainUpToWildcard.length-rawWildcardString.length,domainUpToWildcard.length);return domainSubstring===rawWildcardString;},stripProtocol:function(url){return(url.indexOf('://')>-1)?url.slice(url.indexOf('://')+3,url.length):url;},getParam:function(param,url){url=(url==undefined)?window.location.href:url;param=param.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");var pattern="[\\?&]"+param+"=([^&#]*)";var regex=new RegExp(pattern);var results=regex.exec(url);if(results==null){return'';}
return results[1];}}}();