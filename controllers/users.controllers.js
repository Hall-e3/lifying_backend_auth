import { User } from "../models/users.model.js";
import createErrors from "http-errors";
import { userLogin, userRegister } from "../helpers/joiUserSchemaValidator.js";
import {
  refreshAccessToken,
  signedAccessToken,
  verifyRefreshToken,
} from "../helpers/jwt.accessTokens.js";
import { sendConfirmationEmail } from "../config/nodemailer.config.js";
import { email_confirmation_code } from "../helpers/randomSecret.js";

export const register = async (req, res, next) => {
  try {
    const validUser = await userRegister.validateAsync(req.body);
    const oldUser = await User.findOne({ email: validUser.email });
    if (oldUser) throw createErrors.Conflict(`${oldUser.email} already exists`);
    if (validUser.password !== validUser.confirm_password)
      throw createErrors.Unauthorized("Password do not match");
    const newUser = await User.create(validUser);
    const accessToken = await signedAccessToken(newUser._id);
    const refreshToken = await refreshAccessToken(newUser._id);
    const emailConfirmationCode = email_confirmation_code();
    newUser.token = accessToken;
    newUser.refresh_token = refreshToken;
    newUser.confirmation_code = emailConfirmationCode;
    const name = ` ${newUser.last_name} ${newUser.first_name}`;
    await newUser.save((error) => {
      if (error) res.status(500).send(error.message);
      res.send("User was registered successfully!, please check your email");
      sendConfirmationEmail(name, newUser.email, newUser.confirmation_code);
    });
    // res.send(newUser);
  } catch (error) {
    if (error.isJoi == true) error.status = 422;
    next(error);
  }
};
// email verification and confirmation
export const userEmailVerification = async (req, res, next) => {
  try {
    const { confirmation_code } = req.params;
    const user = await User.findOne({ confirmation_code });
    if (!user) throw createErrors.NotFound("User does not exists");
    user.status = "Active";
    await user.save();
    if (user.status === "Active") {
      res.redirect("/confirm");
    }
    res.send(user);
  } catch (error) {
    next(error);
  }
};

// refresh token array
let refreshTokens = [];

export const login = async (req, res, next) => {
  try {
    const validUser = await userLogin.validateAsync(req.body);
    const user = await User.findOne({ email: validUser.email });
    if (!user) throw createErrors.NotFound("User is not registered");
    const matchedPassword = await user.comparedPassword(validUser.password);
    console.log(matchedPassword);
    if (!matchedPassword)
      throw createErrors.Unauthorized("Incorrect credentials");
    if (user && matchedPassword) {
      if (user.status !== "Active") {
        res
          .status(401)
          .send({ message: "Pending Account, please verify your email" });
      }
      const accessToken = user.token;
      const refreshTokies = user.refresh_token;
      refreshTokens.push(refreshTokies);
      console.log(refreshTokens);
      res.send({ accessToken, refreshTokies });
    }
    res.send(user);
  } catch (error) {
    if (error.isJoi === true) error.status = 422;
    // return next(createErrors.BadRequest());
    next(error);
  }
};

export const refreshTokie = async (req, res, next) => {
  try {
    const { refreshTokies } = req.body;
    if (!refreshTokies) throw createErrors.BadRequest();
    if (!refreshTokens.includes(refreshTokies)) throw createErrors.BadRequest();
    refreshTokens = refreshTokens.filter((token) => token !== refreshTokies);
    console.log(refreshTokens);
    const user_id = await verifyRefreshToken(refreshTokies);
    const accessToken = await signedAccessToken(user_id);
    const refreshToken = await refreshAccessToken(user_id);
    refreshTokens.push(refreshToken);
    console.log(refreshTokens);
    res.send({ accessToken: accessToken, refreshTokies: refreshToken });
  } catch (error) {
    next(error);
  }
};

export const deleteAccount = async (req, res, next) => {
  try {
    const { refreshTokies } = req.body;
    if (!refreshTokies) throw createErrors.BadRequest();
    const user_id = await verifyRefreshToken(refreshTokies);
    console.log(user_id);
    if (user_id === req.params.id) {
      const deletedAccount = await User.findByIdAndDelete(user_id);
      if (deletedAccount) res.send("User account is deleted successfully");
    } else {
      throw createErrors.Unauthorized(
        "You are not allowed to delete this account"
      );
    }
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { refreshTokies } = req.body;
    refreshTokens = refreshTokens.filter((token) => token !== refreshTokies);
    res.status(200).send("You logged out successfully");
  } catch (error) {
    next(error);
  }
};
