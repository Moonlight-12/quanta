require("dotenv").config();

const express = require("express");
const { connectMongoClient, getDatabase } = require("./database");
const app = express();
const PORT = process.env.PORT || 3000;

const routes = require("./route");

async function startServer() {
  try {
    await connectMongoClient();

    app.use("/", routes);

    app.get("/", (req, res) => {
      res.send("API is running.");
    });

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();
