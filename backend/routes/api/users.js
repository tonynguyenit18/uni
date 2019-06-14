const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../../middleware/auth");

//User Model
const User = require("../../models/User");
const CoupleDetails = require("../../models/CoupleDetails");

const ALPHABET = "0123456789ABCDEFGHIKLMNOPQRSTUVWXYZ";

// @route POST api/users
// @desc Create An User
// @access Public
router.post("/", (req, res) => {
  console.log("Register body", req.body);
  let { username, password } = req.body;
  username = username.toLowerCase();
  //Simple validation
  if (!username || !password) {
    return res
      .status(400)
      .json({ msg: "Please enter both username and password!" });
  }

  //Check for existing user
  User.findOne({ username }).then(user => {
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }
    const newUser = new User({
      username,
      password
    });
    createUser(res, newUser);
  });
});

function createUser(res, newUser) {
  //Create salt and hash
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) throw err;
      newUser.password = hash;
      newUser.save().then(user => {
        jwt.sign(
          { id: user.id },
          config.get("jwtSecret"),
          { expiresIn: 3600 },
          (err, token) => {
            if (err) throw err;
            res.json({
              user: {
                token,
                _id: user.id,
                username: user.username
              }
            });
          }
        );
      });
    });
  });
}

// @route POST api/user/create_couple_id
// @desc Create and Update User couple Id
// @access Public
router.post("/create_couple_id", authMiddleware, (req, res) => {
  const condition = { _id: req.user.id };
  checkCoupleId().then(coupleID => {
    const newCoupleDetails = new CoupleDetails({
      coupleID
    });

    newCoupleDetails.save();

    updateUser(condition, { coupleID })
      .then(user => {
        res.json({ user });
      })
      .catch(err => res.status(400).json({ msg: "Update Failed!" }));
  });
});

// @route POST api/user/sync_couple_id
// @desc Sync User couple Id
// @access Public
router.post("/sync_couple_id", authMiddleware, (req, res) => {
  const condition = { _id: req.user.id };
  let { coupleID } = req.body;
  if (!coupleID) {
    return res.status(400).json({ msg: "Invalid coupleID" });
  }
  coupleID = coupleID.toUpperCase();
  User.find({ coupleID })
    .select("-password")
    .then(user => {
      if (user.length == 1) {
        updateUser(condition, { coupleID })
          .then(updatedUser =>
            res.json({
              user: updatedUser,
              partner: user[0]
            })
          )
          .catch(err => res.json({ msg: "Update failed" }));
      } else if (user.length > 1) {
        res.status(400).json({ msg: "This ID is already coupled" });
      } else {
        res.status(400).json({ msg: "Partner couple ID not found" });
      }
    });
});

// @route GET api/user/:couple_id
// @desc Sync User couple Id
// @access Public
router.get("/", authMiddleware, (req, res) => {
  const condition = { _id: req.user.id };
  User.findOne(condition)
    .select("-password")
    .then(user => {
      if (user) {
        if (user.coupleID) {
          User.findOne({ coupleID: user.coupleID, _id: { $ne: user._id } })
            .then(partner => {
              if (partner) {
                const reponsePartner = {
                  _id: partner._id,
                  username: partner.username,
                  coupleID: partner.coupleID
                };
                res.json({
                  user: user,
                  partner: reponsePartner
                });
              } else {
                res.json({
                  user: user
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
            user: user
          });
        }
      } else {
        res.status(400).json({ msg: "Get user infor failed" });
      }
    });
});

// @route GET api/user/couple_details/:couple_id
// @desc Sync User couple Id
// @access Public
router.get("/couple_details", authMiddleware, (req, res) => {
  const { coupleID } = req.query;
  CoupleDetails.findOne({ coupleID })
    .then(couple => {
      if (couple) {
        res.json(couple);
      } else {
        res.status(400).json({ msg: "Could not find couple details" });
      }
    })
    .catch(err => {
      console.log("GET couple_details err", err);
      res.status(400).json({ msg: "Could not find couple details" });
    });
});

// @route POST api/user/update
// @desc Create An User
// @access Public
router.post("/update", authMiddleware, (req, res) => {
  var condition = { _id: req.user.id };
  console.log("update request body", req.body);
  updateUser(condition, req.body)
    .then(updatedUser =>
      res.json({
        user: updatedUser
      })
    )
    .catch(err => res.json({ msg: "Update failed" }));
});

function generateCoupleId(idLength) {
  let id = "";
  for (let i = 0; i < idLength; i++) {
    id += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
  }
  console.log("id", id);
  return id;
}

const findUserByCoupleId = resolve => {
  const coupleID = generateCoupleId(8);
  User.findOne({ coupleID })
    .then(user => {
      if (!user) {
        resolve(coupleID);
      } else {
        findUserByCoupleId();
      }
    })
    .catch(err => console.log(err));
};

const checkCoupleId = () => {
  return new Promise((resolve, reject) => {
    findUserByCoupleId(resolve);
  });
};

const updateUser = (condition, updateBody) => {
  return User.findOneAndUpdate(condition, updateBody, { new: true }).select(
    "-password"
  );
};

module.exports = router;
