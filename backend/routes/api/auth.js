const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../../middleware/auth");

//Model
const User = require("../../models/User");
// @route POST api/auth
// @desc Authenticate An User
// @access Public
router.post("/", (req, res) => {
  console.log("Login body", req.body);
  let { username, password } = req.body;
  //Simple validation
  if (!username || !password) {
    return res
      .status(400)
      .json({ msg: "Please enter both username and password!" });
  }

  //Check for existing user
  username = username.toLowerCase();
  User.findOne({ username }).then(user => {
    if (!user) {
      return res.status(400).json({ msg: "User does not exists" });
    } else {
      validatePass(res, password, user);
    }
  });
});

function validatePass(res, password, user) {
  //Validate password
  bcrypt.compare(password, user.password).then(isMatch => {
    if (!isMatch) return res.status(400).json({ msg: "Password is incorect!" });
    jwt.sign(
      { id: user.id },
      config.get("jwtSecret"),
      { expiresIn: 10000000 },
      (err, token) => {
        if (err) throw err;
        const responseUser = {
          token,
          _id: user._id,
          username: user.username,
          coupleID: user.coupleID
        };
        //After logging in successfuly, find partner by coupleID if it exists
        if (user.coupleID) {
          User.findOne({ coupleID: user.coupleID, _id: { $ne: user._id } })
            .then(partner => {
              console.log("Find partner when login", partner);
              if (partner) {
                const reponsePartner = {
                  id: partner._id,
                  username: partner.username,
                  coupleID: partner.coupleID
                };
                res.json({
                  user: responseUser,
                  partner: reponsePartner
                });
              } else {
                res.json({
                  user: responseUser
                });
              }
            })
            .catch(err => {
              console.log("Find parner err", err);
              res.json({
                user: responseUser
              });
            });
        } else {
          res.json({
            user: responseUser
          });
        }
      }
    );
  });
}

// @route POST api/auth/me
// @desc Get user data
// @access Private
router.get("/me", authMiddleware, (req, res) => {
  User.findById(req.user.id)
    .select("-password")
    .then(User => {
      res.json(User);
    });
});
module.exports = router;
