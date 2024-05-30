require("dotenv").config();
const mongoose = require("mongoose");
const { MONGODB_URL } = process.env;
const mongoDB_URL = `${MONGODB_URL}/real-estate?retryWrites=true&w=majority`;

mongoose
  .connect(mongoDB_URL)
  .then(() => console.log("Database connected"))
  .catch((err) => console.log("Error while connecting Database : ", err));
