define(function (require, exports) {
    var mediaFlg = false;
    var mediaStream;
    var video, canvas, context;
    var cameraPanel, mediaCanvas, mediaVideo;
    var btnTake, btnFinish, btnAgain;
    var constraints;
    var __app;
    var appCallback, appCancel;
    try{
        if(!"mediaDevices" in navigator || !"getUserMedia" in navigator.mediaDevices){
            mediaFlg = false;
        }else{
            mediaFlg = true;
        }
    }catch(e){
        mediaFlg = false;
    }
    var me = {}
    me.init = function (widget, panel, app, json) { 
        __app = app;
        if (mediaFlg) {
            me.mediaCamera(widget, panel, app, json)
        } else {
            me.mediaTypeFile(widget, panel, app, json)
        }
    }
    // 视频
    me.mediaCamera = function (widget, panel, app, json) {
        var css = `
            .ui-camera-panel{
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 99999;
            }
            .ui-camera-btn-wrap{
                position: absolute;
                left: 50%;
                bottom: 50px;
                transform: translateX(-50%);
            }
            .ui-camera-btn{
                display: inline-block;
                margin-right: 10px;
            }
            .ui-camera-btn-take{
                width: 66px;
                height: 66px;
                background-color: #ffffff;
                border-radius: 50%;
                border: 6px solid rgb(145 145 145);
            }
            .ui-camera-btn-finish{
                width: 60px;
                height: 30px;
                line-height: 30px;
                background-color: #23bf23;
                text-align: center;
                color: #ffffff;
                border-radius: 3px;
                font-size: 14px;
            }
            .ui-camera-btn-again{
                width: 80px;
                height: 30px;
                line-height: 30px;
                background-color: #ff4222;
                text-align: center;
                color: #ffffff;
                border-radius: 3px;
                font-size: 13px;
            }
            .ui-camera-btn-cancel{
                position: absolute;
                top: 20px;
                left: 20px;
                color: #ffffff;
            }
            .ui-camera-btn-cancel:before{
                content: '\\e697';
                font-family: 'iconfont';
                font-size: 24px;
                width: 34px;
                height: 34px;
                line-height: 34px;
                background-color: #c5c5c5;
                border-radius: 50%;
                display: inline-block;
                text-align: center;
                font-weight: bold;
            }
        `;
        var style = document.createElement('style');
        style.innerHTML = css;
        document.head.appendChild(style);
         var ww = $(window).width();
        var wh = $(window).height();
        cameraPanel = $('#camera-panel');
        if (cameraPanel.length == 0) { 
            var tpl = `
            <div class="ui-camera-panel" id="camera-panel" style="display:none">
                <canvas class="mediaCanvas" width="${ww}" height="${wh}"></canvas>
                <video class="mediaVideo" style="display:none"></video>
                <div class="ui-camera-btn-wrap">
                    <div class="ui-camera-btn camera-btn-take ui-camera-btn-take hidden" data-event="take"></div>
                    <div class="ui-camera-btn camera-btn-again ui-camera-btn-again hidden" data-event="again">重新拍摄</div>
                    <div class="ui-camera-btn camera-btn-finish ui-camera-btn-finish hidden" data-event="finish">完成</div>
                </div>
                <div class="ui-camera-btn-cancel" data-event="cancel"></div>
            </div>
            `;
            cameraPanel = $(tpl)
            $('#mainBody').append(cameraPanel);
            mediaCanvas = cameraPanel.find('.mediaCanvas');
            mediaVideo = cameraPanel.find('.mediaVideo');
            // btnCancel = cameraPanel.find('.camera-btn-cancel');
            btnTake = cameraPanel.find('.camera-btn-take');
            btnFinish = cameraPanel.find('.camera-btn-finish');
            btnAgain = cameraPanel.find('.camera-btn-again');
            canvas = mediaCanvas[0];
            video = mediaVideo[0];
            YT.initPageEvent(cameraPanel, me)
        }
        widget.on('click', function () { 
            me.showBtns([])
            me.initParams(widget, function () {
                me.showBtns([btnTake])
            })
        })
    }
    me.initParams = function (widget, callback) {
        appCallback = widget.attr('data-callback'); // 拍摄完成回调
        appCancel = widget.attr('data-cancel'); // 取消回调
        context = canvas.getContext('2d')
        var mode = widget.attr('data-mode');
        var facingMode = '';
        if (mode == 'front') { // 前置摄像头
            facingMode = 'user';
        } else { // 后缀摄像头
            facingMode = 'environment';
        }
        constraints = {
            video: {
                width: 1280,
                height: 720,
                facingMode: facingMode
            }
        }
        me.initMedia(callback)
    }
    me.initMedia = function (callback) {
       
        try {
            isStop = false;
            navigator.mediaDevices.getUserMedia(constraints).then(stream => {
                cameraPanel.show();
				mediaStream = video.srcObject = stream;
                requestAnimationFrame(me.render)
                video.play();
                setTimeout(() => {
                    callback && callback()
                },1000)
				YT.log.info('----mediaRecorder started ----')
			})
        } catch (e) {
            YT.log.error(e)
        }
    }
    me.render = function () { 
        if (!isStop) {
			context.drawImage(video, 0, 0, canvas.width, canvas.height)
			requestAnimationFrame(function () { 
                me.render(context, canvas, video)
            })
		}
    }
    // 拍照
    me.take = function () {
        console.log('拍摄')
        isStop = true;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        me.showBtns([btnFinish, btnAgain])
    }
    // 重新拍照
    me.again = function () {
        isStop = false
        me.showBtns([])
        me.initMedia(function(){
            requestAnimationFrame(me.render)
            video.play();
            me.showBtns([btnTake])
        });
    }
    me.finish = function () {
        cameraPanel.hide();
        me.close();
        var base64 = canvas.toDataURL("image/png");
        console.log(base64);
        __app && __app[appCallback] && __app[appCallback](base64)
    }
    me.cancel = function () {
        cameraPanel.hide();
        me.close();
        __app && __app[appCancel] && __app[appCancel]();
    }
    me.showBtns = function (showHandles) {
        cameraPanel.find('.ui-camera-btn').addClass('hidden');
        YT.each(showHandles, function(item) {
            item.removeClass('hidden')
        });
    }
    me.close = function () {
        isStop = true;
	    video.pause();
		// 终止录制器
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
    // type="file"
    me.mediaTypeFile = function (widget, panel, app, json) {
        
    }
    exports.init = me.init;
})