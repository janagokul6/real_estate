const express = require("express");
const router = express.Router();
const {
  getProperty,
  getAllProperties,
  addProperty,
  updateProperty,
  deleteProperty,
} = require("../controllers/properties");
const { authenticate, authorize } = require("../middlewares/auth");
const { Roles } = require("../configs/constants");
const { Tenant, Agent } = Roles;

/*
Get the details of a specific Property(Accessable to All(Property + Admin))
An API with Authentication & Role-based Autorization
*/
router.get("/:id", authenticate, authorize([Agent]), getProperty);

/*
Get the list of all the Properties(Accessable to Agent Only)
An API with Authentication & Role-based Autorization
*/
router.get("/", authenticate, authorize([Agent]), getAllProperties);

/*
Add the properties(Agent) to the DB
An API 'Without' Authentication & Role-based Autorization
*/
router.post("/", authenticate, authorize([Agent]), addProperty);

/*
Update Property
An API with Authentication & Role-based Autorization
*/
router.patch("/:id", authenticate, authorize([Agent]), updateProperty);

/*
    Delete Property
    An API with Authentication & Role-based Autorization
*/
router.delete("/:id", authenticate, authorize([Agent]), deleteProperty);

module.exports = router;
