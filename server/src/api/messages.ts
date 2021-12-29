import {
    IMongoMessage,
    CUDResponse,
    INew_Message,
    InternalError,
} from '../interfaces/interfaces';
import { storage } from '../models/usersFactory';
import { MongoMessages } from '../models/DAOs/Mongo/messages';
import { MessagesFactory } from '../models/messagesFactory';
import { ApiError } from './errorApi';

export class MessagesApi {
    private messages: MongoMessages;
    constructor() {
        this.messages = MessagesFactory.get(storage);
    }
    async getMsg(): Promise<IMongoMessage[] | ApiError | InternalError> {
        const result : IMongoMessage[] | ApiError | InternalError = await this.messages.get();
        return result;
    }
    async addMsg(message: INew_Message): Promise<CUDResponse | InternalError> {
        const result : CUDResponse | InternalError = await this.messages.add(message);
        return result;
    }
}

export const messagesApi = new MessagesApi();
