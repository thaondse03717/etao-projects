/*!
 * Parts of original code from ipv6.js <https://github.com/beaugunderson/javascript-ipv6>
 * Copyright 2011 Beau Gunderson
 * Available under MIT license <http://mths.be/mit>
 */

const RE_V4 = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|0x[0-9a-f][0-9a-f]?|0[0-7]{3})\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|0x[0-9a-f][0-9a-f]?|0[0-7]{3})$/i;
const RE_V4_HEX = /^0x([0-9a-f]{8})$/i;
const RE_V4_NUMERIC = /^[0-9]+$/;
const RE_V4inV6 = /(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

const RE_BAD_CHARACTERS = /([^0-9a-f:])/i;
const RE_BAD_ADDRESS = /([0-9a-f]{5,}|:{3,}|[^:]:$|^:[^:]$)/i;

function isIPv4(address)
{
  if (RE_V4.test(address))
    return true;
  if (RE_V4_HEX.test(address))
    return true;
  if (RE_V4_NUMERIC.test(address))
    return true;
  return false;
}

function isIPv6(address)
{
  var a4addon = 0;
  var address4 = address.match(RE_V4inV6);
  if (address4)
  {
    var temp4 = address4[0].split('.');
    for (var i = 0; i < 4; i++)
    {
      if (/^0[0-9]+/.test(temp4[i]))
        return false;
    }
    address = address.replace(RE_V4inV6, '');
    if (/[0-9]$/.test(address))
      return false;

    address = address + temp4.join(':');
    a4addon = 2;
  }

  if (RE_BAD_CHARACTERS.test(address))
    return false;

  if (RE_BAD_ADDRESS.test(address))
    return false;

  function count(string, substring)
  {
    return (string.length - string.replace(new RegExp(substring,"g"), '').length) / substring.length;
  }

  var halves = count(address, '::');
  if (halves == 1 && count(address, ':') <= 6 + 2 + a4addon)
    return true;
  if (halves == 0 && count(address, ':') == 7 + a4addon)
    return true;
  return false;
}

// Returns base domain for specified host based on Public Suffix List
function getBaseDomain(hostname)
{
  // remove trailing dot(s)
  hostname = hostname.replace(/\.+$/, '');

  // return IP address untouched
  if (isIPv6(hostname) || isIPv4(hostname))
    return hostname;
  
  // decode punycode if exists
  if (hostname.indexOf('xn--') >= 0)
  {
    hostname = punycode.toUnicode(hostname);
  }

  // search through PSL
  var prevDomains = [];
  var curDomain = hostname;
  var nextDot = curDomain.indexOf('.');
  var tld = 0;
   
  while (true)
  {
    var suffix = publicSuffixes[curDomain];
    if (typeof(suffix) != 'undefined')
    {
      tld = suffix;
        break;
    }
     
    if (nextDot < 0)
    {
      tld = 1;
      break;
    }
     
    prevDomains.push(curDomain.substring(0,nextDot));
    curDomain = curDomain.substring(nextDot+1);
    nextDot = curDomain.indexOf('.');
  }
   
  while (tld > 0 && prevDomains.length > 0)
  {
    curDomain = prevDomains.pop() + '.' + curDomain;
    tld--;
  }
  
  return curDomain;
}
