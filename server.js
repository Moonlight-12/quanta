require('dotenv').config();

const express = require('express');
const { connectMongoClient, getDatabase } = require('./database');
const app = express();
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {

    await connectMongoClient();
    
    const db = await getDatabase();
    console.log('Using database:', db.databaseName);

    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();