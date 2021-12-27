import { IMongoMessage } from "./interfaces";

/**
 * 
 * This interface is just for Class22 Assignment.
 * 
 */
export interface IMessagesNormalized {
    _id: string;
    messages: IMongoMessage[];
}