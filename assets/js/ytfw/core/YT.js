/**
 * @fileOverview 核心js基类,提供全局可用api；只提供功能引用代码，不提供功能实现代码；
 * @nameSpace YT
 */
var keyBoardEle;
var YT = {
	idSeed: 10000,
	/**
	 * 提供资源加载
	 * <code>
	 * YT.imports(["page/02/06/P0206.css"]); 
	 * YT.imports(["page/02/06/P0206","YT.CardMove"], function(main) {
		main.init(P0206);
	}); 
	 * </code>
	 */
	imports: seajs.use, // 内部声明
	/**
	 * @description 获取唯一id
	 * @returns {string} id
	 * @example var _id = YT.id();
	 */
	id: function () {
		return 'yt_gen_' + (++YT.idSeed);
	},
	emptyFn: function () {},
	/**
	 * @description 获取日志输出对象
	 * @returns {*} 返回日志对象
	 * @example 1.日志信息 YT.log.info('日志内容信息。。。。'); 
	 * 2.调试信息 YT.log.debug('日志内容信息。。。。'); 
	 * 3.警告信息 YT.log.warn('日志内容信息。。。。');
	 * 4.错误信息 YT.log.error('日志内容信息。。。。');
	 */
	//log : window.Logger(),
	log: {
		/** 日志信息 */
		info: function () {},
		/** 调试信息 */
		debug: function () {},
		/** 警告信息 */
		warn: function () {},
		/** 错误信息 */
		error: function () {}
	},
	/**
	 * @description 定义命名空间
	 * @returns {*} 返回命名空间
	 */
	namespace: function () {
		var space = null,
			path;
		YT.each(arguments, function (v) {
			path = v.split('.');
			space = window[path[0]] = window[path[0]] || {};
			YT.each(path.slice(1), function (v2) {
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
	apply: function (object, config, defaults) {
		if (defaults) {
			YT.apply(object, defaults);
		}
		if (object && config && YT.isObject(config)) {
			for (var property in config) {
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
	applyIf: function (object, config) {
		if (object) {
			for (var p in config) {
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
	extend: function () {
		var objectConstructor = Object.prototype.constructor,
			inlineOverrides = function (
				o) {
				for (var m in o) {
					if (!o.hasOwnProperty(m)) {
						continue;
					}
					this[m] = o[m];
				}
			};
		return function (subclass, superclass, overrides) {
			if (YT.isObject(superclass)) {
				overrides = superclass;
				superclass = subclass;
				subclass = overrides.constructor !== objectConstructor ? overrides.constructor :
					function () {
						superclass.apply(this, arguments);
					};
			}
			if (!superclass) {
				return null;
			}
			//
			var F = function () {};
			var subclassProto, superclassProto = superclass.prototype;
			F.prototype = superclassProto;
			subclassProto = subclass.prototype = new F();
			subclassProto.constructor = subclass;
			subclass.superclass = superclassProto;
			if (superclassProto.constructor === objectConstructor) {
				superclassProto.constructor = superclass;
			}
			subclass.override = function (overrides) {
				YT.override(subclass, overrides);
			};
			subclassProto.override = inlineOverrides;
			subclassProto.proto = subclassProto;
			subclass.override(overrides);
			subclass.extend = function (o) {
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
	override: function (cls, overrides) {
		YT.apply(cls.prototype, overrides);
	},
	/**
	 * @description 转换为字符
	 * @param {Object}
	 *            v 转换对象
	 * @returns {string} 返回字符串
	 * @example var str = YT.toString({STATUS:"1"});
	 */
	toString: function (v) {
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
	isDefined: function (v) {
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
	isEmpty: function (v, allowBlank) {
		return v === null || v === undefined ||
			String(v).toUpperCase() === 'NULL' ||
			((YT.isArray(v) && !v.length)) ||
			(!allowBlank ? v === '' : false);
	},
	/**
	 * @description 是否是数组
	 * @param {*}
	 *            v 值
	 * @returns {*|boolean} 是否为数组
	 * @example var arry = [];
	 * var isArray = YT.isArray(arry);
	 */
	isArray: function (v) {
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
	isDate: function (v) {
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
	isObject: function (v) {
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
	isFunction: function (v) {
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
	isNumber: function (v) {
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
	isString: function (v) {
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
	isBoolean: function (v) {
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
	isPrimitive: function (v) {
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
	isIterable: function (v) {
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
	isUrl: function (v) {
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
	getRandom: function (num) {
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
	setPrevPanel: function (panel) {
		YT._prevPanel = panel;
	},
	/**
	 * @description 获取上一页面的dom元素节点
	 * @returns {element} 元素节点
	 * @example var prevPanel = YT.getPrevPanel();
	 */
	getPrevPanel: function () {
		return YT._prevPanel;
	},
	/**
	 * @description 清空上一页面的dom元素节点
	 * @example YT.clearPrevPanel();
	 */
	clearPrevPanel: function () {
		YT._prevPanel = undefined;
	},
	/**
	 * @description 保存parameters参数
	 * @param {*}
	 *            params 参数
	 * @example YT.setParameters({STATUS:'1'});
	 */
	setParameters: function (data) {
//		 YT._data = data;
		YT.setStorage({
			data
		})
	},
	/**
	 * @description 返回parameters参数 特指页面跳转间传递的参数
	 * @returns {*} 参数
	 * @example var params = YT.getParameters();
	 */
	getParameters: function () {
		// return YT._data || {};
		return YT.getStorage({})
	},
	/**
	 * 
	 * 设置参数--异步方法(客户端)
	 * @param {*} cfg = {
	 * 	key, // key
	 * 	data, // 值
	 * 	callback // 回调
	 * }
	 */
	setStorage: function (cfg) {
		if (Device.YiTong !== true || !cfg.callback) {
			cfg.data = YT.isString(cfg.data) ? JSON.parse(cfg.data): cfg.data;
			if (cfg.callback) {
				YT._data = cfg.data;
				cfg.callback('success');
			} else {
				YT._data = cfg.data;
			}
		} else { // 新数据传递方法
			YT.Client.setStorage(cfg)
		}
	},
	/**
	 * 
	 * 设置参数--同步方法(客户端)
	 * @param {*} cfg = {
	 * 	key, // key
	 * 	data, // 值
	 * 	callback // 回调
	 * }
	 */
	setStorageSync: function (key, datas) {
		return YT.Client.setStorageSync(key, datas);
	},

	/**
	 * 
	 * @param {*} cfg = {
	 * 	key, // key
	 * 	clear, // 取值后是否清理
	 * 	callback // 回调
	 * }
	 */
	getStorage: function (cfg) {
		if (Device.YiTong !== true || !cfg.callback) {
			if (cfg.callback) {
				cfg.callback(YT._data || {});
			} else {
				return YT._data || {};
			}
		} else { // 新数据传递方法
			YT.Client.getStorage(cfg)
		}
	},
	/**
	 * 取参数--同步方法(客户端)
	 *  key, // key
	 *  clear, // 取值后是否清理
	 */
	getStorageSync: function (key, clear) {
		return YT.Client.getStorageSync(key, clear)
	},
	/**
	 * 执行window中方法
	 * 跨包传值使用
	 */
	execWindowFunc: function(funcName, params){
		if(!YT.isEmpty(funcName)){
			if(window[funcName]){
				window[funcName](params);
			}else{
				YT.log.info('跨包了......');
				var config = {
					func: funcName,
					params: params
				}
				YT.setStorageSync('__storageFuncNameItem__', config).then();
			}
		}
	},
	getUrlParams: function () {
		var url = location.search; //
		var theRequest = new Object();
		if (url.indexOf("?") != -1) {
			var str = url.substr(1);
			strs = str.split("&");
			for (var i = 0; i < strs.length; i++) {
				theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
			}
		}
		return theRequest;
	},
	/**
	 * @description 清空 页面间跳转的参数
	 * @example YT.clearParameters();
	 */
	clearParameters: function () {
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
	each: function (value, fn, scope) {
		if (YT.isEmpty(value)) {
			return;
		}
		if (!YT.isDefined(scope)) {
			scope = value;
		}
		if (YT.isObject(value)) {
			var i = 0;
			for (var prop in value) {
				if (value.hasOwnProperty(prop)) {
					if (fn.call(scope || value, prop, value[prop], i++, value) === false) {
						return;
					}
				}
			}
		} else {
			if (!YT.isIterable(value) || YT.isPrimitive(value)) {
				value = [value];
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
	bind: function (fn, scope) {
		if (!YT.isFunction(fn)) {
			return fn;
		}
		return function () {
			return fn.apply(scope, arguments);
		};
	},
	/**
	 * @description 定义模块 桥接Seajs http://seajs.org
	 * @param {*}
	 *            factory 参数
	 * @example YT.define();
	 */
	define: function (factory) {
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
	template: function () {
		var args = arguments;
		var tpl = args[0];
		if (YT.isArray(tpl)) {
			if (tpl.length > 1) {
				var arr = [],
					funs = {};
				// 从模版中分出自定义函数
				YT.each(tpl, function (item) {
					if (YT.isObject(item)) {
						YT.apply(funs, item);
					} else {
						arr.push(item);
					}
				});
				// 注册自定义函数
				YT.each(funs, function (prop, fun) {
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
	JsonToStr: function (json) {
		return JSON.stringify(json);
	},
	/**
	 * @description String转换为JSON
	 * @param {string}
	 *            str json字符串
	 * @returns {Object} json对象
	 * @example YT.JsonEval('{"STATUS":"1"}');
	 */
	JsonEval: function (str) {
		return eval("(" + str + ")");
	},
	/* ===================客户端交互事件 start====================== */
	/**
	 * @description 隐藏键盘，仅供客户端调用
	 * @param {string}
	 *            id 键盘容器id
	 * @example YT._hideKeyboard();
	 */
	_hideKeyboard: function (id) {
		$('#mainBody .navbar-views').css({
			'-webkit-transform': "initial",
			'transform': "initial"
		});
		$('#mainBody .yui-auth-form').css({
			'-webkit-transform': 'initial',
			'transform': 'initial'
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
	_preShowKeyBoard: function ($ele) {
		if (YT.isString($ele)) {
			$ele = $('#' + $ele);
		}
		var boardH = YT.isNumber(YT.KeyBoardHight) ? YT.KeyBoardHight : 300; // 自定义键盘高度
		var eh = $ele.height(); // 元素的高度
		var top = $ele.offset().top;
		var stop = $(window).scrollTop(); // 滚动条高度
		if (W_HEIGHT < 100) {
			W_HEIGHT = $(window).height();
		}
		// 15为偏差量
		var newTop = W_HEIGHT + stop - top - eh;
		if (newTop < boardH) {
			$('#mainBody .views').css({
				'-webkit-transform': 'translateY(' + (newTop - boardH) + 'px)',
				'transform': 'translateY(' + (newTop - boardH) + 'px)'
			});
			$('#mainBody .yui-auth-form').css({
				'-webkit-transform': 'translateY(' + (newTop - boardH) + 'px)',
				'transform': 'translateY(' + (newTop - boardH) + 'px)'
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
	initEvent: function (panel) {
		var thizz = this;
		var evtName = {
			TPwd: 'showTPwdPicker', // 交易密码
			LPwd: 'showLPwdPicker', // 登录密码
			Date: 'showDatePicker', // 日期
			Money: 'showMoneyPicker', // 金额
			Number: 'showNumPicker', // 数字
			IDC: 'showIDCPicker' // 证件
		};
		// 注册控件调用方法
		panel.on('click', 'input[data-keyboard]', function (e) {
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
			YT.Client && YT.Client[evtFunc] && YT.Client[evtFunc](that);
			return false;
		});
	},
	/**
	 * @description 是否支持touch事件
	 * @returns {boolean} 是否支持touch事件
	 * @example if(YT.touch()){};
	 */
	touch: function () {
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
	initPageEvent: function (panel, app) {
		var func = function (e, elem, prop) {
			var evtName = elem.data(prop);
			app[evtName] && app[evtName](e, elem);
		};
		// 点击事件
		panel.on("click", "[data-event]", function (e) {
			func && func(e, $(this), "event")
		});
		// 下拉列表 change事件
		panel.on("change", "[data-change]", function (e) {
			func && func(e, $(this), "change");
		});
		// 输入框 change事件
		panel.on("input", "[data-input]", function (e) {
			func && func(e, $(this), "input");
		});
		// 输入框 失去焦点事件
		panel.on("blur", "[data-blur]", function (e) {
			func && func(e, $(this), "blur");
		});
		// 获取光标
		panel.on("focus", "[data-focus]", function (e) {
			func && func(e, $(this), "focus");
		});
		// 默认绑定的功能切换
		panel.on('click', '[data-jump]', function (e) {
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
	 * @description 显示页面区域，控制业务流程，换面切换
	 * @param {element}
	 *            showHandle 要展示的页面区域
	 * @param {Object[]}
	 *            hideHandles 要隐藏的页面区域集合数组
	 * @param {boolean}
	 *            showTitle 是否显示title
	 * @example YT.showPageArea(pageA, [pages], true);
	 */
	showPageArea: function (showHandle, hideHandles, showTitle) {
		YT.NavUtil.showPageArea(showHandle, hideHandles, showTitle);
		try {
			YT.AuthBox && YT.AuthBox.closeAuth();
			var evt = new Event('resize');
			window.dispatchEvent(evt);
		} catch (e) {}
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
	 * @example YT.loadPage(pageB, TAG + "02_tpl_result.html", data, mmee.showPageB, );
	 */
	loadPage: function (pageHandle, tplUrl, params, callback, app) {
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
	getPage: function (url, params, success, error) {
		YT.AjaxUtil.getPage(url, params, success, error);
	},
	/**
	 * @description 开启等待层<br>
	 *              接口名称：openWaitPanel <br>
	 * @param {string}
	 *            msg 显示内容
	 * @example YT.openWaitPanel('正在拼命加载中。。。');
	 */
	openWaitPanel: function (msg) {
		msg = msg || "正在加载中。。。", YT.Client.openWaitPanel(msg);
	},
	/**
	 * @description 关闭等待层<br>
	 *              接口名称：hideWaitPanel <br>
	 * @param {number}
	 *            timeout 延时时间（毫秒）
	 * @example YT.hideWaitPanel(timeout);
	 */
	hideWaitPanel: function (timeout) {
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
	alertinfo: function (msg, title, okAct, okName) {
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
	confirm: function (msg, title, okAct, cancleAct, okName, cancleName) {
		YT.Client.confirm(msg, title, okAct, cancleAct, okName, cancleName);
	},
	/**
	 * @description 获取登录系统后存储session信息
	 * @param {function}
	 *            callback 获取到回调
	 * @example YT.getSession(function(rst){// 获取登录用户信息后操作});
	 */
	getSession: function (callback) {
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
	getCacheSession: function (sessKey, callback, cacheType) {
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
	setCacheSession: function (sessKey, sessData, cacheType) {
		YT.Client.setSession(sessKey, JSON.stringify(sessData), cacheType);
	},
	/**
	 * @description 显示警告提示信息
	 * @param {msg}
	 *            msg 显示信息
	 * @example YT.showTips('警告信息');
	 */
	showTips: function (msg) {
		YT.Tips.showTips({
			content: msg,
			stayTime: 2000,
			type: "warn"
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
	ajaxData: function (url, params, success, failure) {

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
	onceAjaxData: function (url, params, success, failure) {
		YT.AjaxUtil.onceAjaxData(url, params, success, failure);
	},
	/**
	 * @description 判断是否为浏览器进入
	 * @example if(YT.isWeb()){};
	 */
	isWeb: function () {
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
	dataUrl: function (url, debug, plugin, jsonFlag) {
		YT.Collection.changeTimeX();
		url = (url.indexOf("/") == 0) ? url : ("/" + url);
		if ((DEBUG == 1) || ((DEBUG == 2) && debug)) {
			var tools = YT.TestUtil;
			var plus = plugin &&
				(YT.isString(plugin) ? plugin : (tools && tools
					.dispatch(url, plugin))) || "";
			return basePath + "/data/json" + url + plus +
				(jsonFlag ? ".json" : ".js");
		}
		//return basePath + url + ".do";
		if (YT.Client.isWebClient === true) {
			return basePath + url + ".do";
		} else {
			return url + ".do";
		}
	},
	/**
	 * @description 格式化URL， 在url之后拼接时间戳，避免缓存
	 * @param {string}
	 *            s 请求路径
	 * @returns {string} 拼装时间戳后的url
	 * @example var url = YT.formatUrl('common/sysDate');
	 */
	formatUrl: function (s) {
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
	exchangeCss: function (addHandles, delHandles, css) {
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
	getFunctionName: function (func, decodeURL) {
		if (func == null || func == "") {
			return "";
		}
		if (Object.prototype.toString.apply(func) !== '[object Function]') {
			return func;
		}
		var funcName = YT.id();
		// 创建可被调用的临时方法
		window[funcName] = function () {
			var args = [];
			YT.each(arguments, function (arg) {
				if (true == decodeURL) {
					arg = decodeURIComponent(arg);
				}
				if ('string' == typeof arg && '{' == arg.charAt(0) &&
					'}' == arg.charAt(arg.length - 1)) {
					arg = YT.JsonEval(arg.replace(/<\/?[^>]*>/g, '').replace(
						/[\r\n]/g, '<br>'));
				}
				args.push(arg);
			}, this);
			func.apply(this, args);
			delete window[funcName]; // 删除临时方法
		};
		return funcName;
	},
	// 跨包传值使用
	getFunctionNameCross: function (func, decodeURL) {
		if (func == null || func == "") {
			return "";
		}
		if (Object.prototype.toString.apply(func) !== '[object Function]') {
			return func;
		}
		var funcName = YT.id() + '_cross';
		// 创建可被调用的临时方法
		window[funcName] = function () {
			var args = [];
			YT.each(arguments, function (arg) {
				if (true == decodeURL) {
					arg = decodeURIComponent(arg);
				}
				if ('string' == typeof arg && '{' == arg.charAt(0) &&
					'}' == arg.charAt(arg.length - 1)) {
					arg = YT.JsonEval(arg.replace(/<\/?[^>]*>/g, '').replace(
						/[\r\n]/g, '<br>'));
				}
				args.push(arg);
			}, this);
			func.apply(this, args);
			delete window[funcName]; // 删除临时方法
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
	executeFunc: function (cfg, callback) {
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
	sysdate: function (callback) {
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
	getDate: function (AddDayCount, startDate) {
		return YT.DateUtils.getDate(AddDayCount, startDate);
	},
	/**
	 * @description 进入系统首页
	 * @param {string}
	 *            url 地址
	 * @param {function}
	 *            func 回调函数
	 * @example YT.loadIndexPage();
	 */
	loadIndexPage: function (url, func) {
		YT.NavUtil.loadIndexPage(url, func);
	},
	/**
	 * @description 下一页
	 * @param {string}
	 *            url 页面路径
	 * @param {Object}
	 *            params 初始化参数
	 * @example YT.nextPage(url, conf);
	 */
	nextPage: function (url, params) {
		if (!YT.isEmpty(params)) {
			YT.setStorageSync('__storageItem__', params).then(rsp => {
				YT.NavUtil.nextPage(url);
			});
		} else {
			YT.NavUtil.nextPage(url);
		}
	},
	/**
	 * @description 返回上一页
	 * @example YT.prevPage();
	 */
	prevPage: function (refresh) {
		YT.NavUtil.prevPage(refresh);
	},
	/**
	 * @description 返回首页
	 * @example YT.gotoIndex();
	 */
	gotoIndex: function () {
		YT.NavUtil.gotoIndex();
	},
	/**
	 * @description 刷新当前页面
	 * @example YT.refreshPage();
	 */
	refreshPage: function () {
		YT.NavUtil.refreshPage();
	},
	/**
	 * @description 显示左侧菜单
	 * @example YT.openLeftMenu();
	 *
	 */
	openLeftMenu: function (url) {
		YT.NavUtil.openLeftMenu();
	},
	/**
	 * @description 显示右侧菜单
	 * @example YT.openRightMenu();
	 *
	 */
	openRightMenu: function (url) {
		YT.NavUtil.openRightMenu();
	},
	/**
	 * @description 生成随机的唯一标识
	 * @returns {string} uid字符串
	 * @example var uid = YT.guid();
	 */
	guid: function () {
		var tpl = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
		return tpl.replace(/[xy]/g, function (c) {
			var r = Math.random() * 16 | 0,
				v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	}
};
YT.namespace('YT.core', 'YT.util', 'YT.device');
var Fw = YT;
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
	bubbleByCls: function (cls) {
		var parent = this.parent();
		if (!cls || !parent)
			return null;
		if (parent.hasClass(cls)) {
			return parent;
		}
		return parent.bubbleByCls(cls);
	}
});