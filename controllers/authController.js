const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const { setToken } = require("../utils/tokenActions");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const sendEmail = require("../utils/email");

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

//* VERIFY IF AN USER IS LOGGED IN
exports.protect = catchAsync(async (req, res, next) => {
  let token = "";
  // check if there is a token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Bearer asdasdasd
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
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

//* FORGOT PASSWORD
exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).json({
      status: "fail",
      message: "There is no user with email address.",
    });
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  // console.log({ resetToken });
  await user.save({ validateBeforeSave: false });

  // send email with the token
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/auth/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a Patch request with your new password and passwordConfirm to ${resetURL}.\nIf you did not forget your password, please ignore this email`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token only valid for 10 minutes",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return res.status(500).json({
      status: "fail",
      message: "'There was an error sending the email. Try again later!'",
    });
  }
});

//* RESET PASSWORD
exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return res.status(400).json({
      status: "fail",
      message: "Token is invalid or has expired",
    });
  }

  // 3) Update changedPasswordAt property for the user
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 4) Log the user in, send JWT
  const token = setToken(user, req, res);

  return res.status(201).json({
    status: "success",
    token,
  });
});

//* UPDATE PASSWORD
exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  const user = await User.findById(req.user.id).select("+password");

  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return res.status(401).json({
      status: "fail",
      message: "Your current password is wrong.",
    });
  }

  // 3) If so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  // User.findByIdAndUpdate will NOT work as intended!

  // 4) Log user in, send JWT
  const token = setToken(user, req, res);
  return res.status(201).json({
    status: "success",
    token,
  });
});
