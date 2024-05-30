const mongoose = require("mongoose");

// schema for financial reporting

/* 
    This schema will handle financial reporting, 
    including profit and loss statements, 
    balance sheets, and cash flow analysis. 
*/
const financialReportSchema = new mongoose.Schema({
  type: { type: String, enum: ["profitLoss", "balanceSheet", "cashFlow"] },
  fromDate: { type: Date, required: true },
  toDate: { type: Date, required: true },
  data: { type: Object, default: {} }, // JSON object to store financial data
});

const FinancialReport = mongoose.model(
  "FinancialReport",
  financialReportSchema
);

module.exports = FinancialReport;
