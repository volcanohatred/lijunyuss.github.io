/**
 * <code>
 * AresEnable 使能组件
 * 
 * 用来控制表单提交按钮或其它元素的有效性状态，disabled
 * 
 * <button id="submit" data-extlib="AresEnable" data-submit="submit">提交</button>
 * 
 * 触发控制 
 * 
 * </code>
 */
define(function(require, exports) {
	var TAG = "AresEnable";
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
		var reset = function() {
			YT.log.debug("--reset--todo--", TAG);
			if (YT.Form.readyLock(panel)) {
				widget.attr("disabled", "");
			} else {
				widget.removeAttr("disabled");
			}
		}
		widget.on("reset", reset);// 注册重置事件
		reset();
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
		widget.trigger("reset");
		YT.log.info('reset finish', TAG);
	};

	// 组件的外置接口
	exports.init = me.init;
	exports.reset = me.reset;

})