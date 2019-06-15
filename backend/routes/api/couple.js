const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../../middleware/auth");

const CoupleDetails = require("../../models/CoupleDetails");

// @route POST api/couple/add_memory
// @desc Create An User
// @access Public
router.post("/add_memory", authMiddleware, (req, res) => {
  console.log("update couple details", req.body);
  const { coupleID, newMemory } = req.body;
  CoupleDetails.findOne({ coupleID })
    .then(couple => {
      if (couple) {
        couple.memories.push(newMemory);
        CoupleDetails.findOneAndUpdate(
          { coupleID },
          { memories: couple.memories },
          { new: true }
        )
          .then(updatedCouple => {
            if (updatedCouple) {
              res.status(200).json({ memories: updatedCouple.memories });
            } else {
              console.log("Add memory response: ", updatedCouple);
              res.status(400).json({ msg: "Add Memory to DB failed!" });
            }
          })
          .catch(err => {
            console.log("Add memory err: ", err);
            res.status(400).json({ msg: "Add Memory to DB failed!" });
          });
      } else {
        console.log("Find couple response: ", couple);
        res.status(400).json({ msg: "Add Memory to DB failed!" });
      }
    })
    .catch(err => {
      console.log("Add memory err: ", err);
      res.status(400).json("msg: Add Memory to DB failed!");
    });
});

// @route POST api/couple/add_event
// @desc Create An User
// @access Public
router.post("/add_event", authMiddleware, (req, res) => {
  console.log("update couple /add_event", req.body);
  const { coupleID, newEvent } = req.body;
  CoupleDetails.findOne({ coupleID })
    .then(couple => {
      if (couple) {
        couple.nextEvents
          ? couple.nextEvents.push(newEvent)
          : (couple.nextEvents = [newEvent]);
        CoupleDetails.findOneAndUpdate(
          { coupleID },
          { nextEvents: couple.nextEvents },
          { new: true }
        )
          .then(updatedCouple => {
            if (updatedCouple) {
              res.status(200).json({ nextEvents: updatedCouple.nextEvents });
            } else {
              console.log("Add event response: ", updatedCouple);
              res.status(400).json({ msg: "Add event to DB failed!" });
            }
          })
          .catch(err => {
            console.log("Add event err: ", err);
            res.status(400).json({ msg: "Add event to DB failed!" });
          });
      } else {
        console.log("Find couple response: ", couple);
        res.status(400).json({ msg: "Add event to DB failed!" });
      }
    })
    .catch(err => {
      console.log("Add event err: ", err);
      res.status(400).json("msg: Add event to DB failed!");
    });
});

// @route GET api/couple/:couple_id
// @desc Sync User couple Id
// @access Public
router.get("/", authMiddleware, (req, res) => {
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

module.exports = router;
