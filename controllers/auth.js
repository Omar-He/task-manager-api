const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const SECRET = process.env.SECRET;

//route to authenticate user and generate a token
const authenticate = async (req, res) => {
  const { email, password } = req.body;
  //check email and password against the database
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  //generate a token
  const token = jwt.sign({ _id: user._id }, SECRET, { expiresIn: "1h" });
  res.json({ token });
};

module.exports = {
  authenticate,
};
