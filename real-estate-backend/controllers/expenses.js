require("dotenv").config();
const Expense = require("../models/expenses");

/* This API method returns the details of a specific expense */
const getExpense = async (req, res, next) => {
  try {
    const { id } = req.params;
    const expenseDetails = await Expense.findOne({ _id: id }).populate({
      path: "property",
      select: "title",
    });
    const expense = expenseDetails ? expenseDetails : null;

    return res.status(200).json({ data: { expense } });
  } catch (error) {
    console.log("Error while fetching the details of the expense : ", error);
    return res.status(500).json({
      message: "Failed to get the details of the expense",
      error,
    });
  }
};

/* This API method return the list of all the expenses from the DB */
const getAllExpenses = async (req, res, next) => {
  try {
    const expensesList = await Expense.find().populate({
      path: "property",
      select: "title",
    });
    const expenses = expensesList ? expensesList : [];

    return res.status(200).json({ data: { expenses } });
  } catch (error) {
    console.log("Error while fetching the List of the expenses : ", error);
    return res
      .status(500)
      .json({ message: "Failed to get the List of the expenses", error });
  }
};

/* This API method adds the new expense to the DB */
const addExpense = async (req, res, next) => {
  try {
    const expenseData = req.body;
    const expenseDetails = new Expense(expenseData);
    const expenseCreated = await expenseDetails.save();
    const expense = expenseCreated ? expenseCreated : {};

    return res.status(201).json({ data: { expense } });
  } catch (error) {
    console.log("Error while adding the expense to the Database : ", error);
    return res.status(500).json({
      message: "Failed to add the expense to the Database",
      error,
    });
  }
};

/* This API method update the expense to the DB */
const updateExpense = async (req, res, next) => {
  const expenseId = req.params.id;
  const updateData = req.body;
  const { category, amount, date } = updateData;

  try {
    // Update the expense in the database
    const updatedExpense = await Expense.findByIdAndUpdate(
      expenseId,
      { category, amount, date },
      {
        new: true,
      }
    );

    if (!updatedExpense) {
      return res.status(400).json({ message: "Expense not found" });
    }

    res.status(200).json({ data: { updatedExpense } }); // Send the updated expense as response
  } catch (error) {
    console.error("Error updating expense:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* This API method to dlete the expense from the DB */
const deleteExpense = async (req, res, next) => {
  const expenseId = req.params.id;
  try {
    // Find the expense by ID and delete
    const deletedExpense = await Expense.findByIdAndDelete(expenseId);

    if (!deletedExpense) {
      return res.status(400).json({ message: "Expense not found" });
    }

    res.status(200).json({
      data: {
        message: "Expense deleted successfully",
        deletedExpense,
      },
    });
  } catch (error) {
    console.error("Error deleting expense:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  addExpense,
  updateExpense,
  getExpense,
  getAllExpenses,
  deleteExpense,
};
