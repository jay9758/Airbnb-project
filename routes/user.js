const express=require("express");
const router=express.Router();
const wrapasync=require("../utils/wrapAsync.js");
const User=require("../models/user.js");
const passport = require("passport");
const { saveredirectUrl } = require("../middleware.js");

const userController=require("../controllers/user.js");

router.route("/signup")
.get(userController.signupForm)
.post(wrapasync(userController.signup));

router.route("/login")
.get(userController.loginForm)
.post(
    saveredirectUrl,
    passport.authenticate("local",{
    failureRedirect:"/login",
    failureFlash:true
    }),
    userController.login    
);

router.get("/logout",userController.logout);

//router.get("/signup",userController.signupForm);

//router.post("/signup",wrapasync(userController.signup));

//router.get("/login",userController.loginForm);

// router.post(
//     "/login",
//     saveredirectUrl,
//     passport.authenticate("local",{
//     failureRedirect:"/login",
//     failureFlash:true
//     }),
//     userController.login    
// );


module.exports=router;

