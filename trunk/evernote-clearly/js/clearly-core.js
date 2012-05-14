// measure text
// asian languages
// http://msdn.microsoft.com/en-us/goglobal/bb688158
// http://en.wikipedia.org/wiki/Japanese_punctuation
// http://en.wikipedia.org/wiki/Japanese_typographic_symbols
// http://unicode.org/charts/PDF/U3000.pdf
// CJK: Chnese, Japanese, Korean -- HAN character set
// length
$R.measureText__getTextLength = function (_the_text) {
	var _text = _the_text;
	_text = _text.replace(/[\s\n\r]+/gi, '');
	//_text = _text.replace(/\d+/, '');
	return _text.length;
};

// word count
$R.measureText__getWordCount = function (_the_text) {
	var _text = _the_text;

	// do stuff
	_text = _text.replace(/[\s\n\r]+/gi, ' ');
	_text = _text.replace(/([.,?!:;()\[\]'""-])/gi, ' $1 ');
	_text = _text.replace(/([\u3000])/gi, '[=words(1)]');
	_text = _text.replace(/([\u3001])/gi, '[=words(2)]');
	_text = _text.replace(/([\u3002])/gi, '[=words(4)]');
	_text = _text.replace(/([\u301C])/gi, '[=words(2)]');
	_text = _text.replace(/([\u2026|\u2025])/gi, '[=words(2)]');
	_text = _text.replace(/([\u30FB\uFF65])/gi, '[=words(1)]');
	_text = _text.replace(/([\u300C\u300D])/gi, '[=words(1)]');
	_text = _text.replace(/([\u300E\u300F])/gi, '[=words(1)]');
	_text = _text.replace(/([\u3014\u3015])/gi, '[=words(1)]');
	_text = _text.replace(/([\u3008\u3009])/gi, '[=words(1)]');
	_text = _text.replace(/([\u300A\u300B])/gi, '[=words(1)]');
	_text = _text.replace(/([\u3010\u3011])/gi, '[=words(1)]');
	_text = _text.replace(/([\u3016\u3017])/gi, '[=words(1)]');
	_text = _text.replace(/([\u3018\u3019])/gi, '[=words(1)]');
	_text = _text.replace(/([\u301A\u301B])/gi, '[=words(1)]');
	_text = _text.replace(/([\u301D\u301E\u301F])/gi, '[=words(1)]');
	_text = _text.replace(/([\u30A0])/gi, '[=words(1)]');

	// count
	var _count = 0, _words_match = _text.match(/([^\s\d]{3,})/gi);

	// add match
	_count += (_words_match != null ? _words_match.length : 0);

	// add manual count
	_text.replace(/\[=words\((\d)\)\]/, function (_match, _plus) {
		_count += (5 * parseInt(_plus));
	});

	return _count;
};

// content
$R.footnotedLinksCount = 0;
$R.getContent = function () {
	// homepage?
	if ($R.win.location.href == ($R.win.location.protocol + '//' + $R.win.location.host + '/')) {
		$('html').addClass('showTips');
	}

	// selection or whole
	switch (true) {
	case ($R.getContent__manualSelection()):
	case ($R.getContent__find()):
		break;
	default:
		break;
	}

	// debug
	$R.printDebugOutput();

	// show content
	$R.showContent();
};

// options
$R.parsingOptions = {
	'_elements_ignore': '|button|input|select|textarea|optgroup|command|datalist|--|frame|frameset|noframes|--|style|link|script|noscript|--|canvas|applet|map|--|marquee|area|base|',
	'_elements_ignore_tag': '|form|fieldset|details|dir|--|center|font|span|',
	'_elements_self_closing': '|br|hr|--|img|--|col|--|source|--|embed|param|--|iframe|',
	'_elements_visible': '|article|section|--|ul|ol|li|dd|--|table|tr|td|--|div|--|p|--|h1|h2|h3|h4|h5|h6|--|span|',
	'_elements_too_much_content': '|b|i|em|strong|--|h1|h2|h3|h4|h5|--|td|',
	'_elements_container': '|body|--|article|section|--|div|--|td|--|li|--|dd|dt|',
	'_elements_link_density': '|div|--|table|ul|ol|--|section|aside|header|',
	'_elements_floating': '|div|--|table|',
	'_elements_above_target': '|br|--|ul|ol|dl|',
	'_elements_keep_attributes': {
		'a': ['href', 'title', 'name'],
		'img': ['src', 'width', 'height', 'alt', 'title'],
		'video': ['src', 'width', 'height', 'poster', 'audio', 'preload', 'autoplay', 'loop', 'controls'],
		'audio': ['src', 'preload', 'autoplay', 'loop', 'controls'],
		'source': ['src', 'type'],
		'object': ['data', 'type', 'width', 'height', 'classid', 'codebase', 'codetype'],
		'param': ['name', 'value'],
		'embed': ['src', 'type', 'width', 'height', 'flashvars', 'allowscriptaccess', 'allowfullscreen', 'bgcolor'],
		'iframe': ['src', 'width', 'height', 'frameborder', 'scrolling'],
		'td': ['colspan', 'rowspan'],
		'th': ['colspan', 'rowspan']
	}
};

// next page keywords -- (?? charCodeAt() > 127)
$R.nextPage__captionKeywords = [
	/* english */ 'next page', 'next',
	/* german */ 'vorw&#228;rts', 'weiter',
	/* japanese */ '&#27425;&#12408;'];

$R.nextPage__captionKeywords__not = [
	/* english */ 'article', 'story', 'post', 'comment', 'section', 'chapter'
];

// skip links
$R.skipStuffFromDomains__links = [
	'doubleclick.net',
	'fastclick.net',
	'adbrite.com',
	'adbureau.net',
	'admob.com',
	'bannersxchange.com',
	'buysellads.com',
	'impact-ad.jp',
	'atdmt.com',
	'advertising.com',
	'itmedia.jp',
	'microad.jp',
	'serving-sys.com',
	'adplan-ds.com'
];

// skip images
$R.skipStuffFromDomain__images = [
	'googlesyndication.com',
	'fastclick.net',
	'.2mdn.net',
	'de17a.com',
	'content.aimatch.com',
	'bannersxchange.com',
	'buysellads.com',
	'impact-ad.jp',
	'atdmt.com',
	'advertising.com',
	'itmedia.jp',
	'microad.jp',
	'serving-sys.com',
	'adplan-ds.com'
];

// keep video
$R.keepStuffFromDomain__video = [
	'youtube.com',
	'youtube-nocookie.com',
	'vimeo.com',
	'hulu.com',
	'yahoo.com',
	'flickr.com',
	'newsnetz.ch'
];

$R.getContent__exploreNodeAndGetStuff = function (_nodeToExplore, _justExploring) {
	var _global__element_index = 0,
		_global__inside_link = false,
		_global__inside_link__element_index = 0,
		_global__length__above_plain_text = 0,
		_global__count__above_plain_words = 0,
		_global__length__above_links_text = 0,
		_global__count__above_links_words = 0,
		_global__count__above_candidates = 0,
		_global__count__above_containers = 0,
		_global__above__plain_text = '',
		_global__above__links_text = '',
		_return__containers = [],
		_return__candidates = [],
		_return__links = [];

	// recursive function
	var _recursive = function (_node) {
		// increment index
		// starts with 1
		_global__element_index++;
		var _tag_name = (_node.nodeType === 3 ? '#text' : ((_node.nodeType === 1 && _node.tagName && _node.tagName > '') ? _node.tagName.toLowerCase() : '#invalid')),
			_result = {
				'__index': _global__element_index,
				'__node': _node,

				'_is__container': ($R.parsingOptions._elements_container.indexOf('|' + _tag_name + '|') > -1),
				'_is__candidate': false,
				'_is__text': false,
				'_is__link': false,
				'_is__link_skip': false,
				'_is__image_small': false,
				'_is__image_medium': false,
				'_is__image_large': false,
				'_is__image_skip': false,
				'_debug__above__plain_text': _global__above__plain_text,
				'_debug__above__links_text': _global__above__links_text,

				'_length__above_plain_text': _global__length__above_plain_text,
				'_count__above_plain_words': _global__count__above_plain_words,
				'_length__above_links_text': _global__length__above_links_text,
				'_count__above_links_words': _global__count__above_links_words,
				'_length__above_all_text': (_global__length__above_plain_text + _global__length__above_links_text),
				'_count__above_all_words': (_global__count__above_plain_words + _global__count__above_links_words),
				'_count__above_candidates': _global__count__above_candidates,
				'_count__above_containers': _global__count__above_containers,
				'_length__plain_text': 0,
				'_count__plain_words': 0,
				'_length__links_text': 0,
				'_count__links_words': 0,
				'_length__all_text': 0,
				'_count__all_words': 0,

				'_count__containers': 0,
				'_count__candidates': 0,
				'_count__links': 0,
				'_count__links_skip': 0,
				'_count__images_small': 0,
				'_count__images_medium': 0,
				'_count__images_large': 0,
				'_count__images_skip': 0
			};

		// fast return
		switch (true) {
		case ((_tag_name == '#invalid')):
		case (($R.parsingOptions._elements_ignore.indexOf('|' + _tag_name + '|') > -1)):
			return;
		case (($R.parsingOptions._elements_visible.indexOf('|' + _tag_name + '|') > -1)):
			// included inline
			// _node must be defined
			// will return, if node is hidden
			switch (true) {
			case (_node.offsetWidth > 0):
			case (_node.offsetHeight > 0):
				break;
			default:
				switch (true) {
				case (_node.offsetLeft > 0):
				case (_node.offsetTop > 0):
					break;
				default:
					return;
				}
				break;
			}
			break;
			// self-closing -- with some exceptions
		case ($R.parsingOptions._elements_self_closing.indexOf('|' + _tag_name + '|') > -1):
			switch (true) {
			case ((_tag_name == 'img')):
				break;
			default:
				return;
			}
			break;
		}

		// do stuff
		switch (true) {
			// text node
			case ((_tag_name == '#text')):
				// mark
				_result._is__text = true;
				// get
				var _nodeText = _node.nodeValue;
				// result
				_result._length__plain_text = $R.measureText__getTextLength(_nodeText);
				_result._count__plain_words = $R.measureText__getWordCount(_nodeText);
				if (_global__inside_link) {
					_global__length__above_links_text += _result._length__plain_text;
					_global__count__above_links_words += _result._count__plain_words;
					if (false && $R.debug) {
						_global__above__links_text += ' ' + _nodeText;
					}
				}
				else {
					_global__length__above_plain_text += _result._length__plain_text;
					_global__count__above_plain_words += _result._count__plain_words;
					if (false && $R.debug) {
						_global__above__plain_text += ' ' + _nodeText;
					}
				}
				// return text
				return _result;

			// link
			case (_tag_name == 'a'):
				var _href = _node.href;
				// sanity
				if (_href > '');
				else {
					break;
				}
				if (_href.indexOf);
				else {
					break;
				}
				_result._is__link = true;
				// skip
				for (var i = 0, _i = $R.skipStuffFromDomains__links.length; i < _i; i++) {
					if (_node.href.indexOf($R.skipStuffFromDomains__links[i]) > -1) {
						_result._is__link_skip = true;
						break;
					}
				}
				// inside link
				if (_global__inside_link);
				else {
					_global__inside_link = true;
					_global__inside_link__element_index = _result.__index;
				}
				// done
				_return__links.push(_result);
				break;

			// image
			case (_tag_name == 'img'):
				// skip
				if (_node.src && _node.src.indexOf) {
					for (var i = 0, _i = $R.skipStuffFromDomain__images.length; i < _i; i++) {
						if (_node.src.indexOf($R.skipStuffFromDomain__images[i]) > -1) {
							_result._is__image_skip = true;
							break;
						}
					}
				}
				// size
				var _width = $(_node).width(),
					_height = $(_node).height();
				switch (true) {
				case ((_width * _height) >= 50000):
				case ((_width >= 350) && _height >= 75):
					_result._is__image_large = true;
					break;
				case ((_width * _height) >= 20000):
				case ((_width >= 150) && (_height >= 150)):
					_result._is__image_medium = true;
					break;
				case ((_width <= 5) && (_height <= 5)):
					_result._is__image_skip = true;
					break;
				default:
					_result._is__image_small = true;
					break;
				}
				break;
		}

		// child nodes
		for (var i = 0, _i = _node.childNodes.length; i < _i; i++) {
			var _child = _node.childNodes[i],
				_child_result = _recursive(_child);

			// if false, continue
			if (_child_result);
			else {
				continue;
			}

			// add to result
			_result._count__links += _child_result._count__links + (_child_result._is__link ? 1 : 0);
			_result._count__links_skip += _child_result._count__links_skip + (_child_result._is__link_skip ? 1 : 0);
			_result._count__images_small += _child_result._count__images_small + (_child_result._is__image_small ? 1 : 0);
			_result._count__images_medium += _child_result._count__images_medium + (_child_result._is__image_medium ? 1 : 0);
			_result._count__images_large += _child_result._count__images_large + (_child_result._is__image_large ? 1 : 0);
			_result._count__images_skip += _child_result._count__images_skip + (_child_result._is__image_skip ? 1 : 0);
			_result._count__containers += _child_result._count__containers + (_child_result._is__container ? 1 : 0);
			_result._count__candidates += _child_result._count__candidates + (_child_result._is__candidate ? 1 : 0);
			_result._length__all_text += _child_result._length__plain_text + _child_result._length__links_text;
			_result._count__all_words += _child_result._count__plain_words + _child_result._count__links_words;

			// plain text / link text
			switch (true) {
				case (_child_result._is__link):
					// no text to add
					_result._length__links_text += (_child_result._length__plain_text + _child_result._length__links_text);
					_result._count__links_words += (_child_result._count__plain_words + _child_result._count__links_words);
					break;
				default:
					_result._length__plain_text += _child_result._length__plain_text;
					_result._count__plain_words += _child_result._count__plain_words;
					_result._length__links_text += _child_result._length__links_text;
					_result._count__links_words += _child_result._count__links_words;
					break;
			}
		}

		// after child nodes

		// mark as not in link anymore
		if (true && (_result._is__link) && (_global__inside_link__element_index == _result.__index)) {
			_global__inside_link = false;
			_global__inside_link__element_index = 0;
		}

		// add to containers
		if (_result._is__container || ((_result.__index == 1) && (_justExploring == true))) {
			// add to containers
			_return__containers.push(_result);

			//  increase above containers
			if (_result._is__container) {
				_global__count__above_containers++;
			}

			// add to candidates
			if (_justExploring);
			else {
				switch (true) {
					case (($R.language != 'cjk') && ((_result._count__links * 2) >= _result._count__plain_words)):
						/* link ratio */
					case (($R.language != 'cjk') && (_result._length__plain_text < (65 / 3))):
						/* text length */
					case (($R.language != 'cjk') && (_result._count__plain_words < 5)):
						/* words */
					case (($R.language == 'cjk') && (_result._length__plain_text < 10)):
						/* text length */
					case (($R.language == 'cjk') && (_result._count__plain_words < 2)):
						break;
					default:
						// good candidate
						_result._is__candidate = true;
						_return__candidates.push(_result);
						//  increase above candidates
						_global__count__above_candidates++;
						break;
				}

				// special case for body -- if it was just skipped
				if ((_result.__index == 1) && !(_result._is__candidate)) {
					_result._is__candidate = true;
					_result._is__bad = true;
					_return__candidates.push(_result);
				}
			}
		}

		return _result;
	};

	// actually do it
	_recursive(_nodeToExplore);

	// just exploring -- return first thing
	if (_justExploring) {
		return _return__containers.pop();
	}

	// return containers list
	return {
		'_containers': _return__containers,
		'_candidates': _return__candidates,
		'_links': _return__links
	};
};

$R.getContent__processCandidates = function (_candidatesToProcess) {
	// process this var
	var _candidates = _candidatesToProcess;

	// sort _candidates -- the lower in the dom, the closer to position 0
	_candidates.sort(function (a, b) {
		switch (true) {
		case (a.__index < b.__index):
			return -1;
		case (a.__index > b.__index):
			return 1;
		default:
			return 0;
		}
	});

	// get first
	var _main = _candidates[0]
	if ($R.debug) {
		$R.log('should be body', _main, _main.__node);
	}

	// pieces of text
	// and points computation
	for (var i = 0, _i = _candidates.length; i < _i; i++) {
		// pieces
		var _count__pieces = 0, _array__pieces = [];
		for (var k = i, _k = _candidates.length; k < _k; k++) {
			if (_candidates[k]._count__candidates > 0) {
				continue;
			}
			if ($.contains(_candidates[i].__node, _candidates[k].__node));
			else {
				continue;
			}
			// store piece, if in debug mode
			if ($R.debug) {
				_array__pieces.push(_candidates[k]);
			}
			// incement pieces count
			_count__pieces++;
		}

		// candidate details
		_candidates[i]['__candidate_details'] = $R.getContent__computeDetailsForCandidate(_candidates[i], _main);

		// pieces -- do this here because _main doesn't yet have a pieces count
		// set pieces
		_candidates[i]['_count__pieces'] = _count__pieces;
		_candidates[i]['_array__pieces'] = _array__pieces;
		// pieces ratio
		_candidates[i]['__candidate_details']['_ratio__count__pieces_to_total_pieces'] = (_count__pieces / (_candidates[0]._count__pieces + 1));

		// points
		_candidates[i].__points_history = $R.getContent__computePointsForCandidate(_candidates[i], _main);
		_candidates[i].__points = _candidates[i].__points_history[0];
	}

	// sort _candidates -- the more points, the closer to position 0
	_candidates.sort(function (a, b) {
		switch (true) {
		case (a.__points > b.__points):
			return -1;
		case (a.__points < b.__points):
			return 1;
		default:
			return 0;
		}
	});

	// return
	return _candidates;
};

$R.getContent__computeDetailsForCandidate = function (_e, _main) {
	var _r = {};

	// bad candidate
	if (_e._is__bad) {
		return _r;
	}

	// paragraphs
	_r['_count__lines_of_65_characters'] = (_e._length__plain_text / 65);
	_r['_count__paragraphs_of_3_lines'] = (_r._count__lines_of_65_characters / 3);
	_r['_count__paragraphs_of_5_lines'] = (_r._count__lines_of_65_characters / 5);
	_r['_count__paragraphs_of_50_words'] = (_e._count__plain_words / 50);
	_r['_count__paragraphs_of_80_words'] = (_e._count__plain_words / 80);

	// total text
	_r['_ratio__length__plain_text_to_total_plain_text'] = (_e._length__plain_text / _main._length__plain_text);
	_r['_ratio__count__plain_words_to_total_plain_words'] = (_e._count__plain_words / _main._count__plain_words);

	// links
	_r['_ratio__length__links_text_to_plain_text'] = (_e._length__links_text / _e._length__plain_text);
	_r['_ratio__count__links_words_to_plain_words'] = (_e._count__links_words / _e._count__plain_words);
	_r['_ratio__length__links_text_to_all_text'] = (_e._length__links_text / _e._length__all_text);
	_r['_ratio__count__links_words_to_all_words'] = (_e._count__links_words / _e._count__all_words);
	_r['_ratio__length__links_text_to_total_links_text'] = (_e._length__links_text / (_main._length__links_text + 1));
	_r['_ratio__count__links_words_to_total_links_words'] = (_e._count__links_words / (_main._count__links_words + 1));
	_r['_ratio__count__links_to_total_links'] = (_e._count__links / (_main._count__links + 1));
	_r['_ratio__count__links_to_plain_words'] = ((_e._count__links * 2) / _e._count__plain_words);

	// text above
	var
	_divide__candidates = Math.max(2, Math.ceil(_e._count__above_candidates * 0.5)),
		_above_text = ((0 + (_e._length__above_plain_text * 1) + (_e._length__above_plain_text / _divide__candidates)) / 2),
		_above_words = ((0 + (_e._count__above_plain_words * 1) + (_e._count__above_plain_words / _divide__candidates)) / 2);
	_r['_ratio__length__above_plain_text_to_total_plain_text'] = (_above_text / _main._length__plain_text);
	_r['_ratio__count__above_plain_words_to_total_plain_words'] = (_above_words / _main._count__plain_words);

	// candidates
	_r['_ratio__count__candidates_to_total_candidates'] = (_e._count__candidates / (_main._count__candidates + 1));
	_r['_ratio__count__containers_to_total_containers'] = (_e._count__containers / (_main._count__containers + 1));

	// return
	return _r;
};

$R.getContent__computePointsForCandidate = function (_e, _main) {
	var
	_details = _e.__candidate_details,
		_points_history = [],
		_really_big = ((_main._length__plain_text / 65) > 250);
	// bad candidate
	if (_e._is__bad) {
		return [0];
	}

	// the basics
	_points_history.unshift(((0 + (_details._count__paragraphs_of_3_lines) + (_details._count__paragraphs_of_5_lines * 1.5) + (_details._count__paragraphs_of_50_words) + (_details._count__paragraphs_of_80_words * 1.5) + (_e._count__images_large * 3) - ((_e._count__images_skip + _e._count__images_small) * 0.5)) * 1000));
	//  negative
	if (_points_history[0] < 0) {
		return [0];
	}

	//  candidates and containers
	var
	_divide__pieces = Math.max(5, Math.ceil(_e._count__pieces * 0.25)),
		_divide__candidates = Math.max(5, Math.ceil(_e._count__candidates * 0.25)),
		_divide__containers = Math.max(10, Math.ceil(_e._count__containers * 0.25));
	_points_history.unshift(((0 + (_points_history[0] * 3) + (_points_history[0] / _divide__pieces) + (_points_history[0] / _divide__candidates) + (_points_history[0] / _divide__containers)) / 6));

	// total text
	$R.getContent__computePointsForCandidate__do(0.10, 2, (1 - (1 - _details._ratio__length__plain_text_to_total_plain_text)), _points_history);
	$R.getContent__computePointsForCandidate__do(0.10, 2, (1 - (1 - _details._ratio__count__plain_words_to_total_plain_words)), _points_history);
	if (_really_big) {
		$R.getContent__computePointsForCandidate__do(0.10, 4, (1 - (1 - _details._ratio__length__plain_text_to_total_plain_text)), _points_history);
		$R.getContent__computePointsForCandidate__do(0.10, 4, (1 - (1 - _details._ratio__count__plain_words_to_total_plain_words)), _points_history);
	}

	// text above
	$R.getContent__computePointsForCandidate__do(0.10, 5, (1 - _details._ratio__length__above_plain_text_to_total_plain_text), _points_history);
	$R.getContent__computePointsForCandidate__do(0.10, 5, (1 - _details._ratio__count__above_plain_words_to_total_plain_words), _points_history);
	if (_really_big) {
		$R.getContent__computePointsForCandidate__do(0.10, 10, (1 - _details._ratio__length__above_plain_text_to_total_plain_text), _points_history);
		$R.getContent__computePointsForCandidate__do(0.10, 10, (1 - _details._ratio__count__above_plain_words_to_total_plain_words), _points_history);
	}

	// links outer
	$R.getContent__computePointsForCandidate__do(0.75, 1, (1 - _details._ratio__length__links_text_to_total_links_text), _points_history);
	$R.getContent__computePointsForCandidate__do(0.75, 1, (1 - _details._ratio__count__links_words_to_total_links_words), _points_history);
	$R.getContent__computePointsForCandidate__do(0.75, 1, (1 - _details._ratio__count__links_to_total_links), _points_history);

	//  links inner
	var __lr = ($R.language == 'cjk' ? 0.75 : 0.50);
	$R.getContent__computePointsForCandidate__do(__lr, 1, (1 - _details._ratio__length__links_text_to_plain_text), _points_history);
	$R.getContent__computePointsForCandidate__do(__lr, 1, (1 - _details._ratio__count__links_words_to_plain_words), _points_history);
	$R.getContent__computePointsForCandidate__do(__lr, 1, (1 - _details._ratio__length__links_text_to_all_text), _points_history);
	$R.getContent__computePointsForCandidate__do(__lr, 1, (1 - _details._ratio__count__links_words_to_all_words), _points_history);
	$R.getContent__computePointsForCandidate__do(__lr, 1, (1 - _details._ratio__count__links_to_plain_words), _points_history);

	// candidates, pieces
	$R.getContent__computePointsForCandidate__do(0.75, 1, (1 - _details._ratio__count__candidates_to_total_candidates), _points_history);
	$R.getContent__computePointsForCandidate__do(0.75, 1, (1 - _details._ratio__count__containers_to_total_containers), _points_history);
	$R.getContent__computePointsForCandidate__do(0.75, 1, (1 - _details._ratio__count__pieces_to_total_pieces), _points_history);

	// return -- will get [0] as the actual final points
	return _points_history;
};

$R.getContent__processCandidatesSecond = function (_processedCandidates) {
	var
	_candidates = _processedCandidates,
		_main = _candidates[0];
	// only get children of target
	_candidates = $.map(_candidates, function (_element, _index) {
		switch (true) {
		case (!(_index > 0)):
		case (!($.contains(_main.__node, _element.__node))):
			return null;
		default:
			return _element;
		}
	});
	//  add main - to amke sure the result is never blank
	_candidates.unshift(_main);

	// sort _candidates -- the lower in the dom, the closer to position 0
	_candidates.sort(function (a, b) {
		switch (true) {
		case (a.__index < b.__index):
			return -1;
		case (a.__index > b.__index):
			return 1;
		default:
			return 0;
		}
	});

	// second candidate computation
	for (var i = 0, _i = _candidates.length; i < _i; i++) {
		// additional numbers
		_candidates[i].__second_length__above_plain_text = (_candidates[i]._length__above_plain_text - _main._length__above_plain_text);
		_candidates[i].__second_count__above_plain_words = (_candidates[i]._count__above_plain_words - _main._count__above_plain_words);
		// candidate details
		_candidates[i]['__candidate_details_second'] = $R.getContent__computeDetailsForCandidateSecond(_candidates[i], _main);
		// check some more

		// points
		_candidates[i].__points_history_second = $R.getContent__computePointsForCandidateSecond(_candidates[i], _main);
		_candidates[i].__points_second = _candidates[i].__points_history_second[0];
	}

	// sort _candidates -- the more points, the closer to position 0
	_candidates.sort(function (a, b) {
		switch (true) {
		case (a.__points_second > b.__points_second):
			return -1;
		case (a.__points_second < b.__points_second):
			return 1;
		default:
			return 0;
		}
	});

	// return
	return _candidates;
};

$R.getContent__computeDetailsForCandidateSecond = function (_e, _main) {
	var _r = {};

	// bad candidate
	if (_e._is__bad) {
		return _r;
	}

	// total text
	_r['_ratio__length__plain_text_to_total_plain_text'] = (_e._length__plain_text / _main._length__plain_text);
	_r['_ratio__count__plain_words_to_total_plain_words'] = (_e._count__plain_words / _main._count__plain_words);

	// links
	_r['_ratio__length__links_text_to_all_text'] = (_e._length__links_text / _e._length__all_text);
	_r['_ratio__count__links_words_to_all_words'] = (_e._count__links_words / _e._count__all_words);
	_r['_ratio__length__links_text_to_total_links_text'] = (_e._length__links_text / (_main._length__links_text + 1));
	_r['_ratio__count__links_words_to_total_links_words'] = (_e._count__links_words / (_main._count__links_words + 1));
	_r['_ratio__count__links_to_total_links'] = (_e._count__links / (_main._count__links + 1));
	_r['_ratio__count__links_to_plain_words'] = ((_e._count__links * 2) / _e._count__plain_words);

	// text above
	var
	_divide__candidates = Math.max(2, Math.ceil((_e._count__above_candidates - _main._count__above_candidates) * 0.5)),
		_above_text = ((0 + (_e.__second_length__above_plain_text * 1) + (_e.__second_length__above_plain_text / _divide__candidates)) / 2),
		_above_words = ((0 + (_e.__second_count__above_plain_words * 1) + (_e.__second_count__above_plain_words / _divide__candidates)) / 2);
	_r['_ratio__length__above_plain_text_to_total_plain_text'] = (_above_text / _main._length__plain_text);
	_r['_ratio__count__above_plain_words_to_total_plain_words'] = (_above_words / _main._count__plain_words);
	_r['_ratio__length__above_plain_text_to_plain_text'] = (_above_text / _e._length__plain_text);
	_r['_ratio__count__above_plain_words_to_plain_words'] = (_above_words / _e._count__plain_words);

	// candidates
	_r['_ratio__count__candidates_to_total_candidates'] = (Math.max(0, (_e._count__candidates - (_main._count__candidates * 0.25))) / (_main._count__candidates + 1));
	_r['_ratio__count__containers_to_total_containers'] = (Math.max(0, (_e._count__containers - (_main._count__containers * 0.25))) / (_main._count__containers + 1));
	_r['_ratio__count__pieces_to_total_pieces'] = (Math.max(0, (_e._count__pieces - (_main._count__pieces * 0.25))) / (_main._count__pieces + 1));

	// return
	return _r;
};

$R.getContent__computePointsForCandidateSecond = function (_e, _main) {
	var
	_details = _e.__candidate_details,
		_details_second = _e.__candidate_details_second,
		_points_history = [];
	// bad candidate
	if (_e._is__bad) {
		return [0];
	}

	// get initial points
	_points_history.unshift(_e.__points_history[(_e.__points_history.length - 1)]);

	//  candidates and containers
	var
	_divide__pieces = Math.max(5, Math.ceil(_e._count__pieces * 0.25)),
		_divide__candidates = Math.max(5, Math.ceil(_e._count__candidates * 0.25)),
		_divide__containers = Math.max(10, Math.ceil(_e._count__containers * 0.25));
	_points_history.unshift(((0 + (_points_history[0] * 3) + ((_points_history[0] / _divide__pieces) * 2) + ((_points_history[0] / _divide__candidates) * 2) + ((_points_history[0] / _divide__containers) * 2)) / 9));

	// total text
	$R.getContent__computePointsForCandidate__do(0.50, 1, (1 - (1 - _details_second._ratio__length__plain_text_to_total_plain_text)), _points_history);
	$R.getContent__computePointsForCandidate__do(0.50, 1, (1 - (1 - _details_second._ratio__count__plain_words_to_total_plain_words)), _points_history);

	// text above
	var __ar = ($R.language == 'cjk' ? 0.50 : 0.10);
	$R.getContent__computePointsForCandidate__do(__ar, 1, (1 - _details_second._ratio__length__above_plain_text_to_total_plain_text), _points_history);
	$R.getContent__computePointsForCandidate__do(__ar, 1, (1 - _details_second._ratio__count__above_plain_words_to_total_plain_words), _points_history);
	$R.getContent__computePointsForCandidate__do(__ar, 1, (1 - _details_second._ratio__length__above_plain_text_to_plain_text), _points_history);
	$R.getContent__computePointsForCandidate__do(__ar, 1, (1 - _details_second._ratio__count__above_plain_words_to_plain_words), _points_history);

	// links outer
	$R.getContent__computePointsForCandidate__do(0.75, 1, (1 - _details_second._ratio__count__links_to_total_links), _points_history);
	$R.getContent__computePointsForCandidate__do(0.75, 1, (1 - _details_second._ratio__length__links_text_to_total_links_text), _points_history);
	$R.getContent__computePointsForCandidate__do(0.75, 1, (1 - _details_second._ratio__count__links_words_to_total_links_words), _points_history);

	// links inner
	var __lr = ($R.language == 'cjk' ? 0.75 : 0.50);
	$R.getContent__computePointsForCandidate__do(__lr, 1, (1 - _details._ratio__length__links_text_to_plain_text), _points_history);
	$R.getContent__computePointsForCandidate__do(__lr, 1, (1 - _details._ratio__count__links_words_to_plain_words), _points_history);
	$R.getContent__computePointsForCandidate__do(__lr, 1, (1 - _details_second._ratio__length__links_text_to_all_text), _points_history);
	$R.getContent__computePointsForCandidate__do(__lr, 1, (1 - _details_second._ratio__count__links_words_to_all_words), _points_history);
	$R.getContent__computePointsForCandidate__do(__lr, 1, (1 - _details_second._ratio__count__links_to_plain_words), _points_history);

	// candidates, containers, pieces
	$R.getContent__computePointsForCandidate__do(0.10, 2, (1 - _details_second._ratio__count__candidates_to_total_candidates), _points_history);
	$R.getContent__computePointsForCandidate__do(0.10, 2, (1 - _details_second._ratio__count__containers_to_total_containers), _points_history);
	$R.getContent__computePointsForCandidate__do(0.10, 2, (1 - _details_second._ratio__count__pieces_to_total_pieces), _points_history);

	// return -- will get [0] as the actual final points
	return _points_history;
};

$R.getContent__computePointsForCandidateThird = function (_e, _main) {
	var
	_details = _e.__candidate_details,
		_details_second = _e.__candidate_details_second,
		_points_history = [];
	// bad candidate
	if (_e._is__bad) {
		return [0];
	}

	// get initial points
	_points_history.unshift(_e.__points_history[(_e.__points_history.length - 1)]);

	//  candidates and containers
	var
	_divide__pieces = Math.max(2, Math.ceil(_e._count__pieces * 0.25)),
		_divide__candidates = Math.max(2, Math.ceil(_e._count__candidates * 0.25)),
		_divide__containers = Math.max(4, Math.ceil(_e._count__containers * 0.25));
	_points_history.unshift(((0 + (_points_history[0] * 3) + ((_points_history[0] / _divide__pieces) * 2) + ((_points_history[0] / _divide__candidates) * 2) + ((_points_history[0] / _divide__containers) * 2)) / 9));

	//  total text
	$R.getContent__computePointsForCandidate__do(0.75, 1, (1 - (1 - _details_second._ratio__length__plain_text_to_total_plain_text)), _points_history);
	$R.getContent__computePointsForCandidate__do(0.75, 1, (1 - (1 - _details_second._ratio__count__plain_words_to_total_plain_words)), _points_history);

	// text above
	$R.getContent__computePointsForCandidate__do(0.50, 1, (1 - _details._ratio__length__above_plain_text_to_total_plain_text), _points_history);
	$R.getContent__computePointsForCandidate__do(0.50, 1, (1 - _details._ratio__count__above_plain_words_to_total_plain_words), _points_history);
	$R.getContent__computePointsForCandidate__do(0.10, 1, (1 - _details_second._ratio__length__above_plain_text_to_total_plain_text), _points_history);
	$R.getContent__computePointsForCandidate__do(0.10, 1, (1 - _details_second._ratio__count__above_plain_words_to_total_plain_words), _points_history);
	$R.getContent__computePointsForCandidate__do(0.10, 1, (1 - _details_second._ratio__length__above_plain_text_to_plain_text), _points_history);
	$R.getContent__computePointsForCandidate__do(0.10, 1, (1 - _details_second._ratio__count__above_plain_words_to_plain_words), _points_history);

	// links inner
	$R.getContent__computePointsForCandidate__do(0.50, 1, (1 - _details._ratio__length__links_text_to_all_text), _points_history);
	$R.getContent__computePointsForCandidate__do(0.50, 1, (1 - _details._ratio__count__links_words_to_all_words), _points_history);
	$R.getContent__computePointsForCandidate__do(0.50, 1, (1 - _details._ratio__length__links_text_to_plain_text), _points_history);
	$R.getContent__computePointsForCandidate__do(0.50, 1, (1 - _details._ratio__count__links_words_to_plain_words), _points_history);
	$R.getContent__computePointsForCandidate__do(0.50, 1, (1 - _details._ratio__count__links_to_plain_words), _points_history);

	// candidates, pieces
	$R.getContent__computePointsForCandidate__do(0.50, 1, (1 - _details._ratio__count__candidates_to_total_candidates), _points_history);
	$R.getContent__computePointsForCandidate__do(0.50, 1, (1 - _details._ratio__count__containers_to_total_containers), _points_history);
	$R.getContent__computePointsForCandidate__do(0.50, 1, (1 - _details._ratio__count__pieces_to_total_pieces), _points_history);

	// return -- will get [0] as the actual final points
	return _points_history;
};

$R.getContent__computePointsForCandidate__do = function (_ratio_remaining, _power, _ratio, _points_history) {
	var
	_points_remaining = (_points_history[0] * _ratio_remaining),
		_points_to_compute = (_points_history[0] - _points_remaining);
	if (_ratio < 0) {
		//_points_return = (0.75 * _points_remaining);
		_points_return = _points_remaining;
	}
	else {
		_points_return = 0 + _points_remaining + (_points_to_compute * Math.pow(_ratio, _power));
	}
	// add
	_points_history.unshift(_points_return);
};

$R.getContent__buildHTMLForNode = function (_nodeToBuildHTMLFor, _custom_mode) {
	var
	_global__element_index = 0,
		_global__the_html = '',
		_global__exploreNodeToBuildHTMLFor = $R.getContent__exploreNodeAndGetStuff(_nodeToBuildHTMLFor, true);
	// custom
	switch (_custom_mode) {
	case 'above-the-target':
		_global__exploreNodeToBuildHTMLFor = false;
		break;
	}
	// recursive function
	var _recursive = function (_node) {
		// increment index -- starts with 1
		_global__element_index++;
		// vars
		var
		_explored = false,
			_tag_name = (_node.nodeType === 3 ? '#text' : ((_node.nodeType === 1 && _node.tagName && _node.tagName > '') ? _node.tagName.toLowerCase() : '#invalid')),
			_pos__start__before = 0,
			_pos__start__after = 0,
			_pos__end__before = 0,
			_pos__end__after = 0;
		// fast return
		switch (true) {
		case ((_tag_name == '#invalid')):
		case (($R.parsingOptions._elements_ignore.indexOf('|' + _tag_name + '|') > -1)):
			return;
		case (_tag_name == '#text'):
			_global__the_html += _node.nodeValue.replace(/</gi, '&lt;').replace(/>/gi, '&gt;');
			return;
		}
		// hidden
		if ($R.parsingOptions._elements_visible.indexOf('|' + _tag_name + '|') > -1) {
			// included inline
			// _node must be defined
			// will return, if node is hidden
			switch (true) {
			case (_node.offsetWidth > 0):
			case (_node.offsetHeight > 0):
				break;
			default:
				switch (true) {
				case (_node.offsetLeft > 0):
				case (_node.offsetTop > 0):
					break;
				default:
					return;
				}
				break;
			}
		}
		// clean -- before
		// just a return will skip the whol element
		// including children
		// objects, embeds, iframes
		switch (_tag_name) {
		case ('object'):
		case ('embed'):
		case ('iframe'):
			var
			_src = (_tag_name == 'object' ? $(_node).find("param[name='movie']").attr('value') : $(_node).attr('src')),
				_skip = ((_src > '') ? false : true);
			if (_skip);
			else {
				// default skip
				_skip = true;
				// loop
				for (var i = 0, _i = $R.keepStuffFromDomain__video.length; i < _i; i++) {
					if (_src.indexOf($R.keepStuffFromDomain__video[i]) > -1) {
						_skip = false;
						break;
					}
				}
			}
			// skip?
			if (_skip) {
				$R.debugOutline(_node, 'clean-before', 'object-embed-iframe');
				return;
			}
			break;
		}
		// skipped link
		if (_tag_name == 'a') {
			_explored = (_explored || $R.getContent__exploreNodeAndGetStuff(_node, true));
			switch (true) {
			case (_explored._is__link_skip):
			case (((_explored._count__images_small + _explored._count__images_skip) > 0) && (_explored._length__plain_text < 65)):
				$R.debugOutline(_node, 'clean-before', 'skip-link');
				return;
			}
		}
		// link density
		if ($R.parsingOptions._elements_link_density.indexOf('|' + _tag_name + '|') > -1) {
			_explored = (_explored || $R.getContent__exploreNodeAndGetStuff(_node, true));
			switch (true) {
			case (_explored._length__plain_text > (65 * 3 * 2)):
			case ($R.language == 'cjk' && (_explored._length__plain_text > (65 * 3 * 1))):
			case (!(_explored._count__links > 1)):
			case (_global__exploreNodeToBuildHTMLFor && (_explored._length__plain_text / _global__exploreNodeToBuildHTMLFor._length__plain_text) > 0.5):
			case (_global__exploreNodeToBuildHTMLFor && (_explored._count__plain_words / _global__exploreNodeToBuildHTMLFor._count__plain_words) > 0.5):
			case ((_explored._length__plain_text == 0) && (_explored._count__links == 1) && (_explored._length__links_text < 65)):
			case ((_explored._length__plain_text < 25) && ((_explored._count__images_large + _explored._count__images_medium) > 0)):
				break;
			case ((_explored._length__links_text / _explored._length__all_text) < 0.5):
				if (_explored._count__links > 0);
				else {
					break;
				}
				if (_explored._count__links_skip > 0);
				else {
					break;
				}
				if (((_explored._count__links_skip / _explored._count__links) > 0.25) && (_explored._length__links_text / _explored._length__all_text) < 0.05) {
					break;
				}
			default:
				$R.debugOutline(_node, 'clean-before', 'link-density');
				return;
			}
		}
		// floating
		if ($R.parsingOptions._elements_floating.indexOf('|' + _tag_name + '|') > -1) {
			_explored = (_explored || $R.getContent__exploreNodeAndGetStuff(_node, true));
			switch (true) {
			case (_explored._length__plain_text > (65 * 3 * 2)):
			case ($R.language == 'cjk' && (_explored._length__plain_text > (65 * 3 * 1))):
			case (_global__exploreNodeToBuildHTMLFor && (_explored._length__plain_text / _global__exploreNodeToBuildHTMLFor._length__plain_text) > 0.25):
			case (_global__exploreNodeToBuildHTMLFor && (_explored._count__plain_words / _global__exploreNodeToBuildHTMLFor._count__plain_words) > 0.25):
			case ((_explored._length__plain_text < 25) && (_explored._length__links_text < 25) && ((_explored._count__images_large + _explored._count__images_medium) > 0)):
				break;
			default:
				var _float = $(_node).css('float');
				if (_float == 'left' || _float == 'right');
				else {
					break;
				}
				if ((_explored._length__links_text == 0) && ((_explored._count__images_large + _explored._count__images_medium) > 0)) {
					break;
				}
				$R.debugOutline(_node, 'clean-before', 'floating');
				return;
			}
		}
		// above target
		if (_custom_mode == 'above-the-target') {
			if ($R.parsingOptions._elements_above_target.indexOf('|' + _tag_name + '|') > -1) {
				$R.debugOutline(_node, 'clean-before', 'above-target');
				return;
			}
			if (_tag_name == 'img') {
				_explored = (_explored || $R.getContent__exploreNodeAndGetStuff(_node, true));
				if (_explored._is__image_large);
				else {
					$R.debugOutline(_node, 'clean-before', 'above-target');
					return;
				}
			}
		}

		// start tag
		if ($R.parsingOptions._elements_ignore_tag.indexOf('|' + _tag_name + '|') > -1);
		else { /* mark */
			_pos__start__before = _global__the_html.length; /* add */
			_global__the_html += '<' + _tag_name;
			// attributes
			// allowed attributes
			if (_tag_name in $R.parsingOptions._elements_keep_attributes) {
				for (var i = 0, _i = $R.parsingOptions._elements_keep_attributes[_tag_name].length; i < _i; i++) {
					var
					_attribute_name = $R.parsingOptions._elements_keep_attributes[_tag_name][i],
						_attribute_value = _node.getAttribute(_attribute_name);
					// if present
					if (_attribute_value > '') {
						_global__the_html += ' ' + _attribute_name + '="' + (_attribute_value) + '"';
					}
				}
			}
			// keep ID for all elements
			var _id_attribute = _node.getAttribute('id');
			if (_id_attribute > '') {
				_global__the_html += ' id="' + _id_attribute + '"';
			}
			// links target NEW
			if (_tag_name == 'a') {
				_global__the_html += ' target="_blank"';
			}

			// close start
			if ($R.parsingOptions._elements_self_closing.indexOf('|' + _tag_name + '|') > -1) {
				_global__the_html += ' />';
			}
			else {
				_global__the_html += '>';
			}
			/* mark */
			_pos__start__after = _global__the_html.length;
		}
		// child nodes
		if ($R.parsingOptions._elements_self_closing.indexOf('|' + _tag_name + '|') > -1);
		else {
			for (var i = 0, _i = _node.childNodes.length; i < _i; i++) {
				_recursive(_node.childNodes[i]);
			}
		}
		// end tag
		switch (true) {
		case (($R.parsingOptions._elements_ignore_tag.indexOf('|' + _tag_name + '|') > -1)):
			return;
		case (($R.parsingOptions._elements_self_closing.indexOf('|' + _tag_name + '|') > -1)):
			/* mark */
			_pos__end__before = _global__the_html.length; /* mark */
			_pos__end__after = _global__the_html.length;
			break;
		default:
			/* mark */
			_pos__end__before = _global__the_html.length; /* end */
			_global__the_html += '</' + _tag_name + '>'; /* mark */
			_pos__end__after = _global__the_html.length;
			break;
		}
		// clean -- after
		// we need to actually cut things out of
		// "_global__the_html", for stuff to not be there
		// largeObject classes
		if (_tag_name == 'iframe' || _tag_name == 'embed' || _tag_name == 'object') {
			_global__the_html = '' + _global__the_html.substr(0, _pos__start__before) + '<div class="readableLargeObjectContainer">' + _global__the_html.substr(_pos__start__before, (_pos__end__after - _pos__start__before)) + '</div>';
			return;
		}
		// add image classes
		if (_tag_name == 'img') {
			_explored = (_explored || $R.getContent__exploreNodeAndGetStuff(_node, true));
			switch (true) {
			case (_explored._is__image_skip):
				$R.debugOutline(_node, 'clean-after', 'skip-img');
				_global__the_html = _global__the_html.substr(0, _pos__start__before);
				return;
			case (_explored._is__image_large):
				_global__the_html = '' + _global__the_html.substr(0, _pos__start__before) + '<div class="readableLargeImageContainer' + (($(_node).width() <= 250) && ($(_node).height() >= 250) ? ' float' : '') + '">' + _global__the_html.substr(_pos__start__before, (_pos__end__after - _pos__start__before)) + '</div>';
				return;
			}
		}
		// large images in links
		if (_tag_name == 'a') {
			_explored = (_explored || $R.getContent__exploreNodeAndGetStuff(_node, true));
			switch (true) {
			case (_explored._count__images_large == 1):
				_global__the_html = '' + _global__the_html.substr(0, _pos__start__after - 1) + ' class="readableLinkWithLargeImage">' + _global__the_html.substr(_pos__start__after, (_pos__end__before - _pos__start__after)) + '</a>';
				return;
			case (_explored._count__images_medium == 1):
				_global__the_html = '' + _global__the_html.substr(0, _pos__start__after - 1) + ' class="readableLinkWithMediumImage">' + _global__the_html.substr(_pos__start__after, (_pos__end__before - _pos__start__after)) + '</a>';
				return;
			}
		}
		// too much content
		if ($R.parsingOptions._elements_too_much_content.indexOf('|' + _tag_name + '|') > -1) {
			_explored = (_explored || $R.getContent__exploreNodeAndGetStuff(_node, true));
			switch (true) {
			case (_tag_name == 'h1' && (_explored._length__all_text > (65 * 2))):
			case (_tag_name == 'h2' && (_explored._length__all_text > (65 * 2 * 3))):
			case ((_tag_name.match(/^h(3|4|5|6)$/) != null) && (_explored._length__all_text > (65 * 2 * 5))):
			case ((_tag_name.match(/^(b|i|em|strong)$/) != null) && (_explored._length__all_text > (65 * 5 * 5))):
				$R.debugOutline(_node, 'clean-after', 'too-much-content');
				_global__the_html = '' + _global__the_html.substr(0, _pos__start__before) + _global__the_html.substr(_pos__start__after, (_pos__end__before - _pos__start__after));
				return;
			}
		}
		// empty elements
		switch (true) {
		case (($R.parsingOptions._elements_self_closing.indexOf('|' + _tag_name + '|') > -1)):
		case (($R.parsingOptions._elements_ignore_tag.indexOf('|' + _tag_name + '|') > -1)):
		case (_tag_name == 'td'):
			break;
		default:
			var _contents = _global__the_html.substr(_pos__start__after, (_pos__end__before - _pos__start__after));
			_contents = _contents.replace(/(<br \/>)/gi, '');
			_contents = _contents.replace(/(<hr \/>)/gi, '');
			var _contentsLength = $R.measureText__getTextLength(_contents);
			switch (true) {
			case (_contentsLength == 0 && _tag_name == 'p'):
				_global__the_html = _global__the_html.substr(0, _pos__start__before) + '<br /><br />';
				return;
			case (_contentsLength == 0):
			case ((_contentsLength < 5) && ($R.parsingOptions._elements_visible.indexOf('|' + _tag_name + '|') > -1)):
				$R.debugOutline(_node, 'clean-after', 'blank');
				_global__the_html = _global__the_html.substr(0, _pos__start__before);
				return;
			}
			break;
		}
		// too much missing
		if ($R.parsingOptions._elements_link_density.indexOf('|' + _tag_name + '|') > -1) {
			_explored = (_explored || $R.getContent__exploreNodeAndGetStuff(_node, true));
			var
			_contents = _global__the_html.substr(_pos__start__after, (_pos__end__before - _pos__start__after)).replace(/(<([^>]+)>)/gi, ''),
				_contentsLength = $R.measureText__getTextLength(_contents),
				_initialLength = 0 + _explored._length__all_text + (_explored._count__images_small * 10) + (_explored._count__images_skip * 10) + (_node.getElementsByTagName('iframe').length * 10) + (_node.getElementsByTagName('object').length * 10) + (_node.getElementsByTagName('embed').length * 10) + (_node.getElementsByTagName('button').length * 10) + (_node.getElementsByTagName('input').length * 10) + (_node.getElementsByTagName('select').length * 10) + (_node.getElementsByTagName('textarea').length * 10);
			// too much missing
			switch (true) {
			case (!(_contentsLength > 0)):
			case (!(_initialLength > 0)):
			case (!((_contentsLength / _initialLength) < 0.5)):
			case (!(($R.language == 'cjk') && (_contentsLength / _initialLength) < 0.1)):
			case ((_global__exploreNodeToBuildHTMLFor && ((_explored._length__plain_text / _global__exploreNodeToBuildHTMLFor._length__plain_text) > 0.25))):
			case (($R.language == 'cjk') && (_global__exploreNodeToBuildHTMLFor && ((_explored._length__plain_text / _global__exploreNodeToBuildHTMLFor._length__plain_text) > 0.1))):
				break;
			default:
				$R.debugOutline(_node, 'clean-after', 'missing-density');
				_global__the_html = _global__the_html.substr(0, _pos__start__before);
				return;
			}
		}

		// return
		return;
	};
	// actually do it
	_recursive(_nodeToBuildHTMLFor);
	// return html
	return _global__the_html;
};

$R.getContent__manualSelection = function () {
	var
	_selection = $R.sel.getSelection($R.win),
		_range = $R.sel.getRange(_selection),
		_html = $R.sel.getRangeHTML(_range),
		_text = $R.sel.getRangeText(_range);
	if (_html > '' && _text > '');
	else {
		_html = null;
		_text = null;
		$R.$document.find('frame, iframe').each(function (_i, _e) {
			if (_e.getAttribute('id') == 'readable_iframe') {
				return;
			}
			try {
				var
				__doc = $(_e).contents().get(0),
					__win = $R.sel.getWindowFromDocument(__doc),
					__selection = $R.sel.getSelection(__win),
					__range = $R.sel.getRange(__selection),
					__html = $R.sel.getRangeHTML(__range),
					__text = $R.sel.getRangeText(__range);
				if (__html > '' && __text > '') {
					_html = __html;
					_text = __text;
					// stop the each
					return false;
				}
			}
			catch (e) {}
		});
	}
	// haven't found anything
	if (_html > '' && _text > '');
	else {
		return false;
	}
	// probably selected something by mistake
	if ($R.measureText__getTextLength(_text) > (65 * 3 * 1.5));
	else {
		return false;
	}
	// display
	$R.$pages.html('');
	$R.displayPageHTML(_html, 1);
	// return true
	return true;
};

