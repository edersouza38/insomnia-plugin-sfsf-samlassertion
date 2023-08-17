module.exports = {
  formatPrivateKey: function (input) {
    // Validate PEM keys:
    const keyArmor = /-----(BEGIN |END )(.*?) KEY-----/g;
    let v = [...input.matchAll(keyArmor)];
    if (v.length > 0) {
      if (v.length != 2 || v[0][2] !== v[1][2] || v[0][2] !== "PRIVATE") {
        throw 'Invalid PEM private key. Make sure that the armoring is consistent and the PEM key is from the type "PRIVATE".';
      }
      return input.replace(/\r?\n|\r/g, '');
    }

    //Verify whether key was generated directly in SFSF:
    let d = Buffer.from(input, "base64").toString("utf-8");
    v = d.split("###");
    if (v.length === 2) {
      input = v[0];
    }
    return `-----BEGIN PRIVATE KEY-----${input}-----END PRIVATE KEY-----`;
  },

  formatCertificate: function (input) {
    // Validate PEM keys:
    const keyArmor = /-----(BEGIN |END )(.*?)-----/g;
    let v = [...input.matchAll(keyArmor)];
    if (v.length > 0) {
      if (v.length != 2 || v[0][2] !== v[1][2]) {
        throw "Invalid PEM certificate. Make sure that the armoring is consistent.";
      }
      return input.replace(/\r?\n|\r/g, '');
    }

    //Verify whether key was generated directly in SFSF:
    let d = Buffer.from(input, "base64").toString("utf-8");
    v = d.split("###");
    if (v.length === 2) {
      input = v[0];
    }
    return `-----BEGIN CERTIFICATE-----${input}-----END CERTIFICATE-----`;
  },

  delay: function(time) {
    return new Promise(resolve => setTimeout(resolve, time));
  },

  userIdentifierFormat: {
    userId : "userId",
    userName : "userName",
    eMail : "e-Mail"
  }
};
