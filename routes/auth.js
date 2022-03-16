const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const res = require("express/lib/response");
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');


const JWT_SECRET="myJWTSecrettt"

// Create a User using: POST "/api/auth/createuser" . No login required
router.post(
  "/createuser",
  [
    body("email", "Enter a Valid Email").isEmail(),
    body("name", "Enter a Valid Name").isLength({ min: 3 }),
    body("password", "Pasword Must be atleast 5 chracters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    // If there are errors, return the bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check whether the user with this email exists already
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ error: "Sorry a user with this email already exists" });
      }
      const salt= await bcrypt.genSalt(10)
      secPass= await bcrypt.hash(req.body.password,salt);
      //Create a New user
      user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      });
      
      const data={
          user:{
              id:user.id
          }
      }
      const authtoken=jwt.sign(data, JWT_SECRET);

      res.json({authtoken});
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some error occured");
    }
  }
);
module.exports = router;
