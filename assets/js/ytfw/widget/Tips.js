$(function() {
	var TAG = "YT.Tips";
	YT.log.debug("--init--", TAG);
	var tpl = 
		'<div class="ui-poptips ui-poptips-${type}">'+
			'<div class="ui-poptips-cnt">'+
			'<i></i>${content}'+
			'</div>'+
		'</div>';
	var defaults={
		content:'',
		stayTime:1000,
		type:'info',
		callback:function(){}
	}
	var me = YT.Tips = {
		showTips : function(option){
			option = YT.apply(defaults,option);
			var html = YT.template(tpl,option);
			var self = $(html);
			self.appendTo("body");
			var elementHeight = self.height();
			self.css({
				"-webkit-transform":"translateY(-"+elementHeight+"px)"
			});
			setTimeout(function(){
				self.css({
					"-webkit-transition":"all .5s",
					"-webkit-transform":"translateY(0)"
				});
			},20);
			if(option.stayTime>0){
				setTimeout(function(){
					self.css({
						"-webkit-transform":"translateY(-"+elementHeight+"px)"
					});
					setTimeout(function(){
						self.remove();
					},500)
				},option.stayTime);
			}
		}
	};
	YT.log.debug("--end--", TAG);
});