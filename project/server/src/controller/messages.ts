import { Request, NextFunction, Response } from 'express';
import { messagesApi } from '../api/messages';
import { normalizeData } from '../common/compression';
import { isCUDResponse, isMessages } from '../interfaces/checkType';
import { CUDResponse, IMongoMessage, INew_Message, InternalError } from '../interfaces/interfaces';
import { ApiError } from '../utils/errorApi';
import { validator } from '../utils/joiSchemas';

/**
 *
 * Messages Controller Class
 *
 */

class MessagesController {
    async get(req: Request, res: Response, next: NextFunction): Promise<void> {
        const result: IMongoMessage[] | ApiError | InternalError = await messagesApi.getMsg();
        console.log(`[PATH] Inside controller.`);
        if(isMessages(result)){

            /**
             * Result was previously checked to have properties according to Messages interface
             */

            const normalizedData = normalizeData(result as IMongoMessage[]);
            res.status(200).send(normalizedData);
        
        }else if(result instanceof ApiError){
            res.status(result.error).send(result);
        }else{
            res.status(500).send(result) // Internal Error sent.
        }
    }
    async save(req: Request, res: Response, next: NextFunction): Promise<void> {
        const message: INew_Message = req.body;
        console.log(`[PATH] Inside controller.`);
        const result : CUDResponse | InternalError = await messagesApi.addMsg(message);
        if(isCUDResponse(result)){
            res.status(201).send(result)
        }else{
            res.status(500).send(result) // Internal Error sent.
        }
    }
}

export const messagesController = new MessagesController();
