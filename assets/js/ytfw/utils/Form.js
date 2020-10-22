;
(function() {
	var TAG = "YT.Form";
	var MSG = NS.MSG;
	YT.log.debug("--init--");
	/**
	 * @fileOverview form表单工具类
	 * @nameSpace YT.Form
	 */
	var me = YT.Form = {
		/**
		 * 初始化
		 */
		init : function() {
		},
		/**
		 * @description 差峰执行, 开启锁状态, 并延时自动取消锁<br>
		 *              返回值：true:锁定；false:为不锁定;
		 * @param {element}
		 *            panel dom对象
		 * @param {Object}
		 *            app 功能JS对象
		 * @example if (YT.Form.readyLock(panel, me)) { return false;}
		 *          //form表单提交前可调用该方法进行相关的表单初始化验证
		 */
		readyLock : function(panel, app) {
			var items = panel.find("[data-ready='false']");
			return items.length > 0;
		},
		/**
		 * @private
		 * @description 表单组件初始化
		 * @param {element}
		 *            panel dom对象
		 * @param {Object}
		 *            app 功能JS对象
		 * @param {Object}
		 *            json 页面初始化参数
		 */
		initInnerPanel : function(panel, app, json) {
			// 表单赋值
			me.setFormJson(panel, json);
			// 初始化-日期相关控件
			// 1）日期区间快捷设置
			// 2）日期有效性校验事件设置
			YT.DateUtils && YT.DateUtils.initDateController(panel, app, json);
			// 初始化-短信发送组件
			YT.Sms.initSmsController(panel, app, json);
			// 初始化输入框类空间
			// 1）表单组件 initMoneyController
			// 2）金额组件 initSwitch
			// 3）开关组件 initSelect
			// 4）可输可选组件初始化 initAddBook
			YT.Input && YT.Input.init(panel, app, json);
			// 文件上传 initImgUpload 图片上传
			YT.Upload && YT.Upload.init(panel, app, json);
			// tab多标签筛选查询
			YT.Tab && YT.Tab.initTabFilter(panel, app, json);
			// 复选框初始化化
			YT.Checkbox && YT.Checkbox.init(panel, app, json);
			// 单选框初始化
			YT.Radiobox && YT.Radiobox.init(panel, app, json);
		},
		/**
		 * @description 表单初始化,统一表单初始化过程,表单赋值等
		 * @param {element}
		 *            panel dom对象
		 * @param {Object}
		 *            app 功能JS对象
		 * @param {Object}
		 *            json 页面初始化参数
		 * @example YT.Form.initPanel(panel, app, json);
		 */
		initPanel : function(panel, app, json) {
			// 表单赋值
			me.initInnerPanel(panel, app, json);
			// 自定义扩展属性
			panel.find("[data-extlib]").each(function(index, elem) {
				var widget = $(this);
				var extlib = widget.attr("data-extlib");
				var lib = NS.EXT_LIBS && NS.EXT_LIBS[extlib] || extlib;
				YT.log.info("----init extlib-----", extlib, lib);
				if (lib == null)
					return;
				seajs.use(lib, function(main) {
					// 初始化控件的事件、值、展现等
					main.init(widget, panel, app, json);
				});
			});
		},
		/**
		 * @description 再试初始化表单，仅对 data-ready='false' 的控件有效，需梳理初始化的流向，防死循环
		 * @param {element}
		 *            panel dom对象
		 * @param {Object}
		 *            app 功能JS对象
		 * @param {Object}
		 *            json 页面初始化参数
		 * @example YT.Form.resetPanel(panel, app, json);
		 */
		resetPanel : function(panel, app, json) {
			// 自定义扩展属性
			panel.find("[data-extlib]").each(function(index, elem) {
				var widget = $(this);
				// 初始化控件的值、展现等，不含事件
				me.resetWidget(widget, panel, app, json);
			});
		},

		/**
		 * @private
		 * @description 精确的初始化某控件，可多次执行，需梳理初始化的流向，防死循环
		 * @param {element}
		 *            widget 组件dom对象
		 * @param {element}
		 *            panel 页面dom对象
		 * @param {Object}
		 *            app 功能JS对象
		 * @param {Object}
		 *            json 页面初始化参数
		 */
		resetWidget : function(widget, panel, app, json) {
			var extlib = widget.attr("data-extlib");
			var lib = NS.EXT_LIBS && NS.EXT_LIBS[extlib] || null;
			YT.log.info("----init extlib-----", extlib, lib);
			if (lib == null)
				return;
			seajs.use(lib, function(main) {
				// 初始化控件的值、展现等，不含事件
				main.reset(widget, panel, app, json);
			});
		},
		dataKeys: function(keystr, json){
			var params = {};
			if(YT.isEmpty(keystr)){
				return {}
			}
			if(keystr == '*'){
				return json
			}
			
			var keys = keystr.split(',');
			for(var i = 0; i < keys.length; i ++){
				var key = keys[i];
				var items = key.split(/=|:/);
				var k = items[0], v = items.length > 1 ? items[1] : '';
				params[k] = key.indexOf('=') > 0 ? json[v] : (key.indexOf(':') > 0 ? v : json[k]);
			}
			return params;
		},
		/**
		 * @description 预初始化,公共事件定义，目前该方法为空，可重写该方法
		 * @param {element}
		 *            panel 页面dom对象
		 * @param {Object}
		 *            app 功能JS对象
		 * @param {Object}
		 *            json 页面初始化参数
		 * @example YT.Form.preInitPanel(panel, app, jsons);
		 */
		preInitPanel : function(panel, app, json) {

		},
		/**
		 * @description 将页面表单中的数据提取，并封装为json对象 表单中的input元素需要标记data-name，作为key
		 * @param {element}
		 *            panel 页面表单对
		 * @param {Object}
		 *            sendObj 装载表单数据的json对象
		 * @returns {*|{}} 表单参数
		 * @example YT.Form.getFormJson(panel, {});
		 */
		getFormJson : function(panel, sendObj) {
			sendObj = sendObj || {};
			if (!panel)
				return sendObj;
			var arr = [];// 定义一个容器，用来存放data-name的值；
			// 获取表单数据象
			panel.find("[data-name]").each(
					function() {
						var item = $(this);
						var name = '', value = '';
						name = item.attr("data-name");
						for (var temp = 0; temp < arr.length; temp++) {
							if (arr[temp] == name) {
								return;
							}
						}
						arr.push(name);
						var type = item.attr("data-type") || this.type;
						if (type == "checkbox") {
							var tmps = [];
							item.find("input:checked").each(function() {
								tmps.push(this.value);
							});
							value = tmps.join(",");
						} else if (type == "radiobox") {
							value = item.find('input[type=radio]:checked').val();
						} else {
							value = item.attr("data-value") || item.val() || item.text() || "";
							if (type == "select") {// 自定义下拉框
								value = item.attr("data-value") || item.val() || "";
							}
							if (item.is("select")) {// dom节点为select框判断
								value = item.find('option:selected').val() || "";
								var text = item.find("option:selected").text();
								sendObj[name+"_TEXT"] = text;
							}
							// 去逗号
							if (type == "money" || type == "number") {
								value = value.replace(/,/g, "");
							}
							// 去空格
							value = value.replace(/ /g, "");
						}
						if (name && value) {
							sendObj[name] = value;
						}
					});
			YT.log.debug(JSON.stringify(sendObj), "YT.Form.getFormJson");
			return sendObj;
		},
		/**
		 * @description 设置表单数据
		 * @param {element}
		 *            panel 页面表单Dom对象
		 * @param {element}
		 *            obj 装载到表单的JSON对象
		 * @example YT.Form.setFormJson(panel, {。。。});
		 */
		setFormJson : function(panel, obj) {
			obj = obj || {};
			if (YT.JsonToStr(obj) === '{}') {
				return;
			}
			panel.find("[data-name]").each(
					function() {
						var item = $(this);
						var tagName = item[0].tagName;
						var name = item.attr("data-name") || item.name || '';
						var val = obj[name];
						if (val) {
							var type = item.data('type') || item[0].type || "";
							if (tagName == 'INPUT' || tagName == 'SELECT' || tagName == 'TEXTAREA') {
								if (type == 'radio') {
									panel.find('[type=radio][value=' + val + ']').prop('checked', 'checked');
								} else {
									item.val(val);
								}
							} else {
								if (type == 'checkbox') {
									var arr = val.split(',');
									$.each(arr, function(i, n) {
										$("input:checkbox[value='" + n + "']").attr('checked', 'true');
									});
								} else {
									item.text(val);
								}
							}
						}
					});
		},
		/**
		 * @private
		 * @description 协议是否勾选
		 * @param {element}
		 *            obj 组件Dom对象
		 * @returns {Boolean} 是否勾选：true:是，false：否
		 */
		validAgree : function(obj, lable) {
			if (!obj.prop("checked")) {
				var tips = me.msgjoin(MSG.MsgCheck, [ lable ]);
				YT.showTips(tips);
				return false;
			}
			return true;
		},
		/**
		 * @description 表单验证 入口方法 阻断式，校验页面配置了属性date-name的元素节点；发现不合法输入项则验证失败,验证表单中各输入项的合法性<br>
		 * 相关页面校验项配置：	<br>
		 *  &nbsp&nbsp特殊字符校验规则：/\'|\"|,|=|:|\{|\}|\[|\]$/ <br>
		 *  &nbsp&nbsp data-required 是否必输项<br>
		 *  &nbsp&nbsp data-label 字段中文名<br>
		 *  &nbsp&nbsp data-name 表单字段提交名<br>
		 *  &nbsp&nbsp data-json 特殊字符检查 db 数据库字符校验规则：/\'|\"/<br>
		 *  &nbsp&nbsp data-len 验证数据长度<br>
		 *  &nbsp&nbsp data-min 验证最小值<br>
		 *  &nbsp&nbsp data-max 验证最大值<br>
		 * 	&nbsp&nbsp data-type 配置属性<br>
		 * 	&nbsp&nbsp&nbsp&nbsp data-type="protocol" 协议类型组件 校验提示符:NS.MSG.MsgCheck<br>
		 * 	&nbsp&nbsp&nbsp&nbsp data-type="checkbox" 复选框类型组件 校验提示符:NS.MSG.MsgSelect<br>
		 * 	&nbsp&nbsp&nbsp&nbsp data-type="number" 数字类型组件 校验提示符:NS.MSG.MsgNumber<br>
		 * 	&nbsp&nbsp&nbsp&nbsp data-type="money" 金额类类型组件 校验提示符:NS.MSG.MsgMoney<br>
		 * 	&nbsp&nbsp&nbsp&nbsp data-type="certNo" 身份证类型组件 校验提示符:NS.MSG.MsgFormat<br>
		 * 	&nbsp&nbsp&nbsp&nbsp data-type="orgNo" 企业机构号类型组件 校验提示符:NS.MSG.MsgSelect<br>
		 * 	&nbsp&nbsp&nbsp&nbsp data-type="unitcode" 校验组织机构代码类型组件 校验提示符:NS.MSG.MsgSelect 9~10位字符串<br>
		 *  &nbsp&nbsp&nbsp&nbsp NS.MSG,NS.PATTERN 根据字段配置属性data-type配置对应的验证正则表达式以及对应的提示符<br>
		 * @param {element}
		 *            panel 页面表单对象
		 * @returns {boolean} 是否校验通过：true:是，false：否
		 * @example // 页面元素校验 
		 * if (!YT.Form.validator(pageA)) { return false;}
		 */
		validator : function(panel) {
			var rst = true;
			panel.find("[data-name]").each(
					function() {
						var elem = this;
						var node = $(elem);
						// 忽略隐藏元素
						if (node.is(":hidden") === true) {
							return true;
						}
						var name = node.attr("data-name");
						if (name) {
							YT.log.debug("valid elem :" + name, TAG);
							var value = elem.value || node.attr("data-value") || elem.innerHTML;
							var type = node.attr("data-type") || elem.type || "";
							if (type == "select") {// 自定义下拉选项框
								value = elem.value || node.attr("data-value");
							}
							if (node.is("select")) {// dom节点为select框判断
								value = node.find('option:selected').val();
							}
							if (type == "checkbox") {// 复选框
							} else if (type == "radiobox") {// 单选框
								value = node.find('input[type="radio"][name="' + name + '"][checked]').val();
							}
							// 验证信息
							if (!me.validatorElement(node, name, type, value,true)) {
								rst = false;
								return false;
							}
						}
					});
			return rst;
		},
		/**
		 * @private
		 * @description 表单元素值验证
		 * @param {element}
		 *            item 表单dom元素
		 * @param {string}
		 *            name 元素名称key
		 * @param {string}
		 *            dataType 元素类型
		 * @param {*}
		 *            value 元素值
		 * @param {boolean}
		 *            focus 验证失败时，是否获取焦点
		 * @returns {boolean} 是否校验通过
		 */
		validatorElement : function(item, name, dataType, value, focus) {
			var required, msg = '', lable;
			required = item.attr("data-required");// 是否必输项
			lable = item.attr("data-label") || name;
			var req = required == 'true' || required == 'required';

			if ("protocol" == dataType) {
				var pro = item.find('input[type=checkbox][name="' + name + '"]');
				return me.validAgree(pro, lable);
			}
			// 复选框
			if ("checkbox" == dataType) {
				var isChecked = false;
				if (item.attr('type') == 'checkbox') {
					isChecked = item.prop("checked")
				} else {
					isChecked = item.find('input[type=checkbox]').prop("checked");
				}
				if (!isChecked && req) {
					validateFail(MSG.MsgSelect, [ lable ]);
					return false;
				}
				return true;
			}
			// select框
			if (item.is("select") || dataType == "select") {
				value = value ? value : "";
				if (value.trim().length == 0) {
					if (req) {
						validateFail(MSG.MsgSelect, [ lable ]);
						return false;
					}
				}
				return true;
			}
			// 非空验证
			value = value ? value : "";
			if (value.trim().length == 0) {
				if (req) {
					validateFail(MSG.MsgMustInput, [ lable ]);
					return false;
				}
				return true;
			}
			// 去逗号
			if (dataType == "money" || dataType == "number") {
				value = value.replace(/,/g, "");
			}
			// 去空格
			value = value.replace(/\s+/g, "");

			// 特殊字符检查
			var patt_str = /\'|\"|,|=|:|\{|\}|\[|\]$/;// 特殊字符
			var jsonType = item.attr("data-json");
			if (jsonType == "db") {
				patt_str = /\'|\"/;
			}
			if (patt_str.exec(value)) {
				validateFail(MSG.MsgStr, [ lable ]);
				return false;
			}
			// 验证数据长度
			var len = item.attr("data-len");
			if (len && value.length != (len * 1)) {
				validateFail(MSG.MsgLength, [ lable, len ]);
				return false;
			}

			// 验证最小值
			var min = item.attr("data-min") || null;
			if (min && min * 1 > value * 1) {
				validateFail(MSG.MsgMinValue, [ lable, min ]);
				return false;
			}

			// 验证最大值
			var max = item.attr("data-max") || null;
			if (max && max * 1 < value * 1) {
				validateFail(MSG.MsgMaxValue, [ lable, max ]);
				return false;
			}

			// 数字类型
			if ('number' == dataType || 'money' == dataType) {
				if (isNaN(value)) {
					validateFail(MSG.MsgNumber, [ lable ]);
					return false;
				}
			}
			var parttern = NS.PATTERN[dataType];
			if (!YT.isEmpty(parttern)) {
				if (!parttern.test(value)) {
					var nsMsg = MSG['Msg_' + dataType];
					YT.log.info(nsMsg);
					nsMsg = YT.isEmpty(nsMsg) ? MSG.MsgFormat : nsMsg;
					validateFail(nsMsg, [ lable ]);
					return false;
				}
			}

			// 金额验证
			if ('money' == dataType) {
				if (value <= 0) {
					validateFail(MSG.MsgMoney, [ lable ]);
					return false;
				}
			}
			// 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
			if ('certNo' == dataType) {
				if (!me.IdCardValidate(value)) {
					validateFail(MSG.MsgFormat, [ lable ]);
					return false;
				}
			}
			// 企业机构号
			if ('orgNo' == dataType) {
				if (me.orgcodevalidate(value)) {
					validateFail(MSG.MsgFormat, [ lable ]);
					return false;
				}
			}

			// 校验组织机构代码
			if ('unitcode' == dataType) {
				if (value.length > 10 || value.length < 9) {
					validateFail(MSG.MsgFormat, [ lable ]);
					return false;
				}
			}

			try {
				// 触发自定义的校验事件,自定义校验事件注册方法item.on("validator",func);
				item.trigger("validator", item);
				if (item.attr("data-check") == "false") {
					return false;
				}
			} catch (e) {
			}
			// 显示错误信息
			function validateFail(msg, vars) {
				var tips = me.msgjoin(msg, vars);
				me.showPinLabel(item, tips, focus);
			}
			return true;
		},
		/**
		 * @description 显示错误提示信息
		 * @param {element}
		 *            el 出错的元素
		 * @param {string} msg
		 *            错误信息
		 * @param {Boolean} focus
		 *            是否将焦点停留在出错的元素上
		 */
		showPinLabel : function(el, msg, focus) {
			YT.showTips(msg);
			// 获取焦点
			if (focus) {
				el.focus();
			}
		},
		/**
		 * @description 基于NS内容，组装提示信息
		 * @param msg
		 *            NS的信息模板
		 * @param vars
		 *            元素的label
		 * @returns {XML|void|string} 提示内容信息
		 */
		msgjoin : function(msg, vars) {
			YT.log.debug("Form.msgjoin:" + msg, TAG);
			return msg.replace(/\{(\d+)\}/g, function(m, i) {
				return i == 0 ? ("'" + vars[0] + "'") : vars[i];
			});
		},
		/**
		 * @private
		 * @description 自定义表单控件检查输出结果
		 * @param {element}
		 *            item 组件dom对象
		 * @param {string}
		 *            code
		 * @param msg
		 */
		resultCustomerValidator : function(item, code, msg) {
			if (!code && msg) {
				item.attr("data-check", "false");
				me.showPinLabel(item, msg, focus);
			} else {
				item.attr("data-check", "true");
			}
		},
		IdCardValidate : function(idCard) {
			idCard = idCard.replace(/ /g, "");
			if (idCard.length == 15) {
				return me.isValidityBrithBy15IdCard(idCard);
			} else if (idCard.length == 18) {
				var a_idCard = idCard.split(""); // 得到身份证数组
				if (me.isValidityBrithBy18IdCard(idCard)
						&& me.isTrueValidateCodeBy18IdCard(a_idCard)) {
					return true;
				} else {
					return false;
				}
			} else {
				return false;
			}

		},
		isTrueValidateCodeBy18IdCard : function(a_idCard) {
			var Wi = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1 ]; // 加权因子
			var ValideCode = [ 1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2 ]; // 身份证验证位值.10代表X
			var sum = 0; // 声明加权求和变量
			if (a_idCard[17].toLowerCase() == 'x') {
				a_idCard[17] = 10; // 将最后位为x的验证码替换为10方便后续操作
			}
			for (var i = 0; i < 17; i++) {
				sum += Wi[i] * a_idCard[i]; // 加权求和
			}
			valCodePosition = sum % 11; // 得到验证码所位置
			if (a_idCard[17] == ValideCode[valCodePosition]) {
				return true;
			} else {
				return false;
			}
		},
		isValidityBrithBy18IdCard : function(idCard18) {
			var year = idCard18.substring(6, 10);
			var month = idCard18.substring(10, 12);
			var day = idCard18.substring(12, 14);
			var temp_date = new Date(year, parseFloat(month) - 1,
					parseFloat(day));
			// 这里用getFullYear()获取年份，避免千年虫问题
			if (temp_date.getFullYear() != parseFloat(year)
					|| temp_date.getMonth() != parseFloat(month) - 1
					|| temp_date.getDate() != parseFloat(day)) {
				return false;
			} else {
				return true;
			}
		},
		isValidityBrithBy15IdCard : function(idCard15) {
			var year = idCard15.substring(6, 8);
			var month = idCard15.substring(8, 10);
			var day = idCard15.substring(10, 12);
			var temp_date = new Date(year, parseFloat(month) - 1,
					parseFloat(day));
			// 对于老身份证中的你年龄则不需考虑千年虫问题而使用getYear()方法
			if (temp_date.getYear() != parseFloat(year)
					|| temp_date.getMonth() != parseFloat(month) - 1
					|| temp_date.getDate() != parseFloat(day)) {
				return false;
			} else {
				return true;
			}
		},
		orgcodevalidate : function(value) {
			if (value != "") {
				var values = value.split("-");
				var ws = [ 3, 7, 9, 10, 5, 8, 4, 2 ];
				var str = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
				var reg = /^([0-9A-Z]){8}$/;
				if (!reg.test(values[0])) {
					return true
				}
				var sum = 0;
				for (var i = 0; i < 8; i++) {
					sum += str.indexOf(values[0].charAt(i)) * ws[i];
				}
				var C9 = 11 - (sum % 11);
				var YC9 = values[1] + '';
				if (C9 == 11) {
					C9 = '0';
				} else if (C9 == 10) {
					C9 = 'X';
				} else {
					C9 = C9 + '';
				}
				return YC9 != C9;
			}

		}
	};
	me.init();
	YT.log.debug("--end--", TAG);
})();