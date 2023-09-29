const CryptoJS = require("crypto-js");
const https = require("https");

function encodeRequest(payload) {
  return Buffer.from(JSON.stringify(payload)).toString("base64");
}

function signRequest(payload) {
  return CryptoJS.SHA256(payload).toString(CryptoJS.enc.Hex);
}

async function request(options, payload) {
  return new Promise((resolve, reject) => {
    const res = https.request(options, (resp) => {
      let data = "";

      resp.on("data", (chunk) => {
        data += chunk;
      });

      resp.on("end", () => {
        resolve(JSON.parse(data));
      });
    });

    res.on("error", reject);

    if (payload) {
      res.write(JSON.stringify(payload));
    }

    res.end();
  });
} 

module.exports = {
  encodeRequest,
  signRequest,
  request,
};
