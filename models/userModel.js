const mongoose = require("mongoose");
const crypto = require("crypto");
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

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

//* manipulate passwordChangedAt
userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000; // token creates after the password has been changed
  next();
});

//* Show users with the active flag set to true
userSchema.pre(/^find/, function (next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
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

//* reset the token in the reset token route
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
