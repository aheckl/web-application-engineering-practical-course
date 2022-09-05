const express = require("express");
const router = express.Router();
const cors = require("cors");
const { request } = require("express");
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_KEY);

const middlewares = require("../middleware/middlewares.js");

const shoppingCart = "http://localhost:3000/shoppingCart";
const { v4: uuidv4 } = require("uuid");
const User = require("../models/user.model");

router.post("/create-checkout-session", middlewares.checkAuth, async (req, res) => {
  var lineItems = [];
  var paymentIntent = {
    _id: uuidv4(),
    products: [],
  };

  req.body.products.forEach((product) => {
    lineItems.push(
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: product.configuration
              ? `Your custom configuration for ${product.rentingTime} months`
              : `${product.name} ${product.rentingTime} months`,
          },
          unit_amount: product.prices[product.rentingTime] * 100,
          recurring: { interval: "month" },
        },
        quantity: product.amount,
      },
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: product.configuration
              ? `Deposit for your custom configuration ${product._id}`
              : `Deposit for ${product.name}`,
          },
          unit_amount: product.prices[product.rentingTime] * 100,
        },
        quantity: product.amount,
      }
    );

    if (product.configuration) {
      configurationIds = Object.values(product.configuration).map((conf) => {
        return conf._id;
      });

      paymentIntent.products = [
        ...paymentIntent.products,
        {
          configuration: configurationIds,
          _id: product._id,
          duration: product.rentingTime,
          amount: product.amount,
          price: product.prices[product.rentingTime],
        },
      ];
    } else {
      paymentIntent.products = [
        ...paymentIntent.products,
        {
          _id: product._id,
          duration: product.rentingTime,
          amount: product.amount,
          price: product.prices[product.rentingTime],
        },
      ];
    }
  });

  var user = await User.findById(req.user_id);
  if (!user.premium) {
    lineItems.push({
      price_data: {
        currency: "eur",
        product_data: {
          name: "Shipping Cost",
        },
        unit_amount: 400,
      },
      quantity: 1,
    });
  }

  var newPaymentIntents = user.paymentIntents
    ? [...user.paymentIntents, paymentIntent]
    : [paymentIntent];

  User.findOneAndUpdate(
    { _id: req.user_id },

    { paymentIntents: newPaymentIntents },
    { new: true },
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
      }
    }
  );

  const session = await stripe.checkout.sessions.create({
    line_items: lineItems,
    mode: "subscription",
    success_url: `${shoppingCart}?success=true&key=${paymentIntent._id}`,
    cancel_url: `${shoppingCart}?success=false`,
  });
  res.json({ url: session.url });
});

module.exports = router;
