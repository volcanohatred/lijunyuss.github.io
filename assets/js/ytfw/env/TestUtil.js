/**
 * 测试场景分支设计及控制
 */
(function() {
	YT.log.info("YT.TestUtil init ");

	var me = YT.TestUtil = {
		dispatch : function(url, json) {
			var func = NS.TRANS_TESTFUN[url];
			// YT.log.info("dispatch url :", url, ",func :", func);
			return func && func(json) || null;
		},
		/**
		 * 示例 <code>
		 * 1、用户：截后两位,前缀_U
		 * 2、账号：截后两位,前缀_A
		 * 
		 * </code>
		 */
		normal : function(json) {
			var st = [];
			st.push(lastStr(json.CUST_NO, 2, "U"));// 用户
			st.push(lastStr(json.ACCT_NO, 2, "A"));// 账号
			YT.log.info("normal:" + st.join(""));
			return st.join("");
		},
		/**
		 * 示例 <code>
		 * 1、银行：截前两位,前缀_B
		 * 2、用户：截后两位,前缀_U
		 * 3、账号：截后两位,前缀_A
		 * 
		 * </code>
		 */
		bankNormal : function(json) {
			var st = [];
			var pp = window['_getParameter'];
			var bank = pp && pp("BANK");
			st.push(prevStr(bank, 2, "B"));// 用户
			st.push(me.normal(json));// 合并其它处理
			return st.join("");
		},
		normalList : function(json) {
			var st = [];
			var next = json.NEXT_KEY;
			if (next > 100) {
				st.push("_END");
			}
			return st.join("");
		},
	}
	/**
	 * 截取lastLength位长度
	 */
	function lastStr(text, lastLength, startFlag) {
		if (text && text.length > lastLength) {
			return "_" + startFlag + text.substr(text.length - lastLength);
		}
		return "";
	}
	/**
	 * 截取lastLength位长度
	 */
	function prevStr(text, length, startFlag) {
		if (text && text.length >= length) {
			return "_" + startFlag + text.substr(0, length);
		}
		return "";
	}

	NS.TRANS_TESTFUN = {
		"/core/acctDetailQuery" : me.normal
	};
	YT.log.info("YT.TestUtil init end ");
})();
