const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "must provide name"],
    trim: true, //prevent spaces before and after the name
    maxlength: [20, "name can not be more than 20 characters"],
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

//Schema without validation
// {
//   name: String,
//   completed: Boolean,
// }

//To learn more about validation, check the mongoose documentation
//https://mongoosejs.com/docs/validation.html

module.exports = mongoose.model("Task", TaskSchema);
