// String identifiers for use in hashes.
var CUSTOM_OPTIONS_IDENTIFIER = "custom_options_list";
var BASE_OPTIONS_IDENTIFIER = "base_options_list";
var USE_PRESETS_IDENTIFIER = "use_presets";
var PRESET_LIST_IDENTIFIER = "preset_list";
var SPOOFER_LIST = "spoofer_list";

function UserAgent(title, ua_string, vendor_string, badge, is_preset, group) {
  this.title = title;
  this.ua_string = ua_string;
  this.vendor = vendor_string;
  this.badge = badge;
  this.is_preset = is_preset;
  this.append_to_default_ua = false;
  this.group = group;
  this.show_in_list = false;
  
  this.getUserAgentString = new function(current_user_agent_string) {
    if (this.append_to_default_ua) {
      return current_user_agent_string + ' ' + this.ua_string;
    }
    return this.ua_string;
  }
}

function PresetSpoof(domain, user_agent) {
  this.domain = domain;
  this.user_agent = user_agent;
}

function getParsedItem(item_name) {
  try {
    return JSON.parse(localStorage.getItem(item_name));
  } catch (err) {
    // JSON.parse now throws an exception if it is passed null elements.
    // We must catch it and handle it appropriately.  In this case,
    // we just want to return null.
  }
  return null;
}

function storeItem(key, value) {
  if (!value)
    value = ""
  localStorage.setItem(key, JSON.stringify(value));
}

function setShouldUsePresets(use_presets) {
  storeItem(USE_PRESETS_IDENTIFIER, "" + use_presets);
}

function shouldUsePresets() {
  var builtin = getParsedItem(USE_PRESETS_IDENTIFIER);
  return (!builtin || builtin == "true");
}

function getSpoofList() {
  var list = getParsedItem(SPOOFER_LIST);
  if (!list)
    return new Array();
  return list;
}

function setSpoofList(list) {
  storeItem(SPOOFER_LIST, list);
}

// Returns a list of possible UserAgent objects.
// Concatenates a list of hardcoded options with user-defined options.
function getOptions() {
  var options_list = new Array();
  var custom_options_list = getCustomOptions();
  var base_options_list = getBaseOptionsList();
  options_list = options_list.concat(base_options_list).concat(custom_options_list);
  for (var i = 0; i < options_list.length; i++)
    if (options_list[i])
      options_list[i].index = i;
  return options_list;
}

// Returns the full spoof list grouped by the title of each UA's group.
function getOptionsByGroup() {
  var list = getOptions();
  var groups = {};
  for (var i = 0; i < list.length; i++) {
    if (!list[i])
      continue;
    var group = getUserAgentGroup(list[i]);
    if (!groups[group]) {
      groups[group] = new Array();
    }
    groups[group].push(list[i]);
  }
  return groups;
}

// Parses the hostname/domain out of the given URL.
function findHostname(url) {
  var a = document.createElement("a");
  a.href = url;
  return a.host;
}

function isDomainName(str) {
  var pattern = new RegExp('^(https?:\/\/)?'+ // protocol
    '((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|'+ // domain name
    '((\d{1,3}\.){3}\d{1,3}))'+ // OR ip (v4) address
    '(\:\d+)?(\/[-a-z\d%_.~+]*)*$','i');
  return pattern.test(str);
}

