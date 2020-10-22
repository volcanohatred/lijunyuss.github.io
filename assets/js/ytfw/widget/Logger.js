$(function(){
	var logContent, logPanel, logWrap;
	function wlog(lvl, items) {
		if(YT.isEmpty(items) || YT.isEmpty(items[0])){
			return ;
		}
		$('.ui-ytlog-content div').length>200 && $('#mainBody').find('.ui-ytlog-content').html('');
		var args = Array.prototype.slice.call(items || []);
			var html = '';
			for(var i=0;i<args.length;i++){
				var item = args[i];
				if(YT.isArray(item)){
					var itemStr = YT.JsonToStr(item);
					var str = sub(itemStr);
					html +='<div class="out-fold"><div class="fold">Array ['+str+']</div>';
					var h = '';
					for(var n =0;n<item.length;n++){
						var ar = item[n];
						h += '<div class="arr-inner"><i class="key">'+n+'</i>:{0}{1}</div>';
						var vars = [];
						if(YT.isArray(ar)){
							vars = [' Array ',JsonToStr(ar)];
						}else if(YT.isObject(ar)){
							vars = [' Object ',JsonToStr(ar)];
						}else{
							if(YT.isString(ar)){
								vars = [' ','<i class="str">"'+ar+'"</i>'];
							}else{
								vars = [' ','<i class="num">'+ar+'</i>'];
							}
						}
						h = h.replace(/\{(\d+)\}/g, function(m, i) {
							return vars[i];
						});
					}
					html +='<div class="inner-fold">'+h+'</div></div>'
				}else if(YT.isObject(item)){
					var itemStr = YT.JsonToStr(item);
					var str = sub(itemStr);
					html +='<div class="out-fold"><div class="fold">Object '+str+'</div>';
					html +='<div class="inner-fold">'+JsonToStr(item)+'</div></div>'
				}else if(YT.isFunction(item)){
					html +='<div class="func">'+item+'</div>';
				}else{
					item = ('' + item).replace(/[\r\n]/g, '<br>');
					html +='<i>'+item+'</i>';
				}
		}
		logContent.append('<div class="item '+lvl+'">' + html + '</div>');
	}
	function sub(str){
		if(str.length>30){
			return str.replace(/\s+/g, "").substr(0, 30) + "...";
		}else{
			return str;
		}
	}
	function JsonToStr(obj) {
		if (obj == null) {
			return '""';
		}
		switch (typeof (obj)) {
		default:
		case 'string':
			return '' + obj + '';
		case 'object': {
			if (obj instanceof Array) {
				var strArr = [];
				var len = obj.length;
				for (var i = 0; i < len; i++) {
					strArr.push(JsonToStr(obj[i]));
				}
				return strArr.join(' ');
			} else {
				var arr = [];
				for ( var i in obj) {
					var text = JsonToStr(obj[i]);
					var str ='';
					if (isNaN(text)) {
						str = '<i class="val"> "' + text + '"</i>';
					} else {
						str = '<i class="val num"> ' + text + '</i>';
					}
					
					arr.push('<div class="kv-fold"><i class="key">' + i + ' </i>:' + str+'</div>');
				}
				return arr.join('');
			}
		}
		}
		return '""';
	}
	function initYTLog() {
		var html = "<div class='ui-ytlog-wrap'>"
				+ "	<div class='ui-ytlog-tips'>日志</div>"
				+ "	<div class='ui-ytlog-panel'>"
				+ "		<div class='ui-ytlog-header'>"
				+ "			<div class='close'></div>"
				+ "			<div class='txt'>console日志</div>"
				+ "			<div class='clean'></div>" 
				+ "		</div>"
				+ "		<div class='ui-ytlog-content'>"
				+ "		</div>" 
				+ "		<div class='ui-ytlog-footer'>"
				+ "			<div class='item clean'>"
				+ "				<span>清理</span>"
				+ "			</div>"
				+ "			<div class='item close'>"
				+ "				<span>关闭</span>"
				+ "			</div>"
				+ "		</div>"
				+ "	</div>"
				+ "</div>";
		$('#mainBody').append(html);
		logWrap = $('#mainBody').find('.ui-ytlog-wrap');
		logPanel = logWrap.find('.ui-ytlog-panel');
		logContent = logWrap.find('.ui-ytlog-content');
		logContent.height($(window).height() - 70);
		initEvent();
		handleError(); //捕获异常
	}
	function initEvent() {
		logPanel.on('click', '.ui-ytlog-footer .close', function() {
			logPanel.hide();
			logWrap.find('.ui-ytlog-tips').show();
			$("body").css({
				overflow : "auto"
			});

		});
		logWrap.on('click', '.ui-ytlog-tips', function() {
			logPanel.show();
			$(this).hide();
			$("body").css({
				overflow : "hidden"
			}); // 禁用滚动条
		});
		logPanel.on('click', '.ui-ytlog-footer .clean', function() {
			logContent.html('');
		});
		logPanel.on('click', '.ui-ytlog-content .fold', function() {
			$(this).parent().toggleClass("fold-show");
		});
	}
	function handleError(){
		window.onerror = function(msg,url,l){
			var error = {
				'错误信息' : msg,
				'错误文件' : url,
				'错误行数' : l
			};
			YT.log.error('js异常',error);
		}
	}
	var log = {
		/**
		 * 日志信息
		 */
		info : function() {
			wlog("info", arguments);
		},
		/**
		 * 调试信息
		 */
		debug : function() {
			wlog("debug", arguments);
		},
		/**
		 * 警告信息
		 */
		warn : function() {
			wlog("warn", arguments);
		},
		/**
		 * 错误信息
		 */
		error : function() {
			wlog("error", arguments);
		}
	}
	/**
	 * 判断Web模式是否打印日志
	 */
	var rst = null;
	if (window.LOG_DEBUG && console) {
		if (Device.os == 'iphone' || Device.os == 'android') {
			initYTLog();
			rst = log;
		} else {
			rst = console;
		}
	}else {
		rst = {
			/** 日志信息 */
			info : function() {
			},
			/** 调试信息 */
			debug : function() {
			},
			/** 警告信息 */
			warn : function() {
			},
			/** 错误信息 */
			error : function() {
			}
		};
	}
	YT.log = rst;
});