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
	var me = YT.CheckSms = {
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
	    setCode : function(param,callback){
	    	var url = YT.dataUrl("general/checkSmsCode", false);
			YT.openWaitPanel();
			YT.ajaxData(url, param, function(data) {
				YT.hideWaitPanel(100);
				console.log(data)
				callback&&callback(data);
			});
	    }

		

		
		
	};

}());