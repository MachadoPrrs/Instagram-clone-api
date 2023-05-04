const User = require("../models/userModel");
const Post = require("../models/postModel");
const catchAsync = require("../utils/catchAsync");

//TODO: create a function that prevent unauthorized modifications
// const checkPostOwnership = function (_id) {};

/**
 * This function retrieves all posts and returns them as a JSON response with a success message and the
 * number of results.
 */
exports.getAllPosts = catchAsync(async (req, res) => {
  const posts = await Post.find()
    .populate({
      path: "comment",
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

/**
 * This function creates a new post and sends a response with the new post data or an error message.
 */
exports.createPost = catchAsync(async (req, res) => {
  // set the user id from the protect middleware
  const { _id: user } = req.user;

  // get the author name from the id
  const authorName = await User.findById(user);
  // check if the author exist in the db
  if (!authorName) {
    return res.status(404).json({
      status: "fail",
      message: "Username not found",
    });
  }
  // set the author name
  const author = authorName.username;

  const postData = { ...req.body, author, user };

  const newPost = await Post.create(postData);

  res.status(201).json({
    message: "Success",
    data: {
      post: newPost,
    },
  });
});

//TODO: update the photo
exports.updatePost = catchAsync(async (req, res, next) => {
  const { _id } = req.params;
  const post = await Post.findById(_id);

  if (!post) {
    return res.status(404).json({
      status: "fail",
      message: "Post not found",
    });
  }

  // Prevent unauthorized modifications by only allowing the post creator to make changes
  if (post.user.toString() !== _id.toString()) {
    return res.status(403).json({
      message: "You are not allowed to update this post",
    });
  }

  const updatedPost = await Post.findByIdAndUpdate(_id, req.body, {
    new: true,
    runValidators: true,
  });

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
  if (post.user.toString() !== _id.toString()) {
    return res.status(403).json({
      message: "You are not allowed to update this post",
    });
  }

  await Post.findByIdAndRemove(_id);

  res.status(204).json({
    status: "success",
    data: null,
  });
});
