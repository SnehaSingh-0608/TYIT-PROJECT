const express = require("express");

const isAuthenticated = require("../middlewares/isAuthenticated");
const {
  handleStripePayment,
  handleFreesubscription,
  verifyPayment,
} = require("../controllers/handleStripePayment");

const stripeRouter = express.Router();

stripeRouter.post("/checkout", isAuthenticated, handleStripePayment);
stripeRouter.post("/free-plan", isAuthenticated, handleFreesubscription);
stripeRouter.post("/verify-payment/:paymentId", isAuthenticated, verifyPayment);

module.exports = stripeRouter;
