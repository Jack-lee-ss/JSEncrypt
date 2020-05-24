get = function() {
    var t, e, n = "";
    for (t = 0; t < 32; t++)
    e = 16 * Math.random() | 0,
    8 !== t && 12 !== t && 16 !== t && 20 !== t || (n += "-"),
    n += (12 === t ? 4 : 16 === t ? 3 & e | 8 : e).toString(16);
    return n
}