/**
 * ajax工具类
 */
(function() {
	$.postAjax={};
	var me = YT.AjaxUtil = {
		/**
		 * @Desc 客户端native ajax 请求
		 * @param url
		 *            {url} 请求地址
		 * @param params
		 *            {json} 请求参数
		 * @param success
		 *            {string} 成功回调函数名称
		 * @param failure
		 *            {string} 失败回调函数名称
		 * @example YT.ajaxData('/mbank/login/login.do',{p1:'x'},'success');
		 */
		ajaxData : function(cfg) {
			if (!cfg.failure) {
				cfg.failure = cfg.success;
			}
			// 报文防重放
			var date = new Date().format("yyyyMMddhhmmssS");
			cfg.params.REQ_TIME = date;
			new YT.TransAjax().post(cfg);
		},
		/**
		 * @Desc 控制重复提交和重复报文ajax 请求
		 * @param url
		 *            {url} 请求地址
		 * @param params
		 *            {json} 请求参数
		 * @param success
		 *            {string} 成功回调函数名称
		 * @param failure
		 *            {string} 失败回调函数名称
		 * @example YT.onceAjaxData('/mbank/login/login.do',{p1:'x'},'success');
		 */
		onceAjaxData : function(url, params, success, failure) {
			var timestamp = (new Date()).getTime();
			var tempParams = YT.apply({}, params);
			if ($.postAjax.lastRequest) {
				if ((timestamp - $.postAjax.lastRequest['timestamp'] < 5000) && tempParams
						&& (JSON.stringify($.postAjax.lastRequest['params']) === JSON.stringify(tempParams))) {
					// 防止重复提交（简单处理）
					YT.alertinfo("交易处理中，请勿重复提交！");
					return;
				} else {
					$.postAjax.lastRequest['params'] = tempParams;
					$.postAjax.lastRequest['timestamp'] = timestamp;
				}
			} else {
				$.postAjax.lastRequest = {
					params : tempParams,
					timestamp : timestamp
				};
			}
			onceSuccess = function(rst) {
				if (rst && rst.STATUS === "1") {
					params.CHECK_TOKEN = "Y";
					params.REPEAT_TOKEN = rst.REPEAT_TOKEN;
					YT.ajaxData(url, params, success, failure);
				} else {
					YT.alertinfo("数据请求失败,请查询交易结果，不要重复提交数据！");
					YT.hideWaitPanel();
				}
			};
			var onceUrl = YT.dataUrl("common/onceTokenGet");
			YT.ajaxData(onceUrl, "{}", onceSuccess, failure);
		},
		/**
		 * 同步加载页面等文本
		 * 
		 * @param url
		 * @return text
		 */
		ajaxText : function(url) {
			return $.ajax({
				url : url,
				async : false,
			}).responseText;
		},
		/**
		 * @Desc 加载页面模板
		 * @param page
		 *            页面对象
		 * @param tplUrl
		 *            页面模板路径
		 * @param params
		 *            初始化页面参数
		 * @param callback
		 *            回调方法
		 * @param app
		 *            功能控制器
		 */
		loadPage : function(pageHandle, tplUrl, params, callback, app){
			var url = YT.formatUrl(tplUrl);
			$.ajax({
				url : url,
				data : {},
				type : 'get',
				cache:false,
				success : function(tpl_html){
					var html = YT.template(tpl_html, params);
					pageHandle.html(html);
					pageHandle.removeClass('ui-prev-loading');
					app && (YT.Form.initPanel(pageHandle, app, params));
					callback && callback(params);
				},
				error : function(){
					YT.showTips('加载模板失败!');
					callback && callback(params);
				}
			});
		},
		/**
		 *  加载模板页面
		 * @param url 
		 * 			页面路径
		 * @param params
		 * 			初始化参数
		 * @param callback
		 * 			回调方法
		 */
		getPage : function(url,params,callback){
			var tplUrl = YT.formatUrl(url);
			$.ajax({
				url : tplUrl,
				data : params,
				type : 'get',
				cache:false,
				success : function(tpl_html){
					callback && callback(tpl_html);
				},
				error : function(){
					YT.showTips('加载模板失败!');
					callback && callback('加载模板失败!');
				}
			});
		}
	}
}());