const express = require("express");
const router = express.Router();
const { authenticate, authorize } = require("../middlewares/auth");
const { Roles } = require("../configs/constants");
const { Tenant, Agent } = Roles;
const {
  getPropertiesCounts,
  getTenantsCounts,
  getRentsCounts,
} = require("../controllers/dashboard");

/* API to fetch the analytical data for Properties */
router.get("/property", authenticate, authorize([Agent]), getPropertiesCounts);

/* API to fetch the analytical data for Tenants */
router.get("/tenant", authenticate, authorize([Agent]), getTenantsCounts);

/* API to fetch the analytical data for Rents */
router.get("/rent", authenticate, authorize([Agent]), getRentsCounts);

module.exports = router;
