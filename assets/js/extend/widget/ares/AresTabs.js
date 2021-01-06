/**
 * <code>
 * AresTabs
 * 
 * <div class="ui-tab" data-extlib="AresTabs" data-current="1">
		<ul class="ui-tab-nav ui-border-b x-tab-header x-tab-selected">
			<li>
				<span class="x-tab-txt">列表面板</span>
			</li>
			<li>
				<span class="x-tab-txt">表单面板</span>
			</li>
			<li>
				<span class="x-tab-txt">表单面板2</span>
			</li>
		</ul>
		<ul class="ui-tab-content x-tab-content">
			<li class="x-tab-item" data-url="011_tab_list.html"></li>
			<li class="x-tab-item" data-url="012_tab_form.html"></li>
			<li class="x-tab-item" data-url="013_tab_form.html"></li>
		</ul>
	</div>
	
	data-current 为当前显示项，缺省为0；第一个；
	
 * </code>
 */
define(function(require, exports) {
	var TAG = "AresTabs";
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
		new Tabs(widget, panel, app, json).buildTab();
	};
	var Tabs = function(tab, panel, app, json) {
		this.tab = tab;
		this.panel = panel;
		this.app = app;
		this.json = json;
	}
	Tabs.prototype.buildTab = function() {
		// tab, panel, app
		var tab = this.tab; 
		var thizz = this;
		this.header = tab.find('>.x-tab-header');
		this.content = tab.find('>.x-tab-content');
		var current = tab.data("current") || 0;// 指定选项卡
		
		tab.on("reset",function(){
			thizz.content.find('>.x-tab-item').removeAttr("data-tabloaded");
			thizz.setSelected();
		});
		try {
			var h = this.header;
			var lis = h.find('li');
			if (h.hasClass('x-tab-selected')) {
				h.append('<span class="ui-tab-selected"></span>')
			}
			h.on('click', '>li', function() {
				var item = $(this);
				thizz.index = item.index();
				thizz.setSelected();
			});
			this.index = current;
			this.setSelected();
		} catch (e) {
			YT.log.error(e);
		}
		$(window).resize(function() {
			console.log('----resize-----');
			thizz.setSelected();
		});
	}

	Tabs.prototype.setSelected = function() {
		var panel = this.panel;
		var app = this.app;
		var i = this.index;
		var header = this.header;
		var lis = header.find('>li');
		var cli = lis.eq(i);
		lis.removeClass('current');
		cli.addClass('current');
		if (header.hasClass('x-tab-selected')) {
			var tabed = header.find('.ui-tab-selected');
			var txt = cli.find('.x-tab-txt');
			var tw = txt.width()
			var lw = cli.width();
			var left = txt.offset().left;
			tabed.css({
				width : tw,
				left : left
			});
		}
		var items = this.content.find('>.x-tab-item');
		var item = items.eq(i);
		items.hide();
		item.show();
		// 提供 reset 控制器
		var reset = this.tab.attr("data-reset");
		if (reset) {
			if (YT.Form.readyLock(panel, app)) {
				return;// 防页面初始化未结束而被提交
			}
		}
		if (item.attr('data-tabloaded') != 'true') {
			var url = item.attr('data-url');
			var keystr = item.attr("data-keys") || "*";
			var datas = YT.Form.getFormJson(panel, this.json);
			var params = YT.Form.dataKeys(keystr, datas);
			YT.loadPage(item, app.TAG + url, params, function() {
				item.attr('data-tabloaded', 'true');
				YT.Form.initPanel(item, app, params);
			});
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
	me.reset = function(widget, panel, app, json) {
		YT.log.info('reset begin', TAG);
		YT.log.info('reset finish', TAG);
	};

	// 组件的外置接口
	exports.init = me.init;
	exports.reset = me.reset;

})