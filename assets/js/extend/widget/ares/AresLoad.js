/**
 * <code>
 * AresLoad 深度加载
 * 
 * 加载内容；
 * 
 * 1、无请求加载
 * <div data-tpl="fullpath" data-extlib="AresLoad"></div>
 * 2、请求后加载
 * <div data-tpl="fullpath" data-url="x/xx" data-keys="a=A1,B2,C3:11" data-extlib="AresLoad"></div>
 * 将指定路径的模版内容装配到功能中，装配时，会深度加载；
 * 3、当前目录模版
 * <div data-tpl="filename" data-current="true" data-extlib="AresLoad"></div>
 * </code>
 */
define(function (require, exports) {
	var TAG = "AresLoad";
	YT.log.debug("---内部组件--init----", TAG);
	// 内部组件不提供外部调用支持
	var me = {}; // me为当前控件的函数命名空间

	var snabbdom = SnabbdomModule;
	var patch = snabbdom.init([ClassModule, AttributesModule, PropsModule, StyleModule])
	var h = HModule.h;

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
	me.init = function (widget, panel, app, json) {
		YT.log.info('init begin');
		var tplUrl = widget.attr("data-tpl");
		var tplCurrent = widget.attr("data-current");
		var transUrl = widget.attr("data-url");
		if ("true" == tplCurrent) { // 当前目录
			if (/(\/)$/g.exec(app.TAG)) { // 是否以 / 结尾
				tplUrl = app.TAG + tplUrl; // 全路径
			} else {
				tplUrl = app.TAG + "/" + tplUrl; // 全路径
			}

		}
		YT.log.debug('init tpl:', tplUrl, ",url", transUrl);
		if (transUrl) {
			// 调AJAX请求
			var keys = widget.attr("data-keys") || "";
			var params = YT.Form.dataKeys(keys, json);
			YT.log.info("ares load params:", params);
			var callback = function (tpl_html, container, vnode) {
				var url = YT.dataUrl(transUrl, true);
				YT.ajaxData(url, params, function (data) {
					data = $.extend({}, json, data); // 值合并
					YT.log.debug("url:", url, "==>", data);
					var html = YT.template(tpl_html, data);
					var vnode2 = YT.xml2json(html);
					patch(vnode, vnode2); // 二次煊染
					console.log(vnode2);
					dataProps(vnode2.elm);
					// setTimeout(function(){
					app && (YT.Form.initPanel($(vnode2.elm), app, data)); // 深度加载
					// },1000);
				});
			};
			me.loadPage(widget, tplUrl, params, callback, app);
		} else {
			YT.loadPage(widget, tplUrl, json, null, me);
		}
		YT.log.info('init finish', TAG);
	};

	function dataProps(parent) {
		for (var i in parent.children) {
			var child = parent.children[i];
			for (var property in child) {
				if (property.indexOf("data-") >= 0) {
					child.setAttribute(property, child[property]);
				}
			}
			dataProps(child);
		}
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
	me.reset = function (widget, panel, app, json) {
		YT.log.info('reset begin', TAG);
		YT.log.info('reset finish', TAG);
	};

	me.loadPage = function (pageHandle, tplUrl, params, callback, app) {
		var url = YT.formatUrl(tplUrl);
		YT.getPage(url, {}, function (tpl_html) {
			var html = YT.template(tpl_html, params);
			var container = pageHandle[0];
			var vnode = YT.xml2json(html);
			patch(container, vnode); // 初始煊染

			callback && callback(tpl_html, container, vnode);
		}, function () {
			YT.showTips('加载模板失败!');
			callback && callback(params);
		});
	}

	// 组件的外置接口
	exports.init = me.init;
	exports.reset = me.reset;

})