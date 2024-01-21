const express = require("express");
const path = require("path");
const pug = require("pug");
const port = 5000;
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
const Signup = require ('./views/signup')

const fs = require("fs");
// connect mongodb
mongoose
  .connect("mongodb://localhost:27017/drc")
  .then(() => {
    console.log("mongodb connected");
  })
  .catch(() => {
    console.log("error");
  });

app.post("/sign-up.html", async (req, res) => {
  const userData = new Signup(req.body);
  await userData.save();
  let a = fs.readFileSync("sign-in.html");
  res.send(a.toString());
});
// router
const staticPath = path.join(__dirname, "views");
console.log(path.join(__dirname, "views"));
app.use(express.static(staticPath));
app.use(bodyParser.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
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
