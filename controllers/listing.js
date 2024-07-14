const Listing=require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken= process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

const { cloudinary } = require("../cloudConfig");

module.exports.index=async (req,res)=>{
    const alllistings=await Listing.find({});
    res.render("index.ejs",{alllistings});
}

module.exports.newForm=(req,res)=>{
    res.render("new.ejs");
}

module.exports.newAdd=async(req,res,next)=>{
    let response=await geocodingClient.forwardGeocode({
        query: req.body.location,
        limit: 1,
      })
        .send();
        
    let url=req.file.path;
    let filename=req.file.filename;
    // console.log(url,"..",filename);

    // const list ={title,description,price,location,country}=req.body;

    const list = new Listing(req.body);

    list.owner=req.user._id;
    list.image={url,filename};

    list.geometry = response.body.features[0].geometry;

    // const insertnew = await Listing.create(list);

    await list.save();

    // console.log(insertnew);
    req.flash("success","New listing created");
    res.redirect("/listings"); 
}

module.exports.show=async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id)
    .populate({
        path:"reviews",
        populate:{
            path:"author",
        },
    })
    .populate("owner");
    if(!listing){
        req.flash("error","Listing you requested does not exist");
        res.redirect("/listings");
    };
    // console.log(listing);
    res.render("show.ejs",{listing});
}

module.exports.editForm=async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested does not exist");
        res.redirect("/listings");
    };

    let originalimageurl=listing.image.url;
    originalimageurl=originalimageurl.replace("/upload","/upload/h_200,w_300");

    res.render("edit.ejs",{listing,originalimageurl});
}

module.exports.editAdd=async(req,res)=>{
    let {id}=req.params;
    // const {title,description,image,price,location,country,category}=req.body;

    const {title,description,price,location,country,category}=req.body;

    let response = await geocodingClient.forwardGeocode({
        query: location,
        limit: 1,
    }).send();
    const geometry = response.body.features[0].geometry;

    // const edit=await Listing.findByIdAndUpdate(id,{title,description,image,price,location,country,geometry,category},{new: true});
    const edit=await Listing.findByIdAndUpdate(id,{title,description,price,location,country,geometry,category},{new: true});

    if (req.file) {
        // Delete the old image from Cloudinary
        if (edit.image && edit.image.filename) {
            await cloudinary.uploader.destroy(edit.image.filename);
        }
        
        // Update with the new image
        edit.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }

    // if(typeof req.file !== "undefined"){
    // let url=req.file.path;
    // let filename=req.file.filename;
    // edit.image={url,filename};
    // edit.save();
    // }

    await edit.save();

    //res.redirect("/listings");
    const listing=await Listing.findById(id);
    req.flash("success","Listing Edited Successfully");
    res.redirect(`/listings/${id}`);
}

module.exports.delete=async (req,res)=>{
    let {id}=req.params;
    const list=await Listing.findById(id);

    if (list.image && list.image.filename) {
        await cloudinary.uploader.destroy(list.image.filename);
    }

    const deletelist=await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted");
    res.redirect("/listings");
}

