Array.prototype.unique = function () {//去数组重复
    return this.sort().join(",,").replace(/(,|^)([^,]+)(,,\2)+(,|$)/g, "$1$2$4").replace(/,,+/g, ",").replace(/,$/, "").split(",");
}
YT.Iput = {
    confg: {
        hand: "0", //0对像位置1鼠标位置divID滚动位置
        idIframe: "PoPx", //默认可不用改
        idBox: "PoPy", //默认可不用改
        content: "", //传过来的内容
        ok: null, //弹出框之后执行的函数
        id: null, //不能为空一般传this对像而不是对像ID
        event: window.event, //这个必写一般为e就可以了
        top: 0, //顶部偏移位置
        left: 0, //左部偏移位置
        bodyHeight: 0, //在被position:absolute元素下得到HTML真实高度
        bodyWidth: 0,
        width: 0,
        soll: null,
        pop: null //指定ID点击时不关闭
    },
    get: function (obj) { return document.getElementById(obj); },
    clear: function () {
        YT.Iput.confg.hand = "0"; YT.Iput.confg.ok = null; YT.Iput.confg.top = 0; YT.Iput.confg.left = 0; YT.Iput.confg.bodyHeight = 0; YT.Iput.confg.bodyWidth = 0; YT.Iput.confg.width = 0; YT.Iput.confg.pop = null;
    },
    stopBubble: function (e) {
        if (e && e.stopPropagation) {
            e.stopPropagation();    //w3c
        } else {
            window.event.cancelBubble = true; //IE
        }
    },
    pop: function () {
//        var $a = document.getElementsByTagName("body").item(0);
    	
//        var $c = document.createElement("iframe");
//        var $b = document.createElement("div");
    	var $a = $("body");
        var $c = $('<div class="ui-popup-overlay"><iframe id="PoPx" src="about:blank" frameborder="0" style="width: 100%; height: 0px; position: absolute; top: 0px; left: 0px;"></iframe></div>')
        var $b = $('<div id="PoPy" align="left" style="position: absolute; background: transparent; z-index: 20000; left: 0px; bottom: 0px;"></div>')
        
        
       /* $c.setAttribute('id', YT.Iput.confg.idIframe);
        $c.setAttribute("src", "about:blank");
        $c.style.zindex = '100';
        $c.frameBorder = "0";
        $c.style.width = "0px";
        $c.style.height = "0px";
        $c.style.position = 'absolute';
        $b.setAttribute('id', YT.Iput.confg.idBox);
        $b.setAttribute('align', 'left');
        $b.style.position = 'absolute';
        $b.style.background = 'transparent';
        $b.style.zIndex = '20000';*/
        if ($a) {
            if (YT.Iput.get(YT.Iput.confg.idIframe)) {
                YT.Iput.colse();
            }
            $("body").append($c);
            if ($c) {
            	$c.after($b);
            }
            YT.Iput.get(YT.Iput.confg.idBox).innerHTML = YT.Iput.confg.content;
            YT.Iput.drice(YT.Iput.confg.event);
        }

        /*if (!document.all) {
            window.document.addEventListener("click", YT.Iput.hide, false);
        }else {
            window.document.attachEvent("onclick", YT.Iput.hide);
        }*/
    },
    drice: function (e) {
        if (!e) e = window.event;
        var a = YT.Iput.get(YT.Iput.confg.idBox);
        var b = YT.Iput.get(YT.Iput.confg.idIframe);
        var c = "45%";
        var w = "100%";
        if (YT.Iput.get(YT.Iput.confg.idIframe)) {
            if (YT.Iput.confg.hand == "1") {
                b.style.top = 0 + "px";
                a.style.left = 0 + "px";
                a.style.bottom = 0 + "px";
                b.style.left = 0 + "px";
            }else if (YT.Iput.confg.hand == "0") {
                w = "100%";
                a.style.width = w;
                b.style.width = w;
                a.style.height = c;
                b.style.top = 0 + "px";
                b.style.left = 0 + "px";
                a.style.left = 0 + "px";
                a.style.bottom = 0 + "px";
            }else {
                a.style.height = c;
                b.style.top = 0 + "px";
                b.style.left = 0 + "px";
                a.style.left = 0 + "px";
                a.style.bottom = 0 + "px";
            }
        }
    },
    show: function () {
        var config = arguments[0]; 
        var that = YT.Iput.confg;
        YT.Iput.clear();
        for (var i in that) {
        	if (config[i] != undefined) {
        		that[i] = config[i]; 
        	} 
        };
        YT.Iput.pop();
        if (YT.Iput.confg.ok != null) {
            YT.Iput.action(YT.Iput.confg.ok());
        }
        $("body").css({
			overflow : "hidden"
		}); // 禁用滚动条
    },
    colse: function () {
    	$("body").css({
			overflow : "auto"
		});//恢复滚动条
        if (YT.Iput.get(YT.Iput.confg.idIframe)) {
        	$(".ui-popup-overlay").remove();
        	$("#PoPx").remove();
        	$("#PoPy").remove();
        }
        if (YT.Iput.get(YT.Iput.confg.pop)) {
            YT.Iput.get(YT.Iput.confg.pop).style.display = "none";
        }
    },
    hide: function (e) {//点击任何处关闭层
        e = window.event || e;
        var srcElement = e.srcElement || e.target;
        if (YT.Iput.confg.event == undefined) {//输入时用,般在没传入Iput.confg.event请况下使用
            YT.Iput.colse();
        }
        else {
            var a = YT.Iput.confg.event.srcElement || YT.Iput.confg.event.target;
            var b = YT.Iput.get(YT.Iput.confg.pop);
            console.log(a);
            console.log(srcElement);
            if (a != srcElement) { YT.Iput.colse(); }
            if (b != null) {
                if (b != srcElement && a != srcElement) { YT.Iput.colse(); }
            }
        }
        if (YT.Iput.get(YT.Iput.confg.idIframe)) {
            YT.Iput.get(YT.Iput.confg.idIframe).onclick = function (e) { YT.Iput.stopBubble(e); };
            YT.Iput.get(YT.Iput.confg.idBox).onclick = function (e) { YT.Iput.stopBubble(e); };
        }
        if (YT.Iput.get(YT.Iput.confg.pop)) {
            YT.Iput.get(YT.Iput.confg.pop).onclick = function (e) { YT.Iput.stopBubble(e); };
        }

    },
    action: function (obj) {
        eval(obj);
    },
    contains: function (star, end, isIgnoreCase) {
        if (isIgnoreCase) {
            star = star.toLowerCase();
            end = end.toLowerCase();
        }
        var startChar = end.substring(0, 1);
        var strLen = end.length;
        for (var j = 0; j < star.length - strLen + 1; j++) {
            if (star.charAt(j) == startChar)//如果匹配起始字符,开始查找
            {
                if (star.substring(j, j + strLen) == end)//如果从j开始的字符与str匹配，那ok
                {
                    return true;
                }
            }
        }
        return false;
    }
}