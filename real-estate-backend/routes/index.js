const express = require("express");
const router = express.Router();

// Import route files
const homeRoutes = require("./authenticate");
const dashBoardRoutes = require("./dashboard");
const userRoutes = require("./users");
const tenantsRoutes = require("./tenants");
const propertiesRoutes = require("./properties");
const rentsRoutes = require("./rents");
const maintenancesRoutes = require("./maintenances");
const expensesRoutes = require("./expenses");
const financesRoutes = require("./finances");
const documentsRoutes = require("./documents");
const kpisRoutes = require("./kpis");

// Using all routes
router.use("/", homeRoutes);
router.use("/dashboard", dashBoardRoutes);
router.use("/user", userRoutes);
router.use("/tenant", tenantsRoutes);
router.use("/property", propertiesRoutes);
router.use("/rent", rentsRoutes);
router.use("/maintenance", maintenancesRoutes);
router.use("/expense", expensesRoutes);
router.use("/finance", financesRoutes);
router.use("/document", documentsRoutes);
router.use("/kpi", kpisRoutes);

module.exports = router;
