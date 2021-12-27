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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cart_controller = void 0;
const cart_1 = require("../api/cart");
const products_1 = require("../api/products");
const EErrors_1 = require("../common/EErrors");
const checkType_1 = require("../interfaces/checkType");
const errorApi_1 = require("../utils/errorApi");
const joiSchemas_1 = require("../utils/joiSchemas");
/**
 *
 * Cart Controller Class
 *
 */
class CartController {
    getProduct(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            console.log(`[PATH] Inside controller.`);
            const { error } = yield joiSchemas_1.validator.id.validateAsync(id);
            if (error) {
                next(errorApi_1.ApiError.badRequest(EErrors_1.EProductsErrors.IdIncorrect));
            }
            else {
                const result = yield cart_1.cartApi.getProduct(id);
            }
        });
    }
    getCart(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield cart_1.cartApi.getProduct();
            console.log(`[PATH] Inside controller.`);
            if ((0, checkType_1.isCartProduct)(result)) {
                res.status(200).send(result);
            }
            else if (result instanceof errorApi_1.ApiError) {
                res.status(result.error).send(result);
            }
            else {
                res.status(500).send(result); // Internal Error sent.
            }
        });
    }
    addToCart(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const productID = req.params.id;
            console.log(`[PATH] Inside controller.`);
            const { error } = yield joiSchemas_1.validator.id.validate(productID);
            if (error) {
                next(errorApi_1.ApiError.badRequest(EErrors_1.EProductsErrors.IdIncorrect));
            }
            else {
                const firstResult = yield products_1.productsApi.getProduct(productID);
                if ((0, checkType_1.isProduct)(firstResult)) {
                    /**
                     * Cause the data was previously checked to be MongoProducts
                     */
                    const products = firstResult;
                    const _a = products[0], { _id } = _a, product = __rest(_a, ["_id"]);
                    const result = yield cart_1.cartApi.addProduct(_id.toString(), product);
                    if ((0, checkType_1.isCUDResponse)(result)) {
                        res.status(201).send(result);
                    }
                    else {
                        res.status(500).send(result); // Internal Error sent, generated at the product saving to cart.
                    }
                }
                else if (firstResult instanceof errorApi_1.ApiError) {
                    res.status(firstResult.error).send(firstResult);
                }
                else {
                    res.status(500).send(firstResult); // Internal Error sent, generated at the searched of the required product to be added to the cart
                }
            }
        });
    }
    deleteFromCart(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            console.log(`[PATH] Inside controller.`);
            const { error } = yield joiSchemas_1.validator.id.validate(id);
            if (error) {
                next(errorApi_1.ApiError.badRequest(EErrors_1.EProductsErrors.IdIncorrect));
            }
            else {
                const firstResult = yield cart_1.cartApi.getProduct(id);
                if ((0, checkType_1.isProduct)(firstResult)) {
                    const result = yield cart_1.cartApi.deleteProduct(id);
                    if ((0, checkType_1.isCUDResponse)(result)) {
                        res.status(201).send(result);
                    }
                    else {
                        res.status(500).send(result); // Internal Error sent, generated at the product deleting from cart.
                    }
                }
                else if (firstResult instanceof errorApi_1.ApiError) {
                    res.status(firstResult.error).send(firstResult);
                }
                else {
                    res.status(500).send(firstResult); // Internal Error sent, generated at the searched of the required product to be deleted from the cart
                }
            }
        });
    }
}
exports.cart_controller = new CartController();
