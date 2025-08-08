const express = require('express');
const axios = require('axios');
const router = express.Router();
const Customer = require('../models/customers');

const ABSTRACT_API_KEY = process.env.ABSTRACT_API_KEY;

router.post("/", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || typeof email !== "string") {
      return res.status(400).json({ error: "Valid email is required" });
    }

    // Validate email via Abstract API
    const { data: verifyData } = await axios.get("https://emailvalidation.abstractapi.com/v1/", {
      params: {
        api_key: ABSTRACT_API_KEY,
        email
      }
    });

    const isDeliverable = verifyData?.deliverability === "DELIVERABLE";
    const isGmail = verifyData?.is_free_email?.value && email.endsWith("@gmail.com");

    if (!isDeliverable || !isGmail) {
      return res.status(400).json({ error: "Enter a valid, deliverable Gmail address" });
    }

    const existing = await Customer.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const newCustomer = await Customer.create({ email });
    console.log("✅ New customer registered:", email);
    res.status(201).json({ message: "Customer saved", customer: newCustomer });

  } catch (error) {
    console.error("Customer save error:", error.response?.data || error.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
