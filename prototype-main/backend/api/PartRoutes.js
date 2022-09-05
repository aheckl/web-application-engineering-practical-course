const express = require("express");
const router = express.Router();
const Part = require("../models/part.model");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { countDocuments } = require("../models/part.model");
const middlewares = require("../middleware/middlewares.js");

router.post("/", async (req, res) => {
  Part.create(req.body)
    .then((response) => {
      res.json(response);
    })
    .catch((exception) => {
      res.status(500).send({ error: "Failed to create Part ", message: exception });
    });
});

router.get("/", async (req, res) => {
  Part.find(req.query, (err, result) => {
    if (err) {
      res.status(500).json(error);
    } else {
      res.json(result);
    }
  });
});

router.get("/:type", async (req, res) => {
  req.query.type = req.params.type;

  if (req.query.minWatts) {
    req.query.watts = { $gte: req.query.minWatts };
  }

  Part.find(req.query, async (err, result) => {
    if (err) {
      res.status(500).json(err);
    } else {
      var result = result.map((elem) => elem.toJSON());
      if (
        req.query.priceLow &&
        req.query.priceHigh &&
        !(req.query.priceHigh == 0 && req.query.priceLow == 0)
      ) {
        result = await result.filter(
          (part) =>
            part.prices[req.query.duration] <= req.query.priceHigh &&
            part.prices[req.query.duration] >= req.query.priceLow
        );
      }
      res.json(result);
    }
  });
});

router.get("/getIds/id", async (req, res) => {
  Part.find(req.query, (err, result) => {
    if (err) {
      res.status(500).json(err);
    } else {
      res.json(result);
    }
  });
});

router.get("/getbyid/:id", async (req, res) => {
  Part.findById(req.params.id, (err, result) => {
    if (err) {
      res.status(500).json(err);
    } else {
      res.json(result);
    }
  });
});

router.get("/:type/pricerange", async (req, res) => {
  var priceMin = 0;
  var priceMax = 0;

  Part.find({ type: req.params.type }, (err, result) => {
    if (err) {
      res.status(500).json(err);
    } else {
      if (result.length > 0) {
        var data = result[0]?.toObject();
        priceMin = data.prices?.[req.query.duration];

        Part.find({ type: req.params.type }, (err, result) => {
          if (err) {
            res.status(500).json(err);
          } else {
            var data = result[0].toObject();
            priceMax = data.prices?.[req.query.duration];
            res.json({ priceMin: priceMin, priceMax: priceMax });
          }
        })
          .sort("-price")
          .limit(1);
      } else {
        res.json({ priceMin: 0, priceMax: 0 });
      }
    }
  })
    .sort("price")
    .limit(1);
});

router.get("/:type/:attribute/", async (req, res) => {
  var query = req.query;
  query.type = req.params.type;
  Part.find(query, (err, result) => {
    if (err) {
      res.status(500).json(err);
    } else {
      var attributes = result
        .map((part) => {
          return part[req.params.attribute];
        })
        .filter((att) => att != null);
      res.json([...new Set(attributes)]);
    }
  });
});

router.patch("/:id/review", middlewares.checkAuth, async (req, res) => {
  const part = await Part.findById(req.params.id);

  const newReview = {
    text: req.body.text,
    rating: req.body.rating,
    author: req.email,
    author_id: req.user_id,
    date: req.body.date,
  };

  const update = { reviews: [...part.reviews, newReview] };
  const newArticle = await Part.findOneAndUpdate({ _id: req.params.id }, update);
  res.json(newReview);
});
module.exports = router;
