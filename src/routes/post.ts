import {
  insertData,
  getById,
  getAllByUserId,
  getAllPosts,
  getAllPostOfCat,
  getPostByCatAndNum,
  get10PostOfCatNew,
//   countAll,
  countAllByCat,
  searchByKeywords,
  getFeaturedPost,
  getBySlug,
  getNotCateVideo,
  getDataOfCateNews,
  BloggerPost,
  Comment
} from "../controller/post"
import { UploadThumbnailPost, UploadMultipleImages } from "../controller/upload"

import { Verify, VerifyRole } from "../middleware/verify"
import multer from "multer"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import {v2 as cloudinary} from "cloudinary"
import express from 'express'

const router = express.Router();

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "post_thumbnail/",
    allowedFormats: ["png", "jpeg", "tiff"],
    filename: function (req: any, file: any) {
    return file.originalname
    },
  } as any,
});

const parser = multer({ storage: storage });


const storage_2 = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "blogger_post/",
    allowedFormats: ["jpeg", "png", "tiff"],
    filename: (req: any, file: any) => file.originalname
  } as any,
});

const parser_2 = multer({ storage: storage_2 });


router.post("/insert-single-post", parser.single('thumbnail'), Verify, VerifyRole, UploadThumbnailPost, insertData);
router.post("/post-bogger", parser_2.array('file'), UploadMultipleImages, BloggerPost)
router.post("/comment", Comment);
router.get("/getbyid/:postId", getById);
router.get("/getbyuser/:userId", getAllByUserId);
router.get("/getall", getAllPosts);
router.get("/getallofcat/:cat", getAllPostOfCat);
router.get("/getpostbycatandnum", getPostByCatAndNum);
router.get("/10postlatestofcat/:cat", get10PostOfCatNew);
// router.get('/countall', countAll)
router.get("/countallbycat/:cat", countAllByCat);
router.get("/featured-post", getFeaturedPost);
router.get("/get-slug", getBySlug);
router.get('/get-no-video', getNotCateVideo)

// router.get("/search/keywords=:keywords&page=:page&limit=:limit", searchByKeywords)
router.get('/search', searchByKeywords)
router.get("/get-data-any-cate/limit=:limit&page=:page&cate=:cate", getDataOfCateNews)


module.exports = router
