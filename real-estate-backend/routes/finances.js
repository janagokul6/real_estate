const express = require("express");
const router = express.Router();
const {
  getFinance,
  getAllFinances,
  addFinance,
  updateFinance,
  deleteFinance,
} = require("../controllers/finances");
const { authenticate, authorize } = require("../middlewares/auth");
const { Roles } = require("../configs/constants");
const { Tenant, Agent } = Roles;

/*
Get the details of a specific Finance(Accessable to All(Finance + Admin))
An API with Authentication & Role-based Autorization
*/
router.get("/:id", authenticate, authorize([Agent]), getFinance);

/*
Get the list of all the Finances(Accessable to Agent Only)
An API with Authentication & Role-based Autorization
*/
router.get("/", authenticate, authorize([Agent]), getAllFinances);

/*
Add the properties(Agent) to the DB
An API 'Without' Authentication & Role-based Autorization
*/
router.post("/", authenticate, authorize([Agent]), addFinance);

/*
Update Finance
An API with Authentication & Role-based Autorization
*/
router.patch("/:id", authenticate, authorize([Agent]), updateFinance);

/*
    Delete Finance
    An API with Authentication & Role-based Autorization
*/
router.delete("/:id", authenticate, authorize([Agent]), deleteFinance);

module.exports = router;
