/**
 * <code>
 * AresList 非分页列表加载，与AresLoad机制方式相同
 * data-itemClazz="list-item"  列表记录识别
 * _index 列表记录序号，取值用；
 * 
 * 1.提供功能跳转，点击，内部控制等事件；
 * 2.提供排序、过滤等二次加载，无请求加载触发；
 * 3.提供数据请求刷新触发；
 *  
 * AresList声明加载内容；
 * <div data-tpl="path" data-current="true"  data-url="x/xx" data-keys="a=A1,B2,C3:11" data-extlib="AresList"></div>
 * 
 * list-item 的html示例
 * 
  <ul class="ui-list ui-list-link ui-border-tb">
	{@each LIST as item,i}
	<li class="ui-border-t  list-item" data-index="${i}" >
		<div class="ui-list-img">
			<span style="background-image: url('assets/img/slide/fullimage5.jpg')"></span>
		</div>
		<div class="ui-list-info">
			<h3>信息标题</h3>
			<p class="item-xx">展示摘要描述</p>
			<button class="ui-btn-s ui-btn-primary" data-link="page/02/06/P0206.html" data-keys="*">功能跳转</button>
			<button class="ui-btn-s active" data-listEvent="showItemDetail">查看详情</button>
			<button class="ui-btn-s disabled" data-listEvent="showItemXx">内部控制</button>
		</div>
	</li>
	{@/each}
</ul>
 * 
 * 
 * </code>
 */
define(function (require, exports) {
	var TAG = "AresList";
	YT.log.debug("---内部组件--init----", TAG);
	// 内部组件不提供外部调用支持
	var me = {}; // me为当前控件的函数命名空间

	var innerIndexKey = "_i";
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
		var handleQuery = widget.attr("data-handle") || "listQuery"; // 数据请求
		var handleFilter = widget.attr("data-filter") || "listFilter"; // 数据前端筛选
		var handleMounted = widget.attr("data-mounted") || "listMounted"; // 数据加工
		var listKey = widget.attr("data-listKey") || "LIST";
		var tplCurrent = widget.attr("data-current");
		var transUrl = widget.attr("data-url");
		if ("true" == tplCurrent) { // 当前目录
			if (/(\/)$/g.exec(app.TAG)) { // 是否以 / 结尾
				tplUrl = app.TAG + tplUrl; // 全路径
			} else {
				tplUrl = app.TAG + "/" + tplUrl; // 全路径
			}
		}
		var listTplHtml; // 列表模版
		var curNode; // 当前的虚拟DOM
		var curDatas; // 当前的数据
		// 注册重置事件
		widget.on("reset", function () {
			YT.log.info('reset done', TAG);
			// 排序
			// 煊染
		});
		var itemCls = widget.attr("data-itemCls") || "list-item";
		// 跳转事件注册
		widget.off("click");
		widget.on("click", "[data-link]", function (e) {
			YT.log.info(" item link:");
			var el = $(this);
			var link = el.attr('data-link');
			var keystr = el.attr('data-keys');
			e.stopPropagation();
			YT.log.info(" item link:", link);
			if (!el.hasClass(itemCls) && !(el = el.bubbleByCls(itemCls))) {
				return false;
			}
			var index = el.attr("data-index");
			var itemData = curDatas && curDatas[listKey][index];
			var params = YT.Form.dataKeys(keystr, itemData);
			YT.nextPage(link, params); // 功能跳转
		});
		// 内部控制事件注册
		widget.on("click", "[data-listEvent]", function (e) {
			var el = $(this);
			var event = el.attr('data-listEvent');
			// var keystr = el.attr('data-keys');
			e.stopPropagation();
			YT.log.info(" item event:", event);
			if (!el.hasClass(itemCls) && !(el = el.bubbleByCls(itemCls))) {
				return false;
			}
			var tapItem = el;
			var index = el.attr("data-index");
			var itemData = curDatas && curDatas[listKey][index];
			// var params = YT.Form.dataKeys(keystr, itemData);
			app && app[event](itemData, index, tapItem);
		});

		var url = YT.dataUrl(transUrl, true);
		var keys = widget.attr("data-keys") || "";
		// 查询触发
		app[handleQuery] = function () {
			YT.log.info("ares list run :", handleQuery);
			// 调AJAX请求
			var params = YT.Form.getFormJson(panel, json);
			YT.log.info("ares load list:", params);
			YT.ajaxData(url, params, function (data) {
				curDatas = $.extend({}, json, data); // 值合并
				YT.log.debug("url:", url, "==>", curDatas);
				var html = YT.template(listTplHtml, curDatas);
				var vnode2 = YT.xml2json(html);
				patch(curNode, vnode2); // 二次煊染
				console.log(vnode2);
				dataProps(vnode2.elm);
				// setTimeout(function(){
				curNode = vnode2; // 缓存
			});
		};
		// 排序触发
		if (handleFilter) {
			app[handleFilter] = function () {
				// 重新排序
				YT.log.info("ares list run :", handleFilter);
				var params = YT.Form.getFormJson(panel);
				var sortStr = params.SORTS || (innerIndexKey + " asc");
				// YT.log.info("ares list sorts :", sortStr);
				var sortItems = sortStr.split(";");
				for (var i in sortItems) {
					var sortItem = sortItems[i].split(" ");
					var key = sortItem[0];
					var type = sortItem[1];
					curDatas[listKey].sort(function (x, y) {
						var a = toNumberStr(x[key]);
						var b = toNumberStr(y[key]);
						if (YT.isNumber(a) && YT.isNumber(b)) {
							return type == "asc" ? (parseInt(a) - parseInt(b)) : (parseInt(b) - parseInt(a));
						}
						// a = a.r(/\\-|,/g, "");
						// b = b.replace(/\\-|,/g, "");
						return type == "asc" ? (a < b) : (b < a);
					});
					// YT.log.info("ares list sorts key:", key, " type:", type,
					// curDatas);

				}
				// 再次煊染
				var html = YT.template(listTplHtml, curDatas);
				var vnode2 = YT.xml2json(html);
				patch(curNode, vnode2); // 二次煊染
				console.log(vnode2);
				dataProps(vnode2.elm);
				// setTimeout(function(){
				curNode = vnode2; // 缓存

			};
		}

		YT.log.debug('init tpl:', tplUrl, ",url", transUrl);
		if (transUrl) {
			// 调AJAX请求
			var keys = widget.attr("data-keys") || "";
			var params = YT.Form.getFormJson(panel);
			YT.log.info("ares load params:", params);
			var callback = function (tpl_html, container, vnode) {
				listTplHtml = tpl_html;
				var url = YT.dataUrl(transUrl, true);
				YT.ajaxData(url, params, function (data) {
					curDatas = $.extend({}, json, data); // 值合并
					var mounted = handleMounted && app[handleMounted]; // 数据二次加工
					if (mounted) {
						curDatas = mounted(curDatas);
					}
					var list = curDatas[listKey]; // 取列表数据
					for (var i in list) {
						var listItem = list[i];
						listItem[innerIndexKey] = i * 1; // 默认数据序号
					}
					YT.log.debug("url:", url, "==>", curDatas);
					var html = YT.template(tpl_html, curDatas);
					var vnode2 = YT.xml2json(html);
					patch(vnode, vnode2); // 二次煊染
					console.log(vnode2);
					dataProps(vnode2.elm);
					// setTimeout(function(){
					app && (YT.Form.initPanel(widget, app, curDatas)); // 深度加载
					curNode = vnode2; // 缓存
				});
			};
			widget.append("<div></div>"); // 控制域
			me.loadPage(widget.find(">div"), tplUrl, params, callback, app);
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

	function toNumberStr(s) {
		return s;
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
		widget.trigger("reset"); // 触发 值的加工 及页面煊染
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
		}, function (tpl_html) {
			YT.showTips('加载模板失败!');
			callback && callback(params);
		});
	}

	// 组件的外置接口
	exports.init = me.init;
	exports.reset = me.reset;

})