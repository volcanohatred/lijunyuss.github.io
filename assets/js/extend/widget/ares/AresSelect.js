/**
 * <code>
 * AresSelect 下拉选择框
 * 配置参数
 * 	data-field-name 字段名称
 * 	data-url 交易请求路径 transUrl
 * 	data-change 下拉选项change事件 eventChange
 *  data-callback 下拉选项加载完成回调事件 callback
 * 	data-param-key 交易请求参数过滤 paramKey
 * 	data-list-key 交易请求列表参数 listKey
 * 	data-sess-list 缓存数据参数获取 sessList
 *  data-item-label 下拉选项option预览key itemLabel
 *  data-item-value 下拉选项option值key
 *  data-option-tpl 下拉选项html模板 tplHtml
 * </code>
 */
define(function(require, exports) {
	var TAG = "AresSelect";
	YT.log.debug("---内部组件--init----", TAG);
	// 内部组件不提供外部调用支持
	var me = {};// me为当前控件的函数命名空间
	// 下拉选项模板
	me.selectGroupTpl = [ '<select class="x-p-select" data-name="${dataName}">',
			'{@each LIST as item,index}',
			'<option value="${item[itemValue]}">${item[itemLabel]}</option>',
			'{@/each}', '</select>' ].join('');
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
		// 查找select元素标签
		var ele = widget.find('.y-select');
		if (ele.length < 1) {
			YT.log.debug("select ele is empty", ele.length);
			return;
		}
		var eventChange = widget.attr('data-change');// 下拉框选择事件
		var callback = widget.attr('data-callback');// 加载完成后回调函数
		var optionTpl = widget.attr('data-option-tpl');// 模板文件路径
		function initTpl(tpl, list) {// 渲染相关的模板文件
			var html = YT.template(tpl, {
				dataName : widget.attr('data-field-name'),// 字段名称
				itemValue : widget.attr('data-item-value'),// 元素值key
				itemLabel : widget.attr('data-item-label'),// 元素文本key
				LIST : list
			});
			ele.html(html);
			ele.attr("data-ready", "true");
			if (!YT.isEmpty(eventChange)) {// 设置下拉选框change回调
				ele.find('.x-p-select').attr('data-change', eventChange);
				ele.trigger('change');// 模拟选择事件
			}
			!YT.isEmpty(callback) && app[callback]();// 执行加载完成的回调函数
		}
		var _optionTpl = me.selectGroupTpl;// 下拉选框的html模板
		if (!YT.isEmpty(optionTpl) && app[optionTpl]) {
			_optionTpl = app[optionTpl];
		}
		// 判断是否查询缓存数据
		var sessList = widget.attr('data-sess-list');// 缓存数据参数获取
		if (!YT.isEmpty(sessList) && YT[sessList] && YT[sessList].length > 0) {// 存在缓存选项
			var _list = YT[sessList];// 获取缓存中的信息数据
			initTpl(_optionTpl, _list);
			return;
		}
		var transUrl = widget.attr('data-url');// 数据请求路径
		if (YT.isEmpty(transUrl)) {// 判断请求路径是否存在
			YT.log.debug("transUrl is null ", TAG);
			YT.alertinfo("未配置下拉选项请求路径");
			return;
		}
		// 过滤请求参数
		var paramKeys = widget.attr('data-param-key');// 上送参数过滤
		var params = {};
		if (!YT.isEmpty(paramKeys)) {
			var keys = paramKeys.split(',');
			for (var i = 0; i < keys.length; i++) {
				var k = keys[i];
				params[k] = json[k];
			}
		}
		var listKey = widget.attr('data-list-key');// 列表元素主键
		var lkey = YT.isEmpty(listKey) ? "LIST" : listKey;
		// ajax请求列表数据
		ele.attr("data-ready", "false");
		var url = YT.dataUrl(transUrl);
		me.querySelectOption(url, params, _optionTpl, initTpl, lkey);
		YT.log.info('init finish', TAG);
	};
	me.initOptionTpl = function() {
	};
	/**
	 * <code>
	 * 查询下拉框选项信息参数
	 * @param url 请求交易路径
	 * @param params 请求参数
	 * @param tplHtml 模板内容
	 * @param callback 回调函数
	 * @param lkey 渲染的列表key
	 * </code>
	 */
	me.querySelectOption = function(url, params, tplHtml, callback, lkey) {
		YT.ajaxData(url, params, function(data) {
			if (data.STATUS == '1') {// 交易成功
				callback && callback(tplHtml, data[lkey]);
			} else {
				YT.alertinfo('列表信息加载失败!');
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