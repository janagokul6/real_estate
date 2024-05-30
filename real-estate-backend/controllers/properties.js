require("dotenv").config();
const Property = require("../models/properties");

/* This API method returns the details of a specific property */
const getProperty = async (req, res, next) => {
  try {
    const { id } = req.params;
    const propertyDetails = await Property.findOne({ _id: id });
    const property = propertyDetails ? propertyDetails : null;

    return res.status(200).json({ data: { property } });
  } catch (error) {
    console.log("Error while fetching the details of the property : ", error);
    return res
      .status(500)
      .json({ message: "Failed to get the details of the property", error });
  }
};

/* This API method return the list of all the properties from the DB */
const getAllProperties = async (req, res, next) => {
  try {
    const propertiesList = await Property.find();
    const properties = propertiesList ? propertiesList : [];

    return res.status(200).json({ data: { properties } });
  } catch (error) {
    console.log("Error while fetching the List of the properties : ", error);
    return res
      .status(500)
      .json({ message: "Failed to get the List of the properties", error });
  }
};

/* This API method adds the new property to the DB */
const addProperty = async (req, res, next) => {
  try {
    const propertyData = req.body;
    const files = req.files;
    const existingProperty = await Property.findOne({
      title: propertyData.title,
    });
    if (existingProperty)
      return res.status(400).json({
        message: "Property with same title already exists!",
      });

    if (files) {
      const images = files.map((file) => {
        const { originalname, mimetype, buffer } = file;
        const image = {
          name: originalname,
          type: mimetype,
          data: buffer,
        };
        return image;
      });

      propertyData.images = images;
    }
    const propertyDetails = new Property(propertyData);
    const propertyCreated = await propertyDetails.save();
    const property = propertyCreated ? propertyCreated : {};

    return res.status(201).json({ data: { property } });
  } catch (error) {
    console.log("Error while adding the property to the Database : ", error);
    return res
      .status(500)
      .json({ message: "Failed to add the property to the Database", error });
  }
};

/* This API method update the property to the DB */
const updateProperty = async (req, res, next) => {
  const propertyId = req.params.id;
  const updateData = req.body;
  const files = req.files;

  // Update the code for concating the images
  try {
    // const images = files.map((file) => {
    //   const { originalname, mimetype, buffer } = file;
    //   const image = {
    //     name: originalname,
    //     type: mimetype,
    //     data: buffer,
    //   };
    //   return image;
    // });

    // updateData.images = images;

    // Update the property in the database
    const updatedProperty = await Property.findByIdAndUpdate(
      propertyId,
      updateData,
      {
        new: true,
      }
    );

    if (!updatedProperty) {
      return res.status(400).json({ message: "Property not found" });
    }

    res.status(200).json({ data: { updatedProperty } }); // Send the updated property as response
  } catch (error) {
    console.error("Error updating property:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* This API method to dlete the property from the DB */
const deleteProperty = async (req, res, next) => {
  const propertyId = req.params.id;
  try {
    // Find the property by ID and delete
    const deletedProperty = await Property.findByIdAndDelete(propertyId);

    if (!deletedProperty) {
      return res.status(400).json({ message: "Property not found" });
    }

    res.status(200).json({
      data: { message: "Property deleted successfully", deletedProperty },
    });
  } catch (error) {
    console.error("Error deleting property:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  addProperty,
  updateProperty,
  getProperty,
  getAllProperties,
  deleteProperty,
};
