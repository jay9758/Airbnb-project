const express=require("express");
const router=express.Router({mergeParams:true});
const wrapasync=require("../utils/wrapAsync.js");
const Listing=require("../models/listing.js");
const Review = require("../models/review.js");
const {validatereview, isloggedin,isreviewauthor}=require("../middleware.js");

const reviewController=require("../controllers/review.js");

//review 
router.post("/",isloggedin,validatereview,wrapasync(reviewController.createReview));

//delete route
router.delete("/:reviewId",isloggedin,isreviewauthor,wrapasync(reviewController.deleteReview));

module.exports=router;