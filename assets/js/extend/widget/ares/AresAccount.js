/**
 * <code>
 * AresAccount 账户类扩展组件，调用系统默认的下拉选择框
 * 
 * </code>
 */
define(function(require, exports) {
	var TAG = "AresAccount";
	YT.log.debug("---内部组件--init----", TAG);
	// 内部组件不提供外部调用支持
	var me = {};// me为当前控件的函数命名空间
	me.acctGroupTpl = [
			'<select class="x-p-acct" data-name="${dataName}">',
			'{@each LIST as item,index}',
			'<option value="${item.accountNo}" data-acctType="${item.ACCT_TYPE}">${item.accountNo|fmtAcctNo,true}</option>',
			'{@/each}', '</select>' ].join('');// 账户组模板
	me.acctCard = [
			'{@each LIST as item, index}',
			'<div class="ui-card ui-bf-fff x-acct-card">',
			'<div class="ui-card-header ui-card-line">',
			'<div class="ui-card-item">',
			'<i class="yui-cmbc-icon"></i>',
			'<label class="ui-txt-info ui-padding-l45">尾号(${item.accountNo|fmtAcctStop4,true})</label>',
			'<p class="ui-display-field ui-txt-success">${item.ACCT_TYPE|fmtNsType,"ACCT_TYPE_NAME"}</p></div></div>',
			'<div id="r-acct-card${index}" class="ui-card-section r-acct-card${index}">',
			'<div class="ui-card-item"><label class="ui-txt-info">${item.ACCT_ALIAS}</label>',
			'<p class="ui-display-field ui-txt-success">${item.accountStatus}</p></div></div>',
			'<div class="ui-card-footer"><ul class="ui-card-tab"><li>开启</li><li>移除卡片</li></ul></div>',
			'</div>', '{@/each}', ].join('');// 卡片列表
	/**
	 * <code>
	 * 初始化控件的事件、值、展现等信息
	 * 
	 * @param widget 当前组件
	 * @param panel 当前容器作用域，通常为page容器
	 * @param app 处理器
	 * @param json 数据处理
	 * </code>
	 */
	me.init = function(widget, panel, app, json) {
		YT.log.info('init begin');
		me.initAcctController(widget, panel, app, json);// 初始化账户选择控件
		me.initCardController(widget, panel, app, json);// 初始化卡片账户列表
		YT.log.info('init finish', TAG);
	};
	/**
	 * <code>
	 * 卡片账号选择
	 * 
	 * @param widget 当前组件
	 * @param panel 当前容器作用域，通常为page容器
	 * @param app 处理器
	 * @param json 数据处理
	 * </code>
	 */
	me.initCardController = function(widget, panel, app, json) {
		var ele = widget.find(".y-acct-card");
		if (ele.length < 1) {
			YT.log.info("ele ", ele.length);
			return;
		}
		var callback = ele.attr('data-callback');// 加载完成的回调函数
		var tplHtml = ele.attr('data-tplHtml');// 模板文件路径
		var acctTypes;// 账户类型
		if (json) {// 相关的参数赋值
			acctTypes = json.acctTypes;
		}
		function buildGroup(accts, tpl) {
			var html = YT.template(tpl, {
				dataName : ele.attr("data-field-name") || "ACCT",
				LIST : accts
			});
			ele.html(html);
			ele.attr("data-ready", "true");// 实例化完成
			callback && app[callback]();// 调用回调
		}
		function loadTplHtml(accts) {
			if (!YT.isEmpty(tplHtml)) {// 配置模板文件路径
				YT.getPage(tplHtml, {}, function(tpl_html) {
					buildGroup(accts, tpl_html);
				});
			} else {
				buildGroup(accts, me.acctCard);
			}
		}
		ele.attr("data-ready", "false");
		// 查询账户列表信息
		me.queryAccountList(loadTplHtml, acctTypes, json);
	};
	/**
	 * <code>
	 * 可选操作账号控件，可定制是否显示余额
	 * 
	 * @param widget 当前组件
	 * @param panel 当前容器作用域，通常为page容器
	 * @param app 处理器
	 * @param json 数据处理
	 *</code>
	 */
	me.initAcctController = function(widget, panel, app, json) {
		var ele = widget.find(".y-acct");// 获取列表元素
		if (ele.length < 1) {// 判断是否存在相关的账户组件
			YT.log.info("ele ", ele.length);
			return;
		}
		var acctTypes;// 账户类型
		var chooseAcct;// 默认选择账户
		if (json) {// 相关的参数赋值
			acctTypes = json.acctTypes;
			chooseAcct = json.chooseAcct;
		}
		var eventChange = ele.attr('data-change');// 下拉框选择回调函数
		var callback = ele.attr('data-callback');// 加载完成的回调函数
		var tplHtml = ele.attr('data-tplHtml');// 模板文件路径
		var isShowBal = ele.attr("data-amt") == "true"; // 是否显示余额
		if (isShowBal) {// 显示余额
			var item = panel.find(".r-amt-alive");
			item.removeClass("hidden");
		}
		var isShowAlias = ele.attr("data-alias") == "true"; // 是否显示别名
		function showBal(datas) {// 显示余额
			// TODO:余额的属性值，这个地方需要修改，并固定
			var bal = datas.accountBalance || datas.ACCT_BAL;
			panel.find(".r-amt-alive").find(".r-amt-alive-num").text(
					YT.Format.fmtAmt(bal));
			callback && app[callback](datas);// 调用回调
		}
		function balQuery() {// 查询账户余额
			var payAcct = ele.find(".x-p-acct");
			var acct = payAcct.find('option:selected').val();
			var type = payAcct.find('option:selected').attr('data-acctType');
			me.queryAccountInfo(acct, type, showBal);// 查询账户信息
		}
		function buildAcctGroup(accts, tplHtml) {// 生成账户组
			var html = YT.template(tplHtml, {
				dataName : ele.attr("data-field-name") || "ACCT",
				showBal : isShowBal,
				chooseAcct : chooseAcct,
				LIST : accts
			});
			ele.html(html);
			ele.attr("data-ready", "true");// 实例化完成
			isShowBal && balQuery();// 查询余额
			callback && app[callback]();// 调用回调
		}
		function loadTplHtml(accts) {
			if (!YT.isEmpty(tplHtml)) {// 配置模板文件路径
				YT.getPage(tplHtml, {}, function(tpl_html) {
					buildAcctGroup(accts, tpl_html);
				});
			} else {
				buildAcctGroup(accts, me.acctGroupTpl);
			}
		}
		ele.attr("data-ready", "false");
		// 查询账户列表信息
		me.queryAccountList(loadTplHtml, acctTypes, json);
		if (isShowBal) {// 显示余额
			ele.on('change', '.x-p-acct', balQuery);
		}
		if (!YT.isEmpty(eventChange)) {// 设置下拉选框change回调
			ele.find('.x-p-acct').attr('data-change', eventChange);
		}
	};
	/**
	 * 查询账户详情信息
	 */
	me.queryAccountInfo = function(acctNo, acctType, callback) {
		var url = YT.dataUrl('account/queryAcctInfo');//account/queryAcctInfo
		if (acctType) {
			if (acctType == NS.ACCT_TYPE.ELE) { // 电子账户
				url = YT.dataUrl('account/eleAcctInfoQuery');
			} else if (acctType == NS.ACCT_TYPE.CC) { // 信用卡
				url = YT.dataUrl('credit/creditCardInfoQuery');
			}
		}
		var params = {
			accountNo : acctNo
		}
		YT.ajaxData(url, params, function(rsp) {
			if (rsp.STATUS == '1') {
				callback && callback(rsp);
			} else {
				YT.alertinfo(rsp.MSG);
			}
		}, function(rsp) {
			YT.hideWaitPanel();
			YT.alertinfo(rsp.MSG);
		});
	}
	/**
	 * 过滤账户列表信息
	 */
	me.screenAccts = function(accts, types) {
		var tmpAccts = [];
		$.each(accts, function(i, n) {
			var type = n['ACCT_TYPE'];
			if (typeof types == 'string') {
				if (types == type) {
					tmpAccts.push(n);
				}
			} else {
				$.each(types, function(ind, t) {
					if (t == type) {
						tmpAccts.push(n);
					}
				});
			}
		});
		return tmpAccts;
	}
	/**
	 * 查询账户列表信息
	 */
	me.queryAccountList = function(callback, acctypes, json) {
		var url = YT.dataUrl("account/getAccListByType");
		var acctLists = []; // 账户列表
		var sessListStr = YT.BANK_ACCT_LIST;
		if (!YT.isEmpty(sessListStr)) {
			var sessList = YT.JsonEval(sessListStr);
			if (acctypes && acctypes.length > 0) {
				sessList = me.screenAccts(sessList, acctType);
			}
			callback && callback(sessList);
			return;
		}
		var params = json || {}
		YT.log.info("+++++++++++++++++++++++++++++++"+params)
		YT.log.info(params)
		YT.ajaxData(url, {"supportAccountNo":json.supportAccountNo}, function(rsp) {
			if (rsp.STATUS == '1') {
				acctLists = rsp.accountList;
				YT.BANK_ACCT_LIST = YT.JsonToStr(acctLists);
				if (acctypes && acctypes.length > 0) {
					acctLists = me.screenAccts(acctLists, acctypes);
				}
				if(YT.isEmpty(acctLists) || acctLists.length == 0){
					YT.confirm("暂未开通电子账户，是否立即开通","",function(){
//						var url = YT.dataUrl("general/queryUserName");		//获取当前用户名称
//						YT.openWaitPanel();
//						YT.ajaxData(url, {}, function(data) {
//							YT.hideWaitPanel();
						    rsp.acctListOpen = true;
							YT.nextPage("page/P05/05/P0505.html",rsp);
//						},function(err){
//							YT.hideWaitPanel();
//							YT.alertinfo(err.MSG);
//						});
					},function(){
						YT.prevPage();
					})
//					YT.alertinfo('暂无下挂账号');
				}else{
					callback && callback(acctLists);
				}
			} else {
				YT.hideWaitPanel();
				YT.alertinfo(rsp.MSG);
			}
		}, function(rsp) {
			YT.log.info("--------------------------------------++")
			YT.hideWaitPanel();
			YT.alertinfo(rsp.MSG);
		});
	};
	/**
	 * <code>
	 * 重置控件的值、展现等信息，不含事件定义
	 * 
	 * @param widget 当前组件
	 * @param panel 当前容器作用域，通常为page容器
	 * @param app 处理器
	 * @param json 数据处理
	 * </code>
	 */
	me.reset = function(widget, panel, app, json) {
		YT.log.info('reset begin', TAG);
		YT.log.info('reset finish', TAG);
	};
	// 组件的外置接口
	exports.init = me.init;
	exports.reset = me.reset;

})