/**
 * <code>
 * AresSortBar 列表排序组件,
 * 值变更支持 data-notices 事件传递；
 * 
 * <div class="ui-tab">
		<ul class="ui-tab-nav yui-tab-sort"  data-type="sort" data-name="SORTS" data-extlib="AresSortBar">
			<li>
				<p class="yui-tab-sort-item sort-asc" data-value="filed-name">
					<label class="ui-txt-info" >字段1</label>
				</p>
			</li>
			<li>
				<p class="yui-tab-sort-item sort-desc" data-value="filed-name2">
					<label class="ui-txt-info" >字段2</label>
				</p>
			</li>
			<li>
				<p class="yui-tab-sort-item" data-value="filed-name3">
					<label class="ui-txt-info" >字段3</label>
				</p>
			</li> 
		</ul>
	</div>
 * </code>
 * 
 * 取值为 {SORTS:"filed-name asc,filed-name2 desc"};
 * 
 */
define(function(require, exports) {
	var TAG = "AresSortBar";
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
		var callback = widget.attr('data-callback');// 回调函数
		var notices = widget.attr('data-notices');// 值变更事件传递
		var mult = widget.attr('data-mult') == "true";// 多例排序
		var li = widget.find(">li .yui-tab-sort-item");
		// 绑定绑定事件
		li.on('click', function() {
			var item = $(this);
			var sortType = item.attr("data-sortType") || "1";
			var type = parseInt(sortType);
			if (!mult) {// 单列排序
				li.removeClass('sort-desc sort-asc').removeAttr("data-sortType");
			}
			type = type % 3;
			if (type == 0) {
				item.removeClass('sort-desc sort-asc');// 无排序
			} else if (type == 1) {
				item.addClass("sort-asc");// 升序
			} else if (type == 2) {
				item.removeClass('sort-asc').addClass("sort-desc");// 降序
			}
			type += 1;
			item.attr("data-sortType", type);
			// 事件传递
			notices && YT.Form.notices(panel, notices);// 方式1.通知后续节点重置
			app[callback] && app[callback]();// 方式2.回调函数
		});
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