 var SS = function(e, a) {
     "use strict";
     var n = function(e, a) {
         return e << a | e >>> 32 - a
     }, t = function(e, a) {
         var n, t, o, i, r;
         return o = 2147483648 & e,
         i = 2147483648 & a,
         n = 1073741824 & e,
         t = 1073741824 & a,
         r = (1073741823 & e) + (1073741823 & a),
         n & t ? 2147483648 ^ r ^ o ^ i : n | t ? 1073741824 & r ? 3221225472 ^ r ^ o ^ i : 1073741824 ^ r ^ o ^ i : r ^ o ^ i
     }, o = function(e, a, n) {
         return e & a | ~e & n
     }, i = function(e, a, n) {
         return e & n | a & ~n
     }, r = function(e, a, n) {
         return e ^ a ^ n
     }, s = function(e, a, n) {
         return a ^ (e | ~n)
     }, c = function(e, a, i, r, s, c, d) {
         return e = t(e, t(t(o(a, i, r), s), d)),
         t(n(e, c), a)
     }, d = function(e, a, o, r, s, c, d) {
         return e = t(e, t(t(i(a, o, r), s), d)),
         t(n(e, c), a)
     }, l = function(e, a, o, i, s, c, d) {
         return e = t(e, t(t(r(a, o, i), s), d)),
         t(n(e, c), a)
     }, m = function(e, a, o, i, r, c, d) {
         return e = t(e, t(t(s(a, o, i), r), d)),
         t(n(e, c), a)
     }, u = function(e) {
         for (var a, n = e.length, t = n + 8, o = (t - t % 64) / 64, i = 16 * (o + 1), r = Array(i - 1), s = 0, c = 0; n > c;)
         a = (c - c % 4) / 4,
         s = c % 4 * 8,
         r[a] = r[a] | e.charCodeAt(c) << s,
         c++;
         return a = (c - c % 4) / 4,
         s = c % 4 * 8,
         r[a] = r[a] | 128 << s,
         r[i - 2] = n << 3,
         r[i - 1] = n >>> 29,
         r
     }, g = function(e) {
         var a, n, t = "",
             o = "";
         for (n = 0; 3 >= n; n++)
         a = e >>> 8 * n & 255,
         o = "0" + a.toString(16),
         t += o.substr(o.length - 2, 2);
         return t
     }, h = function(e) {
         e = e.replace(/\x0d\x0a/g, "\n");
         for (var a = "", n = 0; n < e.length; n++) {
             var t = e.charCodeAt(n);
             128 > t ? a += String.fromCharCode(t) : t > 127 && 2048 > t ? (a += String.fromCharCode(t >> 6 | 192),
             a += String.fromCharCode(63 & t | 128)) : (a += String.fromCharCode(t >> 12 | 224),
             a += String.fromCharCode(t >> 6 & 63 | 128),
             a += String.fromCharCode(63 & t | 128))
         }
         return a
     };

     md5 = function(e) {
         var a, n, o, i, r, s, p, f, v, _ = Array(),
             w = 7,
             b = 12,
             C = 17,
             y = 22,
             k = 5,
             x = 9,
             E = 14,
             T = 20,
             $ = 4,
             I = 11,
             L = 16,
             A = 23,
             j = 6,
             B = 10,
             N = 15,
             M = 21;
         for (e = h(e),
         _ = u(e),
         s = 1732584193,
         p = 4023233417,
         f = 2562383102,
         v = 271733878,
         a = 0; a < _.length; a += 16)
         n = s,
         o = p,
         i = f,
         r = v,
         s = c(s, p, f, v, _[a + 0], w, 3614090360),
         v = c(v, s, p, f, _[a + 1], b, 3905402710),
         f = c(f, v, s, p, _[a + 2], C, 606105819),
         p = c(p, f, v, s, _[a + 3], y, 3250441966),
         s = c(s, p, f, v, _[a + 4], w, 4118548399),
         v = c(v, s, p, f, _[a + 5], b, 1200080426),
         f = c(f, v, s, p, _[a + 6], C, 2821735955),
         p = c(p, f, v, s, _[a + 7], y, 4249261313),
         s = c(s, p, f, v, _[a + 8], w, 1770035416),
         v = c(v, s, p, f, _[a + 9], b, 2336552879),
         f = c(f, v, s, p, _[a + 10], C, 4294925233),
         p = c(p, f, v, s, _[a + 11], y, 2304563134),
         s = c(s, p, f, v, _[a + 12], w, 1804603682),
         v = c(v, s, p, f, _[a + 13], b, 4254626195),
         f = c(f, v, s, p, _[a + 14], C, 2792965006),
         p = c(p, f, v, s, _[a + 15], y, 1236535329),
         s = d(s, p, f, v, _[a + 1], k, 4129170786),
         v = d(v, s, p, f, _[a + 6], x, 3225465664),
         f = d(f, v, s, p, _[a + 11], E, 643717713),
         p = d(p, f, v, s, _[a + 0], T, 3921069994),
         s = d(s, p, f, v, _[a + 5], k, 3593408605),
         v = d(v, s, p, f, _[a + 10], x, 38016083),
         f = d(f, v, s, p, _[a + 15], E, 3634488961),
         p = d(p, f, v, s, _[a + 4], T, 3889429448),
         s = d(s, p, f, v, _[a + 9], k, 568446438),
         v = d(v, s, p, f, _[a + 14], x, 3275163606),
         f = d(f, v, s, p, _[a + 3], E, 4107603335),
         p = d(p, f, v, s, _[a + 8], T, 1163531501),
         s = d(s, p, f, v, _[a + 13], k, 2850285829),
         v = d(v, s, p, f, _[a + 2], x, 4243563512),
         f = d(f, v, s, p, _[a + 7], E, 1735328473),
         p = d(p, f, v, s, _[a + 12], T, 2368359562),
         s = l(s, p, f, v, _[a + 5], $, 4294588738),
         v = l(v, s, p, f, _[a + 8], I, 2272392833),
         f = l(f, v, s, p, _[a + 11], L, 1839030562),
         p = l(p, f, v, s, _[a + 14], A, 4259657740),
         s = l(s, p, f, v, _[a + 1], $, 2763975236),
         v = l(v, s, p, f, _[a + 4], I, 1272893353),
         f = l(f, v, s, p, _[a + 7], L, 4139469664),
         p = l(p, f, v, s, _[a + 10], A, 3200236656),
         s = l(s, p, f, v, _[a + 13], $, 681279174),
         v = l(v, s, p, f, _[a + 0], I, 3936430074),
         f = l(f, v, s, p, _[a + 3], L, 3572445317),
         p = l(p, f, v, s, _[a + 6], A, 76029189),
         s = l(s, p, f, v, _[a + 9], $, 3654602809),
         v = l(v, s, p, f, _[a + 12], I, 3873151461),
         f = l(f, v, s, p, _[a + 15], L, 530742520),
         p = l(p, f, v, s, _[a + 2], A, 3299628645),
         s = m(s, p, f, v, _[a + 0], j, 4096336452),
         v = m(v, s, p, f, _[a + 7], B, 1126891415),
         f = m(f, v, s, p, _[a + 14], N, 2878612391),
         p = m(p, f, v, s, _[a + 5], M, 4237533241),
         s = m(s, p, f, v, _[a + 12], j, 1700485571),
         v = m(v, s, p, f, _[a + 3], B, 2399980690),
         f = m(f, v, s, p, _[a + 10], N, 4293915773),
         p = m(p, f, v, s, _[a + 1], M, 2240044497),
         s = m(s, p, f, v, _[a + 8], j, 1873313359),
         v = m(v, s, p, f, _[a + 15], B, 4264355552),
         f = m(f, v, s, p, _[a + 6], N, 2734768916),
         p = m(p, f, v, s, _[a + 13], M, 1309151649),
         s = m(s, p, f, v, _[a + 4], j, 4149444226),
         v = m(v, s, p, f, _[a + 11], B, 3174756917),
         f = m(f, v, s, p, _[a + 2], N, 718787259),
         p = m(p, f, v, s, _[a + 9], M, 3951481745),
         s = t(s, n),
         p = t(p, o),
         f = t(f, i),
         v = t(v, r);
         var P = g(s) + g(p) + g(f) + g(v);
         return P.toLowerCase()
     }

 }

 var FF = SS();

 function getpwd(pwd) {

     return md5(pwd);
 }