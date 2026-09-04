const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

const protect = async (req, res, next) => {
  try {
    // 1. Cookie se token nikalo
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "Please login first",
      });
    }

    // 2. Token verify karo
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // 3. JWT ke userId se actual user nikalo
    const user = await User.findById(
      decoded.userId
    ).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    // 4. Request ke andar user attach kar diya
    req.user = user;

    // 5. Ab controller pe jao
    next();

  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

module.exports = protect;