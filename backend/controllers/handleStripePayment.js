const asyncHandler = require("express-async-handler");
const {
  calculateNextBillingDate,
} = require("../utils/calculateNextBillingdate");
const { shoulRenewSubcriptionPlan } = require("../utils/renewSubPlan");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Payment = require("../models/Payment");
const User = require("../models/User");
//----------stripe payment----------

const handleStripePayment = asyncHandler(async (req, res) => {
  const { amount, subscriptionPlan } = req.body;
  //const { amount, subscriptionPlan, currency } = req.body;
  //console.log("Currency being sent:", currency || "Default currency (INR)");

  //get the user
  const user = req?.user;
  console.log(user);
  try {
    //create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Number(amount) * 100,
      currency: "inr",
      //currency: currency || "inr",
      //add some data the meta object
      metadata: {
        userId: user?._id?.toString(),
        userEmail: user?.email,
        subscriptionPlan,
      },
    });
    console.log(paymentIntent);

    //send the response
    res.json({
      clientSecret: paymentIntent?.client_secret,
      paymentId: paymentIntent?.id,
      metadata: paymentIntent?.metadata,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

//------Verify payment--------

const verifyPayment = asyncHandler(async (req, res) => {
  const { paymentId } = req.params;
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentId);
    console.log(paymentIntent);
    if (paymentIntent.status === "succeeded") {
      //get the info metadata
      const metadata = paymentIntent?.metadata;
      const subscriptionPlan = metadata?.subscriptionPlan;
      const userEmail = metadata?.userEmail;
      const userId = metadata?.userId;

      //find the user
      const userFound = await User.findById(userId);
      if (!userFound) {
        return res.status(404).json({
          status: "false",
          message: "User not found",
        });
      }

      //Get the payment details
      const amount = paymentIntent?.amount / 100;
      const currency = paymentIntent?.currency;
      const paymentId = paymentIntent?.id;

      //create the payment history
      const newPayment = await Payment.create({
        user: userId,
        email: userEmail,
        subscriptionPlan,
        amount,
        currency,
        status: "success",
        reference: paymentId,
      });

      //check for the subscription plan
      if (subscriptionPlan === "Basic") {
        //update the user
        const updatedUser = await User.findByIdAndUpdate(userId, {
          subscriptionPlan,
          trialPeriod: 0,
          nextBillingDate: calculateNextBillingDate(),
          apiRequestCount: 0,
          monthlyRequestCount: 50,
          subscriptionPlan: "Basic",
          $addToSet: { payments: newPayment?._id },
        });

        res.json({
          status: true,
          message: "Payment verified, user updated",
          updatedUser,
        });
      }
      if (subscriptionPlan === "Premium") {
        //update the user
        const updatedUser = await User.findByIdAndUpdate(userId, {
          subscriptionPlan,
          trialPeriod: 0,
          nextBillingDate: calculateNextBillingDate(),
          apiRequestCount: 0,
          monthlyRequestCount: 100,
          subscriptionPlan: "Premium",
          $addToSet: { payments: newPayment?._id },
        });

        res.json({
          status: true,
          message: "Payment verified, user updated",
          updatedUser,
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
});

//----------Handle free subscription-------
const handleFreesubscription = asyncHandler(async (req, res) => {
  //Get the login user
  const user = req?.user;

  //check if user acc should be renew or not

  try {
    if (shoulRenewSubcriptionPlan(user)) {
      //update the user account
      user.subscriptionPlan = "Free";
      user.monthlyRequestCount = 3;
      user.apiRequestCount = 0;
      user.nextBillingDate = calculateNextBillingDate();

      //Create new paymnet and save into DB
      const newPayment = await Payment.create({
        user: user?._id,
        subscriptionPlan: "Free",
        amount: 0,
        status: "success",
        reference: Math.random().toString(36).substring(7),
        monthlyRequestCount: 3,
        currency: "inr",
      });

      user.payments.push(newPayment?._id);

      //save the user
      await user.save();

      //send the response
      res.json({
        status: "success",
        message: "Subscription plan updated successfully",
        user,
      });
    } else {
      return res
        .status(403)
        .json({ error: "Subscription renewal not due yet" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
});

module.exports = { handleStripePayment, handleFreesubscription, verifyPayment };
