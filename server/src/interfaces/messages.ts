/* eslint-disable no-unused-vars*/

import { ObjectId } from "mongodb";
import { Document } from "mongoose";
import { ApiError } from "../api/errorApi";
import { CUDResponse } from "./others";
import { IUserShortInfo } from "./users";

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

/**
 * Type of Object containing the latest messages with differents users.
 */

export interface IChats {
  [key: string]: IMongoPopulatedMessages[];
}

/**
 * Type of Message Object after being sent and populated. Its mainly purpose is for emailing service.
 */
export interface IMessageSentPopulated {
  _id: ObjectId; // ObjectId.toString()
  timestamp: string;
  from: ObjectId; // ObjectId.toString()
  to: {
    username: string;
  };
  message: string;
  type: string;
}

/**
 * Type of Message Object populated. For sending it to the client.
 */

export interface IMongoPopulatedMessages {
  _id: ObjectId;
  timestamp: string;
  from: IUserShortInfo | ObjectId;
  to: IUserShortInfo | ObjectId;
  message: string;
}

/**
 *
 * Type of Message Object to be stored and query from Mongo.
 *
 */
export interface IMongoMessage extends INew_Message, Document {
  _id: ObjectId; // ObjectId.toString()
}

/**
 *
 * Type of Message Object receiving from the frontend.
 *
 */
export interface INew_Message {
  timestamp: string;
  from: string;
  to: string;
  message: string;
  type: "user" | "bot";
}

/**
 *
 * Message Storage Classes structure
 *
 */
export interface DBMessagesClass {
  init?(): Promise<void>;
  get(
    user_id: string,
    otherUser: string | undefined
  ): Promise<IChats | IMongoPopulatedMessages[] | ApiError>;
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
