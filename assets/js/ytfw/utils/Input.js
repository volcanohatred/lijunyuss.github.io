$(function () {
	var TAG = "YT.Input";
	YT.log.debug("---init--", TAG);
	var FormatUtil = YT.Format;
	var selectWeeks = ['{@each LIST as item,index}',
			'<option value="${item.ID}">${item.WEEK}</option>', '{@/each}'
		]
		.join('');
	var selectEdit = ['{@each LIST as item,index}',
		'<option>${item.VALUE}</option>', '{@/each}'
	].join('');
	var me = YT.Input = {
		/**
		 * 初始化事件
		 * 
		 * @param panel
		 * @param app
		 * @param json
		 */
		init: function (panel, app, json) {
			me.initMoneyController(panel, app, json);
			me.initAcctNo(panel, app, json);
			me.initSwitch(panel, app, json);
			me.initSelect(panel, app, json);
			me.initSelectWeek(panel, app, json);
			me.initPhoneBook(panel, app, json);
			me.initSms(panel, app, json);
			me.callPhone(panel, app, json);
			me.initAgreement(panel, app, json);
			me.initImgCode(panel, app, json);
		},
		initImgCode: function (panel, app, json) {
			var ele = panel.find('.y-img-code');
			if (ele.length < 1) {
				return;
			}
			ele.on('click', '.x-img-code', function () {
				var that = $(this);
				var url = that.attr('data-url');
				url = YT.isEmpty(url) ? 'common/imageCode.do' : url;
				var chnlId = that.attr('data-chnlid');
				chnlId = YT.isEmpty(chnlId) ? '1000' : chnlId;
				// url = basePath + url + '?chnlId=' + chnlId;
				url = url + '?chnlId=' + chnlId;
				YT.Client.getImageCode(url, function (rpdata) {
					if (rpdata.status == "1") {
						that.prop("src", "data:image/png;base64," + rpdata.img);
					} else {
						YT.alertinfo("获取图形验证码失败");
					}
				});
			});
			ele.find(".x-img-code").trigger('click');
		},
		/**
		 * 初始化协议
		 */
		initAgreement: function (panel, app, json) {
			var ele = panel.find(".Agreemens");
			if (ele.length < 1) {
				return;
			}
			YT.log.info("agreemen ele ", ele.length);
			ele.on("click", function () {
				var url = ele.attr("data-url");
				YT.nextPage(url);
			});
		},
		/**
		 * 金额控件初始化
		 * 
		 * @param panel
		 * @param app
		 * @param json
		 */
		initMoneyController: function (panel, app, json) {
			var ele = panel.find("[data-type='money']");
			if (ele.length < 1) {
				return;
			}

			YT.log.info("money ele ", ele.length);
			var cnEle = panel.find("[data-zh='r-amt-zh']"); // 中文金额
			var change = ele.data("change");
			ele.on("input", function () {
				var amt = YT.Format.unfmtAmt(ele.val());
				if (YT.isEmpty(amt) || YT.isEmpty(amt.trim())) {
					cnEle.text("零元整");
				} else {
					var chinese = YT.Format.fmtNumber2Chinese(amt);
					cnEle && cnEle.text(chinese);
					change && app && app[change] && app[change]();
				}
			});
		},
		/**
		 * 格式化账号
		 */
		initAcctNo: function (panel, app, json) {
			var ele = panel
				.find("input[data-type$='acct'],input[data-type^='acct']");
			ele.on("input", function () {
				var value = this.value.replace(/^\D*$/g, "");
				var txt = YT.Format.fmtAcctNo(value, false);
				var item = $(this);
				item.val(txt);
			});
		},
		/**
		 * 开关组件
		 * 
		 * @param panel
		 * @param app
		 * @param json
		 * @desc data-handle="r-switch" //开关操作区域 <br>
		 *       data-toggle="clazz" //控制开关操作区域
		 * 
		 */
		initSwitch: function (panel, app, json) {
			var ele = panel.find("[data-type='switch']");
			if (ele.length < 1) {
				return;
			}
			var rs, clazz;
			var rh = ele.attr('data-handle');
			if (YT.isEmpty(rh)) {
				rs = panel.find('[data-handle="r-switch"]');
				clazz = rs.attr('data-toggle');
			} else {
				rs = panel.find('.' + rh);
				clazz = ele.attr('data-toggle');
			}
			if (rs.length < 1) {
				return;
			}
			ele.on('click', function () {
				changeClazz();
			});

			function changeClazz() {
				if (ele.prop("checked")) {
					rs.removeClass(clazz)
				} else {
					rs.addClass(clazz);
				}
			}
			changeClazz();
		},
		/**
		 * 可输可选组件
		 * 
		 * @param panel
		 * @param app
		 * @param json
		 */
		initSelect: function (panel, app, json) {
			var ele = panel.find(".y-select-edit"); // 自身组件区域
			if (ele.length < 1) {
				return;
			}

			var xele = ele.find(".x-picker"); // 内部组件区域
			if (xele.length < 1) {
				return;
			}

			var exele = xele.find("select");

			if (exele.length < 1) {
				return;
			}
			var value = xele.attr('data-value');
			value = YT.isEmpty(value) ? "VALUE" : value;

			var url = xele.attr('data-url');
			if (!YT.isEmpty(url)) {
				url = YT.dataUrl(url);
				ele.attr("data-ready", "false");
				YT.ajaxData(url, {}, function (data) {
					if (data.STATUS == '1') {
						var list = data.LIST;
						var tempList = [];
						tempList.push({}); // 设置第一条数据为空
						$.each(list, function (i, n) {
							var map = {
								"VALUE": n[value]
							}
							tempList.push(map);
						});
						var html = YT.template(selectEdit, {
							LIST: tempList
						});
						exele.html(html);
						ele.attr("data-ready", "true"); // 实例化完成
					} else {
						YT.hideWaitPanel();
						YT.alertinfo(data.MSG);
					}
					exele.on('change', function () { //
						var element = $(this);
						var text = element.find('option:checked').text();
						panel.find('.y-select-edit input').val(text);
					});
				});
			} else {
				exele.on('change', function () { //
					var element = $(this);
					var text = element.find('option:checked').text();
					panel.find('.y-select-edit input').val(text);
				});
			}

		},
		/**
		 * 初始化日期-星期
		 * 
		 * @param panel
		 * @param app
		 * @param json
		 */
		initSelectWeek: function (panel, app, json) {
			var ele = panel.find(".y-date-week"); // 自身组件区域
			if (ele.length < 1) {
				return;
			}
			var xele = ele.find("select")
			if (xele.length < 1) {
				return;
			}
			var params = [{
				"ID": "1",
				"WEEK": "星期一"
			}, {
				"ID": "2",
				"WEEK": "星期二"
			}, {
				"ID": "3",
				"WEEK": "星期三"
			}, {
				"ID": "4",
				"WEEK": "星期四"
			}, {
				"ID": "5",
				"WEEK": "星期五"
			}, {
				"ID": "6",
				"WEEK": "星期六"
			}, {
				"ID": "7",
				"WEEK": "星期日"
			}]
			var html = YT.template(selectWeeks, {
				LIST: params
			});
			xele.html(html);
		},
		/**
		 * 初始化电话簿
		 */
		initPhoneBook: function (panel, app, json) {
			var ele = panel.find(".y-phone-book"); // 自身组件区域
			if (ele.length < 1) {
				return;
			}
			ele.on('click', function () {
				YT.Client.openPhoneBook(function (data) {
					panel.find(".x-phone-book").val(data.phoneNumber.replace(/ /ig, ''));
				});
			});
		},
		/**
		 * 初始化发短信
		 * 
		 * @returns
		 */
		initSms: function (panel, app, json) {
			var ele = panel.find(".y-sms-mess"); // 自身组件区域
			if (ele.length < 1) {
				return;
			}
			ele.on('click', function () {
				var phoneNo = panel.find(".x-sms-mess").val();
				if (YT.isEmpty(phoneNo)) {
					YT.showTips('请输入手机号码！');
					return;
				}
				YT.Client.sendSms(phoneNo);
			});
		},
		/**
		 * 初始化打电话
		 * 
		 * @returns
		 */
		callPhone: function (panel, app, json) {
			var ele = panel.find(".y-call-phone"); // 自身组件区域
			if (ele.length < 1) {
				return;
			}
			ele.on('click', function () {
				var phoneNo = panel.find(".x-call-phone").val();
				if (YT.isEmpty(phoneNo)) {
					YT.showTips('请输入手机号码！');
					return;
				}
				YT.Client.callPhone(phoneNo);
			});
		}
	};

	YT.log.debug("---end--", TAG);
});