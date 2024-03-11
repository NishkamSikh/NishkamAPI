const LocalStrategy = require('passport-local').Strategy;
const db = require("./db");
const bcrypt = require("bcrypt");
const passportCustom = require('passport-custom');
const CustomStrategy = passportCustom.Strategy;

function initialize(passport) {

  const authenticateUser = async(email, password, done) => {
    
    //Check if email exists in database
    const results = await db.query(
      `SELECT * FROM users WHERE email = $1`, 
      [email])
      console.log(results.rows);

      
      if(results.rows.length > 0) {
        const user = results.rows[0];

        bcrypt.compare(password, user.password, (err, isMatch) => {
          if(err){
            throw err;
          }

          if(isMatch) {
            return done(null, user);
          } else {
            return done(null, false, {message: "Password is incorrect"})
          }
        });
      } else {
        return done(null, false, {message: "Email is not registered"});
      }

  }

  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      }, authenticateUser
    )
  )


    
  passport.use("social", new CustomStrategy(
    function(req, done) {
      //console.log("req: ",req);
      done(null, user);
      // User.findOne({
      //   username: req.body.username
      // }, function (err, user) {
      //   done(err, user);
      // });
    }
  ));



  passport.serializeUser((user, done) => {
    console.log("user: ",user);
    done(null, user.rows[0].id)
  });

  passport.deserializeUser(async(id, done) => {
    const results = await db.query(
      `SELECT * FROM users WHERE id = $1`, [id], (err) => {
        if(err) {
          throw err;
        }
      }
    )
    return done(null, results.rows[0]);
  });
}

module.exports = initialize;