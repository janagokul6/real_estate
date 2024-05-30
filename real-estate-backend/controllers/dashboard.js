require("dotenv").config();
const Property = require("../models/properties");
const Tenant = require("../models/tenants");
const Rent = require("../models/rents");

/* This API method returns the counts of properties */
const getPropertiesCounts = async (req, res, next) => {
  try {
    const { id } = req.query;
    const [totalCounts, dateCountsVal, statusCountsVal] = await Promise.all([
      Property.countDocuments(),
      Property.aggregate([
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
      ]),
      Property.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    const dateCounts = dateCountsVal.map((count) => ({
      date: count._id,
      count: count.count,
    }));

    const statusCounts = statusCountsVal.map((count) => ({
      status: count._id,
      count: count.count,
    }));

    const data = {
      totalCounts,
      dateCounts,
      statusCounts,
    };

    return res.status(200).json({ data });
  } catch (error) {
    console.log("Error while fetching the details of the property : ", error);
    return res
      .status(500)
      .json({ message: "Failed to get the details of the property", error });
  }
};

/* This API method returns the counts of tenants*/
const getTenantsCounts = async (req, res, next) => {
  try {
    const { id } = req.query;
    const [totalCounts, dateCountsVal] = await Promise.all([
      Tenant.countDocuments(),
      Tenant.aggregate([
        {
          $group: {
            _id: { $month: "$createdAt" },
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    const dateCounts = dateCountsVal.map((count) => ({
      month: count._id,
      count: count.count,
    }));

    const data = {
      totalCounts,
      dateCounts,
    };

    return res.status(200).json({ data });
  } catch (error) {
    console.log("Error while fetching the details of the property : ", error);
    return res
      .status(500)
      .json({ message: "Failed to get the details of the property", error });
  }
};

/* This API method returns the counts of tenants*/
const getRentsCounts = async (req, res, next) => {
  try {
    const { id } = req.query;
    const [totalCounts, dateCountsVal] = await Promise.all([
      Rent.countDocuments(),
      Rent.aggregate([
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    const dateCounts = dateCountsVal.map((count) => ({
      date: count._id,
      count: count.count,
    }));

    const data = {
      totalCounts,
      dateCounts,
    };

    return res.status(200).json({ data });
  } catch (error) {
    console.log("Error while fetching the details of the property : ", error);
    return res
      .status(500)
      .json({ message: "Failed to get the details of the property", error });
  }
};

module.exports = {
  getPropertiesCounts,
  getTenantsCounts,
  getRentsCounts,
};
