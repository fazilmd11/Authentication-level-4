require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require("mongoose");
const encrypt = require('mongoose-encryption');
const bcrypt = require('bcrypt');
const saltRounds = 10;
// const md5 = require('md5');
const port = 3000;

const app = express();

// console.log(process.env.SECRET);

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/userDB")

const userSchema = new mongoose.Schema({
  username: String,
  password: String
});


// userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"]});
//
const User = mongoose.model('User', userSchema)

app.get("/", (req,res)=>{
  res.render("home");
})

app.get("/login", (req,res)=>{
  res.render("login");
})

app.get("/register", (req,res)=>{
  res.render("register");
})

app.post("/register", (req,res)=>{
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    // Store hash in your password DB.
    const newUser = new User({
      username: req.body.username,
      password: hash
    })
    newUser.save((err)=>{
      if(err) {
        console.log(err);
      }
      else {
        res.render("secrets");
      }
    })
});

})

app.post("/login",(req,res)=>{
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({username:username}, (err, foundUser)=>{
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        bcrypt.compare(password, foundUser.password, function(err, result) {
    // result == true
    if (result == true) {
      res.render("secrets");
    }
});
      }
    }
  })
})

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
