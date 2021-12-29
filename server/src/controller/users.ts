import { Request, Response, NextFunction } from 'express';
import { EProductsErrors, EUsersErrors } from '../common/EErrors';
import { CUDResponse, IMongoUser, INew_User, InternalError } from '../interfaces/interfaces';
import { ApiError } from '../api/errorApi';
import { validator } from '../utils/joiSchemas';
import { usersApi } from '../api/users';
import moment from 'moment';
import { isCUDResponse, isUser } from '../interfaces/checkType';

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
        const id: string = req.params.id;
        console.log(`[PATH] Inside controller.`);
        const { error } = await validator.id.validateAsync(id);
        if (error) {
            next(ApiError.badRequest(EProductsErrors.IdIncorrect));
        } else {
            const result:  IMongoUser[] | ApiError | InternalError = await usersApi.getUser(id);
            if(isUser(result)){
                res.status(200).send(result)
            }else if(result instanceof ApiError){
                res.status(result.error).send(result)
            }else{
                res.status(500).send(result)     // Internal Error sent.
            }
        }
    }
    async getAll(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        console.log(`[PATH] Inside controller.`);
        const result: IMongoUser[] | ApiError | InternalError = await usersApi.getUsers();
        if(isUser(result)){
            res.status(200).send(result)
        }else if(result instanceof ApiError){
            res.status(result.error).send(result)
        }else{
            res.status(500).send(result) // Internal Error sent.
        }
    }
    async save(req: Request, res: Response, next: NextFunction): Promise<void> {
        const user: INew_User = req.body;
        const { error } = validator.user.validate(user);
        if (error) {
            next(ApiError.badRequest(EUsersErrors.IncorrectProperties));
        } else {
            console.log(`[PATH] Inside controller.`);
            const result: CUDResponse | InternalError = await usersApi.addUser(user);
            if(isCUDResponse(result)){
                res.status(201).send(result)
            }else{
                res.status(500).send(result) // Internal Error sent.
            }
        }
    }
}

export const usersController = new UsersController();
