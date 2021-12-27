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
exports.MongoProducts = void 0;
const models_1 = require("./models");
const mockProducts_1 = require("../../mockProducts");
const moment_1 = __importDefault(require("moment"));
const utils_1 = require("../../../common/utils");
const errorApi_1 = require("../../../utils/errorApi");
const EErrors_1 = require("../../../common/EErrors");
class MongoProducts {
    constructor(type) {
        this.products = models_1.models.products;
        this.init();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.products.deleteMany({});
            yield this.products.insertMany(mockProducts_1.mockProducts);
            console.log(`Mock data inserted `);
        });
    }
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (id != null) {
                    const docs = yield this.products.find({ _id: id });
                    if (docs.length > 0) {
                        const product = utils_1.Utils.extractMongoProducts(docs);
                        return product;
                    }
                    return errorApi_1.ApiError.notFound(EErrors_1.EProductsErrors.ProductNotFound);
                }
                else {
                    const docs = yield this.products.find({});
                    if (docs.length > 0) {
                        const products = utils_1.Utils.extractMongoProducts(docs);
                        return products;
                    }
                    return errorApi_1.ApiError.notFound(EErrors_1.EProductsErrors.NoProducts);
                }
            }
            catch (error) {
                return {
                    error: error,
                    message: "An error occured"
                };
            }
        });
    }
    add(product) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const doc = yield this.products.create(product);
                const result = utils_1.Utils.extractMongoProducts([doc])[0];
                return {
                    message: `Product successfully saved.`,
                    data: result,
                };
            }
            catch (error) {
                return {
                    error: error,
                    message: "An error occured"
                };
            }
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const doc = yield this.products.find({ _id: id });
                const product = utils_1.Utils.extractMongoProducts(doc)[0];
                const newProduct = Object.assign(Object.assign({}, product), data);
                newProduct.timestamp = (0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss');
                console.log(newProduct);
                yield this.products.replaceOne({ _id: id }, newProduct);
                return {
                    message: `Product successfully updated.`,
                    data: newProduct,
                };
            }
            catch (error) {
                return {
                    error: error,
                    message: "An error occured"
                };
            }
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deletedDoc = yield this.products.find({ _id: id });
                const deletedProduct = utils_1.Utils.extractMongoProducts(deletedDoc)[0];
                yield this.products.deleteOne({ _id: id });
                return {
                    message: `Product successfully deleted`,
                    data: deletedProduct,
                };
            }
            catch (error) {
                return {
                    error: error,
                    message: "An error occured"
                };
            }
        });
    }
    query(options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const titleRegex = options.title === ''
                    ? new RegExp(`.*`)
                    : new RegExp(`(${options.title})`);
                const codeRegex = options.code === ''
                    ? new RegExp(`.*`)
                    : new RegExp(`(${options.code})`);
                const doc = yield this.products.find({
                    title: { $regex: titleRegex },
                    code: { $regex: codeRegex },
                    price: {
                        $gte: options.price.minPrice,
                        $lte: options.price.maxPrice,
                    },
                    stock: {
                        $gte: options.stock.minStock,
                        $lte: options.stock.maxStock,
                    },
                });
                if (doc.length > 0) {
                    const products = utils_1.Utils.extractMongoProducts(doc);
                    return products;
                }
                else {
                    return errorApi_1.ApiError.notFound(`No products matching the query`);
                }
            }
            catch (error) {
                return {
                    error: error,
                    message: "An error occured"
                };
            }
        });
    }
}
exports.MongoProducts = MongoProducts;
