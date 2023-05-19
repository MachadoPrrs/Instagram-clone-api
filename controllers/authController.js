const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const sendEmail = require("../utils/email");
const AppError = require("../utils/appError");
const { resetPasswordHtml, welcomeMessage } = require("../utils/templates");

/**
 * The function signToken generates a JSON web token with a given ID and expiration time using a secret
 * key.
 */
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

/**
 * The function creates and sends a JSON web token to the client with the user data and a success
 * status code.
 */
const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);

  res.cookie("jwt", token, {
    expires: new Date(Date.now() + 60 * 60 * 1000),
    // secure: true,
    httpOnly: true, // avoid that the token could be modifi
  });

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

/* This code exports a function called `signup` that is responsible for creating a new user account. It
first checks if the email provided in the request body already exists in the database.*/
exports.signup = catchAsync(async (req, res, next) => {
  //This code is checking if the email provided in the request body already exists in the database.
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    return next(new AppError("Email is already registered", 400));
  }

  // Create a new user
  const newUser = await User.create(req.body);

  try {
    await sendEmail({
      email: newUser.email,
      subject: "Created account from Instragram Clone",
      message: "Welcome to Instragram Clone",
      html: welcomeMessage(newUser.username),
    });
    createSendToken(newUser, 201, req, res);
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: "'There was an error sending the email. Try again later!'",
    });
  }
});

/* This code exports a function called `login` that is responsible for authenticating a user by
checking if the email and password provided in the request body match with the ones stored in the
database.*/
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // check if the email exist
  const user = await User.findOne({ email }).select("+password");

  // check the password
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  // setup the token
  createSendToken(user, 200, req, res);
});

/* `exports.logout` is a function that logs out the user by setting the JWT cookie to "loggedout" and
setting the expiration time to 10 seconds. It then sends a JSON response with a status of "success". */
exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};

/* `exports.protect` is a middleware function that checks if the user is authenticated by verifying the
JWT token.  */
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
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }
  // check the token
  const decoded = await new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (error, decodedToken) => {
      if (error) {
        reject(error);
      } else {
        resolve(decodedToken);
      }
    });
  });
  // Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }
  // Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password! Please log in again.", 401)
    );
  }
  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

/* This code exports a function called `forgotPassword` that is responsible for generating a password
reset token and sending it to the user's email address. */
exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("There is no user with email address.", 404));
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  // console.log({ resetToken });
  await user.save({ validateBeforeSave: false });

  // send email with the token
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/auth/resetPassword/${resetToken}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token only valid for 10 minutes",
      message: "Forgot your password?",
      html: resetPasswordHtml(resetURL),
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

/* This code exports a function called `resetPassword` that is responsible for resetting the password
of a user. It uses the `catchAsync` function to handle any errors that may occur during the
execution of the function. */
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
    return next(new AppError("Token is invalid or has expired", 400));
  }

  // 3) Update changedPasswordAt property for the user
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 4) Log the user in, send JWT
  createSendToken(user, 200, req, res);
});

/* This code exports a function called `updatePassword` that is responsible for updating the password
of a user. It uses the `catchAsync` function to handle any errors that may occur during the
execution of the function. */
exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  const user = await User.findById(req.user.id).select("+password");

  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError("Your current password is wrong.", 401));
  }

  // 3) If so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  // 4) Log user in, send JWT
  createSendToken(user, 200, req, res);
});
