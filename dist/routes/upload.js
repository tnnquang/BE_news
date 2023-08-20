"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const upload_1 = require("../controller/upload");
const multer_1 = __importDefault(require("multer"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const cloudinary_1 = require("cloudinary");
const verify_1 = require("../middleware/verify");
const router = require("express").Router();
const storage_1 = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: {
        folder: "avatar/",
        allowedFormats: ["jpg", "png", "tiff"],
        filename: (req, file) => file.originalname,
    },
});
const storage_2 = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: {
        folder: "post/",
        allowedFormats: ["jpeg", "png"],
        filename: (req, file) => file.originalname,
    },
});
// const file = multer({dest: 'test_upload/'})
const parser = (0, multer_1.default)({ storage: storage_1 });
const parser_2 = (0, multer_1.default)({ storage: storage_2 });
router.post("/avatar", parser.single("file"), verify_1.Verify, upload_1.Upload);
//Cần cải tiến lại
router.post("/post", parser_2.single("file"), verify_1.Verify, upload_1.Upload);
router.post("/post-multiple", parser_2.any(), verify_1.Verify, verify_1.VerifyRole, upload_1.UploadMultiple);
// router.post('/multiple-images', parser_2.array('file'), UploadMultipleImages)
module.exports = router;
