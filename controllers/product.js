const Category = require("../models/category");
const Subcategory = require("../models/subcategory");
const User = require("../models/user");
const Product = require("../models/product");
const View = require("../models/views");
const { createView } = require("./view");
const AWS = require("aws-sdk");
const cryptoRandomString = require("crypto-random-string");
const Jimp = require("jimp");

const {
  awsAccessKey,
  awsBucketName,
  awsRegion,
  awsSecretKey,
} = require("../config/index");

exports.getAllproducts = async (req, res, next) => {
  try {
    let products = await Product.find({})
      .select({
        _id: 1,
        images: 1,
        title: 1,
        live: 1,
        isPaused: 1,
        condition: 1,
        price: 1,
        averageRating: 1,
        isNegotiable: 1,
      })
      .lean()
      .exec();
    return res.status(200).json(products);
  } catch (err) {
    return err;
  }
};

exports.getAllCheapProducts = async (req, res, next) => {
  try {
    let limit = Number(req.params.limit);
    let products = await Product.aggregate([{ $sample: { size: limit } }]);

    return res.status(200).json(products);
  } catch (err) {
    return err;
  }
};

exports.getAllSimilarProducts = async (req, res, next) => {
  try {
    let limit = Number(req.params.limit);
    let products = await Product.aggregate([
      { $sample: { size: limit } },
      { $match: { subcategory: req.params.subcategory_id } },
    ]);

    return res.status(200).json(products);
  } catch (err) {
    return err;
  }
};

exports.getAllPopularProducts = async (req, res, next) => {
  try {
    let products = await Product.find({})
      .sort({ totalViews: -1 })
      // .where({ isDeleted: false })
      .populate("user")
      .limit(Number(req.params.limit))
      .lean()
      .exec();

    return res.status(200).json(products);
  } catch (err) {
    return err;
  }
};

exports.getAllRecentViewedProducts = async (req, res, next) => {
  try {
    let views = await View.find({
      // user: req.params.user_id,
    })
      .sort({ createdAt: -1 })
      .populate({
        path: "product",
        populate: {
          path: "user",
        },
      })
      .limit(Number(req.params.limit))
      .lean()
      .exec();

    return res.status(200).json(views);
  } catch (err) {
    return err;
  }
};

exports.getBrowseProducts = async (req, res, next) => {
  try {
    let limit = Number(req.params.limit);
    let products = await Product.aggregate([{ $sample: { size: limit } }]);

    return res.status(200).json(products);
  } catch (err) {
    return err;
  }
};

exports.getAllproductsOwnedByUser = async (req, res, next) => {
  try {
    let products = await Product.find({ user: req.params.user_id })
      .select({
        _id: 1,
        title: 1,
        live: 1,
        isPaused: 1,
        price: 1,
        totalViews: 1,
        averageRating: 1,
        totalOrders: 1,
        quantity: 1,
      })
      .where("isDeleted")
      .equals(false)
      .lean()
      .exec();
    return res.status(200).json(products);
  } catch (err) {
    return err;
  }
};

exports.getproduct = async (req, res, next) => {
  try {
    let { product_id } = req.params;
    
    let product = await Product.findById(product_id)
      .populate(
        "user",
        "_id firstName lastName username profilePicture feedback isBusiness"
      )
      .populate({
        path: "ratings",
        select: {
          rating: 1,
          review: 1,
          feedback: 1,
          user: 1,
          createdAt: 1,
        },
        populate: {
          path: "user",
          select: {
            firstName: 1,
            lastName: 1,
            username: 1,
          },
        },
      })
      .populate({
        path: "subcategory",
        select: { _id: 1, title: 1 },
        populate: {
          path: "category",
          select: { _id: 1, title: 1 },
        },
      })
      .exec();

    // ============================================
    // ======= APPLY RABBITMQ FROM HERE ===========
    if (req.params.user_id !== 'undefined') {
      let user = await User.countDocuments({ _id: req.params.user_id });
      if(user > 0){
        createView({
          user: req.params.user_id,
          seller: product.user.id,
          product: req.params.product_id,
        });
      }
    }
    const category = await Category.findById(product.subcategory.category.id);
    const subcategory = await Subcategory.findById(product.subcategory.id);

    // increase number of visits
    category.numberOfVisits += 1;
    subcategory.numberOfVisits += 1;
    product.totalViews += 1;
    category.save();
    subcategory.save();
    product.save();

    return res.status(200).json(product);
  } catch (err) {
    return next(err);
  }
};

