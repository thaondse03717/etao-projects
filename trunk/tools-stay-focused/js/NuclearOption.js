
var NuclearOption=function(){return{timer:null,interval:1,settings:{},init:function(){this.loadSettings();this.timer=setInterval('NuclearOption_tick()',(this.interval*1000));},saveSettings:function(settings){this.settings=settings;settings.activeDays=[];settings.activeDays[0]=settings.frequency==='everyDay';settings.activeDays[1]=settings.frequency.indexOf('every')>-1;settings.activeDays[2]=settings.frequency.indexOf('every')>-1;settings.activeDays[3]=settings.frequency.indexOf('every')>-1;settings.activeDays[4]=settings.frequency.indexOf('every')>-1;settings.activeDays[5]=settings.frequency.indexOf('every')>-1;settings.activeDays[6]=settings.frequency==='everyDay';this.setLocal('nuclearOptionSettings',JSON.stringify(settings));clearInterval(this.timer);this.timer=setInterval('NuclearOption_tick()',(this.interval*1000));},loadSettings:function(){var settingsJSON=this.getLocal('nuclearOptionSettings');if(settingsJSON==undefined||settingsJSON==null||settingsJSON.length==0){return false;}
this.settings=JSON.parse(settingsJSON);},isActive:function(){if(this.isCurrentlyActive()){if(this.isExpired()){this.deactivate();}}else if(this.isStarted()){this.activate();}
return this.isCurrentlyActive();},isActiveAndBlockingWholeSite:function(){return this.isActive()&&this.getContentType=='wholeSite';},isActiveToday:function(){var frequency=this.getFrequency();var lastActiveDate=this.getLastActiveDate();var lastExpiredDate=this.getLastExpiredDate();var todayDate=new Date().toDateString();if(frequency=='todayOnly'&&(lastActiveDate===todayDate||lastActiveDate===null)&&lastExpiredDate!==todayDate){return true;}
var day=new Date().getDay();var activeDays=this.getActiveDays();if(activeDays.length==0){return false;}
return activeDays[day];},isStarted:function(){var startType=this.getStartType();var lastActiveDate=this.getLastActiveDate();var lastExpiredDate=this.getLastExpiredDate();var todayDate=new Date().toDateString();var frequency=this.getFrequency();if(!this.isActiveToday()||lastExpiredDate==todayDate){if(startType=='atScheduledTime'){var todayStartTimeDateObj=new Date(todayDate+' '+this.getStartHour()+':'+this.getStartMin()+' '+this.getStartAmPm());var todayExpirationDateObj=new Date(this.getExpiration());if(todayExpirationDateObj>todayStartTimeDateObj){return false;}}else{return false;}}
if(startType=='now'){return lastActiveDate===todayDate;}else if(this.isActiveToday()){if(startType=='atScheduledTime'){return DateUtils.hasTimePassed(this.getStartHour(),this.getStartMin(),this.getStartAmPm());}else if(startType=='whenMaxTimeAllowedExceeded'){return bg().StayFocusd.isMaxTimeAllowedExceeded();}}},activate:function(){var startDate=(this.hasScheduledTime())?DateUtils.getTodayDateObj(this.getStartHour(),this.getStartMin(),this.getStartAmPm()):new Date();this.settings.expiration=startDate.getTime()+DateUtils.hoursToMilliseconds(this.getBlockLength());this.settings.lastActiveDate=new Date().toDateString();this.settings.lastExpiredDate=null;this.settings.isCurrentlyActive=true;this.saveSettings(this.settings);clearInterval(this.timer);},deactivate:function(){this.settings.lastExpiredDate=new Date().toDateString();this.settings.isCurrentlyActive=false;this.saveSettings(this.settings);},isExpired:function(){if(this.getExpiration()===null){return true;}
var nowDate=new Date();var expirationDate=new Date(this.getExpiration());return expirationDate<nowDate;},isBlockable:function(isBlacklisted,isWhitelisted){if(this.isActive()===false){return false;}
var blockType=this.getBlockType();switch(blockType){case'all':return true;case'allExceptAllowed':return!isWhitelisted;case'blocked':return isBlacklisted;default:return false;}},hasScheduledTime:function(){return this.getStartType()=='atScheduledTime';},getSecondsUntilActive:function(){return DateUtils.secondsUntilTime(this.getStartHour(),this.getStartMin(),this.getStartAmPm());},hasSmartBomb:function(){return this.getContentType()=='smartBomb';},isCurrentlyActive:function(){return(this.settings.isCurrentlyActive==undefined)?false:this.settings.isCurrentlyActive;},getSmartBomb:function(){return(this.settings.smartBomb==undefined)?{}:this.settings.smartBomb;},getContentType:function(){return(this.settings.contentType==undefined)?'wholeSite':this.settings.contentType;},getExpiration:function(){return(this.settings.expiration==undefined)?null:parseInt(this.settings.expiration,10);},getLastActiveDate:function(expiration){return(this.settings.lastActiveDate==undefined)?null:this.settings.lastActiveDate;},getLastExpiredDate:function(expiration){return(this.settings.lastExpiredDate==undefined)?null:this.settings.lastExpiredDate;},getBlockType:function(){return(this.settings.blockType==undefined)?'all':this.settings.blockType;},getBlockLength:function(){return(this.settings.blockLength==undefined)?1:parseFloat(this.settings.blockLength);},getStartType:function(){return(this.settings.startType==undefined)?'now':this.settings.startType;},getStartHour:function(){return(this.settings.startHour==undefined)?'00':this.settings.startHour;},getStartMin:function(){return(this.settings.startMin==undefined)?'00':this.settings.startMin;},getStartAmPm:function(){return(this.settings.startAmPm==undefined)?'am':this.settings.startAmPm;},getFrequency:function(){return(this.settings.frequency==undefined)?null:this.settings.frequency;},getActiveDays:function(){return(this.settings.activeDays==undefined)?[]:this.settings.activeDays;},setLocal:function(name,value){localStorage.setItem(name,value);},getLocal:function(name){return localStorage.getItem(name);},removeLocal:function(name){return localStorage.removeItem(name);}}}();function NuclearOption_tick(){if(NuclearOption.hasScheduledTime()&&!NuclearOption.isActive()){var secondsUntilNuclear=NuclearOption.getSecondsUntilActive();if(Notification.isset(secondsUntilNuclear)){Notification.show('nuclear');}}
return true;}
function bg(){return chrome.extension.getBackgroundPage();}