const nodeCCAvenue = require("node-ccavenue");
const CryptoJS = require("crypto-js");
const { request } = require("../helper");

class PaymentController {
  static async handlePaymentControllerPhone(req, res, next) {
    try {
      const ccav = new nodeCCAvenue.Configure({
        ...req.body.keys,
        merchant_id: "2711780",
      });
      const orderParams = {
        redirect_url: encodeURIComponent(
          `https://astroraksa.com/api/response?access_code=${req.body.keys?.access_code}&working_key=${req.body.keys?.working_key}`
        ),
        cancel_url: encodeURIComponent(
          `https://astroraksa.com/api/response?access_code=${req.body.keys?.access_code}&working_key=${req.body.keys?.working_key}`
        ),
        billing_name: "Name of the customer",
        currency: "INR",
        ...req.body.orderParams,
      };
      const encryptedOrderData = ccav.getEncryptedOrder(orderParams);
      res.setHeader("content-type", "application/json");
      res.status(200).json({
        payLink: `https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction&access_code=${req.body.keys.access_code}&encRequest=${encryptedOrderData}`,
      });
    } catch (err) {
      next(err);
    }
  }
  static async handlePaymentController(req, res, next) {
    try {
      const ccav = new nodeCCAvenue.Configure({
        ...req.body.keys,
        merchant_id: "2711780",
      });
      const orderParams = {
        redirect_url: encodeURIComponent(
          `https://astroraksa.com/api/response?access_code=${req.body.keys?.access_code}&working_key=${req.body.keys?.working_key}`
        ),
        cancel_url: encodeURIComponent(
          `https://astroraksa.com/api/response?access_code=${req.body.keys?.access_code}&working_key=${req.body.keys?.working_key}`
        ),
        billing_name: "Name of the customer",
        currency: "INR",
        ...req.body.orderParams,
      };
      const encryptedOrderData = ccav.getEncryptedOrder(orderParams);
      let formbody =
        '<form id="nonseamless" method="post" name="redirect" action="https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction"/> <input type="hidden" id="encRequest" name="encRequest" value="' +
        encryptedOrderData +
        `"><input type="hidden" name="access_code" id="access_code" value='${req.body.keys.access_code}'><script language="javascript">document.redirect.submit();</script></form>`;

      res.setHeader("content-type", "text/html");
      res.status(200).send(formbody);
    } catch (err) {
      next(err);
    }
  }
  static async handleResponsePaymentController(req, res, next) {
    try {
      var encryption = req.body.encResp;
      const ccav = new nodeCCAvenue.Configure({
        ...req.query,
        merchant_id: "2711780",
      });
      var ccavResponse = ccav.redirectResponseToJson(encryption);
      var ciphertext = CryptoJS.AES.encrypt(
        JSON.stringify(ccavResponse),
        "Astro"
      ).toString();
      if (ccavResponse["order_status"] == "Success") {
        res.redirect(
          `https://astroraksa.com/transaction?type=success&val=${ciphertext}`
        );
      } else {
        res.redirect(`https://astroraksa.com/transaction?val=${ciphertext}`);
      }
    } catch (error) {
      next(error);
    }
  }
  static async handleRazorpay(req, res, next) {
    try {
      const { amount } = req.body;
      const body = {
        amount: amount,
        currency: "INR",
        receipt: "Receipt no. 1",
        notes: {
          notes_key_1: "Tea, Earl Grey, Hot",
          notes_key_2: "Tea, Earl Grey… decaf.",
        },
      };

      const username = "rzp_live_gOs6JLaCdCJhJv";
      const password = "CrDbN81vOudORiF1KYTOie4w";

      // Encode the credentials in base64
      const encodedCredentials = Buffer.from(
        `${username}:${password}`
      ).toString("base64");

      const data = await request(
        {
          method: "POST",
          hostname: "api.razorpay.com",
          path: "/v1/orders",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${encodedCredentials}`,
          },
        },
        body
      ).then((dataRes) => {
        return dataRes;
      });
      res.json(data);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = PaymentController;
