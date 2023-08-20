import users from "../model/user";
import { Upload } from "../controller/upload";
import * as config from "../common/config";
import { compare } from "bcrypt";
import { JwtPayload, sign, verify } from "jsonwebtoken";

export async function Register(req: any, res: any) {
  const { email, fullname } = req.body;
  try {
    const newUser = new users({
      // username,
      fullname,
      email,
      password: req.body.password,
    });
    const checkUser = await users.findOne({ email });
    if (checkUser)
      return res.status(400).json({
        status: "failed",
        data: [],
        message: "Tài khoản đã tồn tại",
      });

    const savedUser: any = await newUser.save(); // save new user into the database
    const { password, role, ...userdata } = savedUser._doc;
    res.status(200).json({
      status: "success",
      data: [userdata],
      code: 200,
      message: "Tạo tài khoản thành công",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      code: 500,
      data: [],
      message: "Lỗi hệ thống nội bộ",
    });
  }
  res.end();
}

//Hàm để lấy exp từ access token được tạo ra từ quá trình login không qua Middleware verify
export function getExpFromToken(token: string, secret_key: any) {
  return verify(token, secret_key) as JwtPayload;
}

export async function Login(req: any, res: any) {
  // Lấy các biến cho quá trình đăng nhập
  const { email } = req.body;
  try {
    // Kiểm tra nếu có user
    const user: any = await users.findOne({ email }).select("+password");

    if (!user)
      return res.status(401).json({
        status: "failed",
        data: [],
        message: "Tài khoản không tồn tại",
      });
    // Nếu tài khoản tồn tại
    // Xác thực mật khẩu
    const isPasswordValid = await compare(
      `${req.body.password}`,
      user.password
    );
    // Nếu không hợp lệ thì trả về fail
    if (!isPasswordValid)
      return res.status(401).send({
        status: "failed",
        data: [],
        message:
          "Email hoặc mật khẩu không hợp lệ. Vui lòng thử lại với thông tin chính xác!",
      });

    let options = {
      maxAge: 24 * 60 * 60 * 1000, // Sẽ hết hạn trong  1 ngày
    };
    const { password, ...newUser } = user._doc;

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
      refresh_token_exp: getExpFromToken(
        refresh_token,
        config.SECRET_REFRESH_TOKEN
      ).exp,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      code: 500,
      data: [],
      message: "Lỗi hệ thống nội bộ: " + err,
    });
  }
  res.end();
}

export async function LoginWithAccessToken(req: any, res: any) {
  try {
    const userId = req.userId;

    if (userId) {
      const user = await users.findById({ _id: userId });
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
    } else
      return res
        .status(404)
        .send({ message: "Thông tin userId không hợp lệ", status: 404 });
  } catch (error) {
    return res.status(500).send({
      message: "Lỗi hệ thống nội bộ: " + error,
      data: [],
    });
  }
}

export async function Logout(req: any, res: any) {
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
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Lỗi máy chủ nội bộ",
    });
  }
}

export async function checkEmailIsExisted(req: any, res: any) {
  const email = req.body.email;

  const user = await users.findOne({ email: email });

  if (user) return res.send({ message: "Email đã tồn tại", type: false });
  return res.send({ message: "Email này có thể đăng kí", type: true });
}

async function UpdateDataUser(req: any, res: any) {
  try {
    const userId = req.userId;
    if (userId) {
      const user = await users.findById({ _id: userId });
      if (user) {
        await user.updateOne({
          $set: { fullname: req.body.fullname, phone: req.body.phone },
        });
        res.status(200).json({
          message: "Cập nhật thành công",
          status: 200,
          // data: user,
        });
      }
    }
  } catch (error) {
    return res.json({
      data: [],
      message: "Lỗi hệ thống nội bộ: " + error,
    });
  }
}

export function receiveRequest(req: any, res: any) {
  if (req.file) {
    Upload(req, res);
    UpdateDataUser(req, res);
  } else {
    UpdateDataUser(req, res);
  }
}

export async function refreshToken(req: any, res: any) {
  try {
    const { refresh_token } = req.body;
    const _exp = getExpFromToken(refresh_token, config.SECRET_REFRESH_TOKEN)
      .exp;
    const userId = req.userId;
    if (refresh_token && _exp && _exp * 1000 < Date.now()) {
      const user = await users.findById({ id: userId });
    }
  } catch (error) {
    res.json({
      message:
        "Phiên làm việc đã hết hạn, vui lòng đăng nhập lại để tiếp tục sử dụng",
      code: 401,
      status: "Unauthorized",
      flag_sign_out: true,
    });
  }
}

export async function RefreshAccessToken(req: any, res: any) {
  try {
    const refresh_token = req.query.refresh_token;
    if (refresh_token) {
      verify(
        refresh_token,
        config.SECRET_REFRESH_TOKEN as any,
        async (error: any, decoded: any) => {
          if (error)
            return res.status(403).json({
              message: "Bạn không có quyền truy cập: " + error,
              status: "Forbidden",
              code: 403,
              data: null,
            });
          const { id, role } = decoded;
          const token = sign({ id, role }, config.SECRET_ACCESS_TOKEN as any, {
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
        }
      );
    } else {
      return res.status(403).json({
        message: "Bạn không có quyền truy cập",
        status: "Forbidden",
        code: 403,
        data: null,
      });
    }
  } catch (error: any) {
    res.status(500).json({
      status: "Internal Server Error",
      code: 500,
      message: error?.message ?? error,
    });
  }
}
