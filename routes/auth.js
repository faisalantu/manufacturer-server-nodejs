const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const UserModel = require("../models/User");
const auth = require("../middleware/auth");
// @route   GET api/user
// @desc    get user info
// @access  nun
router.get("/", async (req, res) => {
  try {
    res.status(200).send();
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ success: false, masssage: "no auth" });
  }
});


// @route   POST api/user
// @desc    create jwt token
// @access  nun
router.post("/signin", async (req, res) => {
  const user = req.body;
  console.log(user.email);
  try {
    function matchQuery() {
      if (user?.email) {
        return {
          email: user.email,
        };
      } else {
        return {};
      }
    }
    const userData = await UserModel.aggregate().match(matchQuery());

    if (userData.length <= 0) {
      let userModelData = new UserModel({
        email: user.email,
      });
      try {
        userModelData = await userModelData.save();
        const accessToken = jwt.sign(user, process.env.JWT_TOKEN, {
          expiresIn: "1d",
        });
        res.send(accessToken);
      } catch (err) {
        console.log(err);
        res
          .status(500)
          .send({ success: false, message: "user cannot be created" });
      }
    } else {
      const accessToken = jwt.sign(user, process.env.JWT_TOKEN, {
        expiresIn: "1d",
      });
      res.send(accessToken);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ success: false, masssage: "no user found" });
  }
});

module.exports = router;
