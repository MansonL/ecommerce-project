import { MongoMessages } from "./DAOs/Mongo/messages";
import { logger } from "../services/logger";
import { Config, MemoryType } from "../config/config";
import cluster from "cluster";

/**
 *
 *
 * Factory of Messages DAOs
 *
 * This class will return the selected type of memory storage
 *
 *
 */

export class MessagesFactory {
  static get(type: string): MongoMessages {
    switch (type) {
      case MemoryType.MongoAtlas:
        if (Config.MODE === "CLUSTER") {
          if (cluster.isMaster) {
            logger.info(`Using MongoAtlas`);
            return new MongoMessages();
          }
          return new MongoMessages();
        } else {
          logger.info(`Using MongoAtlas`);
          return new MongoMessages();
        }

      case MemoryType.LocalMongo:
        if (Config.MODE === "CLUSTER") {
          if (cluster.isMaster) {
            logger.info(`Using Local Mongo`);
            return new MongoMessages();
          }
          return new MongoMessages();
        } else {
          logger.info(`Using Local Mongo`);
          return new MongoMessages();
        }

      default:
        if (Config.MODE === "CLUSTER") {
          if (cluster.isMaster) {
            logger.info(`DEFAULT: MongoAtlas`);
            return new MongoMessages();
          }
          return new MongoMessages();
        } else {
          logger.info(`DEFAULT: MongoAtlas`);
          return new MongoMessages();
        }
    }
  }
}
