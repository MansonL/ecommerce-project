"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesFactory = void 0;
const usersFactory_1 = require("./usersFactory");
const messages_1 = require("./DAOs/Mongo/messages");
const logger_1 = require("../services/logger");
const config_1 = require("../config/config");
const cluster_1 = __importDefault(require("cluster"));
/**
 *
 *
 * Factory of Messages DAOs
 *
 * This class will return the selected type of memory storage
 *
 *
 */
class MessagesFactory {
    static get(type) {
        switch (type) {
            case usersFactory_1.MemoryType.MongoAtlas:
                if (config_1.Config.MODE === 'CLUSTER') {
                    if (cluster_1.default.isMaster) {
                        logger_1.logger.info(`Using MongoAtlas`);
                        return new messages_1.MongoMessages();
                    }
                    return new messages_1.MongoMessages();
                }
                else {
                    logger_1.logger.info(`Using MongoAtlas`);
                    return new messages_1.MongoMessages();
                }
            case usersFactory_1.MemoryType.LocalMongo:
                if (config_1.Config.MODE === 'CLUSTER') {
                    if (cluster_1.default.isMaster) {
                        logger_1.logger.info(`Using Local Mongo`);
                        return new messages_1.MongoMessages();
                    }
                    return new messages_1.MongoMessages();
                }
                else {
                    logger_1.logger.info(`Using Local Mongo`);
                    return new messages_1.MongoMessages();
                }
            default:
                if (config_1.Config.MODE === 'CLUSTER') {
                    if (cluster_1.default.isMaster) {
                        logger_1.logger.info(`DEFAULT: MongoAtlas`);
                        return new messages_1.MongoMessages();
                    }
                    return new messages_1.MongoMessages();
                }
                else {
                    logger_1.logger.info(`DEFAULT: MongoAtlas`);
                    return new messages_1.MongoMessages();
                }
        }
    }
}
exports.MessagesFactory = MessagesFactory;
