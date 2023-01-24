const express = require("express");
const app = express();
const tasks = require("./routes/tasks");
const users = require("./routes/users");
const auth = require("./routes/auth");
const connectDB = require("./db/connect");
const notFound = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
const authMiddleware = require("./middleware/authMiddleware");

require("dotenv").config();

const PORT = process.env.PORT || 5000;

// middleware
app.use(express.static("./public")); //Static routes
app.use(express.json());

// routes
app.use("/api/v1/tasks", authMiddleware, tasks);
app.use("/api/v1/users", authMiddleware, users);
app.use("/api/v1/auth", auth);

// error handling middleware
app.use(notFound);
app.use(errorHandlerMiddleware);

// start server
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () =>
      console.log(`Server is listening on port ${PORT}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
