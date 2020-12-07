const User = require("../models/user");
const Product = require("../models/product");
const Order = require("../models/order");
const bcrypt = require("bcryptjs");
const { sendEmailWithoutTemplate } = require("../controllers/email");
const AWS = require("aws-sdk");
const {
  awsAccessKey,
  awsBucketName,
  awsRegion,
  awsSecretKey,
} = require("../config/index");

// ======================================================
// ================== USER ==============================
// ========================================================

exports.findAllUsers = async (req, res, next) => {
  try {
    let users = await User.find({}).sort({ email: 1 });
    return res.status(200).json(users);
  } catch (err) {
    return next(err);
  }
};

exports.suspendUser = async (req, res, next) => {
  try {
    let { customer_id, user_id } = await req.params;
    let user = await User.findById(customer_id);
    let admin = await User.findById(user_id)
      .select({ firstName: 1, lastName: 1 })
      .exec();
    user.isSuspended.suspend = true;
    user.isSuspended.from = req.body.from;
    user.isSuspended.from = req.body.to;
    user.isSuspended.by = `${admin.firstName} ${admin.lastName}`;
    user.isSuspended.numberOfTimesSuspended += 1;
    await user.save();
    return res.status(200).json(user);
  } catch (err) {
    return next(err);
  }
};

exports.removeUser = async (req, res, next) => {
  try {
    let { customer_id, user_id } = await req.params;
    let user = await User.findById(customer_id)
      .select({ _id: 1, isDeleted: 1 })
      .sort({ email: 1, createdAt: -1 })
      .exec();
    let admin = await User.findById(user_id)
      .select({ firstName: 1, lastName: 1 })
      .exec();
    user.isDeleted.delete = true;
    user.isDeleted.date = Date.now();
    user.isDeleted.by = `${admin.firstName} ${admin.lastName}`;
    await user.save();
    return res.status(200).json(user);
  } catch (err) {
    return next(err);
  }
};

exports.verifyIdentity = async (req, res, next) => {
  try {
    let { customer_id, user_id } = await req.params;
    let user = await User.findById(customer_id);
    let admin = await User.findById(user_id)
      .select({ firstName: 1, lastName: 1 })
      .exec();
    user.identification.verify.isVerified = true;
    user.identification.verify.date = Date.now();
    user.identification.verify.by = `${admin.firstName} ${admin.lastName}`;
    await user.save();

    return res.status(200).json(user);
  } catch (err) {
    return next(err);
  }
};

exports.verifyBusiness = async (req, res, next) => {
  try {
    let { customer_id, user_id } = await req.params;
    let user = await User.findById(customer_id);
    let admin = await User.findById(user_id)
      .select({ firstName: 1, lastName: 1 })
      .exec();
    user.businessDocument.verify.isVerified = true;
    user.businessDocument.verify.date = Date.now();
    user.businessDocument.verify.by = `${admin.firstName} ${admin.lastName}`;
    await user.save();

    return res.status(200).json(user);
  } catch (err) {
    return next(err);
  }
};

// ======================================================
// ================== PRODUCT ==============================
// ========================================================

exports.getAllProducts = async (req, res, next) => {
  try {
    let products = await Product.find({}).sort({ createdAt: -1 }).exec();
    return res.status(200).json(products);
  } catch (err) {
    return next(err);
  }
};

exports.getProductByReference = async (req, res, next) => {
  try {
    let product = await Product.find({
      reference: req.body.reference,
    })
      .sort({ reference: 1, createdAt: -1 })
      .lean()
      .exec();
    return res.status(200).json(product);
  } catch (err) {
    return next(err);
  }
};

exports.changeImageAndMakeProductLive = async (req, res, next) => {
  try {
    let { product_id, user_id } = await req.params;
    let product = await Product.findById(product_id)
      .populate("user", "_id")
      .exec();
    let admin = await User.findById(user_id)
      .sort({ email: 1, createdAt: -1 })
      .select({ firstName: 1, lastName: 1 })
      .exec();

    let user = await User.findById(product.user.id)
      .sort({ email: 1, createdAt: -1 })
      .select({ _id: 1 })
      .exec();
    product.live.isLive = true;
    product.isPaused = false;
    product.live.date = Date.now();
    product.live.by = `${admin.firstName} ${admin.lastName}`;
    await product.save();

    // save thumbnail
    if (req.files) {
      const file = req.files.thumbnail;

      const s3Client = await new AWS.S3({
        accessKeyId: awsAccessKey,
        secretAccessKey: awsSecretKey,
        region: awsRegion,
      });

      const params = await {
        Bucket: awsBucketName,
        Key: `${Date.now()}-${file.name}`, // pass key
        Body: file.data, // pass file body
        ACL: "public-read",
      };
      s3Client.upload(params, (err, data) => {
        if (err) {
          return next(err);
        }
        product.image.thumbnailUrl = data.Location;
        product.save();
      });
    }

    return res.status(200).json(user);
  } catch (err) {
    return next(err);
  }
};

exports.deleteProductAsAdmin = async (req, res, next) => {
  try {
    let { product_id } = req.params;
    let product = await Product.findById(product_id)
      .populate("user", "_id")
      .exec();

    let productOwner = await User.findById(product.user.id);
    product.isDeleted = true;
    await product.remove();
    // delete user's posted products
    productOwner.products.remove(product.id);
    await productOwner.save();
    return res.status(200).json(product);
  } catch (err) {
    return next(err);
  }
};

// ======================================================
// ================== ORDER ==============================
// ========================================================

exports.getOrders = async (req, res, next) => {
  try {
    let orders = await Order.find({})
      .sort({ reference: 1, createdAt: -1 })
      .lean()
      .exec();
    return res.status(200).json(orders);
  } catch (err) {
    return next(err);
  }
};

exports.getOrderByReference = async (req, res, next) => {
  try {
    let order = await Order.find({
      reference: req.body.reference,
    })
      .sort({ reference: 1, createdAt: -1 })
      .lean()
      .exec();
    return res.status(200).json(order);
  } catch (err) {
    return next(err);
  }
};

// ======================================================
// ================== ADMIN ==============================
// ========================================================

exports.createAdmin = async (req, res, next) => {
  try {
    let { firstName, lastName, username, email, phone } = req.body;
    let hashedPassword = await bcrypt.hashSync(req.body.password, 10);
    let user = await User.create({
      firstName,
      lastName,
      username,
      email,
      phone,
      password: hashedPassword,
      isAdmin: true,
    });

    const data = {
      to: user.email,
      subject: `You're now an admin at riltar`,
      body: `<h1>Welcome, ${user.lastName}. <p>Your login details is; email: ${user.email}, password: ${req.body.password}. Change your password and fill in your bank account details on login.</p>`,
    };
    sendEmailWithoutTemplate(data);

    return res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

exports.getAllAdmins = async (req, res, next) => {
  try {
    let admins = await User.find({
      isAdmin: true,
    })
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    return res.status(200).json(admins);
  } catch (err) {
    return next(err);
  }
};
