;
(function() {
	var TAG = "Fw.Popup.js";
	var Popup = YT.Popup = {
		_popupBoxId : "_popupBox",
		_AppWindow : "",
		// 头部菜单模板
		_popupMenuTpl : [ 
				'<div class="yui-popup-mask"></div>',
				'   <div class="yui-popup-group">',
				'		<div class="yui-popup-array">', 
				'			<em></em>',
				'			<i></i>', 
				'		</div>', 
				'		<div class="yui-popup-menus">',
				'			<ul>', 
				'			{@each LIST as item,index}',
				'				<li data-func="${item.func}">${item.name}</li>',
				'			{@/each}', 
				'			</ul>', 
				'		</div>', 
				'	</div>' ]
				.join(''),
		/**
		 * 底部弹出层
		 */
		initPopupindow : function(panel, app, conf) {
			var me = this;
			me._AppWindow = app;
			me.hidePopupPanel();
			var tpl = conf.tpl ? conf.tpl : "";
			var layer = document.createElement("div");
			panel[0].appendChild(layer);
			layer.id = this._popupBoxId;
			var tpl_html = 
			'	<div class="ui-popup-overlay"></div>' + 
			'	<div class="ui-popup-modal-view">'+ 
			'		<div class="ui-popup-modal-group">' + 
			'			<div class="ui-popup-modal-label">请选择</div>'+ 
			'		{@each LIST as item,index}' + 
			'			<div class="ui-popup-modal-button" _index=${index} func="${item.func}">${item.name}</div>' + 
			'		{@/each}' + '</div>' + 
			'		<div class="ui-popup-modal-group">' + 
			'			<div class="ui-popup-modal-button">取消</div>' + 
			'		</div>' + 
			'	</div>';
			tpl_html = tpl ? tpl : tpl_html;
			var html = Fw.template(tpl_html, {
				LIST : conf.list
			});
			$(layer).html(html);
			var modalView = $(layer).find('.ui-popup-modal-view');
			setTimeout(function() {
				modalView.addClass('modal-in');
			}, 200);
			$("body").css({
				overflow : "hidden"
			}); // 禁用滚动条
			this.initEvent();
		},
		/**
		 * 底部弹出层事件绑定
		 */
		initEvent : function() {
			var popup = $("#" + this._popupBoxId);
			popup.on('click', '.ui-popup-modal-button', this.btnFunc);
			popup.on('click', '.ui-popup-overlay', this.hidePopupPanel);
		},
		/**
		 * 底部弹出层返回函数
		 */
		btnFunc : function() {
			var callback = $(this).attr('func');
			if (!YT.isEmpty(callback)) {
				window[callback] && window[callback]();
			}
			Popup.hidePopupPanel();
		},
		/**
		 * 底部弹出层隐藏
		 */
		hidePopupPanel : function() {
			$("body").css({
				overflow : "auto"
			});
			var popup = $("#" + Popup._popupBoxId);
			var modalView = popup.find('.ui-popup-modal-view');
			var overlay = popup.find('.ui-popup-overlay');
			overlay.remove();
			modalView.removeClass('modal-in');
			modalView.addClass('modal-out');
			setTimeout(function() {
				popup.remove();
			}, 300);

		},
		/**
		 * 显示头部菜单
		 * @param cfg
		 */
		initPopuMenus : function(panel, app, conf) {
			var html = Fw.template(Popup._popupMenuTpl, {
				LIST : conf
			});
			var layer = document.createElement("div");
			panel[0].appendChild(layer);
			layer.id = '_popuMenus';
			$(layer).html(html);
			$(layer).on('click', '.yui-popup-menus li', function() {
				var callback = $(this).data('func');
				if (!YT.isEmpty(callback)) {
					window[callback] && window[callback]();
				}
				Popup.hidePopuMenus();
			});
			$(layer).on('click', '.yui-popup-mask', function() {
				Popup.hidePopuMenus();
			});
		},
		/**
		 * 隐藏底部菜单
		 */
		hidePopuMenus : function() {
			$('#_popuMenus').remove();
		},
	};
})();