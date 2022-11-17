// !!!!!!!!!!
// ALL OF THIS NEEDS TO BE REWRITTEN AND MADE TO FIT OUR CODE -- ESSENTIALLY STOLE IT FROM A PREVIOUS GRAD (NO SNITCHING X)
// SEE ABOVE!!!!!!!!!

const bcrypt = require("bcryptjs");

module.exports = {
  // ACCOUNT MANAGEMENT
  viewUserAccount: function (app, req, res) {
    app
      .set("pubDB")
      .collection("users")
      // to find the user thats logged in, take their email as its assigned to their session
      // which is maintained while they're logged in, so we can reference the session to get it

      .find({
        email: req.session.user,
      })
      .toArray(function (err, docs) {
        if (err) {
          console.error(err);
        }

        //renders the account page, passing the information in that user's document
        //"user" can then be referenced in the account ejs to locate specific details
        // such as their full name, DOB, score etc.
        return res.render("account", {
          user: docs[0],
        });
      });
  },

  // this function logs the user out if they press the 'log out' button
  // it wipes the information stored in the session which means that they can't access certain pages or play
  // the session is used to keep a user logged in when they refresh, load a different page, or do anything on the site
  logoutUser: function (app, req, res) {
    req.session.user = null;
    res.redirect(302, "/");
  },
  registerUser: async function (app, req, res) {
    try {
      // we used Bcrypt to hash our passwords to keep them secure
      // along with hashing them, extra text after the password to make a longer hash which is harder to brute force
      // the number of saltrounds determines how much is added each time
      let saltRounds = 8;
      let hash = await bcrypt.hash(req.body.password, saltRounds);
      const db = app.get("quackyRacesDB");
      const users = db.collection("users");
      const dob = req.body.day + req.body.month + req.body.year;
      // we require a user to confirm their password so they set the correct password
      if (req.body.password != req.body.confirmPassword) throw "Error";

      // this is a very rudimentary way to check if a user is over 18 years old, a more sophisticated method would
      // be added in if this was not a prototype
      var currentYear = new Date();
      var year = currentYear.getFullYear();
      if (year - req.body.year < 18) throw "Error";

      // this checks to make sure that the email provided has not already been registered with the site
      await users.createIndex(
        {
          email: 1,
        },
        {
          unique: true,
        }
      );
      // this inserts the user's data into the database, its automatically encoded that the user is not an admin
      // and if an admin account was required, it would have to be manually entered into the database
      // isAdmin is used to appropriately allow access to admin pages
      await users.insertOne({
        email: req.body.email,
        hash: hash,
        forename: req.body.forename,
        surname: req.body.surname,
        dob: dob,
        isAdmin: false,
      });
      // this allows the user to be already logged in when they register, don't need to log in after registering
      user = req.body.email;

      req.session.user = req.body.email;
      res.redirect("/account");
    } catch (err) {
      console.log("Registration error: ", err);
      res.render("register", {
        message: "Unable to register",
        user: "",
      });
    }
  },

  // function to log the user in
  loginUser: async function (app, req, res) {
    try {
      const db = app.get("quackyRacesDB");
      const users = db.collection("users");

      // This searches the user collection of the database to find the email that was submitted to log in
      const user = await users.findOne({
        email: req.body.email,
      });

      // bcrypt.compare is a method from bcrypt to allow the comparison of two hashed passwords
      // everytime a password is hashed with bcrypt, it has a different value, so they can't be compared by
      // conventional means. Bcrypt can tell when a password matches a hash
      let success = await bcrypt.compare(req.body.password, user.hash);

      // success returns a true or false, if the incorrect password is used, it throws an error
      if (!success) {
        throw "Incorrect username or password";
      }

      // otherwise, the session is set with the users email as the session identifier
      // this is because we check to ensure any email registered is unique, therefore no two accounts can
      // have the same email address. This ensures only the correct user has their session and information
      req.session.user = req.body.email;
      res.redirect(302, "play");
    } catch (err) {
      res.render("login", {
        // our error messages say incorrect username or password to not inform the person attempting to log in
        // which is causing the error.
        // This is because someone trying to hack into someone's account could attempt their email address, and
        // if they are told only the password is wrong they gain informaton that that email is registered
        // and they can then try to brute force their way into the account
        message: "Incorrect Username or Password",
        user: "",
      });
    }
  },

  // this function is used to delete a user if they require
  deleteUser: async function (app, req, res) {
    try {
      const db = app.get("quackyRacesDB");
      const users = db.collection("users");

      // it checks the session to find the email of the user logged in, as a user can only delete
      // their account when they're logged incorrect
      // it can then delete their account using the email to determine the account to be deleted
      await users.deleteOne(
        { email: req.session.user },
        function (err, dbResp) {
          if (err) {
            console.log(err);
          }

          // this checks to see if the database registered the fact that a document was deleted
          // if so, we can confirm that the user has been deleted
          if (dbResp.deletedCount === 1) {
            console.log("User deleted");
          } else {
            res.render("account", {
              message: "Could not delete account",
            });
          }
        }
      );
      // clear the session because if the user account has been deleted they can't be logged in
      req.session.user = null;
      res.redirect(302, "/");
    } catch (err) {
      res.render("account", {
        message: "Failed to delete account",
        user: req.session.user,
      });
    }
  },
};
