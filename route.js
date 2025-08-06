const express = require('express');
const { getCollection } = require('./database');

const Router = express.Router();

// Example route to fetch a summary by ID
Router.get('/summary/:memberstackId', async (req, res) => {
  const { memberstackId } = req.params;
  try {
    const collection = await getCollection('summaries');
    const summary = await collection.findOne({ memberstackId });

    if (!summary) {
      return res.status(404).json({ error: 'Summary not found' });
    }

    res.json(summary);
  } catch (error) {
    console.error('Error fetching summary:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = Router;