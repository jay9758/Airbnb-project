const Joi=require("joi");

module.exports.listingScheme=Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        price:Joi.number().required().min(0),
        location:Joi.string().required(),
        country:Joi.string().required(),
        image:Joi.string().allow("",null),
        category: Joi.string().valid(
            "Top Cities",
            "Rooms",
            "Mansions",
            "Cabins",
            "Tropical",
            "Beach",
            "Lakes",
            "Arctic",
            "Desert",
            "Mountains",
            "Countryside",
            "Camping",
            "Swimming Pools",
            "Amazing Views",
            "Historical Homes"
        ).required()
    });

module.exports.reviewSchema=Joi.object({
        review:Joi.object({
            rating:Joi.number().required().min(1).max(5),
            comment:Joi.string().required(),
        }).required(),
});    