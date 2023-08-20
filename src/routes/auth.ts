import { Register, Login, Logout, LoginWithAccessToken, checkEmailIsExisted, receiveRequest, RefreshAccessToken } from "../controller/auth"
import {Validate} from "../middleware/validate"
import{ check } from "express-validator"
import { Verify } from "../middleware/verify"
import multer from "multer"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import {v2 as cloudinary} from "cloudinary"
import express from 'express'


const router = express.Router(); 

router.post(
  "/register",
  check("email")
    .isEmail()
    .withMessage("Hãy nập email đúng định dạng")
    .normalizeEmail(),
  check("fullname")
    .not()
    .isEmpty()
    .withMessage("Tên đầy đủ là bắt buộc")
    .trim()
    .escape(),
  check("password")
    .notEmpty()
    .isLength({ min: 8 })
    .withMessage("Mật khẩu phải ít nhất 8 kí tự"),
  Validate,
  Register
);

//Login
router.post(
  '/login',
  check('email')
    .isEmail()
    .withMessage('Hãy nhập email chính xác')
    .normalizeEmail(),
  check('password').not().isEmpty().withMessage('Hãy nhập mật khẩu chính xác'),
  Validate,
  Login
);


router.post('/logout', Logout)
router.post('/loginwithaccesstoken', Verify, LoginWithAccessToken)
router.post('/check-email', checkEmailIsExisted)
router.post('/refresh_token', RefreshAccessToken)

const storage_2 = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "avatar/",
    allowedFormats: ["jpg", "png", "tif", "tiff"],
    filename: function (req: any, file: any) {
    return file.originalname
    },
  } as any,
});

const parser_2 = multer({ storage: storage_2 });

router.post('/update-info', parser_2.single('file'), Verify, receiveRequest)

module.exports = router
