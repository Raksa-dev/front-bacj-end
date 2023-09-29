const CryptoJS = require("crypto-js");

const { encodeRequest, signRequest, request } = require("../helper");

const PAYMENT_INITIATED = "PAYMENT_INITIATED";
const PAYMENT_SUCCESS = "PAYMENT_SUCCESS";
const PAYMENT_ERROR = "PAYMENT_ERROR";
const BASE_URL_PROD = "https://raksa.tech";
const BASE_URL_LOCAL = "http://localhost:3000";
const BASE_URL = BASE_URL_PROD;

const FRONTEND_LOCAL = "http://localhost:8080";
const FRONTEND_PROD = "https://www.astroraksa.com";

const FRONT_END_BASE = FRONTEND_PROD;

const marchentId = "RAKSAONLINE";
const saltIndex = 1;
const saltKey = "ba273d65-f2a8-4b07-86e5-5d9f06390ab3";

class PhonePePaymentController {
  marchentId;
  constructor() {}

  static async handlePaymentControllerPayUPage(req, res, next) {
    try {
      const { merchantTransactionId, merchantUserId, amount, mobileNumber } =
        req.body;
      const body = {
        merchantId: marchentId,
        merchantTransactionId,
        merchantUserId,
        amount: amount * 100, // converted in paise as per the document
        mobileNumber: mobileNumber ? mobileNumber : "",
        redirectUrl: `${BASE_URL}/api/phonepe/response`,
        redirectMode: "POST",
        callbackUrl: `${BASE_URL}/api/phonepe/response`,
        paymentInstrument: {
          type: "PAY_PAGE",
        },
      };
      const encodeBody = encodeRequest(body);
      const dataUserForCheckSumCreation = signRequest(
        encodeBody + "/pg/v1/pay" + saltKey
      );

      const X_VERIFY = dataUserForCheckSumCreation + "###" + saltIndex;
      const data = await request(
        {
          method: "POST",
          hostname: "api.phonepe.com",
          path: "/apis/hermes/pg/v1/pay",
          headers: {
            "Content-Type": "application/json",
            "X-VERIFY": X_VERIFY,
          },
        },
        { request: encodeBody }
      ).then((dataRes) => {
        return dataRes;
      });
      res.json(data);
    } catch (err) {
      next(err);
    }
  }
  static async handleResponsePaymentControllerPhonePe(req, res, next) {
    try {
      let RequestParams = req.body;
      var ciphertext = CryptoJS.AES.encrypt(
        JSON.stringify(RequestParams),
        "Astro"
      ).toString();
      if (RequestParams["code"] == PAYMENT_SUCCESS) {
        res.redirect(
          `${FRONT_END_BASE}/transaction?type=success&val=${ciphertext}&pg=phonepe`
        );
      } else {
        res.redirect(
          `${FRONT_END_BASE}/transaction?val=${ciphertext}&pg=phonepe`
        );
      }
    } catch (error) {
      next(error);
    }
  }
  static async handlePaymentControllerPhonePayHealthCheck(req, res, next) {
    try {
      const dataUserForCheckSumCreation = signRequest(
        "" + `/v1/pg/merchants/${marchentId}/health` + saltKey
      );

      const X_VERIFY = dataUserForCheckSumCreation + "###" + saltIndex;
      const data = await request({
        method: "GET",
        hostname: "uptime.phonepe.com",
        path: `/v1/pg/merchants/${marchentId}/health`,
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": X_VERIFY,
        },
      }).then((dataRes) => {
        return dataRes;
      });
      res.json(data);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = PhonePePaymentController;
