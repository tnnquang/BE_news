"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const commentSchema = new mongoose_1.default.Schema({
    content: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
}, { timestamps: true });
const tagSchema = new mongoose_1.default.Schema({
    tag: {
        type: String,
        // unique: true,
        required: false,
    },
}, { timestamps: true });
tagSchema.index({ tag: 1 }, { unique: true, partialFilterExpression: { tag: { $type: "string" } } });
const postSchema = new mongoose_1.default.Schema({
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
        type: mongoose_1.default.Types.ObjectId,
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
}, { timestamps: true });
exports.default = mongoose_1.default.model("posts", postSchema);
