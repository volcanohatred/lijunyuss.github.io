/**
 * 
 * 
 * <code>
 * 已废弃功能， 
 * 
 * 相关功能请参考：
 * 1.AresList		不分页列表
 * 2.AresListView	分页列表
 * 
 * -------------------------
 * AresListEvent 非分页列表事件处理
 * 
 * 通过转账金额、收款行来更新转账汇路
 * 
 * </code>
 */
define(function(require, exports) {
	var TAG = "AresListEvent";
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
		// 取数据
		var dataStr = widget.attr("data-item");
		var data = YT.JsonEval(dataStr) || json;
		YT.log.info("item:", data);
		// 页面跳转
		YT.Form.dataLink(widget, data);
		// 点击事件
		YT.Form.dataListEvent(widget, data, app);

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