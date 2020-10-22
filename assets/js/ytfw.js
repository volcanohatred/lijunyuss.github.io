(function(){
	window.SID = new Date().getTime();//用标记资源的当前版本，以保证引用资源及时更新；
	var loc = document.location;
	var protocol = loc.protocol;
	var host = loc.host;
	var pathname = loc.pathname;
	window.urls=document.location.href;
    window.basePath =(function(){
		var pagePath=location.href.match(/[a-zA-Z0-9:_./\-]*\/page\//)[0];
        return pagePath.replace('/page/','');
    })();

	// 返回URL中的参数
	window['_getParameter'] = function (name, location){
		var value = String(location || loc).match(new RegExp('[?&]' + name + '=([^&]*)(&?)', 'i')); 
		return value ? value[1] : null;
	}; 
	// 外部库
	var plugins = ["jquery/jquery-2.1.1.min","juicer/juicer-1.0.min", "seajs/sea-min", "seajs/seajs-css"];
	for (var i = 0, j = plugins.length; i < j; i++) {
		document.write('<script src="' + basePath + '/js/' + plugins[i] + '.js"></script>');
	}
	document.write(' <script src="' + basePath + '/js/ytfw/bootstrap.js?v='+SID+'"></script>');
	
})();