// Returns a "base" set of user-agent strings.
function getBaseOptionsList(hard_reset) {
  var base_options_list = (hard_reset ? null : getParsedItem(BASE_OPTIONS_IDENTIFIER));
  if (!base_options_list) {
    var base_options_list = new Array();
    base_options_list.push(new UserAgent("Default", "", "", "", true, "Chrome"));
    base_options_list.push(new UserAgent("Windows Firefox 3.5", "Mozilla/5.0 (Windows; U; Windows NT 6.0; en; rv:1.9.1.7) Gecko/20091221 Firefox/3.5.7", "Mozilla, Inc.", "FF3", true, "Firefox"));
    base_options_list.push(new UserAgent("Windows Firefox 4", "Mozilla/5.0 (Windows NT 6.1; rv:2.0.1) Gecko/20100101 Firefox/4.0.1", "Mozilla, Inc.", "FF4", true, "Firefox"));
    base_options_list.push(new UserAgent("Windows Firefox 10", "Mozilla/5.0 (Windows NT 6.2; rv:10.0.1) Gecko/20100101 Firefox/10.0.1", "Mozilla, Inc.", "FF4", true, "Firefox"));
    base_options_list.push(new UserAgent("Opera 10", "Opera/9.80 (Macintosh; Intel Mac OS X; U; en) Presto/2.2.15 Version/10.00", "Mozilla, Inc.", "O10", true, "Opera"));
    base_options_list.push(new UserAgent("Mac Safari 4", "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_5_8; en-us) AppleWebKit/531.21.8 (KHTML, like Gecko) Version/4.0.4 Safari/5", "Apple, Inc.", "S4", true, "Safari"));
    base_options_list.push(new UserAgent("Internet Explorer 6", "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.0; WOW64; Trident/4.0; SLCC1)", "Microsoft", "IE6", true, "Internet Explorer"));
    base_options_list.push(new UserAgent("Internet Explorer 7", "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0; WOW64; Trident/4.0; SLCC1)", "Microsoft", "IE7", true, "Internet Explorer"));
    base_options_list.push(new UserAgent("Internet Explorer 8", "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0; WOW64; Trident/4.0; SLCC1)", "Microsoft", "IE8", true, "Internet Explorer"));
    base_options_list.push(new UserAgent("Internet Explorer 9", "Mozilla/5.0 (MSIE 9.0; Windows NT 6.1; Trident/5.0)", "Microsoft", "IE9", true, "Internet Explorer"));  
    base_options_list.push(new UserAgent("iPhone 4", "Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_3_2 like Mac OS X; en-us) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8H7 Safari/6533.18.5", "Apple, Inc.", "IP4", true, "iPhone"));
    base_options_list.push(new UserAgent("iPad", "Mozilla/5.0 (iPad; U; CPU OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7B334b Safari/531.21.10", "Apple, Inc.", "iPad", true, "iPad"));
    base_options_list.push(new UserAgent("Android (Motorola Xoom)", "Mozilla/5.0 (Linux; U; Android 3.0; en-us; Xoom Build/HRI39) AppleWebKit/534.13 (KHTML, like Gecko) Version/4.0 Safari/534.13", "", "AND", true, "Android"));
    setBaseOptionsList(base_options_list);
  }
  return base_options_list;
}

function setBaseOptionsList(list) {
  storeItem(BASE_OPTIONS_IDENTIFIER, list);
}

function getCustomOptions() {
  return getParsedItem(CUSTOM_OPTIONS_IDENTIFIER);
}

function setCustomOptions(list) {
  storeItem(CUSTOM_OPTIONS_IDENTIFIER, list);  
}

function addCustomUAOption(name, user_agent, append_to_default_ua, indicator, group) {
  var custom_options_list = getCustomOptions();
  if (!custom_options_list)
    custom_options_list = new Array();

  // Check that the name is not already taken.
  for (var i = 0; i < custom_options_list.length; i++)
    if (custom_options_list[i].title == name)
      return false;

  var new_user_agent = new UserAgent(name, user_agent, "", indicator, false);
  new_user_agent.group = group;
  new_user_agent.append_to_default_ua = append_to_default_ua;
  custom_options_list.push(new_user_agent);
  setCustomOptions(custom_options_list);

  return true;
}

// TODO(gwilson): modify this to remove the option *not* based on title.
function deleteUAOption(name, is_base_option) {
  var options_list = (is_base_option ? getBaseOptionsList() : getCustomOptions());
  if (!options_list)
    return false;

  // Check that the name is not already taken.
  for (var i = 0; i < options_list.length; i++)
    if (options_list[i].title == name) {
      options_list.splice(i, 1);
      break;
    }

  if (is_base_option)
    setBaseOptionsList(options_list)
  else
    setCustomOptions(options_list);

  return true;
}

// For legacy support.
function isRemovable(user_agent) {
  return (!user_agent.is_preset || user_agent.ua_string != "");  
}

function getDisplayUserAgentString(user_agent) {
  return (user_agent.ua_string == "" ? "[Use default User-agent string]" : user_agent.ua_string);
}
  
function getDisplayAppendOrReplaceString(user_agent) {
  return (user_agent.ua_string == "" ? "N/A" : (user_agent.append_to_default_ua ? "Append" : "Replace"));
}

function guessUserAgentGroup(str) {
  if (!str)
    return "";
  // If there is no group defined, guess one.
  var guesses = [["Chrome", "Chrome"],
                 ["Firefox", "Firefox"],
                 ["Opera", "Opera"],
                 ["Safari", "Safari"],
                 ["IE", "Internet Explorer"],
                 ["Internet Explorer", "Internet Explorer"],
                 ["iPhone", "iPhone"],
                 ["iPad", "iPad"],
                 ["iOS", "iOS"]];
  for (var i = 0; i < guesses.length; i++) {
    if (str.toUpperCase().indexOf(guesses[i][0].toUpperCase()) > -1)
      return guesses[i][1];
  }
  return "";
}

function getUserAgentGroup(user_agent) {
  if (!user_agent)
    return "";
  if (user_agent.group)
    return user_agent.group;
  return "";
}

function importUserAgentData(raw_data) {
  console.log("Importing raw data!");
}
