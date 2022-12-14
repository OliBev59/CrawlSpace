const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");

//connecting to MongoDB database
const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://127.0.0.1:27017";

const client = new MongoClient(url);

const app = express();
app.use(express);

var urlencodedParser = bodyParser.urlencoded({ extended: false });

// store userID when logging in
let userID = null;

//added a function to validate age is >18 when signing up
function isValidDOB(dob) {
  let splitDOB = dob.split("-");
  let userDate = new Date(dob);
  console.log(userDate);
  var ageDiff = Date.now() - userDate.getTime();
  var ageDate = new Date(ageDiff);
  var isAge = Math.abs(ageDate.getUTCFullYear() - 1970); //from link https://stackoverflow.com/questions/4060004/calculate-age-given-the-birth-date-in-the-format-yyyymmdd
  console.log(isAge);
  var userYear = splitDOB[0];
  var userMonth = splitDOB[1];
  var userDay = splitDOB[2];
  if (isAge < 18) {
    console.log("You are too young. School is starting soon.");
    return false;
  }
  if (userYear < 1902) {
    console.log(
      "You are older than the oldest person in the world, maybe sleep."
    );
    return false;
  }
  if (userYear == "" || userMonth == "" || userDay == "") {
    console.log("You have entered an invalid date of birth.");
    return false;
  } else {
    return true;
  }
}

module.exports = { isValidDOB };

//get route to render login page
router.get("/login", (req, res) => {
  return res.render("login", {
    title: "Crawl Space",
    myHeading: "Login",
    msg2: "Crawl into the weekend",
  });
});

//get route to render signup page
router.get("/signup", (req, res) => {
  return res.render("signup", {
    title: "Crawl Space",
    myHeading: "Sign Up",
    msg2: "Crawl into the weekend",
  });
});

//post route to sign up to CrawlSpace
router.post("/signup", urlencodedParser, (req, res) => {
  console.log("posted to signup");

  // connecting to MongoDB database
  MongoClient.connect(
    url,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    (err, client) => {
      if (err) {
        return console.log(err);
      }

      // specify the database and collection to access and update customer data
      const db = client.db("pubsDB");
      console.log(`MongoDB Connected: ${url}`);
      const customers = db.collection("customers");

      // adding inputted information to database and checking passwords match 
      if (req.body.password === req.body.confirmPassword) {
        console.log("passwords match");
      }
      // checking user is over 18 - if this is true, use bcrypt to hash and salt the password
      if (isValidDOB(req.body.dob) == true) {
        const hash = bcrypt.hash(req.body.password, 10, function (err, hash) {
          console.log(hash);

          //adding the hashed password into the Mongo database
          customers.insertOne(
            {
              username: req.body.username,
              email: req.body.email,
              dob: req.body.dob,
              password: hash,
              confirmPassword: hash,
            },
            (err, result) => {}
          );
        });

        // if sign up is successful, user is redirected to home
        res.redirect("/home");
      } else {
        res.send("Oops, there was a problem. Please try again");
      }
    }
  );
});

//post route to log in to CrawlSpace
router.post("/login", urlencodedParser, (req, res) => {
  console.log("posted to login");

  // connecting to MongoDB database
  MongoClient.connect(
    url,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    async (err, client) => {
      if (err) {
        return console.log(err);
      }

      // specify the database and collection to access and update customer data
      const db = client.db("pubsDB");
      console.log(`MongoDB Connected: ${url}`);
      const customers = db.collection("customers");

      //finding user information for database
      if (await customers.findOne({ username: req.body.username })) {
        console.log("user exists");

        // retrieving and comparing user password to password stored in the database
        const customerInfo = await customers.findOne({
          username: req.body.username,
        });
        console.log("logged in user", customerInfo);
        const hashInDb = customerInfo.password;
        bcrypt.compare(req.body.password, hashInDb, function (err, result) {

          // if login is successful, user is redirected to homepage
          if (result) {
            userID = customerInfo._id;
            res.redirect("/home");
          } else {
          // error is presented to user if password is incorrect
            res.send("error: invalid credentials - please try again");
          }
        });
      // if the user does not have an account, they are redirected to the signup page
      } else {
        console.log("user not found");
        res.redirect("/signup"); 
      }
    }
  );
});

// link in burger menu to homepage
router.get("/home", (req, res) => {
  return res.render("home", {
    title: "Homepage",
    myHeading: "My Crawls",
    myHeading2: "Suggested Crawls",
    msg2: "Crawl into the weekend",
  });
});

//link path to customer profile page
router.get("/profile", async (req, res) => {
  let user = null;

  try {
    await client.connect();
    const customers = await client.db("pubsDB").collection("customers");

    user = await customers.findOne({ _id: userID });
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();

    return res.render("profile", {
      title: "Your Profile",
      myHeading: "My Crawls",
      myHeading2: "Suggested Crawls",
      msg2: "Crawl into the weekend",
      user: {
        email: user.email,
        username: user.username,
        dob: user.dob,
      },
    });
  }
});

//get route to delete
router.get("/delete", async (req, res) => {
    let user = null;
  
    try {
      await client.connect();
      const customers = await client.db("pubsDB").collection("customers");
  
      user = await customers.findOne({ _id: userID });
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();

  return res.render("delete", {
    title: "Homepage",
    myHeading: "My Crawls",
    myHeading2: "Suggested Crawls",
    msg2: "Crawl into the weekend",
    user: {
      email: user.email,
      username: user.username,
      dob: user.dob,
    },
  })};
});


router.get("/contact", (req, res) => {
  return res.render("contact", {
    num: "07702692811",
    ad: "4 Wellington Place, Leeds",
    email: "crawlspaceteam@gmail.com",
  });
});


//route to delete profile
router.post("/delete", async (req, res) => {
  let user = null;
  
    try {
      await client.connect();
      const customers = await client.db("pubsDB").collection("customers");
      
      // finds and then deletes user from database
      user = await customers.findOne({ _id: userID });
      user = await customers.deleteOne({ _id: userID });

    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
          return res.redirect('http://localhost:3000/', 301, { //redirect to login/signup home page after deleting user
          });
        }});

// link to myCrawls
router.get("/myCrawls", (req, res) => {
  return res.render("myCrawls", {
    title: "Welcome to your Bar",
  });
});

// Link to settings
router.get("/settings", (req, res) => {
  return res.render("settings", {
    title: "Mix up your experience",
  });
});

// link to Pre built Crawls
router.get("/crawls", (req, res) => {
  return res.render("crawls", {
    title: "Ready Mixed Crawls",
  });
});

//link to map page
router.get("/map", (req, res) => {
  return res.render("map", {
    title: "The Otley Run",
    msg2: "Crawl into the weekend",
  });
});

//link to log out
router.get("/logout", (req, res) => {
  res.clearCookie("userName");
  // document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
  return res.redirect("http://localhost:3000/", 301, {});
});

module.exports = router;
