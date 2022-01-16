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
exports.products_controller = void 0;
const errorApi_1 = require("../api/errorApi");
const EErrors_1 = require("../common/EErrors");
const products_1 = require("../api/products");
const joiSchemas_1 = require("../common/interfaces/joiSchemas");
const utils_1 = require("../common/utils");
const logger_1 = require("../services/logger");
const mongoose_1 = require("mongoose");
class ProductController {
    getAll(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.logger.info(`[PATH]: Inside Products Controller.`);
            const test = yield products_1.productsApi.getStock();
            logger_1.logger.info(JSON.stringify(test, null, '\t'));
            const result = yield products_1.productsApi.getProduct();
            if (result instanceof errorApi_1.ApiError)
                next(result);
            else
                res.status(200).send(result);
        });
    }
    getOne(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const product_id = req.params.id;
            logger_1.logger.info(`[PATH]: Inside Products Controller.`);
            if ((0, mongoose_1.isValidObjectId)(product_id)) {
                const result = yield products_1.productsApi.getProduct(product_id);
                if (result instanceof errorApi_1.ApiError)
                    next(result);
                else
                    res.status(200).send(result[0]);
            }
            else {
                next(errorApi_1.ApiError.badRequest(EErrors_1.EProductsErrors.IdIncorrect));
            }
        });
    }
    getByCategory(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = req.params.category;
            if (category) {
                const result = yield products_1.productsApi.getByCategory(category);
                if (result instanceof errorApi_1.ApiError)
                    next(result);
                else
                    res.status(200).send(result);
            }
            else
                next(errorApi_1.ApiError.badRequest(`Category name needed.`));
        });
    }
    save(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = req.body;
            logger_1.logger.info(`[PATH]: Inside Products Controller.`);
            const { error } = yield joiSchemas_1.validator.newProduct.validate(product);
            if (error)
                next(errorApi_1.ApiError.badRequest(error.message));
            else {
                const result = yield products_1.productsApi.addProduct(product);
                if (result instanceof errorApi_1.ApiError)
                    next(result);
                else {
                    const product = result.data;
                    req.product_data = {
                        product_id: product._id,
                        category: product.category
                    };
                    next(); // To image upload controller function to upload the images to cloudinary and
                    // finish the product addition.
                }
            }
        });
    }
    update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const product_id = req.params.id;
            const newProperties = req.body;
            const { error } = joiSchemas_1.validator.update.validate(newProperties);
            logger_1.logger.info(`[PATH]: Inside Products Controller.`);
            if ((0, mongoose_1.isValidObjectId)(product_id)) {
                if (error)
                    next(errorApi_1.ApiError.badRequest(error.message));
                else {
                    const firstResult = yield products_1.productsApi.getProduct(product_id);
                    if (firstResult instanceof errorApi_1.ApiError)
                        next(firstResult);
                    else {
                        const result = yield products_1.productsApi.updateProduct(product_id, newProperties);
                        if (result instanceof errorApi_1.ApiError)
                            next(result);
                        else
                            res.status(201).send(result);
                    }
                }
            }
            else
                next(errorApi_1.ApiError.badRequest(EErrors_1.EProductsErrors.IdIncorrect));
        });
    }
    delete(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const product_id = req.params.id;
            logger_1.logger.info(`[PATH]: Inside Products Controller.`);
            if ((0, mongoose_1.isValidObjectId)(product_id)) {
                const firstResult = yield products_1.productsApi.getProduct(product_id);
                if (firstResult instanceof errorApi_1.ApiError)
                    next(firstResult);
                else {
                    const result = yield products_1.productsApi.deleteProduct(product_id);
                    if (result instanceof errorApi_1.ApiError)
                        next(result);
                    else
                        res.status(201).send(result);
                }
            }
            else
                next(errorApi_1.ApiError.badRequest(EErrors_1.EProductsErrors.IdIncorrect));
        });
    }
    query(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let { title, code, minPrice, maxPrice, minStock, maxStock, category } = {
                title: req.query.title,
                code: req.query.code,
                minPrice: req.query.minPrice,
                maxPrice: req.query.maxPrice,
                minStock: req.query.minStock,
                maxStock: req.query.maxStock,
                category: req.query.category,
            };
            const firstResult = yield products_1.productsApi.getProduct();
            if (firstResult instanceof errorApi_1.ApiError)
                next(firstResult);
            else {
                /**
                 * First result already checked to have the corresponding properties of a stored Product
                 */
                const maxDBPrice = (yield utils_1.Utils.getMaxStockPrice(firstResult, 'price'));
                const maxDBStock = (yield utils_1.Utils.getMaxStockPrice(firstResult, 'stock'));
                title = title != null ? title : '';
                code = code != null ? code : '';
                category = category !== null ? category : '';
                minPrice = minPrice != null ? minPrice : '0.01';
                maxPrice =
                    maxPrice != null
                        ? maxPrice
                        : +minPrice > maxDBPrice ? minPrice : maxDBPrice.toString();
                minStock = minStock != null ? minStock : '0';
                maxStock =
                    maxStock != null
                        ? maxStock
                        : +minStock > maxDBStock ? minStock : maxDBStock.toString();
                const options = {
                    title: title,
                    code: code,
                    category: category,
                    price: {
                        minPrice: Number(minPrice),
                        maxPrice: Number(maxPrice),
                    },
                    stock: {
                        minStock: Number(minStock),
                        maxStock: Number(maxStock),
                    },
                };
                const { error } = yield joiSchemas_1.validator.query.validate(options);
                if (error) {
                    next(errorApi_1.ApiError.badRequest(error.message));
                }
                else {
                    const result = yield products_1.productsApi.query(options);
                    if (result instanceof errorApi_1.ApiError)
                        next(result);
                    else
                        res.status(200).send(result);
                }
            }
        });
    }
}
exports.products_controller = new ProductController();
