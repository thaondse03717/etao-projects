
	//	chrome model
	
	//	translation
	//	===========
		function __get_translation(_key)
		{
			var _t = chrome.i18n.getMessage('options__'+_key);
			return (_t > '' ? _t : '');
		}

		
	//	get options
	//	===========
		function __get_saved__options()
		{
			
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
	
	

			
	//	__encodeURIComponentForReadable must be defined

	var __default_options = 
	{
		'text_font': 			__encodeURIComponentForReadable('"PT Serif"'),
		'text_font_header': 	__encodeURIComponentForReadable('"PT Serif"'),
		'text_font_monospace': 	__encodeURIComponentForReadable('Inconsolata'),
		'text_size': 			__encodeURIComponentForReadable('16px'),
		'text_line_height': 	__encodeURIComponentForReadable('1.5em'),
		'box_width': 			__encodeURIComponentForReadable('36em'),
		'color_background': 	__encodeURIComponentForReadable('#f3f2ee'),
		'color_text': 			__encodeURIComponentForReadable('#1f0909'),
		'color_links': 			__encodeURIComponentForReadable('#065588'),
		'text_align': 			__encodeURIComponentForReadable('normal'),
		'base': 				__encodeURIComponentForReadable('theme-1'),
		'footnote_links': 		__encodeURIComponentForReadable('on_print'),
		'large_graphics': 		__encodeURIComponentForReadable('do_nothing'),
		'custom_css': 			__encodeURIComponentForReadable(''
								+ '#text blockquote { border-color: #bababa; color: #656565; }'
								+ '#text thead { background-color: #dadada; }'
								+ '#text tr:nth-child(even) { background: #e8e7e7; }'
								)
	};

		
			var _return = {};

			for (var _x in __default_options) { _return[_x] = localStorage[_x]; }
			return _return;
		}
		
		
	//	get vars	
	//	========
		function __get_saved__vars()
		{
			
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
	
	

			
	//	__encodeURIComponentForReadable must be defined

	var __default_vars = 
	{
		'theme': 				__encodeURIComponentForReadable('theme-1'),
		
		'keys_activation': 		__encodeURIComponentForReadable('Control + Alt + Right Arrow'),
		'keys_clip': 			__encodeURIComponentForReadable('Control + Alt + Up Arrow'),
		'clip_tag': 			__encodeURIComponentForReadable(''),
		
		'custom_theme_options':	__encodeURIComponentForReadable('')
	};

		
			var _return = {};
			for (var _x in __default_vars) { _return[_x] = localStorage[_x]; }
			
			return _return;
		}
	
		
	//	save
	//	====
		function __save_someStuff(_to_save)
		{
			for (var _x in _to_save)
				{ localStorage[_x] = _to_save[_x]; }
		}

		
	//	get evernote credentials
	//	========================
		function __get_stored_evernote_credentials()
		{
			switch (true)
			{
				case (!(localStorage['storedEvernoteUsername'] > '')):
				case (!(localStorage['storedEvernotePassword'] > '')):
					return false;
			}
		
			var _r = {};
				_r.username = localStorage['storedEvernoteUsername'];
				_r.password = 'encrypted';
			return _r;
		}

		
	//	forget evernote credentials
	//	===========================
		function __forget_stored_evernote_credentials()
		{
			//	save
			__save_someStuff({
				'storedEvernoteUsername': '',
				'storedEvernotePassword': '',
				'storedEvernoteLogoutOnNextAction' : 'yes'
			});
		}
		
	
	//	firefox model
	

	//	main vars
	var 
		$options = 
		{
			'__path_main': 'chrome-extension://iooicodkiihhpojmmeghjclgihfjdjhj/',
            
            'versioning': {
                'file_name_base--theme-1_css':	'base--theme-1.css',
                'file_name_base--theme-2_css':	'base--theme-2.css',
                'file_name_base--theme-3_css':	'base--theme-3.css',
                'file_name_base--blueprint_css':'base--theme-3.css'
            }
		}
	;	
	
	//	translations
	
	$options['__translations'] =
	{
		'title__page': 				'Clearly / Options',
		'title__general': 			'Options',
		'title__custom': 			'Custom Theme',
		
		'title__sub__keyboard':		'Keyboard shortcuts',
		'title__sub__tags':			'Clipping to Evernote',
		'title__sub__account':		'Account',
		
		'keys_activation__label': 	'View page in Clearly',
		'keys_clip__label': 		'Clip to Evernote',
		'clip_tag__no__label': 		'Don\'t tag',
		'clip_tag__yes__label': 	'Tag with',
		
		'account__sign_out': 		'Signed in as [[=username]].',
		'account__sign_out_link': 	'Sign out.',
		'account__signed_out': 		'You are not signed in. Click on the Evernote icon, in the Clearly sidebar, to sign in.',
		
		'text_font__label': 			'Body Font',
		'text_font_header__label':		'Header Font',
		'text_font_monospace__label':	'Monospace Font',
		'text_size__label': 			'Base Font Size',
		'text_line_height__label': 		'Line Height',
		'box_width__label': 			'Line Width',
		'color_background__label': 		'Background Color',
		'color_text__label': 			'Foreground Color',
		'color_links__label': 			'Links Color',
		'text_align__label': 			'Text Align',
		'base__label': 					'Base CSS',
		'custom_css__label':			'Custom CSS',
		'footnote_links__label':		'Links as Footnotes',
		'large_graphics__label': 		'Large Graphics',
		
		'values__text_align__Normal': 		'Normal',
		'values__text_align__Justified': 	'Justified',

		'values__base__Blueprint': 	'Blueprint',
		'values__base__Theme_1': 	'Newsprint',
		'values__base__Theme_2': 	'Notable',
		'values__base__Theme_3': 	'Night Owl',
		'values__base__None': 		'None',
		
		'values__footnote_links__On_Print': 'On Print',
		'values__footnote_links__Always': 	'Always',
		'values__footnote_links__Never': 	'Never',
		
		'values__large_graphics__Do_Nothing': 		'Show Always',
		'values__large_graphics__Hide_on_Print': 	'Hide on Print',
		'values__large_graphics__Hide_Always': 		'Hide Always',
		
		'values__menu_placement__Top_Right': 	'Top Right',
		'values__menu_placement__Bottom_Right': 'Bottom Right',
		
		'button__save_general': 'Save Options',
		'button__save_custom': 	'Save Theme',
		'button__more_options': 'More Options',
		'button__reset_custom': 'Reset',
		
		'message__saved':			'Settings will be in effect on any new tabs you use Clearly on.',
		'message__keys':			'To change, place cursor in field and strike key combination on your keyboard.',
		'message__keys_firefox':	'Restart your browser, afer saving.'
	};
	
	//	get from extension
	for (var x in $options.__translations)
	{
		var _t = __get_translation(x);
		if (_t > ''); else { continue; }
		
		$options.__translations[x] = _t;
	}
	
	//	custom firefox, keys message
	

	
	$('[translate]').each(function()
	{
		var 
			_$t = $(this),
			_t = $options.__translations[_$t.attr('translate')]
		;
		
		//	mo translation
		if (_t > ''); else { return _$t.attr('translate'); }
		
		//	X parameter
		if (_t.indexOf('[=x]') > -1)
		{
			var _x = _$t.attr('translate_x');
				_t = _t.replace('[=x]', _x);
		}
		
        //  __escapeForHTML
        
    //  escapeForHTML
    //  =============
        function __escapeForHTML(_string)
        {
            var _replace = {
                "&": "amp", 
                '"': "quot", 
                "<": "lt", 
                ">": "gt"
            };
            
            return _string.replace(
                /[&"<>]/g,
                function (_match) { return ("&" + _replace[_match] + ";"); }
            );
        }


        //  general or button
		switch (true)
		{
			case (_$t.attr('type') == 'button' && this.tagName.toLowerCase() == 'input'):
				_$t.attr('value', __escapeForHTML(_t));
				break;
		
			default:
				_$t.html(__escapeForHTML(_t));
				break;
		}
	});


	//	options
	
	//	general
	//	=======
		$options.__values_put__general = function ()
		{
			//	include
			//	=======
				
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
	
	

		
			//	vars
			//	====
				var _vars = __get_saved__vars();
				var _varsDecoded = {};

			//	decode
			//	======
				for (var _x in _vars)
					{ _varsDecoded[_x] = __decodeURIComponentForReadable(_vars[_x]); }
			
			//	set
			//	===
				$('#keys_activation__control').val(_varsDecoded['keys_activation']);
				$('#keys_clip__control').val(_varsDecoded['keys_clip']);

				$('#clip_tag__control').val(_varsDecoded['clip_tag']);
				$('#clip_tag__radio__no').attr('checked', (!(_varsDecoded['clip_tag'] > '')));
				$('#clip_tag__radio__yes').attr('checked', (_varsDecoded['clip_tag'] > ''));
		};
		
		
	//	custom
	//	======
		$options.__values_put__custom = function ()
		{
			//	include
			//	=======
				
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
	
	

				
	//	__encodeURIComponentForReadable must be defined

	var __default_options = 
	{
		'text_font': 			__encodeURIComponentForReadable('"PT Serif"'),
		'text_font_header': 	__encodeURIComponentForReadable('"PT Serif"'),
		'text_font_monospace': 	__encodeURIComponentForReadable('Inconsolata'),
		'text_size': 			__encodeURIComponentForReadable('16px'),
		'text_line_height': 	__encodeURIComponentForReadable('1.5em'),
		'box_width': 			__encodeURIComponentForReadable('36em'),
		'color_background': 	__encodeURIComponentForReadable('#f3f2ee'),
		'color_text': 			__encodeURIComponentForReadable('#1f0909'),
		'color_links': 			__encodeURIComponentForReadable('#065588'),
		'text_align': 			__encodeURIComponentForReadable('normal'),
		'base': 				__encodeURIComponentForReadable('theme-1'),
		'footnote_links': 		__encodeURIComponentForReadable('on_print'),
		'large_graphics': 		__encodeURIComponentForReadable('do_nothing'),
		'custom_css': 			__encodeURIComponentForReadable(''
								+ '#text blockquote { border-color: #bababa; color: #656565; }'
								+ '#text thead { background-color: #dadada; }'
								+ '#text tr:nth-child(even) { background: #e8e7e7; }'
								)
	};

		
			//	reset options
			//	=============
				$options._resetOptions = __get_saved__options();
				$options._resetOptionsDecoded = {};
				
				for (var _x in $options._resetOptions)
					{ $options._resetOptionsDecoded[_x] = __decodeURIComponentForReadable($options._resetOptions[_x]); }
				
			//	custom options -- [[=option_name][=option_value]]
			//	==============
				var 
					_vars = __get_saved__vars(),
					_customOptionsAggregate = __decodeURIComponentForReadable(_vars['custom_theme_options']),
					_customOptions = {},
					_customOptionsDecoded = {},
					_customOptionsUse = true
				;
				
				_customOptionsAggregate.replace
				(
					/\[\[=(.*?)\]\[=(.*?)\]\]/gi,
					function (_match, _name, _value)
					{
						_customOptions[_name] = _value;
						_customOptionsDecoded[_name] = __decodeURIComponentForReadable(_value);
					}
				);
				
				for (var _option in __default_options)
				{
					if (_option in _customOptionsDecoded); else
					{
						_customOptionsUse = false;
						break;
					}
				}
				
				if (_customOptionsUse)
				{
					$options._resetOptions = _customOptions;
					$options._resetOptionsDecoded = _customOptionsDecoded;
				}
				
				
			//	put in ui
			//	=========
				$options.__values_put__custom__from_reset();
		};

		$options.__values_put__custom__from_reset = function ()
		{
			//	list
			//	====
				var _normalOptionsList =
				[
					'color_background', 'color_text', 'color_links',
					'text_size', 'box_width', 'text_line_height',
					'base',	'text_align', 'footnote_links',	'large_graphics'
				];
			
			//	normal options
			//	==============
				for (var i=0, _i=_normalOptionsList.length; i<_i; i++)
					{ $('#'+_normalOptionsList[i]+'__control').val($options._resetOptionsDecoded[_normalOptionsList[i]]); }
					
			//	fonts
			//	=====
				$('#text_font__control').val($options.__values_put__custom__unquoteFonts($options._resetOptionsDecoded['text_font']));
				$('#text_font_header__control').val($options.__values_put__custom__unquoteFonts($options._resetOptionsDecoded['text_font_header']));
				$('#text_font_monospace__control').val($options.__values_put__custom__unquoteFonts($options._resetOptionsDecoded['text_font_monospace']));
				
			//	custom
			//	======
				$('#custom_css__control').val($options._resetOptionsDecoded['custom_css'].replace(/\}/gi, '}\n'));
		};
		
		$options.__values_put__custom__unquoteFonts = function (_s)
		{
			return _s.replace(/"([^"]+)"/gi, '$1');
		};
	
	
	//	general
	//	=======
		$options.__values_get__general = function()
		{
			//	include
			//	=======
				
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
	
	


			//	vars
			//	====
				var 
					_varsDecoded = {},
					_vars = {}
				;

			//	get
			//	===
			
				_varsDecoded['keys_activation'] = $('#keys_activation__control').val();
				_varsDecoded['keys_clip'] = $('#keys_clip__control').val();
				
				_varsDecoded['clip_tag'] = $('#clip_tag__control').val();
				_varsDecoded['clip_tag'] = (($('#clip_tag__radio__no').attr('checked') == 'checked') ? '' : _varsDecoded['clip_tag']);

			//	encode
			//	======
				for (var _x in _varsDecoded)
					{ _vars[_x] = __encodeURIComponentForReadable(_varsDecoded[_x]); }
			
			//	return
			return _vars;
		};
		

	//	custom
	//	======
		$options.__values_get__custom = function()
		{
			//	include
			//	=======
				
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
	
	


			//	vars
			//	====
				var 
					_optionsDecoded = {},
					_options = {},
					_optionsList =
					{
						'color_background': 	'',
						'color_text': 			'',
						'color_links': 			'',
						
						'text_size': 			'',
						'box_width': 			'',
						'text_line_height': 	'',

						'base': 				'',
						'text_align': 			'',
						'footnote_links': 		'',
						'large_graphics': 		''
					}
				;
			
			//	normal options
			//	==============
				for (var _x in _optionsList)
					{ _optionsDecoded[_x] = $('#'+_x+'__control').val(); }
					
			//	fonts
			//	=====
				_optionsDecoded['text_font'] = $options.__values_get__custom__quoteFonts($('#text_font__control').val());
				_optionsDecoded['text_font_header'] = $options.__values_get__custom__quoteFonts($('#text_font_header__control').val());
				_optionsDecoded['text_font_monospace'] = $options.__values_get__custom__quoteFonts($('#text_font_monospace__control').val());
				
			//	custom
			//	======
				_optionsDecoded['custom_css'] = $('#custom_css__control').val().replace(/[\r\n]/gi, '');
			
			//	encode
			//	======
				for (var _x in _optionsDecoded)
					{ _options[_x] = __encodeURIComponentForReadable(_optionsDecoded[_x]); }
				
			//	return	
			return _options;
		};
		
		$options.__values_get__custom__quoteFonts = function (_val)
		{
			var _r='', _v='', _m = _val.split(',');
			for (var i=0, _i=_m.length; i<_i; i++)
			{
				_v = _m[i].replace(/\s+/gi, ' ').replace(/^\s/, '').replace('\s$/', '');
				_r += ', '+(_v.indexOf(' ') > -1 ? '"'+_v+'"' : _v);
			}
			
			return _r.substr(2);
		};

	
	//	ui
	
	//	controls and load -- this order
	//	=================

		//	flexSelect
		//	==========
			$('#text_font__select, #text_font_header__select, #text_font_monospace__select').flexselect({
				'allowMismatch': true, 
				'inputIdTransform': function(id) {
					return id.replace('__select', '__control');
				}
			});

			
		//	put values
		//	==========
			$options.__values_put__general();
			$options.__values_put__custom();

			
		//	miniColors
		//	==========
			$('#color_background__control, #color_text__control, #color_links__control')
				.miniColors({'change': function () { $options.__preview(); }});

				
	//	controls events
	//	===============
	
		//	selects
		//	=======
			$('#view__custom table.controlTable select')
				.change(function() { $options.__preview(); });

                
		//	textboxes
		//	=========
			$('#text_size__control').keyup(function() { $options.__preview(); });
			$('#box_width__control').keyup(function() { $options.__preview(); });
			$('#text_line_height__control').keyup(function() { $options.__preview(); });

			$('#text_font__control').keyup(function() { $options.__preview(); });
			$('#text_font_header__control').keyup(function() { $options.__preview(); });
			$('#text_font_monospace__control').keyup(function() { $options.__preview(); });
			
			$('#custom_css__control').keyup(function() { $options.__preview(); });

			
		//	keyboard shortcuts
		//	==================
			$('#keys_activation__control, #keys_clip__control').keydown(function (_event)
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
					case (_event.keyCode == 46):
					case (_event.keyCode == 8):
						$(this).val('');
						break;
				
					case (_key_code != 'NONE'):
						$(this).val(_key_combo);
						break;
				}
				
				//	stop
				_event.preventDefault();
				_event.stopPropagation();
			});

				
	//	buttons
	//	=======
	
		$('#button__save_general').click(function()
		{
			$('#button__save_general__spinner').show();
			window.setTimeout(function() { $('#button__save_general__spinner').hide(); }, 500);
			
			//	get
			var _to_save = $options.__values_get__general();
			
			//	save
			__save_someStuff(_to_save);
		});
		
		$('#button__save_custom').click(function()
		{
			//	check
			//	=====
				if ($options.__validate_options()); else { return; }
		
			//	include
			//	=======
				
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
	
	

		
			$('#button__save_custom__spinner').show();
			window.setTimeout(function() { $('#button__save_custom__spinner').hide(); }, 500);
			
			//	get
			var 
				_to_save = {},
				_custom_values = $options.__values_get__custom(),
				_custom_options_aggregate = ''
			;
				
			//	aggregate	
			for (var _option in _custom_values)
			{
				//	apply
				_to_save[_option] = _custom_values[_option];
				
				//	and save
				_custom_options_aggregate += ''
					+ '['
					+	'[='+_option+']'
					+	'[='+__encodeURIComponentForReadable(_custom_values[_option])+']'
					+ ']'
				;
			}
				
			//	save
			_to_save['theme'] = 'custom';
			_to_save['custom_theme_options'] = _custom_options_aggregate;
				
			__save_someStuff(_to_save);
		});
		
		$('#button__reset_custom').click(function()
		{
			$options.__values_put__custom__from_reset();
			$options.__preview();
		});
		
        
	//	tabs
	//	====
		$('#sidebar__menu__general').click(function() { $('body').removeClass('showCustom').addClass('showGeneral'); return false; });
		$('#sidebar__menu__custom').click(function() { $('body').removeClass('showGeneral').addClass('showCustom'); return false; });	

        $('#sidebar__licenses a').click(function() { $('body').addClass('showLicenses'); return false; });
        $('#licenses_overlay').click(function() { $('body').removeClass('showLicenses'); return false; });
    
    
	//	account
	//	=======
	
		$options.account__sign_out = function()
		{
			//	forget
			__forget_stored_evernote_credentials();

			//	wait
			$('#account__spinner').show();
			window.setTimeout(function()
			{
				$options.account__show_state();
				$('#account__spinner').hide();
			}, 500);
		};
	
		$options.account__show_state = function()
		{
			var 
				_storedLogin = __get_stored_evernote_credentials(),
				_result = ''
			;
			
            //  __escapeForHTML
            
    //  escapeForHTML
    //  =============
        function __escapeForHTML(_string)
        {
            var _replace = {
                "&": "amp", 
                '"': "quot", 
                "<": "lt", 
                ">": "gt"
            };
            
            return _string.replace(
                /[&"<>]/g,
                function (_match) { return ("&" + _replace[_match] + ";"); }
            );
        }

            
			//	which
			if (_storedLogin == false)
			{
				_result = ''
					+ '<div id="account__signed_out">'
					+   __escapeForHTML($options.__translations['account__signed_out'])
					+ '</div>'
				;
			}
			else
			{
				_result = ''
					+ __escapeForHTML($options.__translations['account__sign_out']).replace('[=username]', __escapeForHTML(_storedLogin.username))+' '
					+ '<a href="#" id="account__sign_out">'
					+ 	__escapeForHTML($options.__translations['account__sign_out_link'])
					+ '</a>'
					+ '<div class="saveSpinner" id="account__spinner"></div>'
				;
			}
			
			//	set
			$('#account__container').html(_result);
            
            //  set sign-out link
            $('#account__container #account__sign_out').click(function () { $options.account__sign_out(); return false; });
		};
	
		//	get state on load
		$options.account__show_state();
		
		
	//	custom buttons
	//	==============
	
		$('#button__more_options').click(function()
		{
			$('#view__custom__frameAndButtons__container').animate(
				{'top': '382px' },
				500,
				'readablePreviewFrameShow',
				function ()
				{
					$('#view__custom__miscSettings__container').fadeIn(500);
					$('#button__more_options').css({'display' : 'none'});
				}
			);
		});

		
	//	custom easing
	//	=============
	
		$.easing['readablePreviewFrameShow'] = function (x, t, b, c, d)
		{
			/* out cubic :: variation */
			var ts=(t/=d)*t;
			var tc=ts*t;
			return b+c*(-2.5*tc*ts + 10*ts*ts + -14*tc + 7*ts + 0.5*t);
		};

	
	//	preview
	
	$options.appliedOptions = {};
	$options.loadedGoogleFonts = {};

	$options.__validate_options = function ()
	{
		//	include defaults
		//	================
			
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
	
	

			
	//	__encodeURIComponentForReadable must be defined

	var __default_options = 
	{
		'text_font': 			__encodeURIComponentForReadable('"PT Serif"'),
		'text_font_header': 	__encodeURIComponentForReadable('"PT Serif"'),
		'text_font_monospace': 	__encodeURIComponentForReadable('Inconsolata'),
		'text_size': 			__encodeURIComponentForReadable('16px'),
		'text_line_height': 	__encodeURIComponentForReadable('1.5em'),
		'box_width': 			__encodeURIComponentForReadable('36em'),
		'color_background': 	__encodeURIComponentForReadable('#f3f2ee'),
		'color_text': 			__encodeURIComponentForReadable('#1f0909'),
		'color_links': 			__encodeURIComponentForReadable('#065588'),
		'text_align': 			__encodeURIComponentForReadable('normal'),
		'base': 				__encodeURIComponentForReadable('theme-1'),
		'footnote_links': 		__encodeURIComponentForReadable('on_print'),
		'large_graphics': 		__encodeURIComponentForReadable('do_nothing'),
		'custom_css': 			__encodeURIComponentForReadable(''
								+ '#text blockquote { border-color: #bababa; color: #656565; }'
								+ '#text thead { background-color: #dadada; }'
								+ '#text tr:nth-child(even) { background: #e8e7e7; }'
								)
	};


		//	list	
		var _validateOptionsList =
		[
			'text_font', 'text_font_header', 'text_font_monospace',
			'color_background', 'color_text', 'color_links',
			'text_size', 'box_width', 'text_line_height'
		];
			
		//	remove errors	
		$('#view__custom table.controlTable').removeClass('error');	
			
			
		//	add errors
		var 
			_hasError = false,
			_options = $options.__values_get__custom()
		;
		
		for (var i=0, _i=_validateOptionsList.length; i<_i; i++)
		{
			if (_options[_validateOptionsList[i]] == 'none')
			{
				_hasError = true;
				$('#'+_validateOptionsList[i]+'__controlTable').addClass('error');
			}
		}
		
		//	false
		if (_hasError) { return false; }

		//	true
		$options.options = _options;
		return true;
	};
	
	$options.__preview = function (_resetBase)
	{
		//	check and set .options
		if ($options.__validate_options()); else { return; }

		//	include defaults
		//	================
			
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
	
	

			
	//	__encodeURIComponentForReadable must be defined

	var __default_options = 
	{
		'text_font': 			__encodeURIComponentForReadable('"PT Serif"'),
		'text_font_header': 	__encodeURIComponentForReadable('"PT Serif"'),
		'text_font_monospace': 	__encodeURIComponentForReadable('Inconsolata'),
		'text_size': 			__encodeURIComponentForReadable('16px'),
		'text_line_height': 	__encodeURIComponentForReadable('1.5em'),
		'box_width': 			__encodeURIComponentForReadable('36em'),
		'color_background': 	__encodeURIComponentForReadable('#f3f2ee'),
		'color_text': 			__encodeURIComponentForReadable('#1f0909'),
		'color_links': 			__encodeURIComponentForReadable('#065588'),
		'text_align': 			__encodeURIComponentForReadable('normal'),
		'base': 				__encodeURIComponentForReadable('theme-1'),
		'footnote_links': 		__encodeURIComponentForReadable('on_print'),
		'large_graphics': 		__encodeURIComponentForReadable('do_nothing'),
		'custom_css': 			__encodeURIComponentForReadable(''
								+ '#text blockquote { border-color: #bababa; color: #656565; }'
								+ '#text thead { background-color: #dadada; }'
								+ '#text tr:nth-child(even) { background: #e8e7e7; }'
								)
	};


		//	what to do
		//	==========
		
			var 
				_resetOptions = false, 
				_resetBase = false,
				_optionsToApply = {}
			;

			//	set _resetBase
			switch (true)
			{
				case (!('base' in  $options.appliedOptions)):
				case (!($options.options['base'] == $options.appliedOptions['base'])):
					_resetBase = true;
					break;
			}
		
			//	set _resetOptions
			for (var _option in __default_options)
			{
				switch (true)
				{
					case (!(_option in $options.appliedOptions)):
					case (!($options.options[_option] == $options.appliedOptions[_option])):
						_resetOptions = true;
						break;
				}
				
				//	stop
				if (_resetOptions) { break; }
			}	
		
		//	set appliedOptions
		//	set optionToApply
		//	=================
			for (var _option in __default_options)
			{
				$options.appliedOptions[_option] = $options.options[_option];
				_optionsToApply[_option] = __decodeURIComponentForReadable($options.options[_option]);
			}

			
		//	apply base
		//	==========
			if (_resetBase)
			{
				//	remove old
				$($options.__preview_document).find('#baseCSS').remove();
				
				//	add new
				if (_optionsToApply['base'] > '')
				{
					$($options.__preview_document).find('head').append(''
						+ '<link id="baseCSS" href="'
						+ $options.__path_main + 'css/' + $options.versioning['file_name_base--'+_optionsToApply['base']+'_css']
						+ '" rel="stylesheet" type="text/css" />'
					);
				}
			}
		
		//	apply options
		//	=============
			
			//	finish, if not resetting options
			if (_resetOptions); else { return; }

			//	google fonts
			//	============

				//	get
				
	function __options__get_google_fonts (_options)
	{
		
	var 
		__google_fonts_index = {},
		__google_fonts_array =
		[
			'Arvo',
			'Bentham',
			'Cardo',
			'Copse',
			'Corben',
			'Crimson Text',
			'Droid Serif',
			'Goudy Bookletter 1911',
			'Gruppo',
			'IM Fell',
			'Josefin Slab',
			'Kreon',
			'Meddon',
			'Merriweather',
			'Neuton',
			'OFL Sorts Mill Goudy TT',
			'Old Standard TT',
			'Philosopher',
			'PT Serif',
			'Radley',
			'Tinos',
			'Vollkorn',
			
			'Allerta',
			'Anton',
			'Arimo',
			'Bevan',
			'Buda',
			'Cabin',
			'Cantarell',
			'Coda',
			'Cuprum',
			'Droid Sans',
			'Geo',
			'Josefin Sans',
			'Lato',
			'Lekton',
			'Molengo',
			'Nobile',
			'Orbitron',
			'PT Sans',
			'Puritan',
			'Raleway',
			'Syncopate',
			'Ubuntu',
			'Yanone Kaffeesatz',
			
			'Anonymous Pro',
			'Cousine',
			'Droid Sans Mono',
			'Inconsolata'
		];

	//	create index
	for (var i=0, ii=__google_fonts_array.length; i<ii; i++){
		__google_fonts_index[__google_fonts_array[i]] = 1;
	}

		
		var 
			_fonts = {},
			_fonts_urls = [],
			_check_font = function (_match, _font)
				{ if (_font in __google_fonts_index) { _fonts[_font] = 1; } }
		;
		
		//	body
		//	====
			_options['text_font'].replace(/"([^",]+)"/gi, _check_font);
			_options['text_font'].replace(/([^",\s]+)/gi, _check_font);				
		
		//	headers
		//	=======
			_options['text_font_header'].replace(/"([^",]+)"/gi, _check_font);
			_options['text_font_header'].replace(/([^",\s]+)/gi, _check_font);				
		
		//	monospace
		//	=========
			_options['text_font_monospace'].replace(/"([^",]+)"/gi, _check_font);
			_options['text_font_monospace'].replace(/([^",\s]+)/gi, _check_font);				

		//	custom css
		//	==========
			_options['custom_css'].replace(/font-family: "([^",]+)"/gi, _check_font);
			_options['custom_css'].replace(/font-family: ([^",\s]+)/gi, _check_font);
	
	
		//	return
		//	======
		
			//	transform to array
			for (var _font in _fonts)
			{
				_fonts_urls.push(''
					+ 'http://fonts.googleapis.com/css?family='
					+ _font.replace(/\s+/g, '+')
					+ ':regular,bold,italic'
				);
			}
		
			//	return
			return _fonts_urls;
	}

				var _fonts_urls = __options__get_google_fonts(_optionsToApply);

				//	apply
				for (var i=0,_i=_fonts_urls.length; i<_i; i++)
				{
					//	loaded?
					if ($options.loadedGoogleFonts[_fonts_urls[i]]) { continue; }
					
					//	load
					$($options.__preview_document).find('head').append('<link href="'+_fonts_urls[i]+'" rel="stylesheet" type="text/css" />');
				
					//	mark
					$options.loadedGoogleFonts[_fonts_urls[i]] = 1;
				}
			
				
			//	the css
			//	=======
				
	function __options__get_css (_options)
	{
		var _cssText = (''
		+	'#body { '
		+		'font-family: [=text_font]; '
		+		'font-size: [=text_size]; '
		+		'line-height: [=text_line_height]; '
		+		'color: [=color_text]; '
		+		'text-align: '+(_options['text_align'] == 'justified' ? 'justify' : 'left')+'; '
		+	'} '
		
		+	'#background { background-color: [=color_background]; } '
		
		+	'.setTextColorAsBackgroundColor { background-color: [=color_text]; } '
		+	'.setBackgroundColorAsTextColor { color: [=color_background]; } '
		
		+	'#box, .setBoxWidth { width: [=box_width]; } '
		
		+	'a { color: [=color_links]; } '
		+	'a:visited { color: [=color_text]; } '

		+	'@media print { body.footnote_links__on_print a, body.footnote_links__on_print a:hover { color: [=color_text] !important; text-decoration: none !important; } } '
		+	'body.footnote_links__always a, body.footnote_links__always a:hover { color: [=color_text] !important; text-decoration: none !important; } '
		
		+	'img { border-color: [=color_text]; } '
		+	'a img { border-color: [=color_links]; } '
		+	'a:visited img { border-color: [=color_text]; } '

		+	'h1 a, h2 a, a h1, a h2 { color: [=color_text]; } '
		+	'h1, h2, h3, h4, h5, h6 { font-family: [=text_font_header]; } '

		+	'pre { background-color: [=color_background]; } '
		+	'pre, code { font-family: [=text_font_monospace]; } '
		+	'hr { border-color: [=color_text]; } '

		+	'#rtl_box { background-color: [=color_text]; color: [=color_background]; } '
		+	'#rtl_box a { color: [=color_background]; } '

		+	'html.rtl #body #text { text-align: ' + (_options['text_align'] == 'justified' ? 'justify' : 'right')+' !important; } '
		+	'h1, h2, h3, h4, h5, h6 { text-align: left; } '
		+	'html.rtl h1, html.rtl h2, html.rtl h3, html.rtl h4, html.rtl h5, html.rtl h6 { text-align: right !important; } '

		+	'[=custom_css] '
		).replace(
			/\[=([a-z_]+?)\]/gi,
			function (_match, _key) { return _options[_key]; }
		);
		
		return _cssText;
	}
				var _cssText = __options__get_css(_optionsToApply);
			
				//	remove old
				//	==========
					$($options.__preview_document).find('#optionsCSS').remove();
				
				//	new
				//	===
					var _cssElement = document.createElement('style');
						_cssElement.setAttribute('type', 'text/css');
						_cssElement.setAttribute('id', 'optionsCSS');
						
					if (_cssElement.styleSheet) { _cssElement.styleSheet.cssText = _cssText; }
						else { _cssElement.appendChild(document.createTextNode(_cssText)); }
				

					$($options.__preview_document).find('head').append(_cssElement);
					
					
			//	the colors
			//	==========
				$($('#color_background__control').get(0).parentNode).find('a').css({'background-color': _optionsToApply['color_background']});
				$($('#color_text__control').get(0).parentNode).find('a').css({'background-color': _optionsToApply['color_text']});
				$($('#color_links__control').get(0).parentNode).find('a').css({'background-color': _optionsToApply['color_links']});
	};

	
	//	show custom theme
	if (window.location.hash == '#showCustom')
		{ $('body').removeClass('showGeneral').addClass('showCustom'); }
	

	//	write preview frame
	window.setTimeout(function ()
	{
		$options.__preview_document = $('#preview_frame iframe').contents().get(0);
		
		var _iframeHTML = ''
			+	'<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"'
			+		' "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">'
			+	'<html id="html" xmlns="http://www.w3.org/1999/xhtml">'
			+	'<head>'
			+		'<style type="text/css">'
			+			'#background	{ position: fixed; top: 0; left: 0;	width: 100%; height: 100%; }'
			+			'#box 			{ padding-left: 2em; padding-right: 2em; margin-left: auto; margin-right: auto; position: relative; }'
			+			'#box_inner 	{ position: relative; }'
			+			'#text 			{ padding-top: 1em; }'
			+			'#background 	{ z-index: 10; }'
			+			'#box 			{ z-index: 20; }'
			+		'</style>'
			+	'</head>'
			+	'<body id="body">'
			+		'<div id="bodyContent">'
			+			'<div id="box">'
			+				'<div id="box_inner">'
			+					'<div id="text">'
			+						$('#preview_frame_contents').html()
			+					'</div>'
			+				'</div>'
			+			'</div>'
			+			'<div id="background"></div>'
			+		'</div>'
			+	'</body>'
			+	'</html>'
		;
	
		$options.__preview_document.open();
		$options.__preview_document.write(_iframeHTML);
		$options.__preview_document.close();

		//	wait again
		window.setTimeout(function ()
		{
			$options.__preview_document = $('#preview_frame iframe').contents().get(0);
			$options.__preview(true);
		}, 
		500);
	}, 
	250);

