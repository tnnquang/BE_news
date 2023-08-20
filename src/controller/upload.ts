import { v2 as cloudinary } from "cloudinary";
import users from "../model/user";
import * as config from '../common/config'

cloudinary.config({
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

export async function Upload(req: any, res: any) {
  try {
    const file = req.file;

    const userId = req.userId;
    const user = await users.findById(userId);
    if (user) {
      await cloudinary.uploader.upload(
        file.path,
        {
          allowed_formats: ["jpeg", "png", "tiff"],
          folder: `avatar/`,
          resource_type: "auto",
          unique_filename: true,
          image_metadata: true,
          // filename_override: user._id,
          overwrite: true,
        },
        async (error, result) => {
          if (error) {
            console.error(error);
            res.status(500).json(error);
            // return error;
          } else {
            let a: any = user.avatar
            a = result?.secure_url;
            await users.updateOne({ _id: user.id }, { avatar: a });
            res.status(200).end({
              status: "Success",
              message: "Upload thành công",
              code: 200,
              url: result?.secure_url,
            });
          }
        }
      );
    } else {
      res.status(404).json({
        message: "Không tìm thấy dữ liệu người",
        status: 404,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
    return error;
  }
}

export async function UploadThumbnailPost(req: any, res: any, next: any) {
  try {
    const file = req.file;
    const ress = await cloudinary.uploader.upload(file.path, {
      allowed_formats: ["jpeg", "png", "tiff"],
      folder: `posts_thumbnail/`,
      resource_type: "auto",
      unique_filename: true,
      image_metadata: true,
      // filename_override: user._id,
      overwrite: true,
    });
    req.urlImage = ress?.url;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error, status: 500 });
    next(error);
  }
}

export async function UploadMultiple(req: any, res: any) {
  try {
    const fileList = req.files;
    
    const userId = req.userId;
    const user = await users.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "Không tìm thấy dữ liệu người",
        status: 404,
      });
    }

    const promises = [];
    const dataList = [];

    for (const file of fileList) {
      const promise = cloudinary.uploader.upload(file.path, {
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

    const results = await Promise.all(promises);

    for (const result of results) {
      dataList.push(result.secure_url);
    }

    res.json({ links: dataList, message: "Đã upload toàn bộ dữ liệu" });
  } catch (error) {
    res.status(500).json(error);
    return error;
  }
}

export async function UploadMultipleImages(req: any, res: any, next: any) {
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
      const promise = cloudinary.uploader.upload(file.path, {
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

    const results = await Promise.all(promises);

    for (const result of results) {
      dataList.push({ url: result.secure_url });
    }

    req.images = dataList;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
    return error;
  }
}

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
