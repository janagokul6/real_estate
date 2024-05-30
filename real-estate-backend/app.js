const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

require("./models/connection");
require("./middlewares/redis");
// require("./routes/index");
const routes = require("./routes/index");
const app = express();
const cors = require("cors");
const fileUpload = require("express-fileupload");

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false, limit: "50mb" }));
app.use(upload.array("files", 5));
app.use(cors());
app.use(cookieParser());
app.use("/", routes);
app.use(express.static(path.join(__dirname, "public")));
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
