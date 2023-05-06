/*
This function is an Express middleware used to wrap async 
functions and handle errors consistently throughout the application.
*/
module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => next(err));
  };
};
