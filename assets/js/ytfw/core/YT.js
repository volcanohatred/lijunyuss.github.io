/**
 * @fileOverview 核心js基类,提供全局可用api
 * @nameSpace YT
 */
var keyBoardEle;
var YT = {
	idSeed : 10000,
	/**
	 * @description 获取唯一id
	 * @returns {string} id
	 * @example var _id = YT.id();
	 */
	id : function() {
		return 'yt_gen_' + (++YT.idSeed);
	},
	emptyFn : function() {
	},
	/**
	 * @description 获取日志输出对象
	 * @returns {*} 返回日志对象
	 * @example 1.日志信息 YT.log.info('日志内容信息。。。。'); 
	 * 2.调试信息 YT.log.debug('日志内容信息。。。。'); 
	 * 3.警告信息 YT.log.warn('日志内容信息。。。。');
	 * 4.错误信息 YT.log.error('日志内容信息。。。。');
	 */
	//log : window.Logger(),
	log : {
		/** 日志信息 */
		info : function() {
		},
		/** 调试信息 */
		debug : function() {
		},
		/** 警告信息 */
		warn : function() {
		},
		/** 错误信息 */
		error : function() {
		}
	},
	/**
	 * @description 定义命名空间
	 * @returns {*} 返回命名空间
	 */
	namespace : function() {
		var space = null, path;
		YT.each(arguments, function(v) {
			path = v.split('.');
			space = window[path[0]] = window[path[0]] || {};
			YT.each(path.slice(1), function(v2) {
				space = space[v2] = space[v2] || {};
			});
		});
		return space;
	},
	/**
	 * @description 属性复制（同jQuery的$.extend）
	 * @param {*}
	 *            object 新参数对象
	 * @param {*}
	 *            config 拷贝参数对象
	 * @param {*}
	 *            defaults 默认参数对象
	 * @returns {*} 新参数对象
	 * @example var params = YT.apply({"key":"k"},{'STATUS':"1",'MSG':"成功"});
	 */
	apply : function(object, config, defaults) {
		if (defaults) {
			YT.apply(object, defaults);
		}
		if (object && config && YT.isObject(config)) {
			for ( var property in config) {
				object[property] = config[property];
			}
		}
		return object;
	},
	/**
	 * @description 属性复制（仅复制object中不存在的属性）
	 * @param {*}
	 *            object 新参数对象
	 * @param {*}
	 *            config 拷贝参数对象
	 * @returns {*} 新参数对象
	 * @example var params = YT.applyIf({'MSG':"成功"},{'STATUS':"1",'MSG':"成功"});
	 */
	applyIf : function(object, config) {
		if (object) {
			for ( var p in config) {
				if (!YT.isDefined(object[p])) {
					object[p] = config[p];
				}
			}
		}
		return object;
	},
	/**
	 * @description 继承
	 */
	extend : function() {
		var objectConstructor = Object.prototype.constructor, inlineOverrides = function(
				o) {
			for ( var m in o) {
				if (!o.hasOwnProperty(m)) {
					continue;
				}
				this[m] = o[m];
			}
		};
		return function(subclass, superclass, overrides) {
			if (YT.isObject(superclass)) {
				overrides = superclass;
				superclass = subclass;
				subclass = overrides.constructor !== objectConstructor ? overrides.constructor
						: function() {
							superclass.apply(this, arguments);
						};
			}
			if (!superclass) {
				return null;
			}
			//
			var F = function() {
			};
			var subclassProto, superclassProto = superclass.prototype;
			F.prototype = superclassProto;
			subclassProto = subclass.prototype = new F();
			subclassProto.constructor = subclass;
			subclass.superclass = superclassProto;
			if (superclassProto.constructor === objectConstructor) {
				superclassProto.constructor = superclass;
			}
			subclass.override = function(overrides) {
				YT.override(subclass, overrides);
			};
			subclassProto.override = inlineOverrides;
			subclassProto.proto = subclassProto;
			subclass.override(overrides);
			subclass.extend = function(o) {
				return YT.extend(subclass, o);
			};
			return subclass;
		};
	}(),
	/**
	 * @description 覆盖
	 * @param {Object}
	 *            cls 源对象
	 * @param {Object}
	 *            overrides 重写对象
	 * @example YT.override(YT.util.Event, {...});
	 */
	override : function(cls, overrides) {
		YT.apply(cls.prototype, overrides);
	},
	/**
	 * @description 转换为字符
	 * @param {Object}
	 *            v 转换对象
	 * @returns {string} 返回字符串
	 * @example var str = YT.toString({STATUS:"1"});
	 */
	toString : function(v) {
		return Object.prototype.toString.apply(v);
	},
	/**
	 * @description 判断值是否已定义
	 * @param {*}
	 *            v 判断对象
	 * @returns {*|boolean} 是否已定义
	 * @example var fun;
	 * var isDefined = YT.isDefined(fun);
	 */
	isDefined : function(v) {
		return typeof v !== 'undefined';
	},
	/**
	 * @description 是否为空
	 * @param {*}
	 *            v 值
	 * @param {boolean}
	 *            allowBlank 是否允许空
	 * @returns {*|boolean} 是否为空
	 * @example var obj;
	 * var isEmpty = YT.isEmpty(obj);
	 */
	isEmpty : function(v, allowBlank) {
		return v === null || v === undefined
				|| String(v).toUpperCase() === 'NULL'
				|| ((YT.isArray(v) && !v.length))
				|| (!allowBlank ? v === '' : false);
	},
	/**
	 * @description 是否是数组
	 * @param {*}
	 *            v 值
	 * @returns {*|boolean} 是否为数组
	 * @example var arry = [];
	 * var isArray = YT.isArray(arry);
	 */
	isArray : function(v) {
		return YT.toString(v) === '[object Array]';
	},
	/**
	 * @description 是否是日期
	 * @param {*}
	 *            v 值
	 * @returns {*|boolean} 是否为日期
	 * @example var date = new Date();
	 * var isDate = YT.isDate(date);
	 */
	isDate : function(v) {
		return YT.toString(v) === '[object Date]';
	},
	/**
	 * @description 是否是对象
	 * @param {*}
	 *            v 值
	 * @returns {*|boolean} 是否为对象
	 * @example var obj = {};
	 * var isObject = YT.isObject(obj);
	 */
	isObject : function(v) {
		return !!v && YT.toString(v) === '[object Object]';
	},
	/**
	 * @description 是否是函数
	 * @param {*}
	 *            v 值
	 * @returns {*|boolean} 是否为函数
	 * @example var func = function(){};
	 * var isFunction = YT.isFunction(func);
	 */
	isFunction : function(v) {
		return YT.toString(v) === '[object Function]';
	},
	/**
	 * @description 是否是数值型
	 * @param {*}
	 *            v 值
	 * @returns {*|boolean} 是否为数值
	 * @example var b = 1;
	 * var isNumber = YT.isNumber(b);
	 */
	isNumber : function(v) {
		return typeof v === 'number' && isFinite(v);
	},
	/**
	 * @description 是否是字符型
	 * @param {*}
	 *            v 值
	 * @returns {*|boolean} 是否为字符串
	 * @example var str = "test";
	 * var isString = YT.isString(str);
	 */
	isString : function(v) {
		return typeof v === 'string';
	},
	/**
	 * @description 是否是布尔型
	 * @param {*}
	 *            v 值
	 * @returns {*|boolean} 是否为布尔型
	 * @example var bool = true;
	 * var isBoolean = YT.isBoolean(bool);
	 */
	isBoolean : function(v) {
		return typeof v === 'boolean';
	},
	/**
	 * @description 是否是原始类型
	 * @param {*}
	 *            v 值
	 * @returns {*|boolean} 是否为原始类型
	 * @example var bool = true; 
	 * var isPrimitive = YT.isPrimitive(bool);
	 */
	isPrimitive : function(v) {
		return YT.isString(v) || YT.isNumber(v) || YT.isBoolean(v);
	},
	/**
	 * @description 是否可迭代
	 * @param {*}
	 *            v 值
	 * @returns {*|boolean} 是否可迭代
	 * @example var arry = []; 
	 * var isIterable = YT.isIterable(arry);
	 */
	isIterable : function(v) {
		return (v && typeof v !== 'string') ? YT.isDefined(v.length) : false;
	},
	/**
	 * @description 是否是URL
	 * @param {*}
	 *            v 值
	 * @returns {*|boolean} 是否为url路径
	 * @example var url = "http://ares.com.cn"; 
	 * var isUrl = YT.isUrl(url);
	 */
	isUrl : function(v) {
		return /(((^https?)|(^ftp)):\/\/((([\-\w]+\.)+\w{2,3}(\/[%\-\w]+(\.\w{2,})?)*(([\w\-\.\?\\\/+@&#;~=%!]*)(\.\w{2,})?)*)|(localhost|LOCALHOST|127.0.0.1))\/?)/i
				.test(v);
	},
	/**
	 * @description 获取指定位数的随机数
	 * @param {int}
	 *            num 位数
	 * @returns {string} 随机数
	 * @example var random = YT.getRandom(16);
	 */
	getRandom : function(num) {
		var tmp = "";
		if (num && num > 0) {
			for (var i = 0; i < num; i++) {
				tmp += Math.floor(Math.random() * 10);
			}
		}
		return tmp;
	},
	/**
	 * @description 保存当前页面dom元素节点,在页面跳转中有参数以及回调时使用该方法
	 * @param {element}
	 *            panel 元素节点
	 * @example YT.setPrevPanel(pageA);
	 */
	setPrevPanel : function(panel) {
		YT._prevPanel = panel;
	},
	/**
	 * @description 获取上一页面的dom元素节点
	 * @returns {element} 元素节点
	 * @example var prevPanel = YT.getPrevPanel();
	 */
	getPrevPanel : function() {
		return YT._prevPanel;
	},
	/**
	 * @description 清空上一页面的dom元素节点
	 * @example YT.clearPrevPanel();
	 */
	clearPrevPanel : function() {
		YT._prevPanel = undefined;
	},
	/**
	 * @description 保存parameters参数
	 * @param {*}
	 *            params 参数
	 * @example YT.setParameters({STATUS:'1'});
	 */
	setParameters : function(params) {
		YT._data = params;
	},
	/**
	 * @description 返回parameters参数 特指页面跳转间传递的参数
	 * @returns {*} 参数
	 * @example var params = YT.getParameters();
	 */
	getParameters : function() {
		return YT._data || {};
	},
	getUrlParams: function(){
		var url = location.search; //
		var theRequest = new Object();   
		if (url.indexOf("?") != -1) {   
			var str = url.substr(1);   
			strs = str.split("&");   
			for(var i = 0; i < strs.length; i ++) {   
	        	theRequest[strs[i].split("=")[0]]=decodeURI(strs[i].split("=")[1]);   
			}
		}
		return theRequest;  
	},
	/**
	 * @description 清空 页面间跳转的参数
	 * @example YT.clearParameters();
	 */
	clearParameters : function() {
		YT._data = {};
	},
	/**
	 * @description 遍历数组
	 * @param {*}
	 *            value 遍历对象
	 * @param {function}
	 *            fn 遍历处理函数
	 * @param {*}
	 *            scope 作用域
	 * @example YT.each(['a','b'],function(v,i){
	 * 	console.info(i+'-'+v);
	 * });
	 */
	each : function(value, fn, scope) {
		if (YT.isEmpty(value)) {
			return;
		}
		if (!YT.isDefined(scope)) {
			scope = value;
		}
		if (YT.isObject(value)) {
			var i = 0;
			for ( var prop in value) {
				if (value.hasOwnProperty(prop)) {
					if (fn.call(scope || value, prop, value[prop], i++, value) === false) {
						return;
					}
				}
			}
		} else {
			if (!YT.isIterable(value) || YT.isPrimitive(value)) {
				value = [ value ];
			}
			for (var i = 0, len = value.length; i < len; i++) {
				if (fn.call(scope || value[i], value[i], i, value) === false) {
					return i;
				}
			}
		}
	},
	/**
	 * @description 绑定作用域
	 * 
	 * @param {function}
	 *            fn 绑定的函数
	 * @param {*}
	 *            scope 作用域
	 * @returns {*} 函数或对象
	 * @example YT.bind(function(){},this);
	 */
	bind : function(fn, scope) {
		if (!YT.isFunction(fn)) {
			return fn;
		}
		return function() {
			return fn.apply(scope, arguments);
		};
	},
	/**
	 * @description 定义模块 桥接Seajs http://seajs.org
	 * @param {*}
	 *            factory 参数
	 * @example YT.define();
	 */
	define : function(factory) {
		var args = arguments;
		if (args.length > 1 || !YT.isFunction(factory)) {
			define.apply(this, args);
		} else {
			define.call(this, factory);
		}
	},
	/**
	 * @description 模版 桥接Juicer http://juicer.name
	 * @returns {*} 渲染后的模板字符串
	 * @example var html = YT.template(tplHtml,params); 
	 * pageA.html(html);
	 */
	template : function() {
		var args = arguments;
		var tpl = args[0];
		if (YT.isArray(tpl)) {
			if (tpl.length > 1) {
				var arr = [], funs = {};
				// 从模版中分出自定义函数
				YT.each(tpl, function(item) {
					if (YT.isObject(item)) {
						YT.apply(funs, item);
					} else {
						arr.push(item);
					}
				});
				// 注册自定义函数
				YT.each(funs, function(prop, fun) {
					if (YT.isFunction(fun)) {
						juicer.register(prop, fun);
					}
				});
				args[0] = arr.join('');
			} else {
				args[0] = tpl[0];
			}
		}
		return juicer.apply(this, args);
	},
	/**
	 * @description JSON对象转换为String
	 * @param {Object}
	 *            json 转换对象
	 * @returns {string} 转换字符串
	 * @example YT.JsonToStr({"STATUS":"1"});
	 */
	JsonToStr : function(json) {
		return JSON.stringify(json);
	},
	/**
	 * @description String转换为JSON
	 * @param {string}
	 *            str json字符串
	 * @returns {Object} json对象
	 * @example YT.JsonEval('{"STATUS":"1"}');
	 */
	JsonEval : function(str) {
		return eval("(" + str + ")");
	},
	/* ===================客户端交互事件 start====================== */
	/**
	 * @description 隐藏键盘，仅供客户端调用
	 * @param {string}
	 *            id 键盘容器id
	 * @example YT._hideKeyboard();
	 */
	_hideKeyboard : function(id) {
		$('#mainBody .navbar-views').css({
			'-webkit-transform' : "translateY(0)",
			'transform' : "translateY(0)"
		});
		$('#mainBody .yui-auth-form').css({
			'-webkit-transform' : 'translateY(0)',
			'transform' : 'translateY(0)'
		});
		try {
			keyBoardEle.blur();
		} catch (e) {

		}
	},
	/**
	 * @description 显示客户端键盘前置处理，页面偏移设置
	 * @param {element}
	 *            $ele 装载键盘的dom对象
	 * @example YT._hideKeyboard($ele);
	 */
	_preShowKeyBoard : function($ele) {
		if (YT.isString($ele)) {
			$ele = $('#' + $ele);
		}
		var boardH = YT.isNumber(YT.KeyBoardHight) ? YT.KeyBoardHight : 300; // 自定义键盘高度
		var eh = $ele.height(); // 元素的高度
		var top = $ele.offset().top;
		var stop = $(window).scrollTop();// 滚动条高度
		var h = top;
		// 15为偏差量
		var newTop = W_HEIGHT + stop - top - eh;
		if (newTop < boardH) {
			$('#mainBody .views').css(
					{
						'-webkit-transform' : 'translateY(' + (newTop - boardH) + 'px)',
						'transform' : 'translateY(' + (newTop - boardH) + 'px)'
					});
			$('#mainBody .yui-auth-form').css(
					{
						'-webkit-transform' : 'translateY(' + (newTop - boardH) + 'px)',
						'transform' : 'translateY(' + (newTop - boardH) + 'px)'
					});
		}
	},
	/**
	 * @description 初始化客户端键盘的组件的触发事件
	 * @param {element}
	 *            panel 页面元素节点dom对象
	 * @description 对需要调取相应客户端键盘的相关页面元素，需要使用data-keyboard属性来标示调用哪一种键盘 </br>
	 *属性描述:</br>
	 *1.data-keyboard=</br>
	 *	&nbsp&nbsp&nbsp TPwd：交易密码键盘-showTPwdKeyboard </br>
	 *	&nbsp&nbsp&nbsp LPwd：登录密码键盘-showLPwdKeyboard </br>
	 *	&nbsp&nbsp&nbsp Date：日期键盘-showCalendarView </br>
	 *	&nbsp&nbsp&nbsp Money：金额键盘-showMoneyKeyboard</br>
	 *  &nbsp&nbsp&nbsp Number：数字键盘-showNumberKeyboard </br>
	 *  &nbsp&nbsp&nbsp IDC：身份证键盘-showIDCKeyboard</br>
	 *2.data-clear=true:清空数据；其他：不清空</br>
	 */
	initEvent : function(panel) {
		var thizz = this;
		var evtName = {
			TPwd : 'showTPwdPicker', // 交易密码
			LPwd : 'showLPwdPicker', // 登录密码
			Date : 'showDatePicker', // 日期
			Money : 'showMoneyPicker',// 金额
			Number : 'showNumPicker', // 数字
			IDC : 'showIDCPicker' // 证件
		};
		// 注册控件调用方法
		panel.on('click', 'input[data-keyboard]', function(e) {
			e.preventDefault();
			var that = $(this);
			var clearFlag = that.attr("data-clear");
			if (clearFlag == "true") {
				that.val("");
			}
			//YT.Client.showKeyBoard(that);
			var type = that.attr('data-keyboard');
			var evtFunc = evtName[type];
			keyBoardEle = that;
			thizz[evtFunc] && thizz[evtFunc](that);
			return false;
		});
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
	showTPwdPicker : function($obj) {
		YT.Client.showTPwdPicker($obj);
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
	showLPwdPicker : function($obj) {
		YT.Client.showLPwdPicker($obj);
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
	showDatePicker : function($obj) {
		YT.Client.showDatePicker($obj);
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
	showMoneyPicker : function($obj) {
		YT.Client.showMoneyPicker($obj);
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
	showNumPicker : function($obj) {
		YT.Client.showNumPicker($obj);
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
	showIDCPicker : function($obj) {
		YT.Client.showIDCPicker($obj);
	},
	/**
	 * @description 是否支持touch事件
	 * @returns {boolean} 是否支持touch事件
	 * @example if(YT.touch()){};
	 */
	touch : function() {
		return !!(('ontouchstart' in window) || (window.DocumentTouch && document instanceof window.DocumentTouch));
	},
	/**
	 * @description 初始化页面事件</br>
	 *  &nbsp属性配置说明：</br>
	 *	&nbsp&nbsp&nbsp data-event - 点击事件</br>
	 *	&nbsp&nbsp&nbsp data-change - 下拉列表 change事件</br>
	 *	&nbsp&nbsp&nbsp data-input - 输入框 change事件</br>
	 *	&nbsp&nbsp&nbsp data-blur - 输入框 失去焦点事件</br>
	 *	&nbsp&nbsp&nbsp data-jump - 默认绑定的功能切换</br>
	 * @param {element}
	 *            panel 面板dom对象
	 * @param {Object}
	 *            app 控制器
	 * @example YT.initPageEvent(panel,me);
	 */
	initPageEvent : function(panel, app) {
		//四个主页面标题头不展示
		/*if(panel.selector!="#P0101"&&panel.selector!="#P0102"&&panel.selector!="#P0103"&&panel.selector!="#P0104"){
			$(".views").css("padding-top","40px");
		}else{
			$(".views").css("padding-top","0px");
		}*/
		var func = function(e, elem, prop) {
			var evtName = elem.data(prop);
			app[evtName] && app[evtName](e, elem);
		};
		// 点击事件
		panel.on("click", "[data-event]", function(e) {
			func && func(e, $(this), "event")
		});
		// 下拉列表 change事件
		panel.on("change", "[data-change]", function(e) {
			func && func(e, $(this), "change");
		});
		// 输入框 change事件
		panel.on("input", "[data-input]", function(e) {
			func && func(e, $(this), "input");
		});
		// 输入框 获取焦点事件
		panel.on("focus", "[data-focus]", function(e) {
			func && func(e, $(this), "focus");
		});
		// 输入框 失去焦点事件
		panel.on("blur", "[data-blur]", function(e) {
			func && func(e, $(this), "blur");
		});
		// 默认绑定的功能切换
		panel.on('click', '[data-jump]', function(e) {
			e.preventDefault();
			var url = $(this).attr('data-jump');
			YT.log.debug('data-jump:' + url);
			if (YT.isEmpty(url)) {
				YT.alertinfo("跳转页面不存在");
			} else {
				YT.nextPage(url);
			}
		});
		// 初始化客户端键盘事件
		YT.initEvent(panel);
		YT.Collection && YT.Collection.endInitModule();
	},
	/**
	 * @description 初始化页标题栏<br>
	 *              接口名称：initPageTitle <br>
	 * @param {element}
	 *            page 需要初始化的元素节点
	 * @example pageA.attr('data-btnRight','true|完成|demo_case_list_10.finish()');
	 *          YT.initPageTitle(pageA);
	 */
	initPageTitle : function(page) {
		YT.Client.initPageTitle(page);
	},
	/**
	 * @ignore
	 * @description 搜索框标题
	 * @param {Object}
	 *            cfg 参数配置
	 * @param {Object}
	 *            cfg.defalutVal 默认值
	 * @param {Object}
	 *            cfg.placeholder 提示标签内容
	 * @param {Object}
	 *            cfg.callback 回调函数
	 * @example YT.titleSearchBar({defalutVal:'默认值', placeholder: '请输入搜索内容', callback: App.search })
	 */
	titleSearchBar : function(cfg) {
		func = YT.getFunctionName(func);
		var cfg = {
			placeholder : placeholder,
			callback : func
		}
		YT.Client.titleSearchBar(cfg);
	},
	/**
	 * @description 显示页面区域，控制业务流程，换面切换
	 * @param {element}
	 *            showHandle 要展示的页面区域
	 * @param {Object[]}
	 *            hideHandles 要隐藏的页面区域集合数组
	 * @param {boolean}
	 *            showTitle 是否显示title
	 * @example YT.showPageArea(pageA, [pages], true);
	 */
	showPageArea : function(showHandle, hideHandles, showTitle) {
		YT.NavUtil.showPageArea(showHandle, hideHandles, showTitle);
		try{
			YT.AuthBox && YT.AuthBox.closeAuth();
		}catch(e){}
		try{
			YT.AuthBoxLj && YT.AuthBoxLj.hideAuthPanel();
		}catch(e){}
		
	},
	/**
	 * @description 加载页面模板
	 * @param {element}
	 *            page 页面对象
	 * @param {string}
	 *            tplUrl 页面模板路径
	 * @param {Object}
	 *            params 初始化页面参数
	 * @param {function}
	 *            callback 回调方法
	 * @param {Object}
	 *            app 功能控制器
	 * @example YT.loadPage(pageB, TAG + "02_tpl_result.html", data, me.showPageB, me);
	 */
	loadPage : function(pageHandle, tplUrl, params, callback, app) {
		YT.AjaxUtil.loadPage(pageHandle, tplUrl, params, callback, app);
	},
	/**
	 * @description 加载模板页面
	 * @param {string}
	 *            url 页面路径
	 * @param {Object}
	 *            params 初始化参数
	 * @param {function}
	 *            callback 回调方法
	 * @example YT.getPage(TAG + "02_tpl_auth.html", data, function(tpl_html) {//TODO 页面渲染操作});
	 * 回调函数参数属性配置：
	 * tpl_html 模板页面的html字符串
	 */
	getPage : function(url, params, callback) {
		YT.AjaxUtil.getPage(url, params, callback);
	},
	/**
	 * @description 开启等待层<br>
	 *              接口名称：openWaitPanel <br>
	 * @param {string}
	 *            msg 显示内容
	 * @example YT.openWaitPanel('正在拼命加载中。。。');
	 */
	openWaitPanel : function(msg) {
		msg = msg || "正在加载中。。。", YT.Client.openWaitPanel(msg);
	},
	/**
	 * @description 关闭等待层<br>
	 *              接口名称：hideWaitPanel <br>
	 * @param {number}
	 *            timeout 延时时间（毫秒）
	 * @example YT.hideWaitPanel(timeout);
	 */
	hideWaitPanel : function(timeout) {
		timeout = timeout ? timeout : 100;
		YT.Client.hideWaitPanel(timeout);
	},
	/**
	 * @description 信息提示框<br>
	 *              接口名称：alertinfo <br>
	 * @param {string}
	 *            msg 信息内容
	 * @param {string}
	 *            title 弹出框标题
	 * @param {function}
	 *            okAct 确认按钮事件
	 * @param {string}
	 *            okName 确认按钮名称
	 * @example YT.alertinfo('我是通知内容','标题');
	 */
	alertinfo : function(msg, title, okAct, okName) {
		YT.Client.alertinfo(msg, title, okAct, okName);
	},
	/**
	 * @description 弹出确认信息框 <br>
	 *              接口名称：alertinfo <br>
	 * @param {string}
	 *            msg 信息内容
	 * @param {string}
	 *            title 弹出框标题
	 * @param {function}
	 *            okAct 确认按钮事件
	 * @param {function}
	 *            cancleAct 取消按钮事件
	 * @param {string}
	 *            okName 确认按钮名称
	 * @param {string}
	 *            cancleName 取消按钮的名称
	 * @example YT.confirm("我是通知内容","标题","alert(2)")
	 */
	confirm : function(msg, title, okAct, cancleAct, okName, cancleName) {
		YT.Client.confirm(msg, title, okAct, cancleAct, okName, cancleName);
	},
	/**
	 * @description session超时<br>
	 *              接口名称：sessionTimeout <br>
	 * @param {string}
	 *            msg 内容
	 * @param {string}
	 *            title 标题名称
	 * @param {string}
	 *            okName 确认按钮名称
	 * @example YT.sessionTimeout('我是通知内容','标题','确定');
	 */
	sessionTimeout : function(msg, title, okName) {
		YT.log.info("YT2223333")
		/*YT.alertinfo("会话超时，请重新登录","温馨提示",function(){
			YT.nextPage('page/P02/P0206/P0206.html')
		});*/
		YT.Client.sessionTimeout(msg, title, okName);
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
	resetLoginSession : function(user, callback) {
		YT.Client.resetLoginSession(JSON.stringify(user), callback);
	},
	/**
	 * @description 获取登录系统后存储session信息
	 * @param {function}
	 *            callback 获取到回调
	 * @example YT.getSession(function(rst){// 获取登录用户信息后操作});
	 */
	getSession : function(callback) {
		YT.Session.getSession(callback);
	},
	/**
	 * @description 获取缓存信息，json类型，数据内容变化极小的<br>
	 *              接口名称：getSession <br>
	 * @param {string}
	 *            sessKey 获取数据对应的key
	 * @param {function}
	 *            callback 获取到回调
	 * @param {string}
	 *            cacheType 缓存类型 1：存储客户端本地；0：临时缓存
	 * @example me.getSession=function(data){ console.log(data); };
	 *          YT.getCacheSession('final',me.getSession,0);
	 */
	getCacheSession : function(sessKey, callback, cacheType) {
		YT.Client.getSession(sessKey, callback, cacheType);
	},
	/**
	 * @description 设置缓存信息，json类型，数据内容变化极小的<br>
	 *              接口名称：setSession <br>
	 * @param {string}
	 *            sessKey 当前数据所对应的key
	 * @param {Object}
	 *            sessData 会话数据 例如。{key1:'',key2:''}
	 * @param {string}
	 *            cacheType 缓存类型 1：存储客户端本地；0：临时缓存
	 * @example YT.setCacheSession('final',{key1:'',key2:''},0);
	 */
	setCacheSession : function(sessKey, sessData, cacheType) {
		YT.Client.setSession(sessKey, JSON.stringify(sessData), cacheType);
	},
	/**
	 * @description 显示警告提示信息
	 * @param {msg}
	 *            msg 显示信息
	 * @example YT.showTips('警告信息');
	 */
	showTips : function(msg) {
		YT.Tips.showTips({
			content : msg,
			stayTime : 2000,
			type : "warn"
		})
	},
	/**
	 * @description 客户端native ajax 请求<br>
	 *              接口名称：post <br>
	 * @param {url}
	 *            url 请求地址
	 * @param {Object}
	 *            params 请求参数
	 * @param {function}
	 *            success 成功回调函数名称
	 * @param {function}
	 *            failure 失败回调函数名称
	 * @example YT.ajaxData('/mbank/login/login.do',{p1:'x'},function(rst){//执行成功回调函数},function(){//执行失败回调函数});
	 */
	ajaxData : function(url, params, success, failure) {

		YT.Client.post(url, params, success, failure)
	},
	/**
	 * @description 控制重复提交和重复报文ajax 请求<br>
	 *              接口名称：post <br>
	 * @param {url}
	 *            url 请求地址
	 * @param {Object}
	 *            params 请求参数
	 * @param {function}
	 *            success 成功回调函数名称
	 * @param {function}
	 *            failure 失败回调函数名称
	 * @example YT.onceAjaxData('/mbank/login/login.do',{p1:'x'},function(rst){//执行成功回调函数}, function(){//执行失败回调函数});
	 */
	onceAjaxData : function(url, params, success, failure) {
		YT.AjaxUtil.onceAjaxData(url, params, success, failure);
	},
	/**
	 * @ignore
	 * @description 同步加载页面等文本
	 * @param {url}
	 *            url 请求地址
	 */
	ajaxText : function(url) {
		YT.AjaxUtil.ajaxText(url);
	},
	/**
	 * @description 客户端native ajaxCashe 缓存请求<br>
	 *              接口名称：getNativeCache <br>
	 * @param {url}
	 *            url 请求地址
	 * @param {string}
	 *            version 版本
	 * @param {string}
	 *            type 类型
	 * @param {string}
	 *            cacheType 缓存版本号 1：存储客户端本地；0：临时缓存
	 * @param {Object}
	 *            params 请求参数
	 * @param {string}
	 *            success 成功回调函数名称
	 * @param {string}
	 *            failure 失败回调函数名称
	 * @example YT.ajaxCashe('/mbank/login/login.do','1.1','finance',{p1:'x'},function(rst){//执行成功回调函数},
	 *          function(){//执行失败回调函数});
	 */
	ajaxCashe : function(url, version, type, cacheType, params, success,
			failure) {
		YT.Client.getNativeCache(url, version, type, cacheType, params,
				success, failure);
	},
	/**
	 * @description 首页页面跳转<br>
	 *              接口名称：openMenuFunc <br>
	 * @param {Object}
	 *            cfg 菜单参数
	 * @param {string}
	 *            cfg.type 页面类型 N-原生；H-H5页面
	 * @param {string}
	 *            cfg.isLogin 是否登录：Y-需登录;N-不需登录
	 * @param {string}
	 *            cfg.menuId 菜单id：type为“N”时，必需，原生菜单的id
	 * @param {string}
	 *            cfg.url 跳转地址，type为“H”时，必需，H5跳转页面的半地址
	 * @example YT.openMenuPage({ type : type, isLogin : isLogin, menuId :
	 *          menuId, url : url });
	 */
	openMenuPage : function(cfg) {
		YT.Client.openMenuPage(cfg);
	},
	/**
	 * @description 二维码生成<br>
	 *              接口名称：geneQRC <br>
	 * @param {Object}
	 *            data 二维码需要的参数
	 * @param {function}
	 *            callback 回调函数
	 * @example YT.geneQRC({STATUS:'1'},function(rst) {});
	 */
	geneQRC : function(data, callback) {
		YT.Client.geneQRC(data || {}, callback);
	},
	/**
	 * @description 二维码扫描<br>
	 *              接口名称：sweepQRC <br>
	 * @param {function}
	 *            callback 回掉函数
	 * @example YT.sweepQRC(function(rst) {});
	 */
	sweepQRC : function(callback) {
		YT.Client.sweepQRC(callback);
	},
	/**
	 * @description 分享公用方法跳转<br>
	 *              接口名称：sharePages <br>
	 * @param {Object}
	 *            data 分享内容
	 * @param {string}
	 *            data.type 分享渠道(","分隔):WX-微信，PYQ-朋友圈，QQ-qq，WB-微博，DX-短信，YX-邮箱
	 * @param {string}
	 *            data.title 分享标题
	 * @param {string}
	 *            data.content 分享标题
	 * @param {string}
	 *            data.hrefUrl 分享url地址
	 * @param {string}
	 *            data.imgUrl 分享图片url地址
	 * @param {string}
	 *            callback 回调函数
	 * @example YT.sharePages(cfg,function(rst){});
	 */
	sharePages : function(data, callback) {
		YT.Client.sharePages(data, callback);
	},
	/**
	 * @description WebView截屏分享<br>
	 *              接口名称：shareReceipt <br>
	 * @param {string}
	 *            type 分享渠道(","分隔): WX-微信，PYQ-朋友圈，QQ-qq，WB-微博，DX-短信，YX-邮箱
	 * @param {string}
	 *            callback 回调函数名称
	 * @example YT.shareReceipt("WX,PYQ,QQ,YX",function(rst){});
	 */
	shareReceipt : function(type, callback) {
		YT.Client.shareReceipt(type, callback);
	},
	/**
	 * @description 弹出菜单层
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
	 * @example YT.showPopupWindow([{ name: "修改别名", func:"App.modify()" },{name: "删除账户", func: "App.updateAlias()" }, { name: "设为默认账户",func:"App.innerTrans()" }],pageA,me);
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
	showPopuMenus : function(cfg, panel, app) {
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
	 * @description 调用手机相册<br>
	 *              接口名称：openMobileCamera <br>
	 * @param {Object}
	 *            data 压缩系数等
	 * @param {float}
	 *            data.COMP_RATE 压缩系数 0.1-1 可不传，默认0.5
	 * @param {float}
	 *            data.HEIGHT 图片高度 可不传
	 * @param {float}
	 *            data.WIDTH 图片宽度 可不传
	 * @param {string}
	 *            callback 回调函数名称
	 * @example var cfg = {}; YT.openMobilePhoto(cfg,funcion(rst){...});
	 *          回调函数参数属性配置： rst.img 图片的base64字符串
	 */
	openMobilePhoto : function(data, callback) {
		YT.Client.openMobilePhoto(data, callback);
	},
	/**
	 * @description 调用手机拍照<br>
	 *              接口名称：openMobileCamera <br>
	 * 
	 * @param {Object}
	 *            data 压缩系数等
	 * @param {float}
	 *            data.COMP_RATE 压缩系数 0.1-1 可不传，默认0.5
	 * @param {float}
	 *            data.HEIGHT 图片高度 可不传
	 * @param {float}
	 *            data.WIDTH 图片宽度 可不传
	 * @param {function}
	 *            callback 回调函数名
	 * @example var cfg = {}; YT.openMobileCamera(cfg,funcion(rst){...});
	 *          回调函数参数属性配置： rst.img 图片的base64字符串
	 */
	openMobileCamera : function(data, callback) {
		YT.Client.openMobileCamera(data, callback);
	},
	/**
	 * @description 调用手机拍照/相册<br>
	 *              接口名称：openMobileCamera <br>
	 * @param {Object}
	 *            data 压缩系数等
	 * @param {float}
	 *            data.COMP_RATE 压缩系数 0.1-1 可不传，默认0.5
	 * @param {float}
	 *            data.COMP_RATE 图片高度 可不传
	 * @param {float}
	 *            data.WIDTH 图片宽度 可不传
	 * @param {function}
	 *            callback 回调函数名
	 * @example var cfg = {}; YT.openMobilePhotoAlbum(cfg,funcion(rst){...});
	 *          回调函数参数属性配置： rst.img 图片的base64字符串
	 */
	openMobilePhotoAlbum : function(data, callback) {
		YT.Client.openMobilePhotoAlbum(data, callback);
	},
	/**
	 * @description 客户端坐标<br>
	 *              接口名称：location <br>
	 * @param {function}
	 *            callback 回调函数名
	 * @example YT.location(funcion(rst){...}); 回调函数参数属性配置： rst.latitude 维度
	 *          rst.longitude 经度 rst.address 详细地址信息
	 */
	location : function(callback) {
		YT.Client.location(callback);
	},
	/**
	 * @description 检查指纹开启状态<br>
	 *              接口名称：fingerOpenState <br>
	 * @param {}
	 *	conf = {
	 *		callback : function(rsp){}
	 *	}
	 * @example 
	 * 	YT.fingerOpenState({callback:function(rsp){}}); rsp.STATE = '0';// 0:关闭 1:开启
	 *         	
	 */
	fingerOpenState : function(conf){
		YT.Client.fingerOpenState(conf);
	},
	/**
	 * @description 设置指纹<br>
	 *              接口名称：setFinger <br>
	 * @param {}
	 *	conf = {
	 *		type: 0, //type:0 关闭 type:1开启
	 *		callback : function(rsp){}
	 *	}
	 * @example 
	 * 	setFinger({type: 0 ,callback:function(rsp){}}); rsp.status = '0'; // 1:操作成功 0:操作失败
	 *         	
	 */
	setFinger : function(conf){
		YT.Client.setFinger(conf);
	},
	/**
	 * @description 验证指纹<br>
	 *              接口名称：checkFinger <br>
	 * @param {}
	 *	conf = {
	 *		callback : function(rsp){}
	 *	}
	 * @example 
	 * 	checkFinger({callback:function(rsp){}}); rsp.status = '0'; // 1:操作成功 0:操作失败
	 *         	
	 */
	checkFinger : function(conf){
		YT.Client.checkFinger(conf);
	},
	/**
	 * @description 设置手势密码<br>
	 *              接口名称：setGesture <br>
	 * @param {}
	 *	conf = {
	 *		type: 0, //type:0 关闭 type:1开启
	 *		callback : function(rsp){}
	 *	}
	 * @example 
	 * 	setGesture({type: 0 ,callback:function(rsp){}}); rsp.status = '0'; // 1:操作成功 0:操作失败
	 *         	
	 */
	setGesture : function(conf){
		YT.Client.setGesture(conf);
	},
	/**
	 * @description 验证手势密码<br>
	 *              接口名称：checkGesture <br>
	 * @param {}
	 *	conf = {
	 *		callback : function(rsp){}
	 *	}
	 * @example 
	 * 	checkGesture({callback:function(rsp){}}); rsp.status = '0'; // 1:操作成功 0:操作失败
	 *         	
	 */
	checkGesture : function(conf){
		YT.Client.checkGesture(conf);
	},
	/**
	 * @description 返回客户端首页<br>
	 *              接口名称：gotoIndex <br>
	 * @example YT.gotoClientIndex();
	 */
	gotoClientIndex : function() {
		YT.Client.gotoIndex();
	},
	/**
	 * @description 返回客户端上一级<br>
	 *              接口名称：gotoBack <br>
	 * @example YT.gotoClientBack();
	 */
	gotoClientBack : function() {
		YT.Client.gotoBack();
	},
	/**
	 * @description 跳转登录页<br>
	 *              接口名称：gotoLogin <br>
	 * @param {function}
	 *            callback 回调函数名称 ：用于Web页面
	 * @param {event}
	 *            e 事件 ：用于Web页面
	 * @param {Object}
	 *            params 参数 ：用于Web页面
	 * @example YT.gotoClientLogin(function(...){...},event,{});
	 */
	gotoClientLogin : function(callback, e, params) {
		YT.Client.gotoLogin(callback, e, params);
	},
	/**
	 * @description 开通通讯录<br>
	 *              接口名称：showAddressBook <br>
	 * @param {function}
	 *            callback 回调函数名称
	 * @example YT.openPhoneBook(function(rst){...}); 回调函数参数属性配置：
	 *          rst.phoneNumber 选择的用户手机号
	 */
	openPhoneBook : function(callback) {
		YT.Client.openPhoneBook(callback);
	},
	/**
	 * @description 发送短信<br>
	 *              接口名称：sendSms <br>
	 * @param {string}
	 *            phoneNo 手机号码
	 * @example YT.sendSms(function(rst){...});
	 */
	sendSms : function(phoneNo) {
		YT.Client.sendSms(phoneNo);
	},
	/**
	 * @description 打电话<br>
	 *              接口名称：callPhone <br>
	 * @param {string}
	 *            phoneNo 手机号码
	 * @example YT.callPhone(function(rst){...});
	 */
	callPhone : function(phoneNo) {
		YT.Client.callPhone(phoneNo);
	},
	/**
	 * @description 获取客户端信息<br>
	 *              接口名称：getClientInfo <br>
	 * @param {function}
	 *            callback 回调函数
	 * @example YT.getClientInfo(function(rst){...}); 回调函数参数属性配置：
	 *          rst.CLIENT_VER_NO 客户端当前版本号 rst.CLIENT_OS 客户端版本类型：A：安卓设备；I:IOS设备
	 */
	getClientInfo : function(callback) {
		YT.Client.getClientInfo(callback);
	},
	/**
	 * @description 银行卡扫描Ocr<br>
	 *              接口名称：clientOcr <br>
	 * @param {function}
	 *            callback 回调函数
	 * @example YT.scanBankCardOCR(function(rst){...},event,{}); 回调函数参数属性配置：
	 *          rst.OCR_INFO 银行卡号 rst.img1Base64 银行卡卡号照片
	 */
	scanBankCardOCR : function(callback, e, params) {
		YT.Client.scanBankCardOCR(callback, e, params);
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
	scanIDCardFrontOCR : function(callback, e, params) {
		YT.Client.scanIDCardFrontOCR(callback, e, params);
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
	scanIDCardBackOCR : function(callback, e, params) {
		YT.Client.scanIDCardBackOCR(callback, e, params);
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
	scanVehicleLicenceFrontOCR : function(callback, e, params) {
		YT.Client.scanVehicleLicenceFrontOCR(callback, e, params);
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
	scanVehicleLicenceBackOCR : function(callback, e, params) {
		YT.Client.scanVehicleLicenceBackOCR(callback, e, params);
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
	scanBusinessLicenceOCR : function(callback, e, params) {
		YT.Client.scanBusinessLicenceOCR(callback, e, params);
	},
	/**
	 * @description 人脸识别<br>
	 *              接口名称：callLiveness <br>
	 * @param {function}
	 *            callback 回调函数
	 * @param {event}
	 *            e 触发的事件：用于Web组件
	 * @param {Object}
	 *            params 传递的参数：用于Web组件
	 * @example YT.liveFaceCheck(function(rst){...},event,{}); 回调函数参数属性配置：
	 * 
	 */
	liveFaceCheck : function(callback, e, params) {
		YT.Client.liveFaceCheck(callback, e, params);
	},
	/**
	 * @description 判断是否为浏览器进入
	 * @example if(YT.isWeb()){};
	 */
	isWeb : function() {
		return YT.Client.isWeb;
	},
	/* ===================客户端交互事件 end====================== */
	/**
	 * @description 组装请求URL
	 * @param {string}
	 *            url 原始URL，只针对具体业务交易，类似于transCode
	 * @param {boolean}
	 *            debug 是否调试模式，在调试模式下采用JSON挡板数据 DEBUG 全局变量，只有DEBUG为2时，debug才生效
	 * @returns {*} 返回拼装好的URL
	 * @example var url = YT.dataUrl('common/sysDate',false);
	 */
	dataUrl : function(url, debug, plugin, jsonFlag) {
		YT.log.info("basePath111==="+basePath);
		console.log("basePath111==="+basePath);
		YT.Collection.changeTimeX();
		url = (url.indexOf("/") == 0) ? url : ("/" + url);
		if ((DEBUG == 1) || ((DEBUG == 2) && debug)) {
			var tools = YT.TestUtil;
			var plus = plugin
					&& (YT.isString(plugin) ? plugin : (tools && tools
							.dispatch(url, plugin))) || "";
			return basePath + "/data/json" + url + plus
					+ (jsonFlag ? ".json" : ".js");
		}
		if(YT.Client.isWebClient === true){
			return basePath + url + ".do";
		}else{
			return url + ".do";
		}
//		var basePath = window.location.origin+"/ares-inte-gateway/";
//		var basePath = "https://sitwxbank.bolz.cn/ares-inte-gateway"
//		return basePath + url + ".do";
//		return url + ".do";
	},
	/**
	 * @description 格式化URL， 在url之后拼接时间戳，避免缓存
	 * @param {string}
	 *            s 请求路径
	 * @returns {string} 拼装时间戳后的url
	 * @example var url = YT.formatUrl('common/sysDate');
	 */
	formatUrl : function(s) {
		return s + (s.indexOf('?') > 0 ? '&t=' : '?t=') + new Date().getTime();
	},
	/**
	 * @description 切换元素Class
	 * @param {elements}
	 *            addHandles 添加目标class的元素(集合)
	 * @param {elements}
	 *            delHandles 删除目标class的元素(集合)
	 * @param {string}
	 *            css 目标class
	 * @example YT.exchangeCss(pageA.find(".more-condition"), pageA.find(".normal-condition"), "hidden");
	 */
	exchangeCss : function(addHandles, delHandles, css) {
		if (delHandles) {
			delHandles.removeClass(css);
		}
		if (addHandles)
			addHandles.addClass(css);
	},
	/**
	 * @description 获取方法名称
	 * @param {function}
	 *            func 方法对象
	 * @param {boolean}
	 *            decodeURL 是否转码，如果该函数的接收参数中包含URL，则该参数需要置为true
	 * @returns {*} 临时方法名
	 * @example cfg.success = YT.getFunctionName(cfg.success);
	 * 临时函数调用：
	 * window[cfg.success]&&window[cfg.success]();
	 */
	getFunctionName : function(func, decodeURL) {
		if (func == null || func == "") {
			return "";
		}
		if (Object.prototype.toString.apply(func) !== '[object Function]') {
			return func;
		}
		var funcName = YT.id();
		// 创建可被调用的临时方法
		window[funcName] = function() {
			var args = [];
			YT.each(arguments, function(arg) {
				if (true == decodeURL) {
					arg = decodeURIComponent(arg);
				}
				if ('string' == typeof arg && '{' == arg.charAt(0)
						&& '}' == arg.charAt(arg.length - 1)) {
					arg = YT.JsonEval(arg.replace(/<\/?[^>]*>/g, '').replace(
							/[\r\n]/g, '<br>'));
				}
				args.push(arg);
			}, this);
			func.apply(this, args);
			delete window[funcName];// 删除临时方法
		};
		return funcName;
	},
	/**
	 * @description 执行回调方法
	 * @param {Object}
	 *            cfg 执行的参数
	 * @param {function}
	 *            callback 执行的函数
	 * @example YT.executeFunc(cfg,function(rst){});
	 */
	executeFunc : function(cfg, callback) {
		callback && callback(cfg)
	},
	/**
	 * @description 获取服务器时间 <br>
	 *              系统默认调用的获取系统时间的接口名称为common/sysDate
	 *              请各系统修改相关的获取各自系统时间的各自系统的接口不可使用“common/sysDate”接口名
	 *              初始化时使用YT.sysDateUrl='common/sysChnlDate'，进行复制操作
	 * @param {function}
	 *            callback 回调函数
	 * @example YT.sysdate(function(rst){});
	 * 回调函数参数属性配置：
	 * rst.CUR_DATE 系统当前日期：yyyy-MM-dd
	 * rst.CUR_TIME 系统当前时间：hh:mm:ss
	 */
	sysdate : function(callback) {
		YT.DateUtils.sysdate(callback);
	},
	/**
	 * @description 获取当前日期前n天
	 * @param {int}
	 *            AddDayCount 负数为前X天 正数为后X天
	 * @param {string}
	 *            startDate 当前日期
	 * @returns {*} 计算后的日期 'yyyy-MM-dd'
	 * @example YT.getDate(1,'2018-10-11');
	 */
	getDate : function(AddDayCount, startDate) {
		return YT.DateUtils.getDate(AddDayCount, startDate);
	},
	/**
	 * @description 计算两个日期相差天数
	 * @param {string}
	 *            aVal 结束日期
	 * @param {string}
	 *            bVal 开始日期
	 * @returns {int} 相差天数
	 * @example YT.dateDiff('2018-10-12','2018-10-11');
	 */
	dateDiff : function(aVal, bVal) {
		return YT.DateUtils.dateDiff(aVal, bVal);
	},
	/**
	 * @description 日期字符串转星期
	 * @param {string}
	 *            dataStr 日期字符串
	 * @returns {string} 星期：星期天，星期一，星期二。。。
	 * @example YT.dateDiff('2018-10-12','2018-10-11');
	 */
	dateToWeek : function(dataStr) {
		return YT.DateUtils.dateToWeek(dataStr);
	},
	/**
	 * @description 两数相加
	 * 
	 * @param {float}
	 *            a 加数1
	 * @param {float}
	 *            b 被加数2
	 * @return {float} 返回两数相加结果
	 * 
	 * @example YT.add(1,2);
	 */
	add : function(a, b) {
		return YT.NumberUtils.add(a, b);
	},
	/**
	 * @description 两数相减
	 * 
	 * @param {float}
	 *            a 减数1
	 * @param {float}
	 *            b 被减数2
	 * @return {float} 返回相减结果
	 * 
	 * @example YT.sub(2,1);
	 */
	sub : function(a, b) {
		return YT.NumberUtils.sub(a, b);
	},
	/**
	 * @description 两数相乘
	 * 
	 * @param {float}
	 *            a 乘数1
	 * @param {float}
	 *            b 乘减数2
	 * @return {float} 返回两数相乘结果
	 * 
	 * @example YT.mul(2,3);
	 */
	mul : function(a, b) {
		return YT.NumberUtils.mul(a, b);
	},
	/**
	 * @description 两数相除
	 * 
	 * @param {float}
	 *            a 乘除1
	 * @param {float}
	 *            b 乘除数2
	 * @return {float} 返回相除结果
	 * 
	 * @example YT.div(3,2);
	 */
	div : function(a, b) {
		return YT.NumberUtils.div(a, b);
	},
	/**
	 * @description 进入系统首页
	 * @param {string}
	 *            url 地址
	 * @param {function}
	 *            func 回调函数
	 * @example YT.loadIndexPage();
	 */
	loadIndexPage : function(url, func) {
		YT.NavUtil.loadIndexPage(url, func);
	},
	/**
	 * @description 下一页
	 * @param {string}
	 *            url 页面路径
	 * @param {Object}
	 *            params 初始化参数
	 * @param {Boolean}
	 * 			  record 是否不记录当前页面 默认false记录
	 * @example YT.nextPage(url, conf);
	 */
	nextPage : function(url, params, record) {
		YT.setParameters(params);
		YT.NavUtil.nextPage(url, record);
	},
	/**
	 * @description 返回上一页
	 * @example YT.prevPage();
	 */
	prevPage : function(refresh) {
		YT.NavUtil.prevPage(refresh);
	},
	/**
	 * @description 返回首页
	 * @example YT.gotoIndex();
	 */
	gotoIndex : function() {
		YT.NavUtil.gotoIndex();
	},
	/**
	 * @description 刷新当前页面
	 * @example YT.refreshPage();
	 */
	refreshPage : function() {
		YT.NavUtil.refreshPage();
	},
	/**
	 * @description 显示左侧菜单
	 * @example YT.openLeftMenu();
	 *
	 */
	openLeftMenu : function(url) {
		YT.NavUtil.openLeftMenu();
	},
	/**
	 * @description 显示右侧菜单
	 * @example YT.openRightMenu();
	 *
	 */
	openRightMenu : function(url) {
		YT.NavUtil.openRightMenu();
	},
	/**
	 * @description 生成随机的唯一标识
	 * @returns {string} uid字符串
	 * @example var uid = YT.guid();
	 */
	guid : function() {
		var tpl = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
		return tpl.replace(/[xy]/g, function(c) {
			var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	},
	/**
	 * @description 获取用户信息
	 * @returns json
	 * @example var uid = YT.guid();
	 */
	getUserInfo : function(callback){
//		YT.Client.getUserInfo(callback);
		var theRequest = JSON.parse(localStorage.getItem("theRequest"));
		var url = YT.dataUrl("general/checkAuthentica", false);
		YT.openWaitPanel();
		YT.ajaxData(url, { "openId": theRequest.openid}, function(data) {
			YT.hideWaitPanel();
			callback && callback(data)
		},function(error){
			YT.hideWaitPanel();
			YT.alertinfo(error.MSG,"温馨提示",YT.hideWaitPanel());
		})
	}
};
YT.namespace('YT.core', 'YT.util', 'YT.device');
Fw = YT;
$.postAjax = {};
// 扩展jquery方法
$.fn.extend({
	/**
	 * @description 根据css样式，冒泡选取上级节点
	 * @param {string}
	 *            cls css样式
	 * @return {element} 元素节点
	 * @example ele.bubbleByCls('class');
	 */
	bubbleByCls : function(cls) {
		var parent = this.parent();
		if (!cls || !parent)
			return null;
		if (parent.hasClass(cls)) {
			return parent;
		}
		return parent.bubbleByCls(cls);
	}
});
