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
exports.BloggerPost = exports.Comment = exports.getDataOfCateNews = exports.searchByKeywords = exports.getBySlug = exports.getNotCateVideo = exports.getFeaturedPost = exports.insertData = exports.getPostByCatAndNum = exports.get10PostOfCatNew = exports.countAllByCat = exports.countAll = exports.getById = exports.getAllByUserId = exports.getAllPostOfCat = exports.getAllPosts = void 0;
const post_1 = __importDefault(require("../model/post"));
const function_1 = require("../common/function");
const googleapis_1 = require("googleapis");
//Xác minh Google
const key = {
    client_id: "18836317239-968e7psnpkbakor6f4sej1hged6dibth.apps.googleusercontent.com",
    client_secret: "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",
};
const client = new googleapis_1.google.auth.JWT(key.client_id, "", key.client_secret, [
    "https://www.googleapis.com/auth/blogger",
]);
function getAllPosts(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        //OK
        try {
            const dataPost = yield post_1.default.find({});
            return res.json({ message: "Thành công", data: dataPost, code: 200 });
        }
        catch (error) {
            res.status(500).json({ message: error });
        }
    });
}
exports.getAllPosts = getAllPosts;
function getAllPostOfCat(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        //OK
        try {
            const cat = req.params.cat;
            if (cat) {
                const dataPost = yield post_1.default.find({ cate: cat });
                return res.json({ message: "Thành công", data: dataPost });
            }
            else
                return res.json({ message: "Không tìm thấy loại bài báo" });
        }
        catch (error) {
            return res.json({ message: "Lỗi: " + error });
        }
    });
}
exports.getAllPostOfCat = getAllPostOfCat;
function getAllByUserId(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        //OK
        try {
            const id = req.params.userId;
            if (id) {
                const dataPost = yield post_1.default.find({ userID: id });
                return res.json({
                    message: "Thành công",
                    data: dataPost,
                });
            }
        }
        catch (error) {
            return res.json({ message: error, data: null });
        }
    });
}
exports.getAllByUserId = getAllByUserId;
function getById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        //OK
        try {
            const id = req.params.postId;
            if (id) {
                yield post_1.default
                    .findById({ _id: id })
                    .then((data) => {
                    return res.status(200).send({ data: data });
                })
                    .catch((reason) => {
                    return res.json({ message: "Lỗi: " + reason, data: null });
                });
            }
            else
                return res.json({ message: "Không tìm thấy bài viết thei id này" });
        }
        catch (error) {
            res.json({ message: "Lỗi hệ thống: " + (error === null || error === void 0 ? void 0 : error.message), status: 500 });
        }
    });
}
exports.getById = getById;
function countAll() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const s = yield post_1.default.countDocuments({});
            return s;
        }
        catch (err) {
            return 0; // hoặc giá trị mặc định của biến s
        }
    });
}
exports.countAll = countAll;
function countAllByCat(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // Hàm này OK
        let s = 0;
        const cat = req.params.cat;
        yield post_1.default
            .countDocuments({ cate: cat })
            .then((value) => {
            s = value;
            return res.json({ count: s, message: "Đếm thành công", status: 200 });
        })
            .catch((error) => {
            return res.json({ message: error, count: s });
        });
    });
}
exports.countAllByCat = countAllByCat;
function get10PostOfCatNew(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        //OK
        //Lấy 10 bài mới nhất của 1 loại nào đó nhận từ parmameters của url
        try {
            const cat = req.params.cat;
            yield post_1.default
                .find({ cate: cat })
                .sort({ created_at: -1 })
                .limit(10)
                .then((value) => res.json({ message: "Thành công", data: value }))
                .catch((error) => {
                return res.json({ message: error, data: null });
            });
        }
        catch (error) {
            res.json({ message: "Lỗi: " + error.message, data: null });
        }
    });
}
exports.get10PostOfCatNew = get10PostOfCatNew;
function getPostByCatAndNum(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        //OK
        // tìm kiếm 1 số lượng bản ghi mới nhất của 1 loại
        try {
            const { num, cate } = req.query;
            yield post_1.default
                .find({ cate: cate })
                .sort({ created_at: -1 })
                .limit(num)
                .then((value) => res.json({ message: "Thành công", data: value }))
                .catch((error) => {
                return res.json({ message: error.message, data: null });
            });
        }
        catch (error) {
            return res.json({ message: "Lỗi: " + error.message });
        }
    });
}
exports.getPostByCatAndNum = getPostByCatAndNum;
function insertData(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (req.body) {
                const userID = req.userId;
                const thumbnail = req.urlImage;
                const { title, content, description, cate } = req.body;
                const checkExist = yield post_1.default.find({ title: title });
                const slug = checkExist
                    ? `${(0, function_1.convertToSlug)(title)}-${(0, function_1.generateString)(10)}`
                    : (0, function_1.convertToSlug)(title);
                let newPost = null;
                if (cate == "ads") {
                    newPost = new post_1.default({
                        title,
                        content,
                        thumbnail,
                        description,
                        userID,
                        cate,
                        slug,
                        price: req.priceAds,
                    });
                }
                else {
                    newPost = new post_1.default({
                        title,
                        content,
                        thumbnail,
                        description,
                        userID,
                        cate,
                        slug,
                    });
                }
                const result = yield newPost.save();
                return res.json({
                    message: "Thêm thành công",
                    status: 200,
                    data: result,
                });
            }
        }
        catch (err) {
            res.json({
                status: 500,
                message: "Lỗi hệ thống: " + err.message,
                data: null,
            });
        }
    });
}
exports.insertData = insertData;
function getFeaturedPost(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const latestPost = yield post_1.default
                .findOne({ cate: { $nin: ["vid", "ads"] } })
                .sort({ createdAt: -1 })
                .exec();
            res.json({
                data: latestPost,
                message: "Lấy dữ liệu thành công",
            });
        }
        catch (error) {
            res.json({
                message: "Lỗi hệ thống: " + error.message,
                data: null,
            });
        }
    });
}
exports.getFeaturedPost = getFeaturedPost;
function getNotCateVideo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //Hàm này lấy ra 10 bài viết mới nhất những không phải là loại video
            const ress = yield post_1.default
                .find({ cate: { $nin: ["vid", "ads"] } })
                .sort({ createdAt: -1 })
                .limit(10);
            if (!ress)
                return res.status(404).json({ message: "Không có dữ liệu", data: null });
            res.status(200).json({
                message: "Có dữ liệu",
                data: ress,
                status: 200,
                _limit: 10,
                next_page: false,
            });
        }
        catch (error) {
            res.status(500).send({
                message: "Lỗi máy chủ: " + error.message,
                data: null,
            });
        }
    });
}
exports.getNotCateVideo = getNotCateVideo;
function getBySlug(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const _slug = req.query.slug;
            const ress = yield post_1.default.findOne({ slug: _slug });
            if (!ress) {
                return res.json({
                    item: null,
                    error: "Bài viết không tồn tại!",
                    code: 404,
                });
            }
            res.json({ item: ress });
        }
        catch (error) {
            res.json({
                item: null,
                error: "Lỗi: " + error.message,
                code: 500,
            });
        }
    });
}
exports.getBySlug = getBySlug;
function searchByKeywords(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const keyword = req.query.keywords; // Get the search query from the request URL
            const limit = parseInt(req.query.limit) || 10; // Số lượng phần tử trên mỗi trang
            const page = parseInt(req.query.page) || 1; // Trang hiện tại
            const skip = (page - 1) * limit; // Số lượng phần tử cần bỏ qua
            // Tìm các bài đăng khớp với tiêu đề hoặc nội dung bằng cách sử dụng $regex để khớp một phần
            const ress = yield post_1.default
                .find({
                $or: [
                    { title: { $regex: keyword, $options: "i" } },
                    { content: { $regex: keyword, $options: "i" } },
                ],
            })
                .countDocuments();
            const totalItems = ress; // Tổng số phần tử của tìm kiếm
            const totalPages = Math.ceil(totalItems / limit); // Tổng số trang
            const data = yield post_1.default
                .find({
                $or: [
                    { title: { $regex: keyword, $options: "i" } },
                    { content: { $regex: keyword, $options: "i" } },
                ],
            })
                .skip(skip)
                .limit(limit);
            res.status(200).json({
                message: "OK",
                status: 200,
                data: data,
                totalPages: totalPages,
                currentPage: page,
            });
        }
        catch (error) {
            res.status(500).json({ error: "Something went wrong: " + (error === null || error === void 0 ? void 0 : error.message) });
        }
    });
}
exports.searchByKeywords = searchByKeywords;
function getDataOfCateNews(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const limit = parseInt(req.params.limit) || 10; // Số lượng phần tử trên mỗi trang
            const page = parseInt(req.params.page) || 1; // Trang hiện tại
            const cate = req.params.cate;
            const totalItems = yield post_1.default.find({ cate: cate }).countDocuments(); // Tổng số phần tử của thể loại bài viết
            const totalPages = Math.ceil(totalItems / limit); // Tổng số trang
            const skip = (page - 1) * limit; // Số lượng phần tử cần bỏ qua
            const data = yield post_1.default
                .find({ cate: cate })
                .skip(skip)
                .limit(limit)
                .sort({ created_at: -1 }); // Lấy dữ liệu từ MongoDB
            res.json({
                data,
                totalPages,
                currentPage: page,
            });
        }
        catch (error) {
            res.status(500).json({ error: "Internal server error" });
        }
    });
}
exports.getDataOfCateNews = getDataOfCateNews;
function Comment(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (req.body) {
                const { id, content, name } = req.body;
                const post = yield post_1.default.findById({ _id: id });
                if (post) {
                    const newComment = {
                        content,
                        name,
                    };
                    const result = yield post.updateOne({
                        $addToSet: { comment: newComment },
                    });
                    if (result) {
                        res.status(200).json({
                            message: "Lấy dữ liệu thành công",
                            code: 200,
                            status: "Success",
                            result: result,
                        });
                    }
                }
            }
        }
        catch (error) {
            res.status(500).json({
                message: "Error: Lỗi máy chủ nội bộ " + (error === null || error === void 0 ? void 0 : error.message),
                status: 200,
                result: null,
            });
        }
    });
}
exports.Comment = Comment;
function BloggerPost(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.authorize();
            const blogger = googleapis_1.google.blogger({
                version: "v3",
                auth: client,
            });
            if (req.body && req.images) {
                const { title, content } = req.body;
                const images = req.images;
                // const arr = images?.map((e) => )
                if (!title || !content || !images)
                    res.json({
                        message: "Data blog post invalid",
                        data: null,
                        Your_data_request: req.body,
                        iamges: images,
                    });
                // console.log('data post', req.body, images)
                blogger.posts
                    .insert({
                    blogId: "925707109516849883",
                    requestBody: {
                        kind: "blogger#post",
                        content: content,
                        title: title,
                        images: images,
                    },
                })
                    .then((ress) => res.json({ messsage: ress }))
                    .catch((err) => res.json({ message: `Error: ${err === null || err === void 0 ? void 0 : err.message}`, data: null }));
            }
        }
        catch (error) {
            res.json({
                message: `Error: ${error}`,
                data: null,
            });
        }
    });
}
exports.BloggerPost = BloggerPost;
