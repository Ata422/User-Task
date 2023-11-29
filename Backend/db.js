const mongoose = require("mongoose");
require("dotenv").config();
const mongoURI = process.env.MONGODB_URI;

const connectToMongodb = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("connected with mongodb successfully");
  } catch (error) {
    console.log(error);
    process.exit();
  }
};
module.exports = connectToMongodb;
