const express = require("express");

const router = express.Router();

// router.get("/views", (req, res) => {
//     return res.render("home")
// });


router.get("/login", (req, res) => {
    return res.render("login", {
      title: "Log in",
      message: "Crawl into the weekend",
      myHeading: "This is my Heading",
      msg2 :"just another message "
    });
  });









module.exports =router;