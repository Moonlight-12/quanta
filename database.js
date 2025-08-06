const { MongoClient } = require("mongodb");

let client = null;
let db = null;

async function connectMongoClient() {
  try {
    if (isConnected()) {
      console.log("Using existing MongoDB connection");
      return client;
    }

    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error("MONGODB_URI environment variable is required");
    }

    console.log("Connecting to MongoDB...");

    client = new MongoClient(mongoUri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    await client.connect();

    await client.db().admin().ping();
    console.log("Successfully connected to MongoDB");

    return client;
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    throw error;
  }
}

async function getDatabase(dbName = "problems-and-submissions") {
  try {
    if (!db) {
      const client = await connectMongoClient();
      db = client.db(dbName);
    }
    return db;
  } catch (error) {
    console.error("Error getting database:", error.message);
    throw error;
  }
}

async function getCollection(
  collectionName,
  dbName = "problems-and-submissions"
) {
  try {
    const database = await getDatabase(dbName);
    return database.collection(collectionName);
  } catch (error) {
    console.error("Error getting collection:", error.message);
    throw error;
  }
}

async function closeConnection() {
  try {
    if (client) {
      await client.close();
      client = null;
      db = null;
      console.log("MongoDB connection closed");
    }
  } catch (error) {
    console.error("Error closing MongoDB connection:", error.message);
  }
}

function isConnected() {
  return client && client.topology && client.topology.isConnected();
}

module.exports = {
  connectMongoClient,
  getDatabase,
  getCollection,
  closeConnection,
  isConnected,
};
