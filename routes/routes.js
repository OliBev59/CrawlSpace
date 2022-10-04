const express = require("express");

const router = express.Router();

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





module.exports =router;