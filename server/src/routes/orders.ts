import { Router } from "express";
import { authController } from "../controller/auth";
import { ordersController } from "../controller/orders";

export const ordersRouter = Router();

ordersRouter.get(
  "/admin-view/list",
  authController.isAdmin,
  ordersController.getByAdmin
);
ordersRouter.get(
  "/list",
  authController.isAuthorized,
  ordersController.getByUser
);
ordersRouter.post(
  "/create",
  authController.isAuthorized,
  ordersController.createOrder
);
ordersRouter.patch(
  "/modify",
  authController.isAdmin,
  ordersController.modifyOrder
);
