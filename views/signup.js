// server.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/drc', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

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
const Signup = mongoose.model('Signup', signupSchema);

// Parse JSON bodies
app.use(bodyParser.json());

// Serve static files
app.use(express.static(__dirname + '/public'));

// Serve HTML file
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/signup.html');
});

// Handle POST request for user signup
app.post('/signup', async (req, res) => {
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

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
