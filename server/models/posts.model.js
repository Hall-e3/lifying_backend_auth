import mongoose from "mongoose";
const postSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  creator: {
    type: String,
    required: true,
  },
  message: {
    type: String,
  },
  selectedFile: {
    type: String,
  },
  tags: [String],
  likeCount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});
export const Post = mongoose.model("Post", postSchema);
