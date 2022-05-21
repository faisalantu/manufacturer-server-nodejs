require('dotenv').config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");


const app = express();
app.use(cors());

//connect database
connectDB();
// init middleware
app.use(express.json({ limit: "30mb" }));

app.get("/", (req, res) => {
  res.json({
    msg: "hello world!",
  });
});



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}!`);
});