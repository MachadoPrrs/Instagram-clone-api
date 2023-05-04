const Comment = require("../models/commentModel");
const Post = require("../models/postModel");
const catchAsync = require("../utils/catchAsync");

exports.getAllComments = catchAsync(async (req, res, next) => {
  const comments = await Comment.find().populate("post", "author");

  res.status(200).json({
    results: comments.length,
    msg: "Success",
    comments,
  });
});

exports.commentPost = catchAsync(async (req, res, next) => {
  const { _id: author } = req.user;
  const commentData = { ...req.body, author };

  const post = await Post.findById(commentData.post);
  if (!post) {
    return res.status(404).json({
      status: "fail",
      message: "Post not found",
    });
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

// TODO: ADD UPDATE AND DELETE POST
