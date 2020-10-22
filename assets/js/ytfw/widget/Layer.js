/**
 * 等待层JS组件
 * 
 * @returns
 */
;
(function() {
	var TAG = "YT.Layer";
	YT.Layer = {
		_forbidLayerId : "backDivX",
		_waitLayerId : "waitDivX",
		_waitCnt : 0,
		_fMenuCnt : 0,
		_fmCache : [],
		/**
		 * 打开等待层
		 */
		openWaitPanel : function(msg) {
			YT.log.debug("---openWaitPanel--", TAG);
			msg = msg ? msg : "请稍等,正在加载中...";
			if (this._waitCnt) {
				return;
			}
			this.createWaitForbider();
			var layer = document.createElement("div");
			layer.id = this._waitLayerId;
			this._lastLayer = document.body.appendChild(layer);
			layer = $(layer).addClass("wait-layer"); //
			var tpl = "<div align='center' class='container'><div class='loading'>${msg}</div></div>";
			layer.append(YT.template(tpl, {
				msg : msg
			}));
			this._waitCnt++;
		},
		/**
		 * 隐藏等待层
		 */
		hideWaitPanel : function(timeout) {
			var me = this;
			YT.log.debug("---hideWaitPanel--" + me._waitCnt, TAG);
			if (me._waitCnt-- <= 0) {
				me._waitCnt = Math.max(me._waitCnt, 0);
				return;
			}
			try {
				setTimeout(function() {
					me.closeWaitForbider();
					me.removeDivId(me._waitLayerId);
				}, timeout || 300);
			} catch (e) {
				YT.log.debug("---hideWaitPanel-error-", TAG);
			}
		},
		/**
		 * 创建等待层
		 */
		createWaitForbider : function(divId) {
			YT.log.debug("---createWaitForbider--", TAG);
			divId = divId ? divId : this._forbidLayerId;
			var layer = document.createElement("div");
			layer.id = divId;
			document.body.appendChild(layer);
			layer = $(layer).addClass("forbid");
			return layer;
		},
		/**
		 * 移除等待层
		 */
		removeDivId : function(divId) {
			var handle = document.getElementById(divId);
			if (handle) {
				handle.parentNode.removeChild(handle);
			}
		},
		/**
		 * 关闭等待层
		 */
		closeWaitForbider : function(divId) {
			divId = divId ? divId : this._forbidLayerId;
			this.removeDivId(divId);
		}
	};
})();