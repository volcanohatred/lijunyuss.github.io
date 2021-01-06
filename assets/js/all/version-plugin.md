#ARES平台 移动App
	混淆压缩了公共三方公共JS库
		assets/js/plugin/juicer/juicer-1.0.min.js
		assets/js/plugin/seajs/sea-min.js
		assets/js/plugin/seajs/seajs-css.js
		assets/js/plugin/jsbridge/jsbridge-1.0.4.js
		assets/js/plugin/view/viewport.js
		assets/js/plugin/jquery/fastclick.js
####1.0.0(2018年11月01日)
#####修改时间
	2018年11月01日14:07:07
#####描述
	1.混淆压缩三方的公共JS库
		1.1详细信息
			压缩juicer基础JS
			压缩seajs基础JS
			压缩seajscss基础JS
			压缩viewport基础的页面适配JS
			压缩fastclick基础JS：修复了IOS系统的select框下拉闪退问题；修复了输入框单击无法正常调用键盘问题；
			压缩jsbridge基础JS：修复了安卓客户端多并发情况下，客户端无法接受执行消息问题，只是部分原生插件无法正常调用；
			关联版本：5.0.3
		1.2影响文件
			add plugin.1.0.0.min.js (assets/js/all/plugin.1.0.0.min.js)

####1.0.1(2019年04月17日)
#####修改时间
	2019年04月17日10:31:11
#####描述
	1.修改juicer-1.0.min.js
		支持{{变量}}
	2.压缩plugin.1.0.1.min.js