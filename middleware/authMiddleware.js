const jwt = require("jsonwebtoken");

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, "to-do list web app", (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.json({ message: "Invalid Token" });
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else {
    res.json({ message: "Token does not exists" });
  }
};

module.exports = {
    requireAuth
}