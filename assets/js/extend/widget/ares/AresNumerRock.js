/**
 * <code>
 * AresNumerRock.js 数字滚动组件
 * 
 * <span class="amt" data-value="${YSTD_INCOME}" data-extlib="AresNumerRock"></span>
 * 
 * </code>
 */
define(function(require, exports) {
	var TAG = "AresDemo";
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
		var value = widget.attr("data-value");
		var opts = {
			lastNumber : 1 * value || 0,
			duration : 1000,
			easing : 'swing' // swing(默认 : 缓冲 : 慢快慢) linear(匀速的)
		};
		YT.log.info("number rock ", opts);
		widget.animate({
			num : "numberRock"
		}, {
			duration : opts.duration,
			easing : opts.easing,
			complete : function() {
				YT.log.info("success");
			},
			step : function(a, b) { // 可以检测我们定时器的每一次变化
				// YT.log.info(a);
				// YT.log.info(b.pos); // 运动过程中的比例值(0~1)
				widget.html(YT.Format.fmtAmt(b.pos * opts.lastNumber));
			}
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