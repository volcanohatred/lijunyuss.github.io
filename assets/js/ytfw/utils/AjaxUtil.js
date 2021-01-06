/**
 * ajax工具类
 */
(function () {
	$.postAjax = {};
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
		ajaxData: function (cfg) {
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
		onceAjaxData: function (url, params, success, failure) {
			var timestamp = (new Date()).getTime();
			var tempParams = YT.apply({}, params);
			if ($.postAjax.lastRequest) {
				if ((timestamp - $.postAjax.lastRequest['timestamp'] < 5000) && tempParams &&
					(JSON.stringify($.postAjax.lastRequest['params']) === JSON.stringify(tempParams))) {
					// 防止重复提交（简单处理）
					YT.alertinfo("交易处理中，请勿重复提交！");
					return;
				} else {
					$.postAjax.lastRequest['params'] = tempParams;
					$.postAjax.lastRequest['timestamp'] = timestamp;
				}
			} else {
				$.postAjax.lastRequest = {
					params: tempParams,
					timestamp: timestamp
				};
			}
			onceSuccess = function (rst) {
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
		loadPage: function (pageHandle, url, params, callback, app) {
			me.getOflPackContent(url, function (rsp) {
				var tpl_html = rsp.DATA;
				var html = YT.template(tpl_html, params);
				pageHandle.html(html);
				app && (YT.Form.initPanel(pageHandle, app, params));
				callback && callback(params);
			}, function () {
				YT.showTips('加载模板失败!');
				callback && callback(params);
			})
		},
		/**
		 * 加载模板页面
		 * 
		 * @param url
		 *            页面路径
		 * @param params
		 *            初始化参数
		 * @param callback
		 *            回调方法
		 */
		getPage: function (url, params, success, error) {
			me.getOflPackContent(url, function (rsp) {
				var tpl_html = rsp.DATA;
				success && success(tpl_html);
			}, function () {
				if (error) {
					error && error();
				} else {
					YT.showTips('加载模板失败!');
					success && success('加载模板失败!');
				}
			})
		},
		/**
		 * 获取模板信息
		 */
		getTemplate: function (url, success, error) {
			$.ajax({
				url: url,
				type: 'get',
				// cache: false,
				success: function (txt) {
					success && success(txt);
				},
				error: function () {
					error && error();
				}
			});
		},
		// 获取离线包内容
		getOflPackContent: function (url, success, error) {
			// 本地开发模式
			// Device.YiTong 客户端是否支持离线包
			if (window.OFFLINE_PACKAGE_DEV === true || Device.YiTong !== true) {
				me.getTemplate(url, function (tpl) {
					var data = {
						DATA: tpl,
						STATUS: "1"
					}
					success && success(data)
				}, function () {
					var data = {
						DATA: '加载模板失败!',
						STATUS: "1"
					}
					error && error(data)
				})
				return false
			}

			var offLine = '1' // 离线包开关 1: 离线包状态 0: 非离线包状态
			if (window.OFFLINE_PACKAGE === false) { // 关闭离线包
				offLine = '0'
			}
			YT.Client.getModuleContent({
				url: url,
				OFF_LINE: offLine
			}, function (rst) {
				if (rst.STATUS == '1') {
					var s = rst.DATA || '';
					s = decodeURIComponent(s);
					//					s = s.replace(/&quot;/g, '"');
					//					s = s.replace(/&#39;/g, '\'');
					//					s = s.replace(/&lt;/g, '<');
					//					s = s.replace(/&gt;/g, '>');
					rst.DATA = s;
					success && success(rst);
				} else {
					error && error('加载模板失败!');
				}
			})
		},
		// 获取离线包内容（页面跳转时使用）
		nextPageNative: function (url, success, error) {
			// 本地开发模式
			// Device.YiTong 客户端是否支持离线包
			if (window.OFFLINE_PACKAGE_DEV === true || Device.YiTong !== true) {
				me.getTemplate(url, function (tpl) {
					var data = {
						DATA: tpl,
						STATUS: "1"
					}
					success && success(data)
				}, function () {
					var data = {
						DATA: '加载模板失败!',
						STATUS: "1"
					}
					error && error(data)
				})
				return false
			}

			var offLine = '1' // 离线包开关 1: 离线包状态 0: 非离线包 
			if (window.OFFLINE_PACKAGE === false) { // 关闭离线包
				offLine = '0'
			}
			YT.Client.nextPageNative({
				url: url,
				OFF_LINE: offLine
			}, function (rst) {
				if (rst.STATUS == '1') {
					var s = rst.DATA || '';
					s = decodeURIComponent(s);
					//					s = s.replace(/&quot;/g, '"');
					//					s = s.replace(/&#39;/g, '\'');
					//					s = s.replace(/&lt;/g, '<');
					//					s = s.replace(/&gt;/g, '>');
					rst.DATA = s;
					success && success(rst);
				} else {
					error && error('加载模板失败!');
				}
			})
		}
	}
}());