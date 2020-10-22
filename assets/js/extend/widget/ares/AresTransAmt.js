/**
 * <code>
 * AresTransAmt 转账金额组件
 * 
 * 对金额输入组件提供如下扩展：
 * 1、转账金额必需大于零元；
 * 2、转账金额不能超出付款账号余额；
 * 
 * 构成关系
 * 1、付款账号余额【data-bal='.r-amt-alive-num'】
 * 关联处理
 * 1、汇路更新
 * 
 * </code>
 */
define(function(require, exports) {
	var TAG = "AresTransAmt";
	YT.log.debug("---内部组件--init----", TAG);
	// 内部组件不提供外部调用支持
	var me = {};// me为当前控件的函数命名空间
	/**
	 * 初始化控件的事件、值、展现等信息
	 * 
	 * @param widget
	 *            当前组件
	 * @param panel
	 *            当前容器作用域，通常为page容器
	 * @param app
	 *            处理器
	 * @param json
	 *            数据处理
	 * 
	 */
	me.init = function(widget, panel, app, json) {
		YT.log.info('init begin', TAG);
		var eleBalClazz = widget.attr("data-bal") || ".r-amt-alive-num";// 付款账号余额-外联标记
		var transAmtElem = widget.find("[data-name]");// 转账金额输入框
		transAmtElem.on("validator", function() {
			var min = 0;
			var max = 0;
			var eleBal = panel.find(eleBalClazz);// 付款账号余额- 组件
			var bal = eleBal.text() || "0";// 取余额
			max = Math.max(0, parseFloat(YT.Format.delFmtMony(bal)));
			var amt = parseFloat(YT.Format.delFmtMony(transAmtElem.val()));// 转账金额
			amt = Math.max(0, amt);
			if (YT.isEmpty(eleBalClazz, false) || (amt <= 0)) {
				YT.showTips("转账金额必须大于0.00元，请重新输入！");
				transAmtElem.attr("data-check", "false");
				return;
			}
			if (max == 0) {
				YT.showTips("您的可用余额不足，请更换付款账号！");
				transAmtElem.attr("data-check", "false");
				return;
			}
			if (max < amt) {
				YT.showTips("您的可用余额不足，请重新输入！");
				transAmtElem.attr("data-check", "false");
				return;
			}
			transAmtElem.removeAttr("data-check");// 验证通过
		});

		var eleNoticeClazz = widget.attr("data-notices");
		var eleNotices = panel.find("." + eleNoticeClazz);
		transAmtElem.on("input", function() {
			// 后续处理：触发汇路更新
			YT.Form.resetWidget(eleNotices, panel, app, json);
		});
		
		YT.log.info('init finish', TAG);
	};

	/**
	 * 重置控件的值、展现等信息
	 * 
	 * @param widget
	 *            当前组件
	 * @param panel
	 *            当前容器作用域，通常为page容器
	 * @param app
	 *            处理器
	 * @param json
	 *            数据处理
	 * 
	 */
	me.reset = function(widget, panel, app, json) {
		YT.log.info('init begin', TAG);
		// 金额格式化

		YT.log.info('reset finish', TAG);
	};

	// 组件的外置接口
	exports.init = me.init;
	exports.reset = me.reset;

})