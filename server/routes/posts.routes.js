import express from "express";
import {
  all_posts,
  create_post,
  update_post,
  delete_post,
} from "../controllers/posts.controllers.js";
const router = express.Router();

router.get("", all_posts);
router.post("/create", create_post);
router.patch("/update/:id", update_post);
router.delete("/delete/:id", delete_post);

export default router;
