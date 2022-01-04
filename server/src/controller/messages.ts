import { Request, NextFunction, Response } from 'express';
import { messagesApi } from '../api/messages';
import { normalizeData } from '../common/compression';
import { ApiError } from '../api/errorApi';
import { ObjectId } from 'mongodb';
import { EUsersErrors } from '../common/EErrors';
import { IMongoMessage, INew_Message } from '../common/interfaces/messages';
import { CUDResponse } from '../common/interfaces/others';

/**
 *
 * Messages Controller Class
 *
 */

class MessagesController {
    
    async getAllMessages(req: Request, res: Response, next: NextFunction): Promise<void> {
        const result: IMongoMessage[] | ApiError = await messagesApi.getMsg(undefined);
        if(result instanceof ApiError) 
            next(result)
        else 
            res.status(200).send(result)    
    }

    async getUserMessages(req: Request, res: Response, next: NextFunction): Promise<void> {
        const user_id : string | undefined = req.params.id
        if(ObjectId.isValid(user_id)){
            const result : IMongoMessage[] | ApiError = await messagesApi.getMsg(user_id);
            if(result instanceof ApiError) 
                next(result)
            else 
                res.status(200).send(result); 
        }else{
            const error = ApiError.badRequest(EUsersErrors.UserNotFound);
            res.status(error.error).send(error)
        }
    }

    async save(req: Request, res: Response, next: NextFunction): Promise<void> {
        const message: INew_Message = req.body;
        const result : CUDResponse | ApiError = await messagesApi.addMsg(message);
        if(result instanceof ApiError) 
            next(result)
        else 
            res.status(201).send(result);
    }
}

export const messagesController = new MessagesController();
