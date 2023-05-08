import express from "express";

import { login, register } from "../controller/authentication";

export const AuthRouter = (router: express.Router) => {
  router.post("/auth/register", register);
  router.post("/auth/login", login);
};
