/**
 * @Desc Echarts
 */
(function() {
	var me = YT.EchartsTpl = {
		/**
		 * 初始化Echarts插件
		 * 
		 * @param panel
		 * @param app
		 * @param params
		 *            包括 图标显然模板 和交易请求参数 如params={ options :{}, data :"", }
		 */
		initEchartsTpl : function(panel, app, conf, selector) {
			var sele = selector || '.y-echarts';
			var ele = panel.find(sele);
			me.APP = app;
			if (ele.length <= 0) {
				return;
			}
			seajs.use('assets/js/plugin/echarts/echarts.min', function() {
				me.initEcharts(panel, app, conf, ele);
			});

		},
		initEcharts : function(panel, app, conf, ele) {
			ele.each(function() {
				var el = me.el = $(this);
				el.css("width", $(window).width());
				var dataurl = el.data("url");
				if (Fw.isEmpty(dataurl)) {
					return;
				}
				dataurl = YT.dataUrl(dataurl);
				// 插件参数
				if (Fw.isEmpty(conf) || Fw.isEmpty(conf.options)) {
					return;
				}
				// 交易请求参数
				var params = {};
				if (!Fw.isEmpty(conf) && !Fw.isEmpty(conf.params)) {
					params = conf.params;
				}
				// 获取渲染插件的数据
				var dataname = el.attr("data-chart");
				Fw.ajaxData(dataurl, params || {}, function(data) {
					if ("1" != data.STATUS) {
						return;
					}
					me.myChart = echarts.init($(el).get(0));
					var json = conf.options;
					switch (dataname) {
					case 'pie':// 饼状图
						options = json.pie;
						options.legend.data = data.LIST;
						options.series[0].data = data.LIST;
						me.setChart(options);
						return;
					case 'bar':// 柱状图
						options = json.bar;
						var max = [];
						var min = [];
						$.each(data.LIST, function(i, dom) {
							max.push(dom.max);
							min.push(dom.min);
							if (data.LIST.length - 1 == i) {
								options.series[0].data = min;
								options.series[1].data = max;
								me.setChart(options);
							}
						});
						return;
					case 'barbase':// 柱状图
						options = json.barbase;
						var series = [];
						var color = options.color;
						options.legend.data = data.LIST;
						// 遍历数据组装series
						$.each(data.LIST, function(i, val) {
							var param = {
								type : 'bar',
								barGap : 0
							};
							param.name = val.name;
							param.data = val.list;
							series[i] = param;
						});
						options.series = series;
						me.setChart(options);
						return;
					case 'line':// 折线图
						options = json.line;
						var max = [];
						var min = [];
						$.each(data.LIST, function(i, dom) {
							max.push(dom.max);
							min.push(dom.min);
							if (data.LIST.length - 1 == i) {
								options.series[0].data = min;
								options.series[1].data = max;
								me.setChart(options);
							}
						});
						return;
					case 'linebase':// 折线图
						options = json.linebase;
						var series = [];
						var color = options.color;
						options.legend.data = data.LIST;
						// 遍历数据组装series
						$.each(data.LIST, function(i, val) {
							var param = {
								smooth : true,
								type : 'line',
								stack : '总量'
							};
							param.name = val.name;
							param.data = val.list;
							series[i] = param;
						});
						options.series = series;
						me.setChart(options);
						return;
					case 'linesecond':// 折线图2
						options = json.linesecond;
						var series = [];
						var color = options.color;
						options.legend.data = data.LIST;
						// 遍历数据组装series
						$.each(data.LIST, function(i, val) {
							var param = {
								smooth : true,
								type : 'line',
								stack : '总量'
							};
							param.name = val.name;
							param.areaStyle = {
								normal : {
									color : color[i]
								// 为每一条数据区域设置颜色
								}
							};
							param.data = val.list;
							series[i] = param;
						});
						options.series = series;
						me.setChart(options);
						return;
					case 'ring':// 环形图
						options = json.ring;
						options.series[0].data = data.LIST;
						me.setChart(options);
						return;
					default:
						return;
					}
				});
			});
		},
		/**
		 * 渲染图表
		 */
		setChart : function(option) {
			me.myChart.setOption(option);
			// 用于使chart自适应高度和宽度
			window.onresize = function() {
				me.el.css("width", $(window).width());
				me.myChart.resize();
			};
			var callback = me.el.data("callback");
			me.APP[callback] && me.APP[callback](option);
		}
	};
}());
