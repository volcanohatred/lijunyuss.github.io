/**
 * @Desc tab标签
 */
(function() {
	var Tab = YT.Tab = {
		/**
		 * params={
		 *		Panel : panel,//tab控件作用对象
		 *		Scroll : false,//是否关闭滑动切换
		 *		Page : pageA,//页面初始化对象
		 *		Json : YT.getParameters() || {}//页面初始化参数
		 *	};
		 */
		initTab : function(app,params) {
			var panel=params.Panel;
			var el = panel.find('.y-tab');
			Tab.App=app;
			Tab.Page=params.Page;
			Tab.Json=params.Json;
			el.each(function() {
				var box = Tab.box = $(this);
				// 获取所有子元素对象
				var menu = Tab.menu = box.find('[data-name=tab-ele]');
				// 获取作用域位置对象
				var content = Tab.content = box.find('[data-name=tab-ele-content]');
				// 子元素个数
				var num = menu.length;
				// 动态设置作用域宽度
				var slidedom = Tab.slidedom = box.find('.r-tab-container');
				var menuBox = menu.parent();
				var Width = content.parent().width() * num;
				// 作用域渲染
				var active = box.find(".active") === undefined ? box.find(".active") : menu.eq(0);
				active.addClass("active");
				active.attr("data-ready", "true");
				YT.loadPage(content.eq(active.index()), active.data("url"), {},
						function() {
							//表单初始化,统一表单初始化过程,表单赋值等
							YT.Form.initPanel(Tab.Page, Tab.App, Tab.Json);
							var callback = active.data("callback");
							if (!YT.isEmpty(callback)) {
								app[callback]  && app[callback](content.eq(active.index()));
							}
						});
				active.attr("data-ready", "false");
				// 子节点事件绑定
				menu.on('click', function() {
					var eThis = $(this);
					var index = eThis.index();
					var url = eThis.data('url');
					var callback = eThis.data('callback');
					var load = active.attr("data-ready", "true");
					if (url && load) {
						YT.loadPage(content.eq(index), url, {}, function() {
							YT.Form.initPanel(Tab.Page, Tab.App, Tab.Json);
							if (!YT.isEmpty(callback)) {
								app[callback] && app[callback](content.eq(index));
							}
						});
						eThis.attr("data-ready", "false");
						Tab.slideEvent(eThis, index, content, slidedom);
					}
				});
				//panel滑动事件绑定
				if(!params.Scroll){
					//判断当前设备是否支持touch事件
					var istouch=('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch;
					if(istouch){
						Tab.body=panel[0];
						Tab.body.addEventListener("touchstart",Fw.bind(Tab.start, this), false);
					}
				}
			});
		},
		/**
		 * 子元素切换
		 */
		slideEvent : function(ele, index, content, slidedom) {
			ele.addClass("active").siblings().removeClass("active");
			var leftW = $(window).width() * index * -1;
			slidedom.animate({
				left : leftW
			});
		},
		/**
		 * 滑动开始
		 * @param event
		 */
        start:function(event){
        	//touches数组对象获得屏幕上所有的touch，取第一个touch
            var touch = event.targetTouches[0];     
            //取第一个touch的坐标值
            Tab.startPos = {x:touch.pageX,y:touch.pageY,time:+new Date};    
            //判断是垂直滚动还是水平滚动，0为横向滑动
            Tab.isScrolling = 0;  
            Tab.body.addEventListener('touchmove',Fw.bind(Tab.move, this),false);
            Tab.body.addEventListener('touchend',Fw.bind(Tab.end, this),false);
        },
        /**
         * 移动
         * @param event
         */
        move:function(event){
            //当屏幕有多个touch或者页面被缩放过，就不执行move操作
            if(event.targetTouches.length > 1 || event.scale && event.scale !== 1) return;
            var touch = event.targetTouches[0];
            Tab.endPos = {x:touch.pageX - Tab.startPos.x,y:touch.pageY - Tab.startPos.y};
            //isScrolling为1时，表示纵向滑动，0为横向滑动
            Tab.isScrolling = Math.abs(Tab.endPos.x) < Math.abs(Tab.endPos.y) ? 1:0;    
            if(Tab.isScrolling === 0){
            	//阻止触摸事件的默认行为，即阻止滚屏
                event.preventDefault();
            }
        },
        /**
         * 滑动释放
         * @param event
         */
        end:function(event){
        	 //解绑事件
            Tab.body.removeEventListener('touchmove',Fw.bind(Tab.move, this),false);
            Tab.body.removeEventListener('touchend',Fw.bind(Tab.end, this),false);
        	//滑动的持续时间
            var duration = +new Date - Tab.startPos.time;
            if(Tab.isScrolling === 0){
                if(Number(duration) > 100){
                	var index=Tab.box.find(".active").index();
                	if(YT.isEmpty(Tab.endPos) || YT.isEmpty(Tab.endPos.x)){
                		return;
                	}
                    //判断是左移还是右移，当偏移量大于50时执行
                    if(Tab.endPos.x > 50){
                    	index=index-1;
                    }else if(Tab.endPos.x < -50){
                    	index=index+1;
                    }
                    //滑动超过子元素节点个数或低于0 
                    if(Tab.box.length<index || index<0){
                    	return;
                    }
                    var eThis = Tab.menu.eq(index);
					var url = eThis.data('url');
					var callback = eThis.data('callback');
					var load = Tab.box.find(".active").attr("data-ready", "true");
					if (url && load) {
						YT.loadPage(Tab.content.eq(index), url, {}, function() {
							YT.Form.initPanel(Tab.Page, Tab.App, Tab.Json);
							if (!YT.isEmpty(callback)) {
								Tab.App[callback] && Tab.App[callback](Tab.content.eq(index));
							}
						});
						eThis.attr("data-ready", "false");
						Tab.slideEvent(eThis,index,Tab.content,Tab.slidedom);
					}
                }
            }
        },
        /**
         * 多Tab过滤查询
         * @param panel
         * @param app
         * @param json
         */
        initTabFilter : function(panel, app, json){
			var changeTabEl = panel.find(".y-select-change-tab");
			if(changeTabEl.length < 1){
				return ;
			}
		
			Tab.initTabClick(changeTabEl,panel);	//tab标签
			Tab.initTabItemClick(changeTabEl,panel, app, json);	//tab子标签
			Tab.initShandow(changeTabEl);	//遮罩层
		},
		/**
		 * tab标签点击事件初始化
		 * @param changeTabEl
		 */
		initTabClick : function(changeTabEl,panel){
			changeTabEl.find(".y-select-change div").on('click','',function(obj){
				var curIndex = $(this).data('index');
				var isHidden = $(this).hasClass('makesoft1');
				if(isHidden){
					$(this).removeClass('makesoft1');
					$(this).addClass('makesoft');
					$(panel).parent().css('height','initial');//还原页面高度
					$(panel).css('height','initial');
					changeTabEl.find(".y-select-change-item[data-index='"+curIndex+"']").hide();	//隐藏子条目
					changeTabEl.find(".y-shandow").hide();	//隐藏遮罩层
					return ;
				}
				var preTabEl = changeTabEl.find(".y-select-change div[class='makesoft1']");
				preTabEl.removeClass('makesoft1');
				preTabEl.addClass('makesoft');
				var preIndex = preTabEl.data('index');
				changeTabEl.find(".y-select-change-item[data-index='"+preIndex+"']").hide();	//隐藏已显示子条目
				$(panel).parent().css('height','100%');//将页面撑满屏幕
				$(panel).css('height','100%');
				$(this).removeClass('makesoft');
				$(this).addClass('makesoft1');
				
				changeTabEl.find(".y-shandow").show();	//显示遮罩层
				changeTabEl.find(".y-select-change-item[data-index='"+curIndex+"']").stop().slideDown();	//显示子条目
			});
		},
		/**
		 * tab 子标签点击事件初始化
		 * @param changeTabEl
		 * @param panel
		 * @param app
		 * @param json
		 */
		initTabItemClick : function(changeTabEl,panel, app, json){
			var change = changeTabEl.data("change");
			changeTabEl.find(".y-select-change-item div").on('click','',function(){
				var preItemEl = $(this).siblings('.current');	//获取当前已选中的标签
				preItemEl.removeClass('current');
				$(this).addClass('current');
				var parentEl = $(this).parent();
				parentEl.hide();
				parentEl.attr("data-value",$(this).data('value'));
				var dataIndex = parentEl.data('index');
				var parTabEl = changeTabEl.find(".y-select-change div[data-index='"+dataIndex+"']");
				parTabEl.removeClass('makesoft1');
				parTabEl.addClass('makesoft');
				parTabEl.children("span:first-child").html($(this).html());
				changeTabEl.find(".y-shandow").hide();	//隐藏遮罩层
				change && app && app[change] && app[change]();
			});
		},
		/**
		 * 初始化遮罩层
		 * @param changeTabEl
		 */
		initShandow : function(changeTabEl){
			changeTabEl.find(".y-shandow").on('touchmove',function(e){	//遮罩层，禁止屏幕滑动
				e.preventDefault();
				e.stopPropagation();
			});
			changeTabEl.find(".y-shandow").on('click',function(e){
				changeTabEl.find(".y-select-change div").addClass('makesoft');
				changeTabEl.find(".y-select-change div").removeClass('makesoft1');
				changeTabEl.find(".y-shandow").hide();	//隐藏遮罩层
				changeTabEl.find(".y-select-change-item").hide();	//隐藏子条目
			});
			var winHeight = $(window).height();
			changeTabEl.find(".y-shandow").height(winHeight);
		},
	};
}());
