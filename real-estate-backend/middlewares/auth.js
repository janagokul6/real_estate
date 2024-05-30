require("dotenv").config();
const jwt = require("jsonwebtoken");
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

/* Middleware Method to provide authentication to the routes */

const authenticate = (req, res, next) => {
  const token = req.headers.authorization;
  // const token = req.cookies && req.cookies.token ? req.cookies.token : null;
  if (token) {
    jwt.verify(token, accessTokenSecret, (error, user) => {
      if (error) {
        console.log({ error });
        return res.status(403).json({ error });
      }

      req.user = user;
      next();
    });
  } else {
    return res.status(401).json({ error: "Not Authorized" });
  }
};

/* Middleware Method to provide role-based authorization to the routes */
const authorize = (roles = []) => {
  try {
    return (req, res, next) => {
      const { user } = req;
      if (user && roles.includes(user.role)) {
        // role is allowed, so continue on the next step
        next();
      } else {
        // user is forbidden(user's role is not having this access)
        return res.status(403).json({
          Error: "Forbidden: You are not authorized to access this resource",
        });
      }
    };
  } catch (error) {
    res
      .status(403)
      .json({ error: "You are not authorized to access this resource" });
  }
};
module.exports = { authenticate, authorize };
