/**
 * Extract readable content from a web page and save as html file, similar to Evernote Clearly, but in console
 *
 * @param string str
 * @return string
 */
function clearly(url, filename, callback) {
	var page = require('webpage').create();

	page.settings.userAgent = 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/536.5 (KHTML, like Gecko) Chrome/19.0.1084.52 Safari/536.5';

	page.onConsoleMessage = function (msg) {
		console.log(msg);
	};

	page.onAlert = function (msg) {
		console.log(msg);
	};

	/*
	page.onError = function (msg, trace) {
		console.log(msg);
		trace.forEach(function (item) {
			console.log('  ', item.file, ':', item.line);
		});
	};
	*/

	page.open(url, function (status) {
		if (queue[url] === true) {
			return true;
		}

		page.includeJs("http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js", function () {
			html = page.evaluate(function () {
				window.readable = {};
				window.readable.window = window;
				window.readable.document = window.document;

				return (function ($R) {

					// debug
					$R.log = function (message) {
						return false;
						console.log(message);
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

					// skip links
					$R.skipStuffFromDomains__links = [
						'doubleclick.net', 'fastclick.net', 'adbrite.com',
						'adbureau.net', 'admob.com', 'bannersxchange.com',
						'buysellads.com', 'impact-ad.jp', 'atdmt.com',
						'advertising.com', 'itmedia.jp', 'microad.jp',
						'serving-sys.com', 'adplan-ds.com'
					];

					// skip images
					$R.skipStuffFromDomain__images = [
						'googlesyndication.com', 'fastclick.net', '.2mdn.net',
						'de17a.com', 'content.aimatch.com', 'bannersxchange.com',
						'buysellads.com', 'impact-ad.jp', 'atdmt.com', 'advertising.com',
						'itmedia.jp', 'microad.jp', 'serving-sys.com', 'adplan-ds.com'
					];

					// keep video
					$R.keepStuffFromDomain__video = [
						// foreign video sites
						'youtube.com', 'youtube-nocookie.com',
						'vimeo.com', 'hulu.com', 'yahoo.com',
						'flickr.com', 'newsnetz.ch',
						// china video sites
						// @link http://blogunion.org/blogging-tools/china-video-sharing-website-list.html
						'100tv.com', '21gt.com', '51bo.com', '56.com', '5show.com',
						'6rooms.com', '94haokan.com', 'aipaike.com', 'bapo.cn',
						'feesee.com', 'flashmov.com', 'happy3g.com', 'homhow.com',
						'hubotv.com', 'i35mm.cn', 'ivtv.com.cn', 'jiuduo.com',
						'ku6.com',  'letv.com', 'lookev.com', 'maidee.com', 'omytvs.com',
						'openv.tv', 'ouou.com', 'podlook.com', 'pomoho.com', 'qianboo.com',
						'quxiu.com', 'seehaha.com', 'showker.com', 'tudou.com', 'tv.mofile.com',
						'tvix.cn', 'uume.com', 'vkuoo.com', 'vottie.com', 'woaide.com',
						'xmyan.com', 'yoqoo.com', 'youku.com', 'zaguo.com'
					];

					// measure text
					// asian languages
					// @link http://msdn.microsoft.com/en-us/goglobal/bb688158
					// @link http://en.wikipedia.org/wiki/Japanese_punctuation
					// @link http://en.wikipedia.org/wiki/Japanese_typographic_symbols
					// @link http://unicode.org/charts/PDF/U3000.pdf
					// CJK: Chnese, Japanese, Korean -- HAN character set

					// text length,
					$R.measureText__getTextLength = function (_the_text) {
						return _the_text.replace(/[\s\n\r]+/gi, '').length;
					};

					// word count,
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
					$R.getContent = function () {
						$R.getContent__detectLanguage();
						return $R.getContent__find();
					};

					// Detect language by randomly selected paragraphs from page
					$R.getContent__detectLanguage = function () {
						$R.language = 'general';

						// the text - start with title
						var _test_text = ' ' + $R.document.title;

						// add couple of random paragraphs, divs
						var _ps = $R.document.getElementsByTagName('p'),
							_ds = $R.document.getElementsByTagName('div');

						// add
						for (var i = 0; i < 5; i++) {
							_test_text += ' ' + $(_ps[Math.floor(Math.random() * _ps.length)]).text();
						}
						for (var i = 0; i < 5; i++) {
							_test_text += ' ' + $(_ds[Math.floor(Math.random() * _ds.length)]).text();
						}

						// check
						switch (true) {
							case (_test_text.match(/([\u3000])/gi) != null):
							case (_test_text.match(/([\u3001])/gi) != null):
							case (_test_text.match(/([\u3002])/gi) != null):
							case (_test_text.match(/([\u301C])/gi) != null):
								$R.language = 'cjk';
								break;
						}

						// in case we stop
						$R.log('Language: ' + $R.language);
					};

					// Decide tagName of a node, we just need #text, a, img nodes
					$R.getContent_detectNodeTagName = function (_node) {
						if (_node.nodeType === 3) {
							_tag_name = '#text';
						} else if (_node.nodeType === 1 && _node.tagName && _node.tagName > '') {
							_tag_name = _node.tagName.toLowerCase();
						} else {
							_tag_name = '#invalid';
						}

						return _tag_name;
					};

					// Explore the node recursively, get candidate nodes
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
							_global__element_index++;

							var _tag_name = $R.getContent_detectNodeTagName(_node),
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
								// will return, if node is invalid or ignored
								case ((_tag_name == '#invalid')):
								case (($R.parsingOptions._elements_ignore.indexOf('|' + _tag_name + '|') > -1)):
									return;

								// will return, if node is hidden
								case (($R.parsingOptions._elements_visible.indexOf('|' + _tag_name + '|') > -1)):
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

								// will return, if node is self closing elements, besides img
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
									_result._is__text = true;

									var _nodeText = _node.nodeValue;

									// result
									_result._length__plain_text = $R.measureText__getTextLength(_nodeText);
									_result._count__plain_words = $R.measureText__getWordCount(_nodeText);
									if (_global__inside_link) {
										_global__length__above_links_text += _result._length__plain_text;
										_global__count__above_links_words += _result._count__plain_words;
									} else {
										_global__length__above_plain_text += _result._length__plain_text;
										_global__count__above_plain_words += _result._count__plain_words;
									}

									return _result;

								// link node
								case (_tag_name == 'a'):
									var _href = _node.href;

									// sanity
									if (!_href || !_href.indexOf) {
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
									if (_global__inside_link === false) {
										_global__inside_link = true;
										_global__inside_link__element_index = _result.__index;
									}

									// done
									_return__links.push(_result);
									break;

								// image node
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

								if (!_child_result) {
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
								// increase above containers
								if (_result._is__container) {
									_global__count__above_containers++;
								}

								// add to candidates
								if (!_justExploring) {
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
											/* words */
											break;
										default:
											// good candidate
											_result._is__candidate = true;
											_return__candidates.push(_result);
											// increase above candidates
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

							// return
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

						// pieces of text
						// and points computation
						for (var i = 0, _i = _candidates.length; i < _i; i++) {
							// pieces
							var _count__pieces = 0,
								_array__pieces = [];

							for (var k = i, _k = _candidates.length; k < _k; k++) {
								if (_candidates[k]._count__candidates > 0) {
									continue;
								}
								if ($.contains(_candidates[i].__node, _candidates[k].__node) === false) {
									continue;
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
						var _divide__candidates = Math.max(2, Math.ceil(_e._count__above_candidates * 0.5)),
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
						var _details = _e.__candidate_details,
							_points_history = [],
							_really_big = ((_main._length__plain_text / 65) > 250);

						// bad candidate
						if (_e._is__bad) {
							return [0];
						}

						// the basics
						_points_history.unshift(((0
							+ (_details._count__paragraphs_of_3_lines)
							+ (_details._count__paragraphs_of_5_lines * 1.5)
							+ (_details._count__paragraphs_of_50_words)
							+ (_details._count__paragraphs_of_80_words * 1.5)
							+ (_e._count__images_large * 3)
							- ((_e._count__images_skip + _e._count__images_small) * 0.5)
						) * 1000));

						// negative
						if (_points_history[0] < 0) {
							return [0];
						}

						// candidates and containers
						var _divide__pieces = Math.max(5, Math.ceil(_e._count__pieces * 0.25)),
							_divide__candidates = Math.max(5, Math.ceil(_e._count__candidates * 0.25)),
							_divide__containers = Math.max(10, Math.ceil(_e._count__containers * 0.25));

						_points_history.unshift(((0
							+ (_points_history[0] * 3)
							+ (_points_history[0] / _divide__pieces)
							+ (_points_history[0] / _divide__candidates)
							+ (_points_history[0] / _divide__containers)
						) / 6));

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

						// links inner
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
						var _candidates = _processedCandidates,
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
						// add main - to amke sure the result is never blank
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
						var _divide__candidates = Math.max(2, Math.ceil((_e._count__above_candidates - _main._count__above_candidates) * 0.5)),
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
						var _details = _e.__candidate_details,
							_details_second = _e.__candidate_details_second,
							_points_history = [];

						// bad candidate
						if (_e._is__bad) {
							return [0];
						}

						// get initial points
						_points_history.unshift(_e.__points_history[(_e.__points_history.length - 1)]);

						// candidates and containers
						var _divide__pieces = Math.max(5, Math.ceil(_e._count__pieces * 0.25)),
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
						var _details = _e.__candidate_details,
							_details_second = _e.__candidate_details_second,
							_points_history = [];

						// bad candidate
						if (_e._is__bad) {
							return [0];
						}

						// get initial points
						_points_history.unshift(_e.__points_history[(_e.__points_history.length - 1)]);

						// candidates and containers
						var _divide__pieces = Math.max(2, Math.ceil(_e._count__pieces * 0.25)),
							_divide__candidates = Math.max(2, Math.ceil(_e._count__candidates * 0.25)),
							_divide__containers = Math.max(4, Math.ceil(_e._count__containers * 0.25));
						_points_history.unshift(((0 + (_points_history[0] * 3) + ((_points_history[0] / _divide__pieces) * 2) + ((_points_history[0] / _divide__candidates) * 2) + ((_points_history[0] / _divide__containers) * 2)) / 9));

						// total text
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
						var _points_remaining = (_points_history[0] * _ratio_remaining),
							_points_to_compute = (_points_history[0] - _points_remaining);

						if (_ratio < 0) {
							//_points_return = (0.75 * _points_remaining);
							_points_return = _points_remaining;
						} else {
							_points_return = 0 + _points_remaining + (_points_to_compute * Math.pow(_ratio, _power));
						}
						// add
						_points_history.unshift(_points_return);
					};

					$R.getContent__buildHTMLForNode = function (_nodeToBuildHTMLFor, _custom_mode) {
						var _global__element_index = 0,
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
							var _explored = false,
								_tag_name = $R.getContent_detectNodeTagName(_node),
								_pos__start__before = 0,
								_pos__start__after = 0,
								_pos__end__before = 0,
								_pos__end__after = 0;

							// fast return on invalid nodes, ignored nodes, text nodes
							switch (true) {
								case ((_tag_name == '#invalid')):
								case (($R.parsingOptions._elements_ignore.indexOf('|' + _tag_name + '|') > -1)):
									return;
								case (_tag_name == '#text'):
									_global__the_html += _node.nodeValue.replace(/</gi, '&lt;').replace(/>/gi, '&gt;');
									return;
							}

							// will return, if node is hidden
							if ($R.parsingOptions._elements_visible.indexOf('|' + _tag_name + '|') > -1) {
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
							// just a return will skip the whole element
							// including children

							// objects, embeds, iframes
							// @TODO chinese video website objects need furthur work
							switch (_tag_name) {
								case ('object'):
								case ('embed'):
								case ('iframe'):
									var _src = (_tag_name == 'object')
										? $(_node).find("param[name='movie']").attr('value')
										: $(_node).attr('src');
									var _skip = ((_src > '') ? false : true);

									if (_skip === false) {
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
										if (_explored._count__links <= 0) {
											break;
										}
										if (_explored._count__links_skip <= 0) {
											break;
										}
										if (((_explored._count__links_skip / _explored._count__links) > 0.25) && (_explored._length__links_text / _explored._length__all_text) < 0.05) {
											break;
										}
									default:
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
										if (!(_float == 'left' || _float == 'right')) {
											break;
										}
										if ((_explored._length__links_text == 0) && ((_explored._count__images_large + _explored._count__images_medium) > 0)) {
											break;
										}
										return;
								}
							}

							// above target
							if (_custom_mode == 'above-the-target') {
								if ($R.parsingOptions._elements_above_target.indexOf('|' + _tag_name + '|') > -1) {
									return;
								}
								if (_tag_name == 'img') {
									_explored = (_explored || $R.getContent__exploreNodeAndGetStuff(_node, true));
									if (!_explored._is__image_large) {
										return;
									}
								}
							}

							// start tag
							if ($R.parsingOptions._elements_ignore_tag.indexOf('|' + _tag_name + '|') < 0) {
								_pos__start__before = _global__the_html.length; /* mark */
								_global__the_html += '<' + _tag_name; /* add */

								// allowed attributes
								if (_tag_name in $R.parsingOptions._elements_keep_attributes) {
									for (var i = 0, _i = $R.parsingOptions._elements_keep_attributes[_tag_name].length; i < _i; i++) {
										var _attribute_name = $R.parsingOptions._elements_keep_attributes[_tag_name][i],
											_attribute_value = _node.getAttribute(_attribute_name);

										// we need to get absolute path for img elements
										if ((_tag_name === 'img') && (_attribute_name === 'src')) {
											var img = document.createElement('img');
											img.src = _attribute_value;
											_attribute_value = img.src;
											img.src = null;
										}

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
								} else {
									_global__the_html += '>';
								}

								/* mark */
								_pos__start__after = _global__the_html.length;
							}

							// child nodes
							if ($R.parsingOptions._elements_self_closing.indexOf('|' + _tag_name + '|') < 0) {
								for (var i = 0, _i = _node.childNodes.length; i < _i; i++) {
									_recursive(_node.childNodes[i]);
								}
							}

							// end tag
							switch (true) {
								case (($R.parsingOptions._elements_ignore_tag.indexOf('|' + _tag_name + '|') > -1)):
									return;
								case (($R.parsingOptions._elements_self_closing.indexOf('|' + _tag_name + '|') > -1)):
									_pos__end__before = _global__the_html.length; /* mark */
									_pos__end__after = _global__the_html.length; /* mark */
									break;
								default:
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
											_global__the_html = _global__the_html.substr(0, _pos__start__before);
											return;
									}
									break;
							}

							// too much missing
							if ($R.parsingOptions._elements_link_density.indexOf('|' + _tag_name + '|') > -1) {
								_explored = (_explored || $R.getContent__exploreNodeAndGetStuff(_node, true));
								var _contents = _global__the_html.substr(_pos__start__after, (_pos__end__before - _pos__start__after)).replace(/(<([^>]+)>)/gi, ''),
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

					// Find page title, h{1,2,3} within the body is preferred, if not found, document.title is used
					$R.getContent__find = function () {
						// get content
						var _found = $R.getContent__findInPage($R.window),
							_targetNode = _found._targetCandidate.__node,
							_$targetNode = $(_targetNode);

						// prev html => to fist target
						var _foundHTML = _found._html,
							_prevNode = _found._targetCandidate.__node,
							_prevHTML = '',
							_foundTitle = false;

						(function () {
							while (true) {
								switch (true) {
									case ((_prevNode.tagName && _prevNode.tagName.toLowerCase() == 'body')):
									case ((_found._firstCandidate.__node != _found._targetCandidate.__node) && (_prevNode == _found._firstCandidate.__node)):
										return;
								}

								// do it
								if (_prevNode.previousSibling) {
									// previous
									_prevNode = _prevNode.previousSibling;

									// get html
									var _h = $R.getContent__buildHTMLForNode(_prevNode, 'above-the-target');
									_prevHTML = _h + _prevHTML;
									_foundHTML = _h + _foundHTML;

									// finished?
									if ($R.measureText__getTextLength(_prevHTML.replace(/<[^>]+?>/gi, '')) > (65 * 3 * 3)) {
										return;
									}

									// found heading
									var _headingStartPos = _foundHTML.indexOf('<h1');
									_headingStartPos = (_headingStartPos > -1 ? _headingStartPos : _foundHTML.indexOf('<h2'));
									_headingStartPos = (_headingStartPos > -1 ? _headingStartPos : _foundHTML.indexOf('<h3'));
									if (_headingStartPos > -1) {
										var _toHeadingLength = $R.measureText__getTextLength(_foundHTML.substr(0, _headingStartPos).replace(/<[^>]+?>/gi, ''));
										if (_toHeadingLength < (65 * 3 * 2)) {
											$R.log('use title found in page');
											_foundTitle = true;
											return;
										}
									}
								} else {
									_prevNode = _prevNode.parentNode;
								}
							}
						})();

						// get document title
						if (!_foundTitle) {
							if ($R.document.title > '') {
								$R.log('use title from document.title');
								var _the_title = '',
									_doc_title = $R.document.title,
									_doc_title_parts = [],
									_doc_title_pregs = [/( [-][-] |( [-] )|( [>][>] )|( [<][<] )|( [|] )|( [\/] ))/i, /(([:] ))/i];

								// loop through pregs, until we managed a split
								for (var i = 0, _i = _doc_title_pregs.length; i < _i; i++) {
									_doc_title_parts = _doc_title.split(_doc_title_pregs[i]);
									if (_doc_title_parts.length > 1) {
										break;
									}
								}

								// sort title parts, longer goes higher up -- i.e. towards 0
								_doc_title_parts.sort(function (a, b) {
									switch (true) {
										case (a.length > b.length):
											return -1;
										case (a.length < b.length):
											return 1;
										default:
											return 0;
									}
								});

								// more than one word?
								_the_title = (_doc_title_parts[0].split(/\s+/i).length > 1 ? _doc_title_parts[0] : _doc_title);

								// add
								_foundHTML = '<h1>' + _the_title + '</h1>' + _foundHTML;
							}
						}

						// return
						return _foundHTML;
					};

					// Find the most promising candidate that acts as the main container, then build HTML
					$R.getContent__findInPage = function (_pageWindow) {
						var _firstCandidate = _secondCandidate = _targetCandidate = false;

						var _stuff = $R.getContent__exploreNodeAndGetStuff(_pageWindow.document.body);

						$R.log('getContent__processCandidates: 1st round');
						var _processedCandidates = $R.getContent__processCandidates(_stuff._candidates);

						_firstCandidate = _processedCandidates[0];
						_targetCandidate = _firstCandidate;

						// do second?
						switch (true) {
							case (!(_firstCandidate._count__containers > 0)):
							case (!(_firstCandidate._count__candidates > 0)):
							case (!(_firstCandidate._count__pieces > 0)):
							case (!(_firstCandidate._count__containers > 25)):
								break;
							default:

								$R.log('getContent__processCandidates: 2nd round');
								var _processedCandidatesSecond = $R.getContent__processCandidatesSecond(_processedCandidates);
								_secondCandidate = _processedCandidatesSecond[0];

								// they're the same
								if (_firstCandidate.__node == _secondCandidate.__node) {
									break;
								}

								// compute again
								$R.log('getContent__processCandidates: 3rd round');
								_firstCandidate['__points_history_final'] = $R.getContent__computePointsForCandidateThird(_firstCandidate, _firstCandidate);
								_firstCandidate['__points_final'] = _firstCandidate.__points_history_final[0];
								_secondCandidate['__points_history_final'] = $R.getContent__computePointsForCandidateThird(_secondCandidate, _firstCandidate);
								_secondCandidate['__points_final'] = _secondCandidate.__points_history_final[0];

								// are we selecting _second?
								switch (true) {
									case ((_secondCandidate.__candidate_details._count__lines_of_65_characters < 20) && (_secondCandidate.__points_final / _firstCandidate.__points_final) > 1):
									case ((_secondCandidate.__candidate_details._count__lines_of_65_characters > 20) && (_secondCandidate.__points_final / _firstCandidate.__points_final) > 0.9):
									case ((_secondCandidate.__candidate_details._count__lines_of_65_characters > 50) && (_secondCandidate.__points_final / _firstCandidate.__points_final) > 0.75):
										_targetCandidate = _secondCandidate;
										break;
								}

								break;
						}

						$R.log(_targetCandidate.__node);

						// get html
						var _html = $R.getContent__buildHTMLForNode(_targetCandidate.__node, 'the-target');

						// @TODO handle illegal self-closing elements such as <br> <hr>
						_html = _html.substr((_html.indexOf('>') + 1), _html.lastIndexOf('<'));
						_html = _html.replace(/<(blockquote|div|p|td|li)([^>]*)>(\s*<br \/>)+/gi, '<$1$2>');						// multiple ending BR
						_html = _html.replace(/(<br \/>\s*)+<\/(blockquote|div|p|td|li)>/gi, '</$2>');									// multiple procceding BR
						_html = _html.replace(/(<br \/>\s*)+<(blockquote|div|h\d|ol|p|table|ul|li)([^>]*)>/gi, '<$2$3>');	// multiple procceding BR
						_html = _html.replace(/<\/(blockquote|div|h\d|ol|p|table|ul|li)>(\s*<br \/>)+/gi, '</$1>');				// multiple ending BR
						_html = _html.replace(/(<hr \/>\s*<hr \/>\s*)+/gi, '<hr />');																// multiple HR
						_html = _html.replace(/(<br \/>\s*<br \/>\s*)+/gi, '<br /><br />');													// multiple BR

						// return
						return {
							'_html': _html,
							'_links': _stuff._links,
							'_targetCandidate': _targetCandidate,
							'_firstCandidate': _firstCandidate
						};
					};

					// auto-launch
					return $R.getContent();

				})(window.readable);
			});

			page.render(filename.split('.')[0] + '.png');

			var fs = require('fs');
			fs.write(filename, html, 'w');

			queue[url] = true;

			callback(url, filename);
		});
	});
}

/**
 * Calculate MD5 hash of a string
 *
 * @param string str
 * @return string
 */
function md5(str) {
	var xl;

	var rotateLeft = function (lValue, iShiftBits) {
		return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
	};

	var addUnsigned = function (lX, lY) {
		var lX4, lY4, lX8, lY8, lResult;
		lX8 = (lX & 0x80000000);
		lY8 = (lY & 0x80000000);
		lX4 = (lX & 0x40000000);
		lY4 = (lY & 0x40000000);
		lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
		if (lX4 & lY4) {
			return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
		}
		if (lX4 | lY4) {
			if (lResult & 0x40000000) {
				return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
			} else {
				return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
			}
		} else {
			return (lResult ^ lX8 ^ lY8);
		}
	};

	var _F = function (x, y, z) {
		return (x & y) | ((~x) & z);
	};
	var _G = function (x, y, z) {
		return (x & z) | (y & (~z));
	};
	var _H = function (x, y, z) {
		return (x ^ y ^ z);
	};
	var _I = function (x, y, z) {
		return (y ^ (x | (~z)));
	};

	var _FF = function (a, b, c, d, x, s, ac) {
		a = addUnsigned(a, addUnsigned(addUnsigned(_F(b, c, d), x), ac));
		return addUnsigned(rotateLeft(a, s), b);
	};

	var _GG = function (a, b, c, d, x, s, ac) {
		a = addUnsigned(a, addUnsigned(addUnsigned(_G(b, c, d), x), ac));
		return addUnsigned(rotateLeft(a, s), b);
	};

	var _HH = function (a, b, c, d, x, s, ac) {
		a = addUnsigned(a, addUnsigned(addUnsigned(_H(b, c, d), x), ac));
		return addUnsigned(rotateLeft(a, s), b);
	};

	var _II = function (a, b, c, d, x, s, ac) {
		a = addUnsigned(a, addUnsigned(addUnsigned(_I(b, c, d), x), ac));
		return addUnsigned(rotateLeft(a, s), b);
	};

	var convertToWordArray = function (str) {
		var lWordCount;
		var lMessageLength = str.length;
		var lNumberOfWords_temp1 = lMessageLength + 8;
		var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
		var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
		var lWordArray = new Array(lNumberOfWords - 1);
		var lBytePosition = 0;
		var lByteCount = 0;
		while (lByteCount < lMessageLength) {
			lWordCount = (lByteCount - (lByteCount % 4)) / 4;
			lBytePosition = (lByteCount % 4) * 8;
			lWordArray[lWordCount] = (lWordArray[lWordCount] | (str.charCodeAt(lByteCount) << lBytePosition));
			lByteCount++;
		}
		lWordCount = (lByteCount - (lByteCount % 4)) / 4;
		lBytePosition = (lByteCount % 4) * 8;
		lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
		lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
		lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
		return lWordArray;
	};

	var wordToHex = function (lValue) {
		var wordToHexValue = "",
			wordToHexValue_temp = "",
			lByte, lCount;
		for (lCount = 0; lCount <= 3; lCount++) {
			lByte = (lValue >>> (lCount * 8)) & 255;
			wordToHexValue_temp = "0" + lByte.toString(16);
			wordToHexValue = wordToHexValue + wordToHexValue_temp.substr(wordToHexValue_temp.length - 2, 2);
		}
		return wordToHexValue;
	};

	var x = [],
		k, AA, BB, CC, DD, a, b, c, d, S11 = 7,
		S12 = 12,
		S13 = 17,
		S14 = 22,
		S21 = 5,
		S22 = 9,
		S23 = 14,
		S24 = 20,
		S31 = 4,
		S32 = 11,
		S33 = 16,
		S34 = 23,
		S41 = 6,
		S42 = 10,
		S43 = 15,
		S44 = 21;

	str = this.utf8_encode(str);
	x = convertToWordArray(str);
	a = 0x67452301;
	b = 0xEFCDAB89;
	c = 0x98BADCFE;
	d = 0x10325476;

	xl = x.length;
	for (k = 0; k < xl; k += 16) {
		AA = a;
		BB = b;
		CC = c;
		DD = d;
		a = _FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
		d = _FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
		c = _FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
		b = _FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
		a = _FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
		d = _FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
		c = _FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
		b = _FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
		a = _FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
		d = _FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
		c = _FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
		b = _FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
		a = _FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
		d = _FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
		c = _FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
		b = _FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
		a = _GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
		d = _GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
		c = _GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
		b = _GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
		a = _GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
		d = _GG(d, a, b, c, x[k + 10], S22, 0x2441453);
		c = _GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
		b = _GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
		a = _GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
		d = _GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
		c = _GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
		b = _GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
		a = _GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
		d = _GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
		c = _GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
		b = _GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
		a = _HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
		d = _HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
		c = _HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
		b = _HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
		a = _HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
		d = _HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
		c = _HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
		b = _HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
		a = _HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
		d = _HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
		c = _HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
		b = _HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
		a = _HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
		d = _HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
		c = _HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
		b = _HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
		a = _II(a, b, c, d, x[k + 0], S41, 0xF4292244);
		d = _II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
		c = _II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
		b = _II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
		a = _II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
		d = _II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
		c = _II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
		b = _II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
		a = _II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
		d = _II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
		c = _II(c, d, a, b, x[k + 6], S43, 0xA3014314);
		b = _II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
		a = _II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
		d = _II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
		c = _II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
		b = _II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
		a = addUnsigned(a, AA);
		b = addUnsigned(b, BB);
		c = addUnsigned(c, CC);
		d = addUnsigned(d, DD);
	}

	var temp = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);

	return temp.toLowerCase();
}

var system = require('system');

// Read the passed args
var urls;
if (system.args.length > 1) {
	urls = Array.prototype.slice.call(system.args, 1);
} else {
	console.log("Usage: phantomjs clearly.js [url1, url2, ...]");
	phantom.exit();
}

// ��Ϊ���е�URL���첽��ʼ�����, ÿ��URL���֮����Ҫ��ѯ, ȷ���Ƿ����еĶ������
var queue = {};

// ������ʼ������URL
for (var i=0, length=urls.length; i<length; i++) {
	// @TODO ������ļ������ȷ��, ������URL��ַƥ��
	var url = urls[i], filename = (new Date).getTime() + ".html";

	queue[url] = false;

	console.log("Start process #" + (i+1) + " {" + url + "}");

	clearly(url, filename, function (_i) {
		return function (url, file) {
			console.log("Finish process #" + (_i+1) + " {" + url + "} to {" + file + "}");

			var all_finished = true;

			for (var id in queue) {
				if (queue.hasOwnProperty(id) && (queue[id] === false)) {
					all_finished = false;
					break;
				}
			}

			if (all_finished) {
				console.log("All urls are processed");
				phantom.exit();
			}
		};
	}(i));
}
