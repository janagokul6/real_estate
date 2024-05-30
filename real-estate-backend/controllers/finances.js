require("dotenv").config();
const Finance = require("../models/finances");

/* This API method returns the details of a specific finance */
const getFinance = async (req, res, next) => {
  try {
    const { id } = req.params;
    const financeDetails = await Finance.findOne({ _id: id });
    const finance = financeDetails ? financeDetails : null;

    return res.status(200).json({ data: { finance } });
  } catch (error) {
    console.log("Error while fetching the details of the finance : ", error);
    return res.status(500).json({
      message: "Failed to get the details of the finance",
      error,
    });
  }
};

/* This API method return the list of all the finances from the DB */
const getAllFinances = async (req, res, next) => {
  try {
    const financesList = await Finance.find();
    const finances = financesList ? financesList : [];

    return res.status(200).json({ data: { finances } });
  } catch (error) {
    console.log("Error while fetching the List of the finances : ", error);
    return res
      .status(500)
      .json({ message: "Failed to get the List of the finances", error });
  }
};

/* This API method adds the new finance to the DB */
const addFinance = async (req, res, next) => {
  try {
    const financeData = req.body;
    const financeDetails = new Finance(financeData);
    const financeCreated = await financeDetails.save();
    const finance = financeCreated ? financeCreated : {};

    return res.status(201).json({ data: { finance } });
  } catch (error) {
    console.log("Error while adding the finance to the Database : ", error);
    return res.status(500).json({
      message: "Failed to add the finance to the Database",
      error,
    });
  }
};

/* This API method update the finance to the DB */
const updateFinance = async (req, res, next) => {
  const financeId = req.params.id;
  const updateData = req.body;

  try {
    // Update the finance in the database
    const updatedFinance = await Finance.findByIdAndUpdate(
      financeId,
      updateData,
      {
        new: true,
      }
    );

    if (!updatedFinance) {
      return res.status(400).json({ message: "Finance not found" });
    }

    res.status(200).json({ data: { updatedFinance } }); // Send the updated finance as response
  } catch (error) {
    console.error("Error updating finance:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* This API method to dlete the finance from the DB */
const deleteFinance = async (req, res, next) => {
  const financeId = req.params.id;
  try {
    // Find the finance by ID and delete
    const deletedFinance = await Finance.findByIdAndDelete(financeId);

    if (!deletedFinance) {
      return res.status(400).json({ message: "Finance not found" });
    }

    res.status(200).json({
      data: {
        message: "Finance deleted successfully",
        deletedFinance,
      },
    });
  } catch (error) {
    console.error("Error deleting finance:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  addFinance,
  updateFinance,
  getFinance,
  getAllFinances,
  deleteFinance,
};
