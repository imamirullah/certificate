const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs')
const filePath = 'counter.txt'

const app = express();
const port = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
mongoose.connect('mongodb+srv://at604281:wetware9211@dashboarddb.ysw862b.mongodb.net/CERTIFICATE-DB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Certificate Schema
const certificateSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  uniqueKey: String,
  cerficateno: String
});
const Certificate = mongoose.model('Certificate', certificateSchema);


function readCounter() {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(parseInt(data, 10) || 0); // Default to 0 if file content is invalid
      }
    });
  });
}

// Function to increment the counter and write it back to the file
async function updateCounter(counter) {
  try {
    const currentCount = await readCounter();
    console.log("current count =",currentCount, typeof(currentCount))
    fs.writeFile(filePath, counter.toString(), (err) => {
      if (err) {
        console.error('Error writing to counter.txt:', err);
      } else {
        console.log(`Counter updated to: ${counter}`);
      }
    });
  } catch (err) {
    console.error('Error reading counter.txt:', err);
  }
}

// Generate Endpoint
app.post('/generate', async (req, res) => {
  const { name, email, phone, cerficateno } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    // Check if the certificate already exists based on name, email, or phone
    const existingCertificate = await Certificate.findOne({ email,phone });
    console.log("existing certificate =",existingCertificate)

    const uniqueKey = `KEY-${Math.floor(100000 + Math.random() * 900000)}`;

    if (existingCertificate) {
      // If certificate already exists, return a message to prevent re-download
      return res.status(400).json({data:existingCertificate, message: 'Certificate already Exist' });
    }

    // If no existing certificate, generate a new one

    else{
      const currentCount = await readCounter();
      updateCounter(currentCount + 1)
      let certificateno = `UC / 2025 / 01 / ${currentCount + 1}`;
      const newCertificate = new Certificate({ name, email, phone, uniqueKey, cerficateno:certificateno });
      await newCertificate.save();
      console.log("new certificate data =",newCertificate)
      return res.status(200).json({ data: newCertificate });
    }

   

  } catch (error) {
    console.error('Error generating certificate:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// Start Server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
