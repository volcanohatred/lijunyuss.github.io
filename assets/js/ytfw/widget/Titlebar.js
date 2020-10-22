$(function() {
	var TAG = "YT.Titlebar";
	YT.log.debug("--init--", TAG);
	var tpl = [ '<div class="web-title-warp">', '	<h1 class="web-title"></h1>',
			'	<span class="titlebar-left-btn"></span>',
			'	<span class="titlebar-right-btn"></span>', '</div>',
			'<div class="web-searchbar-warp"></div>' ].join("");
	var titleSearch_tpl = [
			'<div class="ui-searchbar ui-border-radius">',
			'<i class="ui-icon-search"></i>',
			'<div class="ui-searchbar-input">',
			'<input value="${val}" data-name="SEARCH_NAME" type="text" placeholder="${placeholder}">',
			'</div>', '</div>' ].join('');
	//var wx = require("https://res.wx.qq.com/open/js/jweixin-1.2.0.js");
	// 设置页面的标题栏；
	var me = YT.Titlebar = {
		divId : "web_titlebar",
		create : function() {
			YT.log.debug("---create--", TAG);
			var div = document.createElement("div");
			div.id = this.divId;
			var jqEl = $(div);
			jqEl.prependTo(document.body);
			this.div = jqEl.html(tpl);
			this.titleEl = jqEl.find(".web-title");
			this.btnLeft = jqEl.find(".titlebar-left-btn");
			this.btnRight = jqEl.find(".titlebar-right-btn");
			me.initEvent();
		},
		initEvent : function(){
			var tips = this.btnLeft;
			var winH = $(window).height();
			var winW = $(window).width();
			var startX, startY, tipsX, tipsY, tipsW = tips.width(), tipsH = tips.height(), dleft, dtop;
			var endX = endY = 0;
			var timeout = null;
			var isAnimation = false;
			tips.on('touchstart', function(e){
				if(!isAnimation){
					//e.stopPropagation();
					$('html,body').css('overflow', 'hidden')
					var point = me.getPoint(e);
					startX = point.pageX
					startY = point.pageY
					endX = tipsX = tips.offset().left;
					endY = tipsY = tips.offset().top;
					dleft = $(document).scrollLeft();
					dtop = $(document).scrollTop()
					clearTimeout(timeout);
				}
			})
			tips.on('touchmove', function(e){
				e.stopPropagation();
				var point = me.getPoint(e);
				var moveX = startX - point.pageX
				var moveY = startY - point.pageY
				var x = endX = tipsX - dleft - moveX;
				var y = endY = tipsY - dtop - moveY;
				if(y > 5 && y < (winH - tipsH - 55) && x > 5 && x < (winW - tipsW)){
					tips.css({'left': x, 'top': y})
				}
			})
			tips.on('touchend', function(e){
				if(!isAnimation){
					$('html,body').css('overflow', 'auto');
					timeout = setTimeout(function() {
						if(winW / (endX + tipsW/2) > 2){
							tips.css({
								left: 10,
								transition: 'all .3s'
							})
						}else{
							tips.css({
								left: winW - tipsW - 10,
								transition: 'all .3s'
							})
						}
						isAnimation = true;
						setTimeout(function (){
							isAnimation = false;
							tips.css({
								transition: 'none'
							})
						}, 500);
					}, 2000);
				}
				
			})
		},
		getPoint : function(e){
			//e.originalEvent.targetTouches[0].pageX
			if(YT.touch()){
				return e.originalEvent.targetTouches[0];
			}else{
				return e;
			}
		},
		change : function(conf) {
			this.div.removeClass();
			if (conf.theme == 'red') {
				this.div.addClass('theme-red');
			} else if (conf.theme == 'alpha') {
				this.div.addClass('theme-alpha');
			} else if(conf.theme == 'wipeOff'){
				this.div.addClass('theme-wipeoff');
			}else {
				this.div.addClass('theme-def');
			}
			
			conf.title && this.titleEl.html(conf.title);
			//设置小程序title
			/*var title = !YT.isEmpty(conf.title)?conf.title.toString():"柳州银行";
			$(document).attr("title",title);
			$("title").html(title);
			wx.setNavigationBarTitle({title:title})*/
			me._button(this.btnLeft, conf.leftButton);
			me._button(this.btnRight, conf.rightButton);
			this.div.find('.web-title-warp').show();
			this.div.find('.web-searchbar-warp').empty();

		},
		_button : function(btn, btnConf) {
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

		},
		changeTitle : function(cfg) {
			if (YT.isEmpty(cfg) || !YT.isObject(cfg)) {
				return;
			}
			var val = cfg.defalutVal ? cfg.defalutVal : "";
			var placeholder = cfg.placeholder ? cfg.placeholder : "请输入搜索内容";
			var callback = cfg.callback;
			var params = {
				val : val,
				placeholder : placeholder
			}
			var title = $('#' + me.divId);
			var html = YT.template(titleSearch_tpl, params);
			this.div.find('.web-title-warp').hide();
			this.div.find('.web-searchbar-warp').html(html).show();
			this.div.off('keydown', '.web-searchbar-warp input');
			this.div.on('keydown', '.web-searchbar-warp input', function() {
				var e = window.event;
				if (e.keyCode == 13) {
					callback && callback($(this).val());
					me.div.find('.web-searchbar-warp').empty();
					me.div.find('.web-title-warp').show();
				}
				if (e.keyCode == 27) {
					me.div.find('.web-searchbar-warp').empty();
					me.div.find('.web-title-warp').show();
				}
			});
		},
	};
	me.create();
	YT.log.debug("--end--", TAG);
});