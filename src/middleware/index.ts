import { getUserBySessionToken } from "db/users";
import { NextFunction, Request, Response } from "express";
import { merge } from "lodash";

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // セッションの有無チェック
    const sessinToken = req.cookies["OTAKI-AUTH"];
    if (!sessinToken) {
      return res.sendStatus(403);
    }

    // ユーザーの存在チェック
    const existingUser = await getUserBySessionToken(sessinToken);
    if (!existingUser) {
      return res.sendStatus(403);
    }

    // マージ処理
    merge(req, { identity: existingUser });

    return next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
