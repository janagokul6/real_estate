require("dotenv").config();
const Tenant = require("../models/tenants");
const bcrypt = require("bcrypt");

/* This API method returns the details of a specific tenant */
const getTenant = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tenantDetails = await Tenant.findOne({ _id: id });
    const tenant = tenantDetails ? tenantDetails : null;

    return res.status(200).json({ data: { tenant } });
  } catch (error) {
    console.log("Error while fetching the details of the tenant : ", error);
    return res
      .status(500)
      .json({ message: "Failed to get the details of the tenant", error });
  }
};

/* This API method return the list of all the tenants from the DB */
const getAllTenants = async (req, res, next) => {
  try {
    const currentTenantId = req.user._id;

    const tenantsList = await Tenant.find({ _id: { $ne: currentTenantId } });
    const tenants = tenantsList ? tenantsList : [];

    return res.status(200).json({ data: { tenants } });
  } catch (error) {
    console.log("Error while fetching the List of the tenants : ", error);
    return res
      .status(500)
      .json({ message: "Failed to get the List of the tenants", error });
  }
};

/* This API method adds the new tenant/agent to the DB */
const addTenant = async (req, res, next) => {
  try {
    const tenantData = req.body;
    const existingTenant = await Tenant.findOne({ email: tenantData.email });
    if (existingTenant)
      return res.status(400).json({
        message: "Tenant(Tenant) with same email already exists!",
      });

    /* Hashing of password(plain) */
    // const hashed_password = await bcrypt.hash(tenantData.password, 10);
    // tenantData.password = hashed_password;
    /* Hashing of password(plain) */

    const tenantDetails = new Tenant(tenantData);
    const tenantCreated = await tenantDetails.save();
    const tenant = tenantCreated ? tenantCreated : {};

    /* Removing the password before adding tenant data into in-memory DB */
    // delete tenantData.password;
    /* Removing the password before adding tenant data into in-memory DB */

    // await global.redis_client.set(`${tenant._id}`, JSON.stringify(tenantData));

    return res.status(201).json({ data: { tenant } });
  } catch (error) {
    console.log("Error while adding the tenant to the Database : ", error);
    return res
      .status(500)
      .json({ message: "Failed to add the tenant to the Database", error });
  }
};

/* This API method update the tenant to the DB */
const updateTenant = async (req, res, next) => {
  const tenantId = req.params.id;
  const updateData = req.body; // Assuming you're sending the updated tenant data in the request body
  try {
    const { email } = updateData;
    if (email) {
      return res.status(400).json({ message: "Email can't be updated" });
    }
    // Update the tenant in the database
    const updatedTenant = await Tenant.findByIdAndUpdate(tenantId, updateData, {
      new: true,
    });

    if (!updatedTenant) {
      return res.status(400).json({ message: "Tenant not found" });
    }

    res.status(200).json({ data: { updatedTenant } }); // Send the updated tenant as response
  } catch (error) {
    console.error("Error updating tenant:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* This API method to dlete the tenant from the DB */
const deleteTenant = async (req, res, next) => {
  const tenantId = req.params.id;
  try {
    // Find the tenant by ID and delete
    const deletedTenant = await Tenant.findByIdAndDelete(tenantId);

    if (!deletedTenant) {
      return res.status(400).json({ message: "Tenant not found" });
    }

    res.status(200).json({
      data: { message: "Tenant deleted successfully", deletedTenant },
    });
  } catch (error) {
    console.error("Error deleting tenant:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  addTenant,
  updateTenant,
  getTenant,
  getAllTenants,
  deleteTenant,
};
