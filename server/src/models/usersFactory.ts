import cluster from "cluster";
import { Config, MemoryType } from "../config/config";
import { logger } from "../services/logger";
import { MongoUsers } from "./DAOs/Mongo/users";

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
