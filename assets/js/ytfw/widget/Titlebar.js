$(function () {
	var TAG = "YT.Titlebar";
	YT.log.debug("--init--", TAG);
	var tpl = ['<div class="web-title-warp">', '	<h1 class="web-title"></h1>',
		'	<span class="titlebar-left-btn"></span>',
		'	<span class="titlebar-right-btn"></span>', '</div>',
		'<div class="web-searchbar-warp"></div>'
	].join("");
	// 设置页面的标题栏；
	var me = YT.Titlebar = {
		divId: "web_titlebar",
		create: function () {
			YT.log.debug("---create--", TAG);
			var div = document.createElement("div");
			div.id = this.divId;
			var jqEl = $(div);
			jqEl.prependTo(document.body);
			this.div = jqEl.html(tpl);
			this.titleEl = jqEl.find(".web-title");
			this.btnLeft = jqEl.find(".titlebar-left-btn");
			this.btnRight = jqEl.find(".titlebar-right-btn");
		},
		change: function (conf) {
			this.div.removeClass();
			this.div.show();
			if (conf.theme == 'red') {
				this.div.addClass('theme-red');
			} else if (conf.theme == 'alpha') {
				this.div.addClass('theme-alpha');
			} else {
				this.div.addClass('theme-def');
			}
			conf.title && this.titleEl.html(conf.title);
			me._button(this.btnLeft, conf.leftButton);
			me._button(this.btnRight, conf.rightButton);
			this.div.find('.web-title-warp').show();
			this.div.find('.web-searchbar-warp').empty();

		},
		_button: function (btn, btnConf) {
			if (!(btnConf && btnConf.exist == "true")) {
				btn.hide();
				return;
			}
			var classname = btn.attr("class");
			if ("titlebar-right-btn" == classname) {
				btn.show().html(btnConf.name);
			} else {
				btn.show();
			}
			btn.attr("onclick", btnConf.func);
		}
	};
	me.create();
	YT.log.debug("--end--", TAG);
});