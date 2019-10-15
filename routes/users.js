const auth = require("../middleware/auth");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User, validate } = require("../models/user");
const express = require("express");
const router = express.Router();

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");
  let newUser = { ...req.body };
  // bcrypt.genSalt(10, (err, salt) => {
  //   console.log(salt);
  //   newUser.password = bcrypt.hash(
  //     newUser.password,
  //     salt,
  //     async (err, hash) => {
  //       newUser.password = hash;

  //       user = await User.create(newUser);
  //       const token = user.generateAuthToken();
  //       res
  //         .header("x-auth-token", token)
  //         .send(_.pick(user, ["_id", "name", "email"]));
  //     }
  //   );
  // });
  const salt = await bcrypt.genSalt(10);
  newUser.password = await bcrypt.hash(newUser.password, salt);
  user = await User.create(newUser);
  const token = user.generateAuthToken();
  res
    .header("x-auth-token", token)
    .header("access-control-expose-headers", "x-auth-token")
    .send(_.pick(user, ["_id", "name", "email"]));
});

module.exports = router;

// user = new User(_.pick(req.body, ["name", "email", "password"]));
// console.log(user);
// bcrypt.genSalt(10, (err, salt) => {
//   console.log(salt);
//   newUser.password = bcrypt.hash(
//     newUser.password,
//     salt,
//     async (err, hash) => {
//       newUser.password = hash;

//       user = await User.create(newUser);
//       const token = user.generateAuthToken();
//       res
//         .header("x-auth-token", token)
//         .send(_.pick(user, ["_id", "name", "email"]));
//     }
//   );
// });

// const salt = await bcrypt.genSalt(10);
// newUser.password = await bcrypt.hash(newUser.password, salt);
// await User.create(newUser);
// res.status(200).json({ message: "success" });
