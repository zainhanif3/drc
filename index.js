const express = require("express");
const path = require("path");
const pug = require("pug");
const port = 5000;
const mongoose = require("mongoose");
const app = express();
const bodyParser = require ("body-parser")

// connect mongodb
mongoose.connect("mongodb://localhost:27017/drc")
.then(()=>{
  console.log('mongodb connected');
})
.catch(()=>{
 console.log('error')
})
var db = mongoose.connection;
// post data in db

app.post("/sign-up",(req,res)=>{
  var name = req.body.name;
  var address = req.body.address;
  var email = req.body.email;
  var password = req.body.password;

  var data = {
    "name": name,
    "address": address,
    "email": email,
    "password": password,
  }
  db.collection('users').insertOne(data,(err,collection)=>{
    if(err){
      throw err;
    }
    console.log("record inserted successfully");
  });
  return res.redirect('/')
})

// router
const staticPath = path.join(__dirname, "views");
console.log(path.join(__dirname, "views"));
app.use(express.static(staticPath));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended:true
}))
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


