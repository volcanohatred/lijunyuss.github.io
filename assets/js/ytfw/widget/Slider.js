/**
 * @Desc 图片轮播
 */
(function() {
	var tpl_html = null;
	var height = 181;
	var me = YT.Slider = {
		/**
		 * 图片轮播
		 * @param panel
		 * @param app
		 * @param params
		 * @returns {Boolean}
		 */
		init : function(panel, app, params) {
			var silde = panel.find('.y-slider');
			if(silde.length == 0){
				return false;
			}
			height = silde.attr('data-height');
			height = YT.isEmpty(height) ? 181 : height;
			seajs.use('assets/js/plugin/swiper/swiper.min',function(){
				me.initSilde(silde, app, params);
			});
		},
		initSilde : function(silde, app, params){
			var items = silde.find('.x-slider');
			var list = [];
			items.each(function(i,n){
				var map = {};
				map["img"] = $(n).attr('data-img');
				map["title"] = $(n).attr('data-title');
				map["click"] = $(n).attr('data-click');
				list.push(map);
			});
			var titleShow = silde.attr('data-title');
			var isShow = false;
			if(!YT.isEmpty(titleShow) && titleShow == 'show'){
				isShow = true;
			}
			var auto = silde.attr('data-auto');
			auto = YT.isEmpty(auto) ? 3000 : auto;
			var lazy = true;
			if(silde.attr('data-lazy') == 'false'){
				lazy = false;
			}
			if(!tpl_html){
				me.initTpl(isShow, lazy);
			}
			silde.html(YT.template(tpl_html,{LIST:list}));
			
			var swiper = new Swiper('.ui-swiper-containe', {
				lazy : lazy,
				pagination: {
					el: '.swiper-pagination'
				},
				autoplay : {
					delay : auto,
					stopOnLastSlide : false,
					disableOnInteraction : true
				},
				on : {
					slideChange : function() {
						var evtName = silde.data('change');
						app[evtName] && app[evtName](silde);
					}
				}
			});
			silde.on('click','[data-click]',function(){
				var evtName = $(this).data('click');
				var index = $(this).data('index');
				app[evtName] && app[evtName](index);
			});
		},
		initTpl : function(isShow, lazy){
			var tpl = [];
			tpl.push('<div class="ui-swiper-containe">');
			tpl.push('	<div <div class="swiper-wrapper ui-swiper-wrapper">');
			tpl.push('{@each LIST as item,index}');
			tpl.push('		<div class="swiper-slide" data-click="${item.click}" data-index="${index}" >');
			if(lazy){
				tpl.push('			<img class="swiper-lazy" data-src="${item.img}" width="100%" height="'+height+'px" />');
				tpl.push('			<div class="swiper-lazy-preloader" style="height:'+height+'px"><div class="swiper-lazy-preloader-loadding"></div></div>');
			}else{
				tpl.push('			<img src="${item.img}" width="100%" height="'+height+'px" />');
			}
			if(isShow){
				tpl.push('		<div class="ui-swiper-title">${item.title}</div>');
			}
			tpl.push('		</div>');
			tpl.push('{@/each}');
			tpl.push('	</div>');
			tpl.push('<div class="swiper-pagination"></div>');
			tpl.push('</div>');
			tpl_html = tpl.join('')
		}
	};
}());
