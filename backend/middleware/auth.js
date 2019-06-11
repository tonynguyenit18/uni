const config = require("config");
const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const token = req.header("x-auth-token");

  //Check for token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    // Verify token
    const decodedToken = jwt.verify(token, config.get("jwtSecret"));

    // Add user from payloaf
    req.user = decodedToken;
    next();
  } catch (e) {
    res.status(400).json({ msg: "Token is invalid" });
  }
}

module.exports = auth;
