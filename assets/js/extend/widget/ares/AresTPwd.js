/**
 * <code>
 * AresTPwd 密码键盘组件
 * 
 * 
 * 
 * </code>
 */
define(function(require, exports) {
	var TAG = "AresTPwd";
	YT.log.debug("---内部组件--init----", TAG);
	// 内部组件不提供外部调用支持
	var me = {};// me为当前控件的函数命名空间
	var callback,AppL;
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
		var ele = widget;
		var PW_type = ele.attr('data-type');
		var kbType = 0;
		var chaosMode = 1;
		if("LPwd" == PW_type){//登录密码
			kbType = 0;
			chaosMode = 1;
		}else{//交易密码
			kbType = 1;
			chaosMode = 1;
		}
		
		if(typeof(YT.kb) == "undefined"){
			YT.kb = new keyBoard( {
				"chaosMode" : chaosMode, // 混乱模式,0:无混乱;1:打开时乱一次;2:每输入一个字符乱一次,默认值0
				"pressStatus" : 0, // 按键状态,0:按下、抬起按键无变化;1:放大镜效果2:按下、抬起按键的颜色变化,默认值0
				"kbType" : kbType, // 键盘类型,0:全键盘;1:纯数字键盘,默认值0
				"svg" : "assets/img/svg",//svg图片的地址
//				"hasMap" : "1",//是否调用mapping值：当为1时调用，当为非1时，不调用
				"license" : "dzVOS2ZITHpFWS80SEgrOXFrU0VweTBWdkJLV0M4UEhmdlFEZ01vVkJBWDhaclBWSlhEQzdLSzRya2RCRWF2K1VqMUkxTEQxcytDTlhvbnZLTEl2amhVL0puV1VOZ2lJMllBL0JqSVZrTlNmdEhwQjRraUlXRGdPMWlmdjN6OFpkMlRnaWdDNXBJVkdLa1lPRGxRa2drblROZ2RsdWx1TG1jSXJqMFArUi84PXsiaWQiOjAsInR5cGUiOiJ0ZXN0IiwicGxhdGZvcm0iOjEwLCJub3RiZWZvcmUiOiIyMDIwMDcyOCIsIm5vdGFmdGVyIjoiMjAyMDEwMjgifQ=="
			});
		}
		
		if($("#testkbid")[0] == undefined){
			YT.kb.generate();
		}

//		passGuard.mapArr = "Wyc0MycsICc1NycsICc3MScsICcxMjEnLCAnMTI2JywgJzEyNCcsICc5MCcsICcxMTInLCAnODknLCAnOTMnLCAnMTA1JywgJzgxJywgJzExMycsICcxMjUnLCAnNjgnLCAnMzgnLCAnODUnLCAnNjUnLCAnMTE4JywgJzgwJywgJzg3JywgJzkxJywgJzQ0JywgJzMzJywgJzc4JywgJzg4JywgJzk2JywgJzEwOScsICc2MScsICc2NicsICc0MCcsICc4MicsICc3MicsICcxMjAnLCAnOTUnLCAnMTEwJywgJzQ2JywgJzg2JywgJzEwNycsICc1MCcsICc3MCcsICc5OCcsICcxMTcnLCAnMzYnLCAnMTAxJywgJzgzJywgJzQ4JywgJzExNCcsICc2NycsICc3NycsICcxMDgnLCAnMTAwJywgJzM1JywgJzczJywgJzY5JywgJzk5JywgJzEwMicsICc3NicsICc3NScsICcxMDQnLCAnNDknLCAnOTInLCAnNjInLCAnNTgnLCAnNTMnLCAnNzknLCAnOTcnLCAnNDUnLCAnNDEnLCAnMTE5JywgJzEyMycsICc1MScsICc2MycsICc0NycsICcxMDYnLCAnMzknLCAnMTExJywgJzExNScsICczNCcsICc5NCcsICcxMjInLCAnNjQnLCAnNTknLCAnMTE2JywgJzM3JywgJzc0JywgJzU1JywgJzYwJywgJzU0JywgJzUyJywgJzQyJywgJzg0JywgJzEwMycsICc1Nidd";
		me.initPassGuard(widget, panel, app, json);
		
		YT.log.info('init begin', TAG);
		YT.log.info('init finish', TAG);
	};
	
	//初始化密码输入框
	me.initPassGuard = function(widget, panel, app, json){
		var ele = widget;
		var PW_type = ele.attr('data-type');
		var maxLength = "";
		var pwType = "";
		if("LPwd" == PW_type){//登录密码
			maxLength = 12;
			pwType = 0;
		}else{//交易密码
			maxLength = 6;
			pwType = 3;
		}
		
		callback = widget.attr('data-callback');// 回调函数
		AppL = app;
		console.log();
//		callback && app[callback](hasCurrent, widget);
		var id = widget.attr('id');
		if("LG_PASS_WORD_ZCQ" == id || "LG_PASS_WORD_SZ_A" == id){
			YT.passGuard1 = new passGuard(
					{
						"mappurl" : "",
						"jump": 1, //是否用添加删除回调：1代表使用，0代表不使用
						"add": me.tianjia, //输入框值添加回调,当jump为1时，才有回调
						"del": me.jianshao, //输入框值减少回调,当jump为1时，才有回调
						"maxLength" : maxLength, // 最大输入长度
						"regExp1" : "[\\S\\s]", // 输入过程限制的正则
						"regExp2" : "[\\/\\\\\"\\']",//"[\\S\\s]{6,12}"
						"displayMode" : 0, // 显示形式,0:星号;1:明文,默认值0
						"callBack" : me.cbs1, //成功回调
						"errorCallBack" : me.cb2, //失败回调
						"focus":me.inputFocus1,//H5键盘获取焦点回调
					    "blur":me.inputBlur1,//H5键盘失去焦点回调
						//"rsaPublicKey" : "3081890281810092d9d8d04fb5f8ef9b8374f21690fd46fdbf49b40eeccdf416b4e2ac2044b0cfe3bd67eb4416b26fd18c9d3833770a526fd1ab66a83ed969af74238d6c900403fc498154ec74eaf420e7338675cad7f19332b4a56be4ff946b662a3c2d217efbe4dc646fb742b8c62bfe8e25fd5dc59e7540695fa8b9cd5bfd9f92dfad009d230203010001" // rsa公钥
						//"rsaPublicKey" : "30818902818100828a4c41558d93e5ab5d1271ed497146e740edceac0f5cf7470349b5dcc7b00e941713ec11dbe0cb4f2bedc7ee4b92868c822ded46452e8a09928ccc5539a9ef4f71193ee32e90fd539e404558db386df16084d2ebcb3171aea867fd8049a018bd4fd10ba0f851713052672e9cf06e6782b2c46461b162ab6500472c2512ec350203010001", // rsa公钥
						//DEV公钥
					    "sm2KeyHex" : YT.Format.fmtNsType("sm2KeyHex",'WX_KEYBORAD')
						//SIT公钥
					    //"sm2KeyHex" : "A6D37D90B0914117BF59F9845CE539E22207B20A46DC2AB01281E05C8EA243CCBC1B6BE7A3601A66BB0AD2D4838DB8E076A06A21F61A0D38BCAFDD5584BDD27E"
					});
			
			
			YT.passGuard1.generate(id, YT.kb, "YT.passGuard1", pwType);	
//			YT.passGuard.setRandKey("12345678qqqq")
		}else if("LG_PASS_WORD_SZ_C" == id || "LG_PASS_WORD_SZ_D" == id){
			YT.passGuard2 = new passGuard(
					{
						"mappurl" : "",
						"jump": 1, //是否用添加删除回调：1代表使用，0代表不使用
						"add": me.tianjia, //输入框值添加回调,当jump为1时，才有回调
						"del": me.jianshao, //输入框值减少回调,当jump为1时，才有回调
						"maxLength" : maxLength, // 最大输入长度
						"regExp1" : "[\\S\\s]", // 输入过程限制的正则
						"regExp2" : "[\\/\\\\\"\\']",
						"displayMode" : 0, // 显示形式,0:星号;1:明文,默认值0
						"callBack" : me.cbs2, //成功回调
						"errorCallBack" : me.cb2, //失败回调
						"focus":me.inputFocus1,//H5键盘获取焦点回调
					    "blur":me.inputBlur2,//H5键盘失去焦点回调
						//"rsaPublicKey" : "3081890281810092d9d8d04fb5f8ef9b8374f21690fd46fdbf49b40eeccdf416b4e2ac2044b0cfe3bd67eb4416b26fd18c9d3833770a526fd1ab66a83ed969af74238d6c900403fc498154ec74eaf420e7338675cad7f19332b4a56be4ff946b662a3c2d217efbe4dc646fb742b8c62bfe8e25fd5dc59e7540695fa8b9cd5bfd9f92dfad009d230203010001" // rsa公钥
						//"rsaPublicKey" : "30818902818100828a4c41558d93e5ab5d1271ed497146e740edceac0f5cf7470349b5dcc7b00e941713ec11dbe0cb4f2bedc7ee4b92868c822ded46452e8a09928ccc5539a9ef4f71193ee32e90fd539e404558db386df16084d2ebcb3171aea867fd8049a018bd4fd10ba0f851713052672e9cf06e6782b2c46461b162ab6500472c2512ec350203010001", // rsa公钥
					    //DEV公钥
					    "sm2KeyHex" : YT.Format.fmtNsType("sm2KeyHex",'WX_KEYBORAD'),
						//SIT公钥
						//"sm2KeyHex" : "A6D37D90B0914117BF59F9845CE539E22207B20A46DC2AB01281E05C8EA243CCBC1B6BE7A3601A66BB0AD2D4838DB8E076A06A21F61A0D38BCAFDD5584BDD27E"
					});
			
			
			YT.passGuard2.generate(id, YT.kb, "YT.passGuard2", pwType);	
//			YT.passGuard.setRandKey("12345678qqqq")
		}else{
			YT.passGuard = new passGuard(
					{
						"mappurl" : "",
						"jump": 1, //是否用添加删除回调：1代表使用，0代表不使用
						"add": me.tianjia, //输入框值添加回调,当jump为1时，才有回调
						"del": me.jianshao, //输入框值减少回调,当jump为1时，才有回调
						"maxLength" : maxLength, // 最大输入长度
						"regExp1" : "[\\S\\s]", // 输入过程限制的正则
						"regExp2" : "[\\/\\\\\"\\']",//^(?![0-9]+$)(?![a-zA-Z]+$)[\!\@\#\$\%\^&\*\(\)\=\_\:\;\?\~\|\+\-\{\}\,\.\<\>\`0-9A-Za-z]{8,12}$
						"displayMode" : 0, // 显示形式,0:星号;1:明文,默认值0
						"callBack" : me.cbs, //成功回调
						"errorCallBack" : me.cb2, //失败回调
						"focus": me.inputFocus1,//H5键盘获取焦点回调
					    "blur": me.inputBlur2,//H5键盘失去焦点回调
						//"rsaPublicKey" : "3081890281810092d9d8d04fb5f8ef9b8374f21690fd46fdbf49b40eeccdf416b4e2ac2044b0cfe3bd67eb4416b26fd18c9d3833770a526fd1ab66a83ed969af74238d6c900403fc498154ec74eaf420e7338675cad7f19332b4a56be4ff946b662a3c2d217efbe4dc646fb742b8c62bfe8e25fd5dc59e7540695fa8b9cd5bfd9f92dfad009d230203010001" // rsa公钥
						//"rsaPublicKey" : "30818902818100828a4c41558d93e5ab5d1271ed497146e740edceac0f5cf7470349b5dcc7b00e941713ec11dbe0cb4f2bedc7ee4b92868c822ded46452e8a09928ccc5539a9ef4f71193ee32e90fd539e404558db386df16084d2ebcb3171aea867fd8049a018bd4fd10ba0f851713052672e9cf06e6782b2c46461b162ab6500472c2512ec350203010001", // rsa公钥
					    //DEV公钥
					    "sm2KeyHex" : YT.Format.fmtNsType("sm2KeyHex",'WX_KEYBORAD')
						//SIT公钥
						//"sm2KeyHex" : "A6D37D90B0914117BF59F9845CE539E22207B20A46DC2AB01281E05C8EA243CCBC1B6BE7A3601A66BB0AD2D4838DB8E076A06A21F61A0D38BCAFDD5584BDD27E"
					});
			YT.passGuard.generate(id, YT.kb, "YT.passGuard", pwType);
		}
	};
	//成功回调
	me.cbs = function(){
		if(YT.passGuard.getLength()==0){
			YT.showTips("确认密码不能为空！");
			return false;
		}
		if(YT.passGuard.getLength()<8||YT.passGuard.getLength()>12){
			YT.showTips("确认密码不能少于8位或大于12位！");
			return false;
		}
		//是否有不能输入的特殊字符
		var val = YT.passGuard.getValid();
		if(val == 0){
			YT.showTips("密码不能包含/\\\"'四个特殊字符！");
			return false;
		}
		//组合类型数字+字母
		var type = YT.passGuard.pwdCommon();//0,1,2,4,6,8,9,10,12,14
		if(type!=3 && type!=5 && type!=7 && type!=11 && type!=13 && type!=15){
			YT.showTips("当前密码强度过低,请输入8-12位字母+数字组合密码！");
			return false;
		}
		
	};
	//添加回调
	me.tianjia = function(xh){
		console.log(xh)
		callback && AppL[callback](xh);// 调用回调
	}
	//删除回调
	me.jianshao = function(xh){
		
	}
	//成功回调
	me.cbs1 = function(){
		if(YT.passGuard1.getLength()==0){
			YT.showTips("确认密码不能为空！");
			return false;
		}
		if(YT.passGuard1.getLength()<8||YT.passGuard1.getLength()>12){
			YT.showTips("确认密码不能少于8位或大于12位！");
			return false;
		}
		//是否有不能输入的特殊字符
		var val = YT.passGuard1.getValid();
		if(val == 0){
			YT.showTips("密码不能包含/\\\"'四个特殊字符！");
			return false;
		}
		//组合类型数字+字母
		var type = YT.passGuard1.pwdCommon();//0,1,2,4,6,8,9,10,12,14
		if(type!=3 && type!=5 && type!=7 && type!=11 && type!=13 && type!=15){
			YT.showTips("当前密码强度过低,请输入8-12位字母+数字组合密码！");
			return false;
		}
	};
	//成功回调
	me.cbs2 = function(){
		if(YT.passGuard2.getLength()==0){
			YT.showTips("确认密码不能为空！");
			return false;
		}
		if(YT.passGuard2.getLength()<8||YT.passGuard2.getLength()>12){
			YT.showTips("确认密码不能少于8位或大于12位！");
			return false;
		}
		//是否有不能输入的特殊字符
		var val = YT.passGuard2.getValid();
		if(val == 0){
			YT.showTips("密码不能包含/\\\"'四个特殊字符！");
			return false;
		}
		//组合类型数字+字母
		var type = YT.passGuard2.pwdCommon();//0,1,2,4,6,8,9,10,12,14
		if(type!=3 && type!=5 && type!=7 && type!=11 && type!=13 && type!=15){
			YT.showTips("当前密码强度过低,请输入8-12位字母+数字组合密码！");
			return false;
		}
	};
	me.cb2 = function(){
		
	};
	
	me.inputFocus1 = function(){
		
	};
	
	me.inputBlur1 = function(){
		
	};
	me.inputBlur = function(){
		
	};
	me.inputBlur2 = function(){
     
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