const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const Article = require("../models/article.model");
const middlewares = require("../middleware/middlewares");
const mailer = require("../middleware/mailService");

router.post("/", async (req, res) => {
  try {
    await Article.create({
      title: req.body.title,
      author: req.body.author,
      date: req.body.date,
      text: req.body.text,
      previewText: req.body.previewText,
      image: req.body.image,
      comments: [],
    });
    res.json(req.body);
  } catch (e) {
    console.log(e);
    res.json({ status: "failed" });
  }
});

router.get("/", async (req, res) => {
  Article.find({}, (err, result) => {
    if (err) {
      res.json(err);
    } else {
      res.json(result);
    }
  });
});
router.get("/:id", middlewares.checkOptionalAuth, async (req, res) => {
  Article.findById(req.params.id, async (err, result) => {
    if (err) {
      res.json(err);
    } else {
      result_obj = result.toObject();
      if (req.user_id) {
        // he is logged in
        result_obj.isLiked = result.likes.includes(req.user_id);
      } else {
        result_obj.isLiked = false;
      }
      res.json(result_obj);
    }
  });
});

router.patch("/:id/addComment", middlewares.checkAuth, async (req, res) => {
  const article = await Article.findById(req.params.id);
  const user = await User.findById(req.user_id);

  const comments = article.comments;

  const newComment = {
    text: req.body.text,
    author: `${user.firstname} ${user.lastname.charAt(0)}.`,
    author_id: req.user_id,
    date: req.body.date,
    replyTo: req.body.replyTo,
  };

  const update = { comments: [...comments, newComment] };
  const newArticle = await Article.findOneAndUpdate({ _id: req.params.id }, update, { new: true });

  if (req.body.replyTo) {
    // fetch the comment this comment is replying to
    var originalComment = newArticle.comments.find((comment) => (comment._id = req.body.replyTo));
    //fetch the user who wrote this comment:
    var replyUser = await User.findById(originalComment.author_id);

    mailer({
      from: `"AirParts" <airparts-service@outlook.com>`,
      to: replyUser.email,
      subject: "Reply to your comment",
      text: `Hi ${replyUser.firstname}, ${req.email} Answered your comment on the AirParts Blog Article`,
      html: `Hi ${replyUser.firstname}, <br /> <br /> ${req.email} Answered your comment on a AirParts Blog Article (http://localhost:3000/blogarticle/${req.params.id}) `,
    });
  }
  res.json(newArticle);
});

router.patch("/:id/likeArticle", middlewares.checkAuth, async (req, res) => {
  const article = await Article.findById(req.params.id);
  var isLiked = false;

  if (article.likes.includes(req.user_id)) {
    article.likes = article.likes.filter((like) => like != req.user_id);
  } else {
    article.likes = [...article.likes, req.user_id];
    isLiked = true;
  }
  const update = { likes: article.likes };
  articleUpdated = await Article.findOneAndUpdate({ _id: req.params.id }, update);
  res.json({
    likeCount: article.likes.length,
    isLiked: isLiked,
    user_id: req.user_id,
  });
});

module.exports = router;
