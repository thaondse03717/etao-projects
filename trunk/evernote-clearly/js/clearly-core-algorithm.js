// ÿ���ڵ������
_result = {
	'__index': _global__element_index,				// Ԫ�ر��,
	'__node': _node,											// �ڵ�ָ��

	'_is__container':											// �Ƿ�������, ����ȫ�����ú�nodeName�ж�,
	'_is__candidate': false,									// �Ƿ�����ѡ��
	'_is__text': false,											// �Ƿ����ı��ڵ�
	'_is__link': false,											// �Ƿ��ǳ����ӽڵ�
	'_is__link_skip': false,									// �Ƿ��Ǻ������еĳ����ӽڵ�
	'_is__image_small': false,								// �Ƿ���Сͼ, С��150*150
	'_is__image_medium': false,						// �Ƿ�����ͼ, ����150*150
	'_is__image_large': false,								// �Ƿ��Ǵ�ͼ, 375*75
	'_is__image_skip': false,								// �Ƿ��Ǻ������е�ͼƬ,

	'_debug__above__plain_text': _global__above__plain_text,					// ��ǰ�ҵ��������ı�, ��������
	'_debug__above__links_text': _global__above__links_text,					// ��ǰ�ҵ������д�, ��������

	'_length__above_plain_text': _global__length__above_plain_text,		// ��ǰ�ҵ��������ı�����, ����������
	'_count__above_plain_words': _global__count__above_plain_words,	// ��ǰ�ҵ������д�����, ����������

	'_length__above_links_text': _global__length__above_links_text,		// ��ǰ�ҵ������г������ı�����
	'_count__above_links_words': _global__count__above_links_words,	// ��ǰ�ҵ������г����Ӵ�����

	'_length__above_all_text': (_global__length__above_plain_text + _global__length__above_links_text),			// ��ǰ�ҵ��������ı�����, ��������
	'_count__above_all_words': (_global__count__above_plain_words + _global__count__above_links_words),	// ��ǰ�ҵ������д�����, ��������

	'_count__above_candidates': _global__count__above_candidates,		// ��ǰ�ҵ��ĺ�ѡԪ������
	'_count__above_containers': _global__count__above_containers,		// ��ǰ�ҵ�����������

	'_length__plain_text': 0,					// �ڲ��ı��ڵ���ı�����, ��������
	'_count__plain_words': 0,				// �ڲ��ı��ڵ�Ĵ�����, ����������

	'_length__links_text': 0,					// �ڲ��������ӵ��ı�����
	'_count__links_words': 0,					// �ڲ��������ӵĴ�����

	'_length__all_text': 0,						// �ڲ�����Ԫ�ص��ı�����, ��������
	'_count__all_words': 0,						// �ڲ�����Ԫ�صĴ�����, ��������

	'_count__containers': 0,					// �ڲ�����������
	'_count__candidates': 0,					// �ڲ��ĺ�ѡԪ������

	'_count__links': 0,							// �ڲ���������
	'_count__links_skip': 0,					// �ڲ���������������

	'_count__images_small': 0,				// �ڲ�Сͼ����
	'_count__images_medium': 0,			// �ڲ���ͼ����
	'_count__images_large': 0,				// �ڲ���ͼ����
	'_count__images_skip': 0					// �ڲ�������ͼƬ����
};

// �����ڵ������
details = {
	// paragraphs
	_count__lines_of_65_characters: _e._length__plain_text / 65,						// ��65�ֻ��е�����
	_count__paragraphs_of_3_lines: _r._count__lines_of_65_characters / 3,		// ��65�ֻ���, 3��Ϊ�εĶ���
	_count__paragraphs_of_5_lines: _r._count__lines_of_65_characters / 5,		// ��65�ֻ���, 5��Ϊ�εĶ���
	_count__paragraphs_of_50_words: _e._count__plain_words / 50,				// ��50�ʷֶεĶ���
	_count__paragraphs_of_80_words: _e._count__plain_words / 80,				// ��80�ʷֶεĶ���

	// total text
	_ratio__length__plain_text_to_total_plain_text: _e._length__plain_text / _main._length__plain_text,				// ���ı�����ռ���ڵ������ı���
	_ratio__count__plain_words_to_total_plain_words: _e._count__plain_words / _main._count__plain_words,	// ���ı�����ռ���ڵ�����ı���

	// links
	_ratio__length__links_text_to_plain_text: _e._length__links_text / _e._length__plain_text,					// Ԫ���е������ı�ռ���ı����ȵı���
	_ratio__count__links_words_to_plain_words: _e._count__links_words / _e._count__plain_words,		// Ԫ���е����Ӵ���ռ���ı������ı���
	_ratio__length__links_text_to_all_text: _e._length__links_text / _e._length__all_text,							// Ԫ���е������ı�ռȫ���ı����ȵı���
	_ratio__count__links_words_to_all_words: _e._count__links_words / _e._count__all_words,				// Ԫ���е����Ӵ���ռȫ�������ı���
	_ratio__length__links_text_to_total_links_text: _e._length__links_text / (_main._length__links_text + 1),				// Ԫ���е������ı�ռ���ڵ��ı����ȵı���
	_ratio__count__links_words_to_total_links_words: _e._count__links_words / (_main._count__links_words + 1),	// Ԫ���е����Ӵ���ռ���ڵ�����ı���
	_ratio__count__links_to_total_links: _e._count__links / (_main._count__links + 1),								// Ԫ���еĳ�������ռ���ڵ��������ı���
	_ratio__count__links_to_plain_words: (_e._count__links * 2) / _e._count__plain_words,						// Ԫ���еĳ�������ռ���ı������ı���

	// text above
	// _divide__candidates = Math.max(2, Math.ceil(_e._count__above_candidates * 0.5)),
	// _above_text = ((0 + (_e._length__above_plain_text * 1) + (_e._length__above_plain_text / _divide__candidates)) / 2),
	// _above_words = ((0 + (_e._count__above_plain_words * 1) + (_e._count__above_plain_words / _divide__candidates)) / 2,
	_ratio__length__above_plain_text_to_total_plain_text: _above_text / _main._length__plain_text,					// Ԫ��ǰ��Ĵ��ı�����ռ���ڵ㴿�ı����ȵı���
	_ratio__count__above_plain_words_to_total_plain_words: _above_words / _main._count__plain_words,		// Ԫ��ǰ��Ĵ��ı�����ռ���ڵ㴿�ı������ı���

	// candidates
	_ratio__count__candidates_to_total_candidates: _e._count__candidates / (_main._count__candidates + 1),		// �����ĺ�ѡԪ����ռ�ܺ�ѡԪ�����ı���
	_ratio__count__containers_to_total_containers: _e._count__containers / (_main._count__containers + 1),			// ������������ռ���������ı���
};

// �÷��㷨

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
