// models/Property.js
const mongoose = require("mongoose");

const propertieschema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    images: [{ type: Object, default: {} }],
    street: {
      type: String,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    pin: {
      type: Number,
      required: true,
    },
    lat: {
      type: String,
    },
    long: {
      type: String,
    },
    status: {
      type: String,
      enum: ["available", "rented", "under maintenance", "sold"],
      default: "available",
    },
  },
  { timestamps: true }
);

const Property = mongoose.model("Property", propertieschema);

module.exports = Property;
