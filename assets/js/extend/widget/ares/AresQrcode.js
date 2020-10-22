/**
 * <code>
 * AresQrcode 二维码生成
 * </code>
 */
define(function(require, exports) {
	var TAG = "AresQrcode";
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
		var showLogo = widget.attr('data-isLogo');// 是否显示二维码中间logo
		var _callback = widget.attr('data-callback');// 回调函数，用于传入二维码参数信息
		var options = {
			render : "image",
			typeNumber : -1,// 计算级别
			ecLevel : "H",// 识别度
			correctLevel : "2",
			fill : '#000',// 二维码颜色
			background : '#ffffff',// 背景颜色
			foreground : "#000000", // 前景颜色
			quiet : 1,// 边距
			width : 200,// 宽度
			height : 200,
			text : ''
		};
		if (!YT.isEmpty(showLogo)) {
			options.mode = 4;
			options.mSize = 15 * 0.01;
			options.mPosX = 50 * 0.01;
			options.mPosY = 50 * 0.01;
			options.image = widget.find(showLogo)[0];
			// 用于中心图片信息预加载
			widget.find('.y-qrcode').qrcode(options).empty();
		}
		function createQrcode(_text) {// 回调函数，用于接收调用者传入的二维码内容
			options.text = _text;
			widget.find('.y-qrcode').empty().qrcode(options);
		}
		if (!YT.isEmpty(_callback)) {
			_callback && app[_callback](createQrcode);
		} else {
			YT.alertinfo('二维码生成参数异常');
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