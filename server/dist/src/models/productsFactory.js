"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsFactory = void 0;
const cluster_1 = __importDefault(require("cluster"));
const config_1 = require("../config/config");
const logger_1 = require("../services/logger");
const products_1 = require("./DAOs/Mongo/products");
const usersFactory_1 = require("./usersFactory");
/**
 *
 *
 * Factory of Products DAOs
 *
 * This class will return the selected type of memory storage
 *
 *
 */
class ProductsFactory {
    static get(type) {
        switch (type) {
            case usersFactory_1.MemoryType.MongoAtlas:
                if (config_1.Config.MODE === 'CLUSTER') {
                    if (cluster_1.default.isMaster) {
                        logger_1.logger.info(`Using MongoAtlas`);
                        return new products_1.MongoProducts();
                    }
                    return new products_1.MongoProducts();
                }
                else {
                    logger_1.logger.info(`Using MongoAtlas`);
                    return new products_1.MongoProducts();
                }
            case usersFactory_1.MemoryType.LocalMongo:
                if (config_1.Config.MODE === 'CLUSTER') {
                    if (cluster_1.default.isMaster) {
                        logger_1.logger.info(`Using Local Mongo`);
                        return new products_1.MongoProducts();
                    }
                    return new products_1.MongoProducts();
                }
                else {
                    logger_1.logger.info(`Using Local Mongo`);
                    return new products_1.MongoProducts();
                }
            default:
                if (config_1.Config.MODE === 'CLUSTER') {
                    if (cluster_1.default.isMaster) {
                        logger_1.logger.info(`DEFAULT: MongoAtlas`);
                    }
                    return new products_1.MongoProducts();
                }
                else {
                    logger_1.logger.info(`DEFAULT: MongoAtlas`);
                    return new products_1.MongoProducts();
                }
        }
    }
}
exports.ProductsFactory = ProductsFactory;
