require("dotenv").config();
const Rent = require("../models/rents");

/* This API method returns the details of a specific rent */
const getRent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const rentDetails = await Rent.findOne({ _id: id })
      .populate({
        path: "property",
        select: "title",
      })
      .populate({ path: "tenant", select: "name" });
    const rent = rentDetails ? rentDetails : null;

    return res.status(200).json({ data: { rent } });
  } catch (error) {
    console.log("Error while fetching the details of the rent : ", error);
    return res
      .status(500)
      .json({ message: "Failed to get the details of the rent", error });
  }
};

/* This API method return the list of all the rents from the DB */
const getAllRents = async (req, res, next) => {
  try {
    const rentsList = await Rent.find()
      .populate({
        path: "property",
        select: "title",
      })
      .populate({ path: "tenant", select: "name" });

    const rents = rentsList ? rentsList : [];

    return res.status(200).json({ data: { rents } });
  } catch (error) {
    console.log("Error while fetching the List of the rents : ", error);
    return res
      .status(500)
      .json({ message: "Failed to get the List of the rents", error });
  }
};

/* This API method adds the new rent to the DB */
const addRent = async (req, res, next) => {
  try {
    const rentData = req.body;
    const existingRent = await Rent.findOne({
      property: rentData.property,
      tenant: rentData.tenant,
    });
    if (existingRent)
      return res.status(400).json({
        message: "Rent with same property and same tenant, already exists!",
      });

    const { isPaid } = rentData;
    if (isPaid && isPaid == true) rentData.datePaid = Date.now();
    else rentData.datePaid = null;
    const rentDetails = new Rent(rentData);
    const rentCreated = await rentDetails.save();
    const rent = rentCreated ? rentCreated : {};

    return res.status(201).json({ data: { rent } });
  } catch (error) {
    console.log("Error while adding the rent to the Database : ", error);
    return res
      .status(500)
      .json({ message: "Failed to add the rent to the Database", error });
  }
};

/* This API method update the rent to the DB */
const updateRent = async (req, res, next) => {
  const rentId = req.params.id;
  const updateData = req.body; // Assuming you're sending the updated rent data in the request body
  try {
    const { isPaid } = updateData;
    if (isPaid && isPaid == true) updateData.datePaid = Date.now();
    else updateData.datePaid = null;

    // Update the rent in the database
    const updatedRent = await Rent.findByIdAndUpdate(rentId, updateData, {
      new: true,
    });

    if (!updatedRent) {
      return res.status(400).json({ message: "Rent not found" });
    }

    res.status(200).json({ data: { updatedRent } }); // Send the updated rent as response
  } catch (error) {
    console.error("Error updating rent:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* This API method to dlete the rent from the DB */
const deleteRent = async (req, res, next) => {
  const rentId = req.params.id;
  try {
    // Find the rent by ID and delete
    const deletedRent = await Rent.findByIdAndDelete(rentId);

    if (!deletedRent) {
      return res.status(400).json({ message: "Rent not found" });
    }

    res.status(200).json({
      data: { message: "Rent deleted successfully", deletedRent },
    });
  } catch (error) {
    console.error("Error deleting rent:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  addRent,
  updateRent,
  getRent,
  getAllRents,
  deleteRent,
};
