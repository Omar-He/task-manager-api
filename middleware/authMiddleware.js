const jwt = require("jsonwebtoken");
require("dotenv").config();

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Invalid token" });
  }
  try {
    req.userData = jwt.verify(token, process.env.SECRET);
    next();
  } catch (error) {
    return res.status(401).json({ message: "Auth failed" });
  }
};

module.exports = authMiddleware;
