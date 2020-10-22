(function() {
	var PAGE_HISTORY_TEM = [];
	var PAGE_HISTORY = [];
	var PAGE_HISTORY_NOHASH = [];
	var HISTORY_LEN = 3; // 历史页面保存个数
	var PAGE_INDEX = "";
	var CURRENT_URL = ""; // 当前页面路径
	var body = $('#mainBody'); // 顶层面板
	var _pages = $(".navbar-pages"); // 顶层可切换页面
	var overlay = $('.ui-view-overlay'); // 蒙版层
	var left = $('.ui-view-left'); // 左侧滑页
	var right = $('.ui-view-right'); // 右侧滑页
	var loadingPage;
	var isMore = false;
	var titleChange = true; // 标题是否更改
	var cache = false; // 页面缓存修改
	var activeChange = false;
	var hashChange = false;
	var viewHeight = 0;
	var touchBack = false; // ios 滑动返回
	var me = YT.NavUtil = {
		idSeed : 10000,
		getId : function() {
			return 'yt_pid_' + (++me.idSeed);
		},
		init : function() {
			me.initEvent();
		},
		initEvent : function() {
			overlay && overlay.on('click', me.closeBtnMenu);
			$(window).off('hashchange'); // window
											// 为全局对象，重复执行时会多次加载，需先清理再定义事件；
			$(window).bind('hashchange', function() {
				var hash = location.hash;
				if (activeChange === false) {
					var path = hash.replace(/^#/, '')
					var active = '1' // 0返回， 1前进
					$.each(PAGE_HISTORY, function(i, p) {
						if (path == p.url) {
							active = '0'
						}
					})
					hashChange = true
					if (active == '0') {
						touchBack = Device.os == 'iphone' ? true : false;
						me.prevPage()
					} else {
						me.nextPage(path)
					}
				} else {
					activeChange = false
				}
			});
		},
		/**
		 * 加载首页
		 */
		loadIndexPage : function(url, func) {
			if (W_HEIGHT < 650) {
				viewHeight = 650;
			} else {
				viewHeight = W_HEIGHT;
			}
			loadingPage = $('#loaddingPage');
			var indexPage = $('<div data-page="index" class="page-view page-transform page-on-center"></div>');
			_pages.append(indexPage);
			PAGE_INDEX = url;
			YT.Collection.indexModule(url);
			this.loadPage(url, function(html) {
				indexPage.html(html);
				indexPage.attr('data-page', url);
				var hash = location.hash;
				if (YT.isEmpty(hash)) {
					activeChange = true;
				}
				// location.hash = url;
				try{
					var tmpUrl = window.location.href.toString().replace(window.location.hash, '');
					tmpUrl = tmpUrl.replace(/#$/, '')
					window.location.replace(tmpUrl + '#' + url)
				}catch(e){}
				func && func();
			}, function() {
				func && func();
			});
		},
		/**
		 * 返回首页
		 */
		gotoIndex : function() {
			YT.log.info('返回首页');
			var history = _pages.find('.page-view:not(.page-on-center)');
			history.remove(); // PAGE_HISTORY
			var map = {
				pid : me.getId(),
				url : PAGE_INDEX
			}
			PAGE_HISTORY = [];
			PAGE_HISTORY_TEM = [];
			PAGE_HISTORY.push(map);
			me.prevPage();
		},
		/**
		 * 调转到下一页
		 * 
		 * @param url
		 * @returns {Boolean}
		 */
		nextPage : function(url, record) {
			if (cache) {// 防止缓存页面不能加载出来
				isMore = false;
			}
			if (isMore) {
				return false;
			}
			me.closeBtnMenu();
			isMore = true;
			// var thisUrl = document.location.href; //当前页面地址
			// YT.log.info('当前页面:'+CURRENT_URL+' ，跳转页面:'+url);
			if (CURRENT_URL == url) {
				isMore = false;
				return false;
			}
			YT.AuthBox && YT.AuthBox.hideAuthPanel();
			me.removeHistoryPage(url); // 防止页面重复
			YT.openWaitPanel();
			titleChange = false;
			this.loadPage(url, function(html) { // 加载新的页面
				var top = $(window).scrollTop();
				cache = true; // 新增添加缓存
				CURRENT_URL = url;
				loadingPage.show();
				if (PAGE_HISTORY_TEM.length >= HISTORY_LEN) {
					YT.log.info('超过历史页面保存长度');
					var history = PAGE_HISTORY_TEM.shift();
					var pid = history.pid;
					_pages.find('[data-pid=' + pid + ']').remove();
					_pages.find('.not-record').remove();
				}
				scroll(0, 0);
				$('body,html').css({
					'height' : viewHeight + 'px'
				});
				var current = _pages.find(".page-on-center"); // 当前页面
				body.addClass("page-transform");
				current.addClass('page-transform'); // 添加切换效果
				var prevPage = _pages.find('.page-on-left'); // 上一个页面
				prevPage.removeClass('page-on-left').addClass('page-on-history'); // 将上一页面改变成历史页面
				var id = me.getId();
				var thisUrl = current.attr('data-page'); // 当前页面地址
				current.attr("data-pid", id);
				current.addClass("page-on-left page-center-to-left").removeClass("page-on-center"); // 将当前页面变成上一页面
				var loaded = $("<div data-page='" + url + "' class='page-view page-transform page-on-center'></div>");
				_pages.append(loaded); // 生成新页面
				loaded.html(html).addClass("page-right-to-center");
				/* ########保存当前页面到历史中---begin---######## */
				var map = {
					pid : id,
					url : thisUrl,
					top : top
				}
				if (!record === true) {
					PAGE_HISTORY_TEM.push(map); // 保存当前页面地址到历史中
					PAGE_HISTORY.push(map);
					if (hashChange == false) {
						activeChange = true;
					}
					location.hash = url;
				}else{
					PAGE_HISTORY_NOHASH.push(map)
					var tmpUrl = window.location.href.toString().replace(window.location.hash, '');
					tmpUrl = tmpUrl.replace(/#$/, '')
					if (hashChange == false) {
						activeChange = true;
					}
					loaded.addClass('not-record')
					_pages.find('[data-pid=' + id + ']').remove();
					window.location.replace(tmpUrl + '#' + url)
				}
				
				/* ########保存当前页面到历史中---end---######## */
				setTimeout(function() {
					current.removeClass("page-center-to-left");
					loaded.removeClass("page-right-to-center");
					loaded.removeClass("page-transform");
					body.removeClass("page-transform");
					$('body,html').css({
						'height' : 'auto',
						'overflow' : 'auto'
					});
					isMore = false;
					cache = false;
				}, 400);
				YT.hideWaitPanel();
				YT.Collection.changeModule(url);
				loadingPage.hide();
			}, function(e) { // 加载页面失败
				YT.hideWaitPanel();
				YT.alertinfo('请求页面不存在！');
				loadingPage.hide();
				isMore = false;
				titleChange = true;
			});
		},
		/**
		 * 返回上一页面(历史页面)
		 * 
		 * @returns {Boolean}
		 */
		prevPage : function(refresh) {
			YT.AuthBoxLj && YT.AuthBoxLj.hideAuthPanel()
			if (isMore || !titleChange) {
				return false;
			}
			me.closeBtnMenu();
			isMore = true;
			if (PAGE_HISTORY.length == 0) {
				isMore = false;
				YT.gotoClientBack();
				return;
			}
			if (YT.isEmpty(refresh) || refresh !== true) {
				refresh = false;
			}
			YT.AuthBox && YT.AuthBox.hideAuthPanel();
			var history = PAGE_HISTORY.pop();
			PAGE_HISTORY_TEM.pop();
			var pid = history.pid;
			var url = history.url;
			CURRENT_URL = url;
			var hisPage = _pages.find('[data-pid=' + pid + ']');
			if (hisPage.length > 0) { // 存在历史页面
				YT.log.info('存在历史页面');
				$('body,html').css({
					'height' : viewHeight + 'px'
				});
//				var left = _pages.find(".page-on-left");
				var left = hisPage;
//				left.nextAll().remove()
				var center = _pages.find(".page-on-center");

				if (touchBack === true) {
					touchBack = false;
					left.addClass("page-on-center").removeClass("page-on-left page-on-history");
					center.removeClass("page-on-center");
					_pages.find('.page-on-history:last').addClass('page-on-left').removeClass('page-on-history');
				} else {
					body.addClass("page-transform");
					center.addClass('page-transform');
					left.addClass("page-left-to-center page-on-center").removeClass("page-on-left page-on-history");
					center.addClass("page-center-to-right").removeClass("page-on-center");
					_pages.find('.page-on-history:last').addClass('page-on-left').removeClass('page-on-history');
				}
				scroll(0, 0);
				setTimeout(function() {
					left.removeClass("page-left-to-center");
					left.removeClass('page-transform');
					body.removeClass("page-transform");
					$('body,html').css({
						'height' : 'auto'
					});
					center.remove();
					isMore = false;
					if (refresh === true) {
						me.refreshPage();
					}
				}, 400);
				YT.hideWaitPanel();
				me.reloadPageTitle();
				YT.Collection.changeModule(url);
				if (hashChange == true) {
					hashChange = false
				} else {
					activeChange = true;
					window.history.go(-1)
				}
				return false;
			}
			YT.log.info('历史页面中不存在----重新加载历史页面');
			YT.openWaitPanel();
			this.loadPage(url, function(html) {
				YT.hideWaitPanel();
				loadingPage.show();
				var left = $("<div data-page='" + url + "' class='page-view page-transform page-on-left'></div>");
				_pages.prepend(left);
				$('body,html').css({
					'height' : viewHeight + 'px'
				});
				var center = _pages.find(".page-on-center");
				center.addClass('page-transform');
				body.addClass("page-transform");
				left.addClass("page-left-to-center page-on-center").removeClass("page-on-left");
				center.addClass("page-center-to-right").removeClass("page-on-center");
				left.html(html);
				scroll(0, 0);
				// location.hash = url;
				if (hashChange == true) {
					hashChange = false
				} else {
					activeChange = true;
					window.history.go(-1)
				}
				setTimeout(function() {
					left.removeClass("page-left-to-center");
					left.removeClass('page-transform');
					body.removeClass("page-transform");
					$('body,html').css({
						'height' : 'auto'
					});
					center.remove();
					isMore = false;
					YT.Collection.changeModule(url);
				}, 400);
			}, function() {
				isMore = false;
			});
		},
		/**
		 * 重新载入当前页面
		 */
		refreshPage : function() {
			var url = me.getCurrentUrl();
			if (YT.isEmpty(url)) { // 如果地址为空，调用客户端返回
				YT.gotoClientBack(); //
				return false;
			}
			YT.Collection.changeModule(url);
			var currPage = _pages.find('.page-on-center');
			YT.openWaitPanel();
			me.loadPage(url, function(html) {
				YT.hideWaitPanel();
				currPage.html(html);
				YT.Collection.endInitModule();
			});
		},
		getCurrentUrl : function() {
			var url = YT.isEmpty(CURRENT_URL) ? PAGE_INDEX : CURRENT_URL;
			return url;
		},
		/**
		 * 删除历史中存在的页面
		 */
		removeHistoryPage : function(url) {
			var h = [];
			var ht = [];
			$.each(PAGE_HISTORY, function(i, n) {
				var path = n.url;
				var pid = n.pid;
				if (url != path && path.indexOf(url) < 0) {
					h.push(n)
				} else {
					_pages.find('[data-pid=' + pid + ']').remove();
				}
			});
			$.each(PAGE_HISTORY_NOHASH, function(i, n) {
				var path = n.url;
				var pid = n.pid;
				if (url == path && path.indexOf(url) > 0) {
					_pages.find('[data-pid=' + pid + ']').remove();
				}
			});
			$.each(PAGE_HISTORY_TEM, function(i, n) {
				var path = n.url;
				if (url != path && path.indexOf(url) < 0) {
					ht.push(n)
				}
			});
			PAGE_HISTORY = h;
			PAGE_HISTORY_TEM = ht;
		},
		/**
		 * 左侧菜单
		 */
		openLeftMenu : function() {
			me.closeRightBtnMenu();
			overlay && overlay.show();
			left && left.show();
			setTimeout(function() {
				left.addClass('active');
			}, 100);
		},
		/**
		 * 右侧菜单
		 */
		openRightMenu : function() {
			me.closeLeftBtnMenu();
			overlay && overlay.show();
			right && right.show();
			body && body.addClass('ui-right-reveal');
			if (me.timeRight) {
				clearTimeout(me.timeRight);
			}
			// animation: all .5s;
			me.timeRight = setTimeout(function() {
				right.addClass('active');
			}, 10);
		},
		/**
		 * 关闭两侧菜单
		 */
		closeBtnMenu : function() {
			me.closeLeftBtnMenu();
			me.closeRightBtnMenu();
		},
		/**
		 * 关闭左侧菜单
		 */
		closeLeftBtnMenu : function() {
			// var overlay = $('.ui-view-overlay');
			overlay && overlay.hide();
			// var left = $('.ui-view-left');
			body && body.removeClass('ui-right-reveal');
			left.addClass('close-view-left');
			if (me.timeLeftClose) {
				clearTimeout(me.timeLeftClose);
			}
			me.timeLeftClose = setTimeout(function() {
				left.removeClass('active close-view-left').hide();
			}, 400);
		},
		/**
		 * 关闭右侧菜单
		 */
		closeRightBtnMenu : function() {
			overlay && overlay.hide();
			right && right.removeClass('active');
			body && body.removeClass('ui-right-reveal');
			if (me.timeRightClose) {
				clearTimeout(me.timeRightClose);
			}
			me.timeRightClose = setTimeout(function() {
				right.hide();
			}, 400);
		},
		/**
		 * 重新加载页面菜单
		 */
		reloadPageTitle : function() {
			var page = _pages.find(".page-on-center"); // 当前页面
			var current = page.find('.page.current');
			YT.initPageTitle(current);
		},
		/**
		 * @Desc 显示页面区域
		 * @Desc 控制业务流程，换面切换
		 * @param showHandle
		 *            要展示的页面区域
		 * @param hideHandles
		 *            要隐藏的页面区域
		 * @param showTitle
		 *            是否显示title
		 * @example YT.showPageArea(App.pageA, [App.pageB,App.pageC], true);
		 * @example YT.showPageArea(App.pageA, [pages], true);
		 */
		showPageArea : function(showHandle, hideHandles, showTitle) {
			loadingPage.hide();
			if (hideHandles) {
				var top = $(window).scrollTop();
				YT.each(hideHandles, function(item) {
					// 防止传入[pages]，若此还需遍历
					if (item.length > 1) {
						$.each(item, function(i, v) {
							me.doEach($(v), top);
						})
					} else {
						me.doEach(item, top);
					}
				});
			}
			showHandle.addClass("current");
			var top = showHandle.attr('data-pageTop');
			top = top || 0;
			$('html, body').animate({
				scrollTop : top
			}, 0);
			if (showTitle === true) {
				YT.initPageTitle(showHandle);
			}
			titleChange = true;
		},
		doEach : function(item, top) {
			var areas = item.find('input,textarea');
			areas.each(function(i, n) {
				if ($(n).is(':focus')) {
					$(n).blur();
				}
			});
			if (item.hasClass('current') === true) {
				item.attr('data-pageTop', top);
			}
			item.removeClass("current");
		},
		loadPage : function(url, success, error) {
			YT.getPage(url, {}, function(tpl_html) {
				success && success(tpl_html);
			}, function(tpl_html) {
				error && error();
			})
		}
	}
	me.init();
})();