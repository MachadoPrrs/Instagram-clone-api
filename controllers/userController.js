const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { deleteUser } = require("../utils/templates");
const sendEmail = require("../utils/email");

// MULTER STORAGE ==> http://localhost:3000/img/users/default-user-profile.png

/* This code exports a function called `updateMe` that is used to update the current user's account
information. It first checks if the user is trying to update their password, and if so, it returns
an error message. Otherwise, it updates the user document with the new data provided in the request
body, including the filename of the profile picture uploaded using Multer. It then sends a JSON
response with a `200` status code and the updated user document. The `catchAsync` middleware is used
to handle any errors that may occur during the execution of the function. */
exports.updateMe = catchAsync(async (req, res, next) => {
  const { password, passwordConfirm } = req.body;
  // check if the user wants to updte the password
  if (password || passwordConfirm) {
    return next(
      new AppError("You can not update your password in this rout", 400)
    );
  }

  const data = { ...req.body, profilePicture: req.file.filename };
  // update doc
  const updateDocument = await User.findByIdAndUpdate(req.user.id, data, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updateDocument,
    },
  });
});

/* This code exports a function called `deleteMe` that is used to delete the current user's account. It
sets the `active` field of the user document to `false` using `User.findByIdAndUpdate()`. It then
sends an email to the user's email address using the `sendEmail()` function from the
`utils/email.js` file. If the email is sent successfully, it returns a `204` status code indicating
that the request was successful but there is no content to send. If there is an error sending the
email, it returns a `500` status code with a message indicating that there was an error sending the
email. */
exports.deleteMe = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user.id, { active: false });

  try {
    await sendEmail({
      email: user.email,
      subject: "Delete account from Instragram clone",
      message: "Delete account",
      html: deleteUser(),
    });

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: "'There was an error sending the email. Try again later!'",
    });
  }
});

/* This code exports a function called `following` that is used to allow a user to follow another user.
It uses the `catchAsync` middleware to handle any errors that may occur during the execution of the
function. */
exports.following = catchAsync(async (req, res, next) => {
  const { userData } = req.body.followingUsers;
  const user = await User.findOne(userData);

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  await User.findByIdAndUpdate(req.user.id, {
    followingUsers: user._id,
  });

  res.status(200).json({
    status: "success",
    data: {
      follow: `Following user ${user.username}`,
    },
  });
});
