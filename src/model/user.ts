import mongoose from "mongoose"
import {SECRET_ACCESS_TOKEN, SECRET_REFRESH_TOKEN } from '../common/config'
import { genSalt, hash } from "bcrypt";
import { sign } from "jsonwebtoken";


const userSchema = new mongoose.Schema({
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

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await genSalt(8);
        const _hash = await hash(this.password, salt);
        this.password = _hash;
        return next();
    } catch (error: any) {
        return next(error);
    }
});

userSchema.methods.generateAccessWithJWT = function() {
    let payload = {
        id: this._id,
        role: this.role
    };
    return sign(payload, SECRET_ACCESS_TOKEN as any, {
        expiresIn: '1d',
    });
};

userSchema.methods.generateRefreshToken = function() {
    let payload = {
        id: this._id,
        role: this.role
    };
    return sign(payload, SECRET_REFRESH_TOKEN as any, {
        expiresIn: '1w'
    });
};

export default mongoose.model('users', userSchema);
