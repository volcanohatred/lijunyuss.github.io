define(function(require, exports) {
	var PID = "#p_picture_main";
	var TAG = 'page/sample/picture/'
	var panel, pages, pageA, pageB;
	var mediaFlg = true;
	var mediaStream = null;
	var isStop = false;
	var recordedBlobs;
	var recordedFile;
	var mediaRecorder;
	var mimeType;
	var video, canvas, context;
	var me = {
		TAG : TAG,
		init : function(App) {
			panel = $(PID);
			mediaStream = null;
			recordedBlobs = [];
			isStop = false;
			
			pages = panel.find('.page');
			pageA = pages.filter('[data-page="A"]');
			YT.initPageEvent(panel, me);
			YT.loadPage(pageA, TAG + '01_tpl_home.html', {}, me.showPageA, me)
			App.showPageA = me.showPageA;
			
		},
		open: function(){
			if(mediaFlg){
				YT.loadPage(pageB, TAG + '02_tpl_collect.html', {}, me.beforeShowPageA, me)
			}else{
				YT.showTips('type=file')
			}
		},
		showPageA : function() {
			YT.showPageArea(pageA, [pages], true);
		}
	}
	exports.init = me.init;
});