/**
 * <code>
 * AresComfirm 认证框
 * 
 * </code>
 */
define(function(require, exports) {
	var TAG = "AresComfirm";
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
		var ele = widget;
		var params = '';
		widget.on('click',function(){
			params = ele.attr('data-getParam');
			params = app[params] && app[params]();
			if(params){
				$.get("page/bnbWeb/public/confirm/confirmTpl.html", {}, function(tpl_html) {
					var html = juicer(tpl_html, {
						"transinfo" : params.transinfo,
						"payeeNo" : YT.Format.fmtAcctNo(params.payeeNo,"", 1),
						"payeeAmt" : params.payeeAmt,
						"butinfo" : params.butinfo
					});
					panel.append(html);
					YT.Sms.initSmsController(panel, app, json);
					if ((params.vertype).indexOf("IMG") > -1) {
						$(".img-verif").removeClass("hidden");
						var imgUrl = "/mobilebank/web/WebImageCode.do" + "?s=" + sessionStorage.getItem("SESSION_TOKEN") + "&t=" + (new Date()).getTime()
						$(".img-verif .ui-value img").attr("src", imgUrl);
						$(".confirm-tpl").on("click",".img-verif .ui-value img",function() {
							var imgUrl = "/mobilebank/web/WebImageCode.do" + "?s=" + sessionStorage.getItem("SESSION_TOKEN") + "&t=" + (new Date()).getTime()
							$(this).attr("src", imgUrl);
						});
					}
					// 绑定事件
					$(".confirm-tpl").on("click", ".sms-verif button", function() {
						YT.Client._getSmsVerifCode(params.smsInfo);
					});
					$(".confirm-tpl").on("click", ".close", function() {
						$(".confirm-tpl").remove();
					});
					$(".confirm-tpl").on("click", ".confirm-btn", function() {
						var param = {};
						if (params.vertype.indexOf("IMG") > -1) {
							// 图形验证
							var imgCode = $(".img-verif input").val();
							if (YT.isEmpty(imgCode)) {
								YT.alertinfo("请输入4位图形验证码");
								return;
							}
							param.imgCode = imgCode;
						}
						// 短信验证
						var smsCode = $(".sms-verif input").val();
						if (YT.isEmpty(smsCode)) {
							YT.alertinfo("请输入6位短信验证码");
							return;
						}
						param.vertype = "SMS";
						param.smsCode = smsCode;
						app[params.callback] && app[params.callback]()
						$(".confirm-tpl").remove();
					});
					$(".confirm-tpl").removeClass("hidden");
				});
			}
		})
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