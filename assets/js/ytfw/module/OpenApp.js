$(function() {

	var localUrl = 'ytmbank://com.yitong.mobile/open';
	var downloadIos = 'http://www.yitong.com.cn';
	var downloadAndroid = 'http://www.yitong.com.cn';
	var appName = '手机银行App';
	var u = navigator.userAgent;
	var isIos = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios终端
	var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; // android终端
	var isChrome = u.indexOf("Chrome") !== -1;
	if (!isIos && !isAndroid) {
		return false;
	}
	createOpenBanner();

	function createOpenBanner() {
		var html = '<div class="ui-openapp-wrapper">' + '<div class="app-close ares-app-close"></div>'
				+ '<div class="app-icon"></div>' + '<div class="app-info">' + '<p>打开' + appName + '</p>'
				+ '<p class="ui-txt-info">发现更多精彩</p>' + '</div>' + '<div class="app-open ares-app-open">立即打开</div>'
				+ '</div>';
		var mainBody = $('#mainBody');
		mainBody.append(html);
		mainBody.on('click', '.ares-app-open', function() {
			setTimeout(() => {
				openApp()
			}, 1000);;
		});
		mainBody.on('click', '.ares-app-close', function() {
			mainBody.find('.ui-openapp-wrapper').hide();
		});
	}
	function openApp() {
		var pid = YT.NavUtil.getCurrentUrl();
		var data = YT.getUrlParams();
		var params = YT.JsonToStr(data);
		params = params == '{}' ? '' : params;
		var tempUrl = localUrl + '?pid=' + encodeURIComponent(pid) + '&params=' + encodeURIComponent(params);
		if (isWechat()) { // 是否为微信
			var i = navigator.userAgent.match(/MicroMessenger\/(\S*)/);
			var versionNo = i[1];
			if (compareVersion(versionNo, '6.5.16') > 0) {
				window.WeixinJSBridge && window.WeixinJSBridge.invoke && window.WeixinJSBridge.invoke("launchApplication", {
					appID : "wxd3f6cb54399a8489",
					schemeUrl: localUrl,
					parameter: "",
					extInfo : {}
				}, function(e) {
//					alert(e.err_msg)
                    if("launchApplication:ok" === e.err_msg){
                    	console.log('打开成功');
                    }else{
                    	// 失败，跳转到下载页面
                    	if(isIos){
                    		window.location.href = downloadIos;
                    	}else{
                    		window.location.href = downloadAndroid;
                    	}
                    }
                })
                return;
			}
		}
		if (isIos) {
			if (isIOS9()) {
				// 判断是否为ios9以上的版本,跟其他判断一样navigator.userAgent判断,ios会有带版本号
				/* localUrl=createScheme({type:1,id:"sdsdewe2122"},true);//代码还可以优化一下 */
				window.location.href = tempUrl;// 实际上不少产品会选择一开始将链接写入到用户需要点击的a标签里
				return;
			}
			window.location.href = tempUrl;
			var loadDateTime = Date.now();
			setTimeout(function() {
				var timeOutDateTime = Date.now();
				if (timeOutDateTime - loadDateTime < 1000) {
					YT.confirm('您可以尝试下载App', '温馨提示', function() {
						window.location.href = downloadIos;
					}, null, '下载', '取消');
				}
			}, 25);
		} else if (isAndroid) {
			// 判断是否是android，具体的判断函数自行百度
			if (isChrome) {
				// chrome浏览器用iframe打不开得直接去打开，算一个坑
				window.location.href = tempUrl;
			} else {
				// 抛出你的scheme
				openIframe = createIframe();
				openIframe.src = tempUrl;
			}
			setTimeout(function() {
				YT.confirm('您可以尝试下载App', '温馨提示', function() {
					window.location.href = downloadAndroid;
				}, null, '下载', '取消')
			}, 500);
		} else {
			YT.confirm('您可以尝试下载App', '温馨提示', function() {
				window.location.href = downloadAndroid;
			}, null, '下载', '取消')
		}
	
	}
	function createIframe() {
		iframe = document.createElement('iframe');
		iframe.style.display = 'none';
		document.body.appendChild(iframe);
		return iframe;
	}
	function isIOS9() {
		// 获取固件版本
		var getOsv = function() {
			var reg = /OS ((\d+_?){2,3})\s/;
			if (u.match(/iPad/i) || navigator.platform.match(/iPad/i) || u.match(/iP(hone|od)/i)
					|| navigator.platform.match(/iP(hone|od)/i)) {
				var osv = reg.exec(u);
				if (osv.length > 0) {
					return osv[0].replace('OS', '').replace('os', '').replace(/\s+/g, '').replace(/_/g, '.');
				}
			}
			return '';
		};
		var osv = getOsv();
		var osvArr = osv.split('.');
		// 初始化显示ios9引导
		if (osvArr && osvArr.length > 0) {
			if (parseInt(osvArr[0]) >= 9) {
				return true
			}
		}
		return false
	}
	// 是否为微信
	function isWechat() {
		var reg = /MicroMessenger/;
		if (reg.test(u)) {
			return true
		}
		return false;
	}
	// 比对版本号
	function compareVersion(v1, v2) {
		var ver1 = parseVersionName(v1);
		var ver2 = parseVersionName(v2);
		return Number(ver1.major) - Number(ver2.major) != 0 ? Number(ver1.major) - Number(ver2.major) > 0 ? 1 : -1
				: Number(ver1.minor) - Number(ver2.minor) != 0 ? Number(ver1.minor) - Number(ver2.minor) > 0 ? 1 : -1
						: Number(ver1.patch) - Number(ver2.patch) != 0 ? Number(ver1.patch) - Number(ver2.patch) > 0 ? 1
								: -1
								: 0
	}
	// 格式化版本号
	function parseVersionName(vno) {
		var arr = vno.split("."), n = {
			major : "0",
			minor : "0",
			patch : "0",
			tail : ""
		};
		if (arr[0] && arr[0].match(/\d+/)) {
			var r = arr[0].match(/\d+/);
			n.major = r[0]
		}
		if (arr[1] && arr[1].match(/\d+/)) {
			var o = arr[1].match(/\d+/);
			n.minor = o[0]
		}
		if (arr[2] && arr[2].match(/\d+/)) {
			var i = arr[2].match(/\d+/);
			n.patch = i[0]
		}
		var a = arr[arr.length - 1];
		if (a && a.match(/(\d+)(\D(.*))/)) {
			var s = a.match(/(\d+)(\D(.*))/);
			n.tail = s[2]
		}
		return n
	}
});