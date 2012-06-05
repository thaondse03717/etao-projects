/**
 * 引擎商品类目多级级联自动加载jQuery插件
 * 在商品类目价格区间设置, 按类目下架商品中用到
 *
 * 使用方法见 /templates/category_offlines/add.php
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
 * @see 插件代码末尾的默认设置项的说明
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
		// 设置是否初始化的标志参数
		$.data(this, 'initialized', false);
		var self = this;

		self.uuids = [];

		// 为第1个select添加value为-1的option
		var start_category = options.start_category ? options.start_category : -1;
		var loader = $('<select><option value="' + start_category + '" selected="selected">所有子类目</option></select>');

		// 附加各级类目select的容器
		// 这里附加了1个隐藏的span#select_0, 用于触发顶级类目的加载
		for (var i=0; i<=options.count+1; i++) {
			self.uuids[i] = categories.uuid();
			if (i == 0) {
				$(this).append(options.container.clone().attr('id', prefix.id + self.uuids[i]).append(loader).hide());
			} else {
				$(this).append(options.container.clone().attr('id', prefix.id + self.uuids[i]));
			}
			$(prefix.selector + self.uuids[i]).attr('load_next_on_change', i < options.count+1);
		}

		// 为下拉列表的选择事件绑定监听者
		$('select', this).live('change', function () {

			// 因为有时可能只需要前几级类目, 最后那级类目发生变化时无需ajax请求
			if ($(this).parent('span').attr('load_next_on_change') == false) {
				return false;
			}

			var category_id = $('option:selected', this).attr('value');
			var category_name = $('option:selected', this).text();
			var target_id = $(this).parent('span').next('span').attr('id');

			// 如果选择了所有类目(value=-1)并且已经初始化, 则清空子类目选择
			// 并且把选中类目ID设置为当前等级上级类目被选中的类目ID, 因为是所有子类目
			if ((category_id == '-1') && ($.data(self, 'initialized') == true)) {
				$(this).parent('span').nextAll('span').empty();
				var selected = $(this).parent('span').prev('span').find('select');
				if (selected) {
					category_id = $('option:selected', selected).attr('value');
					category_name = $('option:selected', selected).text();
				}

			// 否则ajax加载所选中的类目的子类目
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

			// 最后更新隐藏域的ID
			if ($.isFunction(options.onChange)) {
				options.onChange({
					id: category_id,
					name: category_name
				});
			}
		});

		// 进行初始化, 触发顶级类目的加载
		loader.trigger('change');

		// 如果用户指定了本来的选中值(可能在顶级类目, 也可能在任意深度的子类目下面)
		// 则需要做进1步的初始化处理, 这种情况通常在数据记录的编辑页面出现
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

		// 按照类目层级加载多级类目, 相当于1个Ajax队列
		function startQueue() {
			log('self.current: ' + self.current + ' path.current: ' + self.category_ids[self.current]);

			if (self.current == (self.category_ids.length - 1)) {
				log('children categories queue completed: ' + self.category_ids.length);

				var select = prefix.selector + (self.uuids[self.current + 1]);
				$(select).find('option:selected').removeAttr('selected');
				$(select).find('option[value="' + self.category_ids[self.current] + '"]').attr('selected', 'selected');

				log('queue complete selector: ' + select + ':option[value="' + self.category_ids[self.current] + '"]');

				// 队列加载完毕后更新隐藏域的ID
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

// 默认选项
var categories = {
	defaults: {
		count: 4,									// 最大支持几级类目展示
		category_id: false,					// 默认选中哪个类目
		start_category: false,				// 以哪个类目作为根类目
		onChange: function () {},			// 隐藏域变化时的回调
		onComplete: function () {},		// 每次Ajax请求结束
		container: $('<span class="select"></span>'), // 每个类目select的容器
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

// 把默认选项附加到插件API上, 可以.操作符设定
// 如 $.fn.categories.defaults.apis = 'blah blah';
$.extend($.fn.categories, categories.defaults);

})(jQuery);

