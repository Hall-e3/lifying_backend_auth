import mongoose from "mongoose";
import { Post } from "../models/posts.model.js";
import createErrors from "http-errors";
export const all_posts = async (req, res, next) => {
  try {
    const results = await Post.find();
    res.send(results);
  } catch (error) {
    next(error);
  }
};
export const create_post = async (req, res, next) => {
  try {
    const newPost = await new Post(req.body);
    const savedPost = newPost.save();
    console.log(savedPost);
    res.json(savedPost);
  } catch (error) {
    next(error);
  }
};
export const update_post = async (req, res, next) => {
  const { id: _id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(_id))
      throw createErrors.NotFound(`Object with id ${_id} does not exist`);
    const updatedPost = await Post.findByIdAndUpdate(_id, req.body, {
      new: true,
    });
    // res.send(updatedPost);
    console.log(updatedPost);
  } catch (error) {
    next(error);
  }
};
export const delete_post = async (req, res, next) => {
  try {
    const { id: _id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(_id))
      throw createErrors.NotFound(`Object with id ${_id} does not exist`);
    const successfulDelete = await Post.findByIdAndRemove(_id);
    if (successfulDelete)
      res.send({ message: `Object of ${_id} is deleted successfully` });
  } catch (error) {
    next(error);
  }
};
