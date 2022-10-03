const express = require("express");

const path = require("path");

const app = express();

const routes = require("./routes/routes");

//comment

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static("./public"));

app.use("/", routes);


app.listen(3000);



// making sure its working
// app.use((req, resp) => {
//     console.info("middleware called");
//     // resp.send("Middleware called");
// });



console.log("This is working");

module.exports = app;
