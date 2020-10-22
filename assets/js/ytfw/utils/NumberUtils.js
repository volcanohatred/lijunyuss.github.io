(function() {
	/**
	 * 数据运算基础类
	 */
	var me = YT.NumberUtils = {
		/**
		 * 两数相加
		 * 
		 * @param {float}
		 *            a 加数1
		 * @param {float}
		 *            b 被加数2
		 * @return {float} 返回两数相加结果
		 */
		add : function(a, b) {
			var c = 0;
			var d = 0;
			var e = 1;
			try {
				c = a.toString().split(".")[1].length;
			} catch (f) {
			}
			try {
				d = b.toString().split(".")[1].length;
			} catch (f) {
			}
			return e = Math.pow(10, Math.max(c, d)), (Fw.mul(a, e) + Fw.mul(b, e)) / e;
		},

		/**
		 * 两数相减
		 * 
		 * @param {float}
		 *            a 减数1
		 * @param {float}
		 *            b 被减数2
		 * @return {float} 返回相减结果
		 */
		sub : function(a, b) {
			var c = 0;
			var d = 0;
			var e = 1;
			try {
				c = a.toString().split(".")[1].length;
			} catch (f) {
			}
			try {
				d = b.toString().split(".")[1].length;
			} catch (f) {
			}
			return e = Math.pow(10, Math.max(c, d)), (Fw.mul(a, e) - Fw.mul(b, e)) / e;
		},

		/**
		 * 两数相乘
		 * 
		 * @param {float}
		 *            a 乘数1
		 * @param {float}
		 *            b 乘减数2
		 * @return {float} 返回两数相乘结果
		 */
		mul : function(a, b) {
			var c = 0;
			var d = a.toString();
			var e = b.toString();
			try {
				c += d.split(".")[1].length;
			} catch (f) {
			}
			try {
				c += e.split(".")[1].length;
			} catch (f) {
			}
			return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
		},

		/**
		 * 两数相除
		 * 
		 * @param {float}
		 *            a 乘除1
		 * @param {float}
		 *            b 乘除数2
		 * @return {float} 返回相除结果
		 */
		div : function(a, b) {
			var c = 1;
			var d = 1;
			var e = 0;
			var f = 0;
			try {
				e = a.toString().split(".")[1].length;
			} catch (g) {
			}
			try {
				f = b.toString().split(".")[1].length;
			} catch (g) {
			}
			return c = Number(a.toString().replace(".", "")), d = Number(b.toString().replace(".", "")), Fw.mul(c / d, Math.pow(10, f - e));
		},
	};
}());