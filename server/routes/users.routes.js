import express from "express";
import {
  login,
  register,
  logout,
  refreshTokie,
  deleteAccount,
  userEmailVerification,
} from "../controllers/users.controllers.js";

const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.post("/confirm/:confirmation_code", userEmailVerification);
router.post("/refresh", refreshTokie);
router.post("/logout", logout);
router.delete("/delete/:id", deleteAccount);

export default router;
