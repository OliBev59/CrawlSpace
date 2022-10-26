const express = require("express");
const router = express.Router();
const bodyParser = require('body-parser');
const bcrypt = require("bcrypt");

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://127.0.0.1:27017';

const app = express();
app.use(express);

var urlencodedParser = bodyParser.urlencoded({ extended: false });

//added a function to validate age is >18 when signing up
function isValidDOB(dob) {
let splitDOB= dob.split('-')
let userDate = new Date(dob)
console.log(userDate)
var ageDiff = Date.now() - userDate.getTime()
var ageDate = new Date(ageDiff)
var isAge = Math.abs(ageDate.getUTCFullYear()-1970) //from link https://stackoverflow.com/questions/4060004/calculate-age-given-the-birth-date-in-the-format-yyyymmdd
console.log(isAge)
var userYear = splitDOB[0]
var userMonth = splitDOB[1]
var userDay = splitDOB[2]
if (isAge<18 ){
    console.log("You are too young. School is starting soon.")
    return false
}
if (userYear < 1902){
    console.log("You are older than the oldest person in the world, maybe sleep.")
    return false
}
if (userYear =='' || userMonth == '' || userDay == ''){
    console.log("You have entered an invalid date of birth.")
    return false
}
else {
return true
}};

module.exports={isValidDOB};

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

  // route to sign up to CrawlSpace
  router.post("/signup",urlencodedParser, (req, res) => {
    console.log("posted to signup")
    console.log(req.body)
    // connecting to mongoDB
    MongoClient.connect(
      url,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true
      },
      (err, client) => {
        if (err) {
          return console.log(err)
        }
        // specify the database and collection to access and update customer data
        const db = client.db('pubsDB')
        console.log(`MongoDB Connected: ${url}`)
        const customers = db.collection('customers')
        // adding inputted information to database
        // checking passwords match
          if (req.body.password === req.body.confirmPassword) {
          console.log("passwords match")
          }
           // checking user is over 18
          if (isValidDOB(req.body.dob)== true) {
            const hash = bcrypt.hash(req.body.password, 10, function(err, hash) {
            console.log(hash)
            customers.insertOne({ username: req.body.username, email: req.body.email, dob: req.body.dob, password: hash, confirmPassword: hash }, (err, result) => {})
          });
          res.redirect("/home")
          } else { console.log("Try again")
          };
      });
  });

  //need to add a find to make sure the email doesn't already exist in database 

  //post route for login to CrawlSpace
  router.post("/login", urlencodedParser, (req, res) => {
    console.log("posted to login")
    console.log(req.body)
    // connecting to mongoDB
    MongoClient.connect(
      url,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true
      },
      async (err, client) => {
        if (err) {
          return console.log(err)
        }
        // specify the database and collection to access and update customer data
        const db = client.db('pubsDB')
        console.log(`MongoDB Connected: ${url}`)
        const customers = db.collection('customers')
        //finding user information for database 
        if (await customers.findOne({username : req.body.username})) {
          console.log("user exists")
          const customerInfo = await customers.findOne({username : req.body.username})
          const hashInDb = customerInfo.password
          bcrypt.compare(req.body.password, hashInDb, function(err, result) {
            if (result) {
              res.redirect('/home')
            } else {
              res.send("error: invalid credentials")
            }
          });
        } 
        else {
        console.log("user not found")
        res.redirect("/signup")
        };
       })
    });




// link in burger menu to homepage 
  router.get("/home", (req, res) => {
    return res.render("home", {
      title: "Homepage",
      myHeading: "My Crawls",
      myHeading2: "Suggested Crawls",
      msg2 :"Crawl into the weekend"
      
    });
  });

//link path to customer profile page 
  router.get("/profile", (req, res) => {
    return res.render("profile", {
      title: "Your Profile",
      myHeading: "My Crawls",
      myHeading2: "Suggested Crawls",
      msg2 :"Crawl into the weekend"
    });
  });


// link to myCrawls
router.get("/myCrawls", (req, res) => {
  return res.render("myCrawls", {
    title: "Welcome to your Bar"

  });
});

// Link to settings 
// router.get("/settings", (req, res) => {
//   return res.render("settings", {
//     title: "Mix up your experience"
    
//   });
// });

// link to Pre built Crawls 
router.get("/crawls", (req, res) => {
  return res.render("crawls", {
    title: "Ready Mixed Crawls"
    
  });
});



//link to map page 
  router.get("/map", (req, res) => {
    return res.render("map", {
      title: "The Otley Run",
      msg2 :"Crawl into the weekend"

    });
  });


  
  router.get("/", (req, res) => {
    return res.render("logout", {
    });
  });



module.exports =router;