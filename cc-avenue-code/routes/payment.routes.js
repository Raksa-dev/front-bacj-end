var express = require("express");
var paymentController = require("../controllers/payment.controller");
var PhonePePaymentController = require("../controllers/paymentPhonePe.controller");
var paymentRouter = express.Router();

paymentRouter.post(
  "/request/phone",
  paymentController.handlePaymentControllerPhone
);
paymentRouter.post("/request", paymentController.handlePaymentController);
paymentRouter.post(
  "/response",
  paymentController.handleResponsePaymentController
);

paymentRouter.post(
  "/phonepe/payu",
  PhonePePaymentController.handlePaymentControllerPayUPage
);
paymentRouter.post(
  "/phonepe/response",
  PhonePePaymentController.handleResponsePaymentControllerPhonePe
);

paymentRouter.get(
  "/phonepe/healthCheck",
  PhonePePaymentController.handlePaymentControllerPhonePayHealthCheck
);

module.exports = paymentRouter;
