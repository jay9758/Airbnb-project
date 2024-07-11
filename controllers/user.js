const User=require("../models/user.js");
const passport = require("passport");

module.exports.signupForm=(req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.signup=async(req,res)=>{
    try{
        let {username,email,password}=req.body;
        const newUser=new User({email,username});
        const nuser= await User.register(newUser,password);
        // console.log(nuser);
        req.login(nuser,(err)=>{
            if(err){
                next(err);
            }
            req.flash("success","Welcome to Wanderlust");
            res.redirect("/listings");
        })
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}

module.exports.loginForm=(req,res)=>{
    res.render("users/login.ejs");
}

module.exports.login=async(req,res)=>{
    req.flash("success","Welcome back to Wanderlust");
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);  
}

module.exports.logout=(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are logged out!");
        res.redirect("/listings");
    });
}