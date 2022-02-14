import cluster from "cluster";
import { Config, MemoryType } from "../config/config";
import { logger } from "../services/logger";
import { MongoOrders } from "./DAOs/Mongo/orders";

export class OrdersFactory {
  static get(type: string): MongoOrders {
    switch (type) {
      case MemoryType.MongoAtlas:
        if (Config.MODE === "CLUSTER") {
          if (cluster.isMaster) {
            logger.info(`Using MongoAtlas`);
            return new MongoOrders();
          }
          return new MongoOrders();
        } else {
          logger.info(`Using MongoAtlas`);
          return new MongoOrders();
        }

      case MemoryType.LocalMongo:
        if (Config.MODE === "CLUSTER") {
          if (cluster.isMaster) {
            logger.info(`Using Local Mongo`);
            return new MongoOrders();
          }
          return new MongoOrders();
        } else {
          logger.info(`Using Local Mongo`);
          return new MongoOrders();
        }

      default:
        if (Config.MODE === "CLUSTER") {
          if (cluster.isMaster) {
            logger.info(`DEFAULT: MongoAtlas`);
            return new MongoOrders();
          }
          return new MongoOrders();
        } else {
          logger.info(`DEFAULT: MongoAtlas`);
          return new MongoOrders();
        }
    }
  }
}
