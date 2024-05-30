require("dotenv").config();
const User = require("../models/users");
const bcrypt = require("bcrypt");
const { Roles } = require("../configs/constants");

/* This API method returns the details of a specific user */
const getUser = async (req, res, next) => {
  try {
    let { id } = req.params;
    if (id == "null") id = req.user._id;

    const userDetails = await User.findOne({ _id: id });
    const user = userDetails ? userDetails : null;

    return res.status(200).json({ data: { user } });
  } catch (error) {
    console.log("Error while fetching the details of the user : ", error);
    return res
      .status(500)
      .json({ message: "Failed to get the details of the user", error });
  }
};

/* This API method return the list of all the users from the DB */
const getAllUsers = async (req, res, next) => {
  try {
    const currentUserId = req.user._id;
    const query = { _id: { $ne: currentUserId } };
    const type = req.query.type || null;
    if (type) {
      if (type == 1) query.role = Roles.Agent;
      if (type == 2) query.role = Roles.Contractor;
    }

    const usersList = await User.find(query);
    const users = usersList ? usersList : [];

    return res.status(200).json({ data: { users } });
  } catch (error) {
    console.log("Error while fetching the List of the users : ", error);
    return res
      .status(500)
      .json({ message: "Failed to get the List of the users", error });
  }
};

/* This API method adds the new user/agent to the DB */
const addAgent = async (req, res, next) => {
  try {
    const userData = req.body;
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser)
      return res.status(400).json({
        message: "User(Agent) with same email already exists!",
      });

    /* Hashing of password(plain) */
    const hashed_password = await bcrypt.hash(userData.password, 10);
    userData.password = hashed_password;
    /* Hashing of password(plain) */

    const userDetails = new User(userData);
    const userCreated = await userDetails.save();
    const user = userCreated ? userCreated : {};

    /* Removing the password before adding user data into in-memory DB */
    delete userData.password;
    /* Removing the password before adding user data into in-memory DB */

    // await global.redis_client.set(`${user._id}`, JSON.stringify(userData));

    return res.status(201).json({ data: { user } });
  } catch (error) {
    console.log("Error while adding the user to the Database : ", error);
    return res
      .status(500)
      .json({ message: "Failed to add the user to the Database", error });
  }
};

/* This API method adds the new user/contractor to the DB */
const addContractor = async (req, res, next) => {
  try {
    const userData = req.body;
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser)
      return res.status(400).json({
        message: "User(Agent) with same email already exists!",
      });

    /* Hashing of password(plain) */
    const hashed_password = await bcrypt.hash(userData.password, 10);
    userData.password = hashed_password;
    /* Hashing of password(plain) */

    const userDetails = new User(userData);
    const userCreated = await userDetails.save();
    const user = userCreated ? userCreated : {};

    /* Removing the password before adding user data into in-memory DB */
    delete userData.password;
    /* Removing the password before adding user data into in-memory DB */

    // await global.redis_client.set(`${user._id}`, JSON.stringify(userData));

    return res.status(201).json({ data: { user } });
  } catch (error) {
    console.log("Error while adding the user to the Database : ", error);
    return res
      .status(500)
      .json({ message: "Failed to add the user to the Database", error });
  }
};

/* This API method update the user to the DB */
const updateUser = async (req, res, next) => {
  const userId = req.params.id;
  const updateData = req.body;
  const { _id } = req.user || {};
  try {
    const { email, newPassword, oldPassword } = updateData;
    if (email) {
      return res.status(400).json({ message: "Email can't be updated" });
    }

    if (newPassword) {
      if (!oldPassword) {
        return res.status(400).json({
          message: "Please perovide 'Old Password', to update the passowrd",
        });
      }
      const userDetails = await User.findOne({ _id });
      if (!userDetails)
        return res.status(500).json({ message: "Invalid User" });

      const old_hashed_password = userDetails.password;
      const valid_user = await bcrypt.compare(oldPassword, old_hashed_password);
      if (valid_user !== true) {
        return res.status(400).json({ message: "Invalid Old Password" });
      } else {
        /* Hashing of password(plain) */
        const hashed_password = await bcrypt.hash(updateData.newPassword, 10);
        updateData.password = hashed_password;
        /* Hashing of password(plain) */
      }
    }

    // Update the user in the database
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(400).json({ message: "User not found" });
    }

    res.status(200).json({ data: { updatedUser } }); // Send the updated user as response
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* This API method to dlete the user from the DB */
const deleteUser = async (req, res, next) => {
  const userId = req.params.id;
  try {
    // Find the user by ID and delete
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(400).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ data: { message: "User deleted successfully", deletedUser } });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  addAgent,
  addContractor,
  updateUser,
  getUser,
  getAllUsers,
  deleteUser,
};
