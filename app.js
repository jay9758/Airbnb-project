if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const path=require("path");
const ejsMate=require("ejs-mate");
const wrapasync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingScheme,reviewSchema}=require("./schema.js");
const Review=require("./models/review.js");
const methodOverride = require('method-override');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport=require("passport");
const Localstrategy=require("passport-local");
const User=require("./models/user.js");

const listingController=require("./controllers/listing.js");

const dbUrl=process.env.ATLASDB_URL;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(methodOverride('_method'));
app.use(express.urlencoded({extended:true}));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public"))); 



const store= MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error",()=>{
    console.log("ERROR IN MONGO SESSIO STORE",err);
});

const sessionoptions={
    store,
    secret: process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+ 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly:true,
    },
};

//routes
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const users=require("./routes/user.js");
const { cookie } = require("express/lib/response.js");

async function main() {
  await mongoose.connect(dbUrl);
}

main()
     .then(()=>{
        console.log("connected to DB");
     })
     .catch((err)=>{
        console.log(err);
     });


app.use(session(sessionoptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new Localstrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.curruser=req.user;
    next();
});

// app.get("/",(req,res)=>{
    
// });

app.use("/listings",listings);

app.get("/", wrapasync(listingController.index));

app.use("/listings/:id/reviews",reviews);
app.use("/",users);

app.all("*",(req,res,next)=>{
   next(new ExpressError(404,"page not found"));
});

app.use((err,req,res,next)=>{
    let {status=500,message="something wrong"}=err;
    res.status(status).render("error.ejs",{message});
});

app.listen(8080,()=>{
    console.log("server is listening to port 8080");
});


