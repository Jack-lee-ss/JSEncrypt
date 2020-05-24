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