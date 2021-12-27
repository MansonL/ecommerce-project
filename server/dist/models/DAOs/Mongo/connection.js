"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongoConnection = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const usersFactory_1 = require("../../usersFactory");
const usersFactory_2 = require("../../usersFactory");
const models_1 = require("./models");
const mongoURL = usersFactory_1.storage === usersFactory_2.MemoryType.MongoAtlas ? models_1.atlasURI : models_1.mongoURI;
const mongoConnection = () => {
    return mongoose_1.default.connect(mongoURL).then((data) => {
        console.log(`MongoDB Connected`);
        return data.connection.getClient();
    });
};
exports.mongoConnection = mongoConnection;
//.then(m => {
//console.log('Mongo DB Connected');
//return m.connection.getClient();
