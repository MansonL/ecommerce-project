"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../controller/auth");
const cart_1 = require("../controller/cart");
exports.cartRouter = express_1.default.Router();
exports.cartRouter.get('/list', auth_1.authController.isAdmin, cart_1.cart_controller.getCarts);
exports.cartRouter.get('/list/:id', auth_1.authController.isAuthorized, cart_1.cart_controller.getOneCart);
exports.cartRouter.post('/add', auth_1.authController.isAuthorized, cart_1.cart_controller.addToCart);
exports.cartRouter.delete('/delete', auth_1.authController.isAuthorized, cart_1.cart_controller.deleteFromCart);
