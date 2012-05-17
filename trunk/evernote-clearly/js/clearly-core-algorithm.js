// 每个节点的属性
_result = {
	'__index': _global__element_index,				// 元素编号,
	'__node': _node,											// 节点指针

	'_is__container':											// 是否是容器, 根据全局配置和nodeName判断,
	'_is__candidate': false,									// 是否加入候选集
	'_is__text': false,											// 是否是文本节点
	'_is__link': false,											// 是否是超链接节点
	'_is__link_skip': false,									// 是否是黑名单中的超链接节点
	'_is__image_small': false,								// 是否是小图, 小于150*150
	'_is__image_medium': false,						// 是否是中图, 大于150*150
	'_is__image_large': false,								// 是否是大图, 375*75
	'_is__image_skip': false,								// 是否是黑名单中的图片,

	'_debug__above__plain_text': _global__above__plain_text,					// 此前找到的所有文本, 包含连接
	'_debug__above__links_text': _global__above__links_text,					// 此前找到的所有词, 包含连接

	'_length__above_plain_text': _global__length__above_plain_text,		// 此前找到的所有文本长度, 不包含连接
	'_count__above_plain_words': _global__count__above_plain_words,	// 此前找到的所有词数量, 不包含连接

	'_length__above_links_text': _global__length__above_links_text,		// 此前找到的所有超链接文本长度
	'_count__above_links_words': _global__count__above_links_words,	// 此前找到的所有超链接词数量

	'_length__above_all_text': (_global__length__above_plain_text + _global__length__above_links_text),			// 此前找到的所有文本长度, 包含连接
	'_count__above_all_words': (_global__count__above_plain_words + _global__count__above_links_words),	// 此前找到的所有词数量, 包含连接

	'_count__above_candidates': _global__count__above_candidates,		// 此前找到的候选元素数量
	'_count__above_containers': _global__count__above_containers,		// 此前找到的容器数量

	'_length__plain_text': 0,					// 内部文本节点的文本长度, 包含链接
	'_count__plain_words': 0,				// 内部文本节点的词数量, 不包含连接

	'_length__links_text': 0,					// 内部所有连接的文本长度
	'_count__links_words': 0,					// 内部所有连接的词数量

	'_length__all_text': 0,						// 内部所有元素的文本长度, 包含链接
	'_count__all_words': 0,						// 内部所有元素的词数量, 包含链接

	'_count__containers': 0,					// 内部的容器数量
	'_count__candidates': 0,					// 内部的候选元素数量

	'_count__links': 0,							// 内部链接数量
	'_count__links_skip': 0,					// 内部黑名单链接数量

	'_count__images_small': 0,				// 内部小图数量
	'_count__images_medium': 0,			// 内部中图数量
	'_count__images_large': 0,				// 内部大图数量
	'_count__images_skip': 0					// 内部黑名单图片数量
};

