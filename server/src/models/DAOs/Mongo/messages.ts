import { Model, Schema, model } from "mongoose";
import { ApiError } from "../../../api/errorApi";
import {
  DBMessagesClass,
  IMongoMessage,
  IMongoPopulatedMessages,
  INew_Message,
} from "../../../interfaces/messages";
import { CUDResponse } from "../../../interfaces/others";
import { Config } from "../../../config/config";
import cluster from "cluster";
import { logger } from "../../../services/logger";

const messagesSchema = new Schema({
  timestamp: { type: String, required: true },
  from: { type: Schema.Types.ObjectId, ref: "users" },
  to: { type: Schema.Types.ObjectId, ref: "users" },
  message: { type: String, required: true },
});

messagesSchema.set("toJSON", {
  transform: (document, returnedDocument) => {
    delete returnedDocument.__v;
  },
});

const messagesModel = model<INew_Message, Model<INew_Message>>(
  "messages",
  messagesSchema
);

export class MongoMessages implements DBMessagesClass {
  private messages: Model<INew_Message>;
  constructor() {
    this.messages = messagesModel;
    this.init();
  }
  async init() {
    if (Config.MODE === "CLUSTER") {
      if (cluster.isMaster) {
        await this.messages.deleteMany({});
        logger.info(`Messages initialized`);
      }
    } else {
      await this.messages.deleteMany({});
      logger.info(`Messages initialized`);
    }
  }
  async get(
    user_id: string,
    type: "latest" | "chat",
    otherUser: string | undefined
  ): Promise<Map<string, IMongoPopulatedMessages[]> | ApiError> {
    try {
      const docs = (await this.messages
        .find({})
        .populate(
          "to from",
          "username name surname avatar _id"
        )) as IMongoPopulatedMessages[];
      if (docs.length > 0) {
        const messages = new Map<string, IMongoPopulatedMessages[]>();
        docs.forEach((document) => {
          const isInvolved =
            document.to.toString() === user_id
              ? "received"
              : document.from.toString() === user_id
              ? "sent"
              : false;
          if (typeof isInvolved === "string") {
            if (
              otherUser &&
              (document.to.toString() === otherUser ||
                document.from.toString() === otherUser)
            ) {
              messages.has(otherUser)
                ? messages.get(otherUser)?.push(document)
                : messages.set(otherUser, [document]);
            } else if (!otherUser) {
              const otherUser =
                isInvolved === "received"
                  ? document.from.toString()
                  : document.to.toString();
              messages.has(otherUser)
                ? messages.get(otherUser)?.push(document)
                : messages.set(otherUser, [document]);
            }
          }
        });
        if (type === "latest") {
          messages.forEach((conversation, otherUser) => {
            const lastMessage = conversation.pop() as IMongoPopulatedMessages; // This line is due to we have already checked that this array won't be empty, would be empty if we were creating a map of messages array with every user, but we're doing it only with the users the user that hitted this method has chatted.
            messages.set(otherUser, [lastMessage]);
          });
          return messages;
        } else {
          return messages;
        }
      } else {
        return ApiError.notFound(`No messages.`);
      }
    } catch (error) {
      return ApiError.internalError(`An error occured.`);
    }
  }
  async add(msg: INew_Message): Promise<CUDResponse | ApiError> {
    try {
      const doc = await (
        await this.messages.create(msg)
      ).populate({ path: "to", select: "username" });
      return {
        message: `Message successfully added.`,
        data: doc as IMongoMessage,
      };
    } catch (error) {
      return ApiError.internalError(`An error occured.`);
    }
  }
}
