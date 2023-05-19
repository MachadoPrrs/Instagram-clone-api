const Comment = require("../models/commentModel");
const Post = require("../models/postModel");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

/* `exports.getAllComments` is a function that retrieves all comments from the database and sends them
as a response to the client.*/
exports.getAllComments = catchAsync(async (req, res, next) => {
  const comments = await Comment.find().populate("post", "author");

  res.status(200).json({
    results: comments.length,
    msg: "Success",
    comments,
  });
});

/* `exports.commentPost` is a function that creates a new comment on a post. */
exports.commentPost = catchAsync(async (req, res, next) => {
  // Comment a post
  const { _id: author } = req.user;
  const commentData = { ...req.body, author };

  // search taggedUsers
  if (req.body.taggedUsers && req.body.taggedUsers.length > 0) {
    const taggedUsers = await User.find({
      username: { $in: req.body.taggedUsers },
    });
    if (taggedUsers.length !== req.body.taggedUsers.length) {
      return next(new AppError("One or more tagged users not found", 404));
    }
    commentData.taggedUsers = taggedUsers.map((user) => user._id);
  }

  // find if there is a post
  const post = await Post.findById(commentData.post);
  if (!post) {
    return next(new AppError("Post not found", 404));
  }

  // set the comment id in the postmodel
  const comment = await Comment.create(commentData);

  await Post.findByIdAndUpdate(
    comment.post,
    {
      $push: { comment: comment._id },
    },
    { new: true }
  );

  res.status(201).json({
    status: "success",
    data: {
      comment,
    },
  });
});

/* This code exports a function called `updateComment` that updates a comment in the database. It uses
the `catchAsync` middleware to handle any errors that may occur during the execution of the
function. */
exports.updateComment = catchAsync(async (req, res, next) => {
  const { _id } = req.params;
  // check if there's a comment in the db
  const comment = await Comment.findById(_id);
  if (!comment)
    return next(new AppError("There is no comment with this id", 404));

  //check the comment owner
  if (comment.author.toString() !== req.user.id.toString()) {
    return next(
      new AppError("You do not have permission to edit this comment.", 403)
    );
  }
  // update the comment
  const newComment = await Comment.findByIdAndUpdate(_id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      newComment,
    },
  });
});

/* This code exports a function called `deleteComment` that deletes a comment from the database. It
uses the `catchAsync` middleware to handle any errors that may occur during the execution of the
function. */
exports.deleteComment = catchAsync(async (req, res, next) => {
  const { _id } = req.params;
  // check if there's a comment in the db
  const comment = await Comment.findById(_id);
  if (!comment)
    return next(new AppError("There is no comment with this id", 404));

  //check the comment owner
  if (comment.author.toString() !== req.user.id.toString()) {
    return next(
      new AppError("You don't have permission to edit this comment.", 403)
    );
  }

  await Comment.findByIdAndRemove(_id);

  res.status(200).json({
    status: "success",
    data: null,
  });
});
