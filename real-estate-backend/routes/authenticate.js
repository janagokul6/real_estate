const express = require("express");
const router = express.Router();
const { home, login } = require("../controllers/authenticate");

/* Hpme Page API */
router.get("/", home);

/* Login API */
router.post("/login", login);

module.exports = router;
