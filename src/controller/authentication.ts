import { Request, Response } from "express";
import { createUser, getUserByEmail } from "../db/users";
import { authentication, ramdom } from "../helpers";

// ログイン処理
export const login = async (req: Request, res: Response) => {
  try {
    // リクエストからログイン情報取得
    const { email, password } = req.body;
    // メール、パスワードの存在チェック
    if (!email || !password) {
      return res.sendStatus(400);
    }

    // ユーザーの存在チェック(良くわかりません。。。)
    const user = await getUserByEmail(email).select(
      "+authentication.salt +authentication.password"
    );
    if (!user) {
      return res.sendStatus(400);
    }
    // ハッシュ比較によるパスワード照合
    const expectedHash = authentication(user.authentication.salt, password);
    if (user.authentication.password !== expectedHash) {
      return res.sendStatus(403);
    }

    const salt = ramdom();
    user.authentication.sessionToken = authentication(
      salt,
      user._id.toString()
    );

    await user.save();

    // Cookieに保存
    res.cookie("OTAKI-AUTH", user.authentication.sessionToken, {
      domain: "localhost",
      path: "/",
    });

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

// サインアップ処理
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
