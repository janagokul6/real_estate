const express = require("express");
const router = express.Router();
const {
  getExpense,
  getAllExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
} = require("../controllers/expenses");
const { authenticate, authorize } = require("../middlewares/auth");
const { Roles } = require("../configs/constants");
const { Tenant, Agent } = Roles;

/*
Get the details of a specific Expense(Accessable to All(Expense + Admin))
An API with Authentication & Role-based Autorization
*/
router.get("/:id", authenticate, authorize([Agent]), getExpense);

/*
Get the list of all the Expenses(Accessable to Agent Only)
An API with Authentication & Role-based Autorization
*/
router.get("/", authenticate, authorize([Agent]), getAllExpenses);

/*
Add the properties(Agent) to the DB
An API 'Without' Authentication & Role-based Autorization
*/
router.post("/", authenticate, authorize([Agent]), addExpense);

/*
Update Expense
An API with Authentication & Role-based Autorization
*/
router.patch("/:id", authenticate, authorize([Agent]), updateExpense);

/*
    Delete Expense
    An API with Authentication & Role-based Autorization
*/
router.delete("/:id", authenticate, authorize([Agent]), deleteExpense);

module.exports = router;
