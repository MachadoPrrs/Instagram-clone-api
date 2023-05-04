const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

const postsRouter = require("./routers/postRouter");
const userRouter = require("./routers/userRouter");
const commentRouter = require("./routers/commentRouter");

const app = express();

//* GLOBAL MIDDLEWARES

//? Set security http headers
app.use(helmet());

//? dev logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//? Body parser, reading data from body into req.body
app.use(express.json());

//? Data sanitization => sql injection => {"$gt":""}
app.use(mongoSanitize());

//?  Data sanitization => XSS => clean html code
app.use(xss());

//? static files
app.use(express.static(`${__dirname}/public`));

//? prevent paremeter pollution
app.use(hpp());

//? Routes
app.use("/api/v1/posts", postsRouter);
app.use("/api/v1/auth", userRouter);
app.use("/api/v1/comments", commentRouter);

module.exports = app;
