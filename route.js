const express = require("express");
const { getCollection } = require("./database");

const router = express.Router();

router.get("/summary/:memberstackId", async (req, res) => {
  const { memberstackId } = req.params;

  try {
    const collection = await getCollection("submissions");

    const userExists = await collection.findOne(
      { memberstack_user_id: memberstackId },
      { projection: { _id: 1 } }
    );

    if (!userExists) {
      return res.status(404).json({
        message: "ID not found"
      });
    }

    const totalSubmissions = await collection.countDocuments({
      memberstack_user_id: memberstackId,
    });

    const correctSubmissions = await collection.countDocuments({
      memberstack_user_id: memberstackId,
      "full_feedback.Answer_Status": "Correct",
    });

    return res.json({
      total_submissions: totalSubmissions,
      correct_submissions: correctSubmissions
    });

  } catch (error) {
    console.error("Error generating summary:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;