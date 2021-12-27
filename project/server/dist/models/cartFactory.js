"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartFactory = void 0;
const cart_1 = require("./DAOs/Mongo/cart");
const usersFactory_1 = require("./usersFactory");
class CartFactory {
    static get(type) {
        switch (type) {
            case usersFactory_1.MemoryType.MongoAtlas:
                console.log(`Using ATLAS`);
                return new cart_1.MongoCart('Atlas');
            case usersFactory_1.MemoryType.LocalMongo:
                console.log(`Using Local Mongo`);
                return new cart_1.MongoCart('local');
            default:
                console.log(`DEFAULT: MongoAtlas`);
                return new cart_1.MongoCart('atlas');
        }
    }
}
exports.CartFactory = CartFactory;
