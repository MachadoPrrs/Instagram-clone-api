const jwt = require("jsonwebtoken");

//* SIGN THE TOKEN
const signToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("No JWT secret defined!");
  }

  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

//* SET THE TOKEN
exports.setToken = (user, req, res) => {
  const token = signToken(user._id);

  if (!process.env.JWT_EXPIRES_IN) {
    throw new Error("No JWT secret defined!");
  }

  res.cookie("jwt", token, {
    expires:
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    httpOnly: true,
  });

  user.password = undefined;
  user.passwordConfirm = undefined;

  return token;
};
