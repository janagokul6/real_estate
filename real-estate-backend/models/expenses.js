const mongoose = require("mongoose");

// schema for expense tracking
const expenseSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ["maintenance", "repairs", "utilities"],
    required: true,
  },
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Property",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  description: String,
});

const Expense = mongoose.model("Expense", expenseSchema);
module.exports = Expense;
