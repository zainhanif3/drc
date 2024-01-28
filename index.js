const express = require("express");
const path = require("path");
const hbs = require("hbs");
const port = 5000;
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
const Register = require("./models/signup1");

app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
// connect mongodb
mongoose
  .connect("mongodb://localhost:27017/drc")
  .then(() => {
    console.log("mongodb connected");
  })
  .catch(() => {
    console.log("error");
  });
// to check that post method work or not

// app.post("/sign-up", async (req, res) => {
//   try {
//     console.log(req.body.name);
//     res.send(req.body.name);

//   }
//   catch (error) {
//     res.status(400).send(error);
//   }
// });

// Post data in mongodb

app.post("/sign-up", async (req, res) => {
  try {
    const register = new Signup1({
      name: req.body.name,
      email: req.body.email,
      fatherName: req.body.fathername,
      cnic: req.body.cnic,
      contactNumber: req.body.contactNumber,
      address: req.body.address,
      disputePerson: {
        name: req.body.name,
        fatherName: req.body.fatherName,
        contactNumber: req.body.contactNumber,
        address: req.body.address,
      },
      disputeType: req.body.disputeType,
    });
    const registered = await register.save();
    res.status(201).render(portal);
  } catch (error) {
    res.status(400).send(error);
  }
});

// router
const staticPath = path.join(__dirname, "views");
console.log(path.join(__dirname, "views"));
app.use(express.static(staticPath));
app.set("view engine", "hbs");

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

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
