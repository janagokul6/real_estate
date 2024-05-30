const express = require("express");
const router = express.Router();
const {
  getDocument,
  getAllDocuments,
  addDocument,
  updateDocument,
  deleteDocument,
} = require("../controllers/documents");
const { authenticate, authorize } = require("../middlewares/auth");
const { Roles } = require("../configs/constants");
const { Tenant, Agent } = Roles;

/*
Get the details of a specific Document(Accessable to All(Document + Admin))
An API with Authentication & Role-based Autorization
*/
router.get("/:id", authenticate, authorize([Agent]), getDocument);

/*
Get the list of all the Documents(Accessable to Agent Only)
An API with Authentication & Role-based Autorization
*/
router.get("/", authenticate, authorize([Agent]), getAllDocuments);

/*
Add the properties(Agent) to the DB
An API 'Without' Authentication & Role-based Autorization
*/
router.post("/", authenticate, authorize([Agent]), addDocument);

/*
Update Document
An API with Authentication & Role-based Autorization
*/
router.patch("/:id", authenticate, authorize([Agent]), updateDocument);

/*
    Delete Document
    An API with Authentication & Role-based Autorization
*/
router.delete("/:id", authenticate, authorize([Agent]), deleteDocument);

module.exports = router;
