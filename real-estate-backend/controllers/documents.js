require("dotenv").config();
const Document = require("../models/documents");

/* This API method returns the details of a specific document */
const getDocument = async (req, res, next) => {
  try {
    const { id } = req.params;
    const documentDetails = await Document.findOne({ _id: id }).populate({
      path: "tenant",
      select: "name",
    });
    const document = documentDetails ? documentDetails : null;

    return res.status(200).json({ data: { document } });
  } catch (error) {
    console.log("Error while fetching the details of the document : ", error);
    return res.status(500).json({
      message: "Failed to get the details of the document",
      error,
    });
  }
};

/* This API method return the list of all the documents from the DB */
const getAllDocuments = async (req, res, next) => {
  try {
    const documentsList = await Document.find().populate({
      path: "tenant",
      select: "name",
    });
    const documents = documentsList ? documentsList : [];

    return res.status(200).json({ data: { documents } });
  } catch (error) {
    console.log("Error while fetching the List of the documents : ", error);
    return res
      .status(500)
      .json({ message: "Failed to get the List of the documents", error });
  }
};

/* This API method adds the new document to the DB */
const addDocument = async (req, res, next) => {
  try {
    const { title, file, category, tenant, accessPermissions = [] } = req.body;

    const permisssion = accessPermissions.concat([
      { userId: req.user._id, permissions: ["read"] },
    ]);
    const documentData = {
      title,
      file,
      category,
      tenant,
      accessPermissions: permisssion,
    };
    const documentDetails = new Document(documentData);
    const documentCreated = await documentDetails.save();
    const document = documentCreated ? documentCreated : {};

    return res.status(201).json({ data: { document } });
  } catch (error) {
    console.log("Error while adding the document to the Database : ", error);
    return res.status(500).json({
      message: "Failed to add the document to the Database",
      error,
    });
  }
};

/* This API method update the document to the DB */
const updateDocument = async (req, res, next) => {
  const documentId = req.params.id;
  const updateData = req.body;
  const { title, file, accessPermissions, category } = updateData;

  try {
    // Update the document in the database
    const updatedDocument = await Document.findByIdAndUpdate(
      documentId,
      { title, file, accessPermissions, category },
      {
        new: true,
      }
    );

    if (!updatedDocument) {
      return res.status(400).json({ message: "Document not found" });
    }

    res.status(200).json({ data: { updatedDocument } }); // Send the updated document as response
  } catch (error) {
    console.error("Error updating document:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* This API method to dlete the document from the DB */
const deleteDocument = async (req, res, next) => {
  const documentId = req.params.id;
  try {
    // Find the document by ID and delete
    const deletedDocument = await Document.findByIdAndDelete(documentId);

    if (!deletedDocument) {
      return res.status(400).json({ message: "Document not found" });
    }

    res.status(200).json({
      data: {
        message: "Document deleted successfully",
        deletedDocument,
      },
    });
  } catch (error) {
    console.error("Error deleting document:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  addDocument,
  updateDocument,
  getDocument,
  getAllDocuments,
  deleteDocument,
};
