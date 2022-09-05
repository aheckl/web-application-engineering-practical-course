const mongoose = require("mongoose");

const User = new mongoose.Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postcode: { type: String, required: false },
    country: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    usergroup: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
    premium: { type: Boolean, default: false },
    subscriptionInfo: {
      subscriptionId: { type: String, default: "" },
      creationDate: { type: Date },
      frequency: { type: String },
      subscriptionEnd: { type: Number, default: null },
    },
    orderHistory: [
      {
        _id: { type: String },
        date: Date,
        products: [
          {
            configuration: [String],
            _id: String,
            duration: Number,
            amount: Number,
            price: Number,
          },
        ],
      },
    ],
    paymentIntents: [
      {
        _id: { type: String },
        products: [
          {
            configuration: [String],
            _id: String,
            duration: Number,
            amount: Number,
            price: Number,
          },
        ],
      },
    ],
  },
  { collection: "user-data" }
);

const model = mongoose.model("UserData", User);

module.exports = model;
