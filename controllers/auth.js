const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { jwtSecret, sendgridWelcomeEmail } = require("../config/index");
const { sendEmail } = require("./email");

exports.signup = async (req, res, next) => {
  try {
    if (req.body.password !== req.body.comfirmPassword) {
      return next({
        status: 500,
        message: "Passwords do not match",
      });
    }
    let hashedPassword = await bcrypt.hashSync(req.body.password, 10);
    let user = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      email: req.body.email,
      phone: req.body.phone,
      // pin: req.body.pin.toString(),
      password: hashedPassword,
      isBusiness: req.body.isBusiness,
    });
    let { id, username, firstName, lastName, isBusiness, isAdmin } = user;
    let token = jwt.sign(
      {
        id,
        username,
        firstName,
        lastName,
        isBusiness,
        isAdmin,
      },
      jwtSecret
    );

    // ==============================================
    // ======== APPLY RABBITMQ HERE =================
    // ==============================================

    // send email to registered user
    // const data = {
    //   to: user.email,
    //   templateId: sendgridWelcomeEmail,
    //   subject: 'Welcome to riltar',
    //   info: {
    //     'first_name': `${user.firstName}`,
    //     'coupon_code': 'AH3452RT'
    //   }
    // }
    // await sendEmail(data);

    return res.status(200).json({
      id,
      username,
      firstName,
      lastName,
      isBusiness,
      token,
    });
  } catch (err) {
    // if a validation fails
    if (err.code === 11000) {
      err.message = "username or email already exist";
    }
    return next({
      status: 400,
      message: err.message,
    });
  }
};

exports.signin = async (req, res, next) => {
  try {
    let user = await User.findOne({
      email: req.body.email,
    });
    let { id, username, firstName, lastName, isBusiness } = user;
    let isMatch = await user.comparePassword(req.body.password);
    if (isMatch == true) {
      let token = jwt.sign(
        {
          id,
          username,
          firstName,
          lastName,
          isBusiness,
        },
        jwtSecret
      );
      return res.status(200).json({
        id,
        username,
        firstName,
        lastName,
        isBusiness,
        token,
      });
    } else {
      return next({
        status: 400,
        message: "Invalid password",
      });
    }
  } catch (err) {
    return next({
      status: 400,
      message: "Invalid email or password",
    });
  }
};
