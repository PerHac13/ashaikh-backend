require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db");
const routing = require("./middleware/routing");
const errorHandler = require("./middleware/errorHandler");

const logger = require("./utils/logger");

const identityRoutes = require("./routes/identity_routes");
const experienceRoutes = require("./routes/experience_routes");
const projectRoutes = require("./routes/project_routes");

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(routing);

app.use("/api/v1");
// Routes
app.use("/auth", identityRoutes);
app.use("/experiences", experienceRoutes);
app.use("/projects", projectRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`ashaikh backend running on port ${PORT}`);
});

// unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  logger.error(`Unhandled Rejection at: ${promise} reason: ${reason}`);
});
