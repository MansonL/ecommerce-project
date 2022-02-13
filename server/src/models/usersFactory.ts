import cluster from "cluster";
import { Config } from "../config/config";
import { logger } from "../services/logger";
import { MongoUsers } from "./DAOs/Mongo/users";

/**
 *
 * Different types of memory storage
 *
 */

export enum MemoryType {
  // eslint-disable-next-line no-unused-vars
  MongoAtlas = "Mongo-Atlas",
  // eslint-disable-next-line no-unused-vars
  LocalMongo = "Local-Mongo",
}

export const storage = Config.PERSISTANCE;

export class UsersFactory {
  static get(type: string): MongoUsers {
    switch (type) {
      case MemoryType.MongoAtlas:
        if (Config.MODE === "CLUSTER") {
          if (cluster.isMaster) {
            logger.info(`Using MongoAtlas`);
            return new MongoUsers();
          }
          return new MongoUsers();
        } else {
          logger.info(`Using MongoAtlas`);
          return new MongoUsers();
        }

      case MemoryType.LocalMongo:
        if (Config.MODE === "CLUSTER") {
          if (cluster.isMaster) {
            logger.info(`Using Local Mongo`);
            return new MongoUsers();
          }
          return new MongoUsers();
        } else {
          logger.info(`Using Local Mongo`);
          return new MongoUsers();
        }

      default:
        if (Config.MODE === "CLUSTER") {
          if (cluster.isMaster) {
            logger.info(`DEFAULT: MongoAtlas`);
            return new MongoUsers();
          }
          return new MongoUsers();
        } else {
          logger.info(`DEFAULT: MongoAtlas`);
          return new MongoUsers();
        }
    }
  }
}
