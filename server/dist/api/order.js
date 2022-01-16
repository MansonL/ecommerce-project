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
exports.ordersApi = exports.OrdersApi = void 0;
const orderFactory_1 = require("../models/orderFactory");
const usersFactory_1 = require("../models/usersFactory");
class OrdersApi {
    constructor() {
        this.orders = orderFactory_1.OrdersFactory.get(usersFactory_1.storage);
    }
    get(type, _id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.orders.get(type, _id);
            return result;
        });
    }
    create(order, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.orders.create(order, user_id);
            return result;
        });
    }
    modifyOrder(order_id, newStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.orders.modifyStatus(order_id, newStatus);
            return result;
        });
    }
}
exports.OrdersApi = OrdersApi;
;
exports.ordersApi = new OrdersApi();
