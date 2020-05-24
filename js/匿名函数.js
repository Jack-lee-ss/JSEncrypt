var JSEncrypt = {};
var JS = function() {
    //return "http://www.leybc.com";

    var key = function() {
        return "1+2=3";
    };
    var JSEncrypt = function() {
        return "https://www.baidu.com";
    }
    JSEncrypt.prototype.setKey = function(key) {
        return 1222;
    }

    JSEncrypt.encrypt = function(privkey) {
        // Create the key.
        this.setKey(privkey)
    }

    JSEncrypt.prototype.decrypt = function(str) {
                    // Return the decrypted string.
                    try {
                        return this.getKey().decrypt(b64tohex(str));
                    } catch (ex) {
                        return false;
                    }
                }
JSEncrypt.prototype.getPublicKey = function() {
                    // Return the private representation of this key.
                    return this.getKey().getPublicKey();
                }
    return new JSEncrypt;
}
