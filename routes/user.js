const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken")
const UserModel = require("../models/User");
const adminAuth = require("../middleware/adminAuth")
const auth = require("../middleware/auth");

// @route   GET api/user
// @desc    get user info
// @access  nun
router.get("/", async (req, res) => {
  try {
    res.status(200).send();
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ success: false, masssage: "no products" });
  }
});

// @route   GET api/user/all -
// @desc    get all users
// @access  private admin
// @query   userEmail,skip,limit
router.get("/all", auth, async (req, res) => {
  try {
    let { userEmail, skip, limit } = req.query;
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
    const users = await UserModel.aggregate()
      .match(matchQuery())
      .skip(skip ? skip : 0)
      .limit(limit ? limit : 10);

    res.status(200).send(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ success: false, masssage: "no user" });
  }
});

// @route   GET api/user/admin
// @desc    check is admin
// @access  admin -
router.get("/admin",auth,adminAuth, async (req, res) => {
  res.send({
    admin:true
  })
});

// @route   PUT api/user/admin
// @desc    Edit Admin
// @access  nun
router.put("/admin",auth, adminAuth, async (req, res) => {
  let { userId } = req.query;
  try {
    const user = await UserModel.findById(userId);
    user.isAdmin = !user.isAdmin
    await user.save();
    res.status(200).send(user);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ success: false, message: "sorry error" });
  }
});



module.exports = router;
