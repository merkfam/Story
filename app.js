//jshint esversion:6
require("dotenv").config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const app = express();
const port = 3000


mongoose.connect("mongodb://localhost:27017/secretsUserDB");

const userSchema = new mongoose.Schema ({
  email: {
    type: String,
    required: (true, "You Must Enter An Email Address.")
  },
  password: {
    type: String,
    required: (true, "You Must Enter A Password.")
}
})

var secret = process.env.SECRET
// console.log(secret)
userSchema.plugin(encrypt, {secret: secret, encryptedFields: ["password"]})
const User = new mongoose.model("User", userSchema);


app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res){
  res.render("home");
});

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render("register");
});



app.post("/register", function(req, res){
  newUser = new User({
    email: req.body.username,
    password: req.body.password,
  });
  newUser.save(function(err){
    if (err){
      console.log(err)
    } else {
      res.render("secrets")
    }
  })
})

app.post("/login", function(req, res){
  const username = req.body.username;
  const password = req.body.password;
  User.findOne({email: username}, function(err, foundUser){
    if (err){
      console.log(err)
    } else if (foundUser === null) {
      res.send("Error: There are no users matching the query.")
    } else {
        if (foundUser){
          if (foundUser.password === password){
            res.render("secrets")
          } else {
            res.send("The passwords do not match.")
          }
        }
      // res.render("secrets")


    }
  })
});


app.listen(port, function(){
  console.log(`Server started on port ${port}.`)
})
