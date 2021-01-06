/**
 * <code>
 * AresPop 弹出式账户列表
 * 
 * </code>
 */
define(function(require, exports) {
	var TAG = "AresPop";
	YT.log.debug("---内部组件--init----", TAG);
	// 内部组件不提供外部调用支持
	var me = {};// me为当前控件的函数命名空间
	me.bankTplBefore = [// 
	'<div class="ui-popup-overlay hidden"></div>',// 
	'<div class="ui-popup-modal-view">',//
	'	<div class="ui-popup-modal-group">',// 
	'		<div class="ui-popup-modal-label ui-border-b yui-height50">',//
	'			<i class="ui-icon-close-pithy cancel"></i>${title}<i class="sure hidden">确定</i>',// 
	'		</div>',//
	'		<div class="accontList">',// 
	'			<div class="ui-list yui-scroll200">' ].join('');
	me.bankTplAfter = [
	/*
	 * '<div class="zui-list-item yui-border-b">'+ '<div class="ui-avatar-min">'+ '<img
	 * src="assets/img/bankList/add.png">'+ '</div>'+ '<div class="ui-list-info">'+ '<h4 class="ui-nowrap">添加银行卡</h4>'+ '<h4 class="ui-nowrap">仅支持储蓄卡</h4>'+ '</div>'+ '</div>'+
	 */
	'			</div>',//
	'		</div>',//
	'	</div>',//
	'</div>' ].join('');
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

		// me.hidePopupPanel(widget, panel, app, json);

		var modalView = widget.find('.ui-popup-modal-view');
		var overlay = widget.find('.ui-popup-overlay');
		var item = widget.attr('data-target');
		var callBack = widget.attr('data-callBack');
		var title = widget.attr('data-title');
		var url = YT.dataUrl(widget.attr('data-url'), true);
		var params = (widget.attr('data-params') && app[widget.attr('data-params')]()) || {};
		var tplUrl = widget.attr('data-tplUrl');

		if (modalView.length == 0) {
			YT.getPage(tplUrl, {}, function(tpl_html) {
				YT.ajaxData(url, params, function(data) {
					if (data.STATUS == '1') {// 交易成功
						YT.apply(data, {
							title : title
						})
						widget.html(YT.template(me.bankTplBefore + tpl_html + me.bankTplAfter, data));
						widget.find('.ui-popup-overlay,.cancel').on('click', function() {
							me.hidePopupPanel(widget, panel, app, json);
						});
						widget.find('.ui-list>div').on('click', function() {
							me.btnFunc(widget, panel, app, json, callBack, data.LIST[$(this).index()]);
						})
						widget.find('.sure').on('click', function() {
							me.btnFunc(widget, panel, app, json, callBack, data.LIST[widget.find('.sel').index()]);
						})
					} else {
						YT.alertinfo(data.MSG);
					}
				});
			}, function() {
				YT.alertinfo('模板不存在');
			})
		}
		// 触发点击事件
		panel.delegate('.' + item, "click", function() {
			me.showPopupPanel(widget, panel, app, json);
		})

		YT.log.info('init finish', TAG);
	};
	me.showPopupPanel = function(widget, panel, app, json) {
		setTimeout(function() {
			widget.find('.ui-popup-overlay').removeClass('hidden');
			widget.find('.ui-popup-modal-view').addClass('modal-in');
		}, 200);
		$("body").css({
			height : '100%',
			overflow : "hidden"
		}); // 禁用滚动条
	};
	/**
	 * 底部弹出层返回函数
	 */
	me.btnFunc = function(widget, panel, app, json, callBack, reData) {
		YT.log.info('clickBankItem-------------', reData);
		callBack && app[callBack](reData, widget);
		me.hidePopupPanel(widget, panel, app, json);
	};
	me.hidePopupPanel = function(widget, panel, app, json) {
		$("body").css({
			height : 'auto',
			overflow : "auto"
		});
		var modalView = widget.find('.ui-popup-modal-view');
		var overlay = widget.find('.ui-popup-overlay');
		// overlay.remove();
		overlay.addClass('hidden');
		modalView.removeClass('modal-in');
		/*
		 * setTimeout(function() { popup.remove(); }, 300);
		 */
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