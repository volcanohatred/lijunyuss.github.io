/**
 *
 *  @classDesc 组件类库
 *  @exports Fw/Component
 */
YT.Component = function(config){
	YT.apply(this, config);
	//call parent
	YT.Component.superclass.constructor.call(this);
	//初始化组件
	this.initComponent();
	//初始化事件
	this.initEvents();
	//完成渲染
	this.finishRender();
	return this;
};
YT.extend(YT.Component, YT.util.Observable, {
	/**
	 * 初始化组件
	 */
	initComponent: function(){
		//EL
		this.el = this.contentEl && (YT.isString(this.contentEl) ? $('#' + this.contentEl) : this.contentEl);
		//初始化渲染模板
		this.initTpl();
	},
	/**
	 * 初始化事件
	 */
	initEvents: YT.emptyFn,
	/**
	 * 初始化HTML模版
	 */
	initTpl: YT.emptyFn,
	/**
	 * 完成渲染
	 */
	finishRender: function(){
		this.fireEvent('render', this);
	}
});