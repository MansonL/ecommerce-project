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
exports.cart_controller = void 0;
const cart_1 = require("../api/cart");
const products_1 = require("../api/products");
const EErrors_1 = require("../common/EErrors");
const errorApi_1 = require("../api/errorApi");
const logger_1 = require("../services/logger");
const mongoose_1 = require("mongoose");
/**
 *
 * Cart Controller Class
 *
 */
class CartController {
    getOneCart(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user_id } = req.user;
            logger_1.logger.info(`[PATH]: Inside Cart Controller`);
            const result = yield cart_1.cartApi.get(user_id);
            if (result instanceof errorApi_1.ApiError)
                next(result);
            else
                res.status(200).send(result[0]);
        });
    }
    getCarts(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.logger.info(`[PATH]: Inside Cart Controller`);
            const result = yield cart_1.cartApi.get();
            if (result instanceof errorApi_1.ApiError)
                next(result);
            else
                res.status(200).send(result);
        });
    }
    addToCart(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { product_id, quantity } = req.body;
            const { user_id } = req.user;
            logger_1.logger.info(`[PATH]: Inside Cart Controller`);
            if ((0, mongoose_1.isValidObjectId)(product_id)) {
                if (quantity) {
                    const firstResult = yield products_1.productsApi.getProduct(product_id);
                    if (firstResult instanceof errorApi_1.ApiError)
                        next(firstResult);
                    else {
                        const result = yield cart_1.cartApi.addProduct(user_id, product_id, quantity);
                        if (result instanceof errorApi_1.ApiError)
                            next(result);
                        else
                            res.status(201).send(result);
                    }
                }
                else
                    next(errorApi_1.ApiError.badRequest(`Product quantity needs to be specified.`));
            }
            else
                next(errorApi_1.ApiError.badRequest(EErrors_1.EProductsErrors.IdIncorrect));
        });
    }
    deleteFromCart(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { product_id, quantity } = req.body;
            const { user_id } = req.user;
            logger_1.logger.info(`[PATH]: Inside Cart Controller`);
            if ((0, mongoose_1.isValidObjectId)(product_id) && (0, mongoose_1.isValidObjectId)(user_id)) {
                if (Number(quantity)) {
                    const firstResult = yield products_1.productsApi.getProduct(product_id);
                    if (firstResult instanceof errorApi_1.ApiError) {
                        next(firstResult);
                    }
                    else {
                        const result = yield cart_1.cartApi.deleteProduct(user_id, product_id, Number(quantity));
                        if (result instanceof errorApi_1.ApiError)
                            next(result);
                        else
                            res.status(201).send(result);
                    }
                }
                else
                    next(errorApi_1.ApiError.badRequest(`Product quantity needs to be specified.`));
            }
            else
                next(errorApi_1.ApiError.badRequest(EErrors_1.EProductsErrors.IdIncorrect));
        });
    }
}
exports.cart_controller = new CartController();
