const User = require("../models/user");
const AWS = require("aws-sdk");
const bcrypt = require("bcryptjs");
const Jimp = require("jimp");
const cryptoRandomString = require("crypto-random-string");
const {
  awsAccessKey,
  awsBucketName,
  awsRegion,
  awsSecretKey,
} = require("../config/index");

exports.findUser = async (req, res, next) => {
  try {
    let user = await User.findById(req.params.user_id)
      .sort({ email: 1 })
      .exec();
    return res.status(200).json(user);
  } catch (err) {
    return next(err);
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    let user = await User.findById(req.params.user_id);
    if (!req.body.oldPin && !req.body.newPassword) {
      return next({
        status: 500,
        message: "Nothing Was Changed!",
      });
    }
    if (req.body.oldPin && req.body.oldPin != user.pin) {
      return next({
        status: 500,
        message: "Current Pin is Incorrect!",
      });
    }
    if (req.body.pin && !req.body.oldPin) {
      return next({
        status: 500,
        message: "Current Pin is Required to Set New Pin!",
      });
    }
    if (
      req.body.newPassword &&
      req.body.confirmNewPassword != req.body.newPassword
    ) {
      return next({
        status: 500,
        message: "Passwords Do Not Match!",
      });
    }
    if (req.body.password) {
      let isMatch = await user.comparePassword(req.body.password);
      if (!isMatch) {
        return next({
          status: 500,
          message: "Current Password is Incorrect!",
        });
      } else {
        if (req.body.newPassword) {
          let hashedPassword = await bcrypt.hashSync(req.body.newPassword, 10);
          user.password = hashedPassword;
          user.pin = req.body.pin.toString();
          await user.save();
          return res.status(200).json(user);
        } else {
          user.pin = Number(req.body.pin);
          await user.save();
          return res.status(200).json(user);
        }
      }
    } else {
      return next({
        status: 500,
        message: "Current Password is required!",
      });
    }
  } catch (err) {
    return next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    let user_id = req.params.user_id;
    let { firstName, lastName, email, phone, department, faculty } = req.body;
    let user = await User.findById(user_id);
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (department) user.department = department;
    if (faculty) user.faculty = faculty;

    if (req.files) {
      const file = req.files.image;

      const s3Client = await new AWS.S3({
        accessKeyId: awsAccessKey,
        secretAccessKey: awsSecretKey,
        region: awsRegion,
      });

      const params = await {
        Bucket: awsBucketName,
        Key: `${Date.now()}-${file.name}`,
        Body: file.data,
        ACL: "public-read",
      };
      s3Client.upload(params, (err, data) => {
        if (err) {
          return next(err);
        }
        user.profilePicture = data.Location;
        console.log(data.Location);
        user.save();
      });
    }

    await user.save();

    return res.status(200).json(user.location);
  } catch (err) {
    if (err.code === 11000) {
      err.message = "email o phone number already exist!";
    }
    return next(err);
  }
};

exports.addUserAddress = async (req, res, next) => {
  try {
    let user_id = req.params.user_id;
    let { phone, state, city, address } = req.body;
    let user = await User.findById(user_id);
    for (var i = 0; i < user.location.length; i++) {
      user.location[i].isDefault = false;
    }
    let data = {
      id: cryptoRandomString({ length: 11 }),
      state,
      city,
      address,
      phone,
      isDefault: true,
    };
    await user.location.push(data);
    await user.save();

    return res.status(200).json(user.location);
  } catch (err) {
    return next(err);
  }
};

exports.updateUserAddress = async (req, res, next) => {
  try {
    let user_id = req.params.user_id;
    let { id } = req.body;
    let updatedAddress = {};
    let user = await User.findById(user_id);
    for (var i = 0; i < user.location.length; i++) {
      if (user.location[i].id === id) {
        user.location[i].isDefault = true;
        updatedAddress = user.location[i];
      }
      if (user.location[i].id != id) {
        user.location[i].isDefault = false;
      }
    }
    await user.save();

    return res.status(200).json(updatedAddress);
  } catch (err) {
    return next(err);
  }
};

exports.updateUserBankDetails = async (req, res, next) => {
  try {
    let user_id = req.params.user_id;
    let { bankName, bankCode, bankAccountNumber } = req.body;
    if (!bankName || !bankAccountNumber) {
      return next({
        status: 500,
        message: "Every Field is required!",
      });
    }
    let user = await User.findByIdAndUpdate(
      user_id,
      {
        bankName,
        bankCode,
        bankAccountNumber: bankAccountNumber.toString(),
      },
      { new: true, useFindAndModify: false }
    );
    return res.status(200).json({
      user,
    });
  } catch (err) {
    return next(err);
  }
};

exports.updateUserIdentification = async (req, res, next) => {
  try {
    let user_id = req.params.user_id;
    let user = await User.findById(user_id);

    if (req.files.identificationImage) {
      const file = req.files.identificationImage;

      const s3Client = await new AWS.S3({
        accessKeyId: awsAccessKey,
        secretAccessKey: awsSecretKey,
        region: awsRegion,
      });

      const params = await {
        Bucket: awsBucketName,
        Key: `${Date.now()}-${file.name}`,
        Body: file.data,
        ACL: "public-read",
      };
      s3Client.upload(params, (err, data) => {
        if (err) {
          return next(err);
        }
        user.identification.imageUrl = data.Location;
        user.save();
      });
    }

    if (req.files.businessImage) {
      const file2 = req.files.businessImage;

      const s3Client = await new AWS.S3({
        accessKeyId: awsAccessKey,
        secretAccessKey: awsSecretKey,
        region: awsRegion,
      });

      const params = await {
        Bucket: awsBucketName,
        Key: `${Date.now()}-${file2.name}`,
        Body: file2.data,
        ACL: "public-read",
      };
      s3Client.upload(params, (err, data) => {
        if (err) {
          return next(err);
        }
        user.businessDocument.imageUrl = data.Location;
        user.save();
      });
    }
    return res.status(200).json({
      user,
    });
  } catch (err) {
    return next(err);
  }
};

exports.removeUser = async (req, res, next) => {
  try {
    let user_id = await req.params.user_id;
    let user = await User.findById(user_id);
    user.isDeleted = true;
    await user.save();
  } catch (err) {
    return next(err);
  }
};
