$(function() {
	var TAG = "YT.Radiobox";
	YT.log.debug("---init--", TAG);
	var me = YT.Radiobox = {
		init : function(panel, app, json) {
			var rbs = panel.find('[data-type="radiobox"]');
			if (rbs.length < 1) {
				return;
			}
			me.initNormalRabiobox(rbs, panel, app, json);// 初始化普通单选框
			me.initTabRabiobox(rbs, panel, app, json);// 初始化标签单选框
		},
		/**
		 * 初始化标签单选框
		 */
		initTabRabiobox : function(rbs, panel, app, json) {
			var radios = rbs.find('.y-radio-tab');
			radios.each(function() {
				var box = $(this).find('input[type="radio"]');
				if (box.prop("checked")) {
					$(this).addClass("current");
				} else {
					$(this).removeClass("current");
				}
			});
			panel.on('click', '.y-radio-tab', function() {
				var callback = $(this).attr('data-callback');// 回调函数
				var radio = $(this).find('input[type=radio]');// 获取当前点击的单选框
				var name = radio.attr('name');
				var radios = panel.find('input[type=radio]').filter(
						'[name=' + name + ']');
				radios.each(function() {
					$(this).parent().removeClass('current');
					$(this).removeAttr("checked");
				});
				$(this).addClass('current');
				radio.attr('checked', 'true');
				app[callback] && app[callback]();
			});
		},
		/**
		 * 初始化普通单选框
		 */
		initNormalRabiobox : function(rbs, panel, app, json) {
			var radios = rbs.find('.y-radio');
			radios.each(function() {
				var box = $(this).find('input[type="radio"]');
				if (box.prop("checked")) {
					$(this).addClass("checked");
					box.attr('checked', 'true');
				} else {
					$(this).removeClass("checked");
					box.removeAttr("checked");
				}
			});
			panel.on('click', '.y-radio', function() {
				var radio = $(this).find('input[type=radio]');
				var name = radio.attr('name');
				var radios = panel.find('input[type=radio]').filter(
						'[name=' + name + ']');
				radios.each(function() {
					if ($(this).prop("checked")) {
						$(this).parent().addClass('checked');
						$(this).attr('checked', 'true');
					} else {
						$(this).parent().removeClass('checked');
						$(this).removeAttr("checked");
					}
				});
			});
		}
	};
	YT.log.debug("---end--", TAG);
});