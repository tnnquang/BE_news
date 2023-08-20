"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateString = exports.convertToSlug = void 0;
function convertToSlug(text) {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[đĐ]/g, (char) => (char === "đ" ? "d" : "D"))
        .replace(/[^a-z0-9]/g, "-");
}
exports.convertToSlug = convertToSlug;
function generateString(length) {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
exports.generateString = generateString;
