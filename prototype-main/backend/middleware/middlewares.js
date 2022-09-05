const jwt = require("jsonwebtoken");

const checkAuth = (req, res, next) => {
  let token = "";

  if (req.headers.authorization) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).send({
      error: "Unauthorized",
      message: "No token provided in request header",
    });
  }

  jwt.verify(token, "JWTSECRETTODO", (err, decoded) => {
    if (err) {
      return res.status(401).send({
        error: "Unauthorized",
        message: "Failed to authenticate token",
      });
    }
    req.firstname = decoded.firstname;
    req.email = decoded.email;
    req.user_id = decoded.user_id;
    next();
  });
};

const checkOptionalAuth = (req, res, next) => {
  let token = "";
  if (req.headers.authorization) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next();
  }

  jwt.verify(token, "JWTSECRETTODO", (err, decoded) => {
    if (!err) {
      req.firstname = decoded.firstname;
      req.email = decoded.email;
      req.user_id = decoded.user_id;
    }
    next();
  });
};

exports.checkAuth = checkAuth;
exports.checkOptionalAuth = checkOptionalAuth;
