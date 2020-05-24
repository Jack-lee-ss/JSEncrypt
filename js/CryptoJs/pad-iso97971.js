CryptoJS.pad.ZeroPadding = {
    pad: function (data, blockSize) {
        var blockSizeBytes = blockSize * 4;
        data.clamp();
        data.sigBytes += blockSizeBytes - ((data.sigBytes % blockSizeBytes) || blockSizeBytes);
    }, unpad: function (data) {
        var dataWords = data.words;
        var i = data.sigBytes - 1;
        while (!((dataWords[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff)) {
            i--;
        }
        data.sigBytes = i + 1;
    }
};
CryptoJS.pad.Iso97971 = {
    pad: function (data, blockSize) {
        data.concat(CryptoJS.lib.WordArray.create([0x80000000], 1));
        CryptoJS.pad.ZeroPadding.pad(data, blockSize);
    }, unpad: function (data) {
        CryptoJS.pad.ZeroPadding.unpad(data);
        data.sigBytes--;
    }
};
