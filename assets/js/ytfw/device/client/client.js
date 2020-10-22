/**
 * 
 * @FileName: client.js
 * @demo: demo/client.html
 * @Desc: 客户端交互方法定义（ios与android相同）
 * @author: HY
 * @date: 2018年07月30日
 * 
 * 名称 方法名 交互编号|类型 客户端方法名
 * 
 * 1. 初始化导航栏 initPageTitle initPageTitle
 * 
 * 2. 信息提示框 alertinfo |ALERT alertinfo
 * 
 * 3. 信息确认框 confirm |CONFIRM alertinfo
 * 
 * 4. 开启等待层 openWaitPanel |OPEN openWaitPanel
 * 
 * 5. 关闭等待层 hideWaitPanel |CLOSE hideWaitPanel
 * 
 * 6. 金额键盘 showMoneyPicker |MONEY showMoneyKeyboard
 * 
 * 7. 交易密码键盘 showTPwdPicker |TPWD showTPwdKeyboard
 * 
 * 8. 日期控件 showDatePicker showCalendarView
 * 
 * 9. 纯数字键盘 showNumPicker |NUMBER showNumberKeyboard
 * 
 * 10.身份证键盘 showIDCPicker |IDC showIDCKeyboard
 * 
 * 11.登录密码键盘 showLPwdPicker |LPWD showLPwdKeyboard
 * 
 * 12.打开手机电话薄 openPhoneBook showAddressBook
 * 
 * 13.发送短信 sendSms sendSms
 * 
 * 14.打电话 callPhone callPhone
 * 
 * 15.会话超时 sessionTimeout |TIMEOUT sessionTimeout
 * 
 * 16.登录session获取 getSession getSession
 * 
 * 17.登录session设置 setSession setSession
 * 
 * 18.Ajax请求 post post
 * 
 * 19.返回首页 gotoIndex gotoIndex
 * 
 * 20.返回上一页 gotoBack gotoBack
 * 
 * 21.返回登录页 gotoLogin gotoLogin
 * 
 * 22.二维码生成 geneQRC geneQRC
 * 
 * 23.二维码扫一扫 sweepQRC sweepQRC
 * 
 * 24.分享公用方法跳转 sharePages share
 * 
 * 25.分享电子回单 shareReceipt shareReceipt
 * 
 * 26.行为采集 setCollection BehaviorCollection
 * 
 * 27.调用手机拍照/相册 openMobilePhoto openMobileCamera
 * 
 * 28.调用手机拍照 openMobileCamera openMobileCamera
 * 
 * 29.调用手机相册 openMobilePhotoAlbum openMobileCamera
 * 
 * 32.获取坐标缓存 location location
 * 
 * 34.指纹验证 checkFingerPrint checkFingerPrint
 * 
 * 35.开通指纹验证 openFingerPrint openFingerPrint
 * 
 * 36.弹出菜单层 showPopupWindow showPopupWindow
 * 
 * 45.设置手势 setGesture setGesture
 * 
 * 46.验证手势 checkGesture checkGesture
 * 
 * 47.开启/关闭 手势或指纹登录通知客户端 openOrColse openOrColse
 * 
 * 49.首页页面跳转 openMenuPage openMenuFunc
 * 
 * 50.银行卡 scanBankCard
 * 
 * 51.身份证正面 scanIDCardFront
 * 
 * 52.身份证反面 scanIDCardBack
 * 
 * 53.行驶证正面 scanVehicleLicenceFront
 * 
 * 54.行驶证反面 scanVehicleLicenceBack
 * 
 * 55.营业执照 scanBusinessLicence
 * 
 * 带下划线内内部方法，不支持外围直接调用，如： _callHandler
 * 
 */
;
(function() {
	/**
	 * @private
	 * @description 初始化临时window变量
	 */
	var W = window;
	/**
	 * @private
	 * @description 键盘事件输入后执行回调
	 */
	var _WK_DATAS = {};
	/**
	 * @private
	 * @description 调用客户端方法
	 * @param {string}
	 *            funcName 方法名，js与客户端约定
	 * @param {string}
	 *            jsonData 传递参数
	 */
	var _callHandler = function(funcName, jsonData) {
		window.WebViewJavascriptBridge.callHandler(funcName, jsonData);
	}
	/**
	 * @private
	 * @description 初始化webview jsbridge
	 */
	var _connectWebViewJavascriptBridge = function(callback) {
		if (window.WebViewJavascriptBridge) {
			callback(WebViewJavascriptBridge)
		} else {
			document.addEventListener('WebViewJavascriptBridgeReady', function() {
				callback(WebViewJavascriptBridge)
			}, false);
		}
	}
	/**
	 * @private
	 * @description 调用原生插件
	 */
	var _nativeCall = function(bridge) {
		bridge.init(function(message, responseCallback) {
			responseCallback && responseCallback();
		});
	}
	/**
	 * @private
	 * @description 开启jsbridge监听
	 */
	_connectWebViewJavascriptBridge(_nativeCall);

	/**
	 * @private
	 * @description 标题按钮json配置生成
	 * @param {json}
	 *            cfg 按钮参数
	 * @returns json对象 exist:是否存在 text:按钮名字/图片代码 handler:处理方法
	 */
	function generyTitleConf(cfg) {
		var ary = [];
		if (cfg && cfg[0] == "true" && ((cfg.length - 1) % 2 == 0)) {
			for (var i = 1; i < cfg.length;) {
				var name = cfg[i];
				var func = cfg[i + 1];
				if (name && func) {
					var name = cfg[i];
					ary.push({
						exist : "true",
						name : name,
						icon : "back",
						sort : ((i - 1) / 2),
						func : func
					});
				} else {
					break;
				}
				i += 2;
			}
			return ary[0];
		}
		return {
			exist : "false"
		};
	}

	/**
	 * @fileOverview 客户端交互方法定义（ios与android相同）
	 * @nameSpace YT.Client
	 */
	YT.Client = {
		/**
		 * @description 提供扩展的原生插件调用
		 * @param {string}
		 *            funcName 方法名，js与客户端约定
		 * @param {json}
		 *            jsonData 传递参数
		 */
		callHandler : function(funcName, jsonData) {
			_callHandler(funcName, jsonData);
		},
		/**
		 * @final
		 * @description 判断是否为浏览器进入
		 */
		isWeb : false,
		/**
		 * @private
		 * @description 获取页面标题
		 * 
		 * @param {string}
		 *            pageId 页面唯一标识
		 * @returns {*} 页面标题配置项
		 */
		_getPageTitle : function(pageId) {
			var page = $(pageId);
			var cfg = {
				title : page.attr("title")
			};
			var leftCfg = page.attr("data-btnLeft").split("|");
			cfg.leftButton = generyTitleConf(leftCfg);
			var rightCfg = page.attr("data-btnRight").split("|");
			cfg.rightButton = generyTitleConf(rightCfg);
			var theme = page.data('theme');
			cfg.theme = theme;
			return cfg;
		},
		/**
		 * @description 初始化页标题栏<br>
		 *              接口名称：initPageTitle <br>
		 * @param {string}
		 *            pageId 初始化的页面的DOM节点
		 * @example YT.Client.initPageTitle(pageA);
		 */
		initPageTitle : function(pageId) {
			try {
				var json = this._getPageTitle(pageId);
				_callHandler("initPageTitle", JSON.stringify(json));
			} catch (e) {
				YT.alertinfo('初始化页标题栏异常', 'initPageTitle:' + e);
			}
		},
		/**
		 * @description 信息提示框<br>
		 *              接口名称：alertinfo <br>
		 * @param {string}
		 *            msg 信息内容
		 * @param {string}
		 *            title 弹出框标题
		 * @param {func}
		 *            okAct 确认按钮事件
		 * @param {string}
		 *            okName 确认按钮名称
		 * @example YT.Client.alertinfo('我是通知内容','标题');
		 */
		alertinfo : function(msg, title, okAct, okName) {
			try {
				okAct = YT.getFunctionName(okAct);
				if (okAct && okAct.substr(okAct.length - 1) != ")") {
					okAct = okAct + "()";
				}
				title = title || "温馨提示";
				okName = okName || "确定";
				var cfg = {
					title : title,
					msg : msg,
					ok_text : okName,
					ok_func : okAct || "",
					type : "ALERT"
				};
				_callHandler("alertinfo", JSON.stringify(cfg));
			} catch (e) {
				alert('alertinfo:' + e);
			}
		},
		/**
		 * @description 弹出确认信息框 <br>
		 *              接口名称：alertinfo <br>
		 * @param {string}
		 *            msg 信息内容
		 * @param {string}
		 *            title 弹出框标题
		 * @param {string}
		 *            okAct 确认按钮事件
		 * @param {function}
		 *            cancleAct 取消按钮事件
		 * @param {string}
		 *            okName 确认按钮名称
		 * @param {function}
		 *            cancleName 取消按钮的名称
		 * @example YT.Client.confirm("我是通知内容","标题","alert(2)")
		 */
		confirm : function(msg, title, okAct, cancleAct, okName, cancleName) {
			try {
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
				var cfg = {
					title : title,
					msg : msg,
					ok_text : okName,
					ok_func : okAct || "",
					cancel_text : cancleName,
					cancel_func : cancleAct || "",
					type : "CONFIRM"
				};
				_callHandler("alertinfo", JSON.stringify(cfg));
			} catch (e) {
				alert("confirm:" + e)
			}
		},
		/**
		 * @description 开启等待层<br>
		 *              接口名称：openWaitPanel <br>
		 * @param {string}
		 *            msg 显示内容
		 * @example YT.Client.openWaitPanel('正在拼命加载中。。。');
		 */
		openWaitPanel : function(msg) {
			try {
				var cfg = {
					msg : msg,
					touchable : 'false',
					type : 'OPEN'
				};
				_callHandler("openWaitPanel", JSON.stringify(cfg));
			} catch (e) {
				YT.alertinfo('开启等待层异常', "openWaitPanel=" + e);
			}
		},
		/**
		 * @description 关闭等待层<br>
		 *              接口名称：hideWaitPanel <br>
		 * @param {int}
		 *            timeout 延时关闭时间(毫秒)
		 * @example YT.Client.hideWaitPanel(200);
		 */
		hideWaitPanel : function(timeout) {
			try {
				var cfg = {
					type : 'CLOSE'
				};
				setTimeout(function() {
					_callHandler("hideWaitPanel", JSON.stringify(cfg));
				}, timeout);
			} catch (e) {
				YT.alertinfo('关闭等待层异常', 'hideWaitPanel:' + e);
			}
		},
		/**
		 * @description 显示金额键盘(调用方法不需要在input里面加入)<br>
		 *              接口名称：showMoneyKeyboard <br>
		 * @param {element}
		 *            handle dom对象
		 * @example YT.Client.showMoneyPicker($ele);
		 */
		showMoneyPicker : function($obj) {
			try {
				var input_val = YT.Format.unfmtAmt($obj.val());
				if (input_val != "0.00" && input_val != "") {
					input_val = (input_val * 1) + "";
				} else {
					input_val = "";
				}
				var cfg = {
					text : input_val,
					len : $obj.attr("data-maxlength") || '9',
					type : "MONEY",
					callback : "_saveMoney"
				};
				// 调用键盘页面上滑处理
				YT.Client.showKeyBoard($obj);
				_callHandler("showMoneyKeyboard", cfg);
				var wk = {
					ele : $obj
				};
				_WK_DATAS["moneyPick"] = YT.apply(wk, cfg);
			} catch (e) {
				YT.alertinfo('显示金额键盘', 'showMoneyPicker=' + e);
			}
		},
		/**
		 * @description 显示交易密码安全键盘(调用方法不需要在input里面加入)<br>
		 *              接口名称：showTPwdKeyboard <br>
		 * @param {element}
		 *            handle dom对象
		 * @example YT.Client.showTPwdPicker($ele);
		 */
		showTPwdPicker : function($obj) {
			try {
				var rdm = Fw.getRandom(16);
				var cfg = {
					len : $obj.attr("data-len") || '6',
					transAuth : $obj.attr("data-transAuth"),
					transAuthLj : $obj.attr("data-transAuthLj"),
					random : rdm,
					type : "TPWD",
					callback : "_savePwd"
				}
				// 调用键盘页面上滑处理
				YT.Client.showKeyBoard($obj);
				_callHandler("showTPwdKeyboard", cfg);
				var wk = {
					ele : $obj
				};
				_WK_DATAS["PwdPick"] = YT.apply(wk, cfg);
			} catch (e) {
				YT.alertinfo("显示交易密码安全键", "showTPwdPicker=" + e);
			}
		},
		/**
		 * @description 显示日期键盘(调用方法不需要在input里面加入)<br>
		 *              接口名称：showCalendarView <br>
		 * @param {element}
		 *            handle dom对象
		 * @example YT.Client.showDatePicker($ele);
		 */
		showDatePicker : function($obj) {
			try {
				var val = $obj.val() || new Date().format("yyyy-MM-dd");
				var format = $obj.attr("data-format") || "yyyy-MM-dd";
				var min = new Date(val.substring(0, 4) * 1 - 99 + "-01-01").format(format);
				var max = new Date(val.substring(0, 4) * 1 + 99 + "-12-31").format(format);
				var cfg = {
					text : val,
					format : $obj.attr("data-format") || "yyyy-MM-dd",
					min : min,
					max : max,
					callback : "_saveDate"
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
				// 调用键盘页面上滑处理
				YT.Client.showKeyBoard($obj);
				_callHandler("showCalendarView", cfg);
				var wk = {
					ele : $obj
				};
				_WK_DATAS["datePick"] = YT.apply(wk, cfg);
			} catch (e) {
				YT.alertinfo('显示日期键盘', 'showDatePicker=' + e);
			}
		},
		/**
		 * @description 显示纯数字键盘(调用方法不需要在input里面加入)<br>
		 *              接口名称：showNumberKeyboard <br>
		 * @param {element}
		 *            handle dom对象
		 * @example YT.Client.showNumPicker($ele);
		 */
		showNumPicker : function($obj, cfg) {
			try {
				var cfg = {
					text : $obj.val(),
					len : $obj.attr("data-maxlength") || '19',
					type : "NUMBER",
					callback : "_saveNumber"
				}
				// 调用键盘页面上滑处理
				YT.Client.showKeyBoard($obj);
				_callHandler("showNumberKeyboard", cfg);
				var wk = {
					ele : $obj
				};
				_WK_DATAS["numberPick"] = YT.apply(wk, cfg);
			} catch (e) {
				YT.alertinfo('显示纯数字键盘', "showNumPicker=" + e);
			}
		},
		/**
		 * @description 显示身份证键盘(调用方法不需要在input里面加入)<br>
		 *              接口名称：showIDCKeyboard <br>
		 * @param {element}
		 *            handle dom对象
		 * @example YT.Client.showIDCPicker($ele);
		 */
		showIDCPicker : function($obj, cfg) {
			try {
				var cfg = {
					id : $obj.attr("id"),
					text : $obj.val(),
					len : $obj.attr("data-maxlength") || '18',
					type : "IDC",
					callback : "_saveIDC"
				}
				// 调用键盘页面上滑处理
				YT.Client.showKeyBoard($obj);
				_callHandler("showIDCKeyboard", cfg);
				var wk = {
					ele : $obj
				};
				_WK_DATAS["IDCPick"] = YT.apply(wk, cfg);
			} catch (e) {
				YT.alertinfo('显示身份证键盘', "showIDCPicker=" + e);
			}
		},
		/**
		 * @description 显示登录密码安全键盘(调用方法不需要在input里面加入)<br>
		 *              接口名称：showLPwdKeyboard <br>
		 * @param {element}
		 *            handle dom对象
		 * @example YT.Client.showLPwdPicker($ele);
		 */
		showLPwdPicker : function($obj) {
			try {
				var rdm = Fw.getRandom(16);
				var cfg = {
					id : $obj.attr("id"),
					len : $obj.attr("data-maxlength") || '16',
					random : rdm,
					type : "LPWD",
					callback : "_savePwd"
				};
				// 调用键盘页面上滑处理
				YT.Client.showKeyBoard($obj);
				_callHandler("showLPwdKeyboard", cfg);
				var wk = {
					ele : $obj
				};
				_WK_DATAS["PwdPick"] = YT.apply(wk, cfg);
			} catch (e) {
				YT.alertinfo("显示登录密码安全键盘", "showLPwdPicker:" + e);
			}
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
		 * @description 打开手机电话薄<br>
		 *              接口名称：showAddressBook <br>
		 * @param {function}
		 *            callback 回调函数名称
		 * @example YT.Client.openPhoneBook(callback);
		 */
		openPhoneBook : function(callback) {
			try {
				callback = YT.getFunctionName(callback);
				var cfg = {
					'callback' : callback
				};
				_callHandler("showAddressBook", JSON.stringify(cfg));
			} catch (e) {
				YT.alertinfo('打开手机电话薄异常', 'openPhoneBook:' + e);
			}
		},
		/**
		 * @description 发送短信<br>
		 *              接口名称：sendSms <br>
		 * @param {string}
		 *            phoneNo 手机号码
		 * @example YT.Client.sendSms(phoneNo);
		 */
		sendSms : function(phoneNo) {
			try {
				var cfg = {
					phoneNo : phoneNo
				}
				_callHandler("sendSms", JSON.stringify(cfg));
			} catch (e) {
				YT.alertinfo('发送短信异常', 'sendSms:' + e);
			}
		},
		/**
		 * @description 打电话<br>
		 *              接口名称：callPhone <br>
		 * @param {string}
		 *            phoneNo 手机号码
		 * @example YT.Client.callPhone(phoneNo);
		 */
		callPhone : function(phoneNo) {
			try {
				var cfg = {
					phoneNo : phoneNo
				}
				_callHandler("callPhone", JSON.stringify(cfg));
			} catch (e) {
				YT.alertinfo('打电话异常', 'callPhone:' + e);
			}
		},
		/**
		 * @description session超时<br>
		 *              接口名称：sessionTimeout <br>
		 * @param {string}
		 *            msg 内容
		 * @param {string}
		 *            title 标题名称名称
		 * @param {string}
		 *            okName 确认按钮名称
		 * @example YT.Client.sessionTimeout('会话超时，请重新登录！','标题');
		 */
		sessionTimeout : function(msg, title, okName) {
			try {
				title = title || "温馨提示";
				msg = msg || "会话超时，请重新登录";
				okName = okName || "确定";
				var cfg = {
					title : title,
					msg : msg,
					ok_text : okName,
					type : "TIMEOUT"
				};
				_callHandler("sessionTimeout", JSON.stringify(cfg));
			} catch (e) {
				YT.alertinfo('session超时', "sessionTimeout:" + e)
			}
		},
		/**
		 * @description 重置客户端用户登录信息<br>
		 *              接口名称：backSession <br>
		 * @param {json}
		 *            user 登录用户信息
		 * @param {function}
		 *            callback 回调函数
		 * @example YT.Client.resetLoginSession({'USER_ID':'11'},callback);
		 */
		resetLoginSession : function(user, callback) {
			try {
				// 获取回调函数方法名
				callback = YT.getFunctionName(callback);
				var cfg = {
					"SESS_LOGIN" : user,
					callback : callback
				};
				_callHandler("backSession", JSON.stringify(cfg));
			} catch (e) {
				YT.alertinfo('重置登录用户信息异常', 'resetLoginSession:' + e);
			}
		},
		/**
		 * @description 获取缓存信息，json类型，数据内容变化极小的<br>
		 *              接口名称：getSession <br>
		 * @param {string}
		 *            sessKey 获取数据对应的key
		 * @param {function}
		 *            callback 获取到回调
		 * @example YT.getSession('final','me.getSession');
		 *          me.getSession=function(data){ console.log(data); }
		 */
		getSession : function(sessKey, callback, cacheType) {
			try {
				// 获取回调函数方法名
				callback = YT.getFunctionName(callback);
				var cfg = {
					"SESS_KEY" : sessKey,
					callback : callback,
					"cacheType" : cacheType
				};
				_callHandler("getSession", JSON.stringify(cfg));
			} catch (e) {
				YT.alertinfo('获取登录用户信息异常', 'getSession:' + e);
			}
		},
		/**
		 * @description 设置缓存信息，json类型，数据内容变化极小的<br>
		 *              接口名称：setSession <br>
		 * @param {string}
		 *            sessKey 当前数据所对应的key
		 * @param {json}
		 *            sessData 会话数据 例如。{key1:'',key2:''}
		 * @example YT.setSession('final',{key1:'',key2:''});
		 */
		setSession : function(sessKey, sessData, cacheType) {
			try {
				var cfg = {
					"SESS_KEY" : sessKey,
					"SESS_DATA" : sessData,
					"cacheType" : cacheType
				}
				_callHandler("setSession", JSON.stringify(cfg));
			} catch (e) {
				YT.alertinfo('设置登录用户信息异常', 'setSession:' + e);
			}
		},
		/**
		 * @description 客户端native ajax 请求<br>
		 *              接口名称：post <br>
		 * @param {url}
		 *            url 请求地址
		 * @param {json}
		 *            params 请求参数
		 * @param {function}
		 *            succFuncName 成功回调函数名称
		 * @param {function}
		 *            failFuncName 失败回调函数名称
		 */
		post : function(url, params, success, failure) {
			YT.log.debug(params);
			try {
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
						YT.log.debug(rpdata);
						if (rpdata.STATUS == '1') {
							success && success(rpdata);
							YT.Collection.timeUrl(url, rpdata ? (rpdata.STATUS || '120') : '120');
						} else {
							$('#mainBody').find('.ui-prev-loading').removeClass('ui-prev-loading');
							if (rpdata.STATUS == '005') {// 判断用户session是否超时
								YT.hideWaitPanel();
//								YT.sessionTimeout();
								YT.Collection.timeUrl(url, rpdata ? (rpdata.STATUS || '120') : '120');
							} else if (rpdata.STATUS == '006') { // 重复提交
								YT.hideWaitPanel();
								YT.alertinfo('' + rpdata.MSG);
								YT.Collection.timeUrl(url, rpdata ? (rpdata.STATUS || '120') : '120');
							} else { // 状态码非成功状态
								failure && failure(rpdata);
								YT.Collection.timeUrl(url, rpdata ? (rpdata.STATUS || '120') : '120');
							}
						}
					},
					failure : function(rpdata) {
						$('#mainBody').find('.ui-prev-loading').removeClass('ui-prev-loading');
						failure && failure(rpdata);
						YT.Collection.timeUrl(url, rpdata ? (rpdata.STATUS || '120') : '120');
					}
				}
				if (DEBUG) {
					YT.Client.mock(cfg);
				} else {
					cfg.success = YT.getFunctionName(cfg.success);
					cfg.failure = YT.getFunctionName(cfg.failure);
					_callHandler("post", JSON.stringify(cfg));
				}
			} catch (e) {
				YT.alertinfo('通讯组件异常', 'post:' + e);
			}
		},
		/**
		 * @private
		 * @description mock挡板数据
		 * @param {json}
		 *            cfg 请求配置参数
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
		 * @description 返回系统首页<br>
		 *              接口名称：gotoIndex <br>
		 * @example YT.Client.gotoIndex();
		 */
		gotoIndex : function() {
			try {
				_callHandler("gotoIndex", {});
			} catch (e) {
				YT.alertinfo('返回系统首页异常', 'gotoIndex:' + e);
			}
		},
		/**
		 * @description 返回上一页<br>
		 *              接口名称：gotoBack <br>
		 * @example YT.Client.gotoIndex();
		 */
		gotoBack : function() {
			try {
				_callHandler("gotoBack", {});
			} catch (e) {
				YT.alertinfo('返回上一页异常', 'gotoBack:' + e);
			}
		},
		/**
		 * @description 返回登录页<br>
		 *              接口名称：gotoLogin <br>
		 * @example YT.Client.gotoLogin();
		 */
		gotoLogin : function(callback) {
			try {
				_callHandler("gotoLogin", {});
			} catch (e) {
				YT.alertinfo('返回登录页异常', 'gotoLogin:' + e);
			}
		},
		/**
		 * @description 二维码生成<br>
		 *              接口名称：geneQRC <br>
		 * @param {json}
		 *            data 二维码参数
		 * @param {function}
		 *            callback 回调函数名称
		 * @example YT.Client.geneQRC(data,callback);
		 */
		geneQRC : function(data, callback) {
			try {
				// 获取回调函数方法名
				callback = YT.getFunctionName(callback);
				var cfg = {
					data : JSON.stringify(data),
					callback : callback,
				};
				_callHandler("geneQRC", JSON.stringify(cfg));
			} catch (e) {
				YT.alertinfo('二维码生成异常', 'geneQRC:' + e);
			}
		},
		/**
		 * @description 二维码扫一扫<br>
		 *              接口名称：sweepQRC <br>
		 * @param {function}
		 *            callback 回调函数名称
		 * @example YT.Client.sweepQRC(callback);
		 */
		sweepQRC : function(callback) {
			try {
				// 获取回调函数方法名
				callback = YT.getFunctionName(callback);
				var cfg = {
					callback : callback,
				};
				_callHandler("sweepQRC", JSON.stringify(cfg));
			} catch (e) {
				YT.alertinfo('二维码扫一扫异常', 'sweepQRC:' + e);
			}
		},
		/**
		 * @description 分享页面跳转<br>
		 *              接口名称：sharePages <br>
		 * @param {json}
		 *            data 分享参数
		 * @param {function}
		 *            callback 回调函数名称
		 * @example YT.Client.sharePages(data,callback);
		 */
		sharePages : function(data, callback) {
			try {
				// 获取回调函数方法名
				callback = YT.getFunctionName(callback);
				var cfg = {
					type : data.type,// 分享渠道
					// WX-微信，PYQ-朋友圈，QQ-qq，WB-微博，DX-短信，YX-邮箱
					title : data.title,// 分享标题
					content : data.content,// 分享摘要
					hrefUrl : data.hrefUrl,// 分享url地址
					imgUrl : data.imgUrl,// 分享图片url地址
					callback : callback,// 回调函数
				}
				_callHandler("sharePages", JSON.stringify(cfg));
			} catch (e) {
				YT.alertinfo('页面分享异常', 'sharePages:' + e);
			}
		},
		/**
		 * @description 分享电子回单<br>
		 *              接口名称：shareReceipt <br>
		 * @param {json}
		 *            data 分享参数
		 * @param {function}
		 *            callback 回调函数名称
		 * @example YT.Client.shareReceipt(data,callback);
		 */
		shareReceipt : function(type, callback) {
			try {
				// 获取回调函数方法名
				callback = YT.getFunctionName(callback);
				var cfg = {
					type : type,
					callback : callback
				}
				_callHandler("shareReceipt", JSON.stringify(cfg));
			} catch (e) {
				YT.alertinfo('分享图片信息异常', 'shareReceipt:' + e);
			}
		},
		/**
		 * @description 行为采集<br>
		 *              接口名称：BehaviorCollection <br>
		 * @param {json}
		 *            data 收集信息
		 * @example YT.Client.setCollection(data);
		 */
		setCollection : function(data) {
			if (!YT.isEmpty(data)) {
				try {
					_callHandler("BehaviorCollection", JSON.stringify(data));
				} catch (e) {
					YT.alertinfo('行为采集异常', 'BehaviorCollection:' + e);
				}
			}
		},
		/**
		 * @description 调用手机相册<br>
		 *              接口名称：openMobileCamera <br>
		 * @param {json}
		 *            data 压缩系数等
		 * @param {function}
		 *            callback 回调函数名称
		 * @example YT.Client.openMobilePhoto(data,callback);
		 */
		openMobilePhoto : function(data, callback) {
			try {
				data.type = 'photo';// 相册的type值
				data.COMP_RATE = data.COMP_RATE ? data.COMP_RATE : '0.5';// 默认值
				// 获取回调函数方法名
				callback = YT.getFunctionName(callback);
				var cfg = {
					data : data,
					callback : callback
				};
				_callHandler("openMobileCamera", JSON.stringify(cfg));
			} catch (e) {
				YT.alertinfo('调用拍照&相册异常', 'openMobileCamera:' + e);
			}
		},
		/**
		 * @description 调用手机拍照<br>
		 *              接口名称：openMobileCamera <br>
		 * @param {json}
		 *            data 压缩系数等
		 * @param {function}
		 *            callback 回调函数名称
		 * @example YT.Client.openMobileCamera(data,callback);
		 */
		openMobileCamera : function(data, callback) {
			try {
				data.type = 'camera';// 相册和拍照的type值
				data.COMP_RATE = data.COMP_RATE ? data.COMP_RATE : '0.5';// 默认值
				// 获取回调函数方法名
				callback = YT.getFunctionName(callback);
				var cfg = {
					data : data,
					callback : callback
				};
				_callHandler("openMobileCamera", JSON.stringify(cfg));
			} catch (e) {
				YT.alertinfo('调用拍照异常', 'openMobileCamera:' + e);
			}

		},
		/**
		 * @description 调用手机相册<br>
		 *              接口名称：openMobileCamera <br>
		 * @param {json}
		 *            data 压缩系数等
		 * @param {function}
		 *            callback 回调函数名称
		 * @example YT.Client.openMobilePhotoAlbum(data, callback);
		 */
		openMobilePhotoAlbum : function(data, callback) {
			try {
				data.type = 'photoAlbum';// 相册和拍照的type值
				data.COMP_RATE = data.COMP_RATE ? data.COMP_RATE : '0.5';// 默认值
				// 获取回调函数方法名
				callback = YT.getFunctionName(callback);
				var cfg = {
					data : data,
					callback : callback
				};
				_callHandler("openMobileCamera", JSON.stringify(cfg));
			} catch (e) {
				YT.alertinfo('调用相册异常', 'openMobileCamera:' + e);
			}
		},
		/**
		 * @description 获取坐标数据<br>
		 *              接口名称：location <br>
		 * @param {function}
		 *            callback 回调函数名称
		 * @example YT.Client.location(callback);
		 */
		location : function(callback) {
			try {
				callback = YT.getFunctionName(callback);
				var json = {
					"callback" : callback
				};
				_callHandler("location", JSON.stringify(json));
			} catch (e) {
				YT.alertinfo('获取坐标信息异常', 'location:' + e);
			}
		},

		/**
		 * @description 检查指纹开启状态<br>
		 *              接口名称：fingerOpenState <br>
		 * @param {}
		 *            conf = { callback : function(rsp){} }
		 * 
		 */
		fingerOpenState : function(conf) {
			try {
				conf.callback = YT.getFunctionName(conf.callback);
				_callHandler("fingerOpenState", JSON.stringify(conf));
			} catch (e) {
				YT.alertinfo('检查指纹开启状态', 'fingerOpenState:' + e);
			}
		},
		/**
		 * @description 设置指纹<br>
		 *              接口名称：setFinger <br>
		 * @param {}
		 *            conf = { type: 0, //type:0 关闭 type:1开启 callback :
		 *            function(rsp){} }
		 */
		setFinger : function(conf) {
			try {
				conf.callback = YT.getFunctionName(conf.callback);
				_callHandler("setFinger", JSON.stringify(conf));
			} catch (e) {
				YT.alertinfo('设置指纹', 'setFinger:' + e);
			}
		},
		/**
		 * @description 验证指纹<br>
		 *              接口名称：checkFinger <br>
		 * @param {}
		 *            conf = { callback : function(rsp){} }
		 */
		checkFinger : function(conf) {
			try {
				conf.callback = YT.getFunctionName(conf.callback);
				_callHandler("checkFinger", JSON.stringify(conf));
			} catch (e) {
				YT.alertinfo('验证指纹', 'checkFinger:' + e);
			}
		},
		/**
		 * @description 设置手势密码<br>
		 *              接口名称：setGesture <br>
		 * @param {}
		 *            conf = { type: 0, //type:0 关闭 type:1开启 callback :
		 *            function(rsp){} }
		 * 
		 */
		setGesture : function(conf) {
			try {
				conf.callback = YT.getFunctionName(conf.callback);
				_callHandler("setGesture", JSON.stringify(conf));
			} catch (e) {
				YT.alertinfo('设置手势密码', 'setGesture:' + e);
			}
		},
		/**
		 * @description 验证手势密码<br>
		 *              接口名称：checkGesture <br>
		 * @param {}
		 *            conf = { callback : function(rsp){} }
		 */
		checkGesture : function(conf) {
			try {
				conf.callback = YT.getFunctionName(conf.callback);
				_callHandler("checkGesture", JSON.stringify(conf));
			} catch (e) {
				YT.alertinfo('验证手势密码', 'checkGesture:' + e);
			}
		},

		/**
		 * @ignore
		 * @description 弹出菜单层
		 * @param {array}
		 *            cfg 选择项的数组对象,每个元素包含 name ,func
		 * @example YT.showPopupWindow( [ { name: "修改别名", func:"App.modify()" }, {
		 *          name: "删除账户", func: "App.updateAlias()" }, { name: "设为默认账户",
		 *          func:"App.innerTrans()" } ]);
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
			try {
				_callHandler("showPopupWindow", JSON.stringify(list));
			} catch (e) {
				YT.alertinfo('开启弹出菜单层异常', 'showPopupWindow:' + e);
			}
		},
		/**
		 * @description 客户端缓存请求<br>
		 *              接口名称：getNativeCache <br>
		 * @param {url}
		 *            url 请求地址
		 * @param {string}
		 *            version 版本
		 * @param {string}
		 *            type 类型
		 * @param {string}
		 *            cacheType 缓存类型 1：存储客户端本地；0：临时缓存
		 * @param {json}
		 *            params 请求参数
		 * @param {function}
		 *            success 成功回调函数名称
		 * @param {function}
		 *            failure 失败回调函数名称
		 * @example YT.Client.getNativeCache('/mbank/login/login.do','1.1','finance',{p1:'x'},'success');
		 */
		getNativeCache : function(url, version, type, cacheType, params, success, failure) {
			try {
				if (YT.isEmpty(failure) || !YT.isFunction(failure)) {
					failure = function(rsp) {
						YT.hideWaitPanel();
						var msg = NS.MSG.MsgAjaxError;
						if (rsp && !YT.isEmpty(rsp.MSG)) {
							msg = rsp.MSG;
						}
						YT.alertinfo(msg);
						// YT.alertinfo(NS.MSG.MsgAjaxError);
					}
				}
				var cfg = {
					url : url,
					version : version,
					type : type,
					cacheType : cacheType,
					params : params,
					success : function(rpdata) {
						if (rpdata.STATUS == '005') {// 判断用户session是否超时
//							YT.sessionTimeout();
							return false;
						} else if (rpdata.STATUS == '006') { // 重复提交
							YT.hideWaitPanel();
							YT.alertinfo('' + rpdata.MSG);
							return false;
						} else if (rpdata.STATUS != '1') { // 状态码非成功状态
							// YT.hideWaitPanel();
							// YT.alertinfo('' + rpdata.MSG);
							failure && failure(rpdata);
							return false;
						}
						success && success(rpdata);
					},
					failure : failure
				}
				cfg.success = YT.getFunctionName(cfg.success);
				cfg.failure = YT.getFunctionName(cfg.failure);
				_callHandler("getNativeCache", JSON.stringify(cfg));
			} catch (e) {
				YT.alertinfo('调用缓存请求通讯组件异常', 'getNativeCache:' + e);
			}
		},
		/**
		 * @description 首页页面跳转<br>
		 *              接口名称：openMenuFunc <br>
		 * @param {string}
		 *            cfg.type 页面类型 N-原生；H-H5页面
		 * @param {string}
		 *            cfg.isLogin 是否登录：Y-需登录;N-不需登录
		 * @param {string}
		 *            cfg.menuId 菜单id：type为“N”时，必需，原生菜单的id
		 * @param {string}
		 *            cfg.url 跳转地址，type为“H”时，必需，H5跳转页面的半地址
		 * @example YT.Client.openMenuPage(cfg);
		 */
		openMenuPage : function(cfg) {
			try {
				if (YT.isEmpty(cfg.type)) {
					YT.alertinfo('菜单未配置！', '提示');
					return;
				}
				_callHandler("openMenuFunc", JSON.stringify(cfg));
			} catch (e) {
				YT.alertinfo('Web首页跳转组件异常', 'openMenuFunc:' + e);
			}
		},
		/**
		 * @description 银行卡扫描Ocr<br>
		 *              接口名称：clientOcr <br>
		 * @param {function}
		 *            callback 回调函数
		 * @example YT.Client.scanBankCardOCR(callback);
		 */
		scanBankCardOCR : function(callback) {
			try {
				callback = YT.getFunctionName(callback);
				var cfg = {
					ocrType : 'scanBankCard',
					callback : callback,
				};
				_callHandler("clientOcr", JSON.stringify(cfg));
			} catch (e) {
				YT.alertinfo('调用银行卡扫描组件异常', 'scanBankCardOCR:' + e);
			}
		},
		/**
		 * @description 身份证正面扫描Ocr<br>
		 *              接口名称：clientOcr <br>
		 * @param {function}
		 *            callback 回调函数
		 * @example YT.Client.scanIDCardFrontOCR(callback);
		 */
		scanIDCardFrontOCR : function(callback) {
			try {
				callback = YT.getFunctionName(callback);
				var cfg = {
					ocrType : 'scanIDCardFront',
					callback : callback,
				};
				_callHandler("clientOcr", JSON.stringify(cfg));
			} catch (e) {
				YT.alertinfo('调用身份证正面扫描组件异常', 'scanIDCardFrontOCR:' + e);
			}
		},
		/**
		 * @description 身份证背面扫描Ocr<br>
		 *              接口名称：clientOcr <br>
		 * @param {function}
		 *            callback 回调函数
		 * @example YT.Client.scanIDCardBackOCR(callback);
		 */
		scanIDCardBackOCR : function(callback) {
			try {
				callback = YT.getFunctionName(callback);
				var cfg = {
					ocrType : 'scanIDCardBack',
					callback : callback,
				};
				_callHandler("clientOcr", JSON.stringify(cfg));
			} catch (e) {
				YT.alertinfo('调用身份证背面扫描组件异常', 'scanIDCardBackOCR:' + e);
			}
		},
		/**
		 * @description 行驶证正面扫描Ocr<br>
		 *              接口名称：clientOcr <br>
		 * @param {function}
		 *            callback 回调函数
		 * @example YT.Client.scanVehicleLicenceFrontOCR(callback);
		 */
		scanVehicleLicenceFrontOCR : function(callback) {
			try {
				callback = YT.getFunctionName(callback);
				var cfg = {
					ocrType : 'scanVehicleLicenceFront',
					callback : callback,
				};
				_callHandler("clientOcr", JSON.stringify(cfg));
			} catch (e) {
				YT.alertinfo('调用行驶证正面扫描组件异常', 'scanVehicleLicenceFrontOCR:' + e);
			}
		},
		/**
		 * @description 行驶证反面扫描Ocr<br>
		 *              接口名称：clientOcr <br>
		 * @param {function}
		 *            callback 回调函数
		 * @example YT.Client.scanVehicleLicenceBackOCR(callback);
		 */
		scanVehicleLicenceBackOCR : function(callback) {
			try {
				callback = YT.getFunctionName(callback);
				var cfg = {
					ocrType : 'scanVehicleLicenceBack',
					callback : callback,
				};
				_callHandler("clientOcr", JSON.stringify(cfg));
			} catch (e) {
				YT.alertinfo('调用行驶证反面扫描组件异常', 'scanVehicleLicenceBackOCR:' + e);
			}
		},
		/**
		 * @description 营业执照扫描Ocr<br>
		 *              接口名称：clientOcr <br>
		 * @param {function}
		 *            callback 回调函数
		 * @example YT.Client.scanBusinessLicenceOCR(callback);
		 */
		scanBusinessLicenceOCR : function(callback) {
			try {
				callback = YT.getFunctionName(callback);
				var cfg = {
					ocrType : 'scanBusinessLicence',
					callback : callback,
				};
				_callHandler("clientOcr", JSON.stringify(cfg));
			} catch (e) {
				YT.alertinfo('调用营业执照扫描组件异常', 'scanBusinessLicenceOCR:' + e);
			}
		},
		/**
		 * @description 获取客户端信息<br>
		 *              接口名称：getClientInfo <br>
		 * @param {function}
		 *            callback 回调函数
		 * @example YT.Client.getClientInfo(callback);
		 */
		getClientInfo : function(callback) {
			try {
				callback = YT.getFunctionName(callback);
				var cfg = {
					callback : callback,
				};
				_callHandler("getClientInfo", JSON.stringify(cfg));
			} catch (e) {
				YT.alertinfo('获取客户端信息组件异常', '_getClientInfo:' + e);
			}
		},

		getImageCode : function(url, callback) {
			try {
				var funcName = YT.getFunctionName(callback);
				var cfg = {
					url : url,
					callback : funcName
				};
				_callHandler("imageCode", JSON.stringify(cfg));
			} catch (e) {
				YT.alertinfo('调用客户端获取验证码组件异常', '_getImageCode:' + e);
			}
		}
	};

	/**
	 * @private
	 * @description 将客户端返回文本 JSON 转成对象 JSON
	 */
	function jsonCallback(callback) {
		return YT.getFunctionName(function(data) {
			callback && callback(YT.isString(data) ? YT.evalJson(data) : data);
		});
	}
	;
	/**
	 * @private
	 * @description 回显密码
	 * @param {json}
	 *            jsonData 密文与显号 eg.{passVal:"12FABC123",showVal:"******"}
	 */
	W._savePwd = function(jsonData) {
		try {
			if (YT.isString(jsonData)) {
				jsonData = YT.JsonEval(jsonData);
			}
			var passVal = jsonData.passVal;
			var showVal = jsonData.showVal;
			var passMd5 = jsonData.passMd5;
			var cfg = _WK_DATAS["PwdPick"];
			var curObj = cfg.ele;
			var transAuth = cfg.transAuth;
			var transAuthLj = cfg.transAuthLj;
			if (YT.isEmpty(passVal) || YT.isEmpty(showVal)) {
				curObj.attr("data-value", "").attr("data-passMd5", "").val("");
				// 交易认证专用
				if (!YT.isEmpty(transAuth) && transAuth == "true") {
					YT.AuthBox.TPwdCallBack(curObj);
				}
				if (!YT.isEmpty(transAuthLj) && transAuthLj == "true") {
					YT.AuthBoxLj.TPwdCallBack(curObj);
				}
				return;
			}
			curObj.attr("data-value", passVal); // 密文
			curObj.attr("data-passMd5", passMd5); // 密码校验串
			curObj.val(showVal); // 星号
			curObj.attr("data-random", cfg.random); // 加密因子
			// 交易认证专用
			if (!YT.isEmpty(transAuth) && transAuth == "true") {
				YT.AuthBox.TPwdCallBack(curObj);
			}
			if (!YT.isEmpty(transAuthLj) && transAuthLj == "true") {
				YT.AuthBoxLj.TPwdCallBack(curObj);
			}
		} catch (e) {
			YT.alertinfo("回显密码", "PwdPick，" + e);
		}
	};
	/**
	 * @private
	 * @description 回显日期
	 * @param {json}
	 *            data 控件选择的的日期 默认格式 yyyy-MM-dd 或 yyyy-MM
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
	 * @param {json}
	 *            data 键盘输入的值
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
	 * @param {josn}
	 *            data 键盘输入的值
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
	 * @param {json}
	 *            data 键盘输入的值
	 */
	W._saveIDC = function(data) {
		var cfg = _WK_DATAS["IDCPick"];
		var curObj = cfg.ele;
		curObj.val(data);
		curObj.trigger("change");
		curObj.trigger("input");
	};
})();
