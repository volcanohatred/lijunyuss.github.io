/**
 * <code>
 * AresLink 跳转事件处理
 * 
 1、示例：
  <button class="ui-btn-lg ui-btn-primary" data-link="page/04/0403/P0403.html" 
  			data-keys="*" data-check="true"
			data-extlib="AresLink">购买</button>
			
 2、参数说明：
	data-check:是否验证表单
	data-link: 是否跳转页面
	data-keys: 页面请求参数定制
	
	注意：作用域 panel的范围
 * 
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
		var url = widget.data("link");
		var keys = widget.attr("data-keys");
		var check = widget.attr("data-check");
		widget.off("click");
		widget.on("click", function(e) {
			e && e.stopPropagation();// 阻断事件冒泡
			YT.log.debug('link:', url, ',params:', data);
			// 验证参数
			if (check == "true" && !YT.Form.validator(panel)) {
				return;
			}
			// 获取变量
			var data = YT.Form.getFormJson(panel, json);
			var params = YT.Form.dataKeys(keys, data);
			// 页面跳转
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