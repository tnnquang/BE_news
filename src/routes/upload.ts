import { Upload, UploadMultiple } from "../controller/upload";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import { Verify, VerifyRole } from "../middleware/verify";

const router = require("express").Router();

const storage_1 = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "avatar/",
    allowedFormats: ["jpg", "png", "tiff"],
    filename: (req: any, file: any) => file.originalname,
  } as any,
});

const storage_2 = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "post/",
    allowedFormats: ["jpeg", "png"],
    filename: (req: any, file: any) => file.originalname,
  } as any,
});

// const file = multer({dest: 'test_upload/'})

const parser = multer({ storage: storage_1 });
const parser_2 = multer({ storage: storage_2 });

router.post("/avatar", parser.single("file"), Verify, Upload);

//Cần cải tiến lại
router.post("/post", parser_2.single("file"), Verify, Upload);

router.post(
  "/post-multiple",
  parser_2.any(),
  Verify,
  VerifyRole,
  UploadMultiple
);
// router.post('/multiple-images', parser_2.array('file'), UploadMultipleImages)

module.exports = router