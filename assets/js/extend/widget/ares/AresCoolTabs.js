/**
 * <code>
 * AresCoolTabs
 * 
 * </code>
 */
define(function(require, exports) {
	var TAG = "AresCoolTabs";
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
		YT.log.info('init begin');
		var detail = widget.find('.tabBody .tabMain');
		var current = parseInt(widget.attr('data-current'));
		var currentWidth = widget.attr('data-width');
		widget.find('.tabBody').css('width',widget.find('.tabLi').length*100+'%');
		widget.find('.tabBody .tabMain').css('width',100/(widget.find('.tabLi').length)+'%');
		widget.find('.tabLi').eq(current).find('span').addClass('currentActive');
		widget.find('.tabUl').css('width',currentWidth+'%');
		detail.each(function(index, ele) {
			YT.loadPage($(ele), app.TAG + $(ele).attr('data-url'), {}, null, app);
		})
		widget.find(".tabLi").click(function(){
				var prevIndex = widget.find(".currentActive").parent().index();
				var prevLeft = widget.find(".currentActive").offset().left;
				var prevRight = prevLeft+widget.find(".currentActive").width();
				var clickIndex = $(this).index();
				var clickLeft = $(this).find("span").offset().left;
				var clickRight = clickLeft + $(this).find("span").width();
				if(prevIndex<clickIndex){
					var right = parseFloat(clickRight - prevRight) - 5;
					var left = parseFloat(clickLeft - prevLeft) + 5;
					var animate = "@keyframes move"+
								"{0%   {right:5px;left:5px;}"+
								"50%  {rigth: -"+right+"px;left:5px;}"+
								"100% {left: "+left+"px;right:-"+right+"px;}"+
								"}"
					
				}else{
					var right = parseFloat(prevRight - clickRight ) + 5;
					var left = parseFloat(clickLeft - prevLeft) + 5;
					var animate = "@keyframes move"+
								"{0%   {left:5px;right:5px;}"+
								"50%  {left:"+left+"px;right:5px;}"+
								"100% {right:"+right+"px;left: "+left+"px}"+
								"}"
				}
				widget.find(".style").html(animate);
				var index = $(this).index();
				widget.find('.tabBody').animate({marginLeft:-100*index+'%'},'600');
				_this = this;
				setTimeout(function(){
					widget.find(".style").html("");
					widget.find(".tabLi span").removeClass("currentActive");
					widget.find(_this).find("span").addClass("currentActive");
				},300);
				
			})
			
			me.intScroll(widget,currentWidth);
		YT.log.info('init finish', TAG);
	};
	me.intScroll = function(widget,currentWidth){
		window.onscroll=function(){
			if($('.page-on-center').find('.yui-tabBox').length!=0){
				var top = $(window).scrollTop(),elTop;
				YT.Client.isWebClient == true? elTop = "40px":"initial";
				if(top>=(widget.offset().top-40)){
					widget.find(".tabUl").css({"position":"fixed","width":"100%","top":elTop})
				}else{
					widget.find(".tabUl").css({"position":"static","width":currentWidth+'%',"top":elTop})
				}
			}
		}
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