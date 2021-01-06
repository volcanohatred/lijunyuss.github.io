/**
 * <code>
 * AresSwipe 滑动轮播组件
 *
 *	<div class="swiper-container" data-extlib="AresSwipe" data-params="a=xx,b=xx,c=xx" data-id=".swiper-container">
 *		<div class="swiper-wrapper">
 *			<div class="swiper-slide">Slide 1</div>
 *			<div class="swiper-slide">Slide 2</div>
 *		</div>
 *		<!-- Add Pagination -->
 *		<div class="swiper-pagination"></div>
 *	</div>
 *
 * </code>
 */
define(function(require, exports) {
	var TAG = "AresSwipe";
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
		var params = {};
		var keys = widget.attr('data-params').split(",");
		YT.log.info('init keys:', keys);
		for (var i in keys) {
			var key = keys[i];
			var items = key.split(/=|:/);
			var k = items[0], v = items.length > 1 ? items[1] : "";
			(!isNaN(v)) && (v=parseFloat(v))
			switch (v) {
				case 'true':v=true;break;
				case 'false':v=false;break;
			}
			YT.log.info("key:", key, " v:", v, " index:", i);
			params[k] = v;
		}
		var swiper = new Swiper(widget.attr('data-id'), params);
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