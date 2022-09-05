const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const middlewares = require("../middleware/middlewares.js");
const mailer = require("../middleware/mailService");
const Part = require("../models/part.model");

router.post("/register", async (req, res) => {
  try {
    const newPassword = await bcrypt.hash(req.body.password, 10);

    await User.create({
      firstname: req.body.firstName,
      lastname: req.body.lastName,
      address: req.body.address,
      city: req.body.city,
      postcode: req.body.postalCode,
      country: req.body.country,
      email: req.body.email,
      password: newPassword,
    });

    mailer({
      from: '"AirParts " <airparts-service@outlook.com>',
      to: req.body.email,
      subject: "AirParts Account Created ",
      text: "You sucessfully created a new AirParts Account",
      html: `Hello ${req.body.firstName}, <br /> You sucessfully created a new AirParts Account. <br /> <br /> Best regards, <br /> The AirParts Team`,
    });

    res.json({ status: "ok" });
  } catch (err) {
    res.json({ status: "error", error: "Failed to Create User" });
    console.log(err);
  }
});

router.post("/login", async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
  });

  if (!user) {
    return res.json({
      status: "Login Error",
      error: "Invalid e-mail or password. ",
      user: false,
    });
  }

  const isPasswordValid = await bcrypt.compare(req.body.password, user.password);

  if (isPasswordValid) {
    const token = jwt.sign(
      {
        firstname: user.firstname,
        email: user.email,
        user_id: user._id,
      },
      "JWTSECRETTODO"
    );
    return res.json({ status: "ok", user: token });
  } else {
    return res.json({
      status: "Login Error",
      error: "Invalid e-mail or password. ",
      user: false,
    });
  }
});

router.put("/subscribe", async (req, res) => {
  const newSubscription = req.body.newSubscription;
  const id = req.body.id;

  try {
    await User.findById(id, (error, userToUpdate) => {
      userToUpdate.subscribe = newSubscription;
    });
  } catch (err) {
    console.log(err);
  }
});

router.get("/profile", middlewares.checkAuth, async (req, res) => {
  User.findOne({ email: req.email }, (err, result) => {
    if (err) {
      res.status(500).json(err);
    } else {
      res.json(result);
    }
  });
});

router.patch("/profile/updateProfile", middlewares.checkAuth, async (req, res) => {
  try {
    await User.findOneAndUpdate(
      { _id: req.user_id },
      {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        postcode: req.body.postcode,
        address: req.body.address,
        city: req.body.city,
        country: req.body.country,
      },
      { new: true }
    );
    res.status(200).send();
  } catch {
    req.status(400).send();
  }
});

router.patch("/profile/updatePassword", middlewares.checkAuth, async (req, res) => {
  const newPassword = await bcrypt.hash(req.body.password, 10);
  try {
    await User.findOneAndUpdate(
      { _id: req.user_id },
      {
        password: newPassword,
      },
      { new: true }
    );
    res.status(200).send();
  } catch {
    res.status(400).send();
  }
});

router.patch("/addOrderToOrderHistory/:intentId", middlewares.checkAuth, async (req, res) => {
  const user = await User.findById(req.user_id);

  const paymentIntent = user.paymentIntents.find((intent) => {
    return intent._id === req.params.intentId;
  });
  if (!paymentIntent) {
    res.status(400).send();
    return;
  }

  var newPaymentIntents = user.paymentIntents.filter((paymentIntent) => {
    paymentIntent._id != req.params.intentId;
  });

  var historyElement = {
    products: paymentIntent.products,
    date: new Date(),
    _id: paymentIntent._id,
    price: paymentIntent.price,
  };

  var newOrderHistory = user.orderHistory
    ? [...user.orderHistory, historyElement]
    : [historyElement];

  await User.findOneAndUpdate(
    { _id: req.user_id },
    { orderHistory: newOrderHistory, paymentIntents: newPaymentIntents },
    { new: true }
  );

  mailer({
    from: '"AirParts " <airparts-service@outlook.com>',
    to: req.email,
    subject: "Order Confirmation",
    text: `Hello ${req.firstname}, Thank you for your rental. Best regards The AirParts Team`,
    html: `Hello ${req.firstname}, <br /> Thank you for your rental. <br /> <br /> Best regards, <br /> The AirParts Team`,
  });

  res.status(200).send();
});

router.get("/profile/orders", middlewares.checkAuth, async (req, res) => {
  User.findOne({ email: req.email }, async (err, result) => {
    if (err) {
      res.status(500).json(err);
    } else {
      var orders = await Promise.all(
        result.orderHistory.map(async (order) => {
          var newOrder = { date: order.date };
          newOrder.products = await Promise.all(
            order.products.map(async (position) => {
              if (position.configuration.length == 0) {
                var part = await Part.findById(position._id);
                var newPart = part.toJSON();
                newPart.duration = position.duration;
                newPart.amount = position.amount;
                newPart.price = position.price;
                return newPart;
              } else {
                var newConfig = {
                  _id: position._id,
                  duration: position.duration,
                  amount: position.amount,
                  price: position.price,
                };
                newConfig.configuration = await Promise.all(
                  position.configuration.map(async (confPart) => {
                    var part = await Part.findById(confPart);
                    return part;
                  })
                );
                return newConfig;
              }
            })
          );
          return newOrder;
        })
      );
      res.json(orders);
    }
  });
});

router.patch("/subscription", middlewares.checkAuth, async (req, res) => {
  try {
    await User.findOneAndUpdate(
      { _id: req.user_id },
      {
        premium: req.body.premium,
        subscriptionInfo: req.body.subscriptionInfo,
      },
      { new: true }
    );
    res.status(200).send();
  } catch {
    req.status(400).send();
  }
});

module.exports = router;
