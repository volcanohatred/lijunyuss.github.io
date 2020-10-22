/**
 * <code>
 * AresPicker picker相关工具类 
 * </code>
 */
define(function(require, exports) {
	var TAG = "AresPicker";
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
		YT.log.info('init begin');
		var xclazz = widget.attr('data-x-clazz');
		var elem = widget.find(".x-picker-name");
		if (!YT.isEmpty(xclazz)) {
			elem = widget.find(xclazz);
		}
		if (elem.length < 1) {
			return;
		}
		var url = elem.data("goto");
		elem.on("click", function() {
			var sendStr = $(this).attr('data-send-data');
			var formJson = {};
			if(!YT.isEmpty(sendStr)){
				formJson = YT.JsonEval(sendStr);
			}
			
			var func = elem.attr('data-callback');
			func = YT.getFunctionName(app[func]);
			elem.attr('data-func', func);
			var params = {
				panel : panel,
				params : formJson
			}
			
			YT.nextPage(url, params);
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