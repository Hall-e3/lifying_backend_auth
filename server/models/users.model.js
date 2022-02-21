import mongoose from "mongoose";
import bcrypt from "bcrypt";
const userSchema = mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: true,
  },
  role: { type: String },
  password: { type: String },
  confirm_password: { type: String },
  token: { type: String },
  refresh_token: { type: String },
  status: {
    type: String,
    enum: ["Pending", "Active"],
    default: "Pending",
  },
  confirmation_code: {
    type: String,
    unique: true,
  },
  creadtedAt: {
    type: Date,
    default: Date.now(),
  },
});

userSchema.pre("save", async function (next) {
  try {
    var user = this;
    const SALT_WORK_FACTOR = 10;
    if (!user.isModified("password")) return next();

    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
      if (err) return next(err);

      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparedPassword = function (candidatePassword) {
  try {
    return bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    if (error) return error;
  }
};

export const User = mongoose.model("User", userSchema);
