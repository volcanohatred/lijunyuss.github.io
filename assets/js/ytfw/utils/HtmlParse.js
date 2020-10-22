//转化HTML至AST对象
(function() {
	var h = HModule.h;

	// from: https://coursesweb.net/javascript/convert-xml-json-javascript_s2
	function XMLtoJSON() {
		var me = this; // stores the object instantce
		// gets the content of an xml file and returns it in
		me.fromFile = function(url, rstr) {
			// Cretes a instantce of XMLHttpRequest object
			var xhttp = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
			// sets and sends the request for calling "xml"
			xhttp.open("GET", url, false);
			xhttp.send(null);

			// gets the JSON string
			return setJsonObj(xhttp.responseXML);
		}

		// returns XML DOM from string with xml content
		me.fromStr = function(xml, rstr) {
			// 去多余空格
			xml = xml.replace(/(\\t|\\r|\\n)/g, '');
			xml = xml.replace(/>(\\s|\\t|\\n)+</g, "><");
			xml = xml.replace(/^(\\s|\\t)?\\n/g, "");
			xml = deleteCodeComments(xml);
			// YT.log.info("xml", xml);
			// for non IE browsers
			if (window.DOMParser) {
				var getxml = new DOMParser();
				var xmlDoc = getxml.parseFromString(xml, "text/html");
				var json = setJsonObj(xmlDoc);
				return toJsonHtml(convertJsonTo(json));
			} else {
				// for Internet Explorer
				var xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
				xmlDoc.async = "false";
				var json = setJsonObj(xmlDoc);
				return toJsonHtml(convertJsonTo(json));
			}
			// gets the JSON string
		}
		// 去注释
		function deleteCodeComments(code) {
			// 将'://'全部替换为特殊字符，删除注释代码后再将其恢复回来
			var tmp1 = ':\/\/';
			var regTmp1 = /:\/\//g;
			var tmp2 = '@:@/@/@';
			var regTmp2 = /@:@\/@\/@/g;
			code = code.replace(regTmp1, tmp2);
			var reg = /(\/\/.*)?|(\/\*[\s\S]*?\*\/)|<!\-\-[^>]/g;
			code = code.replace(reg, '');
			result = code.replace(regTmp2, tmp1);
			return result;
		}

		function toJsonHtml(json) {
			var children = [];
			if (!json) {
				return null;
			}
			if (json.children) {
				for ( var i in json.children) {
					var item = toJsonHtml(json.children[i]);
					item && children.push(item);
				}
			}
			if (children.length > 0) {
				return h(json.sel, {
					props : json.props
				}, children, json.text);
			} else {
				return h(json.sel, {
					props : json.props
				}, json.text);
			}
		}
		function convertJsonTo(json) {
			var outJson = {};
			var id = "", clazz = "";
			if (!json) {
				return null;
			}
			if (json["text"]) {
				outJson["text"] = json["text"] || '';
				delete json["text"];
			}
			if (json["props"]) {
				var props = json["props"];
				if (props["id"]) {
					id = props["id"];
					id = id ? ("#" + id) : "";
					delete props["id"];
				}
				if (props["class"]) {
					clazz = props["class"];
					clazz = clazz ? ("." + clazz.split("\\s").join(".")) : "";
					delete props["class"];
				}
				outJson.props = props;
			}
			if (json["type"]) {
				var type = json["type"];
				if (type == "#document") {
					return convertJsonTo(childrenItem(json.children, "html"));
				} else if (type == "html") {
					return convertJsonTo(childrenItem(json.children, "body"));
				}
				if (type == "#comment") {
					return null;
				}
				outJson.sel = [ type, id, clazz ].join("");
				delete json["type"];
			}
			var children = [];
			for ( var i in json.children) {
				var item = convertJsonTo(json.children[i]);
				item && children.push(item);
			}
			if (children.length > 0) {
				outJson.children = children;
			}
			// console.info(YT.JsonToStr(outJson));
			return outJson;
		}

		function childrenItem(children, type) {
			for ( var i in children) {
				var item = children[i];
				if (item.type == type) {
					return item;
				}
			}
			return null;
		}

		var setJsonObj = function(xml) {
			var js_obj = {};
			js_obj["type"] = xml.nodeName.toLowerCase();
			if (xml.nodeType == 1) {
				if (xml.attributes.length > 0) {
					js_obj["props"] = {};
					for (var j = 0; j < xml.attributes.length; j++) {
						var attribute = xml.attributes.item(j);
						js_obj["props"][attribute.nodeName] = attribute.value;
					}
				}
			} else if (xml.nodeType == 3) {
				js_obj = xml.nodeValue;
			}
			if (xml.hasChildNodes()) {
				var children = [];
				var text = "";
				for (var i = 0; i < xml.childNodes.length; i++) {
					var item = xml.childNodes.item(i);
					var nodeName = item.nodeName;
					if (item.nodeType == 3) {
						text += item.nodeValue;
						continue;
					}
					var itemJson = setJsonObj(item);
					children.push(itemJson);
				}
				if (text && text.length > 0) {
					js_obj["text"] = text.replace(/(\\t|\\r|\\n)/g, '');
				}
				if (children.length > 0) {
					js_obj["children"] = children;
				}

			}
			return js_obj;
		}

		// converts JSON object to string (human readablle).
		// Removes '\t\r\n', rows with multiples '""', multiple empty rows, ' "",', and " ",; replace empty [] with ""
		var jsontoStr = function(js_obj) {
			var rejsn = JSON.stringify(js_obj, undefined, 2).replace(/(\\t|\\r|\\n)/g, '').replace(
					/"",[\n\t\r\s]+""[,]*/g, '').replace(/(\n[\t\s\r]*\n)/g, '').replace(/[\s\t]{2,}""[,]{0,1}/g, '')
					.replace(/"[\s\t]{1,}"[,]{0,1}/g, '').replace(/\[[\t\s]*\]/g, '""');
			return (rejsn.indexOf('"parsererror": {') == -1) ? rejsn : 'Invalid XML format';
		}
	}

	// creates object instantce of XMLtoJSON
	var xml2json = new XMLtoJSON();
	YT.xml2json = function(xml) {
		return xml2json.fromStr(xml);
	};
})();