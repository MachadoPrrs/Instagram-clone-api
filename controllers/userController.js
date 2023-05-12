const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// MULTER STORAGE ==> http://localhost:3000/img/users/default-user-profile.png

exports.updateMe = catchAsync(async (req, res, next) => {
  const { password, passwordConfirm } = req.body;
  // check if the user wants to updte the password
  if (password || passwordConfirm) {
    return next(
      new AppError("You can not update your password in this rout", 400)
    );
  }

  //TODO: modificar verificacion de usuario
  // if (req.params._id.toString() !== req.user._id.toString()) {
  //   return next(new AppError("You are not allowed to delete this user", 403));
  // }

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

exports.deleteMe = catchAsync(async (req, res, next) => {
  // Prevent unauthorized modifications by only allowing the post creator to make changes
  //TODO: modificar verificacion de usuario
  // if (req.params._id.toString() !== req.user._id.toString()) {
  //   return next(new AppError("You are not allowed to delete this user", 403));
  // }

  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

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
