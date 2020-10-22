define(function(require, exports) {
	var PID = "#p_liveface2_main";
	var TAG = 'page/sample/liveface2/'
	var panel, pages, pageA;

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
		}
	}
	me.collect = function(){
		pageA.find('.form-panel').hide();
		pageA.find('.video-panel').show();
		var ele = pageA.find('.video');
		var canvasEle = pageA.find('.canvas');
		canvas = canvasEle[0];
		context = canvas.getContext('2d')
		var wh = $(window).height();
		var ww = $(window).width();
		canvas.width = ww;
		canvas.height = wh;
		video = ele[0];
		video.play();
		me.initMedia(function(){
			pageA.find('.btn-video').hide()
			pageA.find('.start').show();
		});
	}
	
	me.initMedia = function(callback){
		try{
			var constraints = {
				video: {
					width: 1280,
					height: 720,
					facingMode: 'user',
//					facingMode: 'environment'
				}
			}
			isStop = false;
			navigator.mediaDevices.getUserMedia(constraints).then(stream=>{
				mediaStream = video.srcObject = stream;
				requestAnimationFrame(me.render)
				
				mediaRecorder = new MediaRecorder(stream, {
					videoBitsPerSecond: 100000
				});

				// mediaRecorder.setVideoEncodingBitrate(150000)
				
				mediaRecorder.ondataavailable = function(event){
					YT.log.info('---ondataavailable---')
					mediaRecorder.blobs.push(event.data);
					recordedBlobs.push(event.data)
				}
				mediaRecorder.blobs = [];
				// 录制停止
				mediaRecorder.onstop = function(e){
					YT.log.info('onstop:---录制停止---')
					mimeType = mediaRecorder.mimeType
					YT.log.info('-mediaRecorder.mimeType:'+mimeType)
					recordedFile = new Blob(recordedBlobs, { type: mimeType})
					recordedBlobs = [];
				}
				callback && callback()
				YT.log.info('----mediaRecorder started ----')
			})
		}catch(e){
			YT.log.error(e)
		}
	}
	// 开始录制
	me.start = function(){
		YT.log.info('---开始录制---')
		isStop = false;

		mediaRecorder.start(100)
		pageA.find('.start').hide(); // 开始
		pageA.find('.stop').show(); // 停止
		var timeoutTxt = pageA.find('.timeout');
		timeoutTxt.text('3').show();
		var num = 2;
		clearInterval(me.timeout);
		me.timeout = setInterval(function() {
			if(num < 0){
				me.stop()
			}else{
				timeoutTxt.text(num);
			}
			num --
		}, 1000);
	}
	// 停止
	me.stop = function(){
		YT.log.info('---停止录制---')
		me.closeAll();
		clearInterval(me.timeout);
		var timeoutTxt = pageA.find('.timeout');
		timeoutTxt.hide();
		pageA.find('.stop').hide(); // 停止
		pageA.find('.upload').show(); // 上传
		pageA.find('.again').show(); // 重录
		pageA.find('.download').show(); // 下载
	}
	// 重新录制
	me.again = function(){
		YT.log.info('---重新录制---')
		pageA.find('.btn-video').hide()
		recordedBlobs = [];
		me.initMedia(function(){
			requestAnimationFrame(me.render)
			video.play();
			pageA.find('.stop').show();
			me.start();
		});
	}
	me.download = function () { 
		var time = new Date().getTime();
		var file = new File([recordedFile], 'wx-' + time + '.mp4', { type: mimeType})
		var file2 = new File([recordedFile], 'msr-' + (new Date).toISOString().replace(/:|\./g, '-') + '.mp4', {
                type: 'video/x-matroska;codecs=avc1'
		});
		var size = file.size;
		var size2 = file2.size;
		YT.log.info(file)
		YT.log.info(size/1024 + 'Kb')
		YT.log.info(file2)
		YT.log.info(size2/1024 + 'Kb')
	}
		
	me.closeAll = function(){
		try{
			isStop = true;
			video.pause();
			// 终止录制器
			mediaRecorder.stop();
			me.closeStream();
		}catch(e){
			YT.log.info(e)
		}
	}
	// 关闭视频流
	me.closeStream = function(){
		YT.log.info('---关闭视频流---')
		if(mediaStream){
			if(typeof mediaStream.stop === 'function'){
				mediaStream.stop()
			}else{
				mediaStream.getTracks().forEach(track =>{
					track.stop()
				})
			}
		}
	}
	
	me.render = function(){
		if (!isStop) {
			context.drawImage(video, 0, 0, canvas.width, canvas.height)
			requestAnimationFrame(me.render)
		}
	}
	me.showPageA = function () { 
		YT.showPageArea(pageA, [pages], true);
	}
	exports.init = me.init;
});