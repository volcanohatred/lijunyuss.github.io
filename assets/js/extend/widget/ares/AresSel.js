/**
 * <code>
 * AresSel 自定义下拉框组件
 * 
 * </code>
 */
define(function(require, exports) {
	var TAG = "AresSel";
	YT.log.debug("---内部组件--init----", TAG);
	// 账户列表模板
	var AresSelTop = [
			'<div class="olay yui-params-sel hidden ${widgetId}">',
			'<div class="layerPenl"></div>',
			'<div class="layer"><header class="yui-select-header">',
			'<span class="close"></span>',
			'<h2 class="yui-select-title">${title}</h2></header>',
			'<section class="yui-select-box yui-selwrap">',
			'{@each LIST as item,index}',
			'<div _index=${index} class="x-params-item">' ].join('');
	var AresSelBot = [ '</div>', '{@/each}', '</section>', '</div>', '</div>' ]
			.join('');
	// 内部组件不提供外部调用支持
	var me = {};// me为当前控件的函数命名空间
	/**
	 * 
	 * 初始化控件的事件、值、展现等信息
	 * 
	 * @param widget
	 *            当前组件
	 * @param panel
	 *            当前容器作用域，通常为page容器
	 * @param app
	 *            处理器
	 * @param json
	 *            数据处理 </code>
	 */
	me.init = function(widget, panel, app, json) {
		YT.log.info('init begin', TAG);
		var cache = widget.attr('data-cache');// 是否缓存
		var url = widget.attr('data-url');// 下拉数据请求路径
		var title = widget.attr('data-title'); // 下拉框标题
		var itemTpl = widget.attr('data-itemTpl');// 内容模板
		var paramFunc = widget.attr('data-paramFunc');// 查询参数
		var callback = widget.attr('data-callback');// 查询参数
		var widgetId = widget.attr('data-widgetId');// 下拉选项唯一标识
		var itemKey = widget.attr('data-itemKey');// 下拉选项value对应的key值
		// 查询参数分析
		var params = json;
		if (!YT.isEmpty(paramFunc) && app[paramFunc]) {
			params = app[paramFunc]();
		}
		var opt = {
			panel : panel,
			widget : widget,
			app : app,
			callback : callback,
			params : params,
			itemTpl : itemTpl,
			title : title,
			itemKey : itemKey,
			widgetId : widgetId
		};
		if (!YT.isEmpty(cache)) {
			opt.cache = cache;
			me.loadCache(opt);
		} else {
			opt.url = url;
			me.loadReal(opt);
		}
		widget.on('click', function() {
			me.wakeSelect(widgetId, panel);
		});
		panel.on('click', '.yui-params-sel .layerPenl,.yui-params-sel .close',
				function() {
					me.hideSelect(widgetId, panel);
				});
		YT.log.info('init finish', TAG);
	};
	/**
	 * 显示下拉框
	 */
	me.wakeSelect = function(widgetId, panel) {
		$('html, body').css({
			overflow : 'hidden'
		});
		panel.find('.' + widgetId).removeClass('hidden');
	};
	/**
	 * 隐藏下拉框
	 */
	me.hideSelect = function(widgetId, panel) {
		$('html, body').css({
			overflow : 'auto'
		});
		panel.find('.' + widgetId).addClass('hidden');
	};
	/**
	 * 加载下拉选项数据
	 */
	me.loadSelectItem = function(list, opt) {
		if (YT.isEmpty(opt.itemTpl)) {
			YT.alertinfo("自定义下拉框选项模板文件不存在！");
			return;
		}
		YT.getPage(opt.itemTpl, {}, function(tpl_html) {
			var params = {
				title : opt.title,
				LIST : list,
				widgetId : opt.widgetId
			};
			var selectTpl = AresSelTop + tpl_html + AresSelBot;
			var html = YT.template(selectTpl, params);
			opt.panel.append(html);
			opt.panel.find('.' + opt.widgetId).on('click', '.x-params-item',
					function() {
						var _index = $(this).attr("_index");
						var info = list[_index];
						if (opt.itemKey && opt.widget) {
							var _v = info[opt.itemKey];
							opt.widget.attr('data-value', _v);
							opt.widget.find('.x-select-value').html(_v);
						}
						me.hideSelect(opt.widgetId, opt.panel);
						if (opt.app && opt.callback && opt.app[opt.callback]) {// 执行回调函数
							opt.app[opt.callback](info);
						}
					});
		});
	};
	/**
	 * 加载缓存数据
	 */
	me.loadCache = function(opt) {
		if (YT.isEmpty(opt.cache)) {
			YT.alertinfo("自定义参数下拉组件列表数据不存在！");
			return;
		}
		var list = [];
		if (opt.app && opt.app[opt.cache]) {
			list = opt.app[opt.cache]();
		}
		me.loadSelectItem(list, opt);
	};
	/**
	 * 加载实时数据
	 */
	me.loadReal = function(opt) {
		if (YT.isEmpty(opt.url)) {
			YT.alertinfo("自定义参数下拉组件查询接口不可为空！");
			return;
		}
		var tranUrl = YT.dataUrl(opt.url);
		YT.ajaxData(tranUrl, opt.params || {}, function(rsp) {
			if (rsp && rsp.STATUS == '1') {
				if (rsp.LIST.length != 0) {
					me.loadSelectItem(rsp.LIST, opt);
				}
			} else {
				YT.alertinfo("暂无下拉选项数据！");
				return;
			}
		});
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