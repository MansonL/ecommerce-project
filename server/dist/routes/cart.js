"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartRouter = void 0;
const express_1 = __importDefault(require("express"));
const cart_1 = require("../controller/cart");
exports.cartRouter = express_1.default.Router();
exports.cartRouter.get('/list', cart_1.cart_controller.getCart);
exports.cartRouter.get('/list/:id', cart_1.cart_controller.getProduct);
exports.cartRouter.post('/add/:id', cart_1.cart_controller.addToCart);
exports.cartRouter.delete('/delete/:id', cart_1.cart_controller.deleteFromCart);
