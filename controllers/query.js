const Listing = require("../models/listing");

module.exports.category = async (req, res) => {
    let { id } = req.params;
    let alllistings;
    if (id === "Trending") {
      alllistings = await Listing.aggregate([{ $sample: { size: 12 } }]);
    } else {
      alllistings = await Listing.find({ category: id });
    }
    if (alllistings.length == 0) {
      req.flash("error", ` Listing with ${id} category not found`);
      return res.redirect("/listings");
    }
    res.render("index.ejs", { alllistings });
  };

  module.exports.search = async (req, res) => {
    let { input } = req.query;
    if (input) {
      input = input.trim();
      const regex = new RegExp(input, "i");
      let query = {
        $or: [
          { title: regex },
          { description: regex },
          { location: regex },
          { country: regex },
        ],
      };
      const alllistings = await Listing.find(query);
      if (!alllistings.length) {
        req.flash("error", "No results found");
        return res.redirect("/listings");
      }
      res.render("index.ejs", { alllistings });
    }
  };  