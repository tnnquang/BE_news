import posts from "../model/post"
import { convertToSlug, generateString } from "../common/function"
import { google } from "googleapis"

//Xác minh Google
const key = {
  client_id:
    "18836317239-968e7psnpkbakor6f4sej1hged6dibth.apps.googleusercontent.com",
  client_secret: "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",
}

const client = new google.auth.JWT(key.client_id, "", key.client_secret, [
  "https://www.googleapis.com/auth/blogger",
])

export async function getAllPosts(req: any, res: any) {
  //OK
  try {
    const dataPost = await posts.find({})
    return res.json({ message: "Thành công", data: dataPost, code: 200 })
  } catch (error: any) {
    res.status(500).json({ message: error })
  }
}

export async function getAllPostOfCat(req: any, res: any) {
  //OK
  try {
    const cat = req.params.cat
    if (cat) {
      const dataPost = await posts.find({ cate: cat })
      return res.json({ message: "Thành công", data: dataPost })
    } else return res.json({ message: "Không tìm thấy loại bài báo" })
  } catch (error: any) {
    return res.json({ message: "Lỗi: " + error })
  }
}

export async function getAllByUserId(req: any, res: any) {
  //OK
  try {
    const id = req.params.userId
    if (id) {
      const dataPost = await posts.find({ userID: id })
      return res.json({
        message: "Thành công",
        data: dataPost,
      })
    }
  } catch (error: any) {
    return res.json({ message: error, data: null })
  }
}

export async function getById(req: any, res: any) {
  //OK
  try {
    const id = req.params.postId
    if (id) {
      await posts
        .findById({ _id: id })
        .then((data) => {
          return res.status(200).send({ data: data })
        })
        .catch((reason) => {
          return res.json({ message: "Lỗi: " + reason, data: null })
        })
    } else return res.json({ message: "Không tìm thấy bài viết thei id này" })
  } catch (error: any) {
    res.json({ message: "Lỗi hệ thống: " + error?.message, status: 500 })
  }
}

export async function countAll() {
  try {
    const s = await posts.countDocuments({})
    return s
  } catch (err: any) {
    return 0 // hoặc giá trị mặc định của biến s
  }
}

export async function countAllByCat(req: any, res: any) {
  // Hàm này OK
  let s = 0
  const cat = req.params.cat
  await posts
    .countDocuments({ cate: cat })
    .then((value) => {
      s = value
      return res.json({ count: s, message: "Đếm thành công", status: 200 })
    })
    .catch((error: any) => {
      return res.json({ message: error, count: s })
    })
}

export async function get10PostOfCatNew(req: any, res: any) {
  //OK
  //Lấy 10 bài mới nhất của 1 loại nào đó nhận từ parmameters của url
  try {
    const cat = req.params.cat
    await posts
      .find({ cate: cat })
      .sort({ created_at: -1 })
      .limit(10)
      .then((value) => res.json({ message: "Thành công", data: value }))
      .catch((error: any) => {
        return res.json({ message: error, data: null })
      })
  } catch (error: any) {
    res.json({ message: "Lỗi: " + error.message, data: null })
  }
}

export async function getPostByCatAndNum(req: any, res: any) {
  //OK
  // tìm kiếm 1 số lượng bản ghi mới nhất của 1 loại
  try {
    const { num, cate } = req.query

    await posts
      .find({ cate: cate })
      .sort({ created_at: -1 })
      .limit(num)
      .then((value) => res.json({ message: "Thành công", data: value }))
      .catch((error: any) => {
        return res.json({ message: error.message, data: null })
      })
  } catch (error: any) {
    return res.json({ message: "Lỗi: " + error.message })
  }
}

export async function insertData(req: any, res: any) {
  try {
    if (req.body) {
      const userID = req.userId
      const thumbnail = req.urlImage
      const { title, content, description, cate } = req.body
      const checkExist = await posts.find({ title: title })
      const slug = checkExist
        ? `${convertToSlug(title)}-${generateString(10)}`
        : convertToSlug(title)
      let newPost = null
      if (cate == "ads") {
        newPost = new posts({
          title,
          content,
          thumbnail,
          description,
          userID,
          cate,
          slug,
          price: req.priceAds,
        })
      } else {
        newPost = new posts({
          title,
          content,
          thumbnail,
          description,
          userID,
          cate,
          slug,
        })
      }

      const result = await newPost.save()
      return res.json({
        message: "Thêm thành công",
        status: 200,
        data: result,
      })
    }
  } catch (err: any) {
    res.json({
      status: 500,
      message: "Lỗi hệ thống: " + err.message,
      data: null,
    })
  }
}

export async function getFeaturedPost(req: any, res: any) {
  try {
    const latestPost = await posts
      .findOne({ cate: { $nin: ["vid", "ads"] } })
      .sort({ createdAt: -1 })
      .exec()
    res.json({
      data: latestPost,
      message: "Lấy dữ liệu thành công",
    })
  } catch (error: any) {
    res.json({
      message: "Lỗi hệ thống: " + error.message,
      data: null,
    })
  }
}

export async function getNotCateVideo(req: any, res: any) {
  try {
    //Hàm này lấy ra 10 bài viết mới nhất những không phải là loại video
    const ress = await posts
      .find({ cate: { $nin: ["vid", "ads"] } })
      .sort({ createdAt: -1 })
      .limit(10)
    if (!ress)
      return res.status(404).json({ message: "Không có dữ liệu", data: null })
    res.status(200).json({
      message: "Có dữ liệu",
      data: ress,
      status: 200,
      _limit: 10,
      next_page: false,
    })
  } catch (error: any) {
    res.status(500).send({
      message: "Lỗi máy chủ: " + error.message,
      data: null,
    })
  }
}

export async function getBySlug(req: any, res: any) {
  try {
    const _slug = req.query.slug

    const ress = await posts.findOne({ slug: _slug })

    if (!ress) {
      return res.json({
        item: null,
        error: "Bài viết không tồn tại!",
        code: 404,
      })
    }

    res.json({ item: ress })
  } catch (error: any) {
    res.json({
      item: null,
      error: "Lỗi: " + error.message,
      code: 500,
    })
  }
}

export async function searchByKeywords(req: any, res: any) {
  try {
    const keyword = req.query.keywords // Get the search query from the request URL
    const limit = parseInt(req.query.limit) || 10 // Số lượng phần tử trên mỗi trang
    const page = parseInt(req.query.page) || 1 // Trang hiện tại
    const skip = (page - 1) * limit // Số lượng phần tử cần bỏ qua

    // Tìm các bài đăng khớp với tiêu đề hoặc nội dung bằng cách sử dụng $regex để khớp một phần
    const ress = await posts
      .find({
        $or: [
          { title: { $regex: keyword, $options: "i" } }, // 'i' Tuỳ chọn đối sánh không phân biệt chữ hoa, chữ thường
          { content: { $regex: keyword, $options: "i" } },
        ],
      })
      .countDocuments()

    const totalItems = ress // Tổng số phần tử của tìm kiếm
    const totalPages = Math.ceil(totalItems / limit) // Tổng số trang

    const data = await posts
      .find({
        $or: [
          { title: { $regex: keyword, $options: "i" } },
          { content: { $regex: keyword, $options: "i" } },
        ],
      })
      .skip(skip)
      .limit(limit)

    res.status(200).json({
      message: "OK",
      status: 200,
      data: data,
      totalPages: totalPages,
      currentPage: page,
    })
  } catch (error: any) {
    res.status(500).json({ error: "Something went wrong: " + error?.message })
  }
}

export async function getDataOfCateNews(req: any, res: any) {
  try {
    const limit = parseInt(req.params.limit) || 10 // Số lượng phần tử trên mỗi trang
    const page = parseInt(req.params.page) || 1 // Trang hiện tại
    const cate = req.params.cate
    const totalItems = await posts.find({ cate: cate }).countDocuments() // Tổng số phần tử của thể loại bài viết
    const totalPages = Math.ceil(totalItems / limit) // Tổng số trang

    const skip = (page - 1) * limit // Số lượng phần tử cần bỏ qua

    const data = await posts
      .find({ cate: cate })
      .skip(skip)
      .limit(limit)
      .sort({ created_at: -1 }) // Lấy dữ liệu từ MongoDB

    res.json({
      data,
      totalPages,
      currentPage: page,
    })
  } catch (error: any) {
    res.status(500).json({ error: "Internal server error" })
  }
}

export async function Comment(req: any, res: any) {
  try {
    if (req.body) {
      const { id, content, name } = req.body

      const post = await posts.findById({ _id: id })
      if (post) {
        const newComment = {
          content,
          name,
        }
        const result = await post.updateOne({
          $addToSet: { comment: newComment },
        })
        if (result) {
          res.status(200).json({
            message: "Lấy dữ liệu thành công",
            code: 200,
            status: "Success",
            result: result,
          })
        }
      }
    }
  } catch (error: any) {
    res.status(500).json({
      message: "Error: Lỗi máy chủ nội bộ " + error?.message,
      status: 200,
      result: null,
    })
  }
}

export async function BloggerPost(req: any, res: any) {
  try {
    await client.authorize()

    const blogger = google.blogger({
      version: "v3",
      auth: client,
    })

    if (req.body && req.images) {
      const { title, content } = req.body
      const images = req.images
      // const arr = images?.map((e) => )
      if (!title || !content || !images)
        res.json({
          message: "Data blog post invalid",
          data: null,
          Your_data_request: req.body,
          iamges: images,
        })
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
        .then((ress: any) => res.json({ messsage: ress }))
        .catch((err: any) =>
          res.json({ message: `Error: ${err?.message}`, data: null })
        )
    }
  } catch (error: any) {
    res.json({
      message: `Error: ${error}`,
      data: null,
    })
  }
}
