"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersFactory = exports.storage = exports.MemoryType = void 0;
const cluster_1 = __importDefault(require("cluster"));
const config_1 = require("../config/config");
const logger_1 = require("../services/logger");
const users_1 = require("./DAOs/Mongo/users");
/**
 *
 * Different types of memory storage
 *
 */
var MemoryType;
(function (MemoryType) {
    MemoryType["MongoAtlas"] = "Mongo-Atlas";
    MemoryType["LocalMongo"] = "Local-Mongo";
})(MemoryType = exports.MemoryType || (exports.MemoryType = {}));
exports.storage = config_1.Config.PERSISTANCE;
class UsersFactory {
    static get(type) {
        switch (type) {
            case MemoryType.MongoAtlas:
                if (config_1.Config.MODE === 'CLUSTER') {
                    if (cluster_1.default.isMaster) {
                        logger_1.logger.info(`Using MongoAtlas`);
                        return new users_1.MongoUsers();
                    }
                    return new users_1.MongoUsers();
                }
                else {
                    logger_1.logger.info(`Using MongoAtlas`);
                    return new users_1.MongoUsers();
                }
            case MemoryType.LocalMongo:
                if (config_1.Config.MODE === 'CLUSTER') {
                    if (cluster_1.default.isMaster) {
                        logger_1.logger.info(`Using Local Mongo`);
                        return new users_1.MongoUsers();
                    }
                    return new users_1.MongoUsers();
                }
                else {
                    logger_1.logger.info(`Using Local Mongo`);
                    return new users_1.MongoUsers();
                }
            default:
                if (config_1.Config.MODE === 'CLUSTER') {
                    if (cluster_1.default.isMaster) {
                        logger_1.logger.info(`DEFAULT: MongoAtlas`);
                        return new users_1.MongoUsers();
                    }
                    return new users_1.MongoUsers();
                }
                else {
                    logger_1.logger.info(`DEFAULT: MongoAtlas`);
                    return new users_1.MongoUsers();
                }
        }
    }
}
exports.UsersFactory = UsersFactory;
