import express from "express";
import http from "http";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import productRouts from "./routes/product.route.js";
import mongoose from "mongoose";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import fs from "fs";
import path from "path";
import cors from "cors";

dotenv.config();

const APP = express();

APP.use(cors());
APP.use(express.json());
APP.use(helmet());
APP.use(compression());

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);
APP.use(morgan("combined", { stream: accessLogStream }));
APP.use(morgan("dev"));

APP.use("/api/products", productRouts);

const PORT = process.env.PORT || 3000;
const server = http.createServer(APP);

const rootDirectory = path.resolve();

if (process.env.NODE_ENV === "production") {
  APP.use(express.static(path.join(rootDirectory, "/frontend/dist")));

  APP.get("*", (err, res) => {
    res.sendFile(path.resolve(rootDirectory, "frontend", "dist", "index.html"));
  });
}

server.listen(PORT, async () => {
  try {
    await connectDB();
    console.log(`Server listening on port ${PORT}`);
  } catch (error) {
    console.error("Failed to start the server:", error);
    process.exit(1);
  }
});

const gracefulShutdown = async () => {
  server.close(async () => {
    console.log("Server closed");
    try {
      await mongoose.connection.close();
      console.log("MongoDB connection closed");
      process.exit(0);
    } catch (err) {
      console.error(`Error closing MongoDB connection: ${err.message}`);
      process.exit(1);
    }
  });
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);
