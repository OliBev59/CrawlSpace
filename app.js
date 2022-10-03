const express = require("express");

const app = express();
const path = require("path")

const routes = require("./routes/routes");


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static("./app"))

app.use("/", routes);



app.listen(3000);



// making sure its working
app.use((req, resp) => {
    console.info("middleware called");
    resp.send("Middleware called");
});



console.log("This is working");

module.exports = app;
