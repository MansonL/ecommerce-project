"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersFactory = void 0;
const cluster_1 = __importDefault(require("cluster"));
const config_1 = require("../config/config");
const logger_1 = require("../services/logger");
const orders_1 = require("./DAOs/Mongo/orders");
const usersFactory_1 = require("./usersFactory");
class OrdersFactory {
    static get(type) {
        switch (type) {
            case usersFactory_1.MemoryType.MongoAtlas:
                if (config_1.Config.MODE === 'CLUSTER') {
                    if (cluster_1.default.isMaster) {
                        logger_1.logger.info(`Using MongoAtlas`);
                        return new orders_1.MongoOrders();
                    }
                    return new orders_1.MongoOrders();
                }
                else {
                    logger_1.logger.info(`Using MongoAtlas`);
                    return new orders_1.MongoOrders();
                }
            case usersFactory_1.MemoryType.LocalMongo:
                if (config_1.Config.MODE === 'CLUSTER') {
                    if (cluster_1.default.isMaster) {
                        logger_1.logger.info(`Using Local Mongo`);
                        return new orders_1.MongoOrders();
                    }
                    return new orders_1.MongoOrders();
                }
                else {
                    logger_1.logger.info(`Using Local Mongo`);
                    return new orders_1.MongoOrders();
                }
            default:
                if (config_1.Config.MODE === 'CLUSTER') {
                    if (cluster_1.default.isMaster) {
                        logger_1.logger.info(`DEFAULT: MongoAtlas`);
                        return new orders_1.MongoOrders();
                    }
                    return new orders_1.MongoOrders();
                }
                else {
                    logger_1.logger.info(`DEFAULT: MongoAtlas`);
                    return new orders_1.MongoOrders();
                }
        }
    }
}
exports.OrdersFactory = OrdersFactory;
