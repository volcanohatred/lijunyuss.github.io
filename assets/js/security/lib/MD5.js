define(function (require, exports, module) {
  function digest(string) {
    var x = Array();
    var k, AA, BB, CC, DD, a, b, c, d;
    var S11 = 7, S12 = 12, S13 = 17, S14 = 22;
    var S21 = 5, S22 = 9, S23 = 14, S24 = 20;
    var S31 = 4, S32 = 11, S33 = 16, S34 = 23;
    var S41 = 6, S42 = 10, S43 = 15, S44 = 21;
    string = utf8Encode(string);
    x = toArray(string);
    a = 0x67452301;
    b = 0xEFCDAB89;
    c = 0x98BADCFE;
    d = 0x10325476;
    for (k = 0; k < x.length; k += 16) {
      AA = a;
      BB = b;
      CC = c;
      DD = d;
      a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
      d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
      c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
      b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
      a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
      d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
      c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
      b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
      a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
      d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
      c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
      b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
      a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
      d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
      c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
      b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
      a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
      d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
      c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
      b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
      a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
      d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
      c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
      b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
      a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
      d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
      c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
      b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
      a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
      d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
      c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
      b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
      a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
      d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
      c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
      b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
      a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
      d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
      c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
      b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
      a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
      d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
      c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
      b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
      a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
      d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
      c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
      b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
      a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
      d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
      c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
      b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
      a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
      d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
      c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
      b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
      a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
      d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
      c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
      b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
      a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
      d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
      c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
      b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
      a = safe_add(a, AA);
      b = safe_add(b, BB);
      c = safe_add(c, CC);
      d = safe_add(d, DD);
    }
    return word2hex(a) + word2hex(b) + word2hex(c) + word2hex(d);
  }
  /*  
   * Bitwise rotate a 32-bit number to the left.  
   */
  function rol(num, cnt) {
    return (num << cnt) | (num >>> (32 - cnt));
  }

  /*  
   * Add integers, wrapping at 2^32. This uses 16-bit operations internally  
   * to work around bugs in some JS interpreters.  
   */
  function safe_add(x, y) {
    var x4, y4, x8, y8, result;
    x8 = (x & 0x80000000);
    y8 = (y & 0x80000000);
    x4 = (x & 0x40000000);
    y4 = (y & 0x40000000);
    result = (x & 0x3FFFFFFF) + (y & 0x3FFFFFFF);
    if (x4 & y4) {
      return (result ^ 0x80000000 ^ x8 ^ y8);
    }
    if (x4 | y4) {
      if (result & 0x40000000) {
        return (result ^ 0xC0000000 ^ x8 ^ y8);
      } else {
        return (result ^ 0x40000000 ^ x8 ^ y8);
      }
    } else {
      return (result ^ x8 ^ y8);
    }
  }

  function F(x, y, z) {
    return (x & y) | ((~x) & z);
  }
  function G(x, y, z) {
    return (x & z) | (y & (~z));
  }
  function H(x, y, z) {
    return (x ^ y ^ z);
  }
  function I(x, y, z) {
    return (y ^ (x | (~z)));
  }

  function FF(a, b, c, d, x, s, ac) {
    a = safe_add(a, safe_add(safe_add(F(b, c, d), x), ac));
    return safe_add(rol(a, s), b);
  }
  function GG(a, b, c, d, x, s, ac) {
    a = safe_add(a, safe_add(safe_add(G(b, c, d), x), ac));
    return safe_add(rol(a, s), b);
  }
  function HH(a, b, c, d, x, s, ac) {
    a = safe_add(a, safe_add(safe_add(H(b, c, d), x), ac));
    return safe_add(rol(a, s), b);
  }
  function II(a, b, c, d, x, s, ac) {
    a = safe_add(a, safe_add(safe_add(I(b, c, d), x), ac));
    return safe_add(rol(a, s), b);
  }

  function toArray(string) {
    var cnt;
    var len = string.length;
    var t1 = len + 8;
    var t2 = (t1 - (t1 % 64)) / 64;
    var tt = (t2 + 1) * 16;
    var result = Array(tt - 1);
    var pos = 0;
    var count = 0;
    while (count < len) {
      cnt = (count - (count % 4)) / 4;
      pos = (count % 4) * 8;
      result[cnt] = (result[cnt] | (string.charCodeAt(count) << pos));
      count++;
    }
    cnt = (count - (count % 4)) / 4;
    pos = (count % 4) * 8;
    result[cnt] = result[cnt] | (0x80 << pos);
    result[tt - 2] = len << 3;
    result[tt - 1] = len >>> 29;
    return result;
  }

  function word2hex(value) {
    var result = "", temp = "", byte, cnt;
    for (cnt = 0; cnt <= 3; cnt++) {
      byte = (value >>> (cnt * 8)) & 255;
      temp = "0" + byte.toString(16);
      result = result + temp.substr(temp.length - 2, 2);
    }
    return result;
  }

  function utf8Encode(value) {
    var result = "";
    for (var n = 0; n < value.length; n++) {
      var c = value.charCodeAt(n);
      if (c < 128) {
        result += String.fromCharCode(c);
      } else if ((c > 127) && (c < 2048)) {
        result += String.fromCharCode((c >> 6) | 192);
        result += String.fromCharCode((c & 63) | 128);
      } else {
        result += String.fromCharCode((c >> 12) | 224);
        result += String.fromCharCode(((c >> 6) & 63) | 128);
        result += String.fromCharCode((c & 63) | 128);
      }
    }
    return result;
  }

  module.exports = {
    md5: digest
  }
});
