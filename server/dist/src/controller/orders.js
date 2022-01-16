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
exports.ordersController = void 0;
const moment_1 = __importDefault(require("moment"));
const mongodb_1 = require("mongodb");
const mongoose_1 = require("mongoose");
const errorApi_1 = require("../api/errorApi");
const order_1 = require("../api/order");
const users_1 = require("../api/users");
const EErrors_1 = require("../common/EErrors");
const utils_1 = require("../common/utils");
class OrdersController {
    getByAdmin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user_id, order_id } = req.body;
            if (user_id) {
                if ((0, mongoose_1.isValidObjectId)(user_id)) {
                    const result = yield order_1.ordersApi.get('user', user_id);
                    // Will be one document containing the orders of the user if there's no error.
                    if (result instanceof errorApi_1.ApiError)
                        next(result);
                    else
                        res.status(200).send(result);
                }
                else
                    next(errorApi_1.ApiError.badRequest(EErrors_1.EProductsErrors.IdIncorrect));
            }
            else if (order_id) {
                if ((0, mongoose_1.isValidObjectId)(order_id)) {
                    const result = yield order_1.ordersApi.get('order', order_id);
                    // Will be IOrderPopulated if there's no error.
                    if (result instanceof errorApi_1.ApiError)
                        next(result);
                    else
                        res.status(200).send(result);
                }
                else
                    next(errorApi_1.ApiError.badRequest(EErrors_1.EProductsErrors.IdIncorrect));
            }
            else {
                const result = yield order_1.ordersApi.get(undefined, undefined);
                // Will be IMongoOrderPopulated[] of every user if there's no error.
                if (result instanceof errorApi_1.ApiError)
                    next(result);
                else
                    res.status(200).send(result);
            }
        });
    }
    getByUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const order_id = req.params.id;
            const { user_id } = req.user;
            if (order_id) {
                if ((0, mongoose_1.isValidObjectId)(order_id)) {
                    const result = yield order_1.ordersApi.get('order', order_id);
                    // At frontend user must only have a view of his orders and theirs id's.
                    if (result instanceof errorApi_1.ApiError)
                        next(result);
                    else
                        res.status(200).send(result);
                }
                else
                    next(errorApi_1.ApiError.badRequest(EErrors_1.EProductsErrors.IdIncorrect));
            }
            else {
                const result = yield order_1.ordersApi.get('user', user_id);
                // Retrieving all orders of the user
                if (result instanceof errorApi_1.ApiError)
                    next(result);
                else
                    res.status(200).send(result);
            }
        });
    }
    createOrder(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user_id } = req.user;
            const { products, total, address } = req.body;
            const isValidOrder = yield utils_1.Utils.isValidOrder(products);
            if (isValidOrder instanceof errorApi_1.ApiError)
                next(isValidOrder);
            else if (typeof isValidOrder === 'string')
                next(errorApi_1.ApiError.badRequest(isValidOrder));
            else {
                const order = {
                    _id: new mongodb_1.ObjectId(),
                    createdAt: (0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss'),
                    products: products,
                    status: 'created',
                    total: total,
                    address: address
                };
                const result = yield order_1.ordersApi.create(order, user_id);
                if (result instanceof errorApi_1.ApiError)
                    next(result);
                else {
                    const user = (yield users_1.usersApi.getUser(user_id))[0];
                    const customerTo = user.data.username;
                    const customerSubject = `[NEW ORDER]: You have created a new order at Ecommerce.`;
                    const selectedAddress = result.data.address;
                    let adminsResult = yield users_1.usersApi.getAdmins();
                    if (adminsResult instanceof errorApi_1.ApiError)
                        res.send(adminsResult);
                    else {
                        const adminsSubject = `[NEW ORDER]: ${user.data.name} ${user.data.surname} has made an order.`;
                        const adminsTo = adminsResult.join(', ');
                        const customerMail = utils_1.Utils.createHTMLOrderEmail(result.data.products, utils_1.Utils.addressHTMLFormat(selectedAddress), total, ['You have made an order!', 'Your order will be delivered to']);
                        const adminsMail = utils_1.Utils.createHTMLOrderEmail(result.data.products, utils_1.Utils.addressHTMLFormat(selectedAddress), total, ['A new order was made!', 'Address']);
                        yield utils_1.Utils.sendEmail(customerTo, customerSubject, customerMail);
                        yield utils_1.Utils.sendEmail(adminsTo, adminsSubject, adminsMail);
                        res.status(201).send(result);
                    }
                }
            }
        });
    }
    modifyOrder(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { order_id, newStatus } = req.body;
            if (order_id && newStatus) {
                if ((0, mongoose_1.isValidObjectId)(order_id)) {
                    if (newStatus === 'paid' || newStatus === 'delivering' || newStatus === 'completed') {
                        const result = yield order_1.ordersApi.modifyOrder(order_id, newStatus);
                        if (result instanceof errorApi_1.ApiError)
                            next(result);
                        else
                            res.status(201).send(result);
                    }
                    else
                        next(errorApi_1.ApiError.badRequest(`Valid status to assign: paid, delivering or completed `));
                }
                else
                    next(errorApi_1.ApiError.badRequest(EErrors_1.EProductsErrors.IdIncorrect));
            }
            else {
                next(errorApi_1.ApiError.badRequest(`Please type an order id and a new status for the order.`));
            }
        });
    }
}
exports.ordersController = new OrdersController();
