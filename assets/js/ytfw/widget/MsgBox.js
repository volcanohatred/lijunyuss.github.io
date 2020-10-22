;(function() {
	var TAG = "YT.MsgBox";
	YT.log.debug("-----init----", TAG);
	var box = YT.MsgBox = {
		_forbidLayerId : "backMsgDiv",
		_contentLayerId : "contentMsgDiv",
		_creatCnt : 0,
		_tplMsgBox : null,
		init : function() { 
			box._tplMsgBox =[
			'<div class="ui-dialog show">',//
			'<div class="ui-dialog-cnt">',//
				'<div class="ui-dialog-bd">',//
			  		'<h4>${title}</h4>',//
			  		'<div>${msg}</div>',//
			    '</div>',//
			    '<div class="ui-dialog-ft ui-btn-group">',//
			    	'<button type="button" id="msg_box_ok">${okName}</button>',//
					'	 {@if cancleAct}',//
			    	'<button type="button" id="msg_box_cancle">${cancleName}</button>',//
					'	 {@/if}',//
			    '</div>',//
			'</div>', //
			'</div>' ].join("");
			
			YT.log.debug("-----init-compile-2--", TAG);
		},
		// 弹出窗口
		alertinfo : function(msg, title, okAct, okName) {
			YT.log.debug("----init-1----", "YT.alertinfo");
			YT.MsgBox.openMsgBox(msg, title, okAct || YT.MsgBox.hideMsgBox, okName);
		},
		//确认框
		confirm : function(msg, title, okAct, cancleAct,okName,cancleName) {
			YT.log.debug("----init-1----", "YT.confirm");
			YT.MsgBox.openMsgBox(msg, title, okAct, okName, cancleAct
					|| YT.MsgBox.hideMsgBox, cancleName);
		},
		openMsgBox : function(msg, title, okAct, okName, cancleAct, cancleName) {
			YT.log.debug("---openMsgPanel--", TAG);
			if (this._creatCnt) {
				return;
			}
			this._creatCnt++;
			this.createMsgBoxForbider();
			var layer = document.createElement("div");
			layer.id = this._contentLayerId;
			this._lastLayer = document.body.appendChild(layer);
			layer = $(layer).addClass("msg-layer");
			var tpl = box._tplMsgBox;
			var hasCancle=YT.isDefined(cancleAct);
			YT.log.debug("=====cancle====" + hasCancle, TAG);
			var html = juicer(tpl, {
				title : title || '提示',
				msg : msg || '',
				cancleAct : hasCancle,
				okName:okName || "确认",
				cancleName:cancleName || "取消"
			});

			layer.append(html);
			//确定
			$("#msg_box_ok").on("click", function() {
				YT.log.debug("=====button.ok==1===", TAG);
				okAct && okAct(layer);
				
				box.hideMsgBox();
			}); 

			if (hasCancle) {
				$("#msg_box_cancle").on("click", function() {
					YT.log.debug("=====button.cancle==1===", TAG);
					cancleAct && cancleAct(layer);
					
					box.hideMsgBox();
				});
			}
		},
		hideMsgBox : function() {
			YT.log.debug("---hideMsgBox--" + box._creatCnt, TAG);
			if (box._creatCnt-- <= 0) {
				box._creatCnt = Math.max(box._creatCnt, 0);
				return;
			}
			try {
				box.closeMsgBoxForbider();
				box.removeDivId(box._contentLayerId);
			} catch (e) {
				YT.log.debug("---hideMsgPanel-error-", TAG);
			}
		},
		createMsgBoxForbider : function(divId) {
			YT.log.debug("---createMsgBoxForbider--", TAG);
			divId = divId ? divId : this._forbidLayerId;
			var layer = document.createElement("div");
			layer.id = divId;
			document.body.appendChild(layer);
			layer = $(layer).addClass("forbid-box");
			return layer;
		},
		removeDivId : function(divId) {
			var handle = document.getElementById(divId);
			if (handle) {
				handle.parentNode.removeChild(handle);
			}
		},
		closeMsgBoxForbider : function(divId) {
			divId = divId ? divId : this._forbidLayerId;
			this.removeDivId(divId);
		}
	};
	box.init();
	YT.log.debug("-----end----", TAG);
})();