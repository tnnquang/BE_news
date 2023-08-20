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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshAccessToken = exports.refreshToken = exports.receiveRequest = exports.checkEmailIsExisted = exports.Logout = exports.LoginWithAccessToken = exports.Login = exports.getExpFromToken = exports.Register = void 0;
const user_1 = __importDefault(require("../model/user"));
const upload_1 = require("../controller/upload");
const config = __importStar(require("../common/config"));
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = require("jsonwebtoken");
function Register(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, fullname } = req.body;
        try {
            const newUser = new user_1.default({
                // username,
                fullname,
                email,
                password: req.body.password,
            });
            const checkUser = yield user_1.default.findOne({ email });
            if (checkUser)
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: "Tài khoản đã tồn tại",
                });
            const savedUser = yield newUser.save(); // save new user into the database
            const _a = savedUser._doc, { password, role } = _a, userdata = __rest(_a, ["password", "role"]);
            res.status(200).json({
                status: "success",
                data: [userdata],
                code: 200,
                message: "Tạo tài khoản thành công",
            });
        }
        catch (error) {
            res.status(500).json({
                status: "error",
                code: 500,
                data: [],
                message: "Lỗi hệ thống nội bộ",
            });
        }
        res.end();
    });
}
exports.Register = Register;
//Hàm để lấy exp từ access token được tạo ra từ quá trình login không qua Middleware verify
function getExpFromToken(token, secret_key) {
    return (0, jsonwebtoken_1.verify)(token, secret_key);
}
exports.getExpFromToken = getExpFromToken;
function Login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // Lấy các biến cho quá trình đăng nhập
        const { email } = req.body;
        try {
            // Kiểm tra nếu có user
            const user = yield user_1.default.findOne({ email }).select("+password");
            if (!user)
                return res.status(401).json({
                    status: "failed",
                    data: [],
                    message: "Tài khoản không tồn tại",
                });
            // Nếu tài khoản tồn tại
            // Xác thực mật khẩu
            const isPasswordValid = yield (0, bcrypt_1.compare)(`${req.body.password}`, user.password);
            // Nếu không hợp lệ thì trả về fail
            if (!isPasswordValid)
                return res.status(401).send({
                    status: "failed",
                    data: [],
                    message: "Email hoặc mật khẩu không hợp lệ. Vui lòng thử lại với thông tin chính xác!",
                });
            let options = {
                maxAge: 24 * 60 * 60 * 1000, // Sẽ hết hạn trong  1 ngày
            };
            const _a = user._doc, { password } = _a, newUser = __rest(_a, ["password"]);
            const token = user.generateAccessWithJWT();
            const refresh_token = user.generateRefreshToken();
            res.cookie("sessionID", token, options);
            res.header("x-access-token", token);
            res.status(200).json({
                status: "success",
                message: "Bạn đã đăng nhập thành công",
                user: newUser,
                token: token,
                tokenExpire: getExpFromToken(token, config.SECRET_ACCESS_TOKEN).exp,
                refresh_token: refresh_token,
                refresh_token_exp: getExpFromToken(refresh_token, config.SECRET_REFRESH_TOKEN).exp,
            });
        }
        catch (err) {
            res.status(500).json({
                status: "error",
                code: 500,
                data: [],
                message: "Lỗi hệ thống nội bộ: " + err,
            });
        }
        res.end();
    });
}
exports.Login = Login;
function LoginWithAccessToken(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.userId;
            if (userId) {
                const user = yield user_1.default.findById({ _id: userId });
                if (!user)
                    return res.status(404).json({
                        status: "failed",
                        data: [],
                        message: "Tài khoản không tồn tại",
                    });
                res.status(200).send({
                    status: "success",
                    message: "Bạn đã đăng nhập thành công",
                    user: user,
                    token: req.headers["x-access-token"],
                    tokenExpire: req.tokenExpire,
                });
            }
            else
                return res
                    .status(404)
                    .send({ message: "Thông tin userId không hợp lệ", status: 404 });
        }
        catch (error) {
            return res.status(500).send({
                message: "Lỗi hệ thống nội bộ: " + error,
                data: [],
            });
        }
    });
}
exports.LoginWithAccessToken = LoginWithAccessToken;
function Logout(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const cookie_header = req.headers["cookie"];
            if (!cookie_header)
                return res.status(204).json({
                    message: "Không có nội dung",
                    status: 204,
                });
            const cookie = cookie_header.split("=")[1];
            const accessToken = cookie.split(";")[0];
            if (accessToken) {
                res.setHeader("Clear-Site-Data", '"cookies", "storage"');
                res.status(200).json({ message: "Bạn đã đăng xuất" });
            }
        }
        catch (error) {
            res.status(500).json({
                status: "error",
                message: "Lỗi máy chủ nội bộ",
            });
        }
    });
}
exports.Logout = Logout;
function checkEmailIsExisted(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const email = req.body.email;
        const user = yield user_1.default.findOne({ email: email });
        if (user)
            return res.send({ message: "Email đã tồn tại", type: false });
        return res.send({ message: "Email này có thể đăng kí", type: true });
    });
}
exports.checkEmailIsExisted = checkEmailIsExisted;
function UpdateDataUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.userId;
            if (userId) {
                const user = yield user_1.default.findById({ _id: userId });
                if (user) {
                    yield user.updateOne({
                        $set: { fullname: req.body.fullname, phone: req.body.phone },
                    });
                    res.status(200).json({
                        message: "Cập nhật thành công",
                        status: 200,
                        // data: user,
                    });
                }
            }
        }
        catch (error) {
            return res.json({
                data: [],
                message: "Lỗi hệ thống nội bộ: " + error,
            });
        }
    });
}
function receiveRequest(req, res) {
    if (req.file) {
        (0, upload_1.Upload)(req, res);
        UpdateDataUser(req, res);
    }
    else {
        UpdateDataUser(req, res);
    }
}
exports.receiveRequest = receiveRequest;
function refreshToken(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { refresh_token } = req.body;
            const _exp = getExpFromToken(refresh_token, config.SECRET_REFRESH_TOKEN)
                .exp;
            const userId = req.userId;
            if (refresh_token && _exp && _exp * 1000 < Date.now()) {
                const user = yield user_1.default.findById({ id: userId });
            }
        }
        catch (error) {
            res.json({
                message: "Phiên làm việc đã hết hạn, vui lòng đăng nhập lại để tiếp tục sử dụng",
                code: 401,
                status: "Unauthorized",
                flag_sign_out: true,
            });
        }
    });
}
exports.refreshToken = refreshToken;
function RefreshAccessToken(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const refresh_token = req.query.refresh_token;
            if (refresh_token) {
                (0, jsonwebtoken_1.verify)(refresh_token, config.SECRET_REFRESH_TOKEN, (error, decoded) => __awaiter(this, void 0, void 0, function* () {
                    if (error)
                        return res.status(403).json({
                            message: "Bạn không có quyền truy cập: " + error,
                            status: "Forbidden",
                            code: 403,
                            data: null,
                        });
                    const { id, role } = decoded;
                    const token = (0, jsonwebtoken_1.sign)({ id, role }, config.SECRET_ACCESS_TOKEN, {
                        expiresIn: "1d",
                    });
                    return res.status(200).json({
                        message: "New access token",
                        status: "Success",
                        code: 200,
                        data: {
                            token: token,
                            tokenExpire: getExpFromToken(token, config.SECRET_ACCESS_TOKEN)
                                .exp,
                        },
                    });
                }));
            }
            else {
                return res.status(403).json({
                    message: "Bạn không có quyền truy cập",
                    status: "Forbidden",
                    code: 403,
                    data: null,
                });
            }
        }
        catch (error) {
            res.status(500).json({
                status: "Internal Server Error",
                code: 500,
                message: (_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : error,
            });
        }
    });
}
exports.RefreshAccessToken = RefreshAccessToken;
