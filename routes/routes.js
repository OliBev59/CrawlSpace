const express = require("express");

const router = express.Router();

router.get("/views/home.ejs", (req, res) => {
    return res.render("home")
});












module.exports =router;