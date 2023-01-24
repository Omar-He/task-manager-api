require("dotenv").config();
const SECRET = process.env.SECRET;

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    console.log(token);
    const decoded = jwt.verify(token, SECRET);
    req.userData = decoded;
    next();
  } catch (error) {
    return res.status(401).send({ message: "Auth failed" });
  }
};

module.exports = authMiddleware;
