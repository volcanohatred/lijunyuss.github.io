define(function (require) {
	var rsa = require('assets/js/security/sm/pnc-crypto-min');
	/**
	 * SM3摘要算法盐值 ares-security-cert.properties 中配置
	 */
	var sm3Salt = 'YTBASE';
	var me = YT.Security = {
		/**
		 * 三段式加密(国密)
		 * SM3+SM4+SM2
		 */
		encrypt: function (data, key) {
			if (typeof data != 'string') {
				data = JSON.stringify(data);
			}
//			console.log('key\n' + key);
			var m1 = M1(Code.str2bytes(data));
			var m2 = M2();
			var m = M3(m1, m2);
			var r4 = _Sm4.encode(Code.bytes2hexStr(m), Code.str2bytes(key))
			var sm4Encode = Code.bytes2hexStr(r4);
//			console.log('sm4\n' + sm4Encode);

			var sm2Encode = _Sm2.encode(key);
//			console.log('sm2\n' + sm2Encode);

			var r3 = _Sm3.hash(Code.str2bytes(data + key + sm3Salt));
			var sm3Encode = Code.bytes2hexStr(r3);
//			console.log('sm3\n' + sm3Encode);

			// SM3+SM4+SM2
			var result = "#10" + [sm3Encode, sm4Encode, sm2Encode].join(String.fromCharCode(29));
//			console.log(result);
			return result;
		},
		// SM4解密
		decrypt: function (data, key) {
			var encryptData = data.substr(14);
			var confuseStartPos = parseInt(data.substring(3, 5), 16);
			var confuseLen = parseInt(data.substring(5, 7), 16);
			var confuseRule = parseInt(data.substring(7, 8), 16);
			var originalLen = parseInt(data.substring(8, 14), 16);
			var confuseStr = encryptData.substring(confuseStartPos, confuseStartPos + confuseLen);
			var confuseStrLen = confuseStr.length;
			var confuseData = [];
			confuseData.push(encryptData.substring(0, confuseStartPos));
			switch (confuseRule) {
				case 1:
					confuseData.push(confuseStr.charAt(confuseStrLen - 1))
					confuseData.push(confuseStr.substring(1, confuseStrLen - 1));
					confuseData.push(confuseStr.charAt(0));
					break;
				case 2:
					for (var j = 2; j <= confuseStrLen; ++j) {
						if (j % 2 == 0) {
							confuseData.push(confuseStr.charAt(j - 1));
							confuseData.push(confuseStr.charAt(j - 2));
						}
					}
					if (confuseStrLen % 2 != 0 && confuseStrLen > 0) {
						confuseData.push(confuseStr.charAt(confuseStrLen - 1));
						break;
					}
					break;
			}
			if (confuseRule != 0) {
				confuseData.push(encryptData.substring(confuseStartPos + confuseLen));
				encryptData = confuseData.join('');
			}
			encryptData = encryptData.substring(0, originalLen);
//			console.log('encryptData\n' + encryptData);
//			console.log('key\n' + key);
			var result = _Sm4.crypt(Code.hexStr2bytes(encryptData), Code.str2bytes(key), 0);
			return byteToString(result);
		},
		getEncryptKey: function () {
			return me.uuid(32, 16);
		},
		uuid: function (len, radix) {
			var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
			var uuid = [],
				i;
			radix = radix || chars.length;
			if (len) {
				// Compact form
				for (i = 0; i < len; i++)
					uuid[i] = chars[0 | Math.random() * radix];
			} else {
				// rfc4122, version 4 form
				var r;
				// rfc4122 requires these characters
				uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
				uuid[14] = '4';
				// Fill in random data. At i==19 set the high bits of
				// clock
				// sequence
				// as
				// per rfc4122, sec. 4.1.5
				for (i = 0; i < 36; i++) {
					if (!uuid[i]) {
						r = 0 | Math.random() * 16;
						uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
					}
				}
			}
			return uuid.join('');
		}
	}

	function M1(datas) {
		var length = datas.length;
		var size = length % 16;
		size = 16 - size;
		var tmp = new Array();
		tmp[0] = 29;
		for (var i = 1; i < size; i++) {
			tmp[i] = Math.round(Math.random() * 150) % 150 + 30;
		}
		var l = size + length;
		var out = new Array();
		out = [].concat(datas);
		for (var i = 0; i < tmp.length; i++) {
			if (i < size) {
				out.push(tmp[i])
			}
		}
		return out;
	}

	function M3(m1, m2) {
		var lenM1 = m1.length;
		var lenM2 = m2.length;
		var out = new Array();
		var m3 = xor(m1, m2);
		for (var i = 0; i < m3.length; i++) {
			if (i < lenM1) {
				out.push(m3[i])
			}
		}
		for (var i = 0; i < m2.length; i++) {
			if (i < lenM2) {
				out.push(m2[i])
			}
		}
		return out;
	}

	function xor(m1, m2) {
		var lenM1 = m1.length;
		var m3 = new Array();
		var s1 = lenM1 / 16;
		for (var a = 0; a < s1; a++) {
			var index = a * 16;
			for (var i = 0; i < 16; i++) {
				m3[index + i] = (m1[index + i] ^ m2[i]);
			}
		}
		return m3;
	}

	function M2(datas) {
		var tmp = new Array();
		for (var i = 0; i < 16; i++) {
			tmp[i] = Math.round(Math.random() * 255) % 255;
		}
		return tmp;
	}

	function byteToString(arr) {
		if (typeof arr === 'string') {
			return arr;
		}
		var str = '',
			_arr = arr;
		for (var i = 0; i < _arr.length; i++) {
			var one = _arr[i].toString(2),
				v = one.match(/^1+?(?=0)/);
			if (v && one.length == 8) {
				var bytesLength = v[0].length;
				var store = _arr[i].toString(2).slice(7 - bytesLength);
				for (var st = 1; st < bytesLength; st++) {
					store += _arr[st + i].toString(2).slice(2);
				}
				str += String.fromCharCode(parseInt(store, 2));
				i += bytesLength - 1;
			} else {
				str += String.fromCharCode(_arr[i]);
			}
		}
		return str;
	}
});