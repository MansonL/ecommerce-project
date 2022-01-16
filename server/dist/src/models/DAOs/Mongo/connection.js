"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongoConnection = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("../../../config/config");
const usersFactory_1 = require("../../usersFactory");
const usersFactory_2 = require("../../usersFactory");
const logger_1 = require("../../../services/logger");
const cluster_1 = __importDefault(require("cluster"));
const atlasURI = `mongodb+srv://${config_1.Config.ATLAS_DB_USER}:${config_1.Config.ATLAS_DB_PASSWORD}@project.lofof.mongodb.net/${config_1.Config.DB_NAME}?retryWrites=true&w=majority`;
const mongoURI = `mongodb://${config_1.Config.ATLAS_DB_USER}:${config_1.Config.ATLAS_DB_PASSWORD}@localhost:27018/${config_1.Config.DB_NAME}`;
const mongoURL = usersFactory_1.storage === usersFactory_2.MemoryType.MongoAtlas ? atlasURI : mongoURI;
const mongoConnection = () => {
    return mongoose_1.default.connect(mongoURL).then((data) => {
        if (config_1.Config.MODE === 'CLUSTER') {
            if (cluster_1.default.isMaster) {
                logger_1.logger.info(`MongoDB Connected`);
            }
        }
        return data.connection.getClient();
    });
};
exports.mongoConnection = mongoConnection;
