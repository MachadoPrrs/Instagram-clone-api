const { promisify } = require("util");
const jwt = require("jsonwebtoken");

const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const { setToken } = require("../utils/tokenActions");

//* CREATE AN ACCOUNT
exports.signup = catchAsync(async (req, res) => {
  //This code is checking if the email provided in the request body already exists in the database.
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    return res.status(400).json({
      status: "fail",
      message: "Email is already registered",
    });
  }

  // Create a new user
  const newUser = await User.create(req.body);

  const token = setToken(newUser, req, res);

  return res.status(201).json({
    status: "success",
    token,
    data: {
      newUser,
    },
  });
});

//* LOGIN
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // check if the email exist
  const user = await User.findOne({ email }).select("+password");

  // check the password
  if (!user || !(await user.correctPassword(password, user.password))) {
    return res.status(400).json({
      status: "fail",
      message: "Incorrect email or password",
    });
  }

  // setup the token
  const token = setToken(user, req, res);

  return res.status(200).json({
    status: "success",
    token,
  });
});

//* LOGOUT
exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};

//* VERIFY USER
exports.protect = catchAsync(async (req, res, next) => {
  let token = "";
  // check if there is a token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Bearer asdasdasd
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      status: "fail",
      message: "You are not logged in! Please log in to get access.",
    });
  }
  // check the token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return res.status(401).json({
      status: "fail",
      message: "he user belonging to this token does no longer exist.",
    });
  }
  // Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return res.status(401).json({
      status: "fail",
      message: "User recently changed password! Please log in again.",
    });
  }
  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});
