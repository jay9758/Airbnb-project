const express=require("express");
const router=express.Router();
const wrapasync=require("../utils/wrapAsync.js");
const Listing=require("../models/listing.js");
const {isloggedin,isowner,validatelisting}=require("../middleware.js");

const listingController=require("../controllers/listing.js");
const multer  = require('multer')
const {storage}=require("../cloudConfig.js");
const upload = multer({storage});

const { category,search } = require("../controllers/query.js");


router.route("/new")
.get(isloggedin,listingController.newForm)
.post(isloggedin,upload.single('image'),validatelisting,wrapasync(listingController.newAdd));

router.get("/category/:id", wrapasync(category));
router.route("/search").get(wrapasync(search));

router.route("/:id")
.get(wrapasync(listingController.show))
.post(isloggedin,isowner,upload.single('image'),validatelisting,wrapasync(listingController.editAdd))
.delete(isloggedin,isowner,wrapasync(listingController.delete));

//index route
router.get("/",wrapasync(listingController.index));

//edit form route
router.get("/:id/edit",isloggedin,isowner,wrapasync(listingController.editForm));

//new listing form route
//router.get("/new",isloggedin,listingController.newForm);

//new listing added route
//router.post("/new",isloggedin,validatelisting,wrapasync(listingController.newAdd));

//show route
//router.get("/:id",wrapasync(listingController.show));



//edit update route
//router.post("/:id",isloggedin,isowner,validatelisting,wrapasync(listingController.editAdd));

//delete route
//router.delete("/:id",isloggedin,isowner,wrapasync(listingController.delete));

module.exports=router;
