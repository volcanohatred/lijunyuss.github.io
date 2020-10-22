/**
 * <code>
 * AresFormat 前端模版格式化函数扩展
 * 
 * </code>
 */
define(function(require, exports) {
	var TAG = "AresFormat";
	YT.log.debug("---内部组件--init----", TAG);
	var me = YT.AresFormat = {};// me为当前控件的函数命名空间

	/**
	 * 获取图片全路径
	 * 
	 * @param url
	 *            (img/face.png)
	 * @returns http://host:port/serviceName/img/face.png
	 */
	me.aresFmtImgUrl = function(url) {
		if (YT.isEmpyt(url)) {
			return '';
		}
		url = (url.indexOf("/") == 0) ? url : ("/" + url);
		return basePath + url;
	};

	/**
	 * 注册到juicer
	 */
	YT.each(me, function(prop, fun) {
		if (YT.isFunction(fun)) {
			juicer.register(prop, fun);
		}
	});

})