const express = require("express");
const path = require("path");
const pug = require("pug");
const port = 5000;
const mongoose = require("mongoose");
const app = express();


const staticPath = path.join(__dirname, "views");
console.log(path.join(__dirname, "views"));
app.use(express.static(staticPath));
app.set("view engine", "html");
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
// connect database
const signup = new mongoose.Schema({
  name:{
    type: String
  },
  password:{
    type: String
  },
  email:{
    type: String
  },
  address:{
    type: String
  }
})
const user = mongoose.model("drc", signup)