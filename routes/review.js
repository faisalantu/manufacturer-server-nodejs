const express = require("express");
const router = express.Router();
const ReviewModel = require("../models/Review");
const auth = require("../middleware/auth");

// @route   GET api/review
// @desc    get all product
// @access  private
// @query   userEmail,club,skip,limit
router.get("/", async (req, res) => {
  try {
    let { userEmail, skip, limit, sort } = req.query;
    skip = Number(skip);
    limit = Number(limit);
    function matchQuery() {
      if (userEmail) {
        return {
          userEmail: userEmail,
        };
      } else {
        return {};
      }
    }
    const review = await ReviewModel.aggregate()
      .match(matchQuery())
      .sort({"date": -1})
      .skip(skip ? skip : 0)
      .limit(limit ? limit : 6);

    res.status(200).send(review);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ success: false, masssage: "no reviews" });
  }
});


// @route   POST api/review
// @desc    create/add one new product
// @access  Private
router.post("/", auth, async (req, res) => {
  let review = new ReviewModel({
    displayName: req.body.displayName,
    email: req.body.email,
    title: req.body.title,
    rating: req.body.rating,
    description: req.body.description,
  });
  console.log(review);
  try {
    review = await review.save();
    res.send({ success: true, message: "review created" });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ success: false, message: "review cannot be created" });
  }
});


module.exports = router;
