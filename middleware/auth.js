const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/index");

exports.isAuthenticated = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, jwtSecret, (err, decoded) => {
      if (decoded) {
        return next();
      } else {
        return next({
          status: 401,
          message: "Please log in to access this resource",
        });
      }
    });
  } catch (err) {
    return next({
      status: 401,
      message: "Please log in to access that",
    });
  }
};

exports.isAuthorized = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, jwtSecret, (err, decoded) => {
      if (decoded && decoded.id === req.params.user_id) {
        return next();
      } else {
        return next({
          status: 401,
          message: "Unauthorized",
        });
      }
    });
  } catch (err) {
    return next({
      status: 401,
      message: "Unauthorized",
    });
  }
};
