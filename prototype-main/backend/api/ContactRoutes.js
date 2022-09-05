const express = require("express");
const router = express.Router();
const middlewares = require("../middleware/middlewares.js");
const mailer = require("../middleware/mailService");

router.post("/", async (req, res) => {
  mailer({
    from: `"${req.body.name}" <airparts-service@outlook.com>`,
    to: "airparts-service@outlook.com",
    subject: req.body.subject,
    text: req.body.text,
    html: `<br> sent by: <br> ${req.body.email} ${req.body.text}`,
    replyTo: req.body.email,
  });
  res.status(200).send();
});
module.exports = router;
