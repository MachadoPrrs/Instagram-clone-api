const Post = require("../models/postModel");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const QueryBuilder = require("../utils/queries");

/**
 * The VerifyData function checks if the uploaded file is a video or an image and returns the data with
 * the author, user, and filename.
 */
const VerifyData = (req, res, next) => {
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
  return data;
};

/* `exports.likePost` is a function that allows a user to like a post. I */
exports.likePost = catchAsync(async (req, res, next) => {
  const { _id } = req.params;
  const user = req.user._id;
  // check if there's a post
  const post = await Post.findById(_id);
  if (!post) next(new AppError("There is no post with this id", 404));

  // Check if the user has already liked the post
  const userIndex = post.likes.indexOf(user);
  if (userIndex !== -1) {
    return next(new AppError("You have already liked this post", 400));
  }

  // update post
  await Post.findByIdAndUpdate(_id, { $push: { likes: user } });

  res.status(200).json({
    status: "success",
    message: "Post liked successfully",
  });
});

/* `exports.removeLike` is a function that removes a like from a post.  */
exports.removeLike = catchAsync(async (req, res, next) => {
  const { _id } = req.params;
  const user = req.user._id;

  // check if there's a post
  const post = await Post.findById(_id);
  if (!post) next(new AppError("There is no post with this id", 404));

  // Check if the user has already liked the post
  const userIndex = post.likes.indexOf(user);
  if (userIndex === -1) {
    return next(new AppError("You have not liked this post", 400));
  }

  // Remove the user's like from the post
  post.likes.splice(userIndex, 1);
  await post.save();

  res.status(200).json({
    status: "success",
    message: "Post like removed successfully",
  });
});

// This function displays the posts of a user only if they are following them.
exports.getNewsFeed = catchAsync(async (req, res, next) => {
  console.log(req.query);
  // Get the current user
  const currentUser = await User.findById(req.user.id);

  // Gets the users that the current user is following
  const followingIds = currentUser.followingUsers.map((user) => user._id);

  // Searches for the posts of followed users and populates their comments and tagged users.
  const features = new QueryBuilder(
    Post.find({ user: { $in: followingIds } }),
    req.query
  ).filter();

  const posts = await features.execPopulate();

  // Show the results
  res.status(200).json({
    results: posts.length,
    msg: "Success",
    posts,
  });
});

/**
 * This function retrieves all posts and returns them as a JSON response with a success message and the
 * number of results.
 */
exports.getAllPosts = catchAsync(async (req, res, next) => {
  // Busca todos los posts y populamos los comentarios y los usuarios etiquetados
  const features = new QueryBuilder(Post.find(), req.query).filter();

  const posts = await features.execPopulate();

  // Envía una respuesta con los resultados y los posts
  res.status(200).json({
    results: posts.length,
    msg: "Success",
    posts,
  });
});

/* `exports.getPostById` is a function that retrieves a post from the database by its ID and returns it
as a JSON response.*/
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
    .populate({
      path: "taggedUsers",
      select: "username",
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
  // Verify whether the user is uploading an image or a video.
  const data = VerifyData(req, res, next);
  // search taggedUsers
  if (req.body.taggedUsers && req.body.taggedUsers.length > 0) {
    const taggedUsers = await User.find({
      username: { $in: req.body.taggedUsers },
    });
    if (taggedUsers.length !== req.body.taggedUsers.length) {
      return next(new AppError("One or more tagged users not found", 404));
    }
    data.taggedUsers = taggedUsers.map((user) => user._id);
  }

  const newPost = await Post.create(data);

  res.status(201).json({
    message: "Success",
    data: {
      post: newPost,
    },
  });
});

/* `exports.updatePost` is a function that updates a post in the database.*/
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

  if (req.body.taggedUsers && req.body.taggedUsers.length > 0) {
    const taggedUsers = await User.find({
      username: { $in: req.body.taggedUsers },
    });
    if (taggedUsers.length !== req.body.taggedUsers.length) {
      return next(new AppError("One or more tagged users not found", 404));
    }
    data.taggedUsers = taggedUsers.map((user) => user._id);
  }

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

/* This code exports a function called `deletePost` that deletes a post from the database.*/
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
