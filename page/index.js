$(function () {
	YT.log.info("-----init---index----1----", basePath);
	/** ***************客户端自定义键盘键盘，调取/隐藏控制**************** */
	window.W_HEIGHT = $(window).height();
	// 隐藏键盘，供客户端调用
	window._hideKeyboard = YT._hideKeyboard;
	$("head").append('<base href="' + basePath + '/"/>');
	// SEA配置
	var libs = NS.EXT_LIBS || {};
	seajs.config({
		base: basePath,
		alias: libs,
		map: [
			[/^(.*\.(?:css|js))(?:.*)$/i, '$1?v=' + (SID)]
		]
	});

	YT.log.info("-----init---index----2----", libs);
	var path = null;
	var me = {
		init: function () {
			YT.APP_NAME = 'ares-web-h5'; // 离线包名称
			var indexUrl = 'page/financial/01/main.html';
			var pp = window['_getParameter'];
			path = pp && pp("path");
			if (!YT.isEmpty(path)) {
				var hash = location.hash;
			} else {
				var hash = location.hash;
				path = hash.substring(1);
			}
			var encryptType = YT.Client.encryptType; // 报文加密方式
			if (!YT.isEmpty(encryptType) && encryptType != 0) {
				if (encryptType == 1) { // 国际
					YT.imports('assets/js/security/encrypt.js', function () {
						YT.loadIndexPage(path || indexUrl, function () {
							YT.Collection.init();
						});
					})
				} else { // 国密
					YT.imports('assets/js/security/encrypt-sm.js', function () {
						YT.loadIndexPage(path || indexUrl, function () {
							YT.Collection.init();
						});
					})
				}
			} else {
				YT.loadIndexPage(path || indexUrl, function () {
					//YT.Collection.init();
				});
			}
			//			if (YT.isWeb()) { // web页面请求初始化
			//				seajs.use('assets/js/ytfw/module/OpenApp.js');
			//			}
		}
	}

	YT.log.info("-----init---index----3----");
	me.init();

});