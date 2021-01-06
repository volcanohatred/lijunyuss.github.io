/**
 * <code>
 * AresListView 分页列表自加载组件
 * 
 * 列表模版组件自动触发器
 * 
<!-- 分页列表自加载 -->
<div data-tplItem="02_tpl_item.html" 
	data-url="easy/sampleList" 
	data-extlib="AresListView" 
	data-handle="query">
	<!-- 空信息模版 -->
	<div id="empty"></div>
</div>

 * </code>
 */
define(function(require, exports) {
	var TAG = "AresListView";
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
		YT.log.info('init begin', TAG);
		widget.attr("data-ready", "true");
		// 列表记录模版
		var itemTplPath = widget.attr("data-tplItem");
		// 列表数据请求
		var dataUrl = widget.attr("data-url");
		// 事件触发器
		var eventFunc = widget.attr("data-handle");
		var emptyHtml = widget.find("#empty").html();
		var itemTpl = null;
		var func = function(tpl_html) {
			YT.log.info('do ' + eventFunc, TAG);
			itemTpl = tpl_html || itemTpl;
			if (!itemTpl || YT.Form.readyLock(panel, app)) {
				return;// 防多重触发
			}
			// YT.log.info('init tpl item'+ itemTpl);
			// YT.openWaitPanel();
			var params = YT.Form.getFormJson(panel, json);
			var listView = new YT.ListView({
				contentEl : widget,
				application : app,
				emptyText : emptyHtml,
				ajax : {
					url : YT.dataUrl(dataUrl),
					params : params
				},
				itemTpl : itemTpl
			});
			listView.loadData();// 数据加载触发
			YT.hideWaitPanel();
		};
		if (eventFunc) {
			app[eventFunc] = function() {
				func();
			};// 声明事件到主控JS
		}
		// 模版加载及事件触发
		YT.getPage(app.TAG + itemTplPath, {}, func)

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