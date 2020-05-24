/*! https://mths.be/utf8js v2.1.2 by @mathias */
//;(function(root) {
// Detect free variables `exports`
var freeExports = typeof exports == 'object' && exports;

// Detect free variable `module`
var freeModule = typeof module == 'object' && module && module.exports == freeExports && module;

// Detect free variable `global`, from Node.js or Browserified code,
// and use it as `root`
var freeGlobal = typeof global == 'object' && global;
//if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) {
//	root = freeGlobal;
//}

/*--------------------------------------------------------------------------*/

var stringFromCharCode = String.fromCharCode;

// Taken from https://mths.be/punycode
function ucs2decode(string) {
    var output = [];
    var counter = 0;
    var length = string.length;
    var value;
    var extra;
    while (counter < length) {
        value = string.charCodeAt(counter++);
        if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
            // high surrogate, and there is a next character
            extra = string.charCodeAt(counter++);
            if ((extra & 0xFC00) == 0xDC00) {
                // low surrogate
                output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
            } else {
                // unmatched surrogate; only append this code unit, in case the next
                // code unit is the high surrogate of a surrogate pair
                output.push(value);
                counter--;
            }
        } else {
            output.push(value);
        }
    }
    return output;
}

// Taken from https://mths.be/punycode
function ucs2encode(array) {
    var length = array.length;
    var index = -1;
    var value;
    var output = '';
    while (++index < length) {
        value = array[index];
        if (value > 0xFFFF) {
            value -= 0x10000;
            output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
            value = 0xDC00 | value & 0x3FF;
        }
        output += stringFromCharCode(value);
    }
    return output;
}

function checkScalarValue(codePoint) {
    if (codePoint >= 0xD800 && codePoint <= 0xDFFF) {
        throw Error('Lone surrogate U+' + codePoint.toString(16).toUpperCase() + ' is not a scalar value');
    }
}

/*--------------------------------------------------------------------------*/

function createByte(codePoint, shift) {
    return stringFromCharCode(((codePoint >> shift) & 0x3F) | 0x80);
}

function encodeCodePoint(codePoint) {
    if ((codePoint & 0xFFFFFF80) == 0) {
        // 1-byte sequence
        return stringFromCharCode(codePoint);
    }
    var symbol = '';
    if ((codePoint & 0xFFFFF800) == 0) {
        // 2-byte sequence
        symbol = stringFromCharCode(((codePoint >> 6) & 0x1F) | 0xC0);
    } else if ((codePoint & 0xFFFF0000) == 0) {
        // 3-byte sequence
        checkScalarValue(codePoint);
        symbol = stringFromCharCode(((codePoint >> 12) & 0x0F) | 0xE0);
        symbol += createByte(codePoint, 6);
    } else if ((codePoint & 0xFFE00000) == 0) {
        // 4-byte sequence
        symbol = stringFromCharCode(((codePoint >> 18) & 0x07) | 0xF0);
        symbol += createByte(codePoint, 12);
        symbol += createByte(codePoint, 6);
    }
    symbol += stringFromCharCode((codePoint & 0x3F) | 0x80);
    return symbol;
}

function utf8encode(string) {
    var codePoints = ucs2decode(string);
    var length = codePoints.length;
    var index = -1;
    var codePoint;
    var byteString = '';
    while (++index < length) {
        codePoint = codePoints[index];
        byteString += encodeCodePoint(codePoint);
    }
    return byteString;
}

/*--------------------------------------------------------------------------*/

function readContinuationByte() {
    if (byteIndex >= byteCount) {
        throw Error('Invalid byte index');
    }

    var continuationByte = byteArray[byteIndex] & 0xFF;
    byteIndex++;

    if ((continuationByte & 0xC0) == 0x80) {
        return continuationByte & 0x3F;
    }

    // If we end up here, it’s not a continuation byte
    throw Error('Invalid continuation byte');
}

function decodeSymbol() {
    var byte1;
    var byte2;
    var byte3;
    var byte4;
    var codePoint;

    if (byteIndex > byteCount) {
        throw Error('Invalid byte index');
    }

    if (byteIndex == byteCount) {
        return false;
    }

    // Read first byte
    byte1 = byteArray[byteIndex] & 0xFF;
    byteIndex++;

    // 1-byte sequence (no continuation bytes)
    if ((byte1 & 0x80) == 0) {
        return byte1;
    }

    // 2-byte sequence
    if ((byte1 & 0xE0) == 0xC0) {
        byte2 = readContinuationByte();
        codePoint = ((byte1 & 0x1F) << 6) | byte2;
        if (codePoint >= 0x80) {
            return codePoint;
        } else {
            throw Error('Invalid continuation byte');
        }
    }

    // 3-byte sequence (may include unpaired surrogates)
    if ((byte1 & 0xF0) == 0xE0) {
        byte2 = readContinuationByte();
        byte3 = readContinuationByte();
        codePoint = ((byte1 & 0x0F) << 12) | (byte2 << 6) | byte3;
        if (codePoint >= 0x0800) {
            checkScalarValue(codePoint);
            return codePoint;
        } else {
            throw Error('Invalid continuation byte');
        }
    }

    // 4-byte sequence
    if ((byte1 & 0xF8) == 0xF0) {
        byte2 = readContinuationByte();
        byte3 = readContinuationByte();
        byte4 = readContinuationByte();
        codePoint = ((byte1 & 0x07) << 0x12) | (byte2 << 0x0C) | (byte3 << 0x06) | byte4;
        if (codePoint >= 0x010000 && codePoint <= 0x10FFFF) {
            return codePoint;
        }
    }

    throw Error('Invalid UTF-8 detected');
}

var byteArray;
var byteCount;
var byteIndex;

function utf8decode(byteString) {
    byteArray = ucs2decode(byteString);
    byteCount = byteArray.length;
    byteIndex = 0;
    var codePoints = [];
    var tmp;
    while ((tmp = decodeSymbol()) !== false) {
        codePoints.push(tmp);
    }
    return ucs2encode(codePoints);
}

/*--------------------------------------------------------------------------*/

//var utf8 = {
//	'version': '2.1.2',
//	'encode': utf8encode,
//	'decode': utf8decode
//};

// Some AMD build optimizers, like r.js, check for specific condition patterns
// like the following:
//if (
//	typeof define == 'function' &&
//	typeof define.amd == 'object' &&
//	define.amd
//) {
//	define(function () {
//		return utf8;
//	});
//} else if (freeExports && !freeExports.nodeType) {
//	if (freeModule) { // in Node.js or RingoJS v0.8.0+
//		freeModule.exports = utf8;
//	} else { // in Narwhal or RingoJS v0.7.0-
//		var object = {};
//		var hasOwnProperty = object.hasOwnProperty;
//		for (var key in utf8) {
//			hasOwnProperty.call(utf8, key) && (freeExports[key] = utf8[key]);
//		}
//	}
//} else { // in Rhino or a web browser
//	root.utf8 = utf8;
//}
//}
//}(this));
//export {
//  utf8encode
//}

// WEBPACK FOOTER //
// ./src/config/utf8.js

//
/*  
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message  
 * Digest Algorithm, as defined in RFC 1321.  
 * Version 1.1 Copyright (C) Paul Johnston 1999 - 2002.  
 * Code also contributed by Greg Holt  
 * See http://pajhome.org.uk/site/legal.html for details.  
 */

/*  
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally  
 * to work around bugs in some JS interpreters.  
 */
function safe_add(x, y) {
    var lsw = (x & 0xFFFF) + (y & 0xFFFF)
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16)
    return (msw << 16) | (lsw & 0xFFFF)
}

/*  
 * Bitwise rotate a 32-bit number to the left.  
 */
function rol(num, cnt) {
    return (num << cnt) | (num >>> (32 - cnt))
}

/*  
 * These functions implement the four basic operations the algorithm uses.  
 */
function cmn(q, a, b, x, s, t) {
    return safe_add(rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b)
}

function ff(a, b, c, d, x, s, t) {
    return cmn((b & c) | ((~b) & d), a, b, x, s, t)
}

function gg(a, b, c, d, x, s, t) {
    return cmn((b & d) | (c & (~d)), a, b, x, s, t)
}

function hh(a, b, c, d, x, s, t) {
    return cmn(b ^ c ^ d, a, b, x, s, t)
}

function ii(a, b, c, d, x, s, t) {
    return cmn(c ^ (b | (~d)), a, b, x, s, t)
}

/*  
 * Calculate the MD5 of an array of little-endian words, producing an array  
 * of little-endian words.  
 */
function coreMD5(x) {
    var a = 1732584193
    var b = -271733879
    var c = -1732584194
    var d = 271733878

    for (var i = 0; i < x.length; i += 16) {
        var olda = a
        var oldb = b
        var oldc = c
        var oldd = d

        a = ff(a, b, c, d, x[i + 0], 7, -680876936)
        d = ff(d, a, b, c, x[i + 1], 12, -389564586)
        c = ff(c, d, a, b, x[i + 2], 17, 606105819)
        b = ff(b, c, d, a, x[i + 3], 22, -1044525330)
        a = ff(a, b, c, d, x[i + 4], 7, -176418897)
        d = ff(d, a, b, c, x[i + 5], 12, 1200080426)
        c = ff(c, d, a, b, x[i + 6], 17, -1473231341)
        b = ff(b, c, d, a, x[i + 7], 22, -45705983)
        a = ff(a, b, c, d, x[i + 8], 7, 1770035416)
        d = ff(d, a, b, c, x[i + 9], 12, -1958414417)
        c = ff(c, d, a, b, x[i + 10], 17, -42063)
        b = ff(b, c, d, a, x[i + 11], 22, -1990404162)
        a = ff(a, b, c, d, x[i + 12], 7, 1804603682)
        d = ff(d, a, b, c, x[i + 13], 12, -40341101)
        c = ff(c, d, a, b, x[i + 14], 17, -1502002290)
        b = ff(b, c, d, a, x[i + 15], 22, 1236535329)

        a = gg(a, b, c, d, x[i + 1], 5, -165796510)
        d = gg(d, a, b, c, x[i + 6], 9, -1069501632)
        c = gg(c, d, a, b, x[i + 11], 14, 643717713)
        b = gg(b, c, d, a, x[i + 0], 20, -373897302)
        a = gg(a, b, c, d, x[i + 5], 5, -701558691)
        d = gg(d, a, b, c, x[i + 10], 9, 38016083)
        c = gg(c, d, a, b, x[i + 15], 14, -660478335)
        b = gg(b, c, d, a, x[i + 4], 20, -405537848)
        a = gg(a, b, c, d, x[i + 9], 5, 568446438)
        d = gg(d, a, b, c, x[i + 14], 9, -1019803690)
        c = gg(c, d, a, b, x[i + 3], 14, -187363961)
        b = gg(b, c, d, a, x[i + 8], 20, 1163531501)
        a = gg(a, b, c, d, x[i + 13], 5, -1444681467)
        d = gg(d, a, b, c, x[i + 2], 9, -51403784)
        c = gg(c, d, a, b, x[i + 7], 14, 1735328473)
        b = gg(b, c, d, a, x[i + 12], 20, -1926607734)

        a = hh(a, b, c, d, x[i + 5], 4, -378558)
        d = hh(d, a, b, c, x[i + 8], 11, -2022574463)
        c = hh(c, d, a, b, x[i + 11], 16, 1839030562)
        b = hh(b, c, d, a, x[i + 14], 23, -35309556)
        a = hh(a, b, c, d, x[i + 1], 4, -1530992060)
        d = hh(d, a, b, c, x[i + 4], 11, 1272893353)
        c = hh(c, d, a, b, x[i + 7], 16, -155497632)
        b = hh(b, c, d, a, x[i + 10], 23, -1094730640)
        a = hh(a, b, c, d, x[i + 13], 4, 681279174)
        d = hh(d, a, b, c, x[i + 0], 11, -358537222)
        c = hh(c, d, a, b, x[i + 3], 16, -722521979)
        b = hh(b, c, d, a, x[i + 6], 23, 76029189)
        a = hh(a, b, c, d, x[i + 9], 4, -640364487)
        d = hh(d, a, b, c, x[i + 12], 11, -421815835)
        c = hh(c, d, a, b, x[i + 15], 16, 530742520)
        b = hh(b, c, d, a, x[i + 2], 23, -995338651)

        a = ii(a, b, c, d, x[i + 0], 6, -198630844)
        d = ii(d, a, b, c, x[i + 7], 10, 1126891415)
        c = ii(c, d, a, b, x[i + 14], 15, -1416354905)
        b = ii(b, c, d, a, x[i + 5], 21, -57434055)
        a = ii(a, b, c, d, x[i + 12], 6, 1700485571)
        d = ii(d, a, b, c, x[i + 3], 10, -1894986606)
        c = ii(c, d, a, b, x[i + 10], 15, -1051523)
        b = ii(b, c, d, a, x[i + 1], 21, -2054922799)
        a = ii(a, b, c, d, x[i + 8], 6, 1873313359)
        d = ii(d, a, b, c, x[i + 15], 10, -30611744)
        c = ii(c, d, a, b, x[i + 6], 15, -1560198380)
        b = ii(b, c, d, a, x[i + 13], 21, 1309151649)
        a = ii(a, b, c, d, x[i + 4], 6, -145523070)
        d = ii(d, a, b, c, x[i + 11], 10, -1120210379)
        c = ii(c, d, a, b, x[i + 2], 15, 718787259)
        b = ii(b, c, d, a, x[i + 9], 21, -343485551)

        a = safe_add(a, olda)
        b = safe_add(b, oldb)
        c = safe_add(c, oldc)
        d = safe_add(d, oldd)
    }
    return [a, b, c, d]
}

/*  
 * Convert an array of little-endian words to a hex string.  
 */
function binl2hex(binarray) {
    var hex_tab = "0123456789abcdef"
    var str = ""
    for (var i = 0; i < binarray.length * 4; i++) {
        str += hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8 + 4)) & 0xF) + hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8)) & 0xF)
    }
    return str
}

/*  
 * Convert an array of little-endian words to a base64 encoded string.  
 */
function binl2b64(binarray) {
    var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
    var str = ""
    for (var i = 0; i < binarray.length * 32; i += 6) {
        str += tab.charAt(((binarray[i >> 5] << (i % 32)) & 0x3F) | ((binarray[i >> 5 + 1] >> (32 - i % 32)) & 0x3F))
    }
    return str
}

/*  
 * Convert an 8-bit character string to a sequence of 16-word blocks, stored  
 * as an array, and append appropriate padding for MD4/5 calculation.  
 * If any of the characters are >255, the high byte is silently ignored.  
 */
function str2binl(str) {
    var nblk = ((str.length + 8) >> 6) + 1
    // number of 16-word blocks    
    var blks = new Array(nblk * 16)
    for (var i = 0; i < nblk * 16; i++)
    blks[i] = 0
    for (var i = 0; i < str.length; i++)
    blks[i >> 2] |= (str.charCodeAt(i) & 0xFF) << ((i % 4) * 8)
    blks[i >> 2] |= 0x80 << ((i % 4) * 8)
    blks[nblk * 16 - 2] = str.length * 8
    return blks
}

/*  
 * Convert a wide-character string to a sequence of 16-word blocks, stored as  
 * an array, and append appropriate padding for MD4/5 calculation.  
 */
function strw2binl(str) {
    var nblk = ((str.length + 4) >> 5) + 1
    // number of 16-word blocks    
    var blks = new Array(nblk * 16)
    for (var i = 0; i < nblk * 16; i++)
    blks[i] = 0
    for (var i = 0; i < str.length; i++)
    blks[i >> 1] |= str.charCodeAt(i) << ((i % 2) * 16)
    blks[i >> 1] |= 0x80 << ((i % 2) * 16)
    blks[nblk * 16 - 2] = str.length * 16
    return blks
}

/*  
 * External interface  
 */
function hexMD5(str) {
    return binl2hex(coreMD5(str2binl(str)))
}

function hexMD5w(str) {
    return binl2hex(coreMD5(strw2binl(str)))
}

function b64MD5(str) {
    return binl2b64(coreMD5(str2binl(str)))
}

function b64MD5w(str) {
    return binl2b64(coreMD5(strw2binl(str)))
}
/* Backward compatibility */
function calcMD5(str) {
    return binl2hex(coreMD5(str2binl(str)))
}
//export {hexMD5};

// WEBPACK FOOTER //
// ./src/config/md5.js

//
var getSign = function() {
    //把参数的键值取出来
    var timestemp = Date.parse(new Date()) / 1000;
    var sPara = {
        data: '{"mobile_phone":"17822222222","password":"22222222","phone_captcha":"2222"}',
        device: "WechatMall/1.0/2.2.1",
        timestemp: timestemp,
        token: ""
    };

    //键值升序排�?
    keys = ["data", "device", "timestemp", "token"];
    var split = '';
    var signString = '';
    for (var i = 0; i < keys.length; i++) {
        signString += split + keys[i] + '=' + (typeof sPara[keys[i]] === 'object' ? JSON.stringify(sPara[keys[i]]) : sPara[keys[i]]);
        split = '&';
    }
    signString = signString + 'FD92DF750B32765DA01A119BE1601D46';
    return hexMD5(utf8encode(signString));
    //return signString;
}


// 百草枯 https://m.vipbcw.com/register/index