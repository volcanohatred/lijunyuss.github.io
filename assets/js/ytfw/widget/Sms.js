/**
 * @author 李俊羽
 * @since 2017-12-20
 * @version 1.0
 * @Desc 发送短信验证码组件<code>
 * 识别标识：y-sms
 * 组件属性：
 * [data-name]验证码输入框数值字段；
 * [data-url]动码请求地址；默认common/smsCodeSend
 * [data-send-clazz]内部组件作用区域识别标识
 * 内部组件识别标识：x-sms-send 短信码发送按钮
 * 外部组件识别标识：r-sms-send 短信流水号区域 非必要
 * </code>
 */
(function() {
	var me = YT.Sms = {
		/**
		 * 初始化短信控件相关事件
		 * 
		 * @param panel
		 *            作用域
		 * @param app
		 *            处理器
		 * @param json
		 *            初始数据
		 */
		initSmsController : function(panel, app, json) {
			var elem = panel.find(".y-sms"); // 组件自身区域
			if (elem.length < 1) {
				return;
			}
			var xelem = elem.find(".x-sms-send");// 内部组件区域
			if (xelem.length < 1) {
				YT.log.error("---YT.Sms---", "not found 'x-sms-send' define");
				return;
			}
			me.relem = panel.find(".r-sms-send"); // 外部组件 短信流水号
			var url = elem.data("url") || "sms/smsSend"; // 请求接口链接
			if (url) {
				// 发送短信验证码的上送参数获取
				var clazz = elem.data("send-clazz");
				var callback = elem.data("callback");// 回调函数
				var preCheck = function() {
					if (!YT.isEmpty(callback)) {// 存在回调函数
						return app[callback]();
					} else {// 获取默认的接口信息
						// 页面元素校验
						var form = panel.find(clazz);
						if (!YT.Form.validator(form)) {
							return false;
						}
						// 获取页面元素值
						var params = YT.Form.getFormJson(form);
						var tranCode = elem.attr('data-tranCode');
						params.SMS_TYPE = 'CHKCODE';
						params.TRAN_CODE = tranCode;
						return params;
					}
				}
				me.timer = me.counttime = elem.data("timer") || 60;
				me.openTimerListener(xelem, {}, preCheck, function() {
					YT.log.info("---sms.callback---");
				}, url);
			}
		},
		/**
		 * 获取短信验证码
		 */
		getSmsCode : function(ele, param, callback, url) {
			var me = this;
			url = YT.dataUrl(url);
			YT.ajaxData(url, param, function(rsp) {
				YT.hideWaitPanel();
				if (rsp.STATUS == '1') {
					YT.showTips('短信已发送!');
					if (me.relem && me.relem.length > 0) {
						// 外部组件往短信流水号区域写入流水号字段
						if (me.relem.data("flow-no-name") < 1) {
							Fw.log.warn("---YT.Sms---", "'r-send-sms' data-flow-no-name is not defined");
						}
						me.relem.find("input").val(rsp[me.relem.data("flow-no-name") || "SMS_FLOW_NO"]);
					}
					callback && callback();
				} else {
					YT.alertinfo(rsp.MSG);
				}
			}, function(data) {
				YT.hideWaitPanel();
				YT.alertinfo(data ? data.MSG : "网络失败，请稍后重试");
			});
		},

		openTimerListener : function(ele, param, preCheck, callback, url) {
			param === undefined && (param = {});
			var me = this;
			ele.on('click', function() {
				// 执行预处理方法
				if (preCheck) {
					var reqJson = preCheck();
					if (!reqJson) {
						return;
					}
					$.extend(param, reqJson);
				}
				me._initTime = new Date().getTime() - 1000;
				me._sumTime = me.counttime;
				me.getSmsCode(ele, param, function() {
					me._startTimerListener(ele);
				}, url);
				//me._startTimerListener(ele);
			});
		},

		/**
		 * 打开短信验证码计时器
		 */
		_startTimerListener : function(ele) {
			var me = this;
			if (me.timer > 0) {
				var time = me._getTimer();
				me.timer = me._sumTime - time;
				if (me.timer > 0) {
					ele.text(me.timer + '秒');
					ele.attr("disabled", true);
				} else {
					me._closeTimerListener(ele);
					return;
				}
			} else {
				me._closeTimerListener(ele);
				return;
			}
			me.intervalID = setTimeout(function() {
				me._startTimerListener(ele);
			}, 1000);
		},
		_getTimer : function() {
			var me = this;
			var time = new Date().getTime();
			return Math.floor((time - me._initTime) / 1000);
		},
		/**
		 * 清除计时器
		 * 
		 * @param id
		 */
		_closeTimerListener : function(ele) {
			var me = this;
			if (me.intervalID) { // 当intervalID存在时，清空
				clearTimeout(me.intervalID);
				ele.removeAttr("disabled");// 启用按钮
				ele.text("重新发送");
				me.timer = me.counttime;
				me.intervalID = null;
			}
		}
	};

}());