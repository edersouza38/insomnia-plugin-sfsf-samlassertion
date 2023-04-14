const saml = require("saml").Saml20;
const uuid = require("uuid");
const utils = require("./utils");

module.exports = {
  name: "samlAssertionSFSF",
  displayName: "SAML Assertion - SFSF",
  description: "Create a SAML Assertion for SFSF OAuth2SAMLAssertion flow.",
  args: [
    {
      displayName: "X.509 Certificate",
      description: "X.509 Certificate used to identify the SAML IdP",
      type: "string",
      placeholder: "-----BEGIN CERTIFICATE-----",
    },
    {
      displayName: "Private Key",
      description: "Private Key used to sign the SAML Assertion",
      type: "string",
      placeholder: "-----BEGIN PRIVATE KEY-----",
    },
    {
      displayName: "SAML Issuer",
      description: "Name of the IdP issuing the SAML Assertion",
      type: "string",
      defaultValue: "local.insomnia.com",
    },
    {
      displayName: "Lifetime in seconds",
      description: "Lifetime of the SAML Assertion in seconds",
      type: "number",
      defaultValue: 600,
    },
    {
      displayName: "Client Id",
      description: "Registered Client Id in SFSF",
      type: "string",
      placeholder: "OWE1Yzg0NTMyOGJlY2M4NWRiZGFiMGE3MTI5MA",
    },
    {
      displayName: "User Identifier",
      description: "User Identifier",
      type: "string",
      placeholder: "Username",
    },
    {
      displayName: "User Identifier Format",
      description: "User Identifier Format",
      type: "enum",
      placeholder: "User Identifier Format",
      defaultValue: utils.userIdentifierFormat.userId,
      options: [
        {
          displayName: "User ID",
          value: utils.userIdentifierFormat.userId
        },
        {
          displayName: "Username",
          value: utils.userIdentifierFormat.userName
        },
        {
          displayName: "E-Mail",
          value: utils.userIdentifierFormat.eMail
        },
      ],
    },
    {
      displayName: "OAuth Token Endpoint",
      description: "SFSF OAuth Token Endpoint",
      type: "string",
      placeholder: "Username",
    },
    {
      displayName: "Audience",
      description: "Audience of the SAML Assertion",
      type: "string",
      defaultValue: "www.successfactors.com",
    },
  ],
  async run(
    context,
    cert,
    key,
    issuer,
    lifetime,
    clientId,
    nameId,
    userIdentifierFormat,
    tokenEndpoint,
    audience
  ) {
    let samlAttributes = {
      api_key: clientId
    };

    var nameIdentifierFormat =
      "urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified";

    switch (userIdentifierFormat) {
      case utils.userIdentifierFormat.eMail:
        nameIdentifierFormat =
          "urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress";
        break;
      case utils.userIdentifierFormat.userName:
        samlAttributes.use_username = "true";
        break;
      default:
        break;
    }
    let options = {
      cert: utils.formatCertificate(cert),
      key: utils.formatPrivateKey(key),
      issuer: issuer,
      lifetimeInSeconds: lifetime,
      audiences: audience,
      attributes: samlAttributes,
      nameIdentifier: nameId,
      nameIdentifierFormat: nameIdentifierFormat,
      recipient: tokenEndpoint,
      sessionIndex: "_" + uuid.v4(),
    };
    return Buffer.from(saml.create(options)).toString("base64");
  },
};
