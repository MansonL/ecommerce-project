import { Router } from "express";
import { authController } from "../controller/auth";
import { images_controller } from "../controller/images";

export const imagesRouter = Router();

imagesRouter.post("/upload", authController.isAdmin, images_controller.save);
imagesRouter.delete(
  "/delete",
  authController.isAdmin,
  images_controller.delete
);
