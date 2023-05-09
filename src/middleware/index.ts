import { getUserBySessionToken } from "../db/users";
import { NextFunction, Request, Response } from "express";
import { get, merge } from "lodash";

// 認証用のミドルウェア
export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // セッションの有無チェック
    const sessionToken = req.cookies["OTAKI-AUTH"];
    if (!sessionToken) {
      return res.sendStatus(403);
    }

    // ユーザーの存在チェック
    const existingUser = await getUserBySessionToken(sessionToken);
    if (!existingUser) {
      return res.sendStatus(403);
    }

    // マージ処理
    merge(req, { identity: existingUser });

    // 次のミドルウェアへ
    return next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

// 管理者チェック用ミドルウェア
export const isOwner = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const currentUserId = get(req, "identity._id") as string;

    // 現在のユーザーIDの存在チェック
    if (!currentUserId) {
      return res.sendStatus(403);
    }

    // 現在のユーザーIDとリクエストで渡ってきたIDの照合
    if (currentUserId.toString() !== id) {
      return res.sendStatus(403);
    }

    // 次のミドルウェアへ
    next();
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};
