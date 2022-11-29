const express = require("express");

const path = require("path");

const app = express();

const routes = require("./routes/routes");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static("./public")); // index.html

app.use("/", routes);

app.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!");
});

app.listen(3000);

console.log("This is working");

module.exports = app;
