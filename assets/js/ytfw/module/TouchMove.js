/**
 * 仿QQ左滑，显示删除等按钮。适配pc
 */
YT.TouchMove = YT.extend(YT.Component,{
	directionLockThreshold: 10, //确定滚动方向的阀值
	me : null,
	trackClick : false,
	touchEvent : { //事件名称
		start: YT.touch() ? 'touchstart' : 'mousedown',
		move: YT.touch() ? 'touchmove' : 'mousemove',
		end: YT.touch() ? 'touchend' : 'mouseup'
	},
	/**
	 * 初始化组件
	 */
	initComponent: function(){
		YT.TouchMove.superclass.initComponent.call(this);
	},
	 /**
     * 依赖组件
     */
    requires : [
       
    ],
    initTpl: function(){
    	me = this;
    },
    /**
     * 初始化事件
     */
    initEvents: function(){
		this.vertical = false; //是否为垂直方向
		this.horizontal = false; //水平方向
		this.moveY = 0;
		this.el.on(me.touchEvent.start,'.ui-silder-handle',function(e){
			me.start(e,this);
		});
		this.el.on(me.touchEvent.move,'.ui-silder-handle',function(e){
			me.move(e);
		});
		this.el.on(me.touchEvent.end,'.ui-silder-handle',function(e){
			me.end(e);
		});
		this.el.on('click','.ui-silder-handle',YT.bind(function(){
			if(this.moved){
				this.resetDom(0);
				setTimeout(YT.bind(function(){
					this.moved = false;
				},500),this);
				return false;
			}else{
				this.moved = false;
			}
		},this));
		this.el.on('click','.ui-silder-btn',YT.bind(function(){
			this.moved = false;
			this.resetDom();
		},this));
    },
    start : function(e,thizz){
    	me.trackClick = true;
		me.currentE = $(thizz);
		me.vertical = false;
		me.horizontal = false;
		if(me.moved){
			me.resetDom(0);
			setTimeout(function(){
				me.moved = false;
			},500);
		}else{
			me.moved = false;
		}
		me.distX = 0,me.distY = 0;
		
		e.stopPropagation();
		var point = me.getPoint(e);
		me.pointX = point.pageX;
		me.pointY = point.pageY;
    },
    move : function(e){
    	if(me.currentE){
    		if(!me.moved && me.trackClick){
    			var point = me.getPoint(e);
        		me.deltaX = point.pageX- me.pointX;
        		var absDistX = 0;
        		var distY = point.pageY;
        		var absDistY = Math.abs(me.pointY-distY);
        		if(!me.vertical){
        			if(!me.horizontal){
            			if(absDistY > 10){
            				me.vertical = true; //垂直方向
            			}
            		}
            		me.deltaX = me.deltaX ? me.deltaX : 0;
            		absDistX = Math.abs(me.deltaX);
            		var parent = $(me.currentE).parent();
            		var del_width = parent.find(".ui-silder-right").width(); //侧滑显示的按钮宽度
            		me.dirX = -del_width; 
            		if (absDistX > me.directionLockThreshold) {
            			e.preventDefault();
            			if(me.dirX <= me.deltaX && me.deltaX < 0){
            				me.domMove(me.deltaX,me.currentE);
            			}
            			me.horizontal = true;
            		}
        		}
        		
    		}
    	}
    },
    end : function(e){
    	if(me.currentE){
    		me.trackClick = false;
    		var clazz = $(e.target).attr("class");
    		if("ui-silder-btn" == clazz || me.vertical){
    			return ;
    		}
    		if(me.dirX/3 > me.deltaX){
    			me.domMove(me.dirX,me.currentE);
    			me.moved = true;
    		}else{
    			me.domMove(0,me.currentE);
    		}
    		me.deltaX = 0;
    		me.currentE = null;
    	}
	},
	domMove:function(X,curEl){
		var parent = $(curEl).parent();
		var paid = (1-(Math.abs(X) / Math.abs(this.dirX))) * 100;
		parent.find(".ui-silder-right").css({
			'transform': 'translate('+paid+'%, 0px)',
			'transition' : 'transform 0ms ease'
		});
		$(curEl).css({
			'transform': 'translate('+X+'px, 0px)',
			'transition' : 'transform 0ms ease'
		});
	},
	resetDom: function(){
		this.el.find(".ui-silder-right").css({
			'transform': 'translate(100%, 0px)',
			'transition' : 'transform 300ms ease'
		});
		this.el.find(".ui-silder-handle").css({
			'transform': 'translate(0px, 0px)',
			'transition' : 'transform 300ms ease'
		});
	},
	getPoint : function(e){
		//e.originalEvent.targetTouches[0].pageX
		if(YT.touch()){
			return e.originalEvent.targetTouches[0];
		}else{
			return e;
		}
	}
    
});