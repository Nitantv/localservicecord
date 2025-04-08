const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const {isLoggedIn} = require("../utils.js")
const router = express.Router();

// Signup Route
router.post('/signup', async (req, res) => {
  const { username, password, email, role, address } = req.body;
  console.log("Received signup request:", req.body); // ✅ Log incoming request

  if (!username || !password || !email || !role || !address) {
    console.error("❌ Missing Fields:", { username, password, email, role, address });
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      console.error("❌ User already exists:", username);
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("🔑 Hashed password:", hashedPassword);

    const newUser = new User({ username, password: hashedPassword, email, role, address });
    await newUser.save(); // This is the critical step!
    
    console.log("✅ User created successfully:", username);
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error("❌ Signup Error:", error);
    res.status(500).json({ message: 'Error signing up', error: error.message });
  }
});


// Login Route
router.post('/login', async (req, res) => {
  const { username, password, role } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
    console.log(role);
    console.log(user.role);
    if (user.role.toLowerCase() !== role.toLowerCase()) return res.status(400).json({ message: "Role mismatch" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).cookie("jwtToken",{token: token, role: user.role }).json({ message: "Login successful"});
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error logging in', error });
  }
});

const nodemailer = require("nodemailer");

// ✅ Function to Send Reset Email
const sendResetEmail = async (email, resetToken) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // 🔹 Your email
      pass: process.env.EMAIL_PASS, // 🔹 Your email app password
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset Request",
    text: `Click the link below to reset your password:\n\nhttp://localhost:3000/reset-password?token=${resetToken}`,
  };

  await transporter.sendMail(mailOptions);
};

// ✅ Updated Forgot Password Route
router.post("/forgot-password", async (req, res) => {
  const { username, role } = req.body;

  try {
    console.log("🔍 Searching for user with:", { username, role });

    const user = await User.findOne({ 
      username: username, 
      role: { $regex: new RegExp("^" + role + "$", "i") } // ✅ Case-insensitive match
    });

    if (!user) {
      console.log("❌ User not found in database!");
      return res.status(400).json({ message: "User not found!" });
    }

    console.log("✅ User found:", user);

    // ✅ Generate Reset Token
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });

    console.log("📩 Reset Token Generated:", resetToken);

    // ✅ Call the sendResetEmail function
    await sendResetEmail(user.email, resetToken);
    console.log("done");
    return res.status(200).json({ message: "Reset link sent to your email!" });

  } catch (error) {
    console.error("❌ Forgot Password Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});


router.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(400).json({ message: "User not found!" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password reset successful!" });
  } catch (error) {
    console.error("❌ Reset Password Error:", error);
    res.status(400).json({ message: "Invalid or expired token" });
  }
});
/*router.get("/verify", (req, res) => {
  console.log(req.cookies);
  const token = req.cookies.jwtToken.token; // ✅ Get JWT from cookies
  
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid Token" });
    }
    res.json({ message: "Authenticated", user: decoded });
  });
});*/
// Fetch addresses of the logged-in user

module.exports = router;
