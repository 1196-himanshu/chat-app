const mongoose = require("mongoose");

const signupSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  unique:true,
  },
  password: {
    type: String,
    required: true,
  },
});

const Signup = mongoose.model("Signup", signupSchema);
module.exports = Signup;
