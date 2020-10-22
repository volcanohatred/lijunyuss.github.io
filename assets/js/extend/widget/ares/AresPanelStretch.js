/**
 * <code>
 * AresPanelStretch 分类表单
 *
 *
 * </code>
 */
define(function(require, exports) {
	var TAG = "AresPanelStretch";
	YT.log.debug("---内部组件--init----", TAG);
	// 内部组件不提供外部调用支持
	var me = {};// me为当前控件的函数命名空间
	/**
	 * <code>
	 * 初始化控件的事件、值、展现等信息
	 *
	 * @param widget 当前组件
	 * @param panel 当前容器作用域，通常为page容器
	 * @param app 处理器
	 * @param json 数据处理
	 * </code>
	 */
	me.init = function(widget, panel, app, json) {
		YT.log.info('init begin', TAG);
		me.initTitleStretch(widget, panel, app, json);
		me.initPanelStretch(widget, panel, app, json);
		YT.log.info('init finish', TAG);
	};
	/**
	 * 面板伸展
	 */
	me.initPanelStretch = function(widget, panel, app, json) {
		var stretch = widget.find('.y-stretch-button');
		if (stretch.length < 1) {
			YT.log.info('stretch is empty', TAG);
			return;
		}
		var callback = widget.attr('data-callback');// 回调函数
		stretch.on('click', function(e) {
			var hasCurrent = widget.find('.y-stretch-header').hasClass(
					'current');
			if (hasCurrent) {// 当前节点可视状态
				widget.find('.y-stretch-header').removeClass('current');
				widget.find('.y-stretch-body').addClass('hidden');
				callback && app[callback](hasCurrent, widget);
			} else {// 当前节点不可视状态
				callback && app[callback](hasCurrent, widget);
				widget.find('.y-stretch-header').addClass('current');
				widget.find('.y-stretch-body').removeClass('hidden');
			}
		});
	};
	/**
	 * 标题栏伸展
	 */
	me.initTitleStretch = function(widget, panel, app, json) {
		var icons = widget.find('.ui-icon-stretch');
		if (icons.length < 1) {
			YT.log.info('icons is empty', TAG);
			return;
		}
		icons.on('click', function(e) {
			var ele = $(e.currentTarget);// 获取当前元素节点
			var hasCurrent = widget.find('.y-stretch-header').hasClass(
					'current');
			if (hasCurrent) {// 当前节点可视状态
				widget.find('.y-stretch-header').removeClass('current');
				ele.removeClass('ui-icon-upArrow');
				ele.addClass('ui-icon-downArrow');
				widget.find('.y-stretch-body').addClass('hidden');
			} else {// 当前节点不可视状态
				widget.find('.y-stretch-header').addClass('current');
				ele.removeClass('ui-icon-downArrow');
				ele.addClass('ui-icon-upArrow');
				widget.find('.y-stretch-body').removeClass('hidden');
			}
		});
	};
	/**
	 * <code>
	 * 重置控件的值、展现等信息，不含事件定义
	 *
	 * @param widget 当前组件
	 * @param panel 当前容器作用域，通常为page容器
	 * @param app 处理器
	 * @param json 数据处理
	 * </code>
	 */
	me.reset = function(widget, panel, app, json) {
		YT.log.info('reset begin', TAG);
		YT.log.info('reset finish', TAG);
	};

	// 组件的外置接口
	exports.init = me.init;
	exports.reset = me.reset;

})