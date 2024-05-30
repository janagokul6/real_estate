const express = require("express");
const router = express.Router();
const {
  getKPI,
  getAllKPIs,
  addKPI,
  updateKPI,
  deleteKPI,
} = require("../controllers/kpis");
const { authenticate, authorize } = require("../middlewares/auth");
const { Roles } = require("../configs/constants");
const { Tenant, Agent } = Roles;

/*
Get the details of a specific KPI(Accessable to All(KPI + Admin))
An API with Authentication & Role-based Autorization
*/
router.get("/:id", authenticate, authorize([Agent]), getKPI);

/*
Get the list of all the KPIs(Accessable to Agent Only)
An API with Authentication & Role-based Autorization
*/
router.get("/", authenticate, authorize([Agent]), getAllKPIs);

/*
Add the maintenances(Agent) to the DB
An API 'Without' Authentication & Role-based Autorization
*/
router.post("/", authenticate, authorize([Agent]), addKPI);

/*
Update KPI
An API with Authentication & Role-based Autorization
*/
router.patch("/:id", authenticate, authorize([Agent]), updateKPI);

/*
    Delete KPI
    An API with Authentication & Role-based Autorization
*/
router.delete("/:id", authenticate, authorize([Agent]), deleteKPI);

module.exports = router;
