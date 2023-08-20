"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadMultipleImages = exports.UploadMultiple = exports.UploadThumbnailPost = exports.Upload = void 0;
const cloudinary_1 = require("cloudinary");
const user_1 = __importDefault(require("../model/user"));
const config = __importStar(require("../common/config"));
cloudinary_1.v2.config({
    cloud_name: "ddtwpymu5",
    api_key: "952843216889784",
    api_secret: config.CLOUDINARY_SECRET,
    secure: true,
});
// function checkString(str) {
//   const regex = /^[0-9A-Fa-f]{24}$/g;
//   if ((typeof str == "string" && str.length == 12) || str.match(regex)) {
//     return true;
//   } else false;
// }
function Upload(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const file = req.file;
            const userId = req.userId;
            const user = yield user_1.default.findById(userId);
            if (user) {
                yield cloudinary_1.v2.uploader.upload(file.path, {
                    allowed_formats: ["jpeg", "png", "tiff"],
                    folder: `avatar/`,
                    resource_type: "auto",
                    unique_filename: true,
                    image_metadata: true,
                    // filename_override: user._id,
                    overwrite: true,
                }, (error, result) => __awaiter(this, void 0, void 0, function* () {
                    if (error) {
                        console.error(error);
                        res.status(500).json(error);
                        // return error;
                    }
                    else {
                        let a = user.avatar;
                        a = result === null || result === void 0 ? void 0 : result.secure_url;
                        yield user_1.default.updateOne({ _id: user.id }, { avatar: a });
                        res.status(200).end({
                            status: "Success",
                            message: "Upload thành công",
                            code: 200,
                            url: result === null || result === void 0 ? void 0 : result.secure_url,
                        });
                    }
                }));
            }
            else {
                res.status(404).json({
                    message: "Không tìm thấy dữ liệu người",
                    status: 404,
                });
            }
        }
        catch (error) {
            console.error(error);
            res.status(500).json(error);
            return error;
        }
    });
}
exports.Upload = Upload;
function UploadThumbnailPost(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const file = req.file;
            const ress = yield cloudinary_1.v2.uploader.upload(file.path, {
                allowed_formats: ["jpeg", "png", "tiff"],
                folder: `posts_thumbnail/`,
                resource_type: "auto",
                unique_filename: true,
                image_metadata: true,
                // filename_override: user._id,
                overwrite: true,
            });
            req.urlImage = ress === null || ress === void 0 ? void 0 : ress.url;
            next();
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: error, status: 500 });
            next(error);
        }
    });
}
exports.UploadThumbnailPost = UploadThumbnailPost;
function UploadMultiple(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const fileList = req.files;
            const userId = req.userId;
            const user = yield user_1.default.findById(userId);
            if (!user) {
                return res.status(404).json({
                    message: "Không tìm thấy dữ liệu người",
                    status: 404,
                });
            }
            const promises = [];
            const dataList = [];
            for (const file of fileList) {
                const promise = cloudinary_1.v2.uploader.upload(file.path, {
                    allowed_formats: ["jpeg", "png", "tiff"],
                    folder: `post/`,
                    resource_type: "auto",
                    unique_filename: true,
                    image_metadata: true,
                    // filename_override: user._id,
                    overwrite: true,
                });
                promises.push(promise);
            }
            const results = yield Promise.all(promises);
            for (const result of results) {
                dataList.push(result.secure_url);
            }
            res.json({ links: dataList, message: "Đã upload toàn bộ dữ liệu" });
        }
        catch (error) {
            res.status(500).json(error);
            return error;
        }
    });
}
exports.UploadMultiple = UploadMultiple;
function UploadMultipleImages(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const fileList = req.files;
            // console.log('hello', fileList)
            if (!fileList) {
                return res.json({
                    message: "File list invalid",
                });
            }
            const promises = [];
            const dataList = [];
            for (const file of fileList) {
                const promise = cloudinary_1.v2.uploader.upload(file.path, {
                    allowed_formats: ["jpeg", "png", "tiff"],
                    folder: `blogger_post/`,
                    resource_type: "auto",
                    unique_filename: true,
                    image_metadata: true,
                    // filename_override: user._id,
                    overwrite: true,
                });
                promises.push(promise);
            }
            const results = yield Promise.all(promises);
            for (const result of results) {
                dataList.push({ url: result.secure_url });
            }
            req.images = dataList;
            next();
        }
        catch (error) {
            console.error(error);
            res.status(500).json(error);
            return error;
        }
    });
}
exports.UploadMultipleImages = UploadMultipleImages;
// export async function UploadVideo(req: any, res: any) {
//   try {
//     if (!req.file) {
//       return res.status(400).send({ message: "Không có file" });
//     }
//     const file = req.file;
//     console.log('video', fs.createReadStream(file, {encoding: "binary"}))
//     const config = {
//       headers: {
//         "Content-Type": "multipart/form-data",
//         "api_key": "123774v9eris7ejjr68vkb",
//       },
//     };
//     const formData = new FormData();
//     formData.append("file", fs.createReadStream(file));
//     const response = await axios
//       .post(DOODSTREAM_API, CircularJSON.stringify(formData), config)
//       .then( export async (data) => await data.json()).then((value) => res.send({message: value}))
//       .catch((error) => res.send({ message: "Error: " + error }));
//     return res.status(200).send({
//       message: "Success",
//       data: response,
//     });
//   } catch (error) {
//     return res.status(500).send({
//       message: error,
//       status: 500,
//       file: req
//     });
//   }
// }
