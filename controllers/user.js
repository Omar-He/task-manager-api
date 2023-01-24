const User = require("../models/User");

const createUser = async (req, res) => {
  console.log("here");
  try {
    const user = new User(req.body);
    console.log(user);
    await user.save();
    res.status(201).json({ user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    const { id: userID } = req.params;
    const user = await User.findOne({ _id: userID });
    if (!user) {
      return res.status(404).json({ message: `No user with id: ${userID}` });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id: userID } = req.params;
    const user = await User.findOneAndUpdate({ _id: userID }, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return res.status(404).json({ message: `No user with id: ${userID}` });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id: userID } = req.params;
    const user = await User.findOneAndDelete({ _id: userID });
    if (!user) {
      return res.status(404).json({ message: `No user with id: ${userID}` });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
};

// In this example, I've created a set of functions that handle different CRUD operations for the User model.
// - `createUser` function that creates a new user and saves it to the database.
// - `getAllUsers` function that retrieves all users from the database.
// - `getUser` function that retrieves a specific user by ID from the database.
// - `updateUser` function that updates an existing user in the database.
// - `deleteUser` function that deletes a specific user from the database.

// Each function handle the error that could happen during the operation and return appropriate status codes and message.

// You will need to import these functions in your routes file and assign them to the corresponding endpoints.
