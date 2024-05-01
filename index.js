const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const hbs = require("hbs");
const bcrypt = require("bcrypt");
const app = express();
const port = 3000;
const path = require("path");
const MongoClient = require("mongodb").MongoClient;

mongoose.connect("mongodb://localhost:27017/drc", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Update the User model
const User = mongoose.model("User", {
  name: String,
  email: String,
  password: String,
  fatherName: String,
  cnic: String,
  contactNumber: String,
  address: String,

  caseStatus: { type: String, default: "Pending" }, // 'Pending', 'Success', 'Failure'
  hearingDate: Date,
});

app.use("/img", express.static(path.join(__dirname, "img")));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "hbs");

// Render the user registration page
app.get("/", (req, res) => {
  res.render("index");
});
app.get("/portal", (req, res) => {
  res.render("portal");
});
app.get("/cases", (req, res) => {
  res.render("cases");
});

// Handle user registration
app.post("/register", async (req, res) => {
  try {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      fatherName: req.body.fatherName,
      cnic: req.body.cnic,
      contactNumber: req.body.contactNumber,
      address: req.body.address,
    });

    await newUser.save();
    res.redirect("/sign-in"); // Redirect to portal or any other page
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Search Users
app.post("/search", async (req, res) => {
  const searchQuery = req.body.searchQuery;
  const users = await User.find({
    $or: [
      { name: { $regex: searchQuery, $options: "i" } },
      { email: { $regex: searchQuery, $options: "i" } },
      { cnic: { $regex: searchQuery, $options: "i" } },
      { contactNumber: { $regex: searchQuery, $options: "i" } },
    ],
  });
  res.render("search", { users });
});

// Explain Dispute
app.post("/explain-dispute", async (req, res) => {
  try {
    const userId = "user_id_here"; // Get the user ID from session or wherever it's stored
    const user = await User.findById(userId);

    user.disputePerson.explanation = req.body.explanation;
    await user.save();

    res.redirect("./portal");
  } catch (error) {
    console.error("Error explaining dispute:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Download Case Report
app.get("/download-report/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    // Implement report generation logic here
    // ...

    res.download("path_to_report_file", "case_report.pdf");
  } catch (error) {
    console.error("Error downloading report:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Schedule Hearing
app.post("/schedule-hearing", async (req, res) => {
  try {
    const userId = "user_id_here"; // Get the user ID from session or wherever it's stored
    const user = await User.findById(userId);

    user.hearingDate = new Date(req.body.hearingDate);
    await user.save();

    res.redirect("./portal");
  } catch (error) {
    console.error("Error scheduling hearing:", error);
    res.status(500).send("Internal Server Error");
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
app.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email " });
    }

    // Compare the provided password with the hashed password stored in the database

    if (user.password === password) {
      res.status(200).redirect("/portal");
    } else {
      res.send("password not match");
    }

    // Redirect to the portal page after successful sign-in
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/forgot", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Generate new password
    const newPassword = uuidv4().slice(0, 8); // Generate an 8-character password

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password
    await User.updateOne({ email }, { password: hashedPassword });

    // Send email with new password
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "your_email@gmail.com",
        pass: "your_password",
      },
    });

    const mailOptions = {
      from: "your_email@gmail.com",
      to: email,
      subject: "New Password",
      text: `Your new password is: ${newPassword}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    res.send("New password sent to your email");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Define schema for cases
const caseSchema = new mongoose.Schema({
  name: String,
  fatherName: String,
  contactNumber: String,
  address: String,
  caseDetail: String,
  disputeType: String,
});

// Create model from schema
const Case = mongoose.model("Case", caseSchema);

// Middleware to parse JSON bodies
app.use(express.json());
// Route to render the portal page
app.get("/portal", (req, res) => {
  res.render("portal", {
    successMessage:
      req.query.success === "true" ? "Case registered successfully" : null,
  });
});

// Route to handle form submission
app.post("/portal", async (req, res) => {
  try {
    // Extract form data from request body
    const { dpn, dfn, dcn, da, address, disputeType } = req.body;

    // Create a new case instance
    const newCase = new Case({
      name: dpn,
      fatherName: dfn,
      contactNumber: dcn,
      address: da,
      caseDetail: address,
      disputeType: disputeType,
    });

    // Save the new case to the database
    await newCase.save();

    res.redirect("/cases?success=true");
  } catch (error) {
    console.error("Error registering case:", error);
    res.status(500).send("Internal server error");
  }
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
