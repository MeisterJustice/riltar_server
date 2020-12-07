const User = require("../models/user");
const Product = require("../models/product");

// =============================================
// =======check if user deleted his account======
exports.isUserDeletedOrSuspended = async (req, res, next) => {
  try {
    let user = await User.find({ email: req.body.email });
    if (user.isDeleted) {
      next({
        status: 500,
        message: `No user with this email`,
      });
    } else {
      if (user.isSuspended) {
        next({
          status: 500,
          message: `User is currently suspended from this platform`,
        });
      } else {
        next();
      }
    }
  } catch (err) {
    next(err);
  }
};

// =============================================
// =======check if phone number is unique======
exports.isUniquePhoneAndEmail = async (req, res, next) => {
  try {
    let phone = await User.countDocuments({ phone: req.body.phone });
    let email = await User.countDocuments({ email: req.body.email });
    if (phone > 0) {
      next({
        status: 500,
        message: `Sorry, that number is taken. Try another phone number or login if already registered`,
      });
    } else {
      if (email > 0) {
        next({
          status: 500,
          message: `A user with that email already exist`,
        });
      } else {
        next();
      }
    }
  } catch (err) {
    next(err);
  }
};

// =============================================
// =======check if user is an admin======
exports.isAdmin = async (req, res, next) => {
  try {
    let user = await User.findById(req.params.user_id);
    if (user.isAdmin || user.isSuperAdmin) {
      next();
    } else {
      next({
        status: 500,
        message: `Only admins can access this`,
      });
    }
  } catch (err) {
    next(err);
  }
};

exports.isSuperAdmin = async (req, res, next) => {
  try {
    let user = await User.findById(req.params.user_id);
    if (user.isSuperAdmin) {
      next();
    } else {
      next({
        status: 500,
        message: `Only super admins can access this`,
      });
    }
  } catch (err) {
    next(err);
  }
};

exports.isUserAlreadyInReport = async (req, res, next) => {
  try {
    let { user_id, product_id } = req.params;
    let product = await Product.findById(product_id)
      .select({ reports: 1, buyers: 1 })
      .populate({
        path: "reports",
        select: { _id: 1, user: 1 },
        populate: {
          path: "user",
          select: { _id: 1 },
        },
      })
      .lean()
      .exec();
    if (product.buyers.includes(user_id)) {
      product.reports.forEach((report) => {
        if (report.user.id === user_id) {
          return next({
            status: 500,
            message: `You've already reported this product...We're looking into it`,
          });
        }
      });
      next();
    } else {
      return next({
        status: 500,
        message: `Only users who purchased this item can report`,
      });
    }
  } catch (err) {
    return next(err);
  }
};

exports.isUserAlreadyInRating = async (req, res, next) => {
  try {
    let { user_id, product_id } = req.params;
    let product = await Product.findById(product_id)
      .select({ ratings: 1, buyers })
      .populate({
        path: "ratings",
        select: { _id: 1, user: 1 },
        populate: {
          path: "user",
          select: { _id: 1 },
        },
      })
      .lean()
      .exec();
    if (product.buyers.includes(user_id)) {
      product.ratings.forEach((rating) => {
        if (rating.user.id === user_id) {
          return next({
            status: 500,
            message: `You've already left a review...You can update your previous review if you wish`,
          });
        }
      });
      next();
    } else {
      return next({
        status: 500,
        message: `Only users who purchased this item can rate it`,
      });
    }
  } catch (err) {
    return next(err);
  }
};

exports.isGreaterSuspendDate = async (req, res, next) => {
  try {
    if (req.body.from >= Date.now) {
      if (req.body.from > req.body.to) {
        next();
      } else {
        return next({
          status: 400,
          message: "start date must be greater than end date and must",
        });
      }
    } else {
      return next({
        status: 400,
        message: "start date must not be less than current date",
      });
    }
  } catch (err) {
    return next(err);
  }
};
