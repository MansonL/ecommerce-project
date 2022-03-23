import e, { Router } from "express";
import { authController } from "../controller/auth";
import { messagesController } from "../controller/messages";

export const messagesRouter: e.Router = Router();

messagesRouter.get(
  "/list/:id",
  authController.isAuthorized,
  messagesController.getUserMessages
);
messagesRouter.get(
  "/list",
  authController.isAuthorized,
  messagesController.getUserMessages
);
messagesRouter.post(
  "/save",
  authController.isAuthorized,
  messagesController.save
);
