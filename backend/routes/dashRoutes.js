const express = require("express");
const User = require("../models/User");
const {verifyToken} = require("../utils"); // ✅ Import verifyToken
const router = express.Router();

// Fetch addresses of the logged-in user
router.get("/user/addresses", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const addresses = [user.address, user.address2, user.address3].filter(Boolean);
    res.json({ addresses });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Add this to your existing router file (e.g., dash.js)
router.post("/user/add-address", verifyToken, async (req, res) => {
  const { newAddress } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      console.log(err);
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.address2) {
      user.address2 = newAddress;
    } else if (!user.address3) {
      user.address3 = newAddress;
    } else {
      return res.status(400).json({ message: "Maximum of 3 addresses allowed" });
    }

    await user.save();
    res.status(200).json({ message: "Address added successfully" });
  } catch (err) {
    console.error("Error adding address:", err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
