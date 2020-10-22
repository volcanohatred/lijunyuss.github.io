(function() {
	/**
	 * @fileOverview 日期工具类
	 * @nameSpace YT.DateUtils
	 */
	var me = YT.DateUtils = {
		/**
		 * @description 获取服务器时间
		 * @param {function}
		 *            callback 回调函数
		 * @example YT.DateUtils.sysdate(function(rst){});
		 */
		sysdate : function(callback) {
			var url = YT.dataUrl(YT.sysDateUrl || 'app/sysdateQry');
			YT.ajaxData(url, {}, function(rpdata) {
				callback && callback(rpdata)
			}, function() {
				var date = new Date();
				var CUR_DATE = date.format("yyyy-MM-dd");
				var CUR_TIME = date.format("HH:MM:SS");
				callback && callback({STATUS : "1",CUR_DATE : CUR_DATE,CUR_TIME : CUR_TIME});
			});
		},
		/**
		 * @description 查询当前日前几天的日期
		 * @param AddDayCount
		 *            {int} 负数为前X天 正数为后X天
		 * @returns {string} 日期字符串
		 * @example YT.DateUtils.getDate(1,'2018-10-11');
		 */
		getDate : function(addDayCount, startDate) {
			var dd = startDate ? new Date(startDate) : new Date();
			var date = dd.getDate();
			addDayCount = addDayCount ? addDayCount : 0;
			dd.setDate(date + addDayCount);
			date = dd.getDate();
			var month = dd.getMonth();
			var y = dd.getYear() + 1900;
			var m = (month + 1) < 10 ? "0" + (month + 1) : (month + 1);
			var d = date < 10 ? "0" + date : date;
			return y + "-" + m + "-" + d;
		},
		/**
		 * @description 计算两个日期相差天数
		 * @param {string}
		 *            aVal 结束日期
		 * @param {string}
		 *            bVal 开始日期
		 * @returns {int} 相隔天数
		 * @example YT.DateUtils.dateDiff('2018-10-12','2018-10-11');
		 */
		dateDiff : function(aVal, bVal) {
			try {
				var s1 = aVal.replace(/-/g, "/");
				var s2 = bVal.replace(/-/g, "/");
				d1 = new Date(s1);
				d2 = new Date(s2);
				var time = d1.getTime() - d2.getTime();
				return parseInt(time / (1000 * 60 * 60 * 24));
			} catch (e) {
				YT.log.debug(e);
				return 0;
			}
		},
		/**
		 * @description 日期字符串转星期
		 * @param {string}
		 *            dataStr 日期字符串
		 * @returns {string} 星期：星期天，星期一，星期二
		 * @example YT.DateUtils.dateDiff('2018-10-12','2018-10-11');
		 */
		dateToWeek : function(dataStr) {
			var weekDay = [ "星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六" ];
			var date = new Date(Date.parse(dataStr.replace(/-/g, "/")));
			return weekDay[date.getDay()];
		},
		/**
		 * @description 初始化日期相关控件
		 */
		initDateController : function(panel, app, json) {
			var dateEl = panel.find(".y-date");
			if (dateEl.length < 1) {
				return;
			}
			// 使用服务器日期进行赋值
			me.sysdate(function(data) {
				var today = data && (data.SYS_DATE || data.CUR_DATE);
				dateEl.find("input[data-name]").each(function(){
					var thizz = $(this);
					var format = thizz.attr("data-format") || 'yyyy-MM-dd';
					var day = YT.Format.fmtDate(today,format);
					$(this).val(day);
				});
				//dateEl.find("input[data-name]").val(today);// 赋初始值
				var startDateEl = dateEl.find(".x-date-start");
				var endDateEl = dateEl.find(".x-date-end");
				// 初始化查询日期
				me.initQueryDateControll(startDateEl, endDateEl, today);
				// 初始化日期快捷方式
				me.initDateTab(panel, app, today, startDateEl, endDateEl);
			});
		},
		/**
		 * @description 查询日期初始化
		 */
		initQueryDateControll : function(startDateEl, endDateEl, today) {
			var validtor = YT.Form.resultCustomerValidator;
			startDateEl.on("validator", function(e, elem) {
				var gid = $(elem).data("gid"); // 可用于多组日期校验
				var startDate = $(elem).val();
				var endDate = filterWithGid(endDateEl, gid).val();
				var preDate = me.getDate(0, today);
				var sd = startDate.replace(/-/g, "");
				var ed = endDate.replace(/-/g, "");
				var pd = preDate.replace(/-/g, "");
				var d365 = me.getDate(-365, today).replace(/-/g, "");
				var d90 = me.getDate(-90, endDate).replace(/-/g, "");
				if (ed < sd) {
					validtor(startDateEl, false, '开始日期不能大于结束日期');
					return false;
				}
				if (sd < d365) {
					validtor(startDateEl, false, '只能查询一年内记录');
					return false;
				}
				if (sd < d90) {
					validtor(startDateEl, false, '查询区间不能大于90天');
					return false;
				}
				if (ed > pd) {
					validtor(endDateEl, false, '结束日期不能大于今天');
					return false;
				}
				validtor(startDateEl, true);
				validtor(endDateEl, true);
				return true;
			});
		},
		/**
		 * @description 快捷日期区间初始化，当天、7天、一个月、三个月、半年、一年
		 * 
		 * @param panel
		 * @param app
		 * @param today
		 */
		initDateTab : function(panel, app, today, startDateEl, endDateEl) {
			var dateQuickEl = panel.find(".y-date-quick");
			if (dateQuickEl.length < 1) {
				return;
			}
			var change = dateQuickEl.data("change");
			// 切换按钮绑定事件
			dateQuickEl.on('click', "label.ui-radio-s", function(e) {
				var item = $(this).find('input.x-item');
				var gid = item.data("gid"); // 可用于多组日期校验
				dateQuickEl.find("li").removeClass("current");
				item.addClass("current");
				var v = item.data('value');// 差异化日期值
				var endDate = today;
				var startDate = me.getDate(v, today);
				filterWithGid(startDateEl, gid).val(startDate);
				filterWithGid(endDateEl, gid).val(endDate);
				change && app && app[change] && app[change]();
			});
			dateQuickEl.find("li.current").trigger("click");
		}
	};

	/**
	 * @description 按组别过滤
	 */
	function filterWithGid(items, gid) {
		if (gid) {
			return items.filter("[data-gid='" + gid + "']");
		} else {
			return items;
		}
	}

}());