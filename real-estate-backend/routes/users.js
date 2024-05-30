const express = require("express");
const router = express.Router();
const {
  getUser,
  getAllUsers,
  addAgent,
  updateUser,
  deleteUser,
  addContractor,
} = require("../controllers/users");
const { authenticate, authorize } = require("../middlewares/auth");
const { Roles } = require("../configs/constants");
const { Tenant, Agent } = Roles;

/*
Get the details of a specific User(Accessable to All(User + Admin))
An API with Authentication & Role-based Autorization
*/
router.get("/:id", authenticate, authorize([Agent]), getUser);

/*
Get the list of all the Users(Accessable to Agent Only)
An API with Authentication & Role-based Autorization
*/
router.get("/", authenticate, authorize([Agent]), getAllUsers);

/*
Add the users(Agent) to the DB
An API 'Without' Authentication & Role-based Autorization
*/
router.post("/", addAgent);

/*
Add the users(contractor) to the DB
An API 'Without' Authentication & Role-based Autorization
*/
router.post("/add-contractor", authenticate, authorize([Agent]), addContractor);

/*
Update User
An API with Authentication & Role-based Autorization
*/
router.patch("/:id", authenticate, authorize([Agent]), updateUser);

/*
    Delete User
    An API with Authentication & Role-based Autorization
*/
router.delete("/:id", authenticate, authorize([Agent]), deleteUser);

module.exports = router;
