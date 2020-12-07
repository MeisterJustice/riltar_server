const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cryptoRandomString = require("crypto-random-string");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    username: { type: String },
    pin: { type: String },
    email: { type: String, trim: true, unique: true, required: true },
    isEmailVerified: { type: Boolean, default: false },
    password: { type: String, required: true },
    phone: { type: String, unique: true, required: true },
    isPhoneVerified: { type: Boolean, default: false },
    profilePicture: String,
    bankName: String,
    bankCode: { type: String, trim: true },
    bankAccountNumber: { type: String, trim: true },
    isAdmin: { type: Boolean, default: false },
    isSuperAdmin: { type: Boolean, default: false },
    isDeleted: {
      delete: { type: Boolean, default: false },
      by: String,
      date: Date,
    },
    isSuspended: {
      suspend: { type: Boolean, default: false },
      by: String,
      from: { type: Date },
      to: { type: Date },
      numberOfTimesSuspended: { type: Number, default: 0 },
    },
    department: String,
    faculty: String,
    location: [
      {
        id: String,
        country: { type: String, default: "Nigeria" },
        state: String,
        city: String,
        address: String,
        phone: Number,
        isDefault: { type: Boolean, default: false },
      },
    ],
    totalRevenue: { type: Number, default: 0 },
    isBusiness: { type: Boolean, default: false },
    numberOfListedProducts: { type: Number, default: 0 },
    numberOfSales: { type: Number, default: 0 },
    numberOfCompletedOrders: { type: Number, default: 0 },
    numberOfCancelledOrders: { type: Number, default: 0 },
    numberOfReports: { type: Number, default: 0 },
    reviewReports: { type: String, default: "basic" },
    totalRating: { type: Number, default: 0 }, // summation of all ratings
    totalNumRatings: { type: Number, default: 0 }, // length of ratings
    averageRating: { type: Number, default: 0 }, // average of all ratings received
    totalNegativeFeedback: { type: Number, default: 0 },
    totalPositiveFeedback: { type: Number, default: 0 },
    feedback: { type: Number, default: 0 },
    identification: {
      imageUrl: String,
      verify: {
        isVerified: {
          type: Boolean,
          default: false,
        },
        by: String,
        date: Date,
      },
    },
    businessDocument: {
      imageUrl: String,
      verify: {
        isVerified: {
          type: Boolean,
          default: false,
        },
        by: String,
        date: Date,
      },
    },
    reputation: {
      title: String,
      rating: { type: Number, default: 0, max: 100 },
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }
    let hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    return next();
  } catch (err) {
    return next(err);
  }
});

userSchema.methods.comparePassword = async function (userPassword, next) {
  try {
    let isMatch = await bcrypt.compare(userPassword, this.password);
    return isMatch;
  } catch (err) {
    return next(err);
  }
};

const User = mongoose.model("User", userSchema);
module.exports = User;
