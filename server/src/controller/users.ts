import { Request, Response, NextFunction } from "express";
import { EProductsErrors } from "../interfaces/EErrors";
import { ApiError } from "../api/errorApi";
import { validator } from "../interfaces/joiSchemas";
import { usersApi } from "../api/users";
import {
  IMongoUser,
  INew_User,
  UserAddresses,
  UserInfo,
} from "../interfaces/users";
import { CUDResponse } from "../interfaces/others";
import { logger } from "../services/logger";
import { isValidObjectId } from "mongoose";
import { ObjectId } from "mongodb";
import { cartApi } from "../api/cart";
import moment from "moment";

/**
 *
 * Users Controller Class
 *
 */

class UsersController {
  async getOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    const user_id = (req.user as Express.User)._id;
    logger.info(`[PATH]: Inside User Controller`);
    if (isValidObjectId(user_id)) {
      const result: IMongoUser[] | ApiError = await usersApi.getUser(
        user_id.toString()
      );
      if (result instanceof ApiError) next(result);
      else res.status(200).send(result[0]);
    } else {
      next(ApiError.badRequest(EProductsErrors.IdIncorrect));
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    logger.info(`[PATH]: Inside User Controller`);
    const result: IMongoUser[] | ApiError = await usersApi.getUsers();
    if (result instanceof ApiError) next(result);
    else res.status(200).send(result);
  }

  async save(req: Request, res: Response, next: NextFunction): Promise<void> {
    const userInfo: UserInfo = req.body;
    logger.info(`[PATH]: Inside User Controller`);
    const { error } = await validator.user.validate(userInfo);
    if (error) next(ApiError.badRequest(error.message));
    else {
      if (userInfo.addresses)
        userInfo.addresses[0]._id = new ObjectId();
      const newUser: INew_User = {
        createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
        modifiedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
        ...userInfo,
      };
      const result: CUDResponse | ApiError = await usersApi.addUser(newUser);
      if (result instanceof ApiError) next(result);
      else {
        await cartApi.createEmptyCart(result.data._id.toString());
        res.status(201).send(result);
      }
    }
  }

  async addAddress(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const user_id = (req.user as Express.User)._id;
    const address = req.body as UserAddresses;
    const { error } = validator.address.validate(address);
    if (error) next(ApiError.badRequest(error.message));
    else {
      const result: CUDResponse | ApiError = await usersApi.addAddress(
        user_id.toString(),
        address
      );
      if (result instanceof ApiError) next(result);
      else res.status(201).send(result);
    }
  }
}

export const usersController = new UsersController();
