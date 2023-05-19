const Post = require("../models/postModel");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");

/* This code exports a function named `search` that handles a search request. The function uses the
`catchAsync` middleware to handle any errors that may occur during the execution of the function. */
exports.search = catchAsync(async (req, res, next) => {
  //extract the search term from the query string of the request object.
  const searchTerm = req.query.s;
  const searchQuery = searchTerm.trim();

  // search users from the query
  const users = await User.find({
    username: { $regex: searchQuery, $options: "i" },
  });
  // search posts from the query
  const posts = await Post.find({
    caption: { $regex: searchQuery, $options: "i" },
  });

  res.status(200).json({
    status: "success",
    users,
    posts,
  });
});
