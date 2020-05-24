// ======================== 匿名函数调用1 =====================
var JS = {};
var T={};
(function() {
    var test = function() {
        return 10000;
    }

    var JSEncrypt = function() {

        return 12;
    };

    JSEncrypt.prototype.setPrivateKey = function(privkey) {
        // Create the key.
        this.setKey(privkey);
    };

    JSEncrypt.prototype.encrypt = function(str) {
        // Return the encrypted string.
        try {
            return 100;
        } catch (ex) {
            return false;
        }
    };
    JS = JSEncrypt // 调用接口，外部函数不能直接调用母函数内的子函数，
    T=test         // 设置调用接口。
})(JS,T)

function getpwd() {
    return JS()+T();
}

// ===============   赋值变量函数调用 ===================

var Key=function() {
    var test1 = function() {
        return 1003;
    }

    var JSEncryptt = function() {

        return 122;
    };

    JSEncryptt.prototype.setPrivateKey = function(privkey) {
        // Create the key.
        this.setKey(privkey);
    };

    JSEncryptt.prototype.encrypt = function(str) {
        // Return the encrypted string.
        try {
            return 100;
        } catch (ex) {
            return false;
        }
    };
    J = JSEncryptt   // 调用子函数的接口
    S=test1         // 接口
}

function get() {
    Key();    //  先调用母函数
    return J()+S()
}

