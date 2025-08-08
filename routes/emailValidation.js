// routes/emailValidation.js
const express = require("express");
const fetch = require("node-fetch");
require("dotenv").config();

const router = express.Router();

router.post("/validate-email", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const apiRes = await fetch(
      `https://emailvalidation.abstractapi.com/v1/?api_key=${process.env.ABSTRACT_API_KEY}&email=${encodeURIComponent(email)}`
    );

    if (apiRes.status === 429) {
      return res.status(429).json({ error: "API limit exceeded" });
    }

    const data = await apiRes.json();
    res.json(data);
  } catch (err) {
    console.error("Email validation error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
