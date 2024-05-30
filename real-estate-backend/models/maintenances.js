const mongoose = require("mongoose");

const maintenancesSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
    },
    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    description: {
      type: String,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    priority: {
      type: String,
      enum: ["high", "medium", "low"],
    },
    status: {
      type: String,
      enum: ["pending", "assigned", "in_progress", "completed"],
    },
  },
  { timestamps: true }
);

const maintenances = mongoose.model("maintenances", maintenancesSchema);

module.exports = maintenances;
