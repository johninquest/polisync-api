import express from "express";
import helmet from "helmet";
import cors from "cors";
import Logger from "./shared/config/logger.js";

const app = express();

// Security Middleware
app.use(
  helmet({
    contentSecurityPolicy: false,
    frameguard: false,
    hsts: false,
    referrerPolicy: { policy: "no-referrer" },
  })
);

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// Custom JSON parser with error handling
app.use((req, res, next) => {
  express.json()(req, res, (err) => {
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
      Logger.error(`Invalid JSON payload: ${err.message}`);
      return res.status(400).json({
        status: "error",
        message: "Invalid JSON format",
        details: err.message,
      });
    }
    next();
  });
});

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  Logger.http(`Incoming ${req.method} ${req.url} ${JSON.stringify(req.body)}`);

  res.on("finish", () => {
    const duration = Date.now() - start;
    Logger.http(`Finished ${req.method} ${req.url} ${res.statusCode} ${duration}ms`);
  });

  next();
}); 

// Simple Hello World route
app.get("/", (req, res) => {
    res.send("Hello PoliSync API");
  });

// Error handling middleware
app.use((err, req, res, next) => {
  Logger.error(`Error processing ${req.method} ${req.url}: ${err.stack}`);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    status: "error",
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

export default app;