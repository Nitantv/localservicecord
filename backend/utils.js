const jwt = require('jsonwebtoken');
module.exports.verifyToken = (req, res, next) => {
  try{   console.log(res.cookies);
    const token = req.cookies.jwtToken?.token; // ✅ Read token from cookies
    if (!token) return res.status(401).json({ message: "Unauthorized! Please log in." });
  
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log(err);
        return res.status(403).json({ message: "Invalid or expired token!" });
      }
      req.user = decoded; // Store user info in request
      next();
    });
  }
  catch(err)
  {
    console.log(err);
  }
  };

