/**
 * @name YT.AssistiveTouch
 * @class 辅助功能按钮
 * @constructor
 * @example
 * @return
 * @author	SM
 * @param
 * 		x:x坐标位置,
 * 		y:y坐标位置,
 * 		width:图片宽度,
 * 		touchMove:是否需要滑动处理
 * @default
 * 		
		var touchOne=new YT.AssistiveTouch();
		//监听事件
		touchOne.on('tap',function(e,touch){
			alert('touchClick');
		}, this);
 */
YT.AssistiveTouch = YT.extend(YT.Component, {
	//默认宽度
	width: 32,
	/**
	 * 获取dom元素ID
	 * @return {}
	 */
	getTouchId: function(){
		return this.el[0].id;
	},
	/**
	 * 初始化组件
	 */
	initComponent: function(){
		YT.AssistiveTouch.superclass.initComponent.call(this);
		//设置属性
		this.initDomAttribute();
	},
	/**
	 * 设置属性
	 */
	initDomAttribute: function(){
		var me=this;
		var touch=$("#"+this.getTouchId());//Touch元素
		touch.addClass("assistiveTouch");//添加样式
		var height=this.width;
		//设置参数
		touch.css({
			"top":"20px",
			"right":"30px",
			"width":this.width+"px",
			"height":height+"px"
		});
		
	},
	/**
	 * 初始化事件
	 */
	initEvents: function(){
		//注册单机事件
		var touch=$("#"+this.getTouchId());//dom元素
		//注册滑动事件
		//if(this.touchMove)
		touch.on('touchmove',YT.bind(this.onTouchMove, this));
		//touch.on("touchend",YT.bind(this.onTouch, this));	
		touch.on("click",YT.bind(this.onTouch, this));	
	},
	/**
	 * 初始化HTML模版
	 */
	initTpl: function(){
		var touchId=YT.id();//产生Dom元素ID
		var str='<div id="'+touchId+'"></div>';//class="assistiveTouch"
		$("body").append(str);
		this.el=$("#"+touchId);
	},
	/**
	 * 移动事件
	 * @param {} e
	 */
	onTouchMove: function(e){
		event.preventDefault();
		//alert(e.originalEvent);
		//alert(e.originalEvent.touches[0].pageX);
		var newX=e.originalEvent.touches[0].pageX;
		var newY=e.originalEvent.touches[0].pageY;//e.touches[0].pageY;
		var screenW=$(window).width();
		var screenH=$(window).height();
		/*console.log("this.width", this.width);
		console.log("newX", newX);*/
		var touch=$("#"+this.getTouchId());//dom元素
		if((newX+this.width)>screenW){
			newX=screenW-this.width;
		}
		if( newX < 0){
			newX = 0;
		}
		if( newY < 0){
			newY = 0;
		}
		if((newY+this.width)>screenH){
			newY=screenH-this.width;
		}
		setTimeout( function(){
			touch.css("top",newY+"px");//Y
			touch.css("left",newX+"px");//x
		}, 50);
	},
	/**
	 * 单击按钮时触发
	 * @param {} e
	 */
	onTouch: function(e){
		var target, el;
		if(!e || !(target = e.target)){
			return false;
		}
		
		//注册事件
		this.fireEvent('tap', e, this);
		
	}
});