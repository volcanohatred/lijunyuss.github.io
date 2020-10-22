/**
 * 登录用户登录系统后的Session信息
 */
(function() {
	var me = YT.Session = {
		/**
		 * @Desc 获取登录系统后存储session信息，json类型，数据内容变化极小的
		 * @param callback {function} 获取到回调
		 * @example YT.getSession('App.getSession');
		 */
		getSession : function(callback) {
			try {
				var loginsession = YT.JsonEval(sessionStorage.getItem("loginsession"));
				if (!YT.isEmpty(loginsession)) {// 默认先取缓存
					callback(loginsession);
				} else {// 第一次访问从后端加载数据
					var url = YT.dataUrl("common/querySessionInfo");
					YT.ajaxData(url, {}, function(rst) {
						if (rst && rst.STATUS == "1") {
							sessionStorage.setItem("loginsession", JSON.stringify(rst));
							callback(rst);
						} else { // 回话超时
							YT.alertinfo(rst.MSG, "获取用户登录信息异常");
							YT.hideWaitPanel();
						}
					}, function() {
						YT.alertinfo("获取用户登录信息异常");
					});
				}
			} catch (e) {
				YT.log.debug(e);
			}
		}
	}
}());