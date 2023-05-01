const mongoose = require("mongoose");
const crypto = require("crypto-js");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 4,
      maxlength: 20,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
      trim: true,
    },
    passwordConfirm: {
      type: String,
      select: false,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
    },
    bio: String,
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowerCase: true,
    },
    phonenumber: Number,
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    profilePicture: {
      type: String,
      default: "no-profile-picture.jpg",
    },
    // posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }], // acutalizar cuando el usuario postee algo
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        delete ret._id;
        delete ret.__v;
        delete ret.active;
      },
    },
  }
);

//* Hash the password => pre middleware
userSchema.pre("save", async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) return next();

  // Hash the password
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field from db
  this.passwordConfirm = undefined;

  next();
});

//* Compare the password with the db when the is logging
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

//* verity if the user changed the password
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  /* This code is a method called `changedPasswordAfter` that checks if the user has changed their
  password after a certain timestamp. It takes in a `JWTTimestamp` parameter and compares it to the
  `passwordChangedAt` property of the user object. If the `passwordChangedAt` property exists, it
  converts it to a Unix timestamp and compares it to the `JWTTimestamp`. If the `JWTTimestamp` is
  less than the `changedTimestamp`, it means the user has changed their password after the token was
  issued, so the method returns `true`. Otherwise, it returns `false`. This is used for security
  purposes to ensure that a user cannot use an old token to access protected routes if they have
  changed their password since the token was issued. */
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
