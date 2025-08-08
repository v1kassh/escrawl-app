const express = require('express');
const axios = require('axios');
const router = express.Router();
const Vendor = require('../models/vendor');

const ABSTRACT_API_KEY = process.env.ABSTRACT_API_KEY;
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mdkdwovo'; // replace with your actual ID

router.post('/', async (req, res) => {
  try {
    const { business, category, website, gst, email } = req.body;

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Valid email is required' });
    }

    // ✅ 1. Validate email with Abstract API
    const { data: verifyData } = await axios.get("https://emailvalidation.abstractapi.com/v1/", {
      params: {
        api_key: ABSTRACT_API_KEY,
        email
      }
    });

    const isDeliverable = verifyData.deliverability === "DELIVERABLE";
    const isGmail = verifyData.is_free_email?.value && email.endsWith("@gmail.com");

    if (!isDeliverable || !isGmail) {
      return res.status(400).json({ error: "Enter a valid, deliverable Gmail address" });
    }

    // ✅ 2. Check if already exists
    const existingVendor = await Vendor.findOne({ email });
    if (existingVendor) {
      return res.status(409).json({ message: 'Vendor with this email already exists' });
    }

    // ✅ 3. Save to MongoDB
    const vendor = new Vendor({ business, category, website, gst, email });
    await vendor.save();

    // ✅ 4. Send to Formspree
    await axios.post(FORMSPREE_ENDPOINT, { email, business, category, website, gst }, {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    });

    // ✅ 5. Send success response
    res.status(201).json({ message: '🎉 Vendor registered successfully!' });

  } catch (err) {
    console.error('Vendor save error:', err);

    if (err.response?.status === 429) {
      return res.status(429).json({ error: "Email validation limit exceeded. Try again later." });
    }

    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
