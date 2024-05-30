require("dotenv").config();
const User = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secret = process.env.ACCESS_TOKEN_SECRET;

/* GET home page. */
const home = (req, res, next) => {
  return res.render("index", { title: "Real-Estate" });
};

/* 
  This API method is used to do the basic authentication
  and sends the OTP/OTP_URI to the client using speakeasy
*/
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const userDetails = await User.findOne({ email });
    if (!userDetails) return res.status(500).json({ message: "Invalid User" });

    /* Password Comparison */
    const hashed_password = userDetails.password;
    const valid_user = await bcrypt.compare(password, hashed_password);
    if (valid_user !== true)
      return res.status(401).json({ message: "Invalid Email and/or Password" });
    /* Password Comparison */

    const payload = {
      _id: userDetails._id,
      email: userDetails.email,
      role: userDetails.role,
    };

    const accessToken = jwt.sign(payload, secret, { expiresIn: "1h" });
    res.cookie("token", accessToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return res.status(200).json({
      success: true,
      data: { token: accessToken, _id: userDetails._id },
      message: "Login successfull!",
    });
  } catch (error) {
    console.log("Error while doing login : ", error);
    return res.status(500).json({ message: error });
  }
};

module.exports = {
  home,
  login,
};
