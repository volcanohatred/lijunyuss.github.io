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
$(function() {
	var TAG = "YT.Web";
	var W = window;
	var _WK_DATAS = {};
	initEvent();
	/** @private 初始化事件 */
	function initEvent() {
		/* 认证框，密码输入框点击事件 */
		$(document).on('click', '#_authBox .sixDigitPassword i', function() {
			// $(this).hide(); $(this).prev().show().focus();
			$(this).parent().prev().focus();
		});
		/* 认证框，纯页面键盘按键监听 */
		$(document).on(
				'keyup',
				'#DRAW_TPWD,#DRAW_CPWD',
				function(e) {
					var _this = $(this).next().find('i');
					curIndex = 0;
					var e = (e) ? e : window.event;
					if (e.keyCode == 8 || (e.keyCode >= 48 && e.keyCode <= 57)
							|| (e.keyCode >= 96 && e.keyCode <= 105)) {
						curIndex = this.value.length - 1;
						l = _this.size();
						for (; l--;) {
							_this.eq(l).find('b').css('visibility','visible');
							if (l > curIndex) {
								_this.eq(l).find('b').css('visibility','hidden');
							}
						}
						if (this.value.length == 6) {
						}
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
				exist : cfg[0],
				name : cfg[1],
				func : cfg[2]
			};
		}
		return {
			exist : false
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
			title : page.attr("title")
		};
		var leftCfg = page.attr("data-btnLeft").split("|");
		cfg.leftButton = confTitleButton(leftCfg);
		var rightCfg = page.attr("data-btnRight").split("|");
		cfg.rightButton = confTitleButton(rightCfg);
		
		var bottomCfg = page.attr("data-menuBottom");
		if(bottomCfg == "true"){
			showMenuButtom();
		}else{
			hideMenuButtom();
		}
		var theme = page.data('theme');
		cfg.theme = theme;
		return cfg;
	}
	
	function showMenuButtom(){
		var footer_tpl = 
			'<div class="ui-tab ui-footer-wrapper">'+
				'<div class="ui-grid-icon ">'+
					'<ul>'+
						'<li class="jrcs">'+
							'<div class="ui-img-icon-footer">'+
								'<span class="ui-img-icon-one"></span>'+
							'</div>'+
							'<h5>金融超市</h5>'+
						'</li>'+
						'<li class="dk">'+
							'<div class="ui-img-icon-footer">'+
								'<span class="ui-img-icon-two"></span>'+
							'</div>'+
							'<h5>贷款</h5>'+
						'</li>'+
						'<li class="xyk">'+
							'<div class="ui-img-icon-footer">'+
								'<span class="ui-img-icon-three"></span>'+
							'</div>'+
							'<h5>信用卡</h5>'+
						'</li>'+
						'<li class="wd">'+
							'<div class="ui-img-icon-footer">'+
								'<span class="ui-img-icon-four"></span>'+
							'</div>'+
							'<h5>我的</h5>'+
						'</li>'+
					'</ul>'+
				'</div>'+
			'</div>'
		var mainBody = $('#mainBody');
		mainBody.css("padding-bottom","45px");
		mainBody.append(footer_tpl);
		$(".ui-footer-wrapper").on('click','.jrcs',function(){	
			if(!$(".jrcs h5").hasClass("active")){
				YT.nextPage("page/P01/P0101/P0101.html");
			}else{
				return;
			}
		});
		$(".ui-footer-wrapper").on('click','.dk',function(){
			if(!$(".dk h5").hasClass("active")){
				YT.nextPage("page/P01/P0102/P0102.html");
			}else{
				return;
			}
		});
		$(".ui-footer-wrapper").on('click','.xyk',function(){
			if(!$(".xyk h5").hasClass("active")){
				YT.nextPage("page/P01/P0103/P0103.html");	
			}else{
				return;
			}
		});
		$(".ui-footer-wrapper").on('click','.wd',function(){	
			if(!$(".wd h5").hasClass("active")){
				YT.nextPage("page/P01/P0104/P0104.html");
			}else{
				return;
			}
		});
	}
	
	function hideMenuButtom (){
		var mainBody = $('#mainBody');
		mainBody.css("padding-bottom","0px");
		mainBody.find('.ui-footer-wrapper').remove();
	}
	/**
	 * @fileOverview 页面交互事件集合
	 * @nameSpace YT.Client(web)
	 */
	YT.Client = {
		/**
		 * @description 判断是否为浏览器进入
		 */
		isWeb : true,
		/**
		 * @description 初始化标题
		 * @param {string}
		 *            pageId 页面唯一标识
		 * @example YT.Client.initPageTitle("pageA");
		 */
		initPageTitle : function(pageId) {
			document.getElementsByTagName("title")[0].innerText =$(pageId).attr("title");
			var conf = confPageTitle(pageId);
			YT.Titlebar.change(conf);
		},
		/**
		 * @description 搜索框标题
		 * @param {json}
		 *            cfg 标题初始化参数
		 * @example YT.Client.titleSearchBar(cfg);
		 */
		titleSearchBar : function(cfg) {
			YT.Titlebar.changeTitle(cfg);
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
		alertinfo : function(msg, title, okAct, okName) {
			okAct = YT.getFunctionName(okAct);
			if (okAct && okAct.substr(okAct.length - 1) != ")") {
				okAct = okAct + "()";
			}
			title = title || "温馨提示";
			okName = okName || "确定";
			YT.MsgBox.hideMsgBox();
			YT.MsgBox.alertinfo(msg, title, function() {
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
		confirm : function(msg, title, okAct, cancleAct, okName, cancleName) {
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
			YT.MsgBox.confirm(msg, title, function() {
				YT.MsgBox.hideMsgBox();
				okAct && eval("(" + okAct + ")");
			}, function() {
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
		openWaitPanel : function(msg) {
			msg = msg || "正在加载中。。。";
			YT.Layer.openWaitPanel(msg);
		},
		/**
		 * @description 关闭等待层
		 * @param {int}
		 *            timeout 隐藏延时时间(毫秒)
		 */
		hideWaitPanel : function(timeout) {
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
		showMoneyPicker : function(handle, cfg) {
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
		showTPwdPicker : function(handle, cfg) {
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
		showDatePicker : function($obj) {
			try {
				var cfg = {
					text : $obj.val() || new Date().format("yyyy-MM-dd"),
					format : $obj.attr("data-format") || 'yyyy-MM-dd',
					min : '1900-01-01',
					max : '2099-12-31',
					callback : '_saveDate',
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
					ele : $obj
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
		showNumPicker : function(handle, cfg) {
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
		showIDCPicker : function(handle, cfg) {
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
		showLPwdPicker : function(handle, cfg) {
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
		showKeyBoard : function(thizz) {
			YT._preShowKeyBoard(thizz);
		},
		/**
		 * @description 重置客户端用户登录信息
		 * @param {json}
		 *            user 登录用户信息
		 * @param {function}
		 *            callback 回调函数
		 * @example YT.Client.resetLoginSession({'USER_ID':'11'},callback);
		 */
		resetLoginSession : function(user, callback) {
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
		getSession : function(sessKey, callback) {
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
		setSession : function(sessKey, sessData) {
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
		post : function(url, params, success, failure) {
			YT.log.debug(params,"req:"+url);
			if (YT.isEmpty(failure) || !YT.isFunction(failure)) {
				failure = function(rsp) {
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
				url : url,
				params : params,
				success : function(rpdata) {
					YT.log.debug(rpdata,"rsp:"+url);
					if(rpdata.STATUS == '1'){
						success && success(rpdata);
					}else{
						if (rpdata.STATUS == '005') {// 判断用户session是否超时
							YT.hideWaitPanel();
							YT.sessionTimeout();
						} else if (rpdata.STATUS == '006') { // 重复提交
							YT.hideWaitPanel();
							YT.alertinfo('' + rpdata.MSG);
						} else if (rpdata.STATUS != '1') { // 状态码非成功状态
							failure && failure(rpdata);
						}
					}
					YT.Collection.timeUrl(url, rpdata ? (rpdata.STATUS || '120') : '120');
				},
				failure : function(rpdata) {
					failure && failure(rpdata);
					YT.Collection.timeUrl(url, rpdata ? (rpdata.STATUS || '120') : '120');
				}
			}
			if ((DEBUG == 1 || DEBUG == 2) && url.lastIndexOf('.do')<0) {
				YT.Client.mock(cfg)
			}else{
				YT.AjaxUtil.ajaxData(cfg);
			}
			//DEBUG ? YT.Client.mock(cfg) : YT.AjaxUtil.ajaxData(cfg);
		},
		/**
		 * @private
		 * @description mock挡板数据
		 * @param cfg
		 *            {url,params,success,failure}
		 */
		mock : function(cfg) {
			$.getScript(cfg.url).done(function(data) {
				cfg.success(Mock.mock(YT.JsonEval(data)));
			}).fail(function() {
				YT.hideWaitPanel();
				YT.alertinfo('mock数据不存在')
			})
		},
		/**
		 * @description 返回登录页
		 * @example YT.Client.gotoLogin();
		 */
		gotoLogin : function(callback, e, params) {
			callback = YT.getFunctionName(callback);
			YT.Client._quickLogin(callback, e, params);
		},
		/**
		 * @description 弹出菜单层
		 */
		showPopupWindow : function(cfg, panel, app) {
			var list = [];
			$.each(cfg, function(i) {
				var map = {};
				var m = cfg[i];
				map.name = m.name;
				var func = m.func;
				func = YT.getFunctionName(func);
				map.func = func;
				list.push(map);
			});
			YT.Popup.initPopupindow(panel, app, {
				'list' : list
			});
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
		getNativeCache : function(url, version, type, cacheType, params,
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
		openMenuPage : function(cfg) {
			YT.nextPage(cfg.url);
		},
		/* ============== 网关通讯配置--开始 ============== */
		/**
		 * @description web页面访问渠道号 TODO 个系统自行修改
		 */
		chnlId : '1000',
		/**
		 * @description 用户通讯SessionId
		 */
		upsSid : '',
		/**
		 * @description 是否连接网关通讯
		 */
		isGateWay : true,
		/**
		 * @description 是否通讯加密
		 */
		isMessageEncrypt : false,
		/**
		 * @description 客户端与服务端的时间偏移量
		 */
		timeOffSet : 0,
		/**
		 * @description web页面通讯模式行为分析请求开关
		 */
		isCollection : true,
		isWebClient : true,
		/**
		 * TODO 获取系统时间，初始化时间偏移量、初始化通讯SessionId
		 */
		/**
		 * TODO 用户登录，获取SessionId
		 */
		/* ============== 网关通讯配置--结束 ============== */
		/**
		 * @description 初始化日期控件
		 * @param {element}
		 *            obj 日期控件dom对象
		 * @param {json}
		 *            cfg 参数配置
		 */
		_initDateWidget : function(obj, cfg) {
			var datePicker = new DateTimePicker.Date({
				lang : 'zh-CN',
				format : cfg.format,
				'default' : cfg.text,
				min : cfg.min,
				max : cfg.max
			});
			datePicker.on('selected', function(formatDate, now) {// 选中
				datePicker.destroy();
				if (cfg.callback) {
					window[cfg.callback](formatDate);
				} else {
					$("#" + obj.attr("id")).val(formatDate);
				}
			});
			datePicker.on('canceled', function() {// 取消
				datePicker.destroy();
			});
		},
		/**
		 * @description ocr或人脸识别执行入口
		 * @param {json}
		 *            conf 参数配置
		 * @param {event}
		 *            e 事件
		 * @param {boolean}
		 *            flag 业务类型:flag为true表示为人脸识别;false表示OCR识别
		 */
		_getInputPhoto : function(conf, e, flag) {
			YT.openWaitPanel();
			var _this = e.target, file = _this.files[0];
			if (typeof FileReader === 'undefined') {
				YT.alertinfo("设备不支持拍照功能");
				return;
			}
			if (!file) {
				YT.hideWaitPanel();
				return false;
			}
			var reader = new FileReader();
			reader.onload = function(e) {
				if (flag) {
					YT.Client._compressImg(e.target.result, '1.0', conf, true);// 此时e.target为fileReader
				} else {
					YT.Client._compressImg(e.target.result, '1.0', conf, false);// 此时e.target为fileReader
				}
			}
			reader.readAsDataURL(file);
		},
		/**
		 * @description 压缩h5拍摄的照片
		 * @param {img}
		 *            imgData 图片内容
		 * @param {float}
		 *            com_rate 压缩比率
		 * @param {json}
		 *            conf 配置参数
		 * @param {booleanF}
		 *            flag 业务类型:flag为true表示为人脸识别;false表示OCR识别
		 */
		_compressImg : function(imgData, com_rate, conf, flag) {
			if (!imgData) {
				return;
			}
			com_rate = com_rate || 1;// 压缩比率默认为1
			var maxW = 1000;
			var img = new Image();
			img.src = imgData;
			img.onload = function() {
				var canvas = document.createElement('canvas');
				var ctx = canvas.getContext("2d");
				if (img.width > maxW) {
					img.height *= maxW / img.width;
					img.width = maxW;
				}
				if (flag && img.width > img.height) {// flag为true表示为人脸识别，false表示OCR识别
					canvas.width = img.height;
					canvas.height = img.width;
					ctx.rotate(90 * Math.PI / 180);
					ctx.drawImage(img, 0, 0, img.width, -img.height);// 将图片绘制到canvas上
				} else {
					canvas.width = img.width;
					canvas.height = img.height;
					ctx.drawImage(img, 0, 0, img.width, img.height);// 将图片绘制到canvas上
				}
				var unpreBase64 = canvas.toDataURL("image/jpeg").replace(
						/^data:image\/(jpeg|png|gif);base64,/, ''); // 去掉base64的前缀，与客户端处理方式保持一致
				YT.hideWaitPanel();
				if (conf && conf.prevFunc) {
					conf.prevFunc(unpreBase64, com_rate, conf);
				} else {
					conf && conf.callback
							&& window[conf.callback](unpreBase64, com_rate, {});
				}
			}
		},

		/**
		 * @ignore
		 * @description 打开通讯录
		 * @param {function}
		 *            callback 回调函数
		 */
		openPhoneBook : function(callback) {
			YT.alertinfo('打开通讯录无权限');
		},
		/**
		 * @ignore
		 * @description 发送短信
		 * @param {function}
		 *            func
		 */
		sendSms : function(cfg) {
			YT.alertinfo('发送短信无权限');
		},
		/**
		 * @ignore
		 * @description 打电话
		 * 
		 * @param {function}
		 *            func
		 */
		callPhone : function(cfg) {
			YT.alertinfo('打开通讯录无权限');
		},
		/**
		 * @ignore
		 * @description 返回系统首页(此方法直接使用,客户端会自动监听
		 */
		gotoIndex : function() {
			YT.alertinfo("返回系统首页无权限");
		},
		/**
		 * @ignore
		 * @description 返回上一级(此方法直接使用,客户端会自动监听
		 */
		gotoBack : function() {
			//YT.alertinfo("返回上一级无权限");
			history.go(-1)
		},

		/**
		 * @ignore
		 * @description 二维码生成
		 */
		geneQRC : function(data, callback) {
			YT.alertinfo("二维码生成无权限");
		},
		/**
		 * @ignore
		 * @description 二维码扫一扫
		 */
		sweepQRC : function(callback) {
			YT.alertinfo("二维码扫一扫无权限");
		},
		/**
		 * @ignore
		 * @description 分享页面跳转 修改
		 */
		sharePages : function(datas) {
			YT.alertinfo("分享页面跳转无权限");
		},
		/**
		 * @ignore
		 * @description 分享电子回单
		 */
		shareReceipt : function(cfg) {
			YT.alertinfo("分享电子回单无权限");
		},
		/**
		 * @ignore
		 * @description 调用相册
		 */
		openMobilePhoto : function(callback) {
			YT.alertinfo('调用相册无权限');
		},
		/**
		 * @ignore
		 * @description 调用手机拍照
		 */
		openMobileCamera : function(data, callback) {
			YT.alertinfo('调用手机拍照无权限');
		},
		/**
		 * @ignore
		 * @description 调用手机相册
		 */
		openMobilePhotoAlbum : function(data, callback) {
			YT.alertinfo('调用手机&相册无权限');
		},
		/**
		 * @ignore
		 * @description 获取坐标数据
		 */
		location : function(callback) {
			YT.alertinfo('获取坐标数据无权限');
		},
		/**
		 * @description 检查指纹开启状态<br>
		 *         	
		 */
		fingerOpenState : function(conf){
			YT.showTips('检查指纹开启状态');
			var callback = conf.callback;
			callback && callback({STATE : '1'});
		},
		/**
		 * @description 设置指纹<br>
		 */
		setFinger : function(conf){
			var type = conf.type;
			if(type == '0'){
				YT.showTips('关闭指纹');
			}else{
				YT.showTips('开启指纹');
			}
			var callback = conf.callback;
			callback && callback({status : '1'});
		},
		/**
		 * @description 验证指纹<br>
		 */
		checkFinger : function(conf){
			YT.showTips('验证指纹');
			var callback = conf.callback;
			callback && callback({status : '1'});
		},
		/**
		 * @description 设置手势密码<br>
		 */
		setGesture : function(conf){
			var type = conf.type;
			if(type == '0'){
				YT.showTips('关闭手势密码');
			}else{
				YT.showTips('开启手势密码');
			}
			var callback = conf.callback;
			callback && callback({status : '1'});
		},
		/**
		 * @description 验证手势密码<br>
		 */
		checkGesture : function(conf){
			YT.showTips('验证手势密码');
			var callback = conf.callback;
			callback && callback({status : '1'});
		},

		/**
		 * @ignore
		 * @description 获取客户端信息
		 */
		getClientInfo : function(callback) {
			YT.alertinfo('获取客户端信息无权限');
		},
		/**
		 * @ignore
		 * @description 银行卡扫描Ocr
		 */
		scanBankCardOCR : function(callback, e, params) {
			YT.alertinfo('银行卡扫描Ocr待实现');
		},
		/**
		 * @ignore
		 * @description 身份证正面扫描Ocr
		 */
		scanIDCardFrontOCR : function(callback, e, params) {
			YT.alertinfo('身份证正面扫描Ocr待实现');
		},
		/**
		 * @ignore
		 * @description 身份证背面扫描Ocr
		 */
		scanIDCardBackOCR : function(callback, e, params) {
			YT.alertinfo('身份证背面扫描Ocr待实现');
		},
		/**
		 * @ignore
		 * @description 行驶证正面扫描Ocr
		 */
		scanVehicleLicenceFrontOCR : function(callback, e, params) {
			YT.alertinfo('行驶证正面扫描Ocr待实现');
		},
		/**
		 * @ignore
		 * @description 行驶证背面扫描Ocr
		 */
		scanVehicleLicenceBackOCR : function(callback, e, params) {
			YT.alertinfo('行驶证背面扫描Ocr待实现');
		},
		/**
		 * @ignore
		 * @description 营业执照扫描Ocr
		 */
		scanBusinessLicenceOCR : function(callback, e, params) {
			YT.alertinfo('营业执照扫描Ocr待实现');
		},
		/**
		 * @ignore
		 * @description 人脸识别
		 */
		liveFaceCheck : function(callback, e, params) {
			YT.alertinfo('人脸识别待实现');
		},
		/**
		 * @description 行为采集
		 * @param {json}
		 *            data 行为采集数据
		 */
		setCollection : function(data) {
			// debug模式或者行为采集关闭时
			if (DEBUG || !YT.Client.isCollection) {
				var config = {
						stt : '启动时间',
						bc : '银行编号',
						ci : '渠道ID',
						si : '启动ID',
						cn : '运营商',
						nw : '网络类型',
						nwn : '网络名称',
						clt : '设备类型',
						dn: '设备表示',
						dm: '设备型号',
						sv: '设备系统版本',
						bv: '设备系统版本',
						rn: '设备分辨率',
						ia: '客户端ip',
						ij: '是否越狱',
						ind: '是否安装新设备',
						gps: 'GPS',
						ad: '当前位置街道',
						en : '事件编号',
						cct : '采集类型',
						pid : '页面编号',
						ldt : '页面加载时间',
						mid : '功能ID',
						epd : '入口页地址',
						eid : '事件id',
						crt : '操作时间',
						mt : '消息类型',
						fp : '上一个页面地址',
						pp : '当前页面地址',
						pt : '当前页面标题',
						drt : '上一个页面停留时间',
						url : '请求地址',
						ce : '扩展属性'
				};
				YT.log.info(data);
				var logs = '#########################################################\n';
				$.each(data, function(k, v) {
					var val = config[k];
					//1：登录、2：启动、3：操作、4：访问
					if (k == 'mt') {
						var c = v;
						switch (c) {
							case '1':
								v = '登录';
								break;
							case '2':
								v = '操作';
								break;
							case '7':
								v = '页面请求';
								break;
						}
					}
					if (!YT.isEmpty(val)) {
						logs += val + ': ' + v + '\n';
					}
				});
				logs += '#########################################################';
				YT.log.info(logs);
				return;// 档板模式下不提交数据
			}
			// 记录采集信息到缓存
			var wcd = localStorage.getItem('WEB_COLLECT_STORAGE');
			var storageList = [];
			if (!YT.isEmpty(wcd)) {
				storageList = YT.JsonEval(wcd);
			}
			storageList.push(data);
			// 保存采集信息到缓存中
			localStorage.setItem('WEB_COLLECT_STORAGE', YT
					.JsonToStr(storageList));
			var len = storageList.length;
			if (len >= 10) {
				// 采集大于10条时，发送采集信息
				localStorage.removeItem('WEB_COLLECT_STORAGE');// 从缓存中删除记录信息
				// 发送行为采集信息 开始
				var url = YT.dataUrl('wechat/gather');
				var cfg = {
					url : url,
					params : {
						LIST: storageList
					},
					success : function() {
					},
					failure : function() {
					}
				};
				YT.AjaxUtil.ajaxData(cfg);
				// 发送行为采集信息 结束
			}
		},

        getImageCode:function(url,callback){
            try{
                var data = {
                    "status": "1",
                    "img": "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"
                };
                callback && callback(data);
            }catch(e){
                YT.alertinfo('调用客户端获取验证码组件异常', '_getImageCode:' + e);
            }
        },
        getModuleContent : function(params, callback){
        	var ret = {};
        	var url = params.url;
        	YT.AjaxUtil.getTemplate(url, function(rst){
        		ret.STATUS = '1';
				ret.DATA = rst;
				callback && callback(ret);
        	}, function(){
        		ret.STATUS = '0';
				ret.DATA = '加载模板失败!';
				callback && callback(ret);
        	});
        },
        getUserInfo : function(callback){
        	var url = YT.dataUrl("general/checkAuthentica", false);
    		YT.openWaitPanel();
    		YT.ajaxData(url, {}, function(data) {
    			YT.hideWaitPanel();
    			callback && callback(data)
    		},function(error){
    			YT.hideWaitPanel();
    			YT.alertinfo(error.MSG,"温馨提示",YT.hideWaitPanel());
    		})
        }
        
	};
	/**
	 * @private
	 * @description 回显密码
	 * @param jsonData
	 *            {json} 密文与显号 eg.{passVal:"12FABC123",showVal:"******"}
	 * @returns
	 */
	W._savePwd = function(jsonData) {
		try {
			if (YT.isString(jsonData)) {
				jsonData = YT.JsonEval(jsonData);
			}
			var passVal = jsonData.passVal;
			var showVal = jsonData.showVal;
			var cfg = _WK_DATAS["PwdPick"];
			var curObj = cfg.ele;
			var transAuth = cfg.transAuth;
			if (YT.isEmpty(passVal) || YT.isEmpty(showVal)) {
				curObj.attr("data-value", "").val("");
				// 交易认证专用
				if (!YT.isEmpty(transAuth) && transAuth == "true") {
					YT.AuthBox.TPwdCallBack(curObj);
				}
				return;
			}
			curObj.attr("data-value", passVal); // 密文
			curObj.val(showVal); // 星号
			curObj.attr("data-random", cfg.random); // 加密因子
			// 交易认证专用
			if (!YT.isEmpty(transAuth) && transAuth == "true") {
				YT.AuthBox.TPwdCallBack(curObj);
			}
		} catch (e) {
			YT.alertinfo("回显密码", "PwdPick，" + e);
		}
	};
	/**
	 * @private
	 * @description 回显日期
	 * @param data
	 *            控件选择的的日期 默认格式 yyyy-MM-dd 或 yyyy-MM
	 */
	W._saveDate = function(data) {
		var cfg = _WK_DATAS["datePick"];
		var curObj = cfg.ele;
		curObj.val(data);
		curObj.trigger("change");
	};
	/**
	 * @private
	 * @description 回显金额
	 * @param data
	 *            键盘输入的值
	 */
	W._saveMoney = function(data) {
		var cfg = _WK_DATAS["moneyPick"];
		var curObj = cfg.ele;
		curObj.val(YT.Format.fmtAmt(data));
		curObj.trigger("change");
		curObj.trigger("input");
	};
	/**
	 * @private
	 * @description 回显数字
	 * @param data
	 *            键盘输入的值
	 */
	W._saveNumber = function(data) {
		var cfg = _WK_DATAS["numberPick"];
		var curObj = cfg.ele;
		curObj.val(data);
		curObj.trigger("change");
		curObj.trigger("input");
	};
	/**
	 * @private
	 * @description 回显证件号
	 * @param data
	 *            键盘输入的值
	 */
	W._saveIDC = function(data) {
		var cfg = _WK_DATAS["IDCPick"];
		var curObj = cfg.ele;
		curObj.val(data);
		curObj.trigger("change");
		curObj.trigger("input");
	};
	/**
	 * @private
	 * @description 回显密码
	 * @param jsonData
	 *            {json} 密文与显号 eg.{passVal:"12FABC123",showVal:"******"}
	 * @returns
	 */
	W._savePwd = function(jsonData) {
		try {
			if (YT.isString(jsonData)) {
				jsonData = YT.JsonEval(jsonData);
			}
			var passVal = jsonData.passVal;
			var showVal = jsonData.showVal;
			var cfg = _WK_DATAS["PwdPick"];
			var curObj = cfg.ele;
			var transAuth = cfg.transAuth;
			if (YT.isEmpty(passVal) || YT.isEmpty(showVal)) {
				curObj.attr("data-value", "").val("");
				// 交易认证专用
				if (!YT.isEmpty(transAuth) && transAuth == "true") {
					YT.AuthBox.TPwdCallBack(curObj);
				}
				return;
			}
			curObj.attr("data-value", passVal); // 密文
			curObj.val(showVal); // 星号
			curObj.attr("data-random", cfg.random); // 加密因子
			// 交易认证专用
			if (!YT.isEmpty(transAuth) && transAuth == "true") {
				YT.AuthBox.TPwdCallBack(curObj);
			}
		} catch (e) {
			YT.alertinfo("回显密码", "PwdPick，" + e);
		}
	};
	YT.log.debug("---end---", TAG);
});
