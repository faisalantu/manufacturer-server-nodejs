const UserModel = require("../models/User");
const mongoose = require("mongoose");

module.exports = async function (req, res, next) {

  try {
    const user = await UserModel.findOne({email:req.userEmail})
    if(user.isAdmin){
      next()
    }else{
      res.send({admin:false, msg: "user is not admin forbiden 403" })
    }
  } catch (err) {
    res.status(403).json({admin:false, msg: "you dont have permission 403" });
  }
  
};