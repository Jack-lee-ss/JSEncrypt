// ======================== ������������1 =====================
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
    JS = JSEncrypt // ���ýӿڣ��ⲿ��������ֱ�ӵ���ĸ�����ڵ��Ӻ�����
    T=test         // ���õ��ýӿڡ�
})(JS,T)

function getpwd() {
    return JS()+T();
}

// ===============   ��ֵ������������ ===================

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
    J = JSEncryptt   // �����Ӻ����Ľӿ�
    S=test1         // �ӿ�
}

function get() {
    Key();    //  �ȵ���ĸ����
    return J()+S()
}

