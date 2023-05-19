const AppError = require("../utils/appError");

/**
 * The function handles a cast error in a database and returns an error message.
 * @param err - The "err" parameter is an error object that is thrown when there is a casting error in
 * the database. It contains information about the error, such as the path and value that caused the
 * error.
 * @returns A new instance of the `AppError` class with a message that includes the path and value of
 * the invalid input, and a status code of 400.
 */
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

/**
 * This function creates a new error message for invalid JWT tokens.
 */
const handleJWTError = () =>
  new AppError("Invalid token. Please log in again!", 401);

/**
 * This function creates a new error message for when a JWT token has expired.
 */
const handleJWTExpiredError = () =>
  new AppError("Your token has expired! Please log in again.", 401);

/**
 * The function sends a detailed error response in JSON format for development purposes.
 */
const sendErrorDev = (err, req, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

module.exports = (err, req, res, next) => {
  //   console.log(err.stack);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  let error = { ...err };
  error.message = err.message;

  if (process.env.NODE_ENV === "development") {
    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.name === "JsonWebTokenError") error = handleJWTError();
    if (error.name === "TokenExpiredError") error = handleJWTExpiredError();
    sendErrorDev(err, req, res);
  }
};
