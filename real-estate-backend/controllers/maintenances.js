require("dotenv").config();
const Maintenance = require("../models/maintenances");

/* This API method returns the details of a specific maintenance */
const getMaintenance = async (req, res, next) => {
  try {
    const { id } = req.params;
    const maintenanceDetails = await Maintenance.findOne({ _id: id })
      .populate({
        path: "property",
        select: "title",
      })
      .populate({ path: "agent", select: "name" })
      .populate({ path: "assignedTo", select: "name" });
    const maintenance = maintenanceDetails ? maintenanceDetails : null;

    return res.status(200).json({ data: { maintenance } });
  } catch (error) {
    console.log(
      "Error while fetching the details of the maintenance : ",
      error
    );
    return res.status(500).json({
      message: "Failed to get the details of the maintenance",
      error,
    });
  }
};

/* This API method return the list of all the maintenances from the DB */
const getAllMaintenances = async (req, res, next) => {
  try {
    const maintenancesList = await Maintenance.find()
      .populate({
        path: "property",
        select: "title",
      })
      .populate({ path: "agent", select: "name" })
      .populate({ path: "assignedTo", select: "name" });
    const maintenances = maintenancesList ? maintenancesList : [];

    return res.status(200).json({ data: { maintenances } });
  } catch (error) {
    console.log("Error while fetching the List of the maintenances : ", error);
    return res
      .status(500)
      .json({ message: "Failed to get the List of the maintenances", error });
  }
};

/* This API method adds the new maintenance to the DB */
const addMaintenance = async (req, res, next) => {
  try {
    const maintenanceData = req.body;
    const agent = req.user._id;
    maintenanceData.agent = agent;
    const maintenanceDetails = new Maintenance(maintenanceData);
    const maintenanceCreated = await maintenanceDetails.save();
    const maintenance = maintenanceCreated ? maintenanceCreated : {};

    return res.status(201).json({ data: { maintenance } });
  } catch (error) {
    console.log("Error while adding the maintenance to the Database : ", error);
    return res.status(500).json({
      message: "Failed to add the maintenance to the Database",
      error,
    });
  }
};

/* This API method update the maintenance to the DB */
const updateMaintenance = async (req, res, next) => {
  const maintenanceId = req.params.id;
  const updateData = req.body;

  try {
    // Update the maintenance in the database
    const updatedMaintenance = await Maintenance.findByIdAndUpdate(
      maintenanceId,
      updateData,
      {
        new: true,
      }
    );

    if (!updatedMaintenance) {
      return res.status(400).json({ message: "Maintenance not found" });
    }

    res.status(200).json({ data: { updatedMaintenance } }); // Send the updated maintenance as response
  } catch (error) {
    console.error("Error updating maintenance:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* This API method to dlete the maintenance from the DB */
const deleteMaintenance = async (req, res, next) => {
  const maintenanceId = req.params.id;
  try {
    // Find the maintenance by ID and delete
    const deletedMaintenance = await Maintenance.findByIdAndDelete(
      maintenanceId
    );

    if (!deletedMaintenance) {
      return res.status(400).json({ message: "Maintenance not found" });
    }

    res.status(200).json({
      data: {
        message: "Maintenance deleted successfully",
        deletedMaintenance,
      },
    });
  } catch (error) {
    console.error("Error deleting maintenance:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  addMaintenance,
  updateMaintenance,
  getMaintenance,
  getAllMaintenances,
  deleteMaintenance,
};
