import cluster from "cluster";
import { Config } from "../config/config";
import { logger } from "../services/logger";
import { MongoCart } from "./DAOs/Mongo/cart";
import { MemoryType } from "./usersFactory";

export class CartFactory {
  static get(type: string): MongoCart {
    switch (type) {
      case MemoryType.MongoAtlas:
        if (Config.MODE === "CLUSTER") {
          if (cluster.isMaster) {
            logger.info(`Using MongoAtlas`);
            return new MongoCart();
          }
          return new MongoCart();
        } else {
          logger.info(`Using MongoAtlas`);
          return new MongoCart();
        }
      case MemoryType.LocalMongo:
        if (Config.MODE === "CLUSTER") {
          if (cluster.isMaster) {
            logger.info(`Using Local Mongo`);
            return new MongoCart();
          }
          return new MongoCart();
        } else {
          logger.info(`Using Local Mongo`);
          return new MongoCart();
        }
      default:
        if (Config.MODE === "CLUSTER") {
          if (cluster.isMaster) {
            logger.info(`DEFAULT: MongoAtlas`);
          }
          return new MongoCart();
        } else {
          logger.info(`DEFAULT: MongoAtlas`);
          return new MongoCart();
        }
    }
  }
}
