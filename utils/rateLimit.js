const rateLimit = require("express-rate-limit");
// avoid DOS when they are login in
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: "Too many request from this IP, please try again in 15 minutes",
});

const createAccountLimiter = rateLimit({
  /* `windowMs: 24 * 60 * 60 * 1000` is setting the time window for the rate limit to 24 hours (1 day)
  in milliseconds. This means that the rate limit will apply to requests made within this time
  frame. */
  windowMs: 24 * 60 * 60 * 1000,
  max: 2, // Limit each IP to 5 create account requests per `window` (here, per hour)
  message:
    "Too many accounts created from this IP, please try again after an hour",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

module.exports = {
  loginLimiter,
  createAccountLimiter,
};
