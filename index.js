const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const hbs = require ("hbs");
const bcrypt = require ("bcrypt");
const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost:27017/drc', { useNewUrlParser: true, useUnifiedTopology: true });

// Update the User model
const User = mongoose.model('User', {
  name: String,
  email: String,
  password: String,
  fatherName: String,
  cnic: String,
  contactNumber: String,
  address: String,
  disputePerson: {
      name: String,
      fatherName: String,
      contactNumber: String,
      address: String,
      disputeType: String,
      explanation: String,
      comments: [{ text: String, author: String, date: { type: Date, default: Date.now } }]
  },
  caseStatus: { type: String, default: 'Pending' }, // 'Pending', 'Success', 'Failure'
  hearingDate: Date
});


app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'hbs');

// Render the user registration page
app.get('/', (req, res) => {
    res.render('index');
});
app.get('/portal',(req,res)=>{
  res.render('portal')
})

// Handle user registration
app.post('/register', async (req, res) => {
    try {
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            fatherName: req.body.fatherName,
            cnic: req.body.cnic,
            contactNumber: req.body.contactNumber,
            address: req.body.address,
            disputePerson: {
                name: req.body.disputePersonName,
                fatherName: req.body.disputePersonFatherName,
                contactNumber: req.body.disputePersonContactNumber,
                address: req.body.disputePersonAddress,
                disputeType: req.body.disputeType
            }
        });

        await newUser.save();
        res.redirect('/portal'); // Redirect to portal or any other page
    } catch (error) {
        console.error('Error saving user:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Search Users
app.post('/search', async (req, res) => {
  const searchQuery = req.body.searchQuery;
  const users = await User.find({
      $or: [
          { name: { $regex: searchQuery, $options: 'i' } },
          { email: { $regex: searchQuery, $options: 'i' } },
          { cnic: { $regex: searchQuery, $options: 'i' } },
          { contactNumber: { $regex: searchQuery, $options: 'i' } }
      ]
  });
  res.render('search', { users });
});

// Explain Dispute
app.post('/explain-dispute', async (req, res) => {
  try {
      const userId = 'user_id_here'; // Get the user ID from session or wherever it's stored
      const user = await User.findById(userId);

      user.disputePerson.explanation = req.body.explanation;
      await user.save();

      res.redirect('./portal');
  } catch (error) {
      console.error('Error explaining dispute:', error);
      res.status(500).send('Internal Server Error');
  }
});

// Download Case Report
app.get('/download-report/:userId', async (req, res) => {
  try {
      const userId = req.params.userId;
      const user = await User.findById(userId);

      // Implement report generation logic here
      // ...

      res.download('path_to_report_file', 'case_report.pdf');
  } catch (error) {
      console.error('Error downloading report:', error);
      res.status(500).send('Internal Server Error');
  }
});

// Schedule Hearing
app.post('/schedule-hearing', async (req, res) => {
  try {
      const userId = 'user_id_here'; // Get the user ID from session or wherever it's stored
      const user = await User.findById(userId);

      user.hearingDate = new Date(req.body.hearingDate);
      await user.save();

      res.redirect('./portal');
  } catch (error) {
      console.error('Error scheduling hearing:', error);
      res.status(500).send('Internal Server Error');
  }
});

// router

app.get("/", (req, res) => {
  res.render("index");
});
app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/sign-in", (req, res) => {
  res.render("sign-in");
});
app.get("/sign-up", (req, res) => {
  res.render("sign-up");
});

app.get("/portal", (req, res) => {
  res.render("portal");
});

app.get("/password", (req, res) => {
  res.render("password");
});

//sign in check
app.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    res.send(user.password);
    console.log(user.password);
    

    if (!user) {
      return res.status(401).json({ message: 'Invalid email' });
    }

    // Compare the provided password with the hashed password stored in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    res.status(200).json({ message: 'Sign in successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
