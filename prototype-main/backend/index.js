require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/user.model");
const Part = require("./models/part.model");
const UserRoutes = require("./api/UserRoutes");
const PartRoutes = require("./api/PartRoutes");
const ArticleRoutes = require("./api/ArticleRoutes");
const SubscriptionRoutes = require("./api/SubscriptionRoutes");
const StripeRoutes = require("./api/StripeRoutes");
const ContactRoutes = require("./api/ContactRoutes");

const port = 8080;

app.use(
  cors({
    origin: ["http://localhost:3000", "https://checkout.stripe.com"],
  })
);
app.use(express.json());

mongoose.connect(
  "mongodb+srv://admin:igObbrLeGkkVYRC5@cluster0.dfjn5z6.mongodb.net/?retryWrites=true&w=majority"
);

app.use("/user", UserRoutes);
app.use("/part", PartRoutes);
app.use("/article", ArticleRoutes);
app.use("/stripe", StripeRoutes);
app.use("/contact", ContactRoutes);
app.use("/subscription", SubscriptionRoutes);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
