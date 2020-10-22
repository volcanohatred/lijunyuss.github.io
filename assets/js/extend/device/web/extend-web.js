$(function() {
	var TAG = "extend-web:YT.Client";
	/**
	 * @fileOverview 客户端交互方法定义（ios与android相同）自定义扩展
	 * @nameSpace YT.Client(client)
	 */
	var me = {
		/**
		 * @description web页面通讯模式行为分析请求开关
		 */
		isCollection : true,
		/**
		 * @description web页面通讯访问渠道号 TODO 各系统自行修改
		 */
		chnlId : '100',
		/**
		 * @description web页面通讯是否连接网关通讯
		 */
		isGateWay : true,
		/**
		 * @description web页面通讯是否通讯加密
		 * 0：无需解密
		 * 1：国际三段式加密
		 * 2：国密三段式加密V1
		 * 3：国密三段式加密V2
		 */
		encryptType: 2,
		//isMessageEncrypt : false,
		
		/**
		 * @description 用户通讯SessionId
		 */
		upsSid : '',
		/**
		 * @description 客户端与服务端的时间偏移量
		 */
		timeOffSet : 0,
		/**
		 * @description 服务端超时 需要修改会话超时跳转的页面的操作
		 * @param {string}
		 *            msg 内容
		 * @param {string}
		 *            title 标题名称名称
		 * @param {string}
		 *            okName 确认按钮名称
		 * @example YT.Client.sessionTimeout('会话超时，请重新登录！','标题');
		 */
		sessionTimeout : function(msg, title, okName) {
			/*title = title || "温馨提示";
			msg = msg || "会话超时，请重新登录";
			okName = okName || "确定";
			YT.Client.alertinfo(msg, title,"YT.nextPage('page/P02/P0206/P0206.html')");*/
			YT.alertinfo("会话超时，请重新登录","温馨提示",function(){
				var refreshData={isRefresh : true};
				YT.nextPage('page/P02/P0206/P0206.html',refreshData)
			});
		},
		/**
		 * @description 人脸识别
		 * @param callback
		 *            回调函数
		 */
		liveFaceCheck : function(callback, e, params) {
			YT.Client._liveFaceCheck(callback, e, params);
		},
		/**
		 * @description 银行卡扫描Ocr
		 * @param callback
		 *            回调函数
		 */
		scanBankCardOCR : function(callback, e, params) {
			var conf = {};
			conf.callback = YT.getFunctionName(callback);// 回调函数
			conf.prevFunc = this._ajaxBankCardOCR;// 请求函数
			conf.param = params;// 参数
			YT.Client._getInputPhoto(conf, e, false);
		},
		/**
		 * @description 身份证正面扫描Ocr
		 * @param callback
		 *            回调函数
		 */
		scanIDCardFrontOCR : function(callback, e, params) {
			var conf = {};
			conf.callback = YT.getFunctionName(callback);// 回调函数
			conf.prevFunc = this._ajaxIDCardFront;// 请求函数
			conf.param = params;// 参数
			YT.Client._getInputPhoto(conf, e, false);
		},
		/**
		 * @description 身份证背面扫描Ocr
		 * 
		 * @param callback
		 *            回调函数
		 */
		scanIDCardBackOCR : function(callback, e, params) {
			var conf = {};
			conf.callback = YT.getFunctionName(callback);// 回调函数
			conf.prevFunc = this._ajaxIDCardBackOCR;// 请求函数
			conf.param = params;// 参数
			YT.Client._getInputPhoto(conf, e, false);
		},
		/**
		 * @description 行驶证正面扫描Ocr
		 * 
		 * @param callback
		 *            回调函数
		 */
		scanVehicleLicenceFrontOCR : function(callback, e, params) {
			var conf = {};
			conf.callback = YT.getFunctionName(callback);// 回调函数
			conf.prevFunc = this._ajaxVehicleLicenceFrontOCR;// 请求函数
			conf.param = params;// 参数
			YT.Client._getInputPhoto(conf, e, false);
		},
		/**
		 * @private
		 * @description 人脸识别页面跳转
		 */
		_liveFaceCheck : function(callback, e, params) {
			var url = 'page/bnbWeb/public/faceCheck/bnbWeb_public_faceCheck.html';
			var elem = $(e.currentTarget);
			elem.attr('data-func', callback);
			var conf = {};
			conf.element = elem;
			conf.params = params || {};
			YT.nextPage(url, conf);
		},
		/**
		 * @private
		 * @description 快捷登录页面跳转
		 */
		_quickLogin : function(callback, e, params) {
			var url = 'page/bnbWeb/public/quickLogin/bnbWeb_public_quickLogin.html';
			var conf = {};
			if (e) {
				var elem = $(e.currentTarget);
				elem.attr('data-func', callback);
				conf.element = elem;
				conf.params = params || {};
			}
			YT.nextPage(url, conf);
		},
		/**
		 * @private
		 * @description 行驶证正面web接口扫描
		 */
		_ajaxVehicleLicenceFrontOCR : function(_img, rate, conf) {
			if (conf && conf.callback) {
			} else {
				YT.alertinfo('未配置行驶证正面OCR识别回调处理!');
			}
			var url = YT.dataUrl('common/ocrAction');
			var json = {};
			if (conf && conf.param) {
				json = YT.apply({}, conf.param);
			}
			// ocr识别类型：1-身份证正面 2-身份证背面 3-身份证正反面 4-银行卡 5-行驶证左面
			json.ocrType = "5";
			// 图片，以下类型必输：身份证正面 银行卡 行驶证左面
			json.ocrImg1 = _img;
			// 图片存放路径的偏移量：例，/channelId/transType/ocrType/
			json.offset = '/' + YT.Client.chnlId + '/'
					+ (YT.isEmpty(json.transType) ? 'default' : json.transType)
					+ '/' + json.ocrType + '/';
			YT.openWaitPanel();
			YT.ajaxData(url, json, function(rsp) {
				if (rsp && rsp.STATUS == '1') {
					if (!rsp.cardInfo) {
						YT.alertinfo('行驶证正面OCR识别失败，请重新拍摄');
					} else {
						var ocr = rsp.cardInfo;
						ocr.img1Base64 = _img;// 行驶证正面信息
						ocr.random = rsp.random;
						window[conf.callback](ocr);
					}
					YT.hideWaitPanel();
				} else {
					YT.alertinfo('行驶证正面OCR识别失败，请重新拍摄');
					YT.hideWaitPanel();
				}
			}, function() {
				YT.alertinfo('行驶证正面OCR识别失败，请重新拍摄');
				YT.hideWaitPanel();
			});
		},
		/**
		 * @private
		 * @description 身份证背面web接口扫描
		 */
		_ajaxIDCardBackOCR : function(_img, rate, conf) {
			if (conf && conf.callback) {
			} else {
				YT.alertinfo('未配置身份证背面OCR识别回调处理!');
			}
			var url = YT.dataUrl('common/ocrAction');
			var json = {};
			if (conf && conf.param) {
				json = YT.apply({}, conf.param);
			}
			// ocr识别类型：1-身份证正面 2-身份证背面 3-身份证正反面 4-银行卡 5-行驶证左面
			json.ocrType = "2";
			// 图片，以下类型必输：身份证背面
			json.ocrImg2 = _img;
			// 图片存放路径的偏移量：例，/channelId/transType/ocrType/
			json.offset = '/' + YT.Client.chnlId + '/'
					+ (YT.isEmpty(json.transType) ? 'default' : json.transType)
					+ '/' + json.ocrType + '/';
			YT.openWaitPanel();
			YT.ajaxData(url, json, function(rsp) {
				if (rsp && rsp.STATUS == '1') {
					if (!rsp.cardInfo) {
						YT.alertinfo('身份证背面OCR识别失败，请重新拍摄');
					} else {
						var ocr = rsp.cardInfo;
						ocr.img1Base64 = _img;// 身份证背面信息
						ocr.random = rsp.random;
						window[conf.callback](ocr);
					}
					YT.hideWaitPanel();
				} else {
					YT.alertinfo('身份证背面OCR识别失败，请重新拍摄');
					YT.hideWaitPanel();
				}
			}, function() {
				YT.alertinfo('身份证背面OCR识别失败，请重新拍摄');
				YT.hideWaitPanel();
			});
		},
		/**
		 * @private
		 * @description 身份证正面web接口扫描
		 */
		_ajaxIDCardFront : function(_img, rate, conf) {
			if (conf && conf.callback) {
			} else {
				YT.alertinfo('未配置身份证正面OCR识别回调处理!');
			}
			var url = YT.dataUrl('common/ocrAction');
			var json = {};
			if (conf && conf.param) {
				json = YT.apply({}, conf.param);
			}
			// ocr识别类型：1-身份证正面 2-身份证背面 3-身份证正反面 4-银行卡 5-行驶证左面
			json.ocrType = "1";
			// 图片，以下类型必输：身份证正面 银行卡 行驶证左面
			json.ocrImg1 = _img;
			// 图片存放路径的偏移量：例，/channelId/transType/ocrType/
			json.offset = '/' + YT.Client.chnlId + '/'
					+ (YT.isEmpty(json.transType) ? 'default' : json.transType)
					+ '/' + json.ocrType + '/';
			YT.openWaitPanel();
			YT.ajaxData(url, json, function(rsp) {
				if (rsp && rsp.STATUS == '1') {
					if (!rsp.cardInfo) {
						YT.alertinfo('身份证正面OCR识别失败，请重新拍摄');
					} else {
						var ocr = rsp.cardInfo;
						ocr.img1Base64 = _img;// 身份证正面信息
						ocr.img2Base64 = ocr.headPort;// 身份证头像信息
						ocr.random = rsp.random;
						window[conf.callback](ocr);
					}
					YT.hideWaitPanel();
				} else {
					YT.alertinfo('身份证正面OCR识别失败，请重新拍摄');
					YT.hideWaitPanel();
				}
			}, function() {
				YT.alertinfo('身份证正面OCR识别失败，请重新拍摄');
				YT.hideWaitPanel();
			});
		},
		/**
		 * @private
		 * @description 银行卡web接口扫描
		 */
		_ajaxBankCardOCR : function(_img, rate, conf) {
			if (conf && conf.callback) {
			} else {
				YT.alertinfo('未配置银行卡OCR识别回调处理!');
			}
			var url = YT.dataUrl('common/ocrAction');
			var json = {};
			if (conf && conf.param) {
				json = YT.apply({}, conf.param);
			}
			// ocr识别类型：1-身份证正面 2-身份证背面 3-身份证正反面 4-银行卡 5-行驶证左面
			json.ocrType = "4";
			// 图片，以下类型必输：身份证正面 银行卡 行驶证左面
			json.ocrImg1 = _img;
			// 图片存放路径的偏移量：例，/channelId/transType/ocrType/
			json.offset = '/' + YT.Client.chnlId + '/'
					+ (YT.isEmpty(json.transType) ? 'default' : json.transType)
					+ '/' + json.ocrType + '/';
			YT.openWaitPanel();
			YT.ajaxData(url, json, function(rsp) {
				if (rsp && rsp.STATUS == '1') {
					if (!rsp.cardInfo) {
						YT.alertinfo('银行卡OCR识别失败，请重新拍摄');
					} else {
						var ocr = rsp.cardInfo;
						ocr.img1Base64 = _img;// 银行卡图片信息
						ocr.random = rsp.random;
						window[conf.callback](ocr);
					}
					YT.hideWaitPanel();
				} else {
					YT.alertinfo('银行卡OCR识别失败，请重新拍摄');
					YT.hideWaitPanel();
				}
			}, function() {
				YT.alertinfo('银行卡OCR识别失败，请重新拍摄');
				YT.hideWaitPanel();
			});
		},
	};
	YT.apply(YT.Client, me);
});
