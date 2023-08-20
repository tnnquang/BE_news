"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLOUDINARY_SECRET = exports.SECRET_REFRESH_TOKEN = exports.DOODSTREAM_API = exports.PORT = exports.SECRET_ACCESS_TOKEN = exports.URI = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
_a = process.env, exports.URI = _a.URI, exports.SECRET_ACCESS_TOKEN = _a.SECRET_ACCESS_TOKEN, exports.PORT = _a.PORT, exports.DOODSTREAM_API = _a.DOODSTREAM_API, exports.SECRET_REFRESH_TOKEN = _a.SECRET_REFRESH_TOKEN, exports.CLOUDINARY_SECRET = _a.CLOUDINARY_SECRET;