exports.postProduct = async (req, res, next) => {
  try {
    let { user_id } = req.params;
    let category = await Category.findById(req.body.category);
    let subcategory = await Subcategory.findById(req.body.subcategory);
    let user = await User.findById(user_id);
    let {
      title,
      description,
      condition,
      secondCondition,
      price,
      isNegotiable,
      NegotiationMinRange,
      quantity,
      city,
      location,
      metaData,
      tags,
    } = await req.body;
    console.log("this is the meta: ", metaData);
    let product = await Product.create({
      title,
      description,
      condition,
      secondCondition,
      price: Number(price),
      isNegotiable,
      NegotiationMinRange,
      quantity: Number(quantity),
      state: "Lagos",
      city,
      location,
      metaData,
      tags,
      user: user.id,
      categoryName: category.title,
      subcategoryName: subcategory.title,
      subcategory: subcategory.id,
      reference: `item-${cryptoRandomString({ length: 12 })}`,
    });

    // ============================================
    // ======= APPLY RABBITMQ FROM HERE ===========

    //update the user model
    user.products.push(product.id);
    user.numberOfListedProducts += 1;
    await user.save();

    //update subcategory model
    subcategory.products.push(product.id);
    subcategory.save();

    return res.status(200).json(product);
  } catch (err) {
    return next(err);
  }
};

exports.productImage = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.product_id);
    if (!req.files) {
      return next({
        status: 500,
        message: "no image was selected",
      });
    }
    const keys = Object.keys(req.files);
    if (keys.length === 0) {
      return next({
        status: 500,
        message: "no image was selected",
      });
    } else if (keys.length > 5) {
      return next({
        status: 500,
        message: "more than 5 images was selected",
      });
    } else {
      for (const key of keys) {
        const file = req.files[key];

        const s3Client = new AWS.S3({
          accessKeyId: awsAccessKey,
          secretAccessKey: awsSecretKey,
          region: awsRegion,
        });
        const image = await Jimp.read(file.data);
        await image.resize(500, 500);
        await image.quality(100);
        await image.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
          const params = {
            Bucket: awsBucketName,
            Key: `${Date.now()}-${file.name}`,
            Body: buffer,
            ACL: "public-read",
          };
          s3Client.upload(params, (err, data) => {
            if (err) {
              return next(err);
            }
            product.images.push(data.Location);
            product.save();
          });
        });
      }
    }
    return res.status(200).json(product);
  } catch (err) {
    return next(err);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    let { product_id } = req.params;
    let { quantity, price } = req.body;
    let product = await Product.findByIdAndUpdate(
      product_id,
      {
        quantity,
        price,
      },
      { new: true }
    );
    return res.status(200).json(product);
  } catch (err) {
    return next(err);
  }
};

exports.togglePause = async (req, res, next) => {
  try {
    let { product_id } = req.params;

    let product = await Product.findById(product_id);

    if (product.live.isLive) {
      if (product.quantity > 0) {
        if (product.isPaused === false) {
          product.isPaused = true;
        } else {
          product.isPaused = false;
        }
      } else {
        return next({
          status: 500,
          message: `Not enough products in inventory. Products must be > 0`,
        });
      }
    } else {
      return next({
        status: 500,
        message: `Product is still under review`,
      });
    }

    await product.save();
    return res.status(200).json(product);
  } catch (err) {
    return next(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    let { product_id, user_id } = req.params;
    let user = await User.findById(user_id);
    let product = await Product.findById(product_id);
    product.isDeleted = true;
    await product.save();
    // delete user's posted product
    user.products.remove(product.id);
    await user.save();
    return res.status(200).json(product);
  } catch (err) {
    return next(err);
  }
};
