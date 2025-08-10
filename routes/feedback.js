const express = require("express");
const router = express.Router();
const Feedback = require("../models/feedback");

router.post("/", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "Feedback text is required" });
    }

    await Feedback.create({ text });
    res.status(201).json({ message: "Feedback saved successfully" });
  } catch (err) {
    console.error("Feedback save error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
