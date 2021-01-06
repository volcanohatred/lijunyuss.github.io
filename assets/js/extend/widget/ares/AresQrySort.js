/**
 * <code>
 * 
 * 已废弃功能， 
 * 
 * 相关功能请参考：
 * 1.AresSortBar  数据库排序
 * 
 * -----------------------------------
 * AresQrySort 列表排序组件
 * 
 * <h1>已弃用，可参考AresSortBar 组件</h1>
 * 
 * </code>
 */
define(function(require, exports) {
	var TAG = "AresQrySort";
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
		var callback = widget.attr('data-callback');// 回调函数
		// 绑定绑定事件
		widget.on('click', '.y-sort', function() {
			var radio = $(this).find('input[type=radio]');// 获取当前点击的单选框
			var name = radio.attr('name');
			var radios = widget.find('input[type=radio]').filter(
					'[name=' + name + ']');
			radios.each(function() {
				$(this).removeAttr("checked");
			});
			if ($(this).hasClass('sort-desc')) {// 判断当前为降序时，调整为升序
				$(this).removeClass('sort-desc');
				$(this).addClass('sort-asc');
				$(this).find('.y-sort-desc').removeAttr('checked');
				$(this).find('.y-sort-asc').attr('checked', 'true');
			} else {// 否则调整为降序
				$(this).removeClass('sort-asc');
				$(this).addClass('sort-desc');
				$(this).find('.y-sort-asc').removeAttr('checked');
				$(this).find('.y-sort-desc').attr('checked', 'true');
			}
			app[callback] && app[callback]();
		});
		YT.log.info('init finish', TAG);
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