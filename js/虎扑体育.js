var MD5 = function(string) {
    function RotateLeft(lValue, iShiftBits) {
        return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits))
    }

    function AddUnsigned(lX, lY) {
        var lX4, lY4, lX8, lY8, lResult;
        lX8 = (lX & 2147483648);
        lY8 = (lY & 2147483648);
        lX4 = (lX & 1073741824);
        lY4 = (lY & 1073741824);
        lResult = (lX & 1073741823) + (lY & 1073741823);
        if (lX4 & lY4) {
            return (lResult ^ 2147483648 ^ lX8 ^ lY8)
        }
        if (lX4 | lY4) {
            if (lResult & 1073741824) {
                return (lResult ^ 3221225472 ^ lX8 ^ lY8)
            } else {
                return (lResult ^ 1073741824 ^ lX8 ^ lY8)
            }
        } else {
            return (lResult ^ lX8 ^ lY8)
        }
    }

    function F(x, y, z) {
        return (x & y) | ((~x) & z)
    }

    function G(x, y, z) {
        return (x & z) | (y & (~z))
    }

    function H(x, y, z) {
        return (x ^ y ^ z)
    }

    function I(x, y, z) {
        return (y ^ (x | (~z)))
    }

    function FF(a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b)
    }

    function GG(a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b)
    }

    function HH(a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b)
    }

    function II(a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b)
    }

    function ConvertToWordArray(string) {
        var lWordCount;
        var lMessageLength = string.length;
        var lNumberOfWords_temp1 = lMessageLength + 8;
        var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
        var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
        var lWordArray = Array(lNumberOfWords - 1);
        var lBytePosition = 0;
        var lByteCount = 0;
        while (lByteCount < lMessageLength) {
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
            lByteCount++
        }
        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lBytePosition = (lByteCount % 4) * 8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (128 << lBytePosition);
        lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
        lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
        return lWordArray
    }

    function WordToHex(lValue) {
        var WordToHexValue = "",
            WordToHexValue_temp = "",
            lByte, lCount;
        for (lCount = 0; lCount <= 3; lCount++) {
            lByte = (lValue >>> (lCount * 8)) & 255;
            WordToHexValue_temp = "0" + lByte.toString(16);
            WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2)
        }
        return WordToHexValue
    }

    function Utf8Encode(string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c)
            } else {
                if ((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128)
                } else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128)
                }
            }
        }
        return utftext
    }
    var x = Array();
    var k, AA, BB, CC, DD, a, b, c, d;
    var S11 = 7,
        S12 = 12,
        S13 = 17,
        S14 = 22;
    var S21 = 5,
        S22 = 9,
        S23 = 14,
        S24 = 20;
    var S31 = 4,
        S32 = 11,
        S33 = 16,
        S34 = 23;
    var S41 = 6,
        S42 = 10,
        S43 = 15,
        S44 = 21;
    string = Utf8Encode(string);
    x = ConvertToWordArray(string);
    a = 1732584193;
    b = 4023233417;
    c = 2562383102;
    d = 271733878;
    for (k = 0; k < x.length; k += 16) {
        AA = a;
        BB = b;
        CC = c;
        DD = d;
        a = FF(a, b, c, d, x[k + 0], S11, 3614090360);
        d = FF(d, a, b, c, x[k + 1], S12, 3905402710);
        c = FF(c, d, a, b, x[k + 2], S13, 606105819);
        b = FF(b, c, d, a, x[k + 3], S14, 3250441966);
        a = FF(a, b, c, d, x[k + 4], S11, 4118548399);
        d = FF(d, a, b, c, x[k + 5], S12, 1200080426);
        c = FF(c, d, a, b, x[k + 6], S13, 2821735955);
        b = FF(b, c, d, a, x[k + 7], S14, 4249261313);
        a = FF(a, b, c, d, x[k + 8], S11, 1770035416);
        d = FF(d, a, b, c, x[k + 9], S12, 2336552879);
        c = FF(c, d, a, b, x[k + 10], S13, 4294925233);
        b = FF(b, c, d, a, x[k + 11], S14, 2304563134);
        a = FF(a, b, c, d, x[k + 12], S11, 1804603682);
        d = FF(d, a, b, c, x[k + 13], S12, 4254626195);
        c = FF(c, d, a, b, x[k + 14], S13, 2792965006);
        b = FF(b, c, d, a, x[k + 15], S14, 1236535329);
        a = GG(a, b, c, d, x[k + 1], S21, 4129170786);
        d = GG(d, a, b, c, x[k + 6], S22, 3225465664);
        c = GG(c, d, a, b, x[k + 11], S23, 643717713);
        b = GG(b, c, d, a, x[k + 0], S24, 3921069994);
        a = GG(a, b, c, d, x[k + 5], S21, 3593408605);
        d = GG(d, a, b, c, x[k + 10], S22, 38016083);
        c = GG(c, d, a, b, x[k + 15], S23, 3634488961);
        b = GG(b, c, d, a, x[k + 4], S24, 3889429448);
        a = GG(a, b, c, d, x[k + 9], S21, 568446438);
        d = GG(d, a, b, c, x[k + 14], S22, 3275163606);
        c = GG(c, d, a, b, x[k + 3], S23, 4107603335);
        b = GG(b, c, d, a, x[k + 8], S24, 1163531501);
        a = GG(a, b, c, d, x[k + 13], S21, 2850285829);
        d = GG(d, a, b, c, x[k + 2], S22, 4243563512);
        c = GG(c, d, a, b, x[k + 7], S23, 1735328473);
        b = GG(b, c, d, a, x[k + 12], S24, 2368359562);
        a = HH(a, b, c, d, x[k + 5], S31, 4294588738);
        d = HH(d, a, b, c, x[k + 8], S32, 2272392833);
        c = HH(c, d, a, b, x[k + 11], S33, 1839030562);
        b = HH(b, c, d, a, x[k + 14], S34, 4259657740);
        a = HH(a, b, c, d, x[k + 1], S31, 2763975236);
        d = HH(d, a, b, c, x[k + 4], S32, 1272893353);
        c = HH(c, d, a, b, x[k + 7], S33, 4139469664);
        b = HH(b, c, d, a, x[k + 10], S34, 3200236656);
        a = HH(a, b, c, d, x[k + 13], S31, 681279174);
        d = HH(d, a, b, c, x[k + 0], S32, 3936430074);
        c = HH(c, d, a, b, x[k + 3], S33, 3572445317);
        b = HH(b, c, d, a, x[k + 6], S34, 76029189);
        a = HH(a, b, c, d, x[k + 9], S31, 3654602809);
        d = HH(d, a, b, c, x[k + 12], S32, 3873151461);
        c = HH(c, d, a, b, x[k + 15], S33, 530742520);
        b = HH(b, c, d, a, x[k + 2], S34, 3299628645);
        a = II(a, b, c, d, x[k + 0], S41, 4096336452);
        d = II(d, a, b, c, x[k + 7], S42, 1126891415);
        c = II(c, d, a, b, x[k + 14], S43, 2878612391);
        b = II(b, c, d, a, x[k + 5], S44, 4237533241);
        a = II(a, b, c, d, x[k + 12], S41, 1700485571);
        d = II(d, a, b, c, x[k + 3], S42, 2399980690);
        c = II(c, d, a, b, x[k + 10], S43, 4293915773);
        b = II(b, c, d, a, x[k + 1], S44, 2240044497);
        a = II(a, b, c, d, x[k + 8], S41, 1873313359);
        d = II(d, a, b, c, x[k + 15], S42, 4264355552);
        c = II(c, d, a, b, x[k + 6], S43, 2734768916);
        b = II(b, c, d, a, x[k + 13], S44, 1309151649);
        a = II(a, b, c, d, x[k + 4], S41, 4149444226);
        d = II(d, a, b, c, x[k + 11], S42, 3174756917);
        c = II(c, d, a, b, x[k + 2], S43, 718787259);
        b = II(b, c, d, a, x[k + 9], S44, 3951481745);
        a = AddUnsigned(a, AA);
        b = AddUnsigned(b, BB);
        c = AddUnsigned(c, CC);
        d = AddUnsigned(d, DD)
    }
    var temp = WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d);
    return temp.toLowerCase()
};
var hexcase = 0;
var b64pad = "";
var chrsz = 8;

function hex_sha1(s) {
    return binb2hex(core_sha1(str2binb(s), s.length * chrsz))
}

function b64_sha1(s) {
    return binb2b64(core_sha1(str2binb(s), s.length * chrsz))
}

function str_sha1(s) {
    return binb2str(core_sha1(str2binb(s), s.length * chrsz))
}

function hex_hmac_sha1(key, data) {
    return binb2hex(core_hmac_sha1(key, data))
}

function b64_hmac_sha1(key, data) {
    return binb2b64(core_hmac_sha1(key, data))
}

function str_hmac_sha1(key, data) {
    return binb2str(core_hmac_sha1(key, data))
}

function sha1_vm_test() {
    return hex_sha1("abc") == "a9993e364706816aba3e25717850c26c9cd0d89d"
}

function core_sha1(x, len) {
    x[len >> 5] |= 128 << (24 - len % 32);
    x[((len + 64 >> 9) << 4) + 15] = len;
    var w = Array(80);
    var a = 1732584193;
    var b = -271733879;
    var c = -1732584194;
    var d = 271733878;
    var e = -1009589776;
    for (var i = 0; i < x.length; i += 16) {
        var olda = a;
        var oldb = b;
        var oldc = c;
        var oldd = d;
        var olde = e;
        for (var j = 0; j < 80; j++) {
            if (j < 16) {
                w[j] = x[i + j]
            } else {
                w[j] = rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1)
            }
            var t = safe_add(safe_add(rol(a, 5), sha1_ft(j, b, c, d)), safe_add(safe_add(e, w[j]), sha1_kt(j)));
            e = d;
            d = c;
            c = rol(b, 30);
            b = a;
            a = t
        }
        a = safe_add(a, olda);
        b = safe_add(b, oldb);
        c = safe_add(c, oldc);
        d = safe_add(d, oldd);
        e = safe_add(e, olde)
    }
    return Array(a, b, c, d, e)
}

function sha1_ft(t, b, c, d) {
    if (t < 20) {
        return (b & c) | ((~b) & d)
    }
    if (t < 40) {
        return b ^ c ^ d
    }
    if (t < 60) {
        return (b & c) | (b & d) | (c & d)
    }
    return b ^ c ^ d
}

function sha1_kt(t) {
    return (t < 20) ? 1518500249 : (t < 40) ? 1859775393 : (t < 60) ? -1894007588 : -899497514
}

function core_hmac_sha1(key, data) {
    var bkey = str2binb(key);
    if (bkey.length > 16) {
        bkey = core_sha1(bkey, key.length * chrsz)
    }
    var ipad = Array(16),
        opad = Array(16);
    for (var i = 0; i < 16; i++) {
        ipad[i] = bkey[i] ^ 909522486;
        opad[i] = bkey[i] ^ 1549556828
    }
    var hash = core_sha1(ipad.concat(str2binb(data)), 512 + data.length * chrsz);
    return core_sha1(opad.concat(hash), 512 + 160)
}

function safe_add(x, y) {
    var lsw = (x & 65535) + (y & 65535);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 65535)
}

function rol(num, cnt) {
    return (num << cnt) | (num >>> (32 - cnt))
}

function str2binb(str) {
    var bin = Array();
    var mask = (1 << chrsz) - 1;
    for (var i = 0; i < str.length * chrsz; i += chrsz) {
        bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (32 - chrsz - i % 32)
    }
    return bin
}

function binb2str(bin) {
    var str = "";
    var mask = (1 << chrsz) - 1;
    for (var i = 0; i < bin.length * 32; i += chrsz) {
        str += String.fromCharCode((bin[i >> 5] >>> (32 - chrsz - i % 32)) & mask)
    }
    return str
}

function binb2hex(binarray) {
    var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
    var str = "";
    for (var i = 0; i < binarray.length * 4; i++) {
        str += hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8 + 4)) & 15) + hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8)) & 15)
    }
    return str
}

function binb2b64(binarray) {
    var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var str = "";
    for (var i = 0; i < binarray.length * 4; i += 3) {
        var triplet = (((binarray[i >> 2] >> 8 * (3 - i % 4)) & 255) << 16) | (((binarray[i + 1 >> 2] >> 8 * (3 - (i + 1) % 4)) & 255) << 8) | ((binarray[i + 2 >> 2] >> 8 * (3 - (i + 2) % 4)) & 255);
        for (var j = 0; j < 4; j++) {
            if (i * 8 + j * 6 > binarray.length * 32) {
                str += b64pad
            } else {
                str += tab.charAt((triplet >> 6 * (3 - j)) & 63)
            }
        }
    }
    return str
}
var hexcase = 0;
var b64pad = "";
var chrsz = 8;

function hex_md5(s) {
    return binl2hex(core_md5(str2binl(s), s.length * chrsz))
}

function b64_md5(s) {
    return binl2b64(core_md5(str2binl(s), s.length * chrsz))
}

function str_md5(s) {
    return binl2str(core_md5(str2binl(s), s.length * chrsz))
}

function hex_hmac_md5(key, data) {
    return binl2hex(core_hmac_md5(key, data))
}

function b64_hmac_md5(key, data) {
    return binl2b64(core_hmac_md5(key, data))
}

function str_hmac_md5(key, data) {
    return binl2str(core_hmac_md5(key, data))
}

function md5_vm_test() {
    return hex_md5("abc") == "900150983cd24fb0d6963f7d28e17f72"
}

function core_md5(x, len) {
    x[len >> 5] |= 128 << ((len) % 32);
    x[(((len + 64) >>> 9) << 4) + 14] = len;
    var a = 1732584193;
    var b = -271733879;
    var c = -1732584194;
    var d = 271733878;
    for (var i = 0; i < x.length; i += 16) {
        var olda = a;
        var oldb = b;
        var oldc = c;
        var oldd = d;
        a = md5_ff(a, b, c, d, x[i + 0], 7, -680876936);
        d = md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
        c = md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
        b = md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
        a = md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
        d = md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
        c = md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
        b = md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
        a = md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
        d = md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
        c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
        b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
        a = md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
        d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
        c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
        b = md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);
        a = md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
        d = md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
        c = md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
        b = md5_gg(b, c, d, a, x[i + 0], 20, -373897302);
        a = md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
        d = md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
        c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
        b = md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
        a = md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
        d = md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
        c = md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
        b = md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
        a = md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
        d = md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
        c = md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
        b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);
        a = md5_hh(a, b, c, d, x[i + 5], 4, -378558);
        d = md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
        c = md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
        b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
        a = md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
        d = md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
        c = md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
        b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
        a = md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
        d = md5_hh(d, a, b, c, x[i + 0], 11, -358537222);
        c = md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
        b = md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
        a = md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
        d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
        c = md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
        b = md5_hh(b, c, d, a, x[i + 2], 23, -995338651);
        a = md5_ii(a, b, c, d, x[i + 0], 6, -198630844);
        d = md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
        c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
        b = md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
        a = md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
        d = md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
        c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
        b = md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
        a = md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
        d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
        c = md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
        b = md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
        a = md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
        d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
        c = md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
        b = md5_ii(b, c, d, a, x[i + 9], 21, -343485551);
        a = safe_add(a, olda);
        b = safe_add(b, oldb);
        c = safe_add(c, oldc);
        d = safe_add(d, oldd)
    }
    return Array(a, b, c, d)
}

function md5_cmn(q, a, b, x, s, t) {
    return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b)
}

function md5_ff(a, b, c, d, x, s, t) {
    return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t)
}

function md5_gg(a, b, c, d, x, s, t) {
    return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t)
}

function md5_hh(a, b, c, d, x, s, t) {
    return md5_cmn(b ^ c ^ d, a, b, x, s, t)
}

function md5_ii(a, b, c, d, x, s, t) {
    return md5_cmn(c ^ (b | (~d)), a, b, x, s, t)
}

function core_hmac_md5(key, data) {
    var bkey = str2binl(key);
    if (bkey.length > 16) {
        bkey = core_md5(bkey, key.length * chrsz)
    }
    var ipad = Array(16),
        opad = Array(16);
    for (var i = 0; i < 16; i++) {
        ipad[i] = bkey[i] ^ 909522486;
        opad[i] = bkey[i] ^ 1549556828
    }
    var hash = core_md5(ipad.concat(str2binl(data)), 512 + data.length * chrsz);
    return core_md5(opad.concat(hash), 512 + 128)
}

function safe_add(x, y) {
    var lsw = (x & 65535) + (y & 65535);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 65535)
}

function bit_rol(num, cnt) {
    return (num << cnt) | (num >>> (32 - cnt))
}

function str2binl(str) {
    var bin = Array();
    var mask = (1 << chrsz) - 1;
    for (var i = 0; i < str.length * chrsz; i += chrsz) {
        bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (i % 32)
    }
    return bin
}

function binl2str(bin) {
    var str = "";
    var mask = (1 << chrsz) - 1;
    for (var i = 0; i < bin.length * 32; i += chrsz) {
        str += String.fromCharCode((bin[i >> 5] >>> (i % 32)) & mask)
    }
    return str
}

function binl2hex(binarray) {
    var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
    var str = "";
    for (var i = 0; i < binarray.length * 4; i++) {
        str += hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8 + 4)) & 15) + hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8)) & 15)
    }
    return str
}

function binl2b64(binarray) {
    var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var str = "";
    for (var i = 0; i < binarray.length * 4; i += 3) {
        var triplet = (((binarray[i >> 2] >> 8 * (i % 4)) & 255) << 16) | (((binarray[i + 1 >> 2] >> 8 * ((i + 1) % 4)) & 255) << 8) | ((binarray[i + 2 >> 2] >> 8 * ((i + 2) % 4)) & 255);
        for (var j = 0; j < 4; j++) {
            if (i * 8 + j * 6 > binarray.length * 32) {
                str += b64pad
            } else {
                str += tab.charAt((triplet >> 6 * (3 - j)) & 63)
            }
        }
    }
    return str
};