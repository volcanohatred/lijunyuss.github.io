/**
 * 
 * @fileOverview 格式化通用类
 * @nameSpace YT.Format
 */
(function() {
	var me = YT.Format = {
		/**
		 * @description 列表索引默认为从0开始计数，修正为从1开始计数
		 * @param {int}
		 *            i 下表
		 * @returns {Number} 序号
		 * @example 1.JS中直接调用: var s = YT.Format.listIndex(0);
		 *          2.html中使用juicer渲染: ${index|listIndex}
		 */
		listIndex : function(i) {
			return i * 1 + 1;
		},
		itemToString : function(item) {
			return JSON.stringify(item);
		},
		/**
		 * @description 转译 NS键值
		 * @param {string}
		 *            key 值
		 * @param {string}
		 *            type 类型
		 * @returns {string} 转译后的字符
		 * @example 1.JS中直接调用:<br>
		 *          &nbsp&nbsp证件类型: <br>
		 *          var s = YT.Format.fmtNsType(value,'IDT_TYPE');<br>
		 *          2.html中使用juicer渲染: <br>
		 *          &nbsp&nbsp证件类型: ${value|fmtNsType,'IDT_TYPE'} <br>
		 */
		fmtNsType : function(key, type) {
			return NS[type] && NS[type][key] || key;
		},
		/**
		 * @description 账号格式化、 添加空格分隔符 hidden = true将隐藏部分号码
		 * @param {string}
		 *            value 账户
		 * @param hidden
		 *            {bool} 是否隐藏账户 true为隐藏
		 * @returns {string} 转译后的字符
		 * @example 1.JS中直接调用:<br>
		 *          var s = YT.Format.fmtAcctNo(value,true); 2.html中使用juicer渲染:
		 *          ${value|fmtAcctNo,true}<br>
		 */
		fmtAcctNo : function(value, hidden) {
			if (YT.isEmpty(value)) {
				return "";
			}
			value = me.removeSpace(value);
			var tmpStr = "";
			if (hidden) {
				var start = value.length - 4;
				if (start < 4) {
					start = 4;
				}
				tmpStr = tmpStr + value.substring(0, 4) + " **** **** " + value.substring(start, value.length);
			} else {
				while (value.length > 4) {
					tmpStr = tmpStr + value.substring(0, 4);
					tmpStr = tmpStr + " ";
					value = value.substring(4, value.length);
				}
				tmpStr = tmpStr + value;
			}
			return tmpStr;
		},
		/**
		 * @description 卡号末4位
		 * @param {string}
		 *            value 账户
		 * @returns {string} 转译后的字符
		 * @example 1.JS中直接调用:<br>
		 *          var s = YT.Format.fmtAcctStop4(value);<br>
		 *          2.html中使用juicer渲染: ${value|fmtAcctStop4}<br>
		 */
		fmtAcctStop4 : function(value) {
			if (YT.isEmpty(value)) {
				return "";
			}
			var n = 4;
			var acct4 = value.substring(value.length - n, value.length);
			return acct4;
		},
		/**
		 * @description 卡号格式化，监听输入框输入数据后实时格式化
		 * @param {element}
		 *            ele 卡号组件dom对象
		 * @example YT.Format.fmtAccInput(ele);
		 */
		fmtAccInput : function(ele) {
			ele.on("keyup", function() {
				var oW = ele.val();
				ele.val(oW.replace(/\s/g, '').replace(/(\d{4})(?=\d)/g, "$1 "));
			});
		},
		/**
		 * @description 格式化手机 data-type='phone'
		 * @param {string}
		 *            value 手机
		 * @returns {string} 格式后的字符
		 * @example 1.JS中直接调用:<br>
		 *          var s = YT.Format.fmtPhoneNo(value);<br>
		 *          2.html中使用juicer渲染: ${value|fmtPhoneNo}<br>
		 */
		fmtPhoneNo : function(value) {
			if (YT.isEmpty(value)) {
				return "";
			}
			value = me.removeSpace(value);
			var tmpStr = "";
			var start = value.length - 4;
			if (start < 4) {
				start = 4;
			}
			tmpStr = tmpStr + value.substring(0, 3) + " **** " + value.substring(start, value.length);
			return tmpStr;
		},
		/**
		 * @description 格式化证件号码
		 * @param {string}
		 *            value 证件号
		 * @returns {string} 格式后的字符
		 * @example 1.JS中直接调用:<br>
		 *          var s = YT.Format.fmtIdNo(value);<br>
		 *          2.html中使用juicer渲染: ${value|fmtIdNo}<br>
		 */
		fmtIdNo : function(value) {
			if (YT.isEmpty(value)) {
				return "";
			}
			value = me.removeSpace(value);
			var tmpStr = "";
			var start = value.length - 2;
			if (start < 2) {
				start = 2;
			}
			tmpStr = tmpStr + value.substring(0, 2) + " **** **** " + value.substring(start, value.length);
			return tmpStr;
		},
		/**
		 * @description 用户姓名格式化
		 * @param {string}
		 *            value 姓名
		 * @returns {string} 格式后的字符
		 * @example 1.JS中直接调用:<br>
		 *          var s = YT.Format.fmtCustName(value);<br>
		 *          2.html中使用juicer渲染: ${value|fmtCustName}<br>
		 */
		fmtCustName : function(value) {
			if (YT.isEmpty(value)) {
				return "";
			}
			value = me.removeSpace(value);
			var tmpStr = "";
			tmpStr = "*" + value.substring(1, value.length);
			return tmpStr;
		},
		/**
		 * @description 去除字符串空格
		 * @param {string}
		 *            value 字符串
		 * @returns {string} 格式后的字符
		 * @example 1.JS中直接调用:<br>
		 *          var s = YT.Format.removeSpace(value);<br>
		 *          2.html中使用juicer渲染: ${value|removeSpace}<br>
		 */
		removeSpace : function(value) {
			if (YT.isEmpty(value)) {
				return "";
			}
			return value.replace(/\s/g, "");
		}, 
		/**
		 * @description 日期格式化
		 * @param {string}
		 *            v 日期字符串
		 * @param {string}
		 *            format 日期格式
		 * @returns {string} 格式后的字符
		 * @example 1.JS中直接调用:<br>
		 *          var str = "2017-12-18 11:21:22"; //var str =
		 *          "20171218112122";<br>
		 *          YT.Format.fmtDate(str,'yyyy年MM月dd日 hh点mm分ss秒'); ==>
		 *          2017年12月18日11点21分22秒 <br>
		 *          YT.Format.fmtDate(str,'yyyy-MM-dd hh:mm:ss'); ==> 2017-12-18
		 *          11:21:22 <br>
		 *          YT.Format.fmtDate(str,'yyyy-MM-dd hh:mm'); ==> 2017-12-18
		 *          11:21<br>
		 *          YT.Format.fmtDate(str,'yyyy-MM-dd'); ==> 2017-12-18 <br>
		 *          2.html中使用juicer渲染: ${value|fmtDate,'yyyy-MM-dd'}<br>
		 */
		fmtDate : function(v, format) {
			if (YT.isEmpty(v))
				return "";
			if (!YT.isDate(v)) {
				v = new Date(v);
			}
			return v.format(format || 'yyyy年MM月dd日');
		},
		/**
		 * @description 格式化金额
		 * @param {float}
		 *            v 原始金额
		 * @param {int}
		 *            c 小数点后保留为数（默认为2）
		 * @param {int}
		 *            d 小数点
		 * @param {string}
		 *            t 整数区千位分割（默认为逗号）
		 * @returns {string} 格式后的字符
		 * @example 1.JS中直接调用:<br>
		 *          var s = YT.Format.fmtMoney(v,2,4,",");<br>
		 *          2.html中使用juicer渲染: ${v|fmtMoney,2,2,","}<br>
		 */
		fmtMoney : function(v, c, d, t) {
			v = v + "";
			v = v.replace(/,/g, "");
			v *= 1;
			var p = v < 0 ? '-' : '';
			c = c || 2;
			v = v.toFixed(c);
			c = Math.abs(c) + 1 ? c : 2;
			d = d || '.';
			t = t || ',';
			var m = (/(\d+)(?:(\.\d+)|)/.exec(v + ''));
			var x = m[1].length > 3 ? m[1].length % 3 : 0;
			return p + (x ? m[1].substr(0, x) + t : '') + m[1].substr(x).replace(/(\d{3})(?=\d)/g, '$1' + t)
					+ (c ? d + (+m[2] || 0).toFixed(c).substr(2) : '');
		},

		/**
		 * @description 金额格式化保留2位小数点
		 * @param {float}
		 *            s 原始金额
		 * @returns {string} 格式后的字符
		 * @example 1.JS中直接调用:<br>
		 *          var s = YT.Format.fmtAmt(v);<br>
		 *          2.html中使用juicer渲染: ${v|fmtAmt}<br>
		 */
		fmtAmt : function(s) {
			try {
				return me.fmtMoney(s, 2, ".", ",");
			} catch (e) {
				return "0.00";
			}
		},
		/**
		 * @description 数量格式化""显示为0否则返回s
		 * @param {float}
		 *            s 原始数字
		 * @returns {string} 格式后的字符
		 * @example 1.JS中直接调用:<br>
		 *          var s = YT.Format.fmtNum(v);<br>
		 *          2.html中使用juicer渲染: ${v|fmtNum}<br>
		 */
		fmtNum : function(s) {
			if (s == "") {
				return "0";
			} else {
				return s;
			}
		},
		/**
		 * @description 距离格式化如果s为""显示为""如果s<1000? s+"m" :
		 *              (s/1000).toFixed(1)+"km"
		 * @param {float}
		 *            s 原始数字
		 * @returns {string} 格式后的字符
		 * @example 1.JS中直接调用:<br>
		 *          var s = YT.Format.fmtDistance(v);<br>
		 *          2.html中使用juicer渲染: ${v|fmtDistance}<br>
		 */
		fmtDistance : function(s) {
			if (s == "") {
				return s;
			} else {
				s = parseInt(s * 100 / 100);// 去掉小数部分
				s1 = s + "";
				if (s1.length > 4 || s1.length == 4) {// 整数部分大于等于4位显示km，小数部分保留一位
					return (s1 / 1000.0).toFixed(1) + "km";
				} else {// 整数部分小于4位，显示m
					return s1 + "m";
				}
			}
		},
		/**
		 * @description 金额格式化保留4位小数点
		 * @param {float}
		 *            s 原始数字
		 * @returns {string} 格式后的字符
		 * @example 1.JS中直接调用:<br>
		 *          var s = YT.Format.fmtAmt4s(v);<br>
		 *          2.html中使用juicer渲染: ${v|fmtAmt4s}<br>
		 */
		fmtAmt4s : function(s) {
			try {
				return me.fmtMoney(1.0000 * s, 4, ".", ",");
			} catch (e) {
				return "0.0000";
			}
		},

		/**
		 * @description 去除金额格式化
		 * @param {*|string}
		 *            b 格式化后的数字
		 * @returns {string} 格式后的字符
		 * @example 1.JS中直接调用:<br>
		 *          var s = YT.Format.delFmtMony(v);<br>
		 *          2.html中使用juicer渲染: ${v|delFmtMony}<br>
		 */
		delFmtMony : function(b) {
			var a = b.trim() + "";
			if (a.indexOf(".") != -1) {
				a = a.substr(0, a.indexOf(".") + 3);
			}
			return a.replace(/,/g, "");
		},

		/**
		 * @description 金额去格式化
		 * @param {*|string}
		 *            b 格式化后的数字
		 * @returns {string} 格式后的字符
		 * @example 1.JS中直接调用:<br>
		 *          var s = YT.Format.unfmtAmt(v);<br>
		 *          2.html中使用juicer渲染: ${v|unfmtAmt}<br>
		 */
		unfmtAmt : function(s) {
			if (YT.isEmpty(s)) {
				return "";
			}
			return s.replace(/,/g, "");
		},

		/**
		 * @description 利率格式化,默认两位小数
		 * @param {*|float}
		 *            b 初始数据
		 * @returns {string} 格式后的字符
		 * @example 1.JS中直接调用:<br>
		 *          var s = YT.Format.fmtAddPercent(v);<br>
		 *          2.html中使用juicer渲染: ${v|fmtAddPercent}<br>
		 */
		fmtAddPercent : function(b) {
			var a = Math.floor(b * 100) / 100;
			a = (a.toFixed(2));
			return a + "%";
		},
		/**
		 * @description 格式化数字为大写汉字
		 * @param {*|float}
		 *            num 初始化数字
		 * @returns {string} 转译后的字符
		 * @example 1.JS中直接调用:<br>
		 *          var s = YT.Format.fmtNumber2Chinese(v);<br>
		 *          2.html中使用juicer渲染: ${v|fmtNumber2Chinese}<br>
		 */
		fmtNumber2Chinese : function(n) {
			if(YT.isEmpty(n) || isNaN(n)){
				n = 0;
			}
			try {
				n = n.replace(/,/g, '');
			} catch (e) {
				n = 0;
			}
			var fraction = ['角', '分'];    
	        var digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];    
	        var unit = [ ['元', '万', '亿'], ['', '拾', '佰', '仟']  ];    
	        var head = n < 0? '欠': '';    
	        n = Math.abs(n);    
	      
	        var s = '';    
	      
	        for (var i = 0; i < fraction.length; i++)     
	        {    
	        	var _n = n * 10;
	        	try{
	        		// 相乘精度不准问题
	        		if(_n.toString().split(".")[1].length > 1){
	        			_n = _n.toFixed(1);
	        		}
	        	}catch(e){}
	            s += (digit[Math.floor(_n * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');    
	        }    
	        s = s || '整';    
	        n = Math.floor(n);    
	      
	        for (var i = 0; i < unit[0].length && n > 0; i++)     
	        {    
	            var p = '';    
	            for (var j = 0; j < unit[1].length && n > 0; j++)     
	            {    
	                p = digit[n % 10] + unit[1][j] + p;    
	                n = Math.floor(n / 10);    
	            }    
	            s = p.replace(/(零.)*零$/, '').replace(/^$/, '零')  + unit[0][i] + s;    
	        }    
	        return head + s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整');
		},
		/**
		 * @description 获取图片全路径
		 * @param {string}
		 *            url 路径，如：(img/face.png)
		 * @returns {string} 格式后的字符 如：http://host:port/serviceName/img/face.png
		 * @example 1.JS中直接调用:<br>
		 *          var s = YT.Format.fmtImgUrl(v);<br>
		 *          2.html中使用juicer渲染: ${v|fmtImgUrl}<br>
		 */
		fmtImgUrl : function(url) {
			if (YT.isEmpty(url)) {
				return '';
			}
			url = (url.indexOf("/") == 0) ? url : ("/" + url);
			return basePath + url;
		},
		
		/**
		 * @description 列表数值转换，用于列表中的信息数据进行数据转换操作
		 * @param {Object[]}datas
		 *            原列表数据
		 * @param {string}
		 *            kmap 数据转换的键值对字符串，格式 a=N,b=X|c=M
		 * @returns {string} 转译后的字符
		 * @example 1.JS中直接调用:<br>
		 *          var s =
		 *          YT.Format.fmtListCovert([{"a":'a1'},{"a":'a2'},{"a":'a3'}],
		 *          'a=N,b=X|c=M');
		 */
		fmtListCovert:function(datas, kmap){
			if (datas && kmap) {
				var items = kmap.split(/,|\||，/);
				for (var i = 0; i < datas.length; i++) {
					var tdata = datas[i];
					for (var j = 0; j < items.length; j++) {
						var keys = items[j].split("=");
						if (keys.length == 2) {
							tdata[keys[0]] = tdata[keys[1]];
						}
					}
				}
			}
			return datas;
		}
	};
	/**
	 * @description 注册到juicer
	 */
	YT.each(me, function(prop, fun) {
		if (YT.isFunction(fun)) {
			juicer.register(prop, fun);
		}
	});

	/**
	 * @description 日期对象格式化
	 * @param {string}
	 *            fmt 日期格式
	 * @return {string} 元素节点
	 * @example var d = new Date();<br>
	 *          var s = d.format('yyyyMMdd');
	 */
	Date.prototype.format = function (fmt) {
	    var o = {
	        "M+": this.getMonth() + 1, // 月份
	        "d+": this.getDate(), // 日
	        "h+": this.getHours(), // 小时
	        "m+": this.getMinutes(), // 分
	        "s+": this.getSeconds(), // 秒
	        "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
	        "S": this.getMilliseconds() // 毫秒
	    };
	    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	    for (var k in o)
	    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	    return fmt;
	}
})();
