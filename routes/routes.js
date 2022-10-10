const express = require("express");

const router = express.Router();

const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://127.0.0.1:27017';

// router.get("/views", (req, res) => {
//     return res.render("home")
// });


router.get("/login", (req, res) => {
    return res.render("login", {
      title: "Crawl Space",
      myHeading: "Login",
      msg2 :"Crawl into the weekend"
    });
  });

  router.get("/signup", (req, res) => {
    return res.render("signup", {
      title: "Crawl Space",
      myHeading: "Sign Up",
      msg2 :"Crawl into the weekend"
    });
  });

  router.get("/map", (req, res) => {
    return res.render("map", {
      title: "The Otley Run",
      msg2 :"Crawl into the weekend"
    });
  });

  router.get("/home", (req, res) => {
    return res.render("home", {
      title: "Homepage",
      myHeading: "My Crawls",
      myHeading2: "Suggested Crawls",
      msg2 :"Crawl into the weekend"
    });
  });




module.exports =router;