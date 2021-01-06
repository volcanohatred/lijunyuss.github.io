;
(function () {
	var TAG = "YT.AuthBox";
	var isInit = false,
		animated = false;
	var authBox;
	var authBoxList;
	var group_auth_type = '';
	var me = YT.AuthBox = {
		_authBoxId: "_authBox",
		init: function (func) {
			seajs.use('assets/css/func/auth.css', function () {
				isInit = true;
				func && func();
			});
		},
		/**
		 * 
		 * @param conf
		 *  var conf = {<br>
		 *  	tpl : '<div></div>',//模板<br>
		 *  	params: params, //填充模板信息<br>
		 *  	type: <br>//认证方式
		 *  		{
		 *  			1.查询(短信、UK、OTP)
		 *				2.取款密码
		 *				3.取款密码+安全认证方式(短信、UK、OTP)
		 *				4.查询(短信、UK、OTP[过滤掉短信认证])
		 *  		}
		 *  	success: App.success, //成功回调方法<br>
		 *  	error: App.error //失败回调方法<br>
		 *  }
		 */
		openAuthPanel: function (conf) {
			animated = false;
			if (!isInit) {
				me.init(function () {
					me.openAuthPanel(conf);
				});
				return false;
			}
			me.hideAuthPanel();
			this._conf = conf;
			var tpl = conf.tpl ? conf.tpl : "";
			var layer = document.createElement("div");
			document.body.appendChild(layer);
			layer.id = this._authBoxId;
			var params = conf.params;
			var html_tpl =
				'<div class="yui-auth-layer">' +
				'<div class="yui-auth-panel">' +
				'<div class="yui-auth-types">' +
				'<div class="yui-auth-types-header">' +
				'<div class="yui-auth-header-back" data-event="authBack"></div>' +
				'<div>请选择认证方式</div>' +
				'</div>' +
				'{@each GROUP_AUTH_TYPE_LIST as item,index}' +
				'<p data-event="changeAuth" data-index="${index}" data-type="${item.GROUP_AUTH_TYPE}">' +
				'${item.GROUP_AUTH_NAME}' +
				'</p>' +
				'{@/each}' +
				'</div>' +
				'<div class="yui-auth-form auth-animated ">' +
				'<div class="yui-auth-close">' +
				'<i data-event="closeAuth"></i>' +
				'</div>' +
				tpl +
				'<div class="ui-form-item ui-form-item-r ui-border-b y-sms hidden auth-input" data-authtype="SMS">' +
				'<label class="ui-nowrap">验证码</label>' +
				'<input type="text" class="ui-padding-r65" maxlength="6" data-maxlength="6" data-keyboard="Number" readonly data-required="true" data-name="SMS" data-label="验证码" placeholder="请输入验证码"/>' +
				'<button type="button" class="ui-btn ui-btn-primary ui-border-l x-sms-send">获取验证码</button>' +
				'</div>' +
				'<div class="ui-form-item ui-border-b hidden auth-input" data-authtype="OTP">' +
				'<label class="ui-nowrap">动态令牌</label>' +
				'<input type="text" maxlength="6" data-maxlength="6" data-keyboard="Number" readonly data-required="true" data-name="OTP" data-label="动态令牌码" placeholder="请输入动态令牌码"/>' +
				'</div>' +
				'<div class="ui-form-item ui-border-b hidden auth-input" data-authtype="UK">' +
				'<label class="ui-nowrap">USBKEY</label>' +
				'<input type="text" maxlength="6" data-maxlength="6" data-keyboard="Number" readonly data-required="true" data-name="UK" data-label="USBKEY" placeholder="请输入USBKEY"/>' +
				'</div>' +
				'<div class="ui-form-item ui-border-b hidden auth-input" data-authtype="DC">' +
				'<label class="ui-nowrap">数字证书</label>' +
				'<input type="text" maxlength="6" data-maxlength="6" data-keyboard="Number" readonly data-required="true" data-name="DC" data-label="USBKEY" placeholder="请输入USBKEY"/>' +
				'</div>' +
				'<div class="ui-form-item ui-border-b hidden auth-input" data-authtype="GF">' +
				'<label class="ui-nowrap">指纹或人脸</label>' +
				'</div>' +
				'<div class="yui-auth-form-item hidden yui-auth-pwd auth-input" data-authtype="TPWD">' +
				'	<label class="ui-txt-info ui-txt-tips pwd_tips">请输入交易密码</label>' +
				'	<span class="pwd-container">' +
				'		<input type="password" data-keyboard="TPwd" maxlength="6" id="DRAW_TPWD" data-transAuth="true" data-name="TPwd" readonly data-label="交易密码" data-required="true" />' +
				'		<div class="sixDigitPassword" data-event="showKeyboard">' +
				'<i><b></b></i>' +
				'<i><b></b></i>' +
				'<i><b></b></i>' +
				'<i><b></b></i>' +
				'<i><b></b></i>' +
				'<i><b></b></i>' +
				'</div>' +
				'</span>' +
				'</div>' +
				'<div class="yui-auth-form-item hidden yui-auth-pwd auth-input" data-authtype="CPWD">' +
				'	<label class="ui-txt-info ui-txt-tips pwd_tips">请输入卡密码</label>' +
				'	<span class="pwd-container">' +
				'		<input type="password" data-keyboard="TPwd" maxlength="6" id="DRAW_CPWD" data-transAuth="true" data-name="CPWD" readonly data-label="卡密码" data-required="true" />' +
				'		<div class="sixDigitPassword" data-event="showKeyboard">' +
				'<i><b></b></i>' +
				'<i><b></b></i>' +
				'<i><b></b></i>' +
				'<i><b></b></i>' +
				'<i><b></b></i>' +
				'<i><b></b></i>' +
				'</div>' +
				'</span>' +
				'</div>' +
				'<div class="yui-auth-form-item ui-margin-t10">' +
				'<a class="ui-txt-success choiceAuth" data-event="choiceAuth">更换其他认证方式</a>' +
				'</div>' +
				'<div class="ui-btn-wrap ">' +
				'<button class="ui-btn-primary ui-btn-lg" data-event="submit">确认</button>' +
				'</div>' +
				'</div>' +
				'</div>' +
				'</div>';
			var params = conf.params ? conf.params : {};
			var _at = conf.type;
			me.qryAuthType(function (authList) {
				YT.hideWaitPanel();
				authBox = $(layer);
				authBoxList = authList;
				var json = {};
				YT.apply(json, params);
				json.GROUP_AUTH_TYPE_LIST = authList;
				authBox.html(YT.template(html_tpl, json));
				authBox.find('.y-sms').attr('data-tranCode', conf.tran_code);
				var authForm = authBox.find(".yui-auth-form");
				me.animatedT = setTimeout(function () {
					authForm.removeClass("auth-animated");
					animated = true;
				}, 900);
				YT.initPageEvent(authBox, me);
				YT.Form.initPanel(authBox, {}, me);
				var authData = authList[0].AUTH_TYPE_LIST;
				group_auth_type = authList[0].GROUP_AUTH_TYPE;

				me.showAuthItem(authData);

			});
		},
		//切换认证方式
		showAuthItem: function (authData) {
			var authForm = authBox.find(".yui-auth-form");
			$.each(authData, function (i, n) {
				var type = n.AUTH_TYPE;
				authForm.find('[data-authtype="' + type + '"]').show();
			})
		},
		authLayer: function (e) {
			if (!animated) {
				return false;
			}
			var ele = $(e.target);
			if (ele.hasClass('yui-auth-layer')) {
				if (me.closeT) {
					clearTimeout(me.closeT);
				}
				if (me.animatedT) {
					clearTimeout(me.animatedT);
				}
				me.closeAuth();
			}
		},
		showKeyboard: function (e) {
			var el = $(e.currentTarget);
			var pwd = el.prev();
			//active
			YT.Client.showTPwdPicker(pwd);
			YT._preShowKeyBoard(pwd);
		},
		TPwdCallBack: function (pwd) {
			var val = pwd.val();
			var dataVal = pwd.attr("data-value");
			var sixPwd = pwd.next();
			var ii = sixPwd.find('i');
			ii.find('b').css("visibility", "hidden");
			if (!YT.isEmpty(val)) {
				var len = val.length;
				for (var i = 0; i < len; i++) {
					var v = val.substring(i, i + 1);
					ii.eq(i).find('b').css("visibility", "visible");
				}
			}
		},
		hideAuthPanel: function (timeout) {
			this.removeDivId(this._authBoxId);
		},
		/**
		 * 关闭认证页面
		 */
		closeAuth: function () {
			authBox.find(".yui-auth-form").addClass("close-animated");
			me.closeT = setTimeout(function () {
				me.hideAuthPanel();
			}, 1000);
		},

		/**
		 * 提交
		 */
		submit: function () {
			var authInputs = authBox.find('.auth-input:not(:hidden)');
			if (!YT.Form.validator(authInputs)) {
				return false;
			}
			YT.openWaitPanel();
			var list = me.getAuthInfo(authInputs);
			var json = {
				GROUP_AUTH_TYPE: group_auth_type,
				AUTH_LIST: list
			}
			var url = me._conf.url;
			var params = YT.apply(json, me._conf.params);
			var failure = me._conf.failure;
			if (!YT.isEmpty(failure) && YT.isFunction(failure)) {
				YT.ajaxData(url, params, function (data) {
					YT.hideWaitPanel();
					if (data.STATUS == "1") {
						if (me._conf.success) {
							me.hideAuthPanel();
							me._conf.success(data);
						} else {
							me.hideAuthPanel();
						}
					} else {
						authBox.find('input').val('');
						var sixPwd = authBox.find('.sixDigitPassword')
						sixPwd.find('b').css("visibility", "hidden");
						if (me._conf.error) {
							me._conf.error(data);
						} else {
							YT.alertinfo(data.MSG);
						}
					}
				}, function () {
					YT.hideWaitPanel();
					failure();
				});
			} else {
				YT.ajaxData(url, params, function (data) {
					YT.hideWaitPanel();
					if (data.STATUS == "1") {
						if (me._conf.success) {
							me.hideAuthPanel();
							me._conf.success(data);
						} else {
							me.hideAuthPanel();
						}
					} else {
						authBox.find('input').val('');
						var sixPwd = authBox.find('.sixDigitPassword')
						sixPwd.find('b').css("visibility", "hidden");
						if (me._conf.error) {
							me._conf.error(data);
						} else {
							YT.alertinfo(data.MSG);
						}
					}
				});
			}
		},
		//获取认证信息
		getAuthInfo: function (authInputs) {
			var authList = [];
			authInputs.each(function () {
				var item = $(this);
				var type = item.attr('data-authtype');
				var val = item.find("input").attr("data-value") || item.find('input').val();
				authList.push({
					AUTH_TYPE: type,
					AUTH_PWD: val
				});
			});
			return authList;
		},
		removeDivId: function (divId) {
			var handle = document.getElementById(divId);
			if (handle) {
				handle.parentNode.removeChild(handle);
			}
		},
		//切换到选择认证方式界面
		choiceAuth: function () {
			authBox.find('.yui-auth-types').show();
			authBox.find('.yui-auth-form').hide();
		},
		//从选择认证方式界面返回
		authBack: function () {
			authBox.find('.yui-auth-types').hide();
			authBox.find('.yui-auth-form').show();
		},
		//修改认证方式
		changeAuth: function (e, ele) {
			var i = ele.attr('data-index');
			group_auth_type = ele.attr('data-type');
			var authData = authBoxList[i].AUTH_TYPE_LIST;
			var header = authBox.find('.yui-auth-types');
			header.find('p').removeClass('current');
			ele.addClass('current');
			var authInput = authBox.find('[data-authtype]');
			authInput.hide();
			me.showAuthItem(authData);
			authBox.find(".sixDigitPassword i b").css('visibility', 'hidden');
			authInput.find('input').val('');
			me.authBack();
		},
		/**
		 * 查询认证方式
		 * @param obj
		 * @param callback
		 */
		qryAuthType: function (callback) {
			var tramsAmt = me._conf.params.TRAN_AMT;
			var params = {
				AUTH_TRAN_CODE: me._conf.tran_code,
				TRAN_AMT: tramsAmt
			};
			var url = YT.dataUrl('transfer/authTypeQry', true);
			YT.ajaxData(url, params, function (data) {
				var defNum = 0;
				if (data.STATUS == '1') {
					var authList = data.GROUP_AUTH_TYPE_LIST;
					//					$.each(authList,function(i,n){
					//						var list = n.LIST;
					//						$.each(list, function(ii, nn) {
					//							var authType = nn.AUTH_TYPE;
					//							var authWayCn = "";
					//							switch (authType) {
					//							case "SMS":
					//								nn.AUTH_TYPE_CN = "短信动态密码";
					//								break;
					//							case "OTP":
					//								nn.AUTH_TYPE_CN = "动态令牌";
					//								break;
					//							case "UK":
					//								nn.AUTH_TYPE_CN = "蓝牙Key";
					//								break;
					//							case "DC":
					//								nn.AUTH_TYPE_CN = "数字证书";
					//								break;
					//							case "PW":
					//								nn.AUTH_TYPE_CN = "静态密码";
					//								break;
					//							case "GF":
					//								nn.AUTH_TYPE_CN = "指纹或人脸";
					//								break;
					//							default:
					//								break;
					//							}
					//						});
					//					});
					callback && callback(authList);
				}
			});
		}
	};
})();