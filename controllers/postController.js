const Post = require("../models/postModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

//TODO: create a function that prevent unauthorized modifications

/**
 * This function retrieves all posts and returns them as a JSON response with a success message and the
 * number of results.
 */
exports.getAllPosts = catchAsync(async (req, res, next) => {
  const posts = await Post.find()
    .populate({
      path: "comment",
      select: "text createdAt",
      populate: {
        path: "author",
        select: "username",
      },
    })
    .exec();

  res.status(200).json({
    results: posts.length,
    msg: "Success",
    posts,
  });
});

exports.getPostById = catchAsync(async (req, res, next) => {
  const { _id } = req.params;
  // find the post
  const post = await Post.findById(_id)
    .populate({
      path: "comment",
      select: "text createdAt",
      populate: {
        path: "author",
        select: "username",
      },
    })
    .exec();

  // check if the post is in the db
  if (!post) {
    return next(new AppError("There is no post with this ID", 404));
  }

  // Prevent unauthorized modifications by only allowing the post creator to make changes
  // if (post.user.toString() !== req.user._id.toString()) {
  //   return next(new AppError("You are not allowed to update this post", 403));
  // }

  res.status(200).json({
    status: "success",
    data: {
      post,
    },
  });
});

/**
 * This function creates a new post and sends a response with the new post data or an error message.
 */
exports.createPost = catchAsync(async (req, res, next) => {
  const data =
    req.file.fieldname === "video"
      ? {
          ...req.body,
          author: req.user.username, // set the author from the protect middleware
          user: req.user._id, // set the user protect middleware
          video: req.file.filename,
        }
      : req.file.fieldname === "image"
      ? {
          ...req.body,
          author: req.user.username,
          user: req.user._id,
          image: req.file.filename,
        }
      : null;

  const newPost = await Post.create(data);

  console.log(req.file);
  res.status(201).json({
    message: "Success",
    data: {
      post: newPost,
    },
  });
});

//! update the photo
exports.updatePost = catchAsync(async (req, res, next) => {
  const { _id } = req.params;
  const post = await Post.findById(_id);

  if (!post) {
    return next(new AppError("There is no post with this ID", 404));
  }

  // Prevent unauthorized modifications by only allowing the post creator to make changes
  if (post.user.toString() !== req.user._id.toString()) {
    return next(new AppError("You are not allowed to update this post", 403));
  }

  const data =
    req.file.fieldname === "video"
      ? { ...req.body, video: req.file.filename }
      : req.file.fieldname === "image"
      ? { ...req.body, image: req.file.filename }
      : null;

  const updatedPost = await Post.findByIdAndUpdate(_id, data, {
    new: true,
    runValidators: true,
  });

  console.log(req.file.filename);

  res.status(200).json({
    status: "success",
    data: {
      post: updatedPost,
    },
  });
});

/* This code exports a function called `deletePost` that deletes a post from the database. It uses the
`catchAsync` middleware to handle any errors that may occur during the execution of the function. */
exports.deletePost = catchAsync(async (req, res, next) => {
  const { _id } = req.params;

  // Prevent unauthorized modifications by only allowing the post creator to make changes
  const post = await Post.findById(_id);

  // check if the id is valid
  if (!post) {
    return next(new AppError("There is no post with this ID", 404));
  }

  // check if the user is the owner of the post
  if (post.user.toString() !== req.user._id.toString()) {
    return next(new AppError("You are not allowed to delete this post", 403));
  }

  await Post.findByIdAndRemove(_id);

  res.status(204).json({
    status: "success",
    data: null,
  });
});
