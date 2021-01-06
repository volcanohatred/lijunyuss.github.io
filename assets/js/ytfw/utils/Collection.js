$(function () {
	/***************************************************************************
	 * <code>
	 * 首页功能 indexModule(module)
	 * 功能初始化完成 endInitModule(module)
	 * 功能切换 changeModule(module)
	 * 页面切换 changePage(page,pages)
	 * 请求耗时 timeUrl(url)
	 * 点击事件触发 eventClick(e)
	 * 改变值触发 eventChange(e)
	 * 设置时间点 changeTimeX();
	 * </code>
	 **************************************************************************/
	var TAG = "YT.Collection";
	var mainBody, pages;
	var curModule, curPage, timeX, curPath;
	var isMove = false;
	var cData = {
		en: '',// 事件编号
		ct: '',// 操作时间
		mt: '',// 消息类型,1：登录、2：操作、3：启动、4：退出登录、5：崩溃、6：自动埋点、7：页面请求、8：产品操作
		pp: '',// 当前页面地址
		st: '',// 上一个页面停留时间
		ce: ''// 扩展属性
	}

	/**
	 * 	stt : 'START_TIME',//启动时间
	 * 	bc : 'BANK_CODE',//银行编号
	 * 	ci : 'CHANNEL_ID',//渠道ID
	 * 	si : 'START_ID',//启动ID
	 * 	cn : 'CARRIER_NAME',//运营商
	 * 	nw : 'NETWORK',//网络类型
	 * 	nwn : 'NETWORK_NAME',//网络名称
	 * 	clt : 'CLI_TYPE',//设备类型
	 * 	dn: 'DEVICE_NO',//设备表示
	 * 	dm: 'DEVICE_MODEL',//设备型号
	 * 	sv: 'SYSTEM_VERSION',//设备系统版本
	 * 	bv: 'BUNDLE_VERSION',//设备系统版本
	 * 	rn: 'RESOLUTION',//设备分辨率
	 * 	ia: 'IP_ADDR',//客户端ip
	 * 	ij: 'IS_JAILBREAK',//是否越狱
	 * 	ind: 'IS_NEW_DEVICE',//是否安装新设备
	 * 	gps: 'GPS',//GPS
	 * 	ad: 'ADDRESS',//当前位置街道
	 * 	en : 'EVENT_NO',//事件编号
	 *	cct : 'COLLECT_TYPE',//采集类型
	 *	pid : 'PAGE_ID',//页面编号
	 *	ldt : 'LOAD_TIME',//页面加载时间
	 *	mid : 'MODULE_ID',//功能ID
	 *	epd : 'ENTRANCE_PAGEID',//入口页地址
	 *	eid : 'EVENT_ID',//事件id
	 *	crt : 'CURRENT_TIME',//操作时间
	 *	mt : 'MSG_TYPE',//消息类型,1：登录、2：操作、3：启动、4：退出登录、5：崩溃、6：自动埋点、7：页面请求、8：产品操作
	 *	fp : 'FORM_PATH',//上一个页面地址(fromPage)
	 *	pp : 'PAGE_PATH',//当前页面地址
	 *	pt : 'PAGE_TITLE',//当前页面标题
	 *	drt : 'DURING_TIME',//上一个页面停留时间
	 *	url : 'URL',//请求地址
	 *	bv : 'BEFORE_VAL',//修改前的值
	 *	cv : 'CURRENT_VAL',//修改后的值
	 *	ce : 'COLLECT_EXT'//扩展属性
	 */
	YT.log.debug("init", TAG);
	/**
	 * <code> 
		mid	功能ID
		pid	页面id
		eid	事件id
	 	ldt	加载耗时
		drt	停留时长
		sf	页面分享标志
		epd	入口页地址
		ct	操作时间	yyyyMMddHHmmss
		st	操作时间  long 
	 * </code>
	 */
	var me = YT.Collection = {
		// 1.初始化首页面信息 2.绑定埋点标记
		init: function () {
			mainBody = $('#mainBody');
			pages = mainBody.find('.pages.ui-navbar-through');
			me.initEvent();
			me.setPageDatas();
		},
		// 绑定埋点标记
		initEvent: function () {
			var panels = $('body');
			// 识别按钮事件 click事件，在页面非空验证时会被return false阻断掉
			// 识别录入项
			panels.on('touchstart', '[data-event]', me.btnTouchStart);
			panels.on('touchmove', '[data-event]', me.btnTouchMove);
			panels.on('touchend', '[data-event]', me.btnTouchEnd);
			panels.on("touchstart", "[data-name]", function () {
				var item = $(this);
				YT.log.debug("--click---" + item.data("name"));
			});
			// 监控输入框是否变化
			panels.on('focus', 'input,textarea', function () {
				var thizz = $(this);
				thizz.attr('data-curCollVal', thizz.val());
			});
			panels.on('blur', 'input,textarea', function () {
				var thizz = $(this);
				var curVal = thizz.attr('data-curCollVal');
				var val = thizz.val();
				if (curVal !== val) {
					me.monitorData(thizz);
				}
			});
		},// 设置当前页面停留信息
		setPageDatas: function (time) {
			var curPage = pages.find('.page-view.page-on-center');
			curPath = curPage.attr('data-page');
			var titleName = me.getTitleName();
			var pageId = curPage.find(">div").attr('id');
			var datas = {
				PAGE_PATH: curPath,
				PAGE_ID: pageId,
				PAGE_NAME: titleName,
				PAGE_TIME: time
			}
			// YT.log.info(YT.JsonToStr(datas));
			sessionStorage.setItem('PREV_COLLECTION', YT.JsonToStr(datas));
		},
		// 获取上一个页面停留信息
		getPageDatas: function () {
			var collect = sessionStorage.getItem('PREV_COLLECTION');
			if (!YT.isEmpty(collect)) {
				sessionStorage.removeItem('PREV_COLLECTION');
				return YT.JsonEval(collect);
			} else {
				return null;
			}
		},
		monitorData: function (item) {
			var eventNo = item.data('name');
			var mt = '2';
			var option = {
				mt: mt,
				cv: item.val(),
				bv: item.attr('data-curCollVal')
			}
			me.setColl(option, eventNo);
		},
		btnTouchStart: function (e) {
			var el = e.originalEvent;
			startPosX = el.touches[0].pageX;
			startPosY = el.touches[0].pageY;
		},
		btnTouchMove: function (e) {
			var el = e.originalEvent;
			var x = el.touches[0].pageX;
			var y = el.touches[0].pageY;
			if (Math.abs(x - startPosX) > 10 || Math.abs(y - startPosY) > 10) {
				isMove = true;
			}
		},
		btnTouchEnd: function (e) {
			if (!isMove) {
				var item = $(e.currentTarget);
				var eventNo = item.data("event");
				var ext = '';
				var ce = item.attr('data-collectExt');
				var mt = item.attr('data-collectType');
				mt = mt ? mt : '2';
				if (!YT.isEmpty(ce)) {
					ext = ce;
				}
				var option = {
					mt: mt,
					ce: ext
				}
				me.setColl(option, eventNo);
			}
			isMove = false;
		},
		//发送操作请求
		setColl: function (option, eventNo) {
			var curView = pages.find('.page-view.page-on-center');
			var curPage = curView.find('.page.current');
			var pageFlag = curPage.attr('data-page') || curPage.attr('class') || '';
			
			var collect = YT.apply({}, cData);
			YT.apply(collect, option);
			var title = me.getTitleName();
			var moduleNo = curPath.substring(curPath.lastIndexOf("/") + 1, curPath.indexOf(".html"));
			var date = new Date();
			var timeFormat = date.format('yyyyMMddhhmmss');
			var m = curPath.substring(curPath.indexOf('/') + 1);
			m = m.substring(0, m.indexOf('/'));
			collect.en = "B001.C001.M" + m + "." + moduleNo + ".E" + eventNo;; //事件编号
			var mid = curModule.mid;
			collect.mid = mid + '_PAGE_'+pageFlag;
			collect.pt = title; // 页面名称
			collect.pid = moduleNo; // 页面编号
			collect.crt = timeFormat;
			collect.pp = curPath;
			collect.st = '';
			YT.Client.setCollection(collect);
		},
		/**
		 * 更新临时时间点
		 */
		changeTimeX: function () {
			timeX = new Date().getTime();
		},
		/**
		 * 初始化首个功能
		 */
		indexModule: function (url) {
			var curDate = new Date();
//			var mid = url.substring(url.lastIndexOf("/") + 1, url.indexOf(".html"));
			var mid = url.split('/', 2).join('_');
			var cm = curModule = {};
			cm.mid = mid; // 功能 ID
			cm.mt = "2";// 访问
			cm.st = curDate.getTime();// 初始化时间
			cm.crt = curDate.format("yyyyMMddhhmmss");// 操作时间
			cm.ldt = 0;// 加载耗时
			cm.drt = 0;// 停留耗时
		},
		/**
		 * 加载下个功能或返回上一功能
		 */
		changeModule: function (url) {
			var curDate = new Date();
			var curPage = pages.find('.page-view.page-on-center');
			curPath = curPage.attr('data-page');
			// 1、当前页停留时长；
			if (curPage) {
				var cp = curPage;
				cp.drt = (curDate.getTime() - cp.st);// 功能停留时长
				// 2、发送页采集日志
				cp.pid && YT.Client.setCollection(cp);
				curPage = null;// 清理页信息
			}
			// 3、标记当前功能停留时长,
			var cm = curModule || {};
			cm.drt = (curDate.getTime() - cm.st);// 功能停留时长
			cm.pp = curPath;
			var data = me.getPageDatas(); //获取上一页面信息
			var prevHome = $('#'+data.PAGE_ID);
			var prevPage = prevHome.find('.page.current');

			cm.fp = data.PAGE_PATH;
			//var moduleNo = curPath.substring(curPath.lastIndexOf("/") + 1, curPath.indexOf(".html"));
			cm.pid = data.PAGE_ID;
			var mid = curModule.mid;
			var pageFlag = prevPage.attr('data-page') || prevPage.attr('class') || '';
			cm.mid = mid + '_PAGE_'+pageFlag;
			// 4、发送功能采集日志
			YT.Client.setCollection(cm);
			// 5、标记新功能初始时间
			url && me.indexModule(url);
			me.setPageDatas(); //设置当前页面信息
		},
		/**
		 * 功能初始化完成 YT.initPageEvent;
		 */
		endInitModule: function () {
			me.changeTimeX();// 时点标记
			var cm = curModule;
			cm.ldt = (timeX - cm.st);// 初始化耗时=当前时点-起始时点
		},
		/**
		 * 请求耗时
		 */
		timeUrl: function (url, rtnCode) {
			var curDate = new Date();
			var curPage = pages.find('.page-view.page-on-center');
			curPath = curPage.attr('data-page');
			var moduleNo = curPath.substring(curPath.lastIndexOf("/") + 1, curPath.indexOf(".html"));
			var cp = {};
			cp.mid = curModule.mid;
			cp.pid = moduleNo;
			cp.url = url;// 请求地址
			cp.rc = rtnCode;
			cp.mt = "7";// 页面请求
			cp.st = timeX;// 初始化时间
			cp.ct = curDate.format("yyyyMMddhhmmss");// 操作时间
			cp.ldt = (curDate.getTime() - timeX);// 加载耗时
			// 发送页采集日志
			YT.Client.setCollection(cp);
		},
		/**
		 * 获取页面标题
		 */
		getTitleName: function () {
			var curPage = pages.find('.page-view.page-on-center');
			curPath = curPage.attr('data-page');
			var title = curPage.find('title');
			var titleName = '';
			if (title.length == 1) {
				titleName = title.text();
				if (YT.isEmpty(titleName)) {
					var page = curPage.find('div.page.current');
					titleName = page.attr('title');
				}
			} else {
				var page = curPage.find('div.page.current');
				titleName = page.attr('title');
			}
			return titleName;
		}
	}
	YT.log.debug("init-end--");
	me.init();
});
