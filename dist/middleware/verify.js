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
exports.VerifyRole = exports.Verify = void 0;
const config = __importStar(require("../common/config"));
const jsonwebtoken_1 = require("jsonwebtoken");
const user_1 = __importDefault(require("../model/user"));
const enum_1 = require("../common/enum");
function Verify(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const accessToken = req.headers['x-access-token'];
        // const refresh_token = req.body.refresh_token
        if (!accessToken) {
            return res.status(401); //nếu không có từ request header thì gửi 1 response unauthorized qua code 401
        }
        // parse Token
        (0, jsonwebtoken_1.verify)(accessToken, config.SECRET_ACCESS_TOKEN, (error, decoded) => __awaiter(this, void 0, void 0, function* () {
            if (error)
                return res.status(403).json({
                    message: "Bạn không có quyền truy cập: " + error,
                    status: 'Forbidden',
                    code: 403,
                    data: [],
                });
            const { id, exp, role } = decoded;
            req.userId = id;
            req.tokenExpire = exp;
            req.role = role;
            next();
        }));
    });
}
exports.Verify = Verify;
//Cho admin
function VerifyRole(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.userId;
            const { role } = yield user_1.default.findById({ _id: userId }); // Lấy role từ user
            if (role !== enum_1.ROLE_USER.ADMIN) {
                return res.status(401).json({
                    status: "Unauthorized",
                    code: 401,
                    message: "Bạn không có quyền để truy cập nội dung này",
                });
            }
            req.userId = userId;
            next();
        }
        catch (error) {
            res.status(500).json({
                status: "error",
                code: 500,
                data: [],
                message: "Lỗi máy chủ nội bộ",
            });
        }
    });
}
exports.VerifyRole = VerifyRole;
