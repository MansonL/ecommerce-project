import { Model, Schema, model, isValidObjectId } from "mongoose";
import { ApiError } from "../../../api/errorApi";
import {
  DBMessagesClass,
  IChats,
  IMessageSentPopulated,
  IMongoPopulatedMessages,
  INew_Message,
} from "../../../interfaces/messages";
import { CUDResponse } from "../../../interfaces/others";
import { Config } from "../../../config/config";
import cluster from "cluster";
import { logger } from "../../../services/logger";
import { IUserShortInfo } from "../../../interfaces/users";

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
    otherUser: string | undefined
  ): Promise<IChats | IMongoPopulatedMessages[] | ApiError> {
    try {
      const receivedMessages = (await this.messages
        .find({ to: user_id })
        .populate(
          "from",
          "username name surname avatar _id"
        )) as IMongoPopulatedMessages[];

      const sentMessages = (await this.messages
        .find({ from: user_id })
        .populate(
          "to",
          "username name surname avatar _id"
        )) as IMongoPopulatedMessages[];
      if (sentMessages.length > 0 || receivedMessages.length > 0) {
        const chats = [...receivedMessages, ...sentMessages].sort((a, b) =>
          a.timestamp > b.timestamp ? 1 : a.timestamp === b.timestamp ? 0 : -1
        );
        if (otherUser) {
          return chats.filter((document) => {
            const otherInvolved = isValidObjectId(document.from)
              ? (document.to as IUserShortInfo)._id.toString()
              : (document.from as IUserShortInfo)._id.toString();
            return otherUser === otherInvolved;
          });
        } else {
          const messages: IChats = {};
          chats.forEach((document, idx, chats) => {
            // In the above queries, the documents have only one property populated, between 'to' and 'from', which will contain the other user information & the other property will contain the id string of the user making the request.
            const otherUser = isValidObjectId(document.from)
              ? (document.to as IUserShortInfo)._id
              : (document.from as IUserShortInfo)._id;
            if (!messages[otherUser.toString()])
              messages[otherUser.toString()] = chats
                .filter((document) => {
                  const otherInvolved = isValidObjectId(document.from)
                    ? (document.to as IUserShortInfo)._id
                    : (document.from as IUserShortInfo)._id;
                  return otherUser === otherInvolved;
                })
                .slice(-3)
                .reverse();
          });
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
        data: doc as unknown as IMessageSentPopulated,
      };
    } catch (error) {
      return ApiError.internalError(`An error occured.`);
    }
  }
}
