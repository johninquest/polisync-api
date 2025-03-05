// src/server.js
import app from "./app.js";
// import { initializeDatabase } from "./shared/config/database.js";
import Logger from "./shared/config/logger.js";
import "dotenv/config";

const port = process.env.PORT;

const startServer = async () => {
  try {
    Logger.info("Starting server");

    app.listen(port, () => {
      Logger.info(`Server running on port => ${port}`);
      Logger.info(`Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    Logger.error("Failed to start server", error);
    process.exit(1);
  }
};

startServer();