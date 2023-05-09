import express from "express";

import { getAllUsers, deleteUser, updateUser } from "../controller/users";
import { isAuthenticated, isOwner } from "../middleware";

export const UserRouter = (router: express.Router) => {
  router.get("/users", isAuthenticated, getAllUsers); // 認証用のミドルウェアを経由
  router.delete("/users/:id", isAuthenticated, isOwner, deleteUser); // 認証・管理者用のミドルウェアを経由
  router.patch("/users/:id", isAuthenticated, isOwner, updateUser); // 認証・管理者用のミドルウェアを経由
};
