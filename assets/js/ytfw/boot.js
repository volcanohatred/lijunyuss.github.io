;(function () {
	window.SID = new Date().getTime();//用标记资源的当前版本，以保证引用资源及时更新；
	var loc = document.location;
	var protocol = loc.protocol;
	var host = loc.host;
	var pathname = loc.pathname;
	window.urls=document.location.href;
    window.basePath =(function(){
		var pagePath=location.href.match(/[a-zA-Z0-9:_./\-\[\]]*\/page\//)[0];
        return pagePath.replace('/page/','');
    })();

	// 返回URL中的参数
	window['_getParameter'] = function (name, location){
		var value = String(location || loc).match(new RegExp('[?&]' + name + '=([^&]*)(&?)', 'i')); 
		return value ? value[1] : null;
	}; 

    window.FAST = true;
    // 兼容库代码
    window.Zepto = $;

    window.Device = (function () {
        var device = {};
        var ua = navigator.userAgent;
        var android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
        var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
        var ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
        var iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/);
        if(/YiTong/.test(ua)){ // 客户端是否支持离线包标记
        	device.YiTong = true;
        	device.YiTongVer = ua.match(/YiTong.([\d.]+)/)[1];
        }
        device.ios = device.android = device.iphone = device.ipad = false;

        device.os = 'web';
        // Android
        if (android) {
            device.os = 'android';
            device.osVersion = android[2];
            device.android = true;
        }
        if (ipad || iphone || ipod) {
            device.os = 'iphone';
            device.ios = true;
        }
        // iOS
        if (iphone && !ipod) {
            device.osVersion = iphone[2].replace(/_/g, '.');
            device.iphone = true;
        }
        if (ipad) {
            device.osVersion = ipad[2].replace(/_/g, '.');
            device.ipad = true;
        }
        if (ipod) {
            device.osVersion = ipod[3] ? ipod[3].replace(/_/g, '.') : null;
            device.iphone = true;
        }
        // iOS 8+ changed UA
        if (device.ios && device.osVersion && ua.indexOf('Version/') >= 0) {
            if (device.osVersion.split('.')[0] === '10') {
                device.osVersion = ua.toLowerCase().split('version/')[1].split(' ')[0];
            }
        }
        // Webview
        //device.webView = (iphone || ipad || ipod) && ua.match(/.*AppleWebKit(?!.*Safari)/i);
        // Export object
        return device;
    })(); 
})();
