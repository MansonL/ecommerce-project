import { Request, Response, NextFunction } from 'express';
import { EProductsErrors, EUsersErrors } from '../common/EErrors';
import { ApiError } from '../api/errorApi';
import { validator } from '../common/interfaces/joiSchemas';
import { usersApi } from '../api/users';
import { IMongoUser, INew_User, isUser } from '../common/interfaces/users';
import { CUDResponse, InternalError, isCUDResponse } from '../common/interfaces/others';
import { logger } from '../services/logger';
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
        const user_id: string = req.params.id;
        logger.info(`[PATH]: Inside User Controller`)
        if (new ObjectId(user_id).toString() === user_id ) {
            next(ApiError.badRequest(EProductsErrors.IdIncorrect));
        } else {
            const result:  IMongoUser[] | ApiError  = await usersApi.getUser(user_id);
            if(result instanceof ApiError)
                next(result)
            else
                res.status(200).send(result)
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
        const { error } = await validator.user.validateAsync(userInfo);
        if (error) 
            next(ApiError.badRequest(EUsersErrors.IncorrectProperties));
         else {
            const result: CUDResponse | ApiError = await usersApi.addUser(userInfo);
            if(result instanceof ApiError)
                next(result)
            else
                res.status(201).send(result)
        }
    }
}

export const usersController = new UsersController();
