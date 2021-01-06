/**
 * 
 * @FileName: web
 * @Desc: web交互方法定义
 * @author: LQ
 * @date: 2015年8月12日
 * 
 */
/**
 * 名称 方法名
 * 
 * @code 1. 初始化导航栏 initPageTitle
 * @code 2. 开启等待层 openWaitPanel
 * @code 3. 关闭等待层 hideWaitPanel
 * @code 4. 信息提示框 alertinfo
 * @code 5. 信息确认框 confirm
 * @code 6. 会话超时 sessionTimeout
 * @code 7. 获取缓存信息 getSession
 * @code 8. Ajax请求 post
 * @code 9. 弹出菜单 showPopupWindow
 * @code 10.返回首页 gotoIndex
 * @code 11.日期控件 showDatePicker
 * @code 12.金额键盘 showMoneyPicker
 * @code 13.纯数字键盘 showNumPicker
 * @code 14.身份证键盘 showIDCPicker
 * @code 15.交易密码键盘 showTPwdPicker
 * @code 16.登录密码键盘 showLPwdPicker
 * @code 17.全键盘 showAllPicker
 * @code 18.设置缓存信息 setSession
 */
$(function () {
	var TAG = "YT.Web";
	var W = window;
	var _WK_DATAS = {};
	initEvent();
	/** @private 初始化事件 */
	function initEvent() {
		/* 认证框，密码输入框点击事件 */
		$(document).on('click', '#_authBox .sixDigitPassword i', function () {
			// $(this).hide(); $(this).prev().show().focus();
			$(this).parent().prev().focus();
		});
		/* 认证框，纯页面键盘按键监听 */
		$(document).on(
			'keyup',
			'#DRAW_TPWD,#DRAW_CPWD',
			function (e) {
				var _this = $(this).next().find('i');
				curIndex = 0;
				var e = (e) ? e : window.event;
				if (e.keyCode == 8 || (e.keyCode >= 48 && e.keyCode <= 57) ||
					(e.keyCode >= 96 && e.keyCode <= 105)) {
					curIndex = this.value.length - 1;
					l = _this.size();
					for (; l--;) {
						_this.eq(l).find('b').css('visibility', 'visible');
						if (l > curIndex) {
							_this.eq(l).find('b').css('visibility', 'hidden');
						}
					}
					if (this.value.length == 6) {}
				} else {
					this.value = this.value.replace(/\D/g, '');
				}
			});
	}
	/**
	 * @private 标题按钮格式化
	 * 
	 * @param cfg[0]
	 *            是否显示
	 * @param cfg[1]
	 *            标题按钮名称
	 * @param cfg[2]
	 *            标题按钮回调
	 */
	function confTitleButton(cfg) {
		if (cfg && cfg.length == 3) {
			return {
				exist: cfg[0],
				name: cfg[1],
				func: cfg[2]
			};
		}
		return {
			exist: false
		};
	}
	/**
	 * @private 页面标题初始化
	 * 
	 * @param pageId
	 *            页面唯一标识
	 */
	function confPageTitle(pageId) {
		var page = $(pageId);
		var cfg = {
			title: page.attr("title")
		};
		var leftCfg = page.attr("data-btnLeft").split("|");
		cfg.leftButton = confTitleButton(leftCfg);
		var rightCfg = page.attr("data-btnRight").split("|");
		cfg.rightButton = confTitleButton(rightCfg);
		var theme = page.data('theme');
		cfg.theme = theme;
		return cfg;
	}
	/**
	 * @fileOverview 页面交互事件集合
	 * @nameSpace YT.Client(web)
	 */
	YT.Client = {
		/**
		 * @description 判断是否为浏览器进入
		 */
		isWeb: true,
		/**
		 * @description 初始化标题
		 * @param {string}
		 *            pageId 页面唯一标识
		 * @example YT.Client.initPageTitle("pageA");
		 */
		initPageTitle: function (pageId) {
			var conf = confPageTitle(pageId);
			YT.Titlebar.change(conf);
		},
		/**
		 * @description 信息提示框
		 * @param {string}
		 *            msg 信息内容
		 * @param {string}
		 *            title 弹出框标题
		 * @param {func}
		 *            okAct 确认按钮事件
		 * @param {string}
		 *            okName 确认按钮名称
		 * @example YT.Client.alertinfo('我是通知内容','标题',app.okFunc,'确定');
		 */
		alertinfo: function (msg, title, okAct, okName) {
			okAct = YT.getFunctionName(okAct);
			if (okAct && okAct.substr(okAct.length - 1) != ")") {
				okAct = okAct + "()";
			}
			title = title || "温馨提示";
			okName = okName || "确定";
			YT.MsgBox.hideMsgBox();
			YT.MsgBox.alertinfo(msg, title, function () {
				if (okAct) {
					if (okAct.substr(okAct.length - 1) != ")") {
						okAct = okAct + "()";
					}
					eval("(" + okAct + ")");
					YT.MsgBox.hideMsgBox();
				} else {
					YT.MsgBox.hideMsgBox();
				}
			}, okName);
		},
		/**
		 * @description 弹出确认信息框
		 * @param {string}
		 *            msg 信息内容
		 * @param {string}
		 *            title 弹出框标题
		 * @param {string}
		 *            okAct 确认按钮事件
		 * @param {string}
		 *            cancleAct 取消按钮事件
		 * @param {string}
		 *            okName 确认按钮名称
		 * @param {string}
		 *            cancleName 取消按钮的名称
		 * @example YT.Client.confirm("我是通知内容","标题","alert(2)")
		 */
		confirm: function (msg, title, okAct, cancleAct, okName, cancleName) {
			okAct = YT.getFunctionName(okAct);
			if (okAct && okAct.substr(okAct.length - 1) != ")") {
				okAct = okAct + "()";
			}
			cancleAct = YT.getFunctionName(cancleAct);
			if (cancleAct && cancleAct.substr(cancleAct.length - 1) != ")") {
				cancleAct = cancleAct + "()";
			}
			title = title || "温馨提示";
			okName = okName || "确定";
			cancleName = cancleName || "取消";
			YT.MsgBox.hideMsgBox();
			YT.MsgBox.confirm(msg, title, function () {
				YT.MsgBox.hideMsgBox();
				okAct && eval("(" + okAct + ")");
			}, function () {
				if (cancleAct) {
					eval("(" + cancleAct + ")");
					YT.MsgBox.hideMsgBox();
				} else {
					YT.MsgBox.hideMsgBox();
				}
			}, okName, cancleName);
		},
		/**
		 * @description 开启等待层
		 * @param {string}
		 *            msg 显示内容
		 * @example YT.Client.openWaitPanel('正在拼命加载中。。。');
		 */
		openWaitPanel: function (msg) {
			msg = msg || "正在加载中。。。";
			YT.Layer.openWaitPanel(msg);
		},
		/**
		 * @description 关闭等待层
		 * @param {int}
		 *            timeout 隐藏延时时间(毫秒)
		 */
		hideWaitPanel: function (timeout) {
			timeout = timeout ? timeout : 100;
			YT.Layer.hideWaitPanel(timeout);
		},
		/**
		 * @description 显示金额键盘(调用方法不需要在input里面加入)
		 * 
		 * @param {element}
		 *            handle dom对象
		 * @param {json}
		 *            cfg 键盘参数
		 * @example YT.Client.showMoneyPicker($ele,cfg);
		 * 
		 */
		showMoneyPicker: function (handle, cfg) {
			if (handle.attr("data-init") == "true") {
				return;
			}
			handle.attr("data-init", "true").off('click')
				.removeAttr('readonly').focus();
		},
		/**
		 * @description 显示安全键盘
		 * @param {element}
		 *            handle dom对象
		 * @param {json}
		 *            cfg 键盘参数
		 * @example YT.Client.showTPwdPicker($ele,cfg);
		 */
		showTPwdPicker: function (handle, cfg) {
			if (handle.attr("data-init") == "true") {
				return;
			}
			handle.attr("data-init", "true").off('click')
				.removeAttr('readonly').focus();
		},

		/**
		 * @description 显示日期键盘(调用方法不需要在input里面加入)
		 * 
		 * @param {element}
		 *            handle dom对象
		 * @param {json}
		 *            cfg 键盘参数
		 * @example YT.Client.showDatePicker($ele,cfg);
		 */
		showDatePicker: function ($obj) {
			try {
				var cfg = {
					text: $obj.val() || new Date().format("yyyy-MM-dd"),
					format: $obj.attr("data-format") || 'yyyy-MM-dd',
					min: '1900-01-01',
					max: '2099-12-31',
					callback: '_saveDate',
				};
				var min = $obj.attr("data-min");
				var max = $obj.attr("data-max");
				var startId = $obj.attr("data-startId");
				var endId = $obj.attr("data-endId");
				if (startId && $("#" + startId).val()) {
					cfg.min = $("#" + startId).val();
				} else if (min) {
					cfg.min = min;
				}
				if (endId && $("#" + endId).val()) {
					cfg.max = $("#" + endId).val();
				} else if (max) {
					cfg.max = max;
				}
				this._initDateWidget($obj, cfg);
				var wk = {
					ele: $obj
				};
				_WK_DATAS["datePick"] = YT.apply(wk, cfg);
			} catch (e) {
				YT.alertinfo('显示日期键盘', 'showDatePicker=' + e);
			}
		},
		/**
		 * @description 显示纯数字键盘(调用方法不需要在input里面加入)
		 * @param {element}
		 *            handle dom对象
		 * @param {json}
		 *            cfg 键盘参数
		 * @example YT.Client.showNumPicker($ele,cfg);
		 */
		showNumPicker: function (handle, cfg) {
			if (handle.attr("data-init") == "true") {
				return;
			}
			handle.attr("data-init", "true").off('click')
				.removeAttr('readonly').focus();
		},
		/**
		 * @description 显示身份证键盘(调用方法不需要在input里面加入)
		 * @param {element}
		 *            handle dom对象
		 * @param {json}
		 *            cfg 键盘参数
		 * @example YT.Client.showIDCPicker($ele,cfg);
		 */
		showIDCPicker: function (handle, cfg) {
			if (handle.attr("data-init") == "true") {
				return;
			}
			handle.attr("data-init", "true").off('click')
				.removeAttr('readonly').focus();
		},
		/**
		 * @description 显示登录密码安全键盘(调用方法不需要在input里面加入)
		 * @param {element}
		 *            handle dom对象
		 * @param {json}
		 *            cfg 键盘参数
		 * @example YT.Client.showLPwdPicker($ele,cfg);
		 */
		showLPwdPicker: function (handle, cfg) {
			if (handle.attr("data-init") == "true") {
				return;
			}
			handle.attr("data-init", "true").off('click')
				.removeAttr('readonly').focus();
		},
		/**
		 * @description 将页面往上推
		 * @param {element}
		 *            thizz dom对象
		 * @example YT.Client.showKeyBoard($ele);
		 */
		showKeyBoard: function (thizz) {
			YT._preShowKeyBoard(thizz);
		},
		/**
		 * @description 重置客户端用户登录信息<br>
		 *              接口名称：backSession <br>
		 * @param {Object}
		 *            user 登录用户信息
		 * @param {function}
		 *            callback 回调函数
		 * @example YT.resetLoginSession({CUST_NO:'1'},function(rst){// 设置成功后的回调});
		 */
		resetLoginSession: function (user, callback) {
			try {
				sessionStorage.setItem("loginsession", JSON.stringify(user));
				callback && callback(user);
			} catch (e) {
				YT.alertinfo('重置登录用户信息异常', 'resetLoginSession:' + e);
			}
		},
		/**
		 * @description 获取缓存数据
		 * @param {function}
		 *            callback 获取到回调
		 * @param {string}
		 *            sessKey 缓存信息主键
		 * @example YT.Client.getSession('sessKey','App.getSession');
		 *          App.getSession=function(data){ console.log(data); }
		 */
		getSession: function (sessKey, callback) {
			try {
				var info = sessionStorage.getItem(sessKey);
				callback && callback(info);
			} catch (e) {
				YT.alertinfo('获取缓存数据信息异常', 'getSession:' + e);
			}
		},
		/**
		 * @description 设置缓存数据
		 * @param {string}
		 *            sessKey 缓存信息主键
		 * @param {json}
		 *            sessData 会话数据 例如。{'sessKey':{key1:'',key2:''}}
		 * @example YT.Client.setSession('sessKey',{'sessKey':{key1:'',key2:''}});
		 */
		setSession: function (sessKey, sessData) {
			try {
				sessionStorage.setItem(sessKey, sessData);
			} catch (e) {
				YT.alertinfo('设置缓存数据信息异常', 'setSession:' + e);
			}
		},
		/**
		 * @description ajax 请求
		 * 
		 * @param {string}
		 *            url 请求地址
		 * @param {json}
		 *            params 请求参数
		 * @param {string}
		 *            success 成功回调函数名称
		 * @param {string}
		 *            failure 失败回调函数名称
		 */
		post: function (url, params, success, failure) {
			YT.log.debug(params, "req:" + url);
			if (YT.isEmpty(failure) || !YT.isFunction(failure)) {
				failure = function (rsp) {
					YT.hideWaitPanel();
					// YT.alertinfo(rsp.MSG || NS.MSG.MsgAjaxError);
					var msg = NS.MSG.MsgAjaxError;
					if (rsp && !YT.isEmpty(rsp.MSG)) {
						msg = rsp.MSG;
					}
					YT.alertinfo(msg);
				}
			}
			var cfg = {
				url: url,
				params: params,
				success: function (rpdata) {
					YT.log.debug(rpdata, "rsp:" + url);
					if (rpdata.STATUS == '1') {
						success && success(rpdata);
					} else {
						if (rpdata.STATUS == '005') { // 判断用户session是否超时
							YT.hideWaitPanel();
							YT.Client.sessionTimeout();
						} else if (rpdata.STATUS == '006') { // 重复提交
							YT.hideWaitPanel();
							YT.alertinfo('' + rpdata.MSG);
						} else if (rpdata.STATUS != '1') { // 状态码非成功状态
							failure && failure(rpdata);
						}
					}
					YT.Collection.timeUrl(url, rpdata ? (rpdata.STATUS || '120') : '120');
				},
				failure: function (rpdata) {
					failure && failure(rpdata);
					YT.Collection.timeUrl(url, rpdata ? (rpdata.STATUS || '120') : '120');
				}
			}
			if ((DEBUG == 1 || DEBUG == 2) && url.lastIndexOf('.do') < 0) {
				YT.Client.mock(cfg)
			} else {
				YT.AjaxUtil.ajaxData(cfg);
			}
			// DEBUG ? YT.Client.mock(cfg) : YT.AjaxUtil.ajaxData(cfg);
		},
		// 退出登录
		sessionTimeout: function () {

		},
		/**
		 * @private
		 * @description mock挡板数据
		 * @param cfg
		 *            {url,params,success,failure}
		 */
		mock: function (cfg) {
			$.getScript(cfg.url).done(function (data) {
				cfg.success(Mock.mock(YT.JsonEval(data)));
			}).fail(function () {
				YT.hideWaitPanel();
				YT.alertinfo('mock数据不存在')
			})
		},
		/**
		 * @description 返回登录页
		 * @example YT.Client.gotoClientLogin();
		 */
		gotoClientLogin: function (callback, e, params) {
			callback = YT.getFunctionName(callback);
			YT.Client._quickLogin(callback, e, params);
		},
		/**
		 * @description 弹出菜单层
		 */
		showPopupWindow: function (cfg, panel, app) {
			var list = [];
			$.each(cfg, function (i) {
				var map = {};
				var m = cfg[i];
				map.name = m.name;
				var func = m.func;
				func = YT.getFunctionName(func);
				map.func = func;
				list.push(map);
			});
			YT.Popup.initPopupindow(panel, app, {
				'list': list
			});
		},
		/**
		 * @description 显示头部菜单
		 * @param {Object[]}
		 *            cfg 选择项的数组对象,每个元素包含 name ,func
		 * @param {string}
		 *            cfg[].name 显示名称
		 * @param {function}
		 *            cfg[].func 回调函数
		 * @param {element}
		 *            panel 当前显示的页面元素节点
		 * @param {Object}
		 *            app 当前JS对象
		 * @example YT.showPopuMenus([{ name: "修改别名", func:"App.modify()" }, {name: "删除账户", func: "App.updateAlias()" }, { name: "设为默认账户",func:"App.innerTrans()" }],pageA,me);
		 */
		showPopuMenus: function (cfg, panel, app) {
			var list = [];
			$.each(cfg, function (i) {
				var map = {};
				var m = cfg[i];
				map.name = m.name;
				var func = m.func;
				func = YT.getFunctionName(func);
				map.func = func;
				list.push(map);
			});
			YT.Popup.initPopuMenus(panel, app, list);
		},
		/**
		 * @description 客户端native ajaxCashe 缓存请求
		 * 
		 * @param url
		 *            {url} 请求地址
		 * @param version
		 *            {string} 版本
		 * @param type
		 *            {string} 类型
		 * @param params
		 *            {json} 请求参数
		 * @param success
		 *            {string} 成功回调函数名称
		 * @param failure
		 *            {string} 失败回调函数名称
		 * @example YT.Client.getNativeCache('/mbank/login/login.do','1.1','finance',{p1:'x'},'success');
		 */
		getNativeCache: function (url, version, type, cacheType, params,
			success, failure) {
			YT.Client.post(url, params, success, failure)
		},
		/**
		 * @description 页面跳转
		 * 
		 * @param {json}
		 *            cfg 页面跳转参数
		 * @param {string}
		 *            cfg.type 页面类型 N-原生；H-H5页面
		 * @param {string}
		 *            cfg.isLogin 是否登录：Y-需登录;N-不需登录
		 * @param {string}
		 *            cfg.menuId 菜单id：type为“N”时，必需，原生菜单的id
		 * @param {string}
		 *            cfg.url 跳转地址，type为“H”时，必需，H5跳转页面的半地址
		 */
		openMenuPage: function (cfg) {
			YT.nextPage(cfg.url);
		},
		/**
		 * @description 客户端与服务端的时间偏移量
		 */
		timeOffSet: 0,
		isWebClient: true,

		/**
		 * @ignore
		 * @description 打开通讯录
		 * @param {function}
		 *            callback 回调函数
		 */
		openPhoneBook: function (callback) {
			YT.alertinfo('打开通讯录无权限');
		},
		/**
		 * @ignore
		 * @description 发送短信
		 * @param {function}
		 *            func
		 */
		sendSms: function (cfg) {
			YT.alertinfo('发送短信无权限');
		},
		/**
		 * @ignore
		 * @description 打电话
		 * 
		 * @param {function}
		 *            func
		 */
		callPhone: function (cfg) {
			YT.alertinfo('打开通讯录无权限');
		},
		/**
		 * @ignore
		 * @description 返回系统首页(此方法直接使用,客户端会自动监听
		 */
		gotoClientIndex: function () {
			YT.alertinfo("返回系统首页无权限");
		},
		/**
		 * @ignore
		 * @description 返回上一级(此方法直接使用,客户端会自动监听
		 */
		gotoClientBack: function () {
			YT.alertinfo("返回上一级无权限");
		},

		/**
		 * @ignore
		 * @description 二维码生成
		 */
		geneQRC: function (data, callback) {
			YT.alertinfo("二维码生成无权限");
		},
		/**
		 * @ignore
		 * @description 二维码扫一扫
		 */
		sweepQRC: function (callback) {
			YT.alertinfo("二维码扫一扫无权限");
		},
		/**
		 * @ignore
		 * @description 分享页面跳转 修改
		 */
		sharePages: function (datas) {
			YT.alertinfo("分享页面跳转无权限");
		},
		/**
		 * @ignore
		 * @description 分享电子回单
		 */
		shareReceipt: function (cfg) {
			YT.alertinfo("分享电子回单无权限");
		},
		/**
		 * @ignore
		 * @description 调用相册
		 */
		openMobilePhoto: function (callback) {
			YT.alertinfo('调用相册无权限');
		},
		/**
		 * @ignore
		 * @description 调用手机拍照
		 */
		openMobileCamera: function (data, callback) {
			YT.alertinfo('调用手机拍照无权限');
		},
		/**
		 * @ignore
		 * @description 调用手机相册
		 */
		openMobilePhotoAlbum: function (data, callback) {
			YT.alertinfo('调用手机&相册无权限');
		},
		/**
		 * @ignore
		 * @description 获取坐标数据
		 */
		location: function (callback) {
			YT.alertinfo('获取坐标数据无权限');
		},
		/**
		 * @description 检查指纹开启状态<br>
		 * 
		 */
		fingerOpenState: function (conf) {
			YT.showTips('检查指纹开启状态');
			var callback = conf.callback;
			callback && callback({
				STATE: '1'
			});
		},
		/**
		 * @description 设置指纹<br>
		 */
		setFinger: function (conf) {
			var type = conf.type;
			if (type == '0') {
				YT.showTips('关闭指纹');
			} else {
				YT.showTips('开启指纹');
			}
			var callback = conf.callback;
			callback && callback({
				status: '1'
			});
		},
		/**
		 * @description 验证指纹<br>
		 */
		checkFinger: function (conf) {
			YT.showTips('验证指纹');
			var callback = conf.callback;
			callback && callback({
				status: '1'
			});
		},
		/**
		 * @description 设置手势密码<br>
		 */
		setGesture: function (conf) {
			var type = conf.type;
			if (type == '0') {
				YT.showTips('关闭手势密码');
			} else {
				YT.showTips('开启手势密码');
			}
			var callback = conf.callback;
			callback && callback({
				status: '1'
			});
		},
		/**
		 * @description 验证手势密码<br>
		 */
		checkGesture: function (conf) {
			YT.showTips('验证手势密码');
			var callback = conf.callback;
			callback && callback({
				status: '1'
			});
		},

		/**
		 * @ignore
		 * @description 获取客户端信息
		 */
		getClientInfo: function (callback) {
			YT.alertinfo('获取客户端信息无权限');
		},
		/**
		 * @ignore
		 * @description 银行卡扫描Ocr
		 */
		scanBankCardOCR: function (callback, e, params) {
			YT.alertinfo('银行卡扫描Ocr待实现');
		},
		/**
		 * @ignore
		 * @description 身份证正面扫描Ocr
		 */
		scanIDCardFrontOCR: function (callback, e, params) {
			YT.alertinfo('身份证正面扫描Ocr待实现');
		},
		/**
		 * @ignore
		 * @description 身份证背面扫描Ocr
		 */
		scanIDCardBackOCR: function (callback, e, params) {
			YT.alertinfo('身份证背面扫描Ocr待实现');
		},
		/**
		 * @ignore
		 * @description 行驶证正面扫描Ocr
		 */
		scanVehicleLicenceFrontOCR: function (callback, e, params) {
			YT.alertinfo('行驶证正面扫描Ocr待实现');
		},
		/**
		 * @ignore
		 * @description 行驶证背面扫描Ocr
		 */
		scanVehicleLicenceBackOCR: function (callback, e, params) {
			YT.alertinfo('行驶证背面扫描Ocr待实现');
		},
		/**
		 * @ignore
		 * @description 营业执照扫描Ocr
		 */
		scanBusinessLicenceOCR: function (callback, e, params) {
			YT.alertinfo('营业执照扫描Ocr待实现');
		},
		/**
		 * @ignore
		 * @description 人脸识别
		 */
		liveFaceCheck: function (callback, e, params) {
			YT.alertinfo('人脸识别待实现');
		},
		getModuleContent: function (params, callback) {
			var ret = {};
			var url = params.url;
			YT.AjaxUtil.getTemplate(url, function (rst) {
				ret.STATUS = '1';
				ret.DATA = rst;
				callback && callback(ret);
			}, function () {
				ret.STATUS = '0';
				ret.DATA = '加载模板失败!';
				callback && callback(ret);
			});
		},
		nextPageNative: function (params, callback) {
			var ret = {};
			var url = params.url;
			YT.AjaxUtil.getTemplate(url, function (rst) {
				ret.STATUS = '1';
				ret.DATA = rst;
				callback && callback(ret);
			}, function () {
				ret.STATUS = '0';
				ret.DATA = '加载模板失败!';
				callback && callback(ret);
			});
		},
		// 异步设置值
		setStorage(cfg) {
			var key = cfg.key || '__storageItem__'; // 公共key
			var data = cfg.data;
			var callback = cfg.callback;
			YT.Client.setStorageSync(key, data).then(rst => {
				callback && callback(rst)
			})
		},
		// 同步设置值
		setStorageSync(key, data) {
			if (YT.isObject(data) || YT.isArray(data)) { // 数组或对象
				for (let key in data) {
					var item = data[key];
					if (YT.isFunction(item)) {
						var funcName = YT.getFunctionNameCross(item);
						delete data[item];
						data[key] = funcName;
					}
				}
				data = JSON.stringify(data);
			}
			return new Promise((resolve, reject) => {
				if (YT.isEmpty(key) || YT.isEmpty(data)) {
					reject('error')
				}
				sessionStorage.setItem(key, data);
				resolve('success')
			})
		},
		// 异步取值
		getStorage(cfg) {
			var key = cfg.key || '__storageItem__'; // 公共key
			var callback = cfg.callback;
			var clear = cfg.clear || false;

			YT.Client.getStorageSync(key, clear).then(rst => {
				callback && callback(rst)
			})
		},
		// 同步取值
		getStorageSync(key, clear) {
			return new Promise((resolve, reject) => {
				var datas = sessionStorage.getItem(key) || '{}';
				if (clear === true) {
					sessionStorage.removeItem(key)
				}
				try {
					datas = JSON.parse(datas)
				} catch (e) {
					YT.log.error(e)
				}
				resolve(datas)
			})
		}
	};

});