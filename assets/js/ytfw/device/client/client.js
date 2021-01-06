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
 * 19.返回首页 gotoClientIndex gotoIndex
 * 
 * 20.返回上一页 gotoClientBack gotoBack
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

	var ICONS = {
		"返回": "back",
		"查询": "query",
		"筛选": "filter",
		"列表": "list",
		"收藏": "collect",
		"已收藏": "collected",
		"头像": "head",
		"分享": "share",
		"新增": "add",
		"首页": "home",
		"搜索": "search",
		"通讯录": "book",
		"我的预约": "myOrder",
		"事件": "remindData"
	};
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
						exist: "true",
						name: name,
						icon: ICONS[name] || "",
						sort: ((i - 1) / 2),
						func: func
					});
				} else {
					break;
				}
				i += 2;
			}
			return ary[0];
		}
		return {
			exist: "false"
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
		callHandler: function(funcName, jsonData) {
			_callHandler(funcName, jsonData);
		},
		/**
		 * @final
		 * @description 判断是否为浏览器进入
		 */
		isWeb: false,
		/**
		 * @private
		 * @description 获取页面标题
		 * 
		 * @param {string}
		 *            pageId 页面唯一标识
		 * @returns {*} 页面标题配置项
		 */
		_getPageTitle: function(pageId) {
			var page = $(pageId);
			var cfg = {
				title: page.attr("title")
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
		 * @param {element}
		 *            page 需要初始化的元素节点
		 * @example pageA.attr('data-btnRight','true|完成|demo_case_list_10.finish()');
		 *          YT.Client.initPageTitle(pageA);
		 */
		initPageTitle: function(pageId) {
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
		alertinfo: function(msg, title, okAct, okName) {
			try {
				okAct = YT.getFunctionName(okAct);
				if (okAct && okAct.substr(okAct.length - 1) != ")") {
					okAct = okAct + "()";
				}
				title = title || "温馨提示";
				okName = okName || "确定";
				var cfg = {
					title: title,
					msg: msg,
					ok_text: okName,
					ok_func: okAct || "",
					type: "ALERT"
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
		confirm: function(msg, title, okAct, cancleAct, okName, cancleName) {
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
					title: title,
					msg: msg,
					ok_text: okName,
					ok_func: okAct || "",
					cancel_text: cancleName,
					cancel_func: cancleAct || "",
					type: "CONFIRM"
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
		openWaitPanel: function(msg) {
			try {
				var cfg = {
					msg: msg,
					touchable: 'false',
					type: 'OPEN'
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
		hideWaitPanel: function(timeout) {
			try {
				var cfg = {
					type: 'CLOSE'
				};
				setTimeout(function() {
					_callHandler("hideWaitPanel", JSON.stringify(cfg));
				}, timeout);
			} catch (e) {
				YT.alertinfo('关闭等待层异常', 'hideWaitPanel:' + e);
			}
		},
		/**
		 * @private
		 * @description 显示金额键盘(调用方法不需要在input里面加入)
		 * @param {Object}
		 *            $obj input的dom对象
		 * @example &lt; input type="money" type-keyboard="Money" id="amt"
		 *          data-maxlength="10" readOnly>; input里面的id必填 readonly必填 data-min
		 *          最小值 data-max 最大值 type-keyboard="Money"x
		 */
		showMoneyPicker: function($obj) {
			try {
				var input_val = YT.Format.unfmtAmt($obj.val());
				if (input_val != "0.00" && input_val != "") {
					input_val = (input_val * 1) + "";
				} else {
					input_val = "";
				}
				var cfg = {
					text: input_val,
					len: $obj.attr("data-maxlength") || '9',
					type: "MONEY",
					callback: "_saveMoney"
				};
				// 调用键盘页面上滑处理
				YT.Client.showKeyBoard($obj);
				_callHandler("showMoneyKeyboard", cfg);
				var wk = {
					ele: $obj
				};
				_WK_DATAS["moneyPick"] = YT.apply(wk, cfg);
			} catch (e) {
				YT.alertinfo('显示金额键盘', 'showMoneyPicker=' + e);
			}
		},
		/**
		 * @private
		 * @description 显示交易密码安全键盘(调用方法不需要在input里面加入) 密码键盘 1. 16位加密因子 2.
		 *              回调方法需要传递2个参数，在不隐藏键盘时调用回调函数不需要密文，写死为“1”，为了前端做判断用，隐藏键盘时回调需要返回密文与星号。
		 *              3. 密码加密规则为一输入一次迭代加密一次，在隐藏键盘时，客户端瞬间解密再进行AES加密
		 * @param {dom}
		 *            $obj input的dom对象
		 * @example <input type="password" data-keyboard="TPWD" id="pwd" readOnly/>;
		 *          readonly必填 data-keyboard="TPWD"
		 */
		showTPwdPicker: function($obj) {
			try {
				var rdm = Fw.getRandom(16);
				var cfg = {
					len: $obj.attr("data-len") || '6',
					transAuth: $obj.attr("data-transAuth"),
					random: rdm,
					type: "TPWD",
					callback: "_savePwd"
				}
				// 调用键盘页面上滑处理
				YT.Client.showKeyBoard($obj);
				_callHandler("showTPwdKeyboard", cfg);
				var wk = {
					ele: $obj
				};
				_WK_DATAS["PwdPick"] = YT.apply(wk, cfg);
			} catch (e) {
				YT.alertinfo("显示交易密码安全键", "showTPwdPicker=" + e);
			}
		},
		/**
		 * @private
		 * @description 显示日期键盘(调用方法不需要在input里面加入)
		 * @param {Object}
		 *            $obj input的dom对象
		 * @example &lt; input type="date" id="startDate" data-min="2014-11-13"
		 *          data-max="2015-11-13" data-format="yyyy-MM-dd"
		 *          type-keyboard="Date" data-endId="endDate" value="2014-11-15"
		 *          readOnly>; &lt; input type="date" id="endDate"
		 *          data-min="2014-11-13" data-max="2015-11-13"
		 *          data-format="yyyy-MM-dd" type-keyboard="Date"
		 *          data-startId="startDate" value="2014-11-15" readOnly>;
		 *          input里面的id必填 readonly必填 type="date" data-min 最小日期 data-max 最大日期
		 *          data-format 日期格式化 type-keyboard="Date"x
		 */
		showDatePicker: function($obj) {
			try {
				var val = $obj.val() || new Date().format("yyyy-MM-dd");
				var format = $obj.attr("data-format") || "yyyy-MM-dd";
				var min = new Date(val.substring(0, 4) * 1 - 99 + "-01-01").format(format);
				var max = new Date(val.substring(0, 4) * 1 + 99 + "-12-31").format(format);
				var cfg = {
					text: val,
					format: $obj.attr("data-format") || "yyyy-MM-dd",
					min: min,
					max: max,
					callback: "_saveDate"
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
					ele: $obj
				};
				_WK_DATAS["datePick"] = YT.apply(wk, cfg);
			} catch (e) {
				YT.alertinfo('显示日期键盘', 'showDatePicker=' + e);
			}
		},
		/**
		 * @private
		 * @description 显示纯数字键盘(调用方法不需要在input里面加入)
		 * @param {Object}
		 *            $obj input的dom对象
		 * @example &lt; input type="text" type-keyboard="Number" id="mobile"
		 *          data-len="11" readOnly>; input里面的id必填 readonly必填
		 *          type-keyboard="Number"
		 */
		showNumPicker: function($obj, cfg) {
			try {
				var cfg = {
					text: $obj.val(),
					len: $obj.attr("data-maxlength") || '19',
					type: "NUMBER",
					callback: "_saveNumber"
				}
				// 调用键盘页面上滑处理
				YT.Client.showKeyBoard($obj);
				_callHandler("showNumberKeyboard", cfg);
				var wk = {
					ele: $obj
				};
				_WK_DATAS["numberPick"] = YT.apply(wk, cfg);
			} catch (e) {
				YT.alertinfo('显示纯数字键盘', "showNumPicker=" + e);
			}
		},
		/**
		 * @private
		 * @description 显示身份证键盘(调用方法不需要在input里面加入)
		 * @param {Object}
		 *            $obj input的dom对象
		 * @example &lt; input type="text" id="identity" data-keyboard="IDC"
		 *          data-minlength="16" data-maxlength="18" readOnly>; input里面的id必填
		 *          readonly必填 type-keyboard="IDC"
		 */
		showIDCPicker: function($obj, cfg) {
			try {
				var cfg = {
					id: $obj.attr("id"),
					text: $obj.val(),
					len: $obj.attr("data-maxlength") || '18',
					type: "IDC",
					callback: "_saveIDC"
				}
				// 调用键盘页面上滑处理
				YT.Client.showKeyBoard($obj);
				_callHandler("showIDCKeyboard", cfg);
				var wk = {
					ele: $obj
				};
				_WK_DATAS["IDCPick"] = YT.apply(wk, cfg);
			} catch (e) {
				YT.alertinfo('显示身份证键盘', "showIDCPicker=" + e);
			}
		},
		/**
		 * @private
		 * @description 显示登录密码安全键盘(调用方法不需要在input里面加入) 密码键盘 1. 16位加密因子 2.
		 *              回调方法需要传递2个参数，在不隐藏键盘时调用回调函数不需要密文，写死为“1”，为了前端做判断用，隐藏键盘时回调需要返回密文与星号。
		 *              3. 密码加密规则为一输入一次迭代加密一次，在隐藏键盘时，客户端瞬间解密再进行AES加密
		 * @param {dom}
		 *            $obj input的dom对象
		 * @example &lt;input type="password" data-keyboard="LPWD" id="pwd"
		 *          readOnly>; input里面的id必填 readonly必填 data-keyboard="LPWD"
		 */
		showLPwdPicker: function($obj) {
			try {
				var rdm = Fw.getRandom(16);
				var cfg = {
					id: $obj.attr("id"),
					len: $obj.attr("data-maxlength") || '16',
					random: rdm,
					type: "LPWD",
					callback: "_savePwd"
				};
				// 调用键盘页面上滑处理
				YT.Client.showKeyBoard($obj);
				_callHandler("showLPwdKeyboard", cfg);
				var wk = {
					ele: $obj
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
		showKeyBoard: function(thizz) {
			YT._preShowKeyBoard(thizz);
		},
		/**
		 * @description 打开手机电话薄<br>
		 *              接口名称：showAddressBook <br>
		 * @param {function}
		 *            callback 回调函数名称
		 * @example YT.Client.openPhoneBook(callback);
		 */
		openPhoneBook: function(callback) {
			try {
				callback = YT.getFunctionName(callback);
				var cfg = {
					'callback': callback
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
		sendSms: function(phoneNo) {
			try {
				var cfg = {
					phoneNo: phoneNo
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
		callPhone: function(phoneNo) {
			try {
				var cfg = {
					phoneNo: phoneNo
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
		sessionTimeout: function(msg, title, okName) {
			try {
				title = title || "温馨提示";
				msg = msg || "会话超时，请重新登录";
				okName = okName || "确定";
				var cfg = {
					title: title,
					msg: msg,
					ok_text: okName,
					type: "TIMEOUT"
				};
				_callHandler("sessionTimeout", JSON.stringify(cfg));
			} catch (e) {
				YT.alertinfo('session超时', "sessionTimeout:" + e)
			}
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
		resetLoginSession: function(user, callback) {
			try {
				// 获取回调函数方法名
				callback = YT.getFunctionName(callback);
				var cfg = {
					"SESS_LOGIN": user,
					callback: callback
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
		getSession: function(sessKey, callback, cacheType) {
			try {
				// 获取回调函数方法名
				callback = YT.getFunctionName(callback);
				var cfg = {
					"SESS_KEY": sessKey,
					callback: callback,
					"cacheType": cacheType
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
		setSession: function(sessKey, sessData, cacheType) {
			try {
				var cfg = {
					"SESS_KEY": sessKey,
					"SESS_DATA": sessData,
					"cacheType": cacheType
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
		post: function(url, params, success, failure) {
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
					url: url,
					params: params,
					success: function(rpdata) {
						YT.log.debug(rpdata);
						if (rpdata.STATUS == '1') {
							YT._SESSION_TIMEOUT = false;
							success && success(rpdata);
						} else {
							if (rpdata.STATUS == '005') { // 判断用户session是否超时
								if (YT._SESSION_TIMEOUT !== true) { // 多个请求一起发送时，只提示一个sessionTimeout
									YT.hideWaitPanel();
									YT.Client.sessionTimeout();
									YT._SESSION_TIMEOUT = true;
								}
							} else if (rpdata.STATUS == '006') { // 重复提交
								YT.hideWaitPanel();
								YT.alertinfo('' + rpdata.MSG);
							} else { // 状态码非成功状态
								failure && failure(rpdata);
							}
						}
						YT.Collection.timeUrl(url, rpdata ? (rpdata.STATUS || '120') : '120');
					},
					failure: function(rpdata) {
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
		mock: function(cfg) {
			$.getScript(cfg.url).done(function(data) {
				cfg.success(Mock.mock(YT.JsonEval(data)));
			}).fail(function() {
				YT.hideWaitPanel();
				YT.alertinfo('mock数据不存在')
			})
		},
		/**
		 * @description 返回系统首页<br>
		 *              接口名称：gotoClientIndex <br>
		 * @example YT.Client.gotoClientIndex();
		 */
		gotoClientIndex: function() {
			try {
				_callHandler("gotoIndex", {});
			} catch (e) {
				YT.alertinfo('返回系统首页异常', 'gotoClientIndex:' + e);
			}
		},
		/**
		 * @description 返回上一页<br>
		 * 				接口名称： gotoClientBack < br >
		 * @example YT.Client.gotoClientBack();
		 */
		gotoClientBack: function() {
			try {
				_callHandler("gotoBack", {});
			} catch (e) {
				YT.alertinfo('返回上一页异常', 'gotoClientBack:' + e);
			}
		},
		/**
		 * @description 返回登录页<br>
		 * 				接口名称： gotoClientLogin < br >
		 * @example YT.Client.gotoClientLogin();
		 */
		gotoClientLogin: function(callback) {
			try {
				_callHandler("gotoLogin", {});
			} catch (e) {
				YT.alertinfo('返回登录页异常', 'gotoClientLogin:' + e);
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
		geneQRC: function(data, callback) {
			try {
				// 获取回调函数方法名
				callback = YT.getFunctionName(callback);
				var cfg = {
					data: JSON.stringify(data),
					callback: callback,
				};
				_callHandler("geneQRC", JSON.stringify(cfg));
			} catch (e) {
				YT.alertinfo('二维码生成异常', 'geneQRC:' + e);
			}
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
		showPopuMenus: function(cfg, panel, app) {
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
			YT.Popup.initPopuMenus(panel, app, list);
		},
		/**
		 * @description 二维码扫一扫<br>
		 *              接口名称：sweepQRC <br>
		 * @param {function}
		 *            callback 回调函数名称
		 * @example YT.Client.sweepQRC(callback);
		 */
		sweepQRC: function(callback) {
			try {
				// 获取回调函数方法名
				callback = YT.getFunctionName(callback);
				var cfg = {
					callback: callback,
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
		sharePages: function(data, callback) {
			try {
				// 获取回调函数方法名
				callback = YT.getFunctionName(callback);
				var cfg = {
					type: data.type, // 分享渠道
					// WX-微信，PYQ-朋友圈，QQ-qq，WB-微博，DX-短信，YX-邮箱
					title: data.title, // 分享标题
					content: data.content, // 分享摘要
					hrefUrl: data.hrefUrl, // 分享url地址
					imgUrl: data.imgUrl, // 分享图片url地址
					callback: callback, // 回调函数
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
		shareReceipt: function(type, callback) {
			try {
				// 获取回调函数方法名
				callback = YT.getFunctionName(callback);
				var cfg = {
					type: type,
					callback: callback
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
		setCollection: function(data) {
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
		openMobilePhoto: function(data, callback) {
			try {
				data.type = 'photo'; // 相册的type值
				data.COMP_RATE = data.COMP_RATE ? data.COMP_RATE : '0.5'; // 默认值
				// 获取回调函数方法名
				callback = YT.getFunctionName(callback);
				var cfg = {
					data: data,
					callback: callback
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
		openMobileCamera: function(data, callback) {
			try {
				data.type = 'camera'; // 相册和拍照的type值
				data.COMP_RATE = data.COMP_RATE ? data.COMP_RATE : '0.5'; // 默认值
				// 获取回调函数方法名
				callback = YT.getFunctionName(callback);
				var cfg = {
					data: data,
					callback: callback
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
		openMobilePhotoAlbum: function(data, callback) {
			try {
				data.type = 'photoAlbum'; // 相册和拍照的type值
				data.COMP_RATE = data.COMP_RATE ? data.COMP_RATE : '0.5'; // 默认值
				// 获取回调函数方法名
				callback = YT.getFunctionName(callback);
				var cfg = {
					data: data,
					callback: callback
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
		location: function(callback) {
			try {
				callback = YT.getFunctionName(callback);
				var json = {
					"callback": callback
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
		fingerOpenState: function(conf) {
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
		setFinger: function(conf) {
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
		checkFinger: function(conf) {
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
		setGesture: function(conf) {
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
		checkGesture: function(conf) {
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
		showPopupWindow: function(cfg, panel, app) {
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
		getNativeCache: function(url, version, type, cacheType, params, success, failure) {
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
					url: url,
					version: version,
					type: type,
					cacheType: cacheType,
					params: params,
					success: function(rpdata) {
						if (rpdata.STATUS == '005') { // 判断用户session是否超时
							YT.Client.sessionTimeout();
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
					failure: failure
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
		openMenuPage: function(cfg) {
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
		scanBankCardOCR: function(callback) {
			try {
				callback = YT.getFunctionName(callback);
				var cfg = {
					ocrType: 'scanBankCard',
					callback: callback,
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
		 * @example YT.scanIDCardFrontOCR(function(rst){...},event,{});
		 * 回调函数参数属性配置：
		 * rst.OCR_INFO.IDN_NO 身份证号码
		 * rst.OCR_INFO.NAME 姓名
		 * rst.OCR_INFO.SEX 性别
		 * rst.OCR_INFO.NATION_CODE 民族
		 * rst.OCR_INFO.BIRTH_DAY 出生日期
		 * rst.OCR_INFO.ADDR 地址
		 * rst.img1Base64 身份证正面照片
		 * rst.img2Base64 身份证头像照片
		 */
		scanIDCardFrontOCR: function(callback) {
			try {
				callback = YT.getFunctionName(callback);
				var cfg = {
					ocrType: 'scanIDCardFront',
					callback: callback,
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
		 * @example YT.scanIDCardBackOCR(function(rst){...},event,{});
		 * 回调函数参数属性配置：
		 * rst.OCR_INFO.ORG 签发机构
		 * rst.OCR_INFO.IDN_DATE 证件有限期
		 * rst.img1Base64 身份证背面照片
		 */
		scanIDCardBackOCR: function(callback) {
			try {
				callback = YT.getFunctionName(callback);
				var cfg = {
					ocrType: 'scanIDCardBack',
					callback: callback,
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
		 * @example YT.scanVehicleLicenceFrontOCR(function(rst){...},event,{});
		 * 回调函数参数属性配置：
		 * rst.OCR_INFO.PLATE_NO 车牌号
		 * rst.OCR_INFO.VEHICLE_TYPE  车辆类型
		 * rst.OCR_INFO.OWNER 所有人
		 * rst.OCR_INFO.ADDR 地址
		 * rst.OCR_INFO.MODEL 品牌类型
		 * rst.OCR_INFO.VIN 车辆识别代号
		 * rst.OCR_INFO.ENGINE_NO 发动机号码
		 * rst.OCR_INFO.REGI_DATE 注册日期
		 * rst.OCR_INFO.ISSUE_DATE 发证日期
		 * rst.OCR_INFO.USE_CHAR 使用性质
		 * rst.img1Base64 行驶证正面照片
		 */
		scanVehicleLicenceFrontOCR: function(callback) {
			try {
				callback = YT.getFunctionName(callback);
				var cfg = {
					ocrType: 'scanVehicleLicenceFront',
					callback: callback,
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
		 * @example YT.scanVehicleLicenceBackOCR(function(rst){...},event,{});
		 * 回调函数参数属性配置：
		 * rst.OCR_INFO 车牌号
		 * rst.img1Base64 行驶证背面照片
		 */
		scanVehicleLicenceBackOCR: function(callback) {
			try {
				callback = YT.getFunctionName(callback);
				var cfg = {
					ocrType: 'scanVehicleLicenceBack',
					callback: callback,
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
		 * @example YT.scanBusinessLicenceOCR(function(rst){...},event,{});
		 * 回调函数参数属性配置：
		 * rst.OCR_INFO 统一社会信用代码识别
		 */
		scanBusinessLicenceOCR: function(callback) {
			try {
				callback = YT.getFunctionName(callback);
				var cfg = {
					ocrType: 'scanBusinessLicence',
					callback: callback,
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
		getClientInfo: function(callback) {
			try {
				callback = YT.getFunctionName(callback);
				var cfg = {
					callback: callback,
				};
				_callHandler("getClientInfo", JSON.stringify(cfg));
			} catch (e) {
				YT.alertinfo('获取客户端信息组件异常', '_getClientInfo:' + e);
			}
		},

		getImageCode: function(url, callback) {
			try {
				var funcName = YT.getFunctionName(callback);
				var cfg = {
					url: url,
					callback: funcName
				};
				_callHandler("imageCode", JSON.stringify(cfg));
			} catch (e) {
				YT.alertinfo('调用客户端获取验证码组件异常', '_getImageCode:' + e);
			}
		},
		// 加载离线包内容
		getModuleContent: function(params, callback) {
			var cfg = YT.Client.buildOflCfg(params, callback);
			_callHandler("getModuleContent", JSON.stringify(cfg));
		},
		// 离线包跳转
		nextPageNative: function(params, callback) {
			var cfg = YT.Client.buildOflCfg(params, callback);
			if (Device.os == 'android') {
				_callHandler("getModuleContent", JSON.stringify(cfg));
			} else {
				_callHandler("nextPageNative", JSON.stringify(cfg));
			}
		},
		// 构建离线包所需参数
		buildOflCfg: function(params, callback) {
			var path = params.url;
			var OFF_LINE = params.OFF_LINE;
			if (YT.isEmpty(path)) {
				return;
			}
			var end = path.indexOf('?');
			end = end > -1 ? end : path.length;
			path = path.substr(0, end);
			var moduleId = path.split('/', 2).join('_')
			var fileName = path.replace(/(.+)\//, '')
			var funcName = YT.getFunctionName(callback);
			return {
				MODULE_ID: moduleId, // page_02
				OFF_LINE: OFF_LINE,
				APP_NAME: YT.APP_NAME || 'ares-web-h5', // ares-web-h5
				FILE_NAME: fileName, // 01_tpl_input.html
				FILE_PATH: path, // page/02/0203/01_tpl_input.html
				CALLBACK: funcName
			}
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
				if (Device.YiTong !== true) {
					sessionStorage.setItem(key, data);
					resolve('success')
				} else {
					var func = function() {
						resolve('success')
					}
					var funcName = YT.getFunctionName(func);
					var cfg = {
						key,
						data,
						callback: funcName
					}
					_callHandler("setStorage", JSON.stringify(cfg));
				}

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
				if (Device.YiTong !== true) {
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
				} else {
					var func = function(datas) {
						datas = YT.isEmpty(datas) ? '{}' : datas;
						if (clear === true) {
							YT.Client.removeStorage(key)
						}
						try{
							datas = JSON.parse(datas)
						}catch(e){
							YT.log.error(e)
						}
						resolve(datas)
					}
					var funcName = YT.getFunctionName(func);
					var cfg = {
						key,
						callback: funcName
					}
					_callHandler("getStorage", JSON.stringify(cfg));
				}
			})
		},
		// 根据key，清理存储
		removeStorage(key) {
			var cfg = {
				key
			}
			_callHandler("removeStorage", JSON.stringify(cfg));
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
	};
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
			if (YT.isEmpty(passVal) || YT.isEmpty(showVal)) {
				curObj.attr("data-value", "").attr("data-passMd5", "").val("");
				// 交易认证专用
				if (!YT.isEmpty(transAuth) && transAuth == "true") {
					YT.AuthBox.TPwdCallBack(curObj);
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