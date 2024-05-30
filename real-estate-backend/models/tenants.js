// models/Tenant.js
const mongoose = require("mongoose");

const tenantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
    },

    documents: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
    },
    rentStatus: {
      type: String,
      enum: ["paid", "due"],
      default: "due",
    },
    agreement: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Tenant = mongoose.model("Tenant", tenantSchema);

module.exports = Tenant;
