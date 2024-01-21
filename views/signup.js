// server.js

const express = require ("express");
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');



// Create a mongoose schema
const signupSchema = new mongoose.Schema({
  name: String,
  email: String,
  fatherName: String,
  cnic: String,
  contactNumber: String,
  address: String,
  disputePerson: {
    name: String,
    fatherName: String,
    contactNumber: String,
    address: String,
  },
  disputeType: String,
});

// Create a mongoose model based on the schema
const Signup = mongoose.model('signup', signupSchema);

// Parse JSON bodies
app.use(bodyParser.json());

// Serve static files
app.use(express.static(__dirname + '/views'));

// Serve HTML file
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/signup.html');
});

// Handle POST request for user signup
app.post('./sign-up.html', async (req, res) => {
  try {
    // Create a new instance of the Signup model
    const newSignup = new Signup(req.body);

    // Save the new signup data to the database
    const savedSignup = await newSignup.save();

    res.status(201).json(savedSignup);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Export the Express app
module.exports = Signup;

