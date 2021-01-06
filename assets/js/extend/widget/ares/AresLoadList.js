/**
 * 
 * 已废弃功能
 * 
 * <code>
 * AresLoadList 列表模版组件
 * 
 * 列表模版组件自动触发器
 * 
 * </code>
 */
define(function(require, exports) {
	var TAG = "AresLoadList";
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
		widget.attr("data-ready", "true");
		// 列表记录模版
		var tplUrl = widget.attr("data-list");
		// 事件触发器
		var func = widget.attr("data-event");
		if (app.TAG && tplUrl && func) {
			YT.AjaxUtil.getPage(app.TAG + tplUrl, {}, app[func]);
		}
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