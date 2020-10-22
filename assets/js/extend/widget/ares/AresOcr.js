/**
 * <code>
 * AresOcr Ocr扫描 
 * 
 * ---宁波银行移动开发平台 
 * ---厂商:合合信息
 * 
 * 
 * 1.银行卡返回参数
 * ---result.OCR_INFO 银行卡号
 * ---result.img1Base64 银行卡卡号照片
 * 2.身份证正面返回参数
 * ---result.OCR_INFO  身份证信息
 * ---result.OCR_INFO.IDN_NO 身份证号码
 * ---result.OCR_INFO.NAME	姓名
 * ---result.OCR_INFO.SEX	性别
 * ---result.OCR_INFO.NATION_CODE	民族
 * ---result.OCR_INFO.BIRTH_DAY	出生
 * ---result.OCR_INFO.ADDR	地址
 * ---result.img1Base64	身份证正面照片
 * ---result.img2Base64	身份证头像照片
 * 3.身份证背面返回参数
 * ---result.OCR_INFO	身份证信息
 * ---result.OCR_INFO.ORG	签发机构
 * ---result.OCR_INFO.IDN_DATE	证件有限期
 * ---result.img1Base64	身份证背面照片
 * 4.行驶证正面返回参数
 * ---result.OCR_INFO	行驶证正面信息
 * ---result.OCR_INFO.PLATE_NO	车牌号
 * ---result.OCR_INFO.VEHICLE_TYPE	车辆类型
 * ---result.OCR_INFO.OWNER	所有人
 * ---result.OCR_INFO.ADDR	地址
 * ---result.OCR_INFO.MODEL	品牌类型
 * ---result.OCR_INFO.VIN	车辆识别代号
 * ---result.OCR_INFO.ENGINE_NO	发动机号码
 * ---result.OCR_INFO.REGI_DATE	注册日期
 * ---result.OCR_INFO.ISSUE_DATE	发证日期
 * ---result.OCR_INFO.USE_CHAR	使用性质
 * ---result.img1Base64	行驶证正面照片
 * 5.行驶证背面返回参数
 * ---result.OCR_INFO	车牌号
 *  ---result.img1Base64	行驶证背面照片
 * 6.营业执照返回参数
 * ---result.OCR_INFO	统一社会信用代码识别
 * </code>
 */
define(function(require, exports) {
	var TAG = "AresOcr";
	YT.log.debug("---内部组件--init----", TAG);
	// 内部组件不提供外部调用支持
	var me = {// me为当前控件的函数命名空间
		/**
		 * 原生插件调用方法名称
		 */
		OCR_TYPE : {
			"BankCard" : "scanBankCardOCR",// 银行卡
			"IDCardFront" : "scanIDCardFrontOCR",// 身份证正面
			"IDCardBack" : "scanIDCardBackOCR",// 身份证背面
			"VehicleLicenceFront" : "scanVehicleLicenceFrontOCR",// 行驶证正面
			"VehicleLicenceBack" : "scanVehicleLicenceBackOCR",// 行驶证背面
			"BusinessLicence" : "scanBusinessLicenceOCR"// 营业执照
		},
		/**
		 * 原生插件回调数据解析函数名称
		 */
		OCR_PARSE : {
			"BankCard" : "parseBankCardOCR",// 银行卡
			"IDCardFront" : "parseIDCardFrontOCR",// 身份证正面
			"IDCardBack" : "parseIDCardBackOCR",// 身份证背面
			"VehicleLicenceFront" : "parseVehicleLicenceFrontOCR",// 行驶证正面
			"VehicleLicenceBack" : "parseVehicleLicenceBackOCR",// 行驶证背面
			"BusinessLicence" : "parseBusinessLicenceOCR"// 营业执照
		},
		/**
		 * 原生ocr初始化函数
		 * 
		 * @param widget
		 *            当前组件
		 * @param panel
		 *            当前容器作用域，通常为page容器
		 * @param app
		 *            处理器
		 * @param json
		 *            数据处理
		 * @param ocrType
		 *            插件类型
		 * @param callback
		 *            回调函数
		 */
		initClientOcr : function(widget, panel, app, json, ocrType, callback) {
			var func = me.OCR_TYPE[ocrType];// 获取插件库方法名称
			if (YT.isEmpty(func) || YT.isEmpty(YT[func])) {// ocr类型未定义
				YT.alertinfo('ocr类型[' + ocrType + ']未定义');
				return;
			}
			var ele = widget;
			// ocr扫面元素处理函数
			function ocrResultFunc(_data) {
				// 获取配置的原生扫描的元素解析函数
				var parseFunc = me.OCR_PARSE[ocrType];// 解析扫描的结果信息
				if (YT.isEmpty(parseFunc) || YT.isEmpty(me[parseFunc])) {// 解析扫描的结果未定义
					app && app[callback] && app[callback](_data);// 直接返回
				} else {
					me[parseFunc](_data, app[callback],ele);
				}
			}
			// 对ocr出发元素绑定点击事件
			widget.on('click', '.x-item-ocr', function() {
				YT[func] && YT[func](ocrResultFunc);// 执行对应的插件库内容
			});
		},
		/**
		 * 解析ocr原生扫描的银行卡信息
		 */
		parseBankCardOCR : function(_data, callback,ele) {
			if (YT.isEmpty(_data)) {
				YT.alertinfo('银行卡信息扫描获取异常');
				return;
			}
			var ocrResult, img1Base64, img2Base64;
			var result = {};
			if (YT.isWeb()) {
				ocrResult = _data.cardNo;// 银行卡卡号
				if (YT.isEmpty(ocrResult)) {// 判断银行卡是否获取全
					YT.alertinfo('银行卡信息扫描获取异常');
					return;
				}
				result.random = _data.random;
			} else {
				ocrResult = _data.ocrResult;// 扫描文本
				if (YT.isEmpty(ocrResult)) {// 判断银行卡是否获取全
					YT.alertinfo('银行卡信息扫描获取异常');
					return;
				}
			}
			img1Base64 = _data.img1Base64;// 扫面图片1
			img2Base64 = _data.img2Base64;// 扫描图片2
			result.OCR_INFO = ocrResult;// 银行卡号
			result.img1Base64 = img1Base64;// 银行卡卡号照片
			result.img2Base64 = img2Base64;// 无
			ele && ele.find('input[data-type="acct"]') && ele.find('input[data-type="acct"]').val(YT.Format.fmtAcctNo('' + ocrResult));
			callback && callback(result);
		},
		/**
		 * 解析ocr原生身份证正面信息
		 */
		parseIDCardFrontOCR : function(_data, callback,ele) {
			if (YT.isEmpty(_data)) {
				YT.alertinfo('身份证正面信息扫描获取异常');
				return;
			}
			var result = {};
			var ocrResult, img1Base64, img2Base64;
			var IDCard = {};
			if (YT.isWeb()) {
				IDCard.IDN_NO = _data.cardNo;// 身份证号码
				IDCard.NAME = _data.name;// 姓名
				IDCard.SEX = _data.sex;// 性别
				IDCard.NATION_CODE = _data.people;// 民族
				IDCard.BIRTH_DAY = _data.birthday;// 出生
				IDCard.ADDR = _data.address;// 地址
				result.random = _data.random;
			} else {
				ocrResult = _data.ocrResult;// 扫描文本
				if (YT.isEmpty(ocrResult)) {// 判断银行卡是否获取全
					YT.alertinfo('身份证正面信息扫描获取异常');
					return;
				}
				var results = ocrResult.split('|');
				// 0-身份证号码，1-姓名，2-性别，3-民族，4-出生，5-地址
				if (results.length < 6) {// 判断身份证正面信息是否获取全
					YT.alertinfo('身份证正面信息扫描获取异常');
					return;
				}
				IDCard.IDN_NO = results[0];// 身份证号码
				IDCard.NAME = results[1];// 姓名
				IDCard.SEX = results[2];// 性别
				IDCard.NATION_CODE = results[3];// 民族
				IDCard.BIRTH_DAY = results[4];// 出生
				IDCard.ADDR = results[5];// 地址
			}
			img1Base64 = _data.img1Base64;// 扫面图片1
			img2Base64 = _data.img2Base64;// 扫描图片2
			result.OCR_INFO = IDCard;// 身份证信息
			result.img1Base64 = img1Base64;// 身份证正面照片
			result.img2Base64 = img2Base64;// 身份证头像照片
			ele && ele.find('input[data-type="certNo"]') && ele.find('input[data-type="certNo"]').val(IDCard.IDN_NO);
			callback && callback(result);
		},
		/**
		 * 解析ocr原生身份证背面数据解析
		 */
		parseIDCardBackOCR : function(_data, callback) {
			if (YT.isEmpty(_data)) {
				YT.alertinfo('身份证背面信息扫描获取异常');
				return;
			}
			var result = {};
			var ocrResult, img1Base64, img2Base64;
			var IDCard = {};
			if (YT.isWeb()) {
				IDCard.ORG = _data.organ;// 签发机构
				IDCard.IDN_DATE = _data.deadline;// 证件有限期
				result.random = _data.random;
			} else {
				ocrResult = _data.ocrResult;// 扫描文本
				if (YT.isEmpty(ocrResult)) {// 判断银行卡是否获取全
					YT.alertinfo('身份证背面信息扫描获取异常');
					return;
				}
				var results = ocrResult.split('|');
				// 0-签发机构，1-有限期
				if (results.length < 2) {// 判断身份证背面信息是否获取全
					YT.alertinfo('身份证背面信息扫描获取异常');
					return;
				}
				IDCard.ORG = results[0];// 签发机构
				IDCard.IDN_DATE = results[1];// 证件有限期
			}
			img1Base64 = _data.img1Base64;// 扫面图片1
			img2Base64 = _data.img2Base64;// 扫描图片2
			result.OCR_INFO = IDCard;// 身份证信息
			result.img1Base64 = img1Base64;// 身份证背面照片
			result.img2Base64 = img2Base64;// 无
			callback && callback(result);
		},
		/**
		 * 解析ocr原生行驶证正面数据解析
		 */
		parseVehicleLicenceFrontOCR : function(_data, callback) {
			if (YT.isEmpty(_data)) {
				YT.alertinfo('行驶证正面信息扫描获取异常');
				return;
			}
			var result = {};
			var ocrResult, img1Base64, img2Base64;
			var VehicleLicence = {};// 行驶证信息
			if (YT.isWeb()) {
				VehicleLicence.PLATE_NO = _data.carNo;// 车牌号
				VehicleLicence.VEHICLE_TYPE = _data.carType;// 车辆类型
				VehicleLicence.OWNER = _data.owner;// 所有人
				VehicleLicence.ADDR = _data.address;// 地址
				VehicleLicence.MODEL = _data.brand;// 品牌类型
				VehicleLicence.VIN = _data.VINCode;// 车辆识别代号
				VehicleLicence.ENGINE_NO = _data.engineNo;// 发动机号码
				VehicleLicence.REGI_DATE = _data.registerDate;// 注册日期
				VehicleLicence.ISSUE_DATE = _data.licenceDate;// 发证日期
				VehicleLicence.USE_CHAR = _data.useProperty;// 使用性质
				result.random = _data.random;
			} else {
				ocrResult = _data.ocrResult;// 扫描文本
				if (YT.isEmpty(ocrResult)) {// 判断行驶证正面是否获取全
					YT.alertinfo('行驶证正面信息扫描获取异常');
					return;
				}
				var results = ocrResult.split('|');
				// 0-车牌号，1-车辆类型，2-所有人，3-地址，4-品牌类型，5-车辆识别代号，6-发动机号码，7-注册日期，8-发证日期，9-使用性质
				if (results.length < 10) {// 判断行驶证正面是否获取全
					YT.alertinfo('行驶证正面信息扫描获取异常');
					return;
				}
				VehicleLicence.PLATE_NO = results[0];// 车牌号
				VehicleLicence.VEHICLE_TYPE = results[1];// 车辆类型
				VehicleLicence.OWNER = results[2];// 所有人
				VehicleLicence.ADDR = results[3];// 地址
				VehicleLicence.MODEL = results[4];// 品牌类型
				VehicleLicence.VIN = results[5];// 车辆识别代号
				VehicleLicence.ENGINE_NO = results[6];// 发动机号码
				VehicleLicence.REGI_DATE = results[7];// 注册日期
				VehicleLicence.ISSUE_DATE = results[8];// 发证日期
				VehicleLicence.USE_CHAR = results[9];// 使用性质
			}
			img1Base64 = _data.img1Base64;// 扫面图片1
			img2Base64 = _data.img2Base64;// 扫描图片2
			result.OCR_INFO = VehicleLicence;// 行驶证正面信息
			result.img1Base64 = img1Base64;// 行驶证正面照片
			result.img2Base64 = img2Base64;// 无
			callback && callback(result);
		},
		/**
		 * 解析ocr原生行驶证背面照片
		 */
		parseVehicleLicenceBackOCR : function(_data, callback) {
			if (YT.isEmpty(_data)) {
				YT.alertinfo('行驶证背面信息扫描获取异常');
				return;
			}
			var result = {};
			var ocrResult, img1Base64, img2Base64;
			if (YT.isWeb()) {
				YT.alertinfo('行驶证背面信息扫描获取异常');
			} else {
				ocrResult = _data.ocrResult;// 扫描文本
				if (YT.isEmpty(ocrResult)) {// 判断行驶证正面是否获取全
					YT.alertinfo('行驶证背面信息扫描获取异常');
					return;
				}
			}
			img1Base64 = _data.img1Base64;// 扫面图片1
			img2Base64 = _data.img2Base64;// 扫描图片2
			result.OCR_INFO = ocrResult;// 车牌号
			result.img1Base64 = img1Base64;// 行驶证背面照片
			result.img2Base64 = img2Base64;// 
			callback && callback(result);
		},
		/**
		 * 解析ocr原生营业执照-统一社会信用代码识别
		 */
		parseBusinessLicenceOCR : function(_data, callback) {
			if (YT.isEmpty(_data)) {
				YT.alertinfo('营业执照信息扫描获取异常');
				return;
			}
			var result = {};
			var ocrResult, img1Base64, img2Base64;
			if (YT.isWeb()) {
				YT.alertinfo('营业执照信息扫描获取异常');
			} else {
				ocrResult = _data.ocrResult;// 扫描文本
				if (YT.isEmpty(ocrResult)) {// 判断行驶证正面是否获取全
					YT.alertinfo('行驶证背面信息扫描获取异常');
					return;
				}
			}
			img1Base64 = _data.img1Base64;// 扫面图片1
			img2Base64 = _data.img2Base64;// 扫描图片2
			result.OCR_INFO = ocrResult;// 统一社会信用代码识别
			result.img1Base64 = img1Base64;// 无
			result.img2Base64 = img2Base64;// 无
			callback && callback(result);
		},
		/**
		 * Web插件ocr初始化函数
		 * 
		 * @param widget
		 *            当前组件
		 * @param panel
		 *            当前容器作用域，通常为page容器
		 * @param app
		 *            处理器
		 * @param json
		 *            数据处理
		 * @param ocrType
		 *            插件类型
		 * @param callback
		 *            回调函数
		 */
		initWebOcr : function(widget, panel, app, json, ocrType, callback) {
			// 添加Web插件的数据接口
			var ocrFile = '<input type="file" accept="image/*" capture="camera" class="webOcrInput">';
			widget.find('.x-item-ocr').append($(ocrFile));
			var ele = widget;
			var func = me.OCR_TYPE[ocrType];// 获取插件库方法名称
			if (YT.isEmpty(func) || YT.isEmpty(YT[func])) {// ocr类型未定义
				YT.alertinfo('ocr类型[' + ocrType + ']未定义');
				return;
			}
			// ocr扫面元素处理函数
			function ocrResultFunc(_data) {
				// 判断扫面的结果信息是否为空
				if (YT.isEmpty(_data)) {
					YT.alertinfo('插件调用异常!');
					return;
				}
				// 获取配置的原生扫描的元素解析函数
				var parseFunc = me.OCR_PARSE[ocrType];// 解析扫描的结果信息
				if (YT.isEmpty(parseFunc) || YT.isEmpty(me[parseFunc])) {// 解析扫描的结果未定义
					app && app[callback] && app[callback](_data);// 直接返回
				} else {
					me[parseFunc](_data, app[callback],ele);
				}
			}
			widget.on('change', '.webOcrInput', function(e) {
				// web接口请求参数
				var params = {};
				YT[func] && YT[func](ocrResultFunc, e, params);// 执行对应的插件库内容
			});
		}
	};

	/**
	 * <code>
	 * 初始化控件的事件、值、展现等信息
	 * 
	 * @param widget 当前组件
	 * @param panel 当前容器作用域，通常为page容器
	 * @param app 处理器
	 * @param json 数据处理
	 * </code>
	 */
	me.init = function(widget, panel, app, json) {
		YT.log.info('init begin', TAG);
		var callback = widget.attr('data-callback');// 回调函数
		var ocrType = widget.attr('data-ocr');// ocr类型
		if (YT.isEmpty(callback) || YT.isEmpty(app[callback])) {
			YT.alertinfo('ocr扫描回调未定义');
			return;
		}
		if (YT.isWeb()) {// 判断是否为浏览器进入
			me.initWebOcr(widget, panel, app, json, ocrType, callback);// 调用Web的ocr扫描函数
		} else {
			me.initClientOcr(widget, panel, app, json, ocrType, callback);// 调用客户端的ocr扫描函数
		}
		YT.log.info('init finish', TAG);
	};
	/**
	 * <code>
	 * 重置控件的值、展现等信息，不含事件定义
	 * 
	 * @param widget 当前组件
	 * @param panel 当前容器作用域，通常为page容器
	 * @param app 处理器
	 * @param json 数据处理
	 * </code>
	 */
	me.reset = function(widget, panel, app, json) {
		YT.log.info('reset begin', TAG);
		YT.log.info('reset finish', TAG);
	};
	// 组件的外置接口
	exports.init = me.init;
	exports.reset = me.reset;

})