
	//	events
	//	======
	
		//	include
			
	/*
		first three variables will be defined
	*/

	var 
		__custom_events__names_to_keys = {},
		__custom_events__keys_to_names = {},
		__custom_events__names_to_objects = {},
		
		__custom_events =
		[
			['to-extension--open-settings', 				'click-110-120-130-140-1-1-1'],
			['to-extension--open-settings-theme', 			'click-111-121-131-141-1-1-1'],
			
			['to-extension--evernote-clip', 				'click-210-220-230-240-1-1-1'],
			['to-extension--evernote-login', 				'click-310-320-330-340-1-1-1'],

			['to-extension--select-theme-1', 				'click-511-521-531-541-1-1-1'],
			['to-extension--select-theme-2', 				'click-512-522-532-542-1-1-1'],
			['to-extension--select-theme-3', 				'click-513-523-533-543-1-1-1'],
			['to-extension--select-theme-custom', 			'click-514-524-534-544-1-1-1'],

			['to-extension--select-size-small', 			'click-611-621-631-641-1-1-1'],
			['to-extension--select-size-medium', 			'click-612-622-632-642-1-1-1'],
			['to-extension--select-size-large', 			'click-613-623-633-643-1-1-1'],

			['to-extension--track--view', 			        'click-811-821-831-841-1-1-1'],
			['to-extension--track--clip', 			        'click-812-822-832-842-1-1-1'],
			['to-extension--track--theme-popup', 			'click-813-823-833-843-1-1-1'],
			['to-extension--track--settings', 			    'click-814-824-834-844-1-1-1'],

			
			['to-browser--evernote-login-show', 			'click-411-421-431-441-1-1-1'],
			['to-browser--evernote-login-failed', 			'click-412-422-432-442-1-1-1'],
			['to-browser--evernote-login-failed--username', 'click-413-423-433-443-1-1-1'],
			['to-browser--evernote-login-failed--password', 'click-414-424-434-444-1-1-1'],
			['to-browser--evernote-login-successful', 		'click-415-425-435-445-1-1-1'],

			['to-browser--evernote-clip-successful', 		'click-711-721-731-741-1-1-1'],
			['to-browser--evernote-clip-failed', 			'click-712-722-732-742-1-1-1']
		]
	;

	for (var i=0,_i=__custom_events.length,e=false,k=false; i<_i; i++)
	{
		e = __custom_events[i];
		k = e[1].split('-');
		
		__custom_events__names_to_keys[e[0]] = e[1];
		__custom_events__keys_to_names[e[1]] = e[0];
		__custom_events__names_to_objects[e[0]] =
		{
			'_1': k[1],
			'_2': k[2],
			'_3': k[3],
			'_4': k[4],
			'_5': (k[5] == 1 ? true : false),
			'_6': (k[6] == 1 ? true : false),
			'_7': (k[7] == 1 ? true : false)
		};
	}
	
	var __custom_events__get_key = function (_event)
	{
		return 'click'
			+'-'+_event.screenX
			+'-'+_event.screenY
			+'-'+_event.clientX
			+'-'+_event.clientY
			+'-'+(_event.ctrlKey ? 1 : 0)
			+'-'+(_event.altKey ? 1 : 0)
			+'-'+(_event.shiftKey ? 1 : 0)
		;
	};
	
	var __custom_events__dispatch = function (_custom_event_object, _document, _window)
	{
		var _e = _document.createEvent("MouseEvents");
		
		_e.initMouseEvent(
			"click", true, true, _window, 0, 
			_custom_event_object['_1'], _custom_event_object['_2'], _custom_event_object['_3'], _custom_event_object['_4'], 
			_custom_event_object['_5'], _custom_event_object['_6'], _custom_event_object['_7'], 
			false, 0, null
		);
		
		_document.dispatchEvent(_e);
	};
	

		//	browser and content
		
	chrome.extension.onRequest.addListener(function(request, sender, sendResponse)
	{
		//	invalid
		if (request._type); else { sendResponse({}); }
		
		//	switch
		switch (request._type)
		{
			case 'to-content--evernote-login-show':
				__custom_events__dispatch(
					__custom_events__names_to_objects['to-browser--evernote-login-show'], 
					window.document, 
					window
				);
				break;

			case 'to-content--evernote-login-failed':
				__custom_events__dispatch(
					__custom_events__names_to_objects['to-browser--evernote-login-failed'], 
					window.document, 
					window
				);
				break;
				
			case 'to-content--evernote-login-failed--username':
				__custom_events__dispatch(
					__custom_events__names_to_objects['to-browser--evernote-login-failed--username'], 
					window.document, 
					window
				);
				break;

			case 'to-content--evernote-login-failed--password':
				__custom_events__dispatch(
					__custom_events__names_to_objects['to-browser--evernote-login-failed--password'], 
					window.document, 
					window
				);
				break;

				
			case 'to-content--evernote-login-successful':
				__custom_events__dispatch(
					__custom_events__names_to_objects['to-browser--evernote-login-successful'], 
					window.document, 
					window
				);
				break;
				
			case 'to-content--evernote-clip-successful':
				__custom_events__dispatch(
					__custom_events__names_to_objects['to-browser--evernote-clip-successful'], 
					window.document, 
					window
				);
				break;
				
			case 'to-content--evernote-clip-failed':
				__custom_events__dispatch(
					__custom_events__names_to_objects['to-browser--evernote-clip-failed'], 
					window.document, 
					window
				);
				break;
		}
		
		//	blank on all
		sendResponse({});
	});

	
		//	extension and chrome
		
	window.document.addEventListener('click', function(_event)
	{
		var 
			_event_key = __custom_events__get_key(_event),
			_event_name = __custom_events__keys_to_names[_event_key],
			_stop = false
		;
		
		switch (_event_name)
		{
			case 'to-extension--open-settings':			chrome.extension.sendRequest({_type: 'to-chrome--open-settings'}); _stop = true; break;
			case 'to-extension--open-settings-theme':	chrome.extension.sendRequest({_type: 'to-chrome--open-settings-theme'}); _stop = true; break;

			case 'to-extension--select-theme-1': chrome.extension.sendRequest({_type: 'to-chrome--select-theme-1'}); _stop = true; break;
			case 'to-extension--select-theme-2': chrome.extension.sendRequest({_type: 'to-chrome--select-theme-2'}); _stop = true; break;
			case 'to-extension--select-theme-3': chrome.extension.sendRequest({_type: 'to-chrome--select-theme-3'}); _stop = true; break;

			case 'to-extension--select-theme-custom': chrome.extension.sendRequest({_type: 'to-chrome--select-theme-custom'}); _stop = true; break;
			
			case 'to-extension--select-size-small': 	chrome.extension.sendRequest({_type: 'to-chrome--select-size-small'}); 	_stop = true; break;
			case 'to-extension--select-size-medium': 	chrome.extension.sendRequest({_type: 'to-chrome--select-size-medium'}); _stop = true; break;
			case 'to-extension--select-size-large':		chrome.extension.sendRequest({_type: 'to-chrome--select-size-large'}); 	_stop = true; break;


			case 'to-extension--track--view':
                chrome.extension.sendRequest({
                    _type:      'to-chrome--track--view',
                    _domain:    (window.location && window.location.href && (window.location.href.indexOf('/', 8) > -1) ? window.location.href.substr(0, (window.location.href.indexOf('/', 8)+1)) : 'blank-domain'),
                    _theme:     (document.getElementById('__readable_var__theme') && document.getElementById('__readable_var__theme').innerHTML ? __decodeURIComponentForReadable(document.getElementById('__readable_var__theme').innerHTML) : 'blank-theme')
                }); 
                _stop = true;
                break;
            
			case 'to-extension--track--clip':
                /* will be done from inside extension code */
                /* here just for uniformity's sake */
                _stop = true;
                break;

            case 'to-extension--track--theme-popup':
                chrome.extension.sendRequest({_type: 'to-chrome--track--theme-popup'});
                _stop = true;
                break;

			case 'to-extension--track--settings':
                chrome.extension.sendRequest({_type: 'to-chrome--track--settings'});
                _stop = true;
                break;
                
                
			case 'to-extension--evernote-clip':
				//	include
				
	//	encode
	//	======
		function __encodeURIComponentForReadable(_string)
		{
			//	none
			if (_string == '') { return 'none'; }
			
			//	encode
			return encodeURIComponent(_string)
				.replace(/!/g, '%21')
				.replace(/'/g, '%27')
				.replace(/\(/g, '%28')
				.replace(/\)/g, '%29')
				.replace(/\*/g, '%2A')
			;
		}

		
	//	decode
	//	======
		function __decodeURIComponentForReadable(_string)
		{
			//	none
			if (_string == 'none') { return ''; }
			
			//	decode
			return decodeURIComponent(_string);
		}
	
	

			
				var 
					_iframe = document.getElementById('readable_iframe'),
					_doc = (_iframe.contentDocument || _iframe.contentWindow.document),
					
					_bodyElement = _doc.getElementById('text'),
					_tagElement = document.getElementById('__readable_var__clip_tag'),
					
					__url = window.location.href, 
					__title = document.title, 
					__body = _bodyElement.innerHTML, 
					__tag = __decodeURIComponentForReadable(_tagElement.innerHTML)
				;

				//	remove fotnoted links
				__body = __body.replace(/<sup class="readableLinkFootnote">[^<]*<\/sup>/gi, '');
				__body = __body.replace(/<ol id="footnotedLinks">[\s\S]*?<\/ol>/gi, '');
			
				chrome.extension.sendRequest({
					_type: 'to-chrome--evernote-clip',
					_url: __url,
					_title: __title,
					_body: __body,
					_tag: __tag
				});
				_stop = true;
				break;

				
			case 'to-extension--evernote-login':
				var 
					_iframe = document.getElementById('readable_iframe'),
					_doc = (_iframe.contentDocument || _iframe.contentWindow.document),
					
					_userElement = _doc.getElementById('evernote_login__username'),
					_passElement = _doc.getElementById('evernote_login__password'),
					_rememberMeElement = _doc.getElementById('evernote_login__rememberMe'),

					__user = (_userElement.value > '' ? _userElement.value : ''),
					__pass = (_userElement.value > '' ? _passElement.value : ''),
					__rememberMe = (_rememberMeElement.checked == true ? true : false)
				;
			
				chrome.extension.sendRequest({
					_type: 'to-chrome--evernote-login',
					_user: __user,
					_pass: __pass,
					_rememberMe: __rememberMe
				});
				_stop = true;
				break;
		}
	
		if (_stop)
		{
			_event.stopPropagation();
			_event.preventDefault();
		}
	
	}, true);

	
	
	//	keyboard hook
	//	=============
		
	//	keyboard hook
	chrome.extension.sendRequest({_type: "to-chrome--get-keyboard-info"}, function(response)
	{
		//	decode
		
	//	encode
	//	======
		function __encodeURIComponentForReadable(_string)
		{
			//	none
			if (_string == '') { return 'none'; }
			
			//	encode
			return encodeURIComponent(_string)
				.replace(/!/g, '%21')
				.replace(/'/g, '%27')
				.replace(/\(/g, '%28')
				.replace(/\)/g, '%29')
				.replace(/\*/g, '%2A')
			;
		}

		
	//	decode
	//	======
		function __decodeURIComponentForReadable(_string)
		{
			//	none
			if (_string == 'none') { return ''; }
			
			//	decode
			return decodeURIComponent(_string);
		}
	
	


		//	global vars
		var 
			__definition_items_html = response._definition_items_html,
			
			__key_activation = __decodeURIComponentForReadable(response._key_activation),
			__key_clip = __decodeURIComponentForReadable(response._key_clip)
		;
		
		//	the event
		window.addEventListener('keydown', function(_event)
		{
			//	include key combo detection
				
	/*
		_event must be defined
		_key_combo and _key_code will be defined at end of code
	*/

	var _key_code = 'NONE';
	switch (true)
	{
		case (_event.keyCode && (_event.keyCode >= 65 && _event.keyCode <= 90)):
			_key_code = String.fromCharCode(_event.keyCode).toUpperCase();
			break;
			
		case (_event.keyCode == 27):	_key_code = 'Escape';		break;
		case (_event.keyCode == 37):	_key_code = 'Left Arrow';	break;
		case (_event.keyCode == 39):	_key_code = 'Right Arrow';	break;
		case (_event.keyCode == 38):	_key_code = 'Up Arrow';		break;
		case (_event.keyCode == 40):	_key_code = 'Down Arrow';	break;
	}

	//	get
	//	===
		var _modifierKeys = (_event.originalEvent ? _event.originalEvent : _event);
		//	jQuery screws up -- fucks up the metaKey property badly
		
		var _key_combo = ''
			+ (_modifierKeys.ctrlKey ? 'Control + ' : '')
			+ (_modifierKeys.shiftKey ? 'Shift + ' : '')
			+ (_modifierKeys.altKey ? 'Alt + ' : '')
			+ (_modifierKeys.metaKey ? 'Command + ' : '')
			+ _key_code
		;

	//	needs a modifier -- if not just Escape key
	//	================
		if ((_key_code != 'Escape') && (_key_code == _key_combo))
		{
			_key_code = 'NONE';
			_key_combo = 'NONE';
		}


			switch (true)
			{
				case ((__key_activation > '') && (_key_combo == __key_activation)):
				case ((__key_clip > '') && (_key_combo == __key_clip)):
					
					//	also clip?
					//	==========
						var __clip_on_launch = ((__key_clip > '') && (_key_combo == __key_clip));

					//	stop
					//	====
						_event.stopPropagation();
						_event.preventDefault();

					//	inject
					//	======
						var code = ""
							+	"var "
+	"	_d = document, "
+	"	_b = _d.getElementsByTagName('body')[0], "
+	"	_o = _d.getElementById('__readable_extension_definitions'), "
+	"	_l = _d.createElement('script')"
+	";"

+	"if (_o); else"
+	"{"
+	"	_o = _d.createElement('dl');"
+	"	_o.setAttribute('style', 'display: none;');"
+	"	_o.setAttribute('id', '__readable_extension_definitions');"
+	"	_b.appendChild(_o);"
+	"}"
+	"_o.innerHTML = '"+__definition_items_html+"';"

+	"_l.setAttribute('src', 'chrome-extension://iooicodkiihhpojmmeghjclgihfjdjhj/js/__bookmarklet_to_inject"+(__clip_on_launch ? "__andClipOnLaunch" : "")+".js');"
+	"_l.className = 'bookmarklet_launch';"
+	"_b.appendChild(_l);";
						eval(code);
						
					break;
			}
			
		}, true);
	});

	