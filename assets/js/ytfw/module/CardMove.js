(function() {
	var CardMove = YT.CardMove = {
		/**
		 * 
		 * @param ele 卡片切换的位置
		 * @param callback 卡片每次切换后回调方法
		 * @param index 显示在当前位置的卡片
		 */
		buildEle : function(ele, callback,index) {
			App.init(ele,callback,index);
		}
	}
	var App = {
		init : function(ele,callback,index) {
			App.callback = callback;
			App.card_slide_warp = ele.find('.ui-card-slide-warp');
			App.card_slide = ele.find('.ui-card-slide');
			App.slide_item = App.card_slide.find('.ui-card-slide-item');
			App.card_index = 0;
			App.prev_index = 0;
			App.prevX = 0;
			App.initEvent();
			App.initDef(index);
		},
		initEvent : function() {
			var slideDom = App.card_slide_warp[0];
			slideDom.addEventListener('touchstart', App, false);
			slideDom.addEventListener('touchmove', App, false);
			slideDom.addEventListener('touchend', App, false);
		},
		//设置默认卡片位置
		initDef: function(index){
			if(index){
				var item_w = App.slide_item.width() + 20;
				var item_len = App.slide_item.length;
				if(index < 0 ){
					App.card_index = 0;
				}else if(index > item_len){
					App.card_index = item_len;
				}else{
					App.card_index = index;
				}
				App.prevX = -item_w * App.card_index;
				App.domMove(App.prevX, true);
			}
		},
		handleEvent : function(e) {
			var type = e.type;
			switch (type) {
			case 'touchstart':
				App.start(e);
				break;
			case 'touchmove':
				App.move(e);
				break;
			case 'touchend':
				App.end(e);
				break;
			}
		},
		start : function(e) {
			var point = App.getPoint(e);
			App.curPageX = point.pageX;
		},
		move : function(e) {
			e.preventDefault();
			var point = App.getPoint(e);
			var movePageX = point.pageX;
			App.deltaX = movePageX - App.curPageX;
			App.domMove(App.deltaX + App.prevX);
		},
		end : function(e) {
			var item_w = App.slide_item.width() + 20;
			var item_len = App.slide_item.length;
			var x = Math.abs(App.deltaX);
			if (App.deltaX > 0) {
				if (x > item_w) {
					var index = Math.round(x / item_w);
					App.card_index = App.card_index - index;
				} else {
					if (x / item_w > 0.3) {
						App.card_index--;
					}
				}
			} else if (App.deltaX < 0) {
				if (x > item_w) {
					var index = Math.round(x / item_w);
					App.card_index = App.card_index + index;
				} else {
					if (x / item_w > 0.3) {
						App.card_index++;
					}
				}
			}
			if (App.card_index >= (item_len - 1)) {
				App.card_index = (item_len - 1);
			}
			if (App.card_index < 0) {
				App.card_index = 0;
			}
			App.prevX = -item_w * App.card_index;
			App.domMove(App.prevX, true);
			if(App.prev_index != App.card_index){
				App.prev_index = App.card_index;
				App.callback && App.callback(App.card_index);
			}
		},
		domMove : function(x, t) {
			if (t) {
				App.card_slide.css({
					'transform' : 'translate(' + x + 'px, 0px)',
					'transition' : 'transform 300ms ease'
				});
			} else {
				App.card_slide.css({
					'transform' : 'translate(' + x + 'px, 0px)',
					'transition' : 'transform 0ms ease'
				});
			}

		},
		getPoint : function(e) {
			return e.touches ? e.touches[0] : e;
		}

	}
})();