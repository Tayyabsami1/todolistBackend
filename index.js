const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const todolistRoutes = require("./routes/todolistRoutes");
const todoitemRoutes = require("./routes/todoitemRoutes");
const userRoutes = require("./routes/userRoutes");
const trashRoutes = require("./routes/trashRoutes");
const { requireAuth } = require("./middleware/authMiddleware");
const { Connect_to_Mongo_DB } = require("./connect");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Database Connection
const connectionString = "mongodb://localhost:27017/";
const databaseName = "To_Do_List";
Connect_to_Mongo_DB(connectionString + databaseName);

// Middleware Setup
app.use(cors({
    origin: "http://localhost:5173", // Frontend origin
    credentials: true, // Allow credentials to be sent
}));
app.use(express.json());
app.use(cookieParser());

// Public Routes (No authentication required)
app.use("/auth", authRoutes);

// Protected Routes (Require authentication)
app.use("/todolist", requireAuth, todolistRoutes);
app.use("/todoitem", requireAuth, todoitemRoutes);
app.use("/user", requireAuth, userRoutes);
app.use("/trashlist", requireAuth, trashRoutes);

// Root Route
app.get("/", (req, res) => {
    res.json("To-Do List running at localhost:3000");
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
});
