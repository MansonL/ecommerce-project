import { NextFunction, Request, Response } from "express";
import { cartApi } from "../api/cart";
import { productsApi } from "../api/products";
import { EProductsErrors } from "../interfaces/EErrors";
import { ApiError } from "../api/errorApi";
import { IMongoCart, IMongoProduct } from "../interfaces/products";
import { CUDResponse } from "../interfaces/others";
import { logger } from "../services/logger";
import { isValidObjectId } from "mongoose";

/**
 *
 * Cart Controller Class
 *
 */
class CartController {
  async getOneCart(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { user_id } = req.user as Express.User;
    logger.info(`[PATH]: Inside Cart Controller`);
    const result: IMongoCart[] | ApiError = await cartApi.get(user_id);
    if (result instanceof ApiError) next(result);
    else res.status(200).send(result[0]);
  }
  async getCarts(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    logger.info(`[PATH]: Inside Cart Controller`);
    const result: IMongoCart[] | ApiError = await cartApi.get();
    if (result instanceof ApiError) next(result);
    else res.status(200).send(result);
  }

  async addToCart(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { product_id, quantity } = req.body;
    const { user_id } = req.user as Express.User;
    logger.info(`[PATH]: Inside Cart Controller`);
    if (isValidObjectId(product_id)) {
      if (quantity) {
        const firstResult: IMongoProduct[] | ApiError =
          await productsApi.getProduct(product_id);
        if (firstResult instanceof ApiError) next(firstResult);
        else {
          const result: CUDResponse | ApiError = await cartApi.addProduct(
            user_id,
            product_id,
            quantity
          );
          if (result instanceof ApiError) next(result);
          else res.status(201).send(result);
        }
      } else
        next(ApiError.badRequest(`Product quantity needs to be specified.`));
    } else next(ApiError.badRequest(EProductsErrors.IdIncorrect));
  }

  async deleteFromCart(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { product_id, quantity } = req.body;
    const { user_id } = req.user as Express.User;
    logger.info(`[PATH]: Inside Cart Controller`);
    if (isValidObjectId(product_id) && isValidObjectId(user_id)) {
      if (Number(quantity)) {
        const firstResult: IMongoProduct[] | ApiError =
          await productsApi.getProduct(product_id);
        if (firstResult instanceof ApiError) {
          next(firstResult);
        } else {
          const result: CUDResponse | ApiError = await cartApi.deleteProduct(
            user_id,
            product_id,
            Number(quantity)
          );
          if (result instanceof ApiError) next(result);
          else res.status(201).send(result);
        }
      } else
        next(ApiError.badRequest(`Product quantity needs to be specified.`));
    } else next(ApiError.badRequest(EProductsErrors.IdIncorrect));
  }
}

export const cart_controller = new CartController();
