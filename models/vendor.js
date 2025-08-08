const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  business: { type: String, required: true },
  category: String,
  website: String,
  gst: String,
  email: {
    type: String,
    required: true,
    unique: true
  },


  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Vendor', vendorSchema);
