const express = require("express");
const morgan = require("morgan");

const postsRouter = require("./routers/postRouter");
const userRouter = require("./routers/userRouter");

const app = express();

// GLOBAL MIDDLEWARES

// dev logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Body parser, reading data from body into req.body
app.use(express.json());

// Routes
app.use("/api/v1/posts", postsRouter);
app.use("/api/v1/auth", userRouter);

module.exports = app;
