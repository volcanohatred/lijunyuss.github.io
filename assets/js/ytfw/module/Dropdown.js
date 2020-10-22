//O2O专用
;(function() {
	var TAG = "YT.Dropdown";
	var tpl_menus = [
		'<ul>',
		'{@each LIST as item,index}',
		'<li class="ui-border-b" data-name="${item.CLASS_NAME}" data-index="${item.CLASS_CODE}">${item.CLASS_NAME}</li>',
		'{@/each}',
		'</ul>'
	].join('');
	var tpl_sub_menus = [
         '<ul>',
         '{@each LIST as item,index}',
         '<li class="ui-border-b">',
			'<p>${item.CLASS_NAME}</p>',
			'<label class="ui-radio-s">',
              '<input type="radio" name="dropdown-radio" value="${item.CLASS_CODE}">',
            '</label>',
		 '</li>',
		 '{@/each}',
         '</ul>',
	].join('');
	var tpl_dropdown_warp = [
	        '<div class="yui-dropdown-warp">',
		    	'<div class="yui-dropdown-menus"></div>',
		    	'<div class="yui-dropdown-sub-menus"></div>',
		    '</div>'
	    ].join('');
	var Dropdown = YT.Dropdown = {
		//显示下拉层
		openDropdown : function(conf){
			Dropdown.conf = conf;
			var ele = $('#yui-dropdown-warp');
			ele.html(tpl_dropdown_warp);
			var menus = $(ele).find('.yui-dropdown-menus');
			var sub_menus = $(ele).find('.yui-dropdown-sub-menus');
			var menus_html = YT.template(tpl_menus,{LIST:conf.menus});
			var sub_menus_html = YT.template(tpl_sub_menus,{LIST:conf.sub_menus});
			menus.html(menus_html);
			sub_menus.html(sub_menus_html);
			menus.find('li').eq(conf.showId).addClass('current');
			if(conf.showSubId != undefined){
				sub_menus.find('input').eq(conf.showSubId).attr("checked","checked");
			}
			initEvent(conf);
			ele.show();
			$('.yui-dropdown-shade').show();
		},
		//修改一级菜单
		changeMenu: function(data){
			var ele = $('#yui-dropdown-warp');
			var menus = $(ele).find('.yui-dropdown-menus');
			var menus_html = YT.template(tpl_menus,{LIST:data});
			menus.html(menus_html);
		},
		//修改二级菜单
		changeSubMenu: function(data){
			var ele = $('#yui-dropdown-warp');
			var sub_menus = $(ele).find('.yui-dropdown-sub-menus');
			var sub_menus_html = YT.template(tpl_sub_menus,{LIST:data});
			sub_menus.html(sub_menus_html);
		},
		//关闭下拉层
		hideDropdown: function(){
			hidePanel();
		}
	};
	function initEvent(conf){
		var ele = $('#yui-dropdown-warp');
		var menus = $(ele).find('.yui-dropdown-menus');
		var sub_menus = $(ele).find('.yui-dropdown-sub-menus');
		menus.on('click','li',function(){
			menus.find('li').removeClass('current');
			$(this).addClass('current');
			var index = $(this).attr('data-index');
			var name = $(this).attr('data-name');
			conf.menu_callback && conf.menu_callback(index,name);
		})
		sub_menus.on('click','li input[type=radio]',function(){
			var index = $(this).val();
			conf.sub_menus_callback && conf.sub_menus_callback(index);
		});
		$('.yui-dropdown-shade').click(function(){
			$(this).hide();
			hidePanel();
		})
	}
	function hidePanel(){
		var ele = $('#yui-dropdown-warp').html("").hide();
	}
	
})();