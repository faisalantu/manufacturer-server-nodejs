const express = require("express");
const router = express.Router();
const ProductModel = require("../models/Product");
const auth = require("../middleware/auth");
const mongoose = require("mongoose");
const adminAuth = require("../middleware/adminAuth");

// @route   GET api/product
// @desc    get all product
// @access  private
// @query   userEmail,club,skip,limit
router.get("/", async (req, res) => {
  try {
    let { userEmail, skip, limit,sort } = req.query;
    skip = Number(skip);
    limit = Number(limit);
    sort = Number(sort);

    function matchQuery() {
      if (userEmail) {
        return {
          userEmail: userEmail,
        };
      } else {
        return {};
      }
    }
    const product = await ProductModel.aggregate()
      .match(matchQuery())
      .sort(sort? `${sort}` : "1")
      .skip(skip ? skip : 0)
      .limit(limit ? limit : 10)

    res.status(200).send(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ success: false, masssage: "no products" });
  }
});

// @route   GET api/product/limited
// @desc    get limited product (6)
// @access  private
router.get("/limited", async (req, res) => {
  try {
    let { skip, limit } = req.query;
    skip = Number(skip);
    limit = Number(limit);
    const product = await ProductModel.aggregate()
      .skip(skip ? skip : 0)
      .limit(limit ? limit : 6);

    res.status(200).send(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ success: false, masssage: "no products" });
  }
});
// @route   GET api/product/productcount
// @desc    get all product count
// @access  private
router.get("/productcount", async (req, res) => {
  try {
    const counts = await ProductModel.count();
    res.status(200).send({ success: true, totalProducts: counts });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ success: false, masssage: "error while counting" });
  }
});

// @route   GET api/product/userproductcount
// @desc    get all product count
// @access  private
router.get("/userproductcount", async (req, res) => {
  try {
    let { userEmail } = req.query;
    function matchQuery() {
      if (userEmail) {
        return {
          userEmail: userEmail,
        };
      } else {
        return {};
      }
    }
    const product = await ProductModel.aggregate().match(matchQuery());
    res.status(200).send({ success: true, totalProducts: product.length });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ success: false, masssage: "no products" });
  }
});

// @route   GET api/product/one
// @desc    get one product by product id
// @access  Private
// @query   productId
router.get("/one", async (req, res) => {
  try {
    let { productId } = req.query;
    let productObjId = mongoose.Types.ObjectId(productId);
    function matchQuery() {
      if (productId) {
        return {
          _id: productObjId,
        };
      } else {
      }
    }
    const product = await ProductModel.aggregate().match(matchQuery()).limit(1);
    res.status(200).send(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ success: false, masssage: "no products" });
  }
});

// @route   POST api/product
// @desc    create/add one new product
// @access  Private
router.post("/", auth, adminAuth, async (req, res) => {
  let product = new ProductModel({
    title: req.body.title,
    imageUrl: req.body.imageUrl,
    description: req.body.description,
    quantity: req.body.quantity,
    price: req.body.price,
    userEmail: req.body.userEmail,
    displayName: req.body.displayName,
  });
  console.log(product);
  try {
    product = await product.save();
    res.send({ success: true, message: "product created" });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ success: false, message: "product cannot be created" });
  }
});

// @route   PUT api/products
// @desc    update product
// @access  Private admin
router.put("/", auth, adminAuth, async (req, res) => {
  let { productId } = req.query;
  let { title, quantity, price, imageUrl } = req.body;
  console.log(title, quantity, price, imageUrl);
  try {
    const product = await ProductModel.findById(productId);
    product.quantity = quantity;
    product.title = title;
    product.price = price;
    product.imageUrl = imageUrl;
    await product.save();
    res.status(200).send({success: true, message:"product updated"});
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ success: false, message: "product quantiry cant be updated" });
  }
});

// @route   PUT api/products/quantity
// @desc    update quantiry
// @access  Private
router.put("/quantity", async (req, res) => {
  let { productId } = req.query;
  let { quantity } = req.body;
  try {
    const product = await ProductModel.findById(productId);
    product.quantity = quantity;
    await product.save();
    res.status(200).send(product);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ success: false, message: "product quantiry cant be updated" });
  }
});

// @route   DELETE api/product/one
// @desc    delete one product
// @access  Private
router.delete("/one", async (req, res) => {
  try {
    let productId = req.body.productId;
    const product = await ProductModel.findByIdAndDelete({ _id: productId });
    if (!product) throw error;
    res.status(200).send({ success: true, message: "product deleted" });
  } catch (err) {
    res
      .status(500)
      .send({ success: false, message: "product cannot be deleted" });
  }
});

module.exports = router;
