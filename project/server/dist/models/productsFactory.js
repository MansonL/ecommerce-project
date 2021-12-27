"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsFactory = void 0;
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
                console.log(`Using MongoAtlas`);
                return new products_1.MongoProducts('atlas');
            case usersFactory_1.MemoryType.LocalMongo:
                console.log(`Using Local Mongo`);
                return new products_1.MongoProducts('local');
            default:
                console.log(`DEFAULT: MongoAtlas`);
                return new products_1.MongoProducts('atlas');
        }
    }
}
exports.ProductsFactory = ProductsFactory;
