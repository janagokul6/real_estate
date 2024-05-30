const express = require("express");
const router = express.Router();
const {
  getRent,
  getAllRents,
  addRent,
  updateRent,
  deleteRent,
  addContractor,
} = require("../controllers/rents");
const { authenticate, authorize } = require("../middlewares/auth");
const { Roles } = require("../configs/constants");
const { Tenant, Agent } = Roles;

/*
Get the details of a specific Rent(Accessable to All(Rent + Admin))
An API with Authentication & Role-based Autorization
*/
router.get("/:id", authenticate, authorize([Agent]), getRent);

/*
Get the list of all the Rents(Accessable to Agent Only)
An API with Authentication & Role-based Autorization
*/
router.get("/", authenticate, authorize([Agent]), getAllRents);

/*
Add the rents(Agent) to the DB
An API 'Without' Authentication & Role-based Autorization
*/
router.post("/", authenticate, authorize([Agent]), addRent);

/*
Update Rent
An API with Authentication & Role-based Autorization
*/
router.patch("/:id", authenticate, authorize([Agent]), updateRent);

/*
    Delete Rent
    An API with Authentication & Role-based Autorization
*/
router.delete("/:id", authenticate, authorize([Agent]), deleteRent);

module.exports = router;
