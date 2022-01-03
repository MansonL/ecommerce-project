import { ApiError } from "../../api/errorApi";
import { CUDResponse, InternalError } from "./others";
import { IMongoUser } from "./users";

/**
 * 
 * This interface is just for Class22 Assignment.
 * 
 */
 export interface IMessagesNormalized {
    _id: string;
    messages: IMongoMessage[];
}

/**
 *
 * Type of Message Object to be stored and query from Mongo.
 *
 */
 export interface IMongoMessage extends INew_Message, Document {
    _id: string;
}

/**
 *
 * Type of Message Object receiving from the frontend.
 *
 */
export interface INew_Message {
    timestamp: string;
    author: IMongoUser;
    message: string;
}

/**
 *
 * Message Storage Classes structure
 *
 */
 export interface DBMessagesClass {
    init?(): Promise<void>;
    get(): Promise<IMongoMessage[] | ApiError | InternalError>;
    add(msg: INew_Message): Promise<CUDResponse | InternalError>;
}

/**
 * 
 * @param data Possible message object
 * @returns whether the passed data is the desired Mongo DB Object or not
 */

export const isMessages = (data: any): data is IMongoMessage => {
    return data.length ? 'author' in data[0] : 'author' in data 
}