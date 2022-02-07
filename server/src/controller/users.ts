import { Request, Response, NextFunction } from 'express';
import { EProductsErrors, EUsersErrors } from '../interfaces/EErrors';
import { ApiError } from '../api/errorApi';
import { validator } from '../interfaces/joiSchemas';
import { usersApi } from '../api/users';
import { IMongoUser, INew_User, UserAddresses } from '../interfaces/users';
import { CUDResponse } from '../interfaces/others';
import { logger } from '../services/logger';
import { isValidObjectId } from 'mongoose';
import { ObjectId } from 'mongodb';




/**
 *
 * Users Controller Class
 *
 */

class UsersController {

    async getOne(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        const { user_id } = req.user as Express.User;
        logger.info(`[PATH]: Inside User Controller`);
        if (isValidObjectId(user_id)) {
            const result:  IMongoUser[] | ApiError  = await usersApi.getUser(user_id);
            if(result instanceof ApiError)
                next(result)
            else
                res.status(200).send(result[0])
        } else {
            next(ApiError.badRequest(EProductsErrors.IdIncorrect))
        }
    }

    async getAll(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        logger.info(`[PATH]: Inside User Controller`)
        const result: IMongoUser[] | ApiError  = await usersApi.getUsers();
        if(result instanceof ApiError)
            next(result)
        else
            res.status(200).send(result)
    }

    async save(req: Request, res: Response, next: NextFunction): Promise<void> {
        const userInfo : INew_User = req.body;
        logger.info(`[PATH]: Inside User Controller`)
        const { error } = await validator.user.validate(userInfo);
        if (error) 
            next(ApiError.badRequest(error.message));
         else {
            if(userInfo.data.addresses) userInfo.data.addresses[0]._id = String(new ObjectId());
            const result: CUDResponse | ApiError = await usersApi.addUser(userInfo);
            if(result instanceof ApiError)
                next(result)
            else{

                res.status(201).send(result)
            }
        }
    }

    async addAddress(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { user_id } = req.user as Express.User;
        const address  = req.body as UserAddresses
        const { error } =  validator.address.validate(address);
        if(error)
            next(ApiError.badRequest(error.message));
        else{
            const result : CUDResponse | ApiError = await usersApi.addAddress(user_id, address);
            if(result instanceof ApiError)
                next(result);
            else
                res.status(201).send(result)
        }
    }

}

export const usersController = new UsersController();
