const Post = require("../models/postModel");

/**
 * This function retrieves all posts and returns them as a JSON response with a success message and the
 * number of results.
 */
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json({
      results: posts.length,
      msg: "Success",
      posts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error retrieving posts" });
  }
};

/**
 * This function creates a new post and sends a response with the new post data or an error message.
 */
exports.createPost = async (req, res) => {
  try {
    const postData = req.body;
    const newPost = await Post.create(postData);
    res.status(201).json({ message: "Success", post: newPost });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error when making the post" });
  }
};
