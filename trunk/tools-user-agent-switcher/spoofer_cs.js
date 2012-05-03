chrome.extension.sendRequest({action: "blacklist", url: document.location.href}, function(response) {
  if (response.ua_string && response.ua_string != "") {
    document.addEventListener("beforeload", function(event) {
      var new_nav = new function() {};
      var x;
      for (x in navigator) {
        new_nav[x] = navigator[x];
      }
      new_nav.userAgent = response.user_agent;
      new_nav.vendor = response.vendor;
      window.navigator = new_nav;
    }, true);
    
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.innerText += 'var new_nav = new function() {};';
    script.innerText += 'var x;';
    script.innerText += 'for (x in navigator) {';
    script.innerText += 'eval("new_nav." + x + " = navigator." + x + ";");';
    script.innerText += '}';
    script.innerText += 'new_nav.userAgent = "' + response.ua_string + '";';
    script.innerText += 'new_nav.vendor = "' + response.vendor + '";';
    script.innerText += 'window.navigator = new_nav;';
    document.documentElement.insertBefore(script);
    
  }
});

