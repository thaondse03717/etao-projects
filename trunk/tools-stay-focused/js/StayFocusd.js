
var StayFocusd=function(){return{maxTimeAllowed:10,firstInstallAllowance:60,elapsedTime:0,interval:1,timer:null,maxTimeAllowedExceeded:false,badgeVisible:false,apiURL:'http://www.stayfocusd.com',redirectURL:'http://www.stayfocusd.com',currentURL:null,version:null,selectedTabID:null,active:null,infoBarShown:{"BLOCKED_BY_REFERRER":{}},init:function(){Upgrader.init();if(this.isFirstInstall()){this.setFirstInstallAllowance();}
if(this.isNewDay()){this.resetElapsedTime();}
ListManager.init();NuclearOption.init();Notification.init();this.maxTimeAllowed=this.getMaxTimeAllowed();this.elapsedTime=this.getElapsedTime();this.maxTimeAllowedExceeded=this.isMaxTimeAllowedExceeded();var activeDays=this.getActiveDays();this.setActiveDays(activeDays);chrome.tabs.getSelected(null,function(tab){StayFocusd.onTabStateChange(tab);});chrome.tabs.onSelectionChanged.addListener(function(tabId,selectInfo){chrome.tabs.getSelected(null,function(tab){StayFocusd.onTabStateChange(tab);});});chrome.tabs.onUpdated.addListener(function(tabId,selectInfo){chrome.tabs.getSelected(null,function(tab){StayFocusd.onTabStateChange(tab);});});chrome.tabs.onRemoved.addListener(function(tabId,removeInfo){chrome.tabs.getSelected(null,function(tab){if(tab===undefined){clearInterval(StayFocusd.timer);}});});chrome.windows.onRemoved.addListener(function(windowID){clearInterval(StayFocusd.timer);});chrome.windows.onFocusChanged.addListener(function(windowId,selectInfo){chrome.tabs.getSelected(null,function(tab){StayFocusd.onTabStateChange(tab);});chrome.windows.getLastFocused(function(windowObj){if(windowObj!==undefined){chrome.tabs.getAllInWindow(windowObj.id,function(tabs){for(var wTab in tabs){if(typeof(tabs[wTab])!=='function'&&tabs[wTab].selected){StayFocusd.checkURL(tabs[wTab].url);}}});}});});chrome.windows.onCreated.addListener(function(windowObj,selectInfo){chrome.tabs.getAllInWindow(windowObj.id,function(tabs){for(var wTab in tabs){if(typeof(tabs[wTab])!=='function'&&tabs[wTab].selected){StayFocusd.checkURL(tabs[wTab].url)}}});});chrome.extension.onRequest.addListener(function(request,sender,sendResponse){var response=StayFocusd.handleContentScriptRequest(request,sender);if(response!==null){sendResponse(response);}});},handleContentScriptRequest:function(request,sender){var response={};switch(request.message){case"hideInfoBar":response={'infoBarHidden':StayFocusd.setLocal('hideInfoBar','true')};break;case"isInfoBarHidden":response={'infoBarHidden':StayFocusd.getLocal('hideInfoBar')==='true'};break;case"saveOutgoingLink":response={'success':StayFocusd.setLocal('outgoingLink',request.outgoingLink)};break;default:response=null;break;}
return response;},onTabStateChange:function(tab){if(tab==undefined){return false;}
StayFocusd.currentURL=tab.url;StayFocusd.selectedTabID=tab.id;StayFocusd.checkURL(tab.url);if(!this.isBlockable(tab.url)&&!ListManager.isWhitelisted(tab.url)&&this.isOutgoingLinksOptionActive()){var outgoingLink=this.getLocal('outgoingLink');if(!ReferrerMonitor.isBlockable(tab.url,outgoingLink)){chrome.tabs.sendRequest(tab.id,{'message':'getReferrer'},function(response){response.referrer=(response.referrer==undefined)?'':response.referrer;StayFocusd.checkURL(response.referrer,true);});}}},checkURL:function(url,isReferrer){if(this.isNewDay()){this.resetElapsedTime();}
url=(url==undefined)?this.currentURL:url;var iconUrl=null;clearInterval(this.timer);var outgoingLink=this.getLocal('outgoingLink');if(this.isBlockable(url,outgoingLink)){iconUrl=(NuclearOption.isActive())?'img/eye_19x19_nuclear.png':'img/eye_19x19_red.png';chrome.tabs.getSelected(null,function(tab){if(tab!==undefined){chrome.browserAction.setIcon({'tabId':tab.id,'path':iconUrl});chrome.tabs.sendRequest(tab.id,{'message':'saveOutgoingLink','target':'ReferrerMonitor'});}});if(this.isKillable()){this.killPage();}else{this.timer=setInterval('StayFocusd_tick()',(this.interval*1000));if(!this.isBlockable(url)&&ReferrerMonitor.isBlockable(url,outgoingLink)||isReferrer){chrome.tabs.getSelected(null,function(tab){if(tab!==undefined){if(StayFocusd.hasInfoBarBeenShown(tab.url,'BLOCKED_BY_REFERRER')===false){StayFocusd.showInfoBar(tab,'BLOCKED_BY_REFERRER');}}});}}}else{if(ListManager.isWhitelisted(url)){chrome.tabs.getSelected(null,function(tab){if(tab!==undefined){chrome.browserAction.setIcon({'tabId':tab.id,'path':'img/eye_19x19_green.png'});}});}else{iconUrl=(NuclearOption.isActive())?'img/eye_19x19_nuclear.png':'img/eye_19x19_blue.png';chrome.tabs.getSelected(null,function(tab){if(tab!==undefined){chrome.browserAction.setIcon({'tabId':tab.id,'path':iconUrl});}});}}},isOutgoingLinksOptionActive:function(){var countdownForOutgoingLinks=this.getLocal('countdownForOutgoingLinks');if(countdownForOutgoingLinks==''||countdownForOutgoingLinks==undefined||countdownForOutgoingLinks==null){return true;}
return countdownForOutgoingLinks=='true';},hasInfoBarBeenShown:function(url,msgType){var encodedURL=encodeURIComponent(url);return this.infoBarShown[msgType][encodedURL]===true;},showInfoBar:function(tab,msgType){if(this.getLocal('hideInfoBar')!=='true'){chrome.tabs.sendRequest(tab.id,{'message':'show','msgType':msgType,'target':'InfoBar'},function(response){var encodedURL=encodeURIComponent(tab.url);StayFocusd.infoBarShown[msgType][encodedURL]=true;});}},isKillable:function(){return this.isMaxTimeAllowedExceeded()||NuclearOption.isActive();},isProtectedURL:function(domain){if(domain===null||domain==undefined||domain.length==0){return false;}
if(domain.indexOf(this.redirectURL)===0){return true;}
if(domain.indexOf('paypal')>=0){return true;}
if(domain.indexOf('chrome')>=0&&domain.indexOf('chrome')<domain.indexOf('://')&&NuclearOption.isActive()){return true;}
return false;},isBlockable:function(domain,outgoingLink){if(this.isProtectedURL(domain)){return false;}
if(domain==null||domain==undefined||domain==''){return false;}
if(this.isActive()===false){return false;}
var isBlacklisted=ListManager.isBlacklisted(domain);var isWhitelisted=ListManager.isWhitelisted(domain);var isBlockableByNuclearOption=NuclearOption.isBlockable(isBlacklisted,isWhitelisted);if(isBlockableByNuclearOption){return true;}
if(isBlacklisted&&!isWhitelisted){return true;}
if(isBlacklisted&&isWhitelisted){var blacklistMatch=ListManager.getMatchFromList(domain,'black');var whitelistMatch=ListManager.getMatchFromList(domain,'white');if(blacklistMatch===domain&&whitelistMatch!==domain){return true;}
if(blacklistMatch!==domain&&whitelistMatch===domain){return false;}
return DomainParser.isMoreGeneralURL(whitelistMatch,blacklistMatch);}
if(isWhitelisted||(NuclearOption.isActive()&&!isBlockableByNuclearOption)){return false;}
if(this.isOutgoingLinksOptionActive()&&typeof outgoingLink=='string'&&outgoingLink.length>0){return ReferrerMonitor.isBlockable(domain,outgoingLink);}
return false;},isNewDay:function(){var isNewDay=false;var todayDate=new Date();var nowTimestamp=todayDate.getTime();var resetTimestamp=this.getLocal('resetTimestamp');var resetTime=this.getResetTime();if(resetTimestamp==undefined||resetTimestamp==null||resetTimestamp==''){var resetArray=resetTime.split(':');var resetHour=parseInt(resetArray[0],10);var resetMin=parseInt(resetArray[1],10);var resetTimestampDate=new Date(todayDate.toDateString()+' '+resetHour+':'+resetMin);resetTimestamp=resetTimestampDate.getTime();this.updateResetTimestamp(resetTime);}
resetTimestamp=parseInt(resetTimestamp);nowTimestamp=parseInt(nowTimestamp);if(nowTimestamp>resetTimestamp){isNewDay=true;this.updateResetTimestamp(resetTime);}
return isNewDay;},getElapsedTime:function(){var elapsedTime=this.getLocal('elapsedTime');if(isNaN(elapsedTime)||elapsedTime==undefined){elapsedTime=0;this.resetElapsedTime();}
return elapsedTime;},resetElapsedTime:function(){var todayDate=this.getDateString();this.setLocal('lastReset',todayDate);this.setLocal('elapsedTime',0);this.maxTimeAllowedExceeded=false;this.elapsedTime=0;},updateBadge:function(){var totalSecondsRemaining=this.getTotalSecondsRemaining();var showBadge=false;if(totalSecondsRemaining<=30){showBadge=true;var color=[200,10,10,100];}else if(totalSecondsRemaining<=60){showBadge=true;var color=[255,245,0,100];}
if(showBadge===true){if(StayFocusd.isBlockable(this.currentURL)){chrome.browserAction.setBadgeBackgroundColor({'tabId':StayFocusd.selectedTabID,'color':color});chrome.browserAction.setBadgeText({'tabId':StayFocusd.selectedTabID,'text':totalSecondsRemaining.toString()});this.badgeVisible=true;}else{chrome.browserAction.setBadgeText({'tabId':StayFocusd.selectedTabID,'text':''});}}else if(StayFocusd.badgeVisible===true){chrome.browserAction.setBadgeText({'tabId':StayFocusd.selectedTabID,'text':''});this.badgeVisible=false;}},killPage:function(){clearInterval(this.timer);chrome.windows.getLastFocused(function(windowObj){if(windowObj!==undefined){chrome.tabs.getAllInWindow(windowObj.id,function(tabs){for(var wTab in tabs){if(typeof(tabs[wTab])!=='function'&&tabs[wTab].selected){if(StayFocusd.isMaxTimeAllowedExceeded()||(NuclearOption.isActive()&&!NuclearOption.hasSmartBomb())){if(tabs[wTab].pinned===true){chrome.tabs.sendRequest(tabs[wTab].id,{'message':'killPage','redirectURL':StayFocusd.redirectURL});}
else{chrome.tabs.update(tabs[wTab].id,{'url':StayFocusd.redirectURL+'?background'});}}
else if(NuclearOption.isActive()&&NuclearOption.hasSmartBomb()){chrome.tabs.sendRequest(tabs[wTab].id,{'message':'smartBomb','smartBomb':NuclearOption.getSmartBomb(),'target':'SmartBomb'});}}}});}});return false;},getMaxTimeAllowed:function(){var maxTimeAllowed=this.getLocal('maxTimeAllowed');if(maxTimeAllowed==undefined||maxTimeAllowed==null||maxTimeAllowed==''){maxTimeAllowed=this.maxTimeAllowed;}
maxTimeAllowed=parseInt(maxTimeAllowed,10);return maxTimeAllowed;},setMaxTimeAllowed:function(maxTimeAllowed){maxTimeAllowed=parseInt(maxTimeAllowed,10);var totalSecondsRemaining=this.getTotalSecondsRemaining();var allow=true;if(this.isMaxTimeAllowedExceeded()){alert('You cannot change the Maximum Time Allowed once your time for the day has been exceeded. Please try again tomorrow.');return false;}
if(maxTimeAllowed>=1440){alert('You cannot set the Maximum Time Allowed to more than 1,440 minutes (which is 24 hours).');return false;}
if(maxTimeAllowed<=0){alert('You cannot set the Maximum Time Allowed to zero or less than zero.');return false;}
if((this.elapsedTime/60)>=maxTimeAllowed){allow=confirm("The time you entered is less than the amount of time you have remaining for today. That means all sites on your Blocked Sites list will be blocked immediately.\n\nAre you sure you want to do this?");if(allow===false){return false;}}
if(maxTimeAllowed>this.maxTimeAllowed){if(this.isProductivityBypassActive()){alert("Whoa! Easy there, cowboy.\n\nYou haven't completed your challenge yet. You'll have to do that before you're allowed to increase your time.\n\nClick OK to admit crushing, humiliating defeat.");return false;}
if(totalSecondsRemaining<180){allow=confirm("There are less than three minutes left before your time runs out. You're not trying to cheat, are you?\n\nIf you still want to update your settings, click OK.");if(allow===true){allow=confirm("Seriously, the whole point of this extension is that you're not supposed to give yourself extra time.\n\nAre you sure you want to do this?");}
if(allow===true){allow=confirm("Look, this isn't working out. I can't help but feel like you're not committed to this relationship.\n\nAre you really willing to risk our friendship just for a few more minutes of web browsing?");}
if(allow===true){allow=confirm("I can't believe you clicked OK.");}
if(allow===true){allow=confirm("This is why we can't have nice things.");}
if(allow===true){allow=confirm("You're really going to go through with this, aren't you?");}
if(allow===true){allow=confirm("Have you no shame?");}
if(allow===true){allow=confirm("Okay, well ... I did my best. But before I change your settings, there's something you should know:\n\nThere's a slight chance that maybe, possibly, the OK button will start a global thermonuclear war.\n\nAlso, it may electrocute a puppy.\n\nThere are no guarantees, but it could happen. I just thought you should know.\n\nGo ahead. Click away. ");}
if(allow===true){alert("I'm telling your mom.");window.open('http://www.sas.calpoly.edu/asc/ssl/procrastination.html');}}else{allow=confirm("You're trying to give yourself more time? You sure that's a good idea? Maybe you should reconsider.\n\nAre you sure you want to increase the maximum time allowed?");if(allow===true){allow=confirm("Seriously, dude. The whole point of this extension is to stop you from procrastinating.\n\nYou're only hurting yourself.\n\nAnd the kitten that gets an electric shock every time you click OK.\n\nAre you sure you can live with yourself?");}
if(allow===true){alert("MEEOOOOOOOOOWWW!\n\nI hope you're happy.");}}}
if(allow===true){var updatedMsg='Your settings have been updated.';if(maxTimeAllowed<this.maxTimeAllowed){updatedMsg="You're giving yourself LESS time?\n\n*slow clap*\n\nWell played, my friend.\n\n"+updatedMsg;}
this.maxTimeAllowed=maxTimeAllowed;this.setLocal('maxTimeAllowed',maxTimeAllowed);alert(updatedMsg);}
return allow;},isMaxTimeAllowedExceeded:function(){if(this.maxTimeAllowedExceeded===true){return true;}
if((this.elapsedTime/60)>this.maxTimeAllowed){this.maxTimeAllowedExceeded=true;return true;}
return false;},getTotalSecondsRemaining:function(){var totalSecondsRemaining=(this.maxTimeAllowed*60)-this.elapsedTime;return(totalSecondsRemaining>=0)?totalSecondsRemaining:0;},getDisplayTimer:function(){var totalSecondsRemaining=this.getTotalSecondsRemaining();if(totalSecondsRemaining==0){return'00:00:00';}
var hours='00';var minutes='00';var seconds='00';hours=Math.floor(totalSecondsRemaining/3600);minutes=Math.floor((totalSecondsRemaining-(hours*3600))/60);seconds=totalSecondsRemaining-((hours*3600)+(minutes*60));hours=DateUtils.toTwoDigits(hours);minutes=DateUtils.toTwoDigits(minutes);seconds=DateUtils.toTwoDigits(seconds);return hours+':'+minutes+':'+seconds;},getDateString:function(){var date=new Date();var month=date.getMonth()+1;var day=date.getDate();var year=date.getFullYear();var dateString=year+'-'+month+'-'+day;return dateString;},setActiveDays:function(activeDays){var activeDaysString=null;if(activeDays.length===0){activeDaysString='none';}else{activeDaysString=activeDays.join('|');}
this.setLocal('activeDays',activeDaysString);},getActiveDays:function(){var activeDaysString=this.getLocal('activeDays');if(activeDaysString=='none'){return[];}
if(activeDaysString==undefined||activeDaysString==null||activeDaysString.length===0){return[0,1,2,3,4,5,6];}
return activeDaysString.split('|');},isActiveDay:function(){var date=new Date();var todayDay=date.getDay();var activeDays=this.getActiveDays();if(activeDays==undefined||activeDays==null||activeDays.length===0){return false;}
return activeDays.inArray(todayDay);},setActiveHours:function(startTime,endTime){this.setLocal('activeHours',startTime+'|'+endTime);},getActiveHours:function(){var startTime=false;var endTime=false;var activeHoursQueue=this.getActiveHoursQueue();if(activeHoursQueue!==false){var todayDate=new Date();var currentTimestamp=todayDate.getTime();if(currentTimestamp>activeHoursQueue.timestamp||this.isFirstInstallAllowanceActive()){startTime=activeHoursQueue.startTime;endTime=activeHoursQueue.endTime;this.setActiveHours(startTime,endTime);this.clearActiveHoursQueue();}}
if(startTime===false&&endTime===false){var activeHours=this.getLocal('activeHours');if(activeHours==undefined||activeHours==null||activeHours==''){this.setActiveHours('00:00','23:59');activeHours=this.getLocal('activeHours');}
var activeHoursArray=activeHours.split('|');startTime=activeHoursArray[0];endTime=activeHoursArray[1];}
var startArray=startTime.split(':');var endArray=endTime.split(':');return{'startTime':startTime,'endTime':endTime,'startHour':startArray[0],'startMin':startArray[1],'startHourInt':parseInt(startArray[0],10),'startMinInt':parseInt(startArray[1],10),'endHour':endArray[0],'endMin':endArray[1],'endHourInt':parseInt(endArray[0],10),'endMinInt':parseInt(endArray[1],10)};},isActiveHour:function(){var activeHours=this.getActiveHours();var date=new Date();var todayHour=date.getHours();var todayMin=date.getMinutes();if(this.isStartTimeLater(activeHours)===true){return this.isBetween(todayHour,todayMin,activeHours.startHourInt,activeHours.startMinInt,23,59)||this.isBetween(todayHour,todayMin,0,0,activeHours.endHourInt,activeHours.endMinInt);}else{return this.isBetween(todayHour,todayMin,activeHours.startHourInt,activeHours.startMinInt,activeHours.endHourInt,activeHours.endMinInt);}},isBetween:function(testHour,testMin,startHour,startMin,endHour,endMin){if(testHour>startHour&&testHour<endHour){return true;}
if(testHour==startHour&&testHour==endHour){return testMin>=startMin&&testMin<=endMin;}
if(testHour==startHour&&testMin>=startMin){return true;}
if(testHour==endHour&&testMin<=endMin){return true;}
return false;},isStartTimeLater:function(activeHours){if(activeHours.startHourInt==activeHours.endHourInt&&activeHours.startMinInt>=activeHours.endMinInt){return true;}else if(activeHours.startHourInt>activeHours.endHourInt){return true;}
return false;},setActiveHoursQueue:function(startTime,endTime){var todayDate=new Date();var queueDate=todayDate.getTime()+DateUtils.hoursToMilliseconds(24);var activeHoursQueue=queueDate+'|'+startTime+'|'+endTime;this.setLocal('activeHoursQueue',activeHoursQueue);},getActiveHoursQueue:function(){var activeHoursQueue=this.getLocal('activeHoursQueue');if(activeHoursQueue==undefined||activeHoursQueue==null||activeHoursQueue==''){return false;}
var activeHoursQueueArray=activeHoursQueue.split('|');var queue={};queue.timestamp=activeHoursQueueArray[0];queue.startTime=activeHoursQueueArray[1];queue.endTime=activeHoursQueueArray[2];return queue;},clearActiveHoursQueue:function(){this.removeLocal('activeHoursQueue');},isActive:function(){if(NuclearOption.isActive()===true){return true;}
return this.isActiveDay()===true&&this.isActiveHour()===true;},updateResetTimestamp:function(resetTime){var resetArray=resetTime.split(':');var resetHour=parseInt(resetArray[0],10);var resetMin=parseInt(resetArray[1],10);var todayDate=new Date();var tomorrowDate=new Date();tomorrowDate.setDate(todayDate.getDate()+1);var newResetDate=new Date(tomorrowDate.toDateString()+' '+resetHour+':'+resetMin);var newResetTimestamp=newResetDate.getTime();this.setLocal('resetTimestamp',newResetTimestamp);},setResetTime:function(resetTime){this.setLocal('resetTime',resetTime);},getResetTime:function(){var resetTime=this.getLocal('resetTime');var resetTimeQueue=this.getResetTimeQueue();if(resetTimeQueue!==false){var todayDate=new Date();var currentTimestamp=todayDate.getTime();if(currentTimestamp>resetTimeQueue.timestamp||this.isFirstInstallAllowanceActive()){resetTime=resetTimeQueue.resetTime;this.setResetTime(resetTime);this.clearResetTimeQueue();this.updateResetTimestamp(resetTime);}}
if(resetTime==undefined||resetTime==null||resetTime==''){this.setResetTime('00:00');resetTime=this.getLocal('resetTime');this.updateResetTimestamp(resetTime);}
return resetTime;},setResetTimeQueue:function(resetTime){var todayDate=new Date();var queueDate=todayDate.getTime()+DateUtils.hoursToMilliseconds(24);var resetTimeQueue=queueDate+'|'+resetTime;this.setLocal('resetTimeQueue',resetTimeQueue);},getResetTimeQueue:function(){var resetTimeQueue=this.getLocal('resetTimeQueue');if(resetTimeQueue==undefined||resetTimeQueue==null||resetTimeQueue==''){return false;}
var resetTimeQueueArray=resetTimeQueue.split('|');var queue={};queue.timestamp=resetTimeQueueArray[0];queue.resetTime=resetTimeQueueArray[1];return queue;},clearResetTimeQueue:function(){this.removeLocal('resetTimeQueue');},setProductivityBypass:function(){this.setLocal('productivityBypass','true');},clearProductivityBypass:function(){this.removeLocal('productivityBypass');},isProductivityBypassActive:function(){return this.getLocal('productivityBypass')=='true';},isFirstInstall:function(){return typeof this.getLocal('firstInstallDate')!=='string';},isActivityMonitorDisabled:function(){return this.getLocal('disableActivityMonitor')==='true';},setFirstInstallAllowance:function(){var date=new Date();this.setLocal('firstInstallDate',date.toDateString());date.setMinutes(date.getMinutes()+this.firstInstallAllowance);this.setLocal('firstInstallAllowanceExpiration',date.getTime());},isFirstInstallAllowanceActive:function(){var expiration=this.getLocal('firstInstallAllowanceExpiration');var todayDate=new Date();return expiration>todayDate.getTime();},setLocal:function(name,value){localStorage.setItem(name,value);},getLocal:function(name){return localStorage.getItem(name);},removeLocal:function(name){return localStorage.removeItem(name);}}}();function StayFocusd_tick(){if(StayFocusd.isNewDay()){StayFocusd.resetElapsedTime();}
StayFocusd.elapsedTime=parseInt(StayFocusd.elapsedTime,10)+StayFocusd.interval;var totalSecondsRemaining=StayFocusd.getTotalSecondsRemaining();if(Notification.isset(totalSecondsRemaining)){Notification.show('block');}
if(StayFocusd.isMaxTimeAllowedExceeded()){StayFocusd.killPage();return false;}
StayFocusd.updateBadge();StayFocusd.setLocal('elapsedTime',StayFocusd.elapsedTime);return true;}
Array.prototype.removeByValue=function(valueToRemove){if(this.indexOf(valueToRemove)>=0){this.splice(this.indexOf(valueToRemove),1);}};Array.prototype.inArray=function(needle){for(key in this){if(this[key]==needle){return true;}}
return false;};