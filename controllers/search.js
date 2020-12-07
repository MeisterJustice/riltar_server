const Product = require("../models/product");

exports.searchProduct = async (req, res, next) => {
  try {
    let text = await req.params.search_param
      .split("/")
      .join("")
      .split("-")
      .join(" ")
      .split("$")
      .join("/")
      .split("&")
      .join(".");
    console.log("this is text: ", text);
    let search = await Product.find(
      {
        $text: {
          $search: text,
        },
        quantity: { $gt: 0 },
      },
      {
        score: {
          $meta: "textScore",
        },
      }
    )
      .sort({
        score: {
          $meta: "textScore",
        },
      })
      .where({ isDeleted: false, live: { isLive: false } })
      .lean()
      .exec();
    return res.status(200).json(search);
  } catch (err) {
    return next(err);
  }
};
