import { authentication } from "../helpers/index";
import { createUser, getUserByEmail } from "db/users";
import { Request, Response } from "express";
import { ramdom } from "helpers";

export const register = async (req: Request, res: Response) => {
  try {
    // リクエストから資格情報取得
    const { email, password, username } = req.body;
    // メール、パスワード、ユーザー名の存在チェック
    if (!email || !password || !username) {
      return res.sendStatus(400);
    }
    // 既存ユーザーの存在チェック
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.sendStatus(400);
    }
    // ユーザー作成
    const salt = ramdom();
    const user = await createUser({
      email,
      username,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
    });
    // 登録ユーザーを返す
    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
