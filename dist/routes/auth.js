"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("../controller/auth");
const validate_1 = require("../middleware/validate");
const express_validator_1 = require("express-validator");
const verify_1 = require("../middleware/verify");
const multer_1 = __importDefault(require("multer"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const cloudinary_1 = require("cloudinary");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.post("/register", (0, express_validator_1.check)("email")
    .isEmail()
    .withMessage("Hãy nập email đúng định dạng")
    .normalizeEmail(), (0, express_validator_1.check)("fullname")
    .not()
    .isEmpty()
    .withMessage("Tên đầy đủ là bắt buộc")
    .trim()
    .escape(), (0, express_validator_1.check)("password")
    .notEmpty()
    .isLength({ min: 8 })
    .withMessage("Mật khẩu phải ít nhất 8 kí tự"), validate_1.Validate, auth_1.Register);
//Login
router.post('/login', (0, express_validator_1.check)('email')
    .isEmail()
    .withMessage('Hãy nhập email chính xác')
    .normalizeEmail(), (0, express_validator_1.check)('password').not().isEmpty().withMessage('Hãy nhập mật khẩu chính xác'), validate_1.Validate, auth_1.Login);
router.post('/logout', auth_1.Logout);
router.post('/loginwithaccesstoken', verify_1.Verify, auth_1.LoginWithAccessToken);
router.post('/check-email', auth_1.checkEmailIsExisted);
router.post('/refresh_token', auth_1.RefreshAccessToken);
const storage_2 = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: {
        folder: "avatar/",
        allowedFormats: ["jpg", "png", "tif", "tiff"],
        filename: function (req, file) {
            return file.originalname;
        },
    },
});
const parser_2 = (0, multer_1.default)({ storage: storage_2 });
router.post('/update-info', parser_2.single('file'), verify_1.Verify, auth_1.receiveRequest);
module.exports = router;
