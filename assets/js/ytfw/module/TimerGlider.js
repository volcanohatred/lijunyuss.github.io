/**
 * @name YT.TimerGlider
 * @class 列表组件
 * @constructor
 * @example
 * @return
 */
YT.TimerGlider = YT.extend(YT.Component, {
	// 每页条数
	pageSize : 5,
	// 当前页
	currentPage : 1,
	// 最大缓存页数
	maxPages : 6,
	data0 : null,// 第一页数据
	cacheDatas : new Array(),// 非第一页数据缓存
	topPageIndex : 1,
	bottomPageIndex : 1,
	//
	pullText : '下拉可刷新',
	releaseRefreshText : '释放立即刷新',
	loadMoreText : '加载更多数据',
	emptyText : '没有数据',
	emptyTpl : '${emptyText}',
	itemCls : 'list-item',
	animationCls : 'animation-thumb',
	itemClick : '', // 绑定click事件
	// itemCls: 'ui-border-t',
	disclosureCls : 'disclosure',
	pageStartField : "NEXT_KEY",
	pageLimitField : "PAGE_SIZE",
	loadMore : true,
	refresh : true, // 是否需要刷新功能
	isStop : false,
	finish : false,
	/**
	 * 初始化组件
	 * 
	 * @name YT.TimerGlider.initComponent
	 * @function
	 */
	initComponent : function() {
		YT.TimerGlider.superclass.initComponent.call(this);
		// console.log("ajax.autoLoad:" + this.ajax.autoLoad);
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
		this.ajax.on('load', this.onLoadData, this);
		if (YT.isEmpty(this.itemClick)) {
			this.body.on('click', '.' + this.itemCls, YT.bind(this.onItemClick, this));
		} else {
			this.body.on('click', '' + this.itemClick, YT.bind(this.onItemClick, this))
			YT.log.info(this.itemClick);
		}
		var body = this.body[0];
		body.addEventListener("touchstart", YT.bind(this.onItemTouchStart, this), false);
//		body.addEventListener("touchmove", YT.bind(this.onItemTouchMove, this), false);
		body.addEventListener("touchend", YT.bind(this.onItemTouchEnd, this), false);
		if (this.refresh) {
			// 加载最新
			this.on('refresh', this.onRefresh);
		}
		// 加载更多
		this.on('loadmore', this.onLoadMore);
	},
	/**
	 * 初始化HTML模版
	 */
	initTpl : function() {
		var tpl = [], id = YT.id();
		if (this.page !== false) {
			tpl.push('<div id="${id}-pullrefresh" class="pullrefresh hidden">'
					+ '<div class="pullrefresh-arrow"></div>' + '<div class="pullrefresh-text"></div>' + '</div>');
		}
		tpl.push('<div id="${id}-empty" class="load-empty hidden">');
		tpl.push(this.emptyTpl);
		tpl.push('</div>');
		tpl.push('<div id="${id}" class="body list-view"></div>');
		if (this.page !== false) {
			tpl.push('<div id="${id}-loadmore" class="loadmore ui-center hidden">${loadMoreText}</div>');
		}
		this.el.html(YT.template(tpl, {
			id : id,
			emptyText : this.emptyText,
			loadMoreText : this.loadMoreText
		}));
		this.el.css({
			"position" : "relative"
		});
		this.emptyEl = $('#' + id + '-empty');
		this.body = $('#' + id);
		this.tpl = [];
		// this.tpl.push('<ul id="page-${page}" class="ui-list ui-list-text ui-list-link ui-border-tb">');
		this.tpl.push('{@each data as item,index}');
		this.tpl.push('<div class="${itemCls|fmtItemCls} ${disclosureCls}" _index="${index}" _page="${page}">');

		YT.each(this.itemTpl, function(item) {
			this.tpl.push(item);
		}, this);

		this.tpl.push('</div>');
		this.tpl.push('{@/each}');
		// this.tpl.push('</ul>');
		me = this;
		this.tpl.push({
			fmtRowNo : YT.bind(function(index) {
				var rst = 1 * index + (me.pageSize * (me.currentPage - 1)) + 1;
				return rst;
			}, this),
			onItemAdd : YT.bind(this.onItemAdd, this),
			fmtItemCls : YT.bind(function() {
				// 允许item在渲染前，定制itemCls
				return this.itemCls;
//				return this.itemCls + ' ' + this.animationCls;
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
		var bodyId = this.body.attr('id');
		this.pullRefreshEl = $('#' + bodyId + '-pullrefresh');
		this.pullRefreshArrowEl = $(this.pullRefreshEl[0].childNodes[0]);
		this.pullRefreshTextEl = $(this.pullRefreshEl[0].childNodes[1]);
		this.pullRefreshTextEl.html(this.pullText);
		this.loadMoreEl = $('#' + bodyId + '-loadmore');
		var me = this;

		me.loadMoreEl.on("click", YT.bind(me.onLoadMore, me));
		YT.apply(me, {
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
		delete me.pullEventName;
		if (me.ajax.isLoading || me.isStop) {
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
	},
	/**
	 * 载入数据
	 * 
	 * @param {}
	 *            page
	 */
	loadData : function(page, data) {
		page = page || 1;
		// this.appendflag = this.appendflag || "padding";
		this.appendflag = this.appendflag || "append";
		YT.log.debug("padding flag " + this.appendflag + ",to load pageNo:" + page);
		if (data) {
			YT.log.debug("------loadData-1----");
			this.onLoadData(this.ajax, data, true);
			return;
		}
		YT.log.debug("------loadData-2----");
		this.currentPage = page;
		this.emptyEl.hide();
		var params = this.params || {};// 保留原请求参数
		params[this.pageStartField] = (page - 1) * this.pageSize + "";// page + "";
		params[this.pageLimitField] = this.pageSize + "";
		YT.log.debug("------loadData-3----" + YT.JsonToStr(params));
		YT.openWaitPanel();
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
		YT.hideWaitPanel();
		YT.log.debug("------onLoadData-1---");
		var hasMore = true;
		var hasNextPage = rst[this.hasNextPageField];
		if (this.custFunc4NextPage) {
			hasMore = this.custFunc4NextPage(rst, this.currentPage);
		} else if (hasNextPage == "" || hasNextPage == null || hasNextPage == -1 || hasNextPage == 'Y') {
			hasMore = false;
		} else {
			hasMore = true;
		//	this.nextPageStartId = hasNextPage;
		}
		this.hasMore = hasMore;
		// 如果配置page:true && TimerGlider.loadData(1,data);的时候,这里的noCache始终是true,
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
					data : datas
				});
				this.body[append](htm);
				this.data = datas;
			}
		}
		if (this.loadMoreEl) {
			if (YT.os == "web") {
				if (this.hasPrev == true) {
					this.pullRefreshTextEl.text("点击加载历史数据");
					this.pullRefreshArrowEl.remove();
				}
				if (this.hasMore == false) {
					this.loadMoreEl.text("数据加载已完成");
					this.finish = true;
					// 加载完成后禁用点击事件
					this.loadMoreEl.off("click");
				}
				this.loadMoreEl.removeClass("hidden");
				this.loadMoreEl.show();
			} else {
				if (this.hasMore == false) {
					this.loadMoreEl.text("数据加载已完成");
					// 加载完成后禁用点击事件
					this.loadMoreEl.unbind("click");
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
		this.animation();
	},
	animation : function() {
		var me = this;
		var animation = this.body.find('.' + this.animationCls);
		var height = animation.eq(0).height();
		animation.height('0');
		$.each(animation, function(i, n) {
			me.setQueue(document, function() {
				me.fusion($(n), height, me.animationCls);
			});
		});
		me.deQueueGo();
	},
	fusion : function(ele, h, clazz) {
		var me = this;
		ele.animate({height : h}, 0,function(){
			ele.css({'height' : 'auto'});
		});
		ele.removeClass(clazz);
//		setTimeout(function(){
//			ele.css({'height' : 'auto'});
//		},540);
	},
	setQueue : function(el, callback) {
		$.queue(el, "fx", callback);
	},
	deQueueGo : function(){
		var arr = $(document).queue("fx");
		var len = arr.length;
		var me = this;
        $.each(arr,function(i,v){
            setTimeout(function(){
                $.dequeue(document,"fx");
            },i*200);
        })
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
		// console.log("---getItemData:--"+YT.JsonToStr(data));
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
		YT.log.info(e);
		if (!el.hasClass(this.itemCls) && !(el = el.bubbleByCls(this.itemCls))) {
			return false;
		}
		var index = el.attr('_index') * 1;
		var pageNo = el.attr('_page') * 1;
		var trueIndex = index + (pageNo - 1) * this.pageSize; // 记录序号
		this.$touchItemData = this.getItemData(pageNo, index);
		if (this.fireEvent('beforeitemtap', this.$touchItemData, trueIndex, el, e, this) !== false) {
			this.tapItem = el;
		}
		if (this.tapItem) {
			var index = this.tapItem.attr('_index') * 1 + (this.tapItem.attr('_page') - 1) * this.pageSize;
			me.fireEvent('itemtap', me.$touchItemData, index, this.tapItem, e, me);
			if (me.itemtap) {
				me.itemtap(me.$touchItemData, index, this.tapItem, e, me);
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
		me.$startPositionY = e.touches[0].pageY;// 起始Y位置
		me.$startPositionX = e.touches[0].pageX;// 起始X位置
		me.$endPositionY = 0;// 移动的Y轴距离
	},
	/**
	 * Item Touch Move时触发
	 * 
	 * @param {}
	 *            e
	 */
	onItemTouchMove : function(e) {
		delete me.pullEventName;
		if (me.ajax.isLoading || me.isStop) {
			return;
		}
		me.$endPositionX = me.$startPositionX - e.touches[0].pageX; // 移动的X轴距离
		var absPostX = Math.abs(me.$endPositionX);
		var absPostY = Math.abs(me.$endPositionY);
		if (absPostX > 5 && absPostY < 5) {
			YT.log.debug('水平滑动');
			return false;
		}
		me.$endPositionY = me.$startPositionY - e.touches[0].pageY; // 移动的Y轴距离
		var scroll = "translateY(" + me.$endPositionY + "px)";
		// 头部
		if (me.pullRefresh !== false && me.$endPositionY < 0) {
			if (!me.refresh) {
				return false;
			}
			if (me.getScrollTop() <= 5) {
				e.preventDefault();
			}
			var p = Math.abs(me.$endPositionY);
			me.pullRefreshArrowEl.removeClass('pullrefresh-release');
			if (p < 130) {
				me.body.css({
					"-webkit-transition-timing-function" : "cubic-bezier(0.1, 0.57, 0.1, 1)",
					"transform" : "translateY(" + Math.abs(me.$endPositionY * 0.5) + "px)",
					"-webkit-transition-duration" : "2000ms"
				});
			}
			if (p * 0.5 > 30) {
				me.pullRefreshEl.show();
			}
			if (p * 0.5 > 60) {
				me.pullRefreshTextEl.html(me.releaseRefreshText);
				me.pullEventName = 'refresh';
			} else {
				me.pullRefreshTextEl.html(me.pullText);
				delete me.pullEventName;
			}
		}
		// 底部
		else if (me.getScrollTop() + me.getWindowHeight() > (me.getScrollHeight() - 150)) {
			if (me.finish) { // 数据加载完成
				return false;
			}
			e.preventDefault();
			var p = Math.abs(me.$endPositionY);
			if (p > 100) {
				me.pullEventName = 'loadmore';
			} else {
				delete me.pullEventName;
			}
			if (p < 150) {
				me.body.css({
					"-webkit-transition-timing-function" : "cubic-bezier(0.1, 0.57, 0.1, 1)",
					"transform" : "translateY(-" + me.$endPositionY * 0.6 + "px)",
					"-webkit-transition-duration" : "2000ms"
				});
			}
		}
	},
	/**
	 * Item Touch End时触发
	 * 
	 * @param {}
	 *            e
	 */
	onItemTouchEnd : function(e) {
		me.body.css({
			"-webkit-transition-timing-function" : "cubic-bezier(0.1, 0.57, 0.1, 1)",
			"transform" : "translateY(0px)",
			"-webkit-transition-duration" : "1200ms"
		});
		me.pullRefreshEl.hide();
		if (me.pullEventName) {

			me.fireEvent(me.pullEventName, me);// /
		}
		delete me.pullEventName;
	}

});