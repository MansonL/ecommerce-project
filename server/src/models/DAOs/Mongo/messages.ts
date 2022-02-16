import { Model, Schema, model, Document, Types } from "mongoose";
import { ApiError } from "../../../api/errorApi";
import {
  DBMessagesClass,
  IMongoMessage,
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
  async get(user_id: string | undefined): Promise<IMongoMessage[] | ApiError> {
    try {
      const docs = await this.messages.find({});
      if (docs.length > 0) {
        if (user_id) {
          const messages: (Document<any, any, INew_Message> &
            INew_Message & {
              _id: Types.ObjectId;
            })[] = [];
          for await (const document of docs) {
            if (String(document.from) == user_id) {
              const populatedDoc = await document.populate({
                path: "to",
                select: "username name surname _id avatar",
              });
              messages.push(populatedDoc);
            } else if (String(document.to) == user_id) {
              const populatedDoc = await document.populate({
                path: "from",
                select: "username name surname _id avatar",
              });
              messages.push(populatedDoc);
            }
          }
          return messages as IMongoMessage[];
        } else {
          const messages: (Document<any, any, INew_Message> &
            INew_Message & {
              _id: Types.ObjectId;
            })[] = [];
          await docs.forEach(async (document) => {
            const populatedDoc = await document.populate({
              path: "from to",
              select: "username",
            });
            messages.push(populatedDoc);
          });
          return messages as IMongoMessage[];
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
