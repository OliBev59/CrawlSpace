const express = require("express");

const app = express();

app.listen(3000);

app.use((req, resp) => {
    console.info("middleware called");
    resp.send("Middleware called");
});


console.log("This is working");

module.exports = app;

