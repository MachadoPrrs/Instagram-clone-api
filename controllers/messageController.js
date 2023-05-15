const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");
const Message = require("../models/messageModel");

// check if there is a video or an image
const checkFile = (req, res, next) => {
  let data = {};

  if (req.file) {
    if (req.file.fieldname === "video") {
      data = {
        ...req.body,
        from: req.user.id,
        video: req.file.filename,
      };
    } else if (req.file.fieldname === "image") {
      data = {
        ...req.body,
        from: req.user.id,
        image: req.file.filename,
      };
    }
  } else {
    data = {
      ...req.body,
      from: req.user.id,
    };
  }

  return data;
};

exports.sendMessage = catchAsync(async (req, res, next) => {
  const data = checkFile(req, res, next);
  console.log(data.sendTo);

  // verify if there is a user with this id
  const user = await User.findById(data.sendTo);
  if (!user) {
    return next(new AppError("There is no user with this id", 404));
  }

  // send message
  const message = await Message.create(data);

  res.status(201).json({
    message: "Success",
    data: {
      message,
    },
  });
});

exports.deleteMessage = catchAsync(async (req, res, next) => {
  const { _id } = req.params;

  // check if there is a message
  const message = await Message.findById(_id);

  if (!message) {
    return next(new AppError("There is no message with this id", 404));
  }

  // If the user is not the owner of the message, they cannot delete it.
  if (message.from.toString() !== req.user.id.toString()) {
    return next(
      new AppError("You are not allowed to delete this message", 400)
    );
  }

  await Message.deleteOne({ _id });

  res.status(200).json({
    status: "success",
    data: null,
  });
});
