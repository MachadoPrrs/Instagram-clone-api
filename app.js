const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

const postsRouter = require("./routers/postRouter");
const userRouter = require("./routers/userRouter");
const commentRouter = require("./routers/commentRouter");
const searchRouter = require("./routers/searchRouter");
const sendMessageRouter = require("./routers/messageRouter");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

const app = express();

//* GLOBAL MIDDLEWARES

// Set security http headers
app.use(helmet());

// dev logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Body parser, reading data from body into req.body
app.use(express.json());

// Data sanitization => sql injection => {"$gt":""}
app.use(mongoSanitize());

//  Data sanitization => XSS => clean html code
app.use(xss());

// static files
app.use(express.static(`${__dirname}/public`));

// prevent paremeter pollution
app.use(hpp());

// Routes
app.use("/api/v1/posts", postsRouter);
app.use("/api/v1/auth", userRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/", searchRouter);
app.use("/api/v1/sendMessage/", sendMessageRouter);

// Handling unhandling routes
app.all("*", (req, res, next) => {
  // pass the error
  next(new AppError(`Can not find ${req.originalUrl}`, 404));
});

// Error handling middleware
app.use(globalErrorHandler);

module.exports = app;
