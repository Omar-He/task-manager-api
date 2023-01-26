const Task = require("../models/Task");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

// get all tasks for the logged in user
const getAllTasks = async (req, res) => {
  const tasks = await Task.find({ createdBy: req.user.userId }).sort(
    "createdAt"
  );
  res.status(StatusCodes.OK).json({ tasks, count: tasks.length });
};

// create new task
const createTask = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const task = await Task.create(req.body);
  res.status(StatusCodes.CREATED).json({ task });
};

// get a specific task
const getTask = async (req, res) => {
  const {
    user: { userId },
    params: { id: taskID },
  } = req;

  const task = await Task.findOne({
    _id: taskID,
    createdBy: userId,
  });
  if (!task) {
    throw new NotFoundError(`No task with id ${taskID}`);
  }

  res.status(StatusCodes.OK).json({ task });
};

// delete a task
const deleteTask = async (req, res) => {
  const {
    user: { userId },
    params: { id: taskID },
  } = req;

  const task = await Task.findByIdAndRemove({
    _id: taskID,
    createdBy: userId,
  });
  if (!task) {
    throw new NotFoundError(`No task with id ${taskID}`);
  }
  res.status(StatusCodes.OK).send("The task has been deleted successfully");
};

// update a task
const updateTask = async (req, res) => {
  const {
    body: { name },
    user: { userId },
    params: { id: taskID },
  } = req;

  if (name === "") {
    throw new BadRequestError("Name field cannot be empty");
  }
  const task = await Task.findByIdAndUpdate(
    { _id: taskID, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!task) {
    throw new NotFoundError(`No task with id ${taskID}`);
  }
  res.status(StatusCodes.OK).json({ task });
};

module.exports = {
  getAllTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
};
