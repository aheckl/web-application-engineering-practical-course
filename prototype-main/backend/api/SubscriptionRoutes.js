const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const middlewares = require("../middleware/middlewares.js");
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2020-08-27",
});
const mailer = require("../middleware/mailService");
var cron = require("node-cron");

// Schedule deleting unsubscribed premium members at the end of their last subscription period, checks every day at midnight
cron.schedule("0 0 0 * * * ", async () => {
  let users = await User.find({});
  let date = new Date().getTime() / 1000;
  let unsubscribed = users.filter(
    (user) =>
      user.subscriptionInfo.subscriptionEnd != null &&
      user.subscriptionInfo.subscriptionEnd <= date &&
      user.premium
  );
  unsubscribed.forEach(async (user) => {
    await User.findOneAndUpdate(
      { email: user.email },
      { premium: false, subscriptionInfo: {} },
      { new: true }
    );
  });
});

//Get the Premium Subscription product from Stripe
router.get("/product", async (req, res) => {
  try {
    const product = await stripe.products.retrieve("prod_M4HNFVyeZawqQa");
    return res.json(product);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.raw.message });
  }
});

//Get prices of Premium Subscription from Stripe
router.get("/prices", async (req, res) => {
  try {
    const prices = await stripe.prices.list({
      product: "prod_M4HNFVyeZawqQa",
    });
    return res.json(prices);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.raw.message });
  }
});

//Get a subscription from Stripe
router.get("/details", middlewares.checkAuth, async (req, res) => {
  try {
    const subscription = await stripe.subscriptions.retrieve(req.query.subscriptionId);
    return res.json(subscription);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.raw.message });
  }
});

//Get price of monthly Premium Subscription from Stripe
router.get("/price/monthly", async (req, res) => {
  try {
    const price = await stripe.prices.retrieve("price_1LM8ouGvxZmTxZHBldoUgwVr");
    return res.json(price);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.raw.message });
  }
});

//Get price of annual Premium Subscription from Stripe
router.get("/price/annual", async (req, res) => {
  try {
    const price = await stripe.prices.retrieve("price_1LM8ouGvxZmTxZHBQ6drznMK");
    return res.json(price);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.raw.message });
  }
});

//Create Stripe Session (Checkout) for monthly Subscription
router.post("/session/monthly", middlewares.checkAuth, async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: "price_1LM8ouGvxZmTxZHBldoUgwVr",
          quantity: 1,
        },
      ],
      success_url: "http://localhost:3000?frequency=monthly&session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:3000/subscription?success=false",
    });
    return res.json(session);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.raw.message });
  }
});

//Create Stripe Session (Checkout) for annual Subscription
router.post("/session/annual", middlewares.checkAuth, async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: "price_1LM8ouGvxZmTxZHBQ6drznMK",
          quantity: 1,
        },
      ],
      success_url: "http://localhost:3000?frequency=annual&session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:3000/subscription?success=false",
    });
    return res.json(session);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.raw.message });
  }
});

router.get("/checkout", middlewares.checkAuth, async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
    if (session) {
      const update = {
        premium: true,
        subscriptionInfo: {
          subscriptionId: session.subscription,
          creationDate: new Date(),
          frequency: req.query.frequency,
          subscriptionEnd: null,
        },
      };
      User.findOneAndUpdate({ _id: req.user_id }, update, { new: true }, (err, result) => {
        if (err) {
        } else {
        }
      });
    }
    mailer({
      from: '"AirParts " <airparts-service@outlook.com>',
      to: req.email,
      subject: "Welcome to the AirParts Premium Membership",
      text: "You sucessfully subscribed to the AirParts Premium Membership! Enjoy your newly unlocked benefits!",
      html: `Hello ${req.firstname}, <br /> You sucessfully subscribed to the AirParts Premium Membership! Enjoy your newly unlocked benefits! <br /> <br /> Best regards, <br /> The AirParts Team`,
    });
    console.log(req.email);
    console.log(req.firstname);
    return res.status(200).json(session);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.raw.message });
  }
});

router.post("/unsubscribe", middlewares.checkAuth, async (req, res) => {
  const deleted = await stripe.subscriptions.del(req.body.subscriptionId);
  if (deleted) {
    const update = {
      subscriptionInfo: {
        subscriptionId: deleted.id,
        subscriptionEnd: deleted.current_period_end,
      },
    };

    //Add an subscription end date to the user
    User.findOneAndUpdate({ _id: req.user_id }, update, { new: true }, (err, result) => {
      if (err) {
        console.log(err);
      } else {
      }
    });

    res.status(200).send();
  } else {
    res.status(400).send();
  }
});

module.exports = router;
