import express from "express";

import {
  getPosts,
  getPost,
  createPost,
  updatePost,
  likePost,
  deletePost,
} from "../../controllers/postsControllers.js";
import { verifyAccessToken } from "../../helpers/jwt.accessTokens.js";

const router = express.Router();

router.get("/", getPosts);
router.post("/", verifyAccessToken, createPost);
router.get("/:id", verifyAccessToken, getPost);
router.patch("/:id", verifyAccessToken, updatePost);
router.delete("/:id", verifyAccessToken, deletePost);
router.patch("/:id/likePost", verifyAccessToken, likePost);

export default router;
