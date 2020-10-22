$(function() {
	YT.log.info("-----init---index----1----", basePath);
	/** ***************客户端自定义键盘键盘，调取/隐藏控制**************** */
	window.W_HEIGHT = $(window).height();
	// 隐藏键盘，供客户端调用
	window._hideKeyboard = YT._hideKeyboard;
	$("head").append('<base href="' + basePath + '/"/>');
	// SEA配置
	var libs = NS.EXT_LIBS || {};
	seajs.config({
		base : basePath,
		alias : libs,
		map : [ [ /^(.*\.(?:css|js))(?:.*)$/i, '$1?v=' + (SID) ] ]
	});

	var ua = navigator.userAgent;
	var android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
	var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
	var ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
	var iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/);
	if (android) {
		os = 'android';
	} else if (ipad || iphone || ipod) {
		os = 'iphone';
	} else {
		os = 'web';
	}
	window.Device.os = os;
	var urlParams = YT.getUrlParams();
	YT.log.info(urlParams)
	YT.log.info(location.href)
	var theRequest = {};
	theRequest.token = urlParams.token;
	theRequest.nkn = urlParams.nkn;
	theRequest.hui = 'http:' + (urlParams.hui || '');
	theRequest.hiu = urlParams.hiu;
	theRequest.openid = urlParams.openid;
	localStorage.setItem("theRequest",JSON.stringify(theRequest));	
	//var theRequest = JSON.stringify(window.location.href);
	/*var url =JSON.stringify(window.location.href);
	 //localStorage.setItem("theRequest",theRequest);
	 //var url = localStorage.getItem("theRequest");
	  url = url.split("?")[1];
	 YT.log.info(url)
	 if(url!=undefined){
		 var theRequest = {};
		 if(url.indexOf("?") == -1){
			 var str = url.slice(0,url.length-1);
			 var strs = str.split("&");
			 for(var i=0;i<strs.length;i++){
				 theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
			 }
			 var hui = theRequest['hui'];
			 theRequest["hui"]="http:"+hui;
		 }
		 localStorage.setItem("theRequest",JSON.stringify(theRequest));		 
	 }
	*/
	
//	YT.alertinfo(JSON.stringify(theRequest))
	YT.log.info("-----init---index----2----", libs);
	var path = null;
	var Index = {
		init : function() {
			Index.NXY_URL = 'page/sample/liveface2/main.html';
			var pp = window['_getParameter'];
			path = pp && pp("path");
			if (!YT.isEmpty(path)) {
				var hash = location.hash;
			} else {
				var hash = location.hash;
				path = hash.substring(1);
			}
			//添加国密代码
			var encryptType = YT.Client.encryptType; // 报文加密方式
			if(!YT.isEmpty(encryptType) && encryptType != 0){
				if(encryptType == 1){ // 国际
					seajs.use('assets/js/security/encrypt.js', function(){
						Index.initIndexPage(path)
					})
				}else{ // 国密
					seajs.use('assets/js/security/encrypt-sm.js', function(){
						Index.initIndexPage(path)
					})
				}
			}else{
				Index.initIndexPage(path)
			}
		},
		initIndexPage : function(path){
			if(!YT.isEmpty(path)){
				if(!/^page\/.*\.html/.test(path)){ // 权益页面
					YT.loadIndexPage(Index.NXY_URL, function () {
						var qyPath = decodeURIComponent(path);
						qyPath = qyPath.replace(/\?token=\S*/, '');
						location.href = qyPath;
					});
					return false;
				}
			}
			YT.loadIndexPage(path || Index.NXY_URL, function () {
				YT.Collection.init();
			});
		}
	}

	YT.log.info("-----init---index----3----");
	Index.init();
	try{
		(/iphone|ipod|ipad/i.test(navigator.appVersion)) && document.addEventListener('blur', function(event){
			YT.log.info('-----blur-----')
			if(document.documentElement.offsetHeight <= document.documentElement.clientHeight && ['input', 'textarea'].indexOf(event.target.localName) > -1){
				YT.log.info('-----scrollIntoView-----');
//				document.body.scrollIntoView()
				var scrollTop = document.scrollingElement.scrollTop;
				document.scrollingElement.scrollTop = --scrollTop;
			}
		}, true)
	}catch(e){}
});