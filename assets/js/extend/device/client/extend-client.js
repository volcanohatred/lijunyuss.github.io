$(function() {
	var TAG = "extend-client:YT.Client";
	/**
	 * @fileOverview 客户端交互方法定义（ios与android相同）自定义扩展
	 * @nameSpace YT.Client(client)
	 */
	var me = {
		// 执行客户端的方法是调用 YT.Client.callHandler("callLiveness",JSON.stringify(cfg));
		/**
		 * @description 人脸识别
		 * @param {function}
		 *            callback 回调函数
		 * @example YT.Client.liveFaceCheck(callback);
		 */
		liveFaceCheck : function(callback) {
			try {
				callback = YT.getFunctionName(callback);
				var cfg = {
					callback : callback,
				};
				YT.Client.callHandler("callLiveness", JSON.stringify(cfg));
			} catch (e) {
				alertinfo('调用人脸识别组件异常', 'getNativeCache:' + e);
			}
		}
	};
	YT.apply(YT.Client, me);
});
