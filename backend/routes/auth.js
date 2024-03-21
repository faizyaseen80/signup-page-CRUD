const express = require("express");
const User = require("../model/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");

const JWT_SECRET = "Faizanisabad$boy";

// ROUTE 1: Create a User using: POST "/api/auth/createuser". No login required
router.post(
  "/createuser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be atleast 8 characters").isLength({
      min: 8,
    }),
  ],
  async (req, res) => {
    let success = false;
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }
    try {
      // Check whether the user with this email exists already
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        let success = false;
        return res
          .status(400)
          .json({
            success,
            error: "Sorry a user with this email already exists",
          });
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      // Create a new user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);

      // res.json(user)
      let success = true;
      res.json({ success, authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// ROUTE 2: Authenticate a User using: POST "/api/auth/login". No login required
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    let success = false;
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Cheack the weather user with this email already exist
    try {
      let user = await User.findOne({ email });
      if (!user) {
        success = false;
        return res
          .status(400)
          .json({ error: "Please try to login with correct credentials" });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        success = false;
        return res
          .status(400)
          .json({
            success,
            error: "Please try to login with correct credentials",
          });
      }

      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// ROUTE 3: Get loggedin User Details using: POST "/api/auth/getuser". Login required
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE 4: Update a User using: PUT "/api/auth/updateuser". Login required
router.put(
  "/updateuser/:id",
  fetchuser,
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be atleast 8 characters").isLength({ min: 8, }),
  ],
  async (req, res) => {
      const { name, email, password } = req.body;

      let success = false;
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }

    try {

      success = false;
      // Create a newUser object
      const newUser = {};
      if (name) {newUser.name = name};
      if (email) { newUser.email = email };
      if (password) {newUser.password = password;}

      // find the user to be update and update it
      let user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).send("Not Found");
      }
      success = false;
      // Ensure the user is authorized to update their profile
      if (user._id.toString() !== req.user.id) {
        return res.status(401).send("Not Allowed");
      }

      success = false;
      // Update the user
      user = await User.findByIdAndUpdate(
        req.params.id,
        { $set: newUser },
        { new: true }
      );
      success = true;
      res.json({ user });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// ROUTE 5: Delete a User using: DELETE "/api/auth/deleteuser". Login required

router.delete('/deleteuser/:id', fetchuser, async (req, res) => {
  try {
    
    // find the user to be delete
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send("Not Found");
    }
    success = false;
    // Ensure the user is authorized to delete their profile
    if (user._id.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    user = await User.findByIdAndDelete(req.params.id);
    res.json({ "Success": "User has been deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})


module.exports = router;
