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
exports.MongoCart = void 0;
const EErrors_1 = require("../../../common/EErrors");
const utils_1 = require("../../../common/utils");
const checkType_1 = require("../../../interfaces/checkType");
const errorApi_1 = require("../../../utils/errorApi");
const models_1 = require("./models");
class MongoCart {
    constructor(type) {
        this.cart = models_1.models.cart;
        this.init();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.cart.deleteMany({});
            console.log(`Cart cleaned`);
        });
    }
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (id != null) {
                    const doc = yield this.cart.find({
                        product_id: id,
                    });
                    console.log(doc);
                    if (doc.length > 0) {
                        const products = utils_1.Utils.extractMongoCartDocs(doc);
                        return products;
                    }
                    else {
                        return errorApi_1.ApiError.notFound(EErrors_1.EProductsErrors.ProductNotFound);
                    }
                }
                else {
                    const doc = yield this.cart.find({});
                    if (doc.length > 0) {
                        const products = utils_1.Utils.extractMongoCartDocs(doc);
                        return products;
                    }
                    else {
                        return errorApi_1.ApiError.notFound(EErrors_1.EProductsErrors.ProductNotFound);
                    }
                }
            }
            catch (error) {
                return {
                    error: error,
                    message: "An error occured."
                };
            }
        });
    }
    add(id, product) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cartProduct = Object.assign({ product_id: id }, product);
                yield this.cart.create(cartProduct);
                return {
                    message: `Product successfully added.`,
                    data: Object.assign({ _id: id }, product),
                };
            }
            catch (error) {
                return {
                    error: error,
                    message: "An error occured."
                };
            }
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deleted = yield this.get(id);
                if ((0, checkType_1.isCartProduct)(deleted)) {
                    const result = yield this.cart.deleteOne({ product_id: id });
                    return {
                        message: `Product successfully deleted.`,
                        data: deleted,
                    };
                }
                else {
                    const error = deleted;
                    return {
                        error: error.error,
                        message: error.message
                    };
                }
            }
            catch (error) {
                return {
                    error: error,
                    message: "An error occured."
                };
            }
        });
    }
}
exports.MongoCart = MongoCart;
