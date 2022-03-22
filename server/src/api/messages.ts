import { CUDResponse } from "../interfaces/others";
import { MongoMessages } from "../models/DAOs/Mongo/messages";
import { MessagesFactory } from "../models/messagesFactory";
import { ApiError } from "./errorApi";
import { IMongoPopulatedMessages, INew_Message } from "../interfaces/messages";
import { storage } from "../config/config";

export class MessagesApi {
  private messages: MongoMessages;
  constructor() {
    this.messages = MessagesFactory.get(storage);
  }
  async getMsg(
    user_id: string,
    type: "latest" | "chat",
    otherUser: string | undefined
  ): Promise<Map<string, IMongoPopulatedMessages[]> | ApiError> {
    const result: Map<string, IMongoPopulatedMessages[]> | ApiError =
      await this.messages.get(user_id, type, otherUser);
    return result;
  }
  async addMsg(message: INew_Message): Promise<CUDResponse | ApiError> {
    const result: CUDResponse | ApiError = await this.messages.add(message);
    return result;
  }
}

export const messagesApi = new MessagesApi();
