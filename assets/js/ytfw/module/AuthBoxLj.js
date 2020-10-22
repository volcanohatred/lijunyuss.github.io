;(function() {
	var TAG = "YT.AuthBoxLj";
	var isInit = false,animated = false;
	var authBoxLj;
	var authBoxLjList;
	var group_auth_type = '';
	var phoneBackData;
	var me = YT.AuthBoxLj = {
		_authBoxLjId : "_authBoxLj",
		init : function(func){
			seajs.use('assets/css/func/authLj.css',function(){
				isInit = true;
				func && func();
			});
		},
		/**
		 * 
		 * @param conf
		 *  var conf = {<br>
		 *  	tpl : '<div></div>',//模板<br>
		 *  	params: params, //填充模板信息<br>
		 *  	type: <br>//认证方式
		 *  		{
		 *  			1.查询(短信、UK、OTP)
		 *				2.取款密码
		 *				3.取款密码+安全认证方式(短信、UK、OTP)
		 *				4.查询(短信、UK、OTP[过滤掉短信认证])
		 *  		}
		 *  	success: App.success, //成功回调方法<br>
		 *  	error: App.error //失败回调方法<br>
		 *  }
		 */
		openAuthPanel : function(conf) {
			animated = false;
			if(!isInit){
				me.init(function(){
					me.openAuthPanel(conf);
				});
				return false;
			}
			me.hideAuthPanel();
			var $this =this;
			//初始化键盘
			me.initTransPass(function(){
				this._conf = me._conf = conf;
				if(conf.smsBack){
					this.smsBack = me.smsBack = conf.smsBack;
				}
				var tpl = conf.tpl ? conf.tpl : "";
				var layer = document.createElement("div");
				document.body.appendChild(layer);
				layer.id = $this._authBoxLjId;
				var params = conf.params;
				var html_tpl = 
					'<div class="yui-auth-layer">'+
						'<div class="yui-auth-panel">'+						
							'<div class="yui-auth-form auth-animated ">'+
								'<div class="yui-auth-close">'+
								'<span>请输入</span>'+
								'<i data-event="closeAuth"></i>'+
								'</div>'+
								'<div style="padding:0 10px" data-name="phoneNumber">'+
								'<div class="yui-auth-tra">'+
								   '<div class="tra_tit">${LzTitle}</div>'+
								   '<div class="tra_money">￥${lzMoney|fmtAmt}</div>'+
								'</div>'+
								/*tpl +*/
								'<div class="yui-auth-form-item  yui-auth-pwd auth-input" data-authtype="CPWD">'+
								'	<label class="ui-txt-info ui-txt-tips pwd_tips">请输入账户交易密码</label>'+
								'	<span class="pwd-container">'+						
								'<div class="pay">'+
								'<input type="text" data-required="true" readonly="readonly" id="PASS_WORD" class="default" data-label="交易密码" data-name="PASS_WORD"   data-type="TPwd" maxlength="6" data-maxlength="6"/>'+
								'<ul class="PASS_WORD">'+
									'<li style="border-left:1px solid #D8D8D8;border-radius: 4px 0 0 4px;"></li>'+
									'<li></li>'+
									'<li></li>'+
									'<li></li>'+
									'<li></li>'+
									'<li style="border-radius: 0 4px 4px 0;"></li>'+
								'</ul>'+
						        '</div>'+
								'</span>'+
								'</div>'+
								'<div class="smsClass ui-border-b y-sms  auth-input" data-authtype="SMS"'+ 
									'data-messageTransCode="${messageTransCode}" data-sendType="${sendType}" data-mobilePhone="${mobilePhone}"'+
									'data-accountNo="${accountNo}" data-url="${sms_url}" data-callback="phoneBack">'+
								'<span style="font-family: PingFangSC-Regular;font-size: 15px;color: #666666;letter-spacing: 0;width:10%;">验证码</span>'+
								'<input type="tel" id="SMS" class="smsInput" maxlength="6"  data-required="true" data-name="SMS" onkeyup="value=value.replace(/[^\\d]/g,\'\')"  data-label="验证码" placeholder="请输入验证码"/>'+
								'<input id="resend-btn" class="ui-btn ui-border-l x-sms-send" readonly  style="margin: auto;border: none;background: #fff;'+
									'font-family: PingFang-SC-Regular;font-size: 14px;color: #FFAB43;letter-spacing: 0; padding: 0; text-align: right;margin-top:11px;width:22%;" value="获取验证码">'+
							    '</div>'+							
								'<div class="cy-btn ">'+
									'<button class="" data-event="submit">确认</button>'+
								'</div>'+
								'</div>'+
							'</div>'+
						'</div>'+
					'</div>';
				var params = conf.params ? conf.params : {};
				var _at = conf.type;
//				me.qryAuthType(function(authList){
					YT.hideWaitPanel();
					authBoxLj = $(layer);
//					authBoxLjList = authList;
					var json = {};
					YT.apply(json,params);
					console.log(json)
					me.pass_word=null;//清理密码
//					json.GROUP_AUTH_TYPE_LIST = authList;
					authBoxLj.html(YT.template(html_tpl, json));
					authBoxLj.find('.y-sms').attr('data-tranCode',conf.tran_code);
					var authForm = authBoxLj.find(".yui-auth-form");
					me.animatedT = setTimeout(function(){
						authForm.removeClass("auth-animated");
						animated = true;
					},600);
					YT.initPageEvent(authBoxLj, me);
					YT.Form.initPanel(authBoxLj, me, {});
//					var authData = authList[0].AUTH_TYPE_LIST;
//					group_auth_type = authList[0].GROUP_AUTH_TYPE;
//					me.showAuthItem(authData);
					
					YT.passGuard5.generate("PASS_WORD", YT.kb, "YT.passGuard5", 3);
					
					
					//加载输入样式
					me.onloadSty();
					$('html,body').css('overflow','hidden');
					try{
						(/iphone|ipod|ipad/i.test(navigator.appVersion)) && authForm.find('input').on('blur', function(){
							YT.log.info('-----blur-----2');
//							document.body.scrollIntoView();
							var scrollTop = document.scrollingElement.scrollTop;
							document.scrollingElement.scrollTop = --scrollTop;
							YT.log.info('-----scrollIntoView-----2');
						})
					}catch(e){}
				});
//			});			
		},
		//初始化键盘
		initTransPass : function(callback){
			if(typeof(YT.kb) == "undefined"){
				YT.kb = new keyBoard( {
					"chaosMode" : 1, // 混乱模式,0:无混乱;1:打开时乱一次;2:每输入一个字符乱一次,默认值0
					"pressStatus" : 0, // 按键状态,0:按下、抬起按键无变化;1:按下、抬起按键的颜色变化,默认值0
					"kbType" : 3, // 键盘类型,0:全键盘;1:纯数字键盘,默认值0
					"svg" : "assets/img/svg",//svg图片的地址
					//"hasMap" : "0",//是否调用mapping值：当为1时调用，当为非1时，不调用
					"license" : "dzVOS2ZITHpFWS80SEgrOXFrU0VweTBWdkJLV0M4UEhmdlFEZ01vVkJBWDhaclBWSlhEQzdLSzRya2RCRWF2K1VqMUkxTEQxcytDTlhvbnZLTEl2amhVL0puV1VOZ2lJMllBL0JqSVZrTlNmdEhwQjRraUlXRGdPMWlmdjN6OFpkMlRnaWdDNXBJVkdLa1lPRGxRa2drblROZ2RsdWx1TG1jSXJqMFArUi84PXsiaWQiOjAsInR5cGUiOiJ0ZXN0IiwicGxhdGZvcm0iOjEwLCJub3RiZWZvcmUiOiIyMDIwMDcyOCIsIm5vdGFmdGVyIjoiMjAyMDEwMjgifQ=="
				});
			}
			
			if($("#testkbid")[0] == undefined){
//				YT.Show = 0;
				YT.kb.generate();
			}
//			if("PASS_WORD" == id){
				if(typeof(YT.passGuard5) == "undefined"){
				YT.passGuard5 = new passGuard(
					{
						"mappurl" : "",
						"jump": 1, //是否用添加删除回调：1代表使用，0代表不使用
						"add": me.tianjia, //输入框值添加回调,当jump为1时，才有回调
						"del": me.jianshao, //输入框值减少回调,当jump为1时，才有回调
						"maxLength" : 6, // 最大输入长度
						"regExp1" : "[\\S\\s]", // 输入过程限制的正则
						"regExp2" : "[0-9]{6,12}",
						"displayMode" : 0, // 显示形式,0:星号;1:明文,默认值0
						"callBack" : me.cb1, //成功回调
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
//					callFun({})
				}
				callback && callback();
				
//				YT.passGuard.setRandKey("12345678qqqq")
//			}
		},
		//加载键盘样式
		onloadSty : function(){
			//输入密码格子样式
			var liHeight = document.documentElement.clientWidth * 0.81 * 0.166;
			$(".PASS_WORD>li").css({
				height: liHeight +"px",
				lineHeight: liHeight +"px"
			});
			$("#PASS_WORD").css({
				height: liHeight +"px"
			});
			$(document).on("touchstart", function(e) {
				if(e.target.className.indexOf("closeAuth") > -1) {
					e.preventDefault();
					return;
					me.closeAuth();
//					clearpwd(); 
//					$(".cover").hide();
//					$(".cover-Div").hide();
				}
			})
		},
		cb1 : function(){
//			$(".cover").hide();
//			$(".cover-Div").hide();
//			$(".PASS_WORD li").html("");
			console.log("开始提交");
//			me.clearpwd();
			//formSubmit(); //输入成功跳转
		},
		
		cb2 : function(){
			console.log("失败3");
		},
		
		inputFocus1 : function(){
			console.log("passGuard1输入框获得焦点")
			$("#PASS_WORD").val("");
			YT.passGuard5.clearPWD();//对应键盘的密文清空 
			$(".PASS_WORD li").html("");//对应输入密码格子清空 
			$(".yui-auth-form").css("bottom","256px")
			me.pass_word="";
		},
		
		inputBlur1 : function(){
			console.log("passGuard1输入框失去焦点");
			$(".yui-auth-form").css("bottom","0")
		},
		tianjia : function(xh) { //xh为密码的长度
			console.log(xh)
			me.xh = xh;
            if(xh<=6){
        	  $(".PASS_WORD>li").eq(xh - 1).html($("<p class='yuan'></p>"));
			}			
			if(xh == 6) {
				//密文
				me.pass_word = YT.passGuard5.getOutputSMLZ();
				console.log(me.pass_word);
				$("#testkbid").hide();
				$(".yui-auth-form").css("bottom","0")
			}
			
		},
		jianshao : function(xh) {
			console.log(me.xh)
			me.xh = me.xh-1;
			$(".PASS_WORD>li").eq(me.xh).html("");
		},
		
		
		hideAuthPanel : function(timeout) {
			$('html,body').css('overflow','auto')
			console.log(this)
			this.removeDivId(this._authBoxLjId);
		},
		//获取认证信息
//		getAuthInfo : function(authInputs){
//			var authList = [];
//			authInputs.each(function(){
//				var item = $(this);
//				var type = item.attr('data-authtype');
//				var val; 
//				if(type == "CPWD"){
//					//val = YT.passGuard5.getOutputSMLZ();
//					val = me.pass_word;
//				}else{
//					val = item.find('input').val();
//				}
//				authList.push({
//					AUTH_TYPE : type,
//					AUTH_PWD : val
//				});
//			});
//			return authList;
//		},
		removeDivId : function(divId) {
			var handle = document.getElementById(divId);
			if (handle) {
				handle.parentNode.removeChild(handle);
			}
		},
		authLayer : function(e){
			if(!animated){
				return false;
			}
			var ele = $(e.target);
			if(ele.hasClass('yui-auth-layer')){
				if(me.closeT){
					clearTimeout(me.closeT);
				}
				if(me.animatedT){
					clearTimeout(me.animatedT);
				}
				me.closeAuth();
			}
		},
		/**
		 * 关闭认证页面
		 */
		closeAuth: function(){	
			authBoxLj.find(".yui-auth-form").addClass("close-animated");
			me.closeT = setTimeout(function(){
				me.hideAuthPanel();
				me.clearpwd();
			},600);
		},
		clearpwd : function(){
			$("#PASS_WORD").val("");
			YT.passGuard5.clearPWD();//对应键盘的密文清空 
			$(".PASS_WORD li").html("");//对应输入密码格子清空 
			phoneBackData=null;
		},
		
		//短信回调
		phoneBack: function(data){
			phoneBackData = data;
		},
		
		
		/**
		 * 提交
		 */
		submit: function(){

			if(YT.isEmpty(me.pass_word)){
				YT.alertinfo("请输入交易密码");
				return false;
			}

			
			if(!phoneBackData || YT.isEmpty(phoneBackData)){
				   YT.alertinfo("请先获取验证码")
					return false;
			}
			//短信验证码非空校验
			if($(".yui-auth-layer #SMS").val()==""|| YT.isEmpty($(".yui-auth-layer #SMS").val())){
				 YT.alertinfo("请输入验证码！")
					return false;
			}
			YT.openWaitPanel();
			
			var json = {
				GROUP_AUTH_TYPE : group_auth_type,
				//AUTH_LIST : list
				messageCode: $(".smsInput").val(),
				messageChallenge: phoneBackData.messageChallenge,		//挑战码
				transPassword: me.pass_word
			}
			var url = me._conf.url;
			var params = YT.apply(json,me._conf.params);
			YT.ajaxData(url,params,function(data){
				YT.hideWaitPanel();
				YT.passGuard5.clearPWD();//对应键盘的密文清空 
				if(data.STATUS =="1"){
					debugger;
					me.closeAuth();
					YT.kb.hide();
					//YT.passGuard5.clearpwd();
					
					if(me._conf.success){
						me.hideAuthPanel();
						me._conf.success(data);
					}else{
						me.hideAuthPanel();
					}
				}else{
					authBoxLj.find('input').val('');
					var sixPwd = authBoxLj.find('.sixDigitPassword')
					sixPwd.find('b').css("visibility","hidden");
					if(me._conf.error){
						me._conf.error(data);
					}else{
						YT.alertinfo(data.MSG);
					}
				}
			});
		}
	};
})();