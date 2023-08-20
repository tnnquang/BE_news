import * as config from "../common/config"
import { verify } from 'jsonwebtoken'
import users from '../model/user'
import { ROLE_USER } from "../common/enum";

export async function Verify(req: any, res: any, next: any) {
  const accessToken = req.headers['x-access-token'];
  // const refresh_token = req.body.refresh_token

  if (!accessToken){
    return res.status(401) //nếu không có từ request header thì gửi 1 response unauthorized qua code 401
  }

  // parse Token
  verify(accessToken, config.SECRET_ACCESS_TOKEN as any, async (error: any, decoded: any) => {
    if (error)
      return res.status(403).json({
        message: "Bạn không có quyền truy cập: " + error,
        status: 'Forbidden',
        code: 403,
        data: [],
      });
    const { id, exp, role } = decoded;
    req.userId = id;
    req.tokenExpire = exp
    req.role = role
    next();
  });
}

//Cho admin
export async function VerifyRole(req: any, res: any, next: any) {
  try {
    const userId = req.userId;
    const { role }: any = await users.findById({_id: userId}); // Lấy role từ user
    if (role !== ROLE_USER.ADMIN) {
      return res.status(401).json({
        status: "Unauthorized",
        code: 401,
        message: "Bạn không có quyền để truy cập nội dung này",
      });
    }
    req.userId = userId
    next();
  } catch (error) {
    res.status(500).json({
      status: "error",
      code: 500,
      data: [],
      message: "Lỗi máy chủ nội bộ",
    });
  }
}