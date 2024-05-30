const express = require("express");
const router = express.Router();
const {
  addTenant,
  updateTenant, 
  getTenant,
  getAllTenants,
  deleteTenant,
} = require("../controllers/tenants");
const { authenticate, authorize } = require("../middlewares/auth");
const { Roles } = require("../configs/constants");
const { Tenant, Agent } = Roles;

/*
Get the details of a specific Tenant(Accessable to All(Tenant + Admin))
An API with Authentication & Role-based Autorization
*/
router.get("/:id", authenticate, authorize([Agent, Tenant]), getTenant);

/*
Get the list of all the Tenants(Accessable to Agent Only)
An API with Authentication & Role-based Autorization
*/
router.get("/", authenticate, authorize([Agent]), getAllTenants);

/*
Add the users(tenant) to the DB
An API 'Without' Authentication & Role-based Autorization
*/
router.post("/", authenticate, authorize([Agent]), addTenant);

/*
Update Tenant
An API with Authentication & Role-based Autorization
*/
router.patch("/:id", authenticate, authorize([Agent]), updateTenant);

/*
    Delete Tenant
    An API with Authentication & Role-based Autorization
*/
router.delete("/:id", authenticate, authorize([Agent]), deleteTenant);

module.exports = router;
