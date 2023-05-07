const multer = require("multer");

const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// MULTER STORAGE ==> http://localhost:3000/img/users/default-user-profile.png
const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/img/users");
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split("/")[1];
    cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
  },
});

// FILTER IMG
const filterMulter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Upload only images!", 400), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: filterMulter });

// UPLOAD FILE
exports.uploadProfilePhoto = upload.single("profilePicture");

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
