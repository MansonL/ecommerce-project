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
exports.MongoOrders = void 0;
const cluster_1 = __importDefault(require("cluster"));
const mongoose_1 = require("mongoose");
const errorApi_1 = require("../../../api/errorApi");
const EErrors_1 = require("../../../common/EErrors");
const utils_1 = require("../../../common/utils");
const config_1 = require("../../../config/config");
const logger_1 = require("../../../services/logger");
const ordersSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'users' },
    orders: [{
            createdAt: { type: String, required: true },
            products: [{
                    product_id: { type: mongoose_1.Types.ObjectId, ref: 'products', required: true },
                    quantity: { type: Number, required: true },
                    price: { type: Number, required: true },
                    _id: false,
                }],
            status: { type: String, required: true },
            total: { type: Number, required: true },
            address: { type: mongoose_1.Types.ObjectId, required: true, ref: 'users.data.addresses' }
        }]
});
ordersSchema.set('toJSON', {
    transform: (document, returnedDocument) => {
        delete returnedDocument.__v;
    }
});
const ordersModel = (0, mongoose_1.model)('orders', ordersSchema);
class MongoOrders {
    constructor() {
        this.orders = ordersModel;
        this.init();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            if (config_1.Config.MODE === 'CLUSTER') {
                if (cluster_1.default.isMaster) {
                    yield this.orders.deleteMany({});
                    logger_1.logger.info(`Orders cleaned`);
                }
            }
            else {
                yield this.orders.deleteMany({});
                logger_1.logger.info(`Orders cleaned`);
            }
        });
    }
    get(type, _id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (type != null && _id != null) {
                    if (type === 'user') {
                        const doc = yield this.orders.findOne({ user: _id });
                        if (doc) {
                            const docPopulated = yield utils_1.Utils.populatedAddressDeep([doc]);
                            if (docPopulated instanceof errorApi_1.ApiError)
                                return docPopulated;
                            else
                                return docPopulated[0].orders;
                        }
                        else
                            return errorApi_1.ApiError.notFound(EErrors_1.EOrdersErrors.NoOrdersCreated);
                    }
                    else {
                        const doc = yield (yield this.orders.findOne({ "orders._id": _id }));
                        if (doc) {
                            const docPopulated = yield utils_1.Utils.populatedAddressDeep([doc]);
                            if (docPopulated instanceof errorApi_1.ApiError)
                                return docPopulated;
                            else
                                return docPopulated[0].orders;
                        }
                        else
                            return errorApi_1.ApiError.notFound(EErrors_1.EOrdersErrors.OrderNotFound);
                    }
                }
                else {
                    const docs = yield this.orders.find({});
                    if (docs.length > 0) { // Querying all the orders from all the users.
                        const populatedAddressDocs = yield utils_1.Utils.populatedAddressDeep(docs);
                        if (populatedAddressDocs instanceof errorApi_1.ApiError)
                            return populatedAddressDocs;
                        else
                            return populatedAddressDocs;
                    }
                    else
                        return errorApi_1.ApiError.notFound(EErrors_1.EOrdersErrors.NoOrdersCreated);
                }
            }
            catch (error) {
                return errorApi_1.ApiError.internalError(`An error occured.`);
            }
        });
    }
    create(order, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const doc = yield this.orders.findOne({ user: user_id });
                if (doc) {
                    doc.orders.push(order);
                    yield doc.save();
                    const docPopulated = yield utils_1.Utils.populatedAddressDeep([doc]);
                    if (docPopulated instanceof errorApi_1.ApiError)
                        return docPopulated;
                    else
                        return {
                            message: `Order successfully created.`,
                            data: docPopulated[0].orders.find(orderPopulated => orderPopulated._id == order._id)
                        };
                }
                else {
                    const doc = yield this.orders.create({
                        user: user_id,
                        orders: [order],
                    });
                    const docPopulated = yield utils_1.Utils.populatedAddressDeep([doc]);
                    logger_1.logger.info(JSON.stringify(docPopulated));
                    if (docPopulated instanceof errorApi_1.ApiError)
                        return docPopulated;
                    else
                        return {
                            message: `Order successfully created.`,
                            data: docPopulated[0].orders.find(orderPopulated => orderPopulated._id == order._id)
                        };
                }
            }
            catch (error) {
                return errorApi_1.ApiError.internalError(`An error occured.`);
            }
        });
    }
    modifyStatus(order_id, newStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const doc = yield this.orders.findOne({ 'orders._id': order_id });
                if (doc) {
                    const modifiedOrder = [];
                    doc.orders.forEach(order => {
                        if (String(order._id) == order_id) {
                            order.status = newStatus;
                            modifiedOrder.push(order);
                        }
                    });
                    yield doc.save();
                    const docPopulated = yield utils_1.Utils.populatedAddressDeep([doc]);
                    if (docPopulated instanceof errorApi_1.ApiError)
                        return docPopulated;
                    else
                        return {
                            message: `Order status successfully modified.`,
                            data: docPopulated[0].orders.find(populatedOrder => String(populatedOrder._id) == order_id)
                        };
                }
                else
                    return errorApi_1.ApiError.notFound(EErrors_1.EOrdersErrors.OrderNotFound);
            }
            catch (error) {
                return errorApi_1.ApiError.internalError(`An error occured.`);
            }
        });
    }
}
exports.MongoOrders = MongoOrders;
