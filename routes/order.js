const express = require("express");
const router = express.Router();
const OrderModel = require("../models/Order");
const auth = require("../middleware/auth");
const ProductModel = require("../models/Product");
const adminAuth = require("../middleware/adminAuth");
const PaymentModel = require("../models/Payment");
const mongoose = require("mongoose");

// @route   GET api/order
// @desc    get all order
// @access  private
// @query   userEmail,skip,limit
router.get("/", auth, async (req, res) => {
  try {
    let { userEmail, skip, limit } = req.query;
    skip = Number(skip);
    limit = Number(limit);
    function matchQuery() {
      if (userEmail) {
        return {
          email: userEmail,
        };
      } else {
        return {};
      }
    }
    const order = await OrderModel.aggregate()
      .match(matchQuery())
      .skip(skip ? skip : 0)
      .limit(limit ? limit : 10);

    res.status(200).send(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ success: false, masssage: "no orders" });
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
    const product = await OrderModel.aggregate().match(matchQuery()).limit(1);
    res.status(200).send(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ success: false, masssage: "no products" });
  }
});

// @route   GET api/order/ordercount
// @desc    get all order count
// @access  private admin
router.get("/ordercount",auth,adminAuth, async (req, res) => {
  try {
    const counts = await OrderModel.count();
    res.status(200).send({ success: true, totalOrderCount: counts });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ success: false, masssage: "error while counting" });
  }
});


// @route   POST api/order
// @desc    create/add one new order
// @access  Private
router.post("/", auth, async (req, res) => {
  let order = new OrderModel({
    displayName: req.body.displayName,
    email: req.body.email,
    address: req.body.address,
    quantity: req.body.quantity,
    phone: req.body.phone,
    productId: req.body.productId,
    title: req.body.title,
    price: req.body.price
  });
  try {
    const product = await ProductModel.findById({ _id:req.body.productId });
    product.quantity = product.quantity - req.body.quantity;
    await product.save();
    order = await order.save();
    res.send({ success: true, message: "order created" });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ success: false, message: "order cannot be created" });
  }
});

// @route   PUT api/order
// @desc    update order
// @access  Private
router.put("/", auth, async (req, res) => {
  let { orderId } = req.query;
  let { status, deleverd } = req.body;
  console.log(status, deleverd,orderId);
  try {
    const order = await OrderModel.findById(orderId);
    order.status = status?!order.status:order.status;
    order.deleverd = deleverd?!order.deleverd:order.deleverd;
    await order.save();
    res.status(200).send(order);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ success: false, message: "order can't be updated" });
  }
});

// @route   PUT api/order
// @desc    update order
// @access  Private
router.patch("/payment", auth, async (req, res) => {
  console.log("hello");
  let { productId } = req.query;
  const payment = req.body;

  const order = await OrderModel.findById(productId);
  console.log(order.status);
  order.status = true;
  order.transactionId = payment.transactionId;
  await order.save();

  let paymentCollection = new PaymentModel(payment);
  paymentCollection = await paymentCollection.save();

  res.send(order);
});

// @route   DELETE api/order/one
// @desc    delete one order
// @access  Private
router.delete("/one", async (req, res) => {
  try {
    let _id = req.body.productId;
    const order = await OrderModel.findByIdAndDelete({ _id });
    if (!order) throw error;

    console.log(order);
    const product = await ProductModel.findById({ _id: order.productId});
    product.quantity = +product.quantity + +order.quantity;
    await product.save();

    res.status(200).send({ success: true, message: "order deleted" });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ success: false, message: "order cannot be deleted" });
  }
});


module.exports = router;
