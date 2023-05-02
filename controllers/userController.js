const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");

// filter data
const filterData = (obj, ...data) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (data.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.updateMe = catchAsync(async (req, res, next) => {
  const { password, passwordConfirm } = req.body;
  // check if the user wants to updte the password
  if (password || passwordConfirm) {
    return res.status(400).json({
      status: "fail",
      message: "You can not update your password in this rout",
    });
  }
  // filter data
  const filter = filterData(req.body, "username", "name", "email");
  //TODO: add the photo

  // update doc
  const updateDocument = await User.findByIdAndUpdate(req.user.id, filter, {
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
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: "success",
    data: null,
  });
});
