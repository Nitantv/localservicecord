const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const {verifyToken} = require("./utils");
const jwt = require('jsonwebtoken');
dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser()); // ✅ Middleware to handle cookies

// Enable CORS for frontend requests
app.use(cors({
  origin: "http://localhost:3000", // Change this if your frontend runs on a different port
  credentials: true, // ✅ Allows cookies to be sent
}));

// Import authentication routes
const authRoutes = require("./routes/authRoutes");
const dashRoutes = require("./routes/dashRoutes");
app.use("/auth", authRoutes);
app.use("/dash", dashRoutes);
// Check if .env variables are loaded
if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  console.error("❌ Missing .env variables (MONGO_URI or JWT_SECRET)");
  process.exit(1); // Stop the server if environment variables are missing
}

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => {
  console.error("❌ MongoDB Connection Error:", err);
  process.exit(1); // Stop the server if DB connection fails
});

// 🔹 Middleware to Verify JWT Token


// 🔹 Protected Dashboard Route
/*app.get("/dashboard", verifyToken, (req, res) => {
  try{
  res.json({ message: `Welcome to Dashboard, ${req.user.username}!`, role: req.user.role });
  }
  catch(err)
  {
    console.log(err);
  }
});
*/
// 🔹 Logout Route (Clears Cookie)
app.post("/auth/logout", (req, res) => {
  res.clearCookie("authToken");
  res.json({ message: "Logged out successfully" });
});

// Define a test route to check if the server is running
app.get("/", (req, res) => {
  res.send("🚀 Server is running!");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
