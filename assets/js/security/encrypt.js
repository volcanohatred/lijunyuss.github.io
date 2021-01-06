define(function(require) {
	var aes = require('assets/js/security/lib/AES');
	var md5 = require('assets/js/security/lib/MD5');
	var rsa = require('assets/js/security/lib/RSA');
	var me = YT.Security = {
		/**
		 * aes加密
		 */
		aesEncrypt : function(data, aeskey) {
			// 十六位十六进制数作为秘钥
			var key = aes.enc.Utf8.parse(aeskey);
			// 十六位十六进制数作为秘钥偏移量
			// SHYTBASESHYTBASE
			// GZYH_WEBANK12345
			var iv = aes.enc.Utf8.parse("SHYTBASESHYTBASE");
			var srcs = aes.enc.Utf8.parse(data);
			var mode = aes.mode.CBC;
			var pad = aes.pad.Pkcs7
			var encrypted = aes.AES.encrypt(srcs, key, {
				iv : iv,
				mode : mode,
				padding : pad
			});
			var result = encrypted.ciphertext.toString(aes.enc.Base64);
			return result;
		},
		decrypt : function(data, aeskey) {
			var iv = aes.enc.Utf8.parse("SHYTBASESHYTBASE");
			var text = aes.AES.decrypt(data, aes.enc.Utf8.parse(aeskey), {
				iv : iv,
				mode : aes.mode.CBC,
				padding : aes.pad.Pkcs7
			});
			var result = aes.enc.Utf8.stringify(text);
			return JSON.parse(result);
		},
		/**
		 * md5加密
		 */
		md5Encrypt : function(data, aeskey) {
			return md5.md5(aeskey + data);
		},
		/**
		 * rsa加密
		 */
		rsaEncrypt : function(data) {
			var encrypt_rsa = new rsa.RSAKey();
			encrypt_rsa = rsa.KEYUTIL.getKey(me.getPublicKey());
			var encStr = encrypt_rsa.encrypt(data)
			encStr = rsa.hex2b64(encStr);
			return encStr;
		},
		/**
		 * 三段式加密
		 */
		encrypt : function(data, aeskey) {
			if (typeof data != 'string') {
				data = JSON.stringify(data);
			}
			var rsaText = me.rsaEncrypt(aeskey);
			var aesText = me.aesEncrypt(data, aeskey);
			var md5Text = me.md5Encrypt(data, aeskey);
			var result = [ md5Text, aesText, rsaText ].join(String
					.fromCharCode(29));
			return result;
		},
		getEncryptKey : function() {
			return me.uuid(16, 16);
		},
		uuid : function(len, radix) {
			var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
					.split('');
			var uuid = [], i;
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
		},
		getPublicKey : function() {
			// return '-----BEGIN PUBLIC
			// KEY-----'+wx.getStorageSync('PUBLIC_KEY')+'-----END
			// PUBLIC
			// KEY-----';
			return '-----BEGIN PUBLIC KEY-----MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqK9QX9hd/WSFjepZ5SeELI7DQNLPvXoibpqvl9wD0Vt4AsYX0+9kxpO7Ys0WQVf+Va3zaQzT9CiT3S8YwwCujNZXlh1Rka1Ut6YMzBqJWed2LFyoHPYSjHN8yD4y/L1ikJ40TqhAN4pq+izZYKi90B67xnRXh2kKgASyPphGQJK2pTaCD+u39ctivIeqaTRh1rTGIE4Z/CyYZDfD/L8QIgtZulYKmjIjqclVFEekDs4pONjsvTgYAih0NOxA4Uwv/DNGIxhvj7/hKbQnp7lptKTr7aZbH9uB+Na06tXOMFlj2ob+KcG79Up7yNXXX+j4cXx+eKzDglEVjooGkDdTQwIDAQAB-----END PUBLIC KEY-----';
		}
	}
});