import express from "express";
import http from "http";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import productRouts from "./routes/product.route.js";
import compression from "compression";
import path from "path";
import cors from "cors";

dotenv.config();

const APP = express();

APP.use(cors());
APP.use(express.json());

APP.use(compression());
APP.use("/api/products", productRouts);

const PORT = process.env.PORT || 3001;
const server = http.createServer(APP);

const rootDirectory = path.resolve();

if (process.env.NODE_ENV === "production") {
  APP.use(express.static(path.join(rootDirectory, "/frontend/dist")));

  APP.get("*", (err, res) => {
    res.sendFile(path.resolve(rootDirectory, "frontend", "dist", "index.html"));
  });
}

server.listen(PORT, () => {
  connectDB();
  console.log(`Server listening on port ${PORT}`);
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
