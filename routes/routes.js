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









module.exports =router;