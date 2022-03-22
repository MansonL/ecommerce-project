/* eslint-disable no-unused-vars*/

import { ObjectId } from "mongodb";
import { Document } from "mongoose";
import { ApiError } from "../api/errorApi";
import { CUDResponse } from "./others";

/**
 * 
 * Normalized messages interface.
 * 
 *
 export interface IMessagesNormalized {
    _id: string;
    messages: IMongoMessage[];
}
*/

export interface IMongoPopulatedMessages {
  timestamp: string;
  from: {
    username: string;
    name: string;
    surname: string;
    avatar: string;
    _id: string;
  };
  to: {
    username: string;
    name: string;
    surname: string;
    avatar: string;
    _id: string;
  };
  message: string;
}

/**
 * Type of Message Object after being populated
 */
export interface IMessageSentPopulated {
  _id: ObjectId;
  timestamp: string;
  from: ObjectId;
  to: {
    username: string;
  };
  message: string;
  type: string;
}

/**
 *
 * Type of Message Object to be stored and query from Mongo.
 *
 */
export interface IMongoMessage extends INew_Message, Document {
  _id: ObjectId;
}

/**
 *
 * Type of Message Object receiving from the frontend.
 *
 */
export interface INew_Message {
  timestamp: string;
  from: ObjectId;
  to: ObjectId;
  message: string;
  type: string;
}

/**
 *
 * Message Storage Classes structure
 *
 */
export interface DBMessagesClass {
  init?(): Promise<void>;
  get(user_id: string): Promise<IMongoMessage[] | ApiError>;
  add(msg: INew_Message): Promise<CUDResponse | ApiError>;
}

/**
 *
 * @param data Possible message object
 * @returns whether the passed data is the desired Mongo DB Object or not
 */

export const isMessages = (data: any): data is IMongoMessage => {
  return data.length ? "author" in data[0] : "author" in data;
};
