"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersFactory = exports.storage = exports.MemoryType = void 0;
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
exports.storage = MemoryType.MongoAtlas;
class UsersFactory {
    static get(type) {
        switch (type) {
            case MemoryType.MongoAtlas:
                console.log(`Using MongoAtlas`);
                return new users_1.MongoUsers('atlas');
            case MemoryType.LocalMongo:
                console.log(`Using Local Mongo`);
                return new users_1.MongoUsers('local');
            default:
                console.log(`DEFAULT: MongoAtlas`);
                return new users_1.MongoUsers('atlas');
        }
    }
}
exports.UsersFactory = UsersFactory;
