const express = require("express");
const router = express.Router();
const OrderModel = require("../models/Order");
const auth = require("../middleware/auth");
const PaymentModel = require("../models/Payment");
const adminAuth = require("../middleware/adminAuth");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);


// @route   POST api/order
// @desc    create/add one new order
// @access  Private
router.patch("/create-payment-intent", auth, async (req, res) => {
  const {price:amount} = req.body;
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: "usd",
    payment_method_types: ["card"],
  });
  res.send({ clientSecret: paymentIntent.client_secret });
});



module.exports = router;
