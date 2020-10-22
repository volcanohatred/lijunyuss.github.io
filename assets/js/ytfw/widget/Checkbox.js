$(function() {
	var TAG = "YT.Checkbox";
	YT.log.debug("---init--", TAG);
	var me = YT.Checkbox = {
		init : function(panel, app, json) {
			var boxs = panel.find("[data-type='checkbox']");
			if (boxs.length > 0) {
				me.initCheckBox(boxs, panel);
			}
		},
		/**
		 * 初始化checkbox
		 * 
		 * @param boxs
		 * @param panel
		 */
		initCheckBox : function(boxs, panel) {
			var cbs = boxs.find('.y-checkbox')
			cbs.each(function() {
				var checkbox = $(this).find('input[type=checkbox]');
				if (checkbox.prop("checked")) {
					$(this).addClass('checked');
					checkbox.attr('checked', 'true');
				} else {
					$(this).removeClass('checked');
					checkbox.removeAttr('checked');
				}
			});
			panel.on('click', '.y-checkbox', function() {
				var cbox = $(this).find('input[type=checkbox]')
				if ($(this).hasClass('checked')) {
					$(this).removeClass('checked');
					cbox.removeAttr("checked", 'true');
				} else {
					$(this).addClass('checked');
					cbox.attr("checked", 'true');
				}
			});
		},
	};
	YT.log.debug("---end--", TAG);
});