const mongoose=require("mongoose");
const review = require("./review");
const { ref } = require("joi");
const Schema=mongoose.Schema;
const Review=require("./review.js");
const { type } = require("express/lib/response.js");

const listingScheme=new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    image:{
        url:String,
        filename:String,
        // type:String,
        // default:"https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        // set:(v)=> v === "" ? "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D": v
    },
    price:{
        type:Number,
    },
    location:{
        type:String
    },
    country:{
        type:String
    },
    reviews:[
       {
        type:Schema.Types.ObjectId,
        ref:"Review",
       },
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    geometry: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true,
        },
        coordinates: {
          type: [Number],
          required: true,
        },
      },
    category:{
        type:String,
        enum:["mountains","rooms","snow","beach","nature","Historic","castle","pool"],
    },
});

listingScheme.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
});

const Listing=mongoose.model("Listing",listingScheme);
module.exports=Listing;