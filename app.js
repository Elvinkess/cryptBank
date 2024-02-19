require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passportLocalMongoose = require("passport-local-mongoose"); 
const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate= require("mongoose-findorcreate");



const app = express();

app.set('view engine', "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.use(session({
    secret:"Our little Skeleton",
    resave:false,
    saveUninitialized:false
  }));
  app.use(passport.initialize());
  app.use(passport.session());

mongoose.connect("mongodb://127.0.0.1:27017/userDB");


const userSchema = new mongoose.Schema({

    googleId:String,
    name:String,
    accountBal:Number

});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());


passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

function userProfile(user){
  return user
};
let user;

passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/google/userInfo",
  userProfileURL:"https://www.googleapis.com/oauth2/v3/userinfo"
},
function(accessToken, refreshToken, profile, cb) {
  
  user= userProfile(profile);
  User.findOrCreate({ username: profile.id,googleId: profile.id,name:profile.displayName}, function (err, user) {
    return cb(err, user);

  });
}
));




app.get("/",(req,res)=>{
 
  res.render("index");
});

app.get("/auth/google",
  passport.authenticate("google", { scope: ["profile"] })


);
app.get("/userInfo",async (req,res)=>{
  if(req.isAuthenticated()){
    console.log(user.id);

    await User.findOne({googleId:user.id}).then(function (foundUser,err) {
      if(err){
        console.log(err)
      }else{
        if(foundUser){  
          
          console.log(foundUser.name)
        res.render("userProfile",{name:foundUser.name})      
        }
      }    
    });   
  }else{
    res.redirect("/")
  }
});




app.get("/auth/google/userInfo", 
  passport.authenticate("google", { failureRedirect: "/" }),
  function(req, res) {
    
    res.redirect("/userInfo");
});

app.get('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});




















app.listen(3000,()=>{
   
  console.log("Server is running at port 3000");
});



