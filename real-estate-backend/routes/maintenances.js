const express = require("express");
const router = express.Router();
const {
  getMaintenance,
  getAllMaintenances,
  addMaintenance,
  updateMaintenance,
  deleteMaintenance,
} = require("../controllers/maintenances");
const { authenticate, authorize } = require("../middlewares/auth");
const { Roles } = require("../configs/constants");
const { Tenant, Agent } = Roles;

/*
Get the details of a specific Maintenance(Accessable to All(Maintenance + Admin))
An API with Authentication & Role-based Autorization
*/
router.get("/:id", authenticate, authorize([Agent]), getMaintenance);

/*
Get the list of all the Maintenances(Accessable to Agent Only)
An API with Authentication & Role-based Autorization
*/
router.get("/", authenticate, authorize([Agent]), getAllMaintenances);

/*
Add the maintenances(Agent) to the DB
An API 'Without' Authentication & Role-based Autorization
*/
router.post("/", authenticate, authorize([Agent]), addMaintenance);

/*
Update Maintenance
An API with Authentication & Role-based Autorization
*/
router.patch("/:id", authenticate, authorize([Agent]), updateMaintenance);

/*
    Delete Maintenance
    An API with Authentication & Role-based Autorization
*/
router.delete("/:id", authenticate, authorize([Agent]), deleteMaintenance);

module.exports = router;