// 单个节点的详情
details = {
	// paragraphs
	_count__lines_of_65_characters: _e._length__plain_text / 65,						// 按65字换行的行数
	_count__paragraphs_of_3_lines: _r._count__lines_of_65_characters / 3,		// 按65字换行, 3行为段的段数
	_count__paragraphs_of_5_lines: _r._count__lines_of_65_characters / 5,		// 按65字换行, 5行为段的段数
	_count__paragraphs_of_50_words: _e._count__plain_words / 50,				// 按50词分段的段数
	_count__paragraphs_of_80_words: _e._count__plain_words / 80,				// 按80词分段的段数

	// total text
	_ratio__length__plain_text_to_total_plain_text: _e._length__plain_text / _main._length__plain_text,				// 纯文本字数占根节点字数的比例
	_ratio__count__plain_words_to_total_plain_words: _e._count__plain_words / _main._count__plain_words,	// 纯文本次数占根节点词数的比例

	// links
	_ratio__length__links_text_to_plain_text: _e._length__links_text / _e._length__plain_text,					// 元素中的连接文本占纯文本长度的比例
	_ratio__count__links_words_to_plain_words: _e._count__links_words / _e._count__plain_words,		// 元素中的连接词数占纯文本词数的比例
	_ratio__length__links_text_to_all_text: _e._length__links_text / _e._length__all_text,							// 元素中的连接文本占全部文本长度的比例
	_ratio__count__links_words_to_all_words: _e._count__links_words / _e._count__all_words,				// 元素中的连接词数占全部词数的比例
	_ratio__length__links_text_to_total_links_text: _e._length__links_text / (_main._length__links_text + 1),				// 元素中的连接文本占根节点文本长度的比例
	_ratio__count__links_words_to_total_links_words: _e._count__links_words / (_main._count__links_words + 1),	// 元素中的连接词数占根节点词数的比例
	_ratio__count__links_to_total_links: _e._count__links / (_main._count__links + 1),								// 元素中的超链接数占根节点链接数的比例
	_ratio__count__links_to_plain_words: (_e._count__links * 2) / _e._count__plain_words,						// 元素中的超链接数占纯文本词数的比例

	// text above
	// _divide__candidates = Math.max(2, Math.ceil(_e._count__above_candidates * 0.5)),
	// _above_text = ((0 + (_e._length__above_plain_text * 1) + (_e._length__above_plain_text / _divide__candidates)) / 2),
	// _above_words = ((0 + (_e._count__above_plain_words * 1) + (_e._count__above_plain_words / _divide__candidates)) / 2,
	_ratio__length__above_plain_text_to_total_plain_text: _above_text / _main._length__plain_text,					// 元素前面的纯文本长度占根节点纯文本长度的比例
	_ratio__count__above_plain_words_to_total_plain_words: _above_words / _main._count__plain_words,		// 元素前面的纯文本词数占根节点纯文本词数的比例

	// candidates
	_ratio__count__candidates_to_total_candidates: _e._count__candidates / (_main._count__candidates + 1),		// 包含的候选元素数占总候选元素数的比例
	_ratio__count__containers_to_total_containers: _e._count__containers / (_main._count__containers + 1),			// 包含的容器数占总容器数的比例
};

// 得分算法

_points_history.unshift((
	(0
		+ (_details._count__paragraphs_of_3_lines)
		+ (_details._count__paragraphs_of_5_lines * 1.5)
		+ (_details._count__paragraphs_of_50_words)
		+ (_details._count__paragraphs_of_80_words * 1.5)
		+ (_e._count__images_large * 3)
		- ((_e._count__images_skip + _e._count__images_small) * 0.5)
	) * 1000));

_points_history.unshift((
	(0
		+ (_points_history[0] * 3)
		+ (_points_history[0] / _divide__pieces)
		+ (_points_history[0] / _divide__candidates)
		+ (_points_history[0] / _divide__containers)
	) / 6));

computePoints(0.10, 2, (1 - (1 - _details._ratio__length__plain_text_to_total_plain_text)), _points_history);
computePoints(0.10, 2, (1 - (1 - _details._ratio__count__plain_words_to_total_plain_words)), _points_history);

computePoints(0.10, 5, (1 - _details._ratio__length__above_plain_text_to_total_plain_text), _points_history);
computePoints(0.10, 5, (1 - _details._ratio__count__above_plain_words_to_total_plain_words), _points_history);

computePoints(0.75, 1, (1 - _details._ratio__length__links_text_to_total_links_text), _points_history);
computePoints(0.75, 1, (1 - _details._ratio__count__links_words_to_total_links_words), _points_history);
computePoints(0.75, 1, (1 - _details._ratio__count__links_to_total_links), _points_history);

computePoints(__lr, 1, (1 - _details._ratio__length__links_text_to_plain_text), _points_history);
computePoints(__lr, 1, (1 - _details._ratio__count__links_words_to_plain_words), _points_history);
computePoints(__lr, 1, (1 - _details._ratio__length__links_text_to_all_text), _points_history);
computePoints(__lr, 1, (1 - _details._ratio__count__links_words_to_all_words), _points_history);
computePoints(__lr, 1, (1 - _details._ratio__count__links_to_plain_words), _points_history);

computePoints(0.75, 1, (1 - _details._ratio__count__candidates_to_total_candidates), _points_history);
computePoints(0.75, 1, (1 - _details._ratio__count__containers_to_total_containers), _points_history);
computePoints(0.75, 1, (1 - _details._ratio__count__pieces_to_total_pieces), _points_history);

computePoints = function (_ratio_remaining, _power, _ratio, _points_history) {
	var _points_remaining = (_points_history[0] * _ratio_remaining),
		_points_to_compute = (_points_history[0] - _points_remaining);
	if (_ratio < 0) {
		_points_return = _points_remaining;
	} else {
		_points_return = 0 + _points_remaining + (_points_to_compute * Math.pow(_ratio, _power));
	}
	// add
	_points_history.unshift(_points_return);
};
