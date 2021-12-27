"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utils = void 0;
const faker_1 = __importDefault(require("faker"));
const moment_1 = __importDefault(require("moment"));
const mockProducts_1 = require("../models/mockProducts");
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
class Utils {
}
exports.Utils = Utils;
_a = Utils;
/**
 *
 * @param type: string
 *
 * @returns : Max price or stock of products.
 */
Utils.getMaxStockPrice = (products, type) => __awaiter(void 0, void 0, void 0, function* () {
    if (type === 'price') {
        const prices = products.map((product) => product.price);
        return Math.max(...prices);
    }
    else {
        const stocks = products.map((product) => product.stock);
        return Math.max(...stocks);
    }
});
/**
 * Product code different than DB id.
 * @returns String code.
 */
Utils.generateCode = () => {
    return `_${Math.random().toString(36).substr(2, 9)}`;
};
/**
 * Functions for extracting the needed data from the queried docs from MongoDB
 * @param documents
 *
 * @returns
 */
Utils.extractMongoProducts = (documents) => {
    const products = documents.map((document) => {
        const { _id, timestamp, title, description, code, img, stock, price, } = document.toObject({ flattenMaps: true });
        const product = {
            _id: _id,
            timestamp: timestamp,
            title: title,
            description: description,
            code: code,
            img: img,
            stock: stock,
            price: price,
        };
        return product;
    });
    return products;
};
Utils.extractMongoMessages = (documents) => {
    const messages = documents.map((document) => {
        const { timestamp, author, message } = document.toObject({
            flattenMaps: true,
        });
        const _id = document._id;
        const mongoMessage = {
            _id,
            timestamp,
            author,
            message,
        };
        return mongoMessage;
    });
    return messages;
};
Utils.extractMongoUsers = (documents) => {
    const users = documents.map((document) => {
        const { timestamp, username, password, name, surname, age, alias, avatar, facebookID, photos } = document.toObject({ flattenMaps: true });
        const _id = document._id;
        const mongoUser = {
            _id: _id,
            timestamp: timestamp,
            username: username,
            password: password,
            name: name,
            surname: surname,
            age: age,
            alias: alias,
            avatar: avatar,
            facebookID: facebookID,
            photos: photos,
        };
        return mongoUser;
    });
    return users;
};
Utils.extractMongoCartDocs = (documents) => {
    const productsIds = documents.map((document) => {
        const { product_id } = document;
        return product_id;
    });
    const products = _a.extractMongoProducts(documents);
    const cartProducts = products.map((product, idx) => {
        return Object.assign({ product_id: productsIds[idx] }, product);
    });
    return cartProducts;
};
Utils.generateRandomProducts = (qty) => {
    const randomProducts = [];
    for (let i = 0; i < qty; i++) {
        const randomProduct = {
            _id: new mongoose_1.Types.ObjectId().toString(),
            timestamp: (0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss'),
            title: faker_1.default.commerce.productName(),
            description: faker_1.default.commerce.productDescription(),
            img: faker_1.default.image.imageUrl(),
            code: _a.generateCode(),
            price: Number(faker_1.default.commerce.price(0.01)),
            stock: (0, mockProducts_1.randomNumber)('stock'),
        };
        randomProducts.push(randomProduct);
    }
    return randomProducts;
};
/**
* Function for encrypting user password
* @param password to encrypt
* @returns password encrypted
*
*/
Utils.createHash = (password) => {
    return bcrypt_1.default.hashSync(password, bcrypt_1.default.genSaltSync(10));
};
/**
*
* @param user IUser object which contains encripted password
* @param password password submitted from frontend
* @returns true if matches, false if it doesn't matches
*/
Utils.validPassword = (user, password) => {
    return bcrypt_1.default.compareSync(password, user.password);
};
