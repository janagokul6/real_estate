require("dotenv").config();
const KPI = require("../models/kpis");

/* This API method returns the details of a specific kpi */
const getKPI = async (req, res, next) => {
  try {
    const { id } = req.params;
    const kpiDetails = await KPI.findOne({ _id: id });
    const kpi = kpiDetails ? kpiDetails : null;

    return res.status(200).json({ data: { kpi } });
  } catch (error) {
    console.log("Error while fetching the details of the kpi : ", error);
    return res.status(500).json({
      message: "Failed to get the details of the kpi",
      error,
    });
  }
};

/* This API method return the list of all the kpis from the DB */
const getAllKPIs = async (req, res, next) => {
  try {
    const kpisList = await KPI.find();
    const kpis = kpisList ? kpisList : [];

    return res.status(200).json({ data: { kpis } });
  } catch (error) {
    console.log("Error while fetching the List of the kpis : ", error);
    return res
      .status(500)
      .json({ message: "Failed to get the List of the kpis", error });
  }
};

/* This API method adds the new kpi to the DB */
const addKPI = async (req, res, next) => {
  try {
    const kpiData = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingKPI = await KPI.findOne({
      propertyId: kpiData.propertyId,
      kpiType: kpiData.kpiType,
      createdDate: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      },
    });

    if (existingKPI)
      return res.status(400).json({
        message: "KPI with same data already exists!",
      });

    const kpiDetails = new KPI(kpiData);
    const kpiCreated = await kpiDetails.save();
    const kpi = kpiCreated ? kpiCreated : {};

    return res.status(201).json({ data: { kpi } });
  } catch (error) {
    console.log("Error while adding the kpi to the Database : ", error);
    return res.status(500).json({
      message: "Failed to add the kpi to the Database",
      error,
    });
  }
};

/* This API method update the kpi to the DB */
const updateKPI = async (req, res, next) => {
  const kpiId = req.params.id;
  const updateData = req.body;
  const { value } = updateData;

  try {
    // Update the kpi in the database
    const updatedKPI = await KPI.findByIdAndUpdate(
      kpiId,
      { value },
      {
        new: true,
      }
    );

    if (!updatedKPI) {
      return res.status(400).json({ message: "KPI not found" });
    }

    res.status(200).json({ data: { updatedKPI } }); // Send the updated kpi as response
  } catch (error) {
    console.error("Error updating kpi:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* This API method to dlete the kpi from the DB */
const deleteKPI = async (req, res, next) => {
  const kpiId = req.params.id;
  try {
    // Find the kpi by ID and delete
    const deletedKPI = await KPI.findByIdAndDelete(kpiId);

    if (!deletedKPI) {
      return res.status(400).json({ message: "KPI not found" });
    }

    res.status(200).json({
      data: {
        message: "KPI deleted successfully",
        deletedKPI,
      },
    });
  } catch (error) {
    console.error("Error deleting kpi:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  addKPI,
  updateKPI,
  getKPI,
  getAllKPIs,
  deleteKPI,
};
