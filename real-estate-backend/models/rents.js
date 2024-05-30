const mongoose = require("mongoose");

// schema for rent collection and invoicing
const rentSchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Property",
    required: true,
  },
  tenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tenant",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  category: {
    type: String,
    enum: ["monthly", "quarterly", "half-yearly", "yearly"],
    required: true,
  },
  datePaid: {
    type: Date,
    default: "",
  },
});

const Rent = mongoose.model("Rent", rentSchema);
module.exports = Rent;
