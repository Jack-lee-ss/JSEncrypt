// AES ����
function encryPass(pwd, key, iv) {
    var k = CryptoJS.enc.Utf8.parse(key);
    var i = CryptoJS.enc.Utf8.parse(iv);
    return CryptoJS.AES.encrypt(pwd, k, {
        mode: CryptJS.mode.CBC,
        padding: CryptJS.pad.Iso10126,
        iv: i

    }).toString();
}

function decryptPass(encryted, key, iv) {
    var k = CryptoJS.enc.Utf8.parse(key);
    var i = CryptoJS.enc.Utf8.parse(iv);
    var decrypted = CryptoJS.AES.dencrypt(encrypted, k, {
        mode: CryptJS.mode.CBC,
        padding: CryptJS.pad.Iso10126,
        iv: i
    });
    return decrypted.toString(CryptJS.enc.Utf8);

    var key = "2222";
    var iv = "1111";
    var encrypted = encryptPass('a12345678', key, iv);
    return ('����:' + encrypted + '����:' + decryptPass(encrypted, key, iv));



}
