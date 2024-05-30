const mongoose = require("mongoose");

const kpiSchema = new mongoose.Schema({
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: "Property" }, // Reference to Property collection
  kpiType: { type: String, required: true }, // e.g., "Occupancy Rate", "Rental Income", "Maintenance Costs"
  value: { type: Number },
  createdDate: {
    type: Date,
    default: Date.now, // Set the default value to the current date and time
  },
});

const KPI = mongoose.model("KPI", kpiSchema);

module.exports = KPI;
