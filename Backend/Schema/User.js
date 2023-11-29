const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    require: true,
  },
  role: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("user", userSchema);
