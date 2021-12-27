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
    getProduct(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (id != null) {
                const product = yield this.products.get(id);
                return product;
            }
            else {
                const product = yield this.products.get();
                return product;
            }
        });
    }
    addProduct(id, product) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.products.add(id, product);
            return result;
        });
    }
    deleteProduct(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.products.delete(id);
            return result;
        });
    }
}
exports.cartApi = new CartApi();
