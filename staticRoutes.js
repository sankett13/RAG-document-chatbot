const express = require("express");
const User = require("./models/users"); // Assuming you have a User model defined in models/users.js
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const JWT_SECRET = "MDFNJGNJNDBFNJNJVNJCNCJ"; // Replace with your actual secret key

// Static route for serving a simple HTML page
router
  .route("/login")
  .get((req, res) => {
    res.render("login");
  })

  .post(async (req, res) => {
    const { email, password } = req.body;
    console.log("Login attempt with");
    const user = await User.findOne({ email, password });
    if (user) {
      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "Lax", // instead of None
        secure: false, // because you're not using HTTPS locally
      });
      console.log("Login successful, token generated:", token);
      res.json({
        success: true,
        message: "Login successful",
      });
    } else {
      res.status(401).send("Invalid email or password");
    }
  });

router
  .route("/register")
  .get((req, res) => {
    res.render("register");
  })
  .post(async (req, res) => {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).send("User already exists");
    }
    const newUser = await User.create({ name, email, password });
    if (newUser) {
      res.status(201).send("User registered successfully");
      res.redirect("/login");
    } else {
      res.status(500).send("Error registering user");
    }
  });

module.exports = router;
