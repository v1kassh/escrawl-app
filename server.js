const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const feedbackRoutes = require("./routes/feedback");

app.use(cors());
app.use(express.json());


// Routes
app.use('/api/customers', require('./routes/customerRoutes'));
app.use('/api/vendors', require('./routes/vendorRoutes'));
app.use("/api/feedback", feedbackRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch(err => console.log(err));
