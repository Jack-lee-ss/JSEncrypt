window = this;
var cryPP = {
    excutePP: function(r, e) {
        for (var n = "", t = 0; t < r.length; t++) {
            var o = e ^ r.charCodeAt(t);
            n += String.fromCharCode(o)
        }
        return encodeURIComponent(n)
    },
    generateMix: function(r) {
        return Math.ceil(1e3 * Math.random())
    }
};

//
function getFormData($form) {
    var out = {};
    var data = $form.serializeArray();
    //transform into simple data/value object
    for (var i = 0; i < data.length; i++) {
        var record = data[i];
        out[record.name] = record.value;
    }
    return out;
}
//
function getpwd(pwd) {

    //var data = getFormData($form);

    var kk = cryPP.generateMix();


    return cryPP.excutePP(pwd, kk);

}

//  源码：将其修改为 cryPP.generateMix() 可以调用函数
var cryPP = {};
$(function() {
    cryPP.excutePP = function(r, e) {
        for (var n = "", t = 0; t < r.length; t++) {
            var o = e ^ r.charCodeAt(t);
            n += String.fromCharCode(o)
        }
        return encodeURIComponent(n)
    }
    ,
    cryPP.generateMix = function(r) {
        return Math.ceil(1e3 * Math.random())
    }
});

// 方法一：对象形式：
var cryPP {
    excutePP ： function(r, e) {
        for (var n = "", t = 0; t < r.length; t++) {
            var o = e ^ r.charCodeAt(t);
            n += String.fromCharCode(o)
        }
        return encodeURIComponent(n)
    }
    ,
    generateMix : function(r) {
        return Math.ceil(1e3 * Math.random())
    }
};

//  方法二：设置空对象调用
var cryPP = {};
    cryPP.excutePP = function(r, e) {
        for (var n = "", t = 0; t < r.length; t++) {
            var o = e ^ r.charCodeAt(t);
            n += String.fromCharCode(o)
        }
        return encodeURIComponent(n)
    }
    
    cryPP.generateMix = function(r) {
        return Math.ceil(1e3 * Math.random())
    }

