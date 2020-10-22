/**
 * @name YT.ListView
 * @class 列表组件
 * @constructor
 * @example
 * @return
 */
YT.ListView = YT.extend(YT.Component, {
	pageSize : 5,// 每页条数
	currentPage : 1,// 当前页
	// 最大缓存页数
	maxPages : 6,
	data0 : null,// 第一页数据
	cacheDatas : new Array(),// 非第一页数据缓存
	topPageIndex : 1,
	bottomPageIndex : 1,
	trackClick : false,
	pullText : '下拉可刷新',
	releaseRefreshText : '释放立即刷新',
	refreshNow : '正在刷新',
	refreshComplete : '刷新完成',
	loadMoreText : '上拉加载更多',
	loadMoreNow : '加载中...',
	emptyText : '暂无交易记录',
	emptyTpl : '${emptyText}',
	itemCls : 'list-item', //默认点击触发的class
	pressedCls : 'pressed',
	disclosureCls : 'disclosure',
	//pageStartField : "NEXT_KEY",
	pageStartField : "nextPageNo",
	pageLimitField : "PAGE_SIZE",
	dataField : "LIST",
	loadMore : true,
	refresh : true, //是否需要刷新功能
	isRefresh : false, //是否正在刷新
	isStop : false,
	finish : false,
	touchEvent : {
		start: YT.touch() ? 'touchstart' : 'mousedown',
		move: YT.touch() ? 'touchmove' : 'mousemove',
		end: YT.touch() ? 'touchend' : 'mouseup'
	},
	/**
	 * 初始化组件
	 *
	 * @name YT.ListView.initComponent
	 * @function
	 */
	initComponent : function() {
		YT.ListView.superclass.initComponent.call(this);
		this.params = (this.ajax && this.ajax.params) || {};// 原始请求参数
		// 新建ajax工具类
		this.ajax = new YT.Ajax(YT.apply(this.ajax, {
			autoLoad : false
		}));
		// 初始化滑动翻页
		if (this.page === false) {
			this.pageSize = 0;
		} else {
			this.initScrollable();
		}
	},
	/**
	 * 初始化事件
	 */
	initEvents : function() {
		this.ajax.on('load', YT.bind(this.onLoadData,this), this);
		/*if(YT.isEmpty(this.clickItem)){
			this.body.on('click', '.'+this.itemCls ,YT.bind(this.onItemClick, this));
		}else{
			this.body.on('click', '.'+this.clickItem ,YT.bind(this.onItemClick, this));
		}*/
		this.body.on('click', '[data-listEvent]' ,YT.bind(this.onItemClick, this));
		var body = this.body[0];
		body.addEventListener(this.touchEvent.start,YT.bind(this.onItemTouchStart, this),false);
		body.addEventListener(this.touchEvent.move,YT.bind(this.onItemTouchMove, this),false);
		body.addEventListener(this.touchEvent.end,YT.bind(this.onItemTouchEnd, this),false);
		if(this.refresh){
			// 加载最新
			this.on('refresh', YT.bind(this.onRefresh,this));
		}
		// 加载更多
		this.on('loadmore', YT.bind(this.onLoadMore,this));
	},
	/**
	 * 初始化HTML模版
	 */
	initTpl : function() {
		var tpl = [], id = YT.id();
		var panel = this.el;
		if (this.page !== false) {
			tpl.push('<div class="view-pullrefresh pullrefresh hidden">'
					+ '<div class="pullrefresh-arrow"></div>' + '<div class="pullrefresh-text"></div><div id="listview-up-down" class="view-up-down"/></div>'+ '</div>');
		}
		tpl.push('<div class="load-empty hidden">');
		tpl.push(this.emptyTpl);
		tpl.push('</div>');
		tpl.push('<div class="body list-view"></div>');
		if (this.page !== false) {
			tpl.push('<div class="view-loadmore loadmore ui-center hidden"><span style="background:url(assets/img/common/loading.gif) no-repeat;width:20px;height:20px;"></span>${loadMoreText}</div>');
		}
		this.el.html(YT.template(tpl, {
			emptyText : this.emptyText,
			loadMoreText : this.loadMoreText
		}));
		this.el.css({
			"position" : "relative"
		});
		this.emptyEl = panel.find('.load-empty');
		this.body = panel.find('.body.list-view');
		this.tpl = [];
		this.tpl.push('{@each data as item,index}');
		this.tpl.push('<div class="${itemCls|fmtItemCls} ${disclosureCls}" _index="${index}" _page="${page}">');

		YT.each(this.itemTpl, function(item) {
			this.tpl.push(item);
		}, this);

		this.tpl.push('</div>');
		this.tpl.push('{@/each}');
		this.tpl.push({
			fmtRowNo : YT.bind(function(index) {
				var rst = 1 * index + (this.pageSize * (this.currentPage - 1)) + 1;
				return rst;
			}, this),
			onItemAdd : YT.bind(this.onItemAdd, this),
			fmtItemCls : YT.bind(function() {
				return this.itemCls;
			}, this)
		});
		// 自定义格式化方法注册
		if (this.custFmtFuncs) {
			this.tpl.push(this.custFmtFuncs);
		}
		this.tpl = YT.template(this.tpl);
	},
	/**
	 * 初始化滑动翻页
	 */
	initScrollable : function() {
		var panel = this.el;
		this.pullRefreshEl = panel.find('.pullrefresh');
		this.pullRefreshArrowEl = this.pullRefreshEl.find(".pullrefresh-arrow");
		this.pullRefreshTextEl = this.pullRefreshEl.find(".pullrefresh-text");
		this.pullRefreshTextEl.html(this.pullText);
		this.loadMoreEl = panel.find('.loadmore');

		this.loadMoreEl.on("click", YT.bind(this.onLoadMore, this));
		YT.apply(this, {
			// 滚动距离
			getScrollTop : function() {
				var bodyScrollTop = 0, documentScrollTop = 0;
				if (document.body) {
					bodyScrollTop = document.body.scrollTop;
				}
				if (document.documentElement) {
					documentScrollTop = document.documentElement.scrollTop;
				}
				return (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop;
			},
			// 文档高度
			getScrollHeight : function() {
				var bodyScrollHeight = 0, documentScrollHeight = 0;
				if (document.body) {
					bodyScrollHeight = document.body.scrollHeight;
				}
				if (document.documentElement) {
					documentScrollHeight = document.documentElement.scrollHeight;
				}
				return (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight;
			},
			// 浏览器高度
			getWindowHeight : function() {
				if (document.compatMode == "CSS1Compat") {
					return document.documentElement.clientHeight;
				} else {
					return document.body.clientHeight;
				}
			}
		});
		// 定义触摸事件
		YT.log.debug("init scroll end");
	},
	/**
	 * 加载更多，尾部加载更多
	 */
	onLoadMore : function() {
		this.loadMoreEl.html(this.loadMoreText);
		delete this.pullEventName;
		if (this.ajax.isLoading || this.isStop) {
			return;
		}
		this.loading = true;
		// 设置页码
		this.appendflag = "append";
		this.loadData(this.bottomPageIndex + 1);
		
	},
	onRefresh : function() {
		this.loading = true;
		// 设置页码
		this.appendflag = "append";
		this.loadData(1);
		var up_down = this.pullRefreshTextEl.siblings(".view-up-down");
	},
	/**
	 * 载入数据
	 *
	 * @param {}
	 *            page
	 */
	loadData : function(page, data) {
		if(YT.isEmpty(page)){
			this.cacheDatas = [];
		}
		page = page || 1;
		// this.appendflag = this.appendflag || "padding";
		this.appendflag = this.appendflag || "append";
		if (data) {
			this.onLoadData(this.ajax, data, true);
			return;
		}
		this.currentPage = page;
		this.emptyEl.hide();
		var params = this.params || {};// 保留原请求参数
		params[this.pageStartField] = page + "";// (page == 1 ? page : (page - 1) * this.pageSize + 1) + "";
		params[this.pageLimitField] = this.pageSize + "";
		//当有pageNo时，更新
		YT.log.info(params.pageNo)
		if(params.pageNo){
			params.pageNo = page + "";
		}
		this.ajax.load(params);
	},
	/**
	 * 载入数据后触发
	 *
	 * @param {}
	 *            ajax
	 * @param {}
	 *            data
	 */
	onLoadData : function(ajax, rst, noCache) {
		this.pullRefreshTextEl.html(this.refreshComplete);
		$('#listview-up-down').attr('class','complete');
		this.el.removeClass('ui-prev-loading');
		//this.el.find(".view-up-down").addClass('complete').removeClass('up-down');
		this.body.css({
			"top" : "0px",
			"-webkit-transition-duration" : "1003ms",
			"transition-delay": ".3s"
		});
		var me = this;
		if(this.hiddenRefresh){
			clearTimeout(this.hiddenRefresh);
		}
		me.isRefresh = false;
		this.hiddenRefresh = setTimeout(function(){
			me.pullRefreshEl.hide();
		},1000);
		
		var hasMore = true;
		var nextKey = rst[this.pageStartField];
		if (this.custFunc4NextPage) {
			hasMore = this.custFunc4NextPage(rst, this.currentPage);
		} else if (nextKey == "" || nextKey == null || nextKey == -1) {
			hasMore = false;
		} else {
			hasMore = true;
			this.nextPageStartId = nextKey;
		}
		this.hasMore = hasMore;
		// 如果配置page:true && listView.loadData(1,data);的时候,这里的noCache始终是true,
		// 所以导致 var append 变量为 this.appendflag == padding 而报错.
		var datas = rst ? this.dataField ? rst[this.dataField] : rst : null;
		// datas = datas.list || datas; //返回不成功时，取datas.list报错;返回成功时，返回的结果集不包含list报错
		if (!YT.isArray(datas) || datas.length === 0) {
			if (this.currentPage == 1 && this.bottomPageIndex <= 1) {
				this.emptyEl.show();
				this.finish = true;
				// 未查询到数据返回;不显示【数据加载完成】提示语
				this.fireEvent('loadsuccess', rst);
				return;
			}
		} else {
			if (this.onItemAdd(rst) != false) {
				// 将HTML渲染到页面
				var append = (this.currentPage === 1 && noCache != true) ? 'html' : this.appendflag;
				var htm = this.tpl.render({
					itemCls : this.itemCls,
					disclosureCls : this.disclosure ? this.disclosureCls : '',
					page : this.currentPage,
					data : datas,
					rpdata: rst
				});
				this.body[append](htm);
				this.data = datas;
				/**
				 * 如果传了这个参数，回调函数会带返回数据回去
				 * 2020年8月21日11:53:57 zhangjingyu
				 */
				if(this.callbackPara){
					this.callback && this.callback(rst);//加载页面完成后执行回调
				}else{
					this.callback && this.callback();//加载页面完成后执行回调
				}
			}
		}
		if (this.loadMoreEl) {
			if (YT.os == "web") {
				if (this.hasPrev == true) {
					this.pullRefreshTextEl.text("点击加载历史数据");
					this.pullRefreshArrowEl.remove();
				}
				if (this.hasMore == false) {
					if(YT.isEmpty(datas)||datas==""){
						this.loadMoreEl.text(this.wantMoreToLoad ||"暂未发布产品")
					}else{
						this.loadMoreEl.text(this.wantMoreToLoad ||"");//|| "数据加载已完成"						
					}
					this.finish = true;
					// 加载完成后禁用点击事件
					this.loadMoreEl.off("click");
				}
				this.loadMoreEl.removeClass("hidden");
				this.loadMoreEl.show();
			} else {
				if (this.hasMore == false) {
					this.finish = true;
					if(YT.isEmpty(datas)||datas==""){
						this.loadMoreEl.text(this.wantMoreToLoad ||"暂未发布产品")
					}else{
					this.loadMoreEl.text(this.wantMoreToLoad ||"");//|| "数据加载已完成"
					}
					// 加载完成后禁用点击事件
					this.loadMoreEl.unbind("click");
				}else{
					this.finish = false;
				}
				this.loadMoreEl.show();
			}
		}
		if (this.currentPage == 1) {
			this.data0 = datas;// 第一页的缓存单独存储
		} else {
			// 当前页数据缓存（非第一页）
			this.cacheDatas.push({
				pageNo : this.currentPage,
				datas : datas
			});
		}
		this.loading = false;
		this.fireEvent('loadsuccess', rst);
		this.bottomPageIndex = this.currentPage;
		
	},
	getPageData : function(pageNo) {
		if (pageNo == 1) {
			return this.data0;
		} else {
			for (var i = 0, j = this.cacheDatas.length; i < j; i++) {
				var cache = this.cacheDatas[i];
				if (cache.pageNo == pageNo) {
					return cache.datas;
				}
			}
		}
		return null;
	},
	/**
	 * 获取记录数据
	 *
	 * @param pageNo
	 * @param index
	 * @returns
	 */
	getItemData : function(pageNo, index) {
		var data = this.getPageData(pageNo);
		if (data == null) {
			data = this.data;
		}
		return data && data[index];
	},
	/**
	 * 添加成员时触发
	 *
	 * @param {}
	 *            item
	 * @param {}
	 *            index
	 */
	onItemAdd : function(item, index) {
		return this.fireEvent('beforeitemadd', item, index, this);
	},
	/**
	 * 点击单条记录出发
	 *
	 * @param e
	 * @returns {Boolean}
	 */
	onItemClick : function(e) {
		var el = $(e.currentTarget);
		var event = el.attr('data-listEvent');
		if (!el.hasClass(this.itemCls) && !(el = el.bubbleByCls(this.itemCls))) {
			return false;
		}
		var index = el.attr('_index') * 1;
		var pageNo = el.attr('_page') * 1;
		var trueIndex = index + (pageNo - 1) * this.pageSize; // 记录序号
		this.$touchItemData = this.getItemData(pageNo, index);
		if (this.fireEvent('beforeitemtap', this.$touchItemData, trueIndex, el, e, this) !== false) {
			el.addClass(this.pressedCls);
			this.tapItem = el;
		}
		if (this.tapItem) {
			var index = this.tapItem.attr('_index') * 1 + (this.tapItem.attr('_page') - 1) * this.pageSize;
			this.fireEvent('itemtap', this.$touchItemData, index, this.tapItem, e, this);
			if(this.itemtap){
				this.itemtap(this.$touchItemData, index, this.tapItem, e, this);
			}
			if(event){
				e.stopPropagation();
				this.application && this.application[event](this.$touchItemData, index, this.tapItem, e, this);
			}
			delete this.tapItem;
		}
	},
	/**
	 * Item Touch Start时触发
	 *
	 * @param {}
	 *            e
	 */
	onItemTouchStart : function(e) {
		this.trackClick = true;
		this.$startPageX = this.getPageX(e);// 起始X位置
		this.$startPageY = this.getPageY(e);// 起始Y位置
		this.$endPageY = 0;// 移动的Y轴距离
	},
	/**
	 * Item Touch Move时触发
	 *
	 * @param {}
	 *            e
	 */
	onItemTouchMove : function(e) {
		if(this.trackClick){//如果没有触发start则不执行(适配pc)
			delete this.pullEventName;
			if (!this.ajax.isLoading && !this.isStop) {//请求是否加载完成,是否主动停止滑动
				this.$endPageX = this.$startPageX - this.getPageX(e); // 移动的X轴距离
				this.$endPageY = this.$startPageY - this.getPageY(e); // 移动的X轴距离
				var absPostX = Math.abs(this.$endPageX);
				var absPostY = Math.abs(this.$endPageY);
				if (absPostX > 5 && absPostY < 5) {
					//return false;
				}else{
					this.$endPageY = this.$startPageY - this.getPageY(e); // 移动的Y轴距离

					var scroll = "translateY(" + this.$endPageY + "px)";
					// 头部
					if (this.pullRefresh !== false && this.$endPageY < 0) {
						if(this.refresh && !this.isRefresh){
							if (this.getScrollTop() <= 5) {
								e.preventDefault();
							}
							var p = Math.abs(this.$endPageY);
							this.pullRefreshArrowEl.removeClass('pullrefresh-release');
							if (p < 180) {
								this.body.css({
									"-webkit-transition-timing-function" : "cubic-bezier(0.1, 0.57, 0.1, 1)",
									"top" : Math.abs(this.$endPageY * 0.7)+ "px",
									"-webkit-transition-duration" : "0ms",
									"transition-delay": "0s"
								});
							}
							var up_down = this.pullRefreshTextEl.siblings("#listview-up-down");
							if (p > 30) {
								this.pullRefreshEl.show();
								this.pullRefreshTextEl.html(this.pullText);
								up_down.attr("class","up-down");
							}
							if (p > 90) {
								if(!up_down.hasClass('active')){
									this.pullRefreshTextEl.html(this.releaseRefreshText);
									var up_down = this.pullRefreshTextEl.siblings("#listview-up-down");
									up_down.addClass("active");
								}
								this.pullEventName = 'refresh';
							}else {
								this.pullRefreshTextEl.html(this.pullText);
								delete this.pullEventName;
							}
						}
					}else if (this.getScrollTop() + this.getWindowHeight() > (this.getScrollHeight() - 150)) {// 底部
						if (!this.finish) { // 数据加载完成
							e.preventDefault();
							var p = Math.abs(this.$endPageY);
							if (p > 100) {
								this.loadMoreEl.html("松开加载更多");
								this.pullEventName = 'loadmore';
							} else {
								delete this.pullEventName;
							}
							if (p < 150) {
								this.body.css({
									"-webkit-transition-timing-function" : "cubic-bezier(0.1, 0.57, 0.1, 1)",
									"top" : "-" + this.$endPageY * 0.6 + "px",
									"-webkit-transition-duration" : "0ms",
									"transition-delay": "0s"
								});
							}
						}
					}
				}
				
			}
		}
	},
	getPageX : function(e){
		if(YT.touch()){
			return e.targetTouches[0].pageX;
		}else{
			return e.pageX;
		}
	},
	getPageY : function(e){
		if(YT.touch()){
			return e.targetTouches[0].pageY;
		}else{
			return e.pageY;
		}
	},
	/**
	 * Item Touch End时触发
	 *
	 * @param {}
	 *            e
	 */
	onItemTouchEnd : function(e) {
		this.$endPageY = 0;// 移动的Y轴距离
		this.trackClick = false;
		if (this.pullEventName) {
			if(this.pullEventName == "refresh"){
				this.body.css({
					"top" : "50px",
					"-webkit-transition-duration" : "1001ms",
					"transition-delay": "0s"
				});
				this.pullRefreshTextEl.html(this.refreshNow);
				var up_down = this.pullRefreshTextEl.siblings("#listview-up-down");
				up_down.attr("class","loading");
				this.isRefresh = true;
			}
			if(this.pullEventName == "loadmore"){
				this.loadMoreEl.html(this.loadMoreNow);
			}
			this.fireEvent(this.pullEventName, this);
			delete this.pullEventName;
		}else{
			this.body.css({
				"top" : "0px",
				"-webkit-transition-duration" : "1002ms",
				"transition-delay": "0s"
			});
			var me = this;
			if(this.hiddenRefresh){
				clearTimeout(this.hiddenRefresh);
			}
			this.hiddenRefresh = setTimeout(function(){
				me.pullRefreshEl.hide();
			},800);
		}
		
	}
});
