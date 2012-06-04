/**
 * ������Ʒ��Ŀ�༶�����Զ�����jQuery���
 * ����Ʒ��Ŀ�۸���������, ����Ŀ�¼���Ʒ���õ�
 *
 * ʹ�÷����� /templates/category_offlines/add.php
 *
 * $('#categories').categories({
 * 		count: 4,
 * 		onChange: function (data) {
 * 			$('#category_id').attr('value', data.id);
 * 			$('#category_id').next('label.error').remove();
 * 		}
 * 	});
 *
 * @author	 tomato <wangshijun2010@gmail.com>
 * @copyright	(c) 2011 www.taobao.com
 * @see �������ĩβ��Ĭ���������˵��
 * @version	1.0
 */

(function ($) {

$.fn.categories = function (options) {
	var options = $.extend(categories.defaults, options || {});
	var apis = {
		children: '?c=categories&f=children&category_id=',
		path: '?c=categories&f=path&category_id=',
		name: '?c=categories&f=name&category_id='
	};

	if (options.apis) {
		apis = $.extend(apis, options.apis);
	}

	var prefix = {id: 'select-', selector: '#select-'};

	return $(this).each(function () {
		// �����Ƿ��ʼ���ı�־����
		$.data(this, 'initialized', false);
		var self = this;

		self.uuids = [];

		// Ϊ��1��select���valueΪ-1��option
		var start_category = options.start_category ? options.start_category : -1;
		var loader = $('<select><option value="' + start_category + '" selected="selected">��������Ŀ</option></select>');

		// ���Ӹ�����Ŀselect������
		// ���︽����1�����ص�span#select_0, ���ڴ���������Ŀ�ļ���
		for (var i=0; i<=options.count+1; i++) {
			self.uuids[i] = categories.uuid();
			if (i == 0) {
				$(this).append(options.container.clone().attr('id', prefix.id + self.uuids[i]).append(loader).hide());
			} else {
				$(this).append(options.container.clone().attr('id', prefix.id + self.uuids[i]));
			}
			$(prefix.selector + self.uuids[i]).attr('load_next_on_change', i < options.count+1);
		}

		// Ϊ�����б��ѡ���¼��󶨼�����
		$('select', this).live('change', function () {

			// ��Ϊ��ʱ����ֻ��Ҫǰ������Ŀ, ����Ǽ���Ŀ�����仯ʱ����ajax����
			if ($(this).parent('span').attr('load_next_on_change') == false) {
				return false;
			}

			var category_id = $('option:selected', this).attr('value');
			var category_name = $('option:selected', this).text();
			var target_id = $(this).parent('span').next('span').attr('id');

			// ���ѡ����������Ŀ(value=-1)�����Ѿ���ʼ��, ���������Ŀѡ��
			// ���Ұ�ѡ����ĿID����Ϊ��ǰ�ȼ��ϼ���Ŀ��ѡ�е���ĿID, ��Ϊ����������Ŀ
			if ((category_id == '-1') && ($.data(self, 'initialized') == true)) {
				$(this).parent('span').nextAll('span').empty();
				var selected = $(this).parent('span').prev('span').find('select');
				if (selected) {
					category_id = $('option:selected', selected).attr('value');
					category_name = $('option:selected', selected).text();
				}

			// ����ajax������ѡ�е���Ŀ������Ŀ
			} else {
				$.data(self, 'initialized', true);
				if ($(this).is(':not(categories span:last)')) {
					$(this).parent('span').nextAll('span').empty();
				}
				$.get(apis.children + category_id, function (data) {
					$('#'+target_id).html(data);
					if ($.isFunction(options.onComplete)) {
						options.onComplete(data);
					}
				});
			}

			// �������������ID
			if ($.isFunction(options.onChange)) {
				options.onChange({
					id: category_id,
					name: category_name
				});
			}
		});

		// ���г�ʼ��, ����������Ŀ�ļ���
		loader.trigger('change');

		// ����û�ָ���˱�����ѡ��ֵ(�����ڶ�����Ŀ, Ҳ������������ȵ�����Ŀ����)
		// ����Ҫ����1���ĳ�ʼ������, �������ͨ�������ݼ�¼�ı༭ҳ�����
		if (options.category_id) {
			$.getJSON(apis.path + options.category_id, function (data) {
				log(data);

				var category_ids = [], category_names = [];
				for (var category_id in data) {
					if (data.hasOwnProperty(category_id)) {
						category_ids.push(category_id);
						category_names.push(data[category_id]);
					}
				}

				if (category_ids.length >= 1) {

					self.category_ids = category_ids;
					self.category_names = category_names;
					self.current = 0;

					startQueue();
				}
			});
		}

		// ������Ŀ�㼶���ض༶��Ŀ, �൱��1��Ajax����
		function startQueue() {
			log('self.current: ' + self.current + ' path.current: ' + self.category_ids[self.current]);

			if (self.current == (self.category_ids.length - 1)) {
				log('children categories queue completed: ' + self.category_ids.length);

				var select = prefix.selector + (self.uuids[self.current + 1]);
				$(select).find('option:selected').removeAttr('selected');
				$(select).find('option[value="' + self.category_ids[self.current] + '"]').attr('selected', 'selected');

				log('queue complete selector: ' + select + ':option[value="' + self.category_ids[self.current] + '"]');

				// ���м�����Ϻ�����������ID
				if ($.isFunction(options.onChange)) {
					options.onChange({
						id: self.category_ids[self.current],
						name:  self.category_names[self.current]
					});
				}
				return false;

			} else {
				$(prefix.selector + (self.uuids[self.current + 2])).load(apis.children + self.category_ids[self.current], function (data) {
					log('children categories for parent category: ' + self.category_ids[self.current] + ' loaded');

					var select = prefix.selector + (self.uuids[self.current + 1]);
					$(select).find('option:selected').removeAttr('selected');
					$(select).find('option[value=' + self.category_ids[self.current] + ']').attr('selected', 'selected');

					self.current++;
					startQueue();
				});
			}
		}

	});

	function log(message) {
		if (options.debug && window.console && window.console.log) {
			window.console.log(message);
		}
	}
};

// Ĭ��ѡ��
var categories = {
	defaults: {
		count: 4,									// ���֧�ּ�����Ŀչʾ
		category_id: false,					// Ĭ��ѡ���ĸ���Ŀ
		start_category: false,				// ���ĸ���Ŀ��Ϊ����Ŀ
		onChange: function () {},			// ������仯ʱ�Ļص�
		onComplete: function () {},		// ÿ��Ajax�������
		container: $('<span class="select"></span>'), // ÿ����Ŀselect������
		debug: false,
		apis: false
	},
	random: function() {
		return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
	},
	uuid: function() {
		return (
			categories.random() + categories.random() + "-" +
			categories.random() + "-" +
			categories.random() + "-" +
			categories.random() + "-" +
			categories.random() +
			categories.random() +
			categories.random()
		);
	}
};

// ��Ĭ��ѡ��ӵ����API��, ����.�������趨
// �� $.fn.categories.defaults.apis = 'blah blah';
$.extend($.fn.categories, categories.defaults);

})(jQuery);

