/**
 * @fileOverview 异步请求工具类，不支持跨域访问
 * @nameSpace YT.Ajax
 */
YT.Ajax = function (config) {
	YT.apply(this, config);
	YT.Ajax.superclass.constructor.call(this);
	return this;
};
YT.extend(YT.Ajax, YT.util.Observable, {
	autoLoad: true,
	autoDecode: true,
	params: {},
	/**
	 * @description 加载数据/页面
	 * @param options
	 */
	load: function (options) {
		var me = this
		YT.apply(me.params, options);
		me.lastOptions = options;
		if (me.fireEvent('beforeload', me) !== false) {
			me.isLoading = true;
			YT.log.debug('--ajax.url---', me.url);
			YT.ajaxData(me.url, me.params, function (data) {
				me.fireEvent('load', me, data);
				me.isLoading = false;
			})
		}
	},
	/**
	 * @description 重载
	 */
	reload: function () {
		this.load(this.lastOptions);
	}
});
(function () {
	YT.TransAjax = function () {
		return {
			_timeoutflg: true, // 是否超时信息的标记
			options: {
				// 超时时长
				timeout: 120000,
				// 是否显示错误信息
				showError: true,
				// 只加载文本
				loadText: false
			},
			init: function (conf) {
				YT.apply(this.options, conf);
			},
			clear: function () {
				// 取消超时提醒时，需调用此方法。
				this._timeoutflg = false
				if (this._timeoutHandle) {
					clearTimeout(this._timeoutHandle);
				}
			},
			start: function () {},
			newXhr: function () {
				var xmlHttpObj = null
				try {
					xmlHttpObj = new XMLHttpRequest()
				} catch (e) {}
				return xmlHttpObj;
			},
			loadData: function (conf) {
				YT.log.debug('---ajaxData-init----', 'TransAjax')
				conf = YT.apply({
					loadText: false,
					mediaType: 'application/json'
				}, conf);
				this.post(conf);
			},
			sendData: function (ajax, xhr, opts, paramText) {
				xhr.send(paramText);
				if (opts.timeout > 0) {
					ajax._timeoutHandle = setTimeout(function () {
						if (xhr && ajax._timeoutflg) {
							YT.hideWaitPanel();
							xhr.abort();
							if (opts.showError) {
								YT.alertinfo(NS.MSG.MsgAjaxError);
							}
							YT.Collection.timeUrl(opts.url, "120"); // 通讯超时，用于行为采集请求日志通讯
						}
					}, opts.timeout);
				}
			},
			checkRspData: function (opts, rspData) {
				if (rspData) {
					if (rspData.STATUS == '005') { // Session超时
						YT.hideWaitPanel();
						setTimeout(function () {
							YT.Client.sessionTimeout();
						}, 500);
						return;
					} else if (rspData.STATUS == '006') { // 重复提交
						YT.hideWaitPanel();
						YT.alertinfo('' + rspData.MSG);
						return;
					} else if (rspData.STATUS != '1') { // 状态码非成功状态
						opts.failure && opts.failure(rspData);
						return;
					}
					opts.success && opts.success(rspData);
				} else {
					if (opts.showError) {
						YT.alertinfo(NS.MSG.MsgAjaxError);
					}
					opts.failure && opts.failure(rspData);
				}
			},
			post: function (conf) {
				var encryptType = YT.Client.encryptType || 0; // 报文加密方式
				var ajax = this;
				var opts = ajax.options;
				YT.apply(opts, conf);
				ajax.start();
				var xhr = this.newXhr();
				var encryptKey = "";
				xhr.onreadystatechange = function () {
					var me = this;
					if (me.readyState == 4) {
						if (me.status == 200) {
							ajax.clear();
							var rspText = me.responseText;
							YT.log.debug("[" + ajax.options.url + "]\n rsp:" + rspText);
							if (encryptType != 0) { // 是否通讯解密
								var _rspdecrypt = rspText;
								if (YT.Client.isGateWay) { // 是否网关通讯
									var _rpdata = YT.JsonEval(rspText);
									var _head = _rpdata.head; // 网关通讯报文头
									var _body = _rpdata.body; // 网关通讯报文体
									if (YT.isObject(_body)) { // body 返回对象时，为失败交易，此时body为空对象
										_head.MSG = _head.H_MSG;
										_head.STATUS = _head.H_STATUS;
										ajax.checkRspData(opts, _head);
									} else {
										try {
											var _decData = YT.Security.decrypt(_body, encryptKey);
											_decData = YT.JsonEval(_decData)
											ajax.checkRspData(opts, _decData);
										} catch (e) {
											YT.log.debug(e);
											YT.hideWaitPanel();
											YT.alertinfo("通讯报文解密失败！");
											opts.failure && opts.failure(_rpdata);
										}
									}
								} else {
									try {
										var _decData = YT.Security.decrypt(_rspdecrypt, encryptKey);
										_decData = YT.JsonEval(_decData)
										ajax.checkRspData(opts, _decData);
									} catch (e) {
										YT.log.debug(e);
										YT.hideWaitPanel();
										YT.alertinfo("通讯报文解密失败！");
										opts.failure && opts.failure(rspData);
									}
								}


							} else { // 非通讯加密
								var _rpdata = YT.JsonEval(rspText);
								if (YT.Client.isGateWay) { // 是否网关通讯
									var _head = _rpdata.head; // 网关通讯报文头
									var _body = _rpdata.body; // 网关通讯报文体
									_body.STATUS = _body.STATUS ? _body.STATUS : _head.H_STATUS;
									_body.MSG = _body.MSG ? _body.MSG : _head.H_MSG;
									if (_head && _body) {
										if (!YT.isEmpty(_head.H_UPS_SID)) {
											YT.Client._head = _head; // 用于其他数据保存操作
											YT.Client.upsSid = _head.H_UPS_SID; // 保存相关的用户登录数据
										}
									}
									ajax.checkRspData(opts, _body);
								} else {
									ajax.checkRspData(opts, _rpdata);
								}
							}
						} else {
							if (opts.showError) {
								YT.alertinfo(NS.MSG.MsgAjaxError);
							}
						}
					}
				}
				xhr.open('POST', opts.url, true);
				xhr.setRequestHeader('Content-Type', opts.mediaType || 'application/json');
				var param = opts.param || opts.params || {};
				var json = {};
				if (YT.Client.isGateWay) { // 连接网关进行通讯报文组装
					var head = {};
					head.H_CHNL_ID = '' + YT.Client.chnlId; // 渠道号
					var date = new Date();
					var time = date.getTime();
					head.H_TIME = '' + time; // 客户端时间戳
					head.H_TIME_OFFSET = '' + YT.Client.timeOffSet; // 客户端与服务端时间偏差值
					head.H_NONCE = '' + YT.guid(); // 交易请求唯一ID
					head.H_UPS_SID = '' + YT.Client.upsSid; // SessionId
					json.head = head;
					json.body = param;
				} else { // 非网关交易通讯
					json = param; // 请求参数赋值
				}
				if (encryptType != 0) { // 判断报文体加密是否加密
					YT.log.debug("[" + ajax.options.url + "]\n req:" + YT.JsonToStr(json));
					encryptKey = YT.Security.getEncryptKey();
					if (YT.Client.isGateWay) { // 网关报文加密
						var aesdata = YT.Security.encrypt(json.body, encryptKey);
						json.body = aesdata;
						YT.log.debug("[" + ajax.options.url + "]\n Encrypt-req:" + YT.JsonToStr(json));
						ajax.sendData(ajax, xhr, opts, YT.JsonToStr(json)); // 发送请求
					} else { // 非网关通讯报文加密
						var aesdata = YT.Security.encrypt(json, encryptKey);
						YT.log.debug("[" + ajax.options.url + "]\n Encrypt-req:" + aesdata);
						ajax.sendData(ajax, xhr, opts, aesdata); // 发送请求
					}
				} else {
					YT.log.debug("[" + ajax.options.url + "]\n req:" + YT.JsonToStr(json));
					console.log(YT.JsonToStr(json))
					ajax.sendData(ajax, xhr, opts, YT.JsonToStr(json)); // 发送请求
				}
			}
		};
	};
})();