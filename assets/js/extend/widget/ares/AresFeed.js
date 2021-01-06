/**
 * <code>
 * AresFeed 页面跳转，可以将值回显到上一页面 
 * 因为会出现当前页面data-name的值 和跳转之后的页面中的数据key不一致，需要用data-keys属性将key值转换一下
 * 例如：
 * 当前页面
 * <div class="ui-form-item ui-border-b ui-form-link">
		<label>收款银行</label>
		<input type="text" data-name="BANK_NAME" readonly data-required="true" data-label="收款银行"
			placeholder="点击选择收款银行" data-keys="BANK_NAME=DREC_BANK_NAME,BANK_CODE=DREC_BANK_CODE"
			data-extlib="AresFeed" data-goto="page/public/picker/picker_bank/picker_bank.html">
		<input type="hidden" placeholder="收款行行号" data-name="BANK_CODE">
	</div>
	跳转页面中的数据
	{
		"DREC_BANK_CODE" : "301290000007",
		"BANK_TYPE" : "04",
		"DREC_BANK_NAME" : "交通银行",
	}
 * </code>
 * <i class="ui-icon-personal"
	data-keys="PAYEE_NAME,DREC_BANK_NAME,PAYEE_ACCT,DREC_BANK_CODE"
	data-extlib="AresFeed" data-goto="page/public/picker/picker_payee/picker_payee.html"></i>
 */
define(function(require, exports) {
	var TAG = "AresFeed";
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
		new AresFeed(widget, panel, app, json).initEvent();
		YT.log.info('init finish', TAG);
	};
	var AresFeed = function(widget, panel, app, json){
		this.widget = widget;
		this.panel = panel;
		this.app = app;
		this.json = json;
	}
	//初始化事件
	AresFeed.prototype.initEvent = function(){
		var thizz = this;
		var widget = this.widget;
		var url = widget.data("goto");
		if(YT.isEmpty(url)){
			return false;
		}
		widget.off('click');
		widget.on("click", function() {
			var func = YT.getFunctionNameCross(YT.bind(thizz.feedback,thizz));
			var params = {
				func : func
			}
			var data = widget.attr('data-send-data');
			if(!YT.isEmpty(data)){
				YT.apply(params,YT.JsonEval(data));
			}
			YT.nextPage(url, params);
		});
	}
	//回显赋值
	AresFeed.prototype.feedback = function(data){
		var widget = this.widget;
		var app = this.app;
		var panel = this.panel;
		var keys = widget.attr('data-keys');
		var params = YT.Form.dataKeys(keys, data);
		YT.Form.setFormJson(panel, params);// 信息回显
		var callback = widget.attr('data-callback');
		callback && app[callback] && app[callback](data);
	}
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