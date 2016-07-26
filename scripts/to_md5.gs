function to_md5(text_to_md5) {
  
  var toMD5 = text_to_md5 //md5sheet.getRange('b9').getValue()
  
    var signature = Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, toMD5, Utilities.Charset.US_ASCII);

    var signatureStr = '';
    for (i = 0; i < signature.length; i++) {
      var byte = signature[i];
      if (byte < 0)
        byte += 256;
      var byteStr = byte.toString(16);
      // Ensure we have 2 chars in our byte, pad with 0
      if (byteStr.length == 1) byteStr = '0'+byteStr;
      signatureStr += byteStr;
    }
  
    return signatureStr
  
}
