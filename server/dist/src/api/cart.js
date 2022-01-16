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
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartApi = void 0;
const cartFactory_1 = require("../models/cartFactory");
const usersFactory_1 = require("../models/usersFactory");
/**
 *
 * ApiProducts Class: here we are receiving the type of storage
 * & connecting with the product controller
 *
 */
class CartApi {
    constructor() {
        this.products = cartFactory_1.CartFactory.get(usersFactory_1.storage);
    }
    get(username) {
        return __awaiter(this, void 0, void 0, function* () {
            if (username != null) {
                const product = yield this.products.get(username);
                return product;
            }
            else {
                const product = yield this.products.get();
                return product;
            }
        });
    }
    addProduct(username, product_id, quantity) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.products.add(username, product_id, quantity);
            return result;
        });
    }
    deleteProduct(username, product_id, quantity) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.products.delete(username, product_id, quantity);
            return result;
        });
    }
}
exports.cartApi = new CartApi();
