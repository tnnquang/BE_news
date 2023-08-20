"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const post_1 = require("../controller/post");
const upload_1 = require("../controller/upload");
const verify_1 = require("../middleware/verify");
const multer_1 = __importDefault(require("multer"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const cloudinary_1 = require("cloudinary");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: {
        folder: "post_thumbnail/",
        allowedFormats: ["png", "jpeg", "tiff"],
        filename: function (req, file) {
            return file.originalname;
        },
    },
});
const parser = (0, multer_1.default)({ storage: storage });
const storage_2 = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: {
        folder: "blogger_post/",
        allowedFormats: ["jpeg", "png", "tiff"],
        filename: (req, file) => file.originalname
    },
});
const parser_2 = (0, multer_1.default)({ storage: storage_2 });
router.post("/insert-single-post", parser.single('thumbnail'), verify_1.Verify, verify_1.VerifyRole, upload_1.UploadThumbnailPost, post_1.insertData);
router.post("/post-bogger", parser_2.array('file'), upload_1.UploadMultipleImages, post_1.BloggerPost);
router.post("/comment", post_1.Comment);
router.get("/getbyid/:postId", post_1.getById);
router.get("/getbyuser/:userId", post_1.getAllByUserId);
router.get("/getall", post_1.getAllPosts);
router.get("/getallofcat/:cat", post_1.getAllPostOfCat);
router.get("/getpostbycatandnum", post_1.getPostByCatAndNum);
router.get("/10postlatestofcat/:cat", post_1.get10PostOfCatNew);
// router.get('/countall', countAll)
router.get("/countallbycat/:cat", post_1.countAllByCat);
router.get("/featured-post", post_1.getFeaturedPost);
router.get("/get-slug", post_1.getBySlug);
router.get('/get-no-video', post_1.getNotCateVideo);
// router.get("/search/keywords=:keywords&page=:page&limit=:limit", searchByKeywords)
router.get('/search', post_1.searchByKeywords);
router.get("/get-data-any-cate/limit=:limit&page=:page&cate=:cate", post_1.getDataOfCateNews);
module.exports = router;
