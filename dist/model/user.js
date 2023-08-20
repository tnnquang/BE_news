"use strict";
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
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("../common/config");
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = require("jsonwebtoken");
const userSchema = new mongoose_1.default.Schema({
    password: {
        type: String,
        required: true,
    },
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: "",
    },
    role: {
        type: String,
        default: 'normal',
        required: true
    },
    phone: {
        type: String,
        default: '',
        length: 10
    },
    isDeleted: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified('password'))
            return next();
        try {
            const salt = yield (0, bcrypt_1.genSalt)(8);
            const _hash = yield (0, bcrypt_1.hash)(this.password, salt);
            this.password = _hash;
            return next();
        }
        catch (error) {
            return next(error);
        }
    });
});
userSchema.methods.generateAccessWithJWT = function () {
    let payload = {
        id: this._id,
        role: this.role
    };
    return (0, jsonwebtoken_1.sign)(payload, config_1.SECRET_ACCESS_TOKEN, {
        expiresIn: '1d',
    });
};
userSchema.methods.generateRefreshToken = function () {
    let payload = {
        id: this._id,
        role: this.role
    };
    return (0, jsonwebtoken_1.sign)(payload, config_1.SECRET_REFRESH_TOKEN, {
        expiresIn: '1w'
    });
};
exports.default = mongoose_1.default.model('users', userSchema);
