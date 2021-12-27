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
const errorApi_1 = require("../utils/errorApi");
const EErrors_1 = require("../common/EErrors");
const products_1 = require("../api/products");
const joiSchemas_1 = require("../utils/joiSchemas");
const utils_1 = require("../common/utils");
const checkType_1 = require("../interfaces/checkType");
/**
 *
 * Product Controller Class
 *
 */
class ProductController {
    getAll(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield products_1.productsApi.getProduct();
            console.log(`[PATH] Inside controller.`);
            if ((0, checkType_1.isProduct)(result)) {
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
    getOne(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            console.log(`[PATH] Inside controller.`);
            const { error } = yield joiSchemas_1.validator.id.validateAsync(id);
            if (error) {
                next(errorApi_1.ApiError.badRequest(EErrors_1.EProductsErrors.IdIncorrect));
            }
            else {
                const result = yield products_1.productsApi.getProduct(id);
                if ((0, checkType_1.isProduct)(result)) {
                    res.status(200).send(result);
                }
                else if (result instanceof errorApi_1.ApiError) {
                    res.status(result.error).send(error);
                }
                else {
                    res.status(500).send(result); // Internal Error sent.
                }
            }
        });
    }
    getTest(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const qty = req.params.qty;
            if (qty != null) {
                const quantity = Number(qty);
                const randomProducts = utils_1.Utils.generateRandomProducts(quantity);
                res.status(200).send(randomProducts);
            }
            else {
                const randomProducts = utils_1.Utils.generateRandomProducts(10);
                res.status(200).send(randomProducts);
            }
        });
    }
    save(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = req.body;
            console.log(`[PATH] Inside controller.`);
            const { error } = yield joiSchemas_1.validator.newProduct.validateAsync(product);
            if (error) {
                next(errorApi_1.ApiError.badRequest(EErrors_1.EProductsErrors.PropertiesIncorrect));
            }
            else {
                const result = yield products_1.productsApi.addProduct(product);
                if ((0, checkType_1.isCUDResponse)(result)) {
                    res.status(201).send(result);
                }
                else {
                    res.status(500).send(result); // Internal Error sent.
                }
            }
        });
    }
    update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const newProperties = req.body;
            const resultID = joiSchemas_1.validator.id.validate(id);
            const resultProps = joiSchemas_1.validator.update.validate(newProperties);
            console.log(`[PATH] Inside controller.`);
            if (resultID.error) {
                next(errorApi_1.ApiError.badRequest(EErrors_1.EProductsErrors.IdIncorrect));
            }
            else if (resultProps.error) {
                next(errorApi_1.ApiError.badRequest(EErrors_1.EProductsErrors.PropertiesIncorrect));
            }
            else {
                const firstResult = yield products_1.productsApi.getProduct(id);
                if ((0, checkType_1.isProduct)(firstResult)) {
                    const result = yield products_1.productsApi.updateProduct(id, newProperties);
                    if ((0, checkType_1.isCUDResponse)(result)) {
                        res.status(201).send(result);
                    }
                    else {
                        res.status(500).send(result); // Internal Error sent, generated at the attempt to update the required product.
                    }
                }
                else if (firstResult instanceof errorApi_1.ApiError) {
                    res.status(firstResult.error).send(firstResult);
                }
                else {
                    res.status(500).send(firstResult); // Internal Error sent, generated at the search of the required product to be updated.
                }
            }
        });
    }
    delete(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            console.log(`[PATH] Inside controller.`);
            const { error } = yield joiSchemas_1.validator.id.validateAsync(id);
            if (error) {
                next(errorApi_1.ApiError.badRequest(EErrors_1.EProductsErrors.IdIncorrect));
            }
            else {
                const firstResult = yield products_1.productsApi.getProduct(id);
                if ((0, checkType_1.isProduct)(firstResult)) {
                    const result = yield products_1.productsApi.deleteProduct(id);
                    if ((0, checkType_1.isCUDResponse)(result)) {
                        res.status(201).send(result);
                    }
                    else {
                        res.status(500).send(result); // Internal Error sent, generated at the attempt to delete the required product.
                    }
                }
                else if (firstResult instanceof errorApi_1.ApiError) {
                    res.status(firstResult.error).send(firstResult);
                }
                else {
                    res.status(500).send(firstResult); // Internal Error sent, generated at the search of the required product to be deleted.
                }
            }
        });
    }
    query(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let { title, code, minPrice, maxPrice, minStock, maxStock } = {
                title: req.query.title,
                code: req.query.code,
                minPrice: req.query.minPrice,
                maxPrice: req.query.maxPrice,
                minStock: req.query.minStock,
                maxStock: req.query.maxStock,
            };
            const firstResult = yield products_1.productsApi.getProduct();
            if ((0, checkType_1.isProduct)(firstResult)) {
                /**
                 * First result already checked to have the corresponding properties of a stored Product
                 */
                const maxDBPrice = (yield utils_1.Utils.getMaxStockPrice(firstResult, 'price'));
                const maxDBStock = (yield utils_1.Utils.getMaxStockPrice(firstResult, 'stock'));
                title = title != null ? title : '';
                code = code != null ? code : '';
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
                    price: {
                        minPrice: Number(minPrice),
                        maxPrice: Number(maxPrice),
                    },
                    stock: {
                        minStock: Number(minStock),
                        maxStock: Number(maxStock),
                    },
                };
                const { error } = joiSchemas_1.validator.query.validate(options);
                if (error) {
                    next(errorApi_1.ApiError.badRequest(error.message));
                }
                else {
                    console.log(options);
                    const result = yield products_1.productsApi.query(options);
                    if ((0, checkType_1.isProduct)(result)) {
                        res.status(200).send(result);
                    }
                    else if (result instanceof errorApi_1.ApiError) {
                        res.status(result.error).send(result);
                    }
                    else {
                        res.status(500).send(result); // Internal Error sent, generated at the attempt to get a products params.
                    }
                }
            }
            else if (firstResult instanceof errorApi_1.ApiError) {
                res.status(firstResult.error).send(firstResult);
            }
            else {
                res.status(500).send(firstResult); // Internal Error sent, genereated at the attempt to get products (just for checking if there is at least one product to request a query).
            }
        });
    }
}
exports.products_controller = new ProductController();
