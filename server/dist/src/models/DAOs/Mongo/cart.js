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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoCart = void 0;
const mongoose_1 = require("mongoose");
const EErrors_1 = require("../../../common/EErrors");
const errorApi_1 = require("../../../api/errorApi");
const moment_1 = __importDefault(require("moment"));
const config_1 = require("../../../config/config");
const logger_1 = require("../../../services/logger");
const cluster_1 = __importDefault(require("cluster"));
const utils_1 = require("../../../common/utils");
const mongodb_1 = require("mongodb");
const cartSchema = new mongoose_1.Schema({
    createdAt: { type: String, required: true },
    modifiedAt: { type: String, required: true },
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'users' },
    products: [{
            product: { type: mongoose_1.Schema.Types.ObjectId, ref: 'products' },
            quantity: { type: Number, required: true },
            _id: false,
        }],
});
cartSchema.set('toJSON', {
    transform: (document, returnedDocument) => {
        delete returnedDocument.__v;
        delete returnedDocument.user._id;
    }
});
const cartModel = (0, mongoose_1.model)('cart', cartSchema);
class MongoCart {
    constructor() {
        this.cart = cartModel;
        this.init();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            if (config_1.Config.MODE === 'CLUSTER') {
                if (cluster_1.default.isMaster) {
                    yield this.cart.deleteMany({});
                    logger_1.logger.info(`Cart cleaned`);
                }
            }
            else {
                yield this.cart.deleteMany({});
                logger_1.logger.info(`Cart cleaned`);
            }
        });
    }
    get(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (user_id != null) {
                    const doc = yield this.cart.findOne({
                        user: user_id
                    });
                    if (doc) {
                        const cart = yield (yield doc.populate({ path: 'products.product', select: 'title price images' })).populate({ path: 'user', select: 'data.username' });
                        return [cart];
                    }
                    else {
                        return errorApi_1.ApiError.notFound(EErrors_1.ECartErrors.EmptyCart);
                    }
                }
                else {
                    const docs = yield this.cart.find({}).populate({ path: 'products.product', select: '_id title price images' }).populate({ path: 'user', select: 'data.username' });
                    if (docs.length > 0) {
                        return docs;
                    }
                    else {
                        return errorApi_1.ApiError.notFound(EErrors_1.ECartErrors.NoCarts);
                    }
                }
            }
            catch (error) {
                return errorApi_1.ApiError.internalError(`Internal error ocurred.`);
            }
        });
    }
    add(user_id, product_id, quantity) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cartDoc = yield this.cart.findOne({ user: user_id });
                const canAdd = yield utils_1.Utils.validateCartModification(product_id, quantity);
                if (canAdd) {
                    if (cartDoc) {
                        const product = cartDoc.products.find(product => product.product.toString() === product_id);
                        product ? product.quantity = quantity
                            : cartDoc.products.push({
                                product: new mongodb_1.ObjectId(product_id),
                                quantity: quantity,
                            });
                        yield cartDoc.save();
                        const cart = yield (yield cartDoc.populate({ path: 'products.product', select: '_id title price images' })).populate({ path: 'user', select: 'data.username' });
                        logger_1.logger.info(cart);
                        return {
                            message: `Product successfully added.`,
                            data: cart,
                        };
                    }
                    else {
                        const newCart = {
                            createdAt: (0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss'),
                            user: new mongodb_1.ObjectId(user_id),
                            products: [{
                                    product: new mongodb_1.ObjectId(product_id),
                                    quantity: quantity,
                                }]
                        };
                        const cartDoc = yield this.cart.create(newCart);
                        const cart = (yield (yield cartDoc.populate({ path: 'products.product', select: '_id title price images' })).populate({ path: 'user', select: 'data.username' }));
                        logger_1.logger.info(cart);
                        return {
                            message: `Product successfully added.`,
                            data: cart
                        };
                    }
                }
                else {
                    return errorApi_1.ApiError.badRequest(`Not enough stock of the desired product.`);
                }
            }
            catch (error) {
                return errorApi_1.ApiError.internalError(`An error occured.`);
            }
        });
    }
    delete(user_id, product_id, quantity) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cartDoc = yield this.cart.findOne({ user: user_id });
                if (cartDoc) {
                    let deleted = cartDoc.products.filter(product => product.product.toString() === product_id);
                    logger_1.logger.info(deleted);
                    if (deleted.length > 0 && (deleted[0].quantity >= quantity)) {
                        const newProducts = deleted[0].quantity === quantity ?
                            cartDoc.products.filter(product => product.product.toString() !== product_id) :
                            cartDoc.products.map(product => {
                                if (product.product.toString() === product_id)
                                    product.quantity = quantity;
                                if (product.quantity !== 0) {
                                    return product;
                                }
                            });
                        yield cartDoc.set('products', newProducts);
                        logger_1.logger.info(cartDoc);
                        yield cartDoc.save();
                        const newCart = yield (yield cartDoc.populate({ path: 'products.product', select: '_id title price images' })).populate({ path: 'user', select: 'data.username' });
                        return {
                            data: newCart,
                            message: `Product successfully deleted from cart.`
                        };
                    }
                    else if (deleted.length > 0) // The error was caused by the incorrect quantity to delete
                        return errorApi_1.ApiError.badRequest(`The desired amount of the product to delete is greater than the amount stored in the cart`);
                    else
                        return errorApi_1.ApiError.notFound(EErrors_1.ECartErrors.ProductNotInCart);
                }
                else {
                    return errorApi_1.ApiError.notFound(EErrors_1.ECartErrors.EmptyCart);
                }
            }
            catch (error) {
                return errorApi_1.ApiError.internalError(`An error occured.`);
            }
        });
    }
}
exports.MongoCart = MongoCart;
