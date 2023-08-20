import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const tagSchema = new mongoose.Schema(
  {
    tag: {
      type: String,
      // unique: true,
      required: false,
    },
  },
  { timestamps: true }
);

tagSchema.index(
  { tag: 1 },
  { unique: true, partialFilterExpression: { tag: { $type: "string" } } }
);

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
      index: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    userID: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    cate: {
      type: String,
      required: true,
    },
    comment: {
      type: [commentSchema],
      required: false,
    },
    tags: {
      type: [tagSchema],
      required: false,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    price: {
      type: String,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("posts", postSchema);

