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
const mongoose_1 = require("mongoose");
const moment_1 = __importDefault(require("moment"));
const errorApi_1 = require("../../../api/errorApi");
const EErrors_1 = require("../../../common/EErrors");
const logger_1 = require("../../../services/logger");
const config_1 = require("../../../config/config");
const cluster_1 = __importDefault(require("cluster"));
const mockProducts_1 = require("../../mockProducts");
const productSchema = new mongoose_1.Schema({
    createdAt: { type: String, required: true },
    modifiedAt: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    code: { type: String, required: true },
    images: [{
            photo_id: { type: String },
            url: { type: String },
            _id: false,
        }],
    stock: { type: Number, required: true },
    price: { type: Number, required: true },
});
productSchema.set('toJSON', {
    transform: (document, returnedDocument) => {
        delete returnedDocument.__v;
    }
});
const productModel = (0, mongoose_1.model)('products', productSchema);
class MongoProducts {
    constructor() {
        this.products = productModel;
        this.init();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            //console.log(mockProducts[0].img)
            if (config_1.Config.MODE === 'CLUSTER') {
                if (cluster_1.default.isMaster) {
                    yield this.products.deleteMany({});
                    yield this.products.insertMany(mockProducts_1.mockProducts);
                    logger_1.logger.info(`Mock data inserted.`);
                }
            }
            else {
                yield this.products.deleteMany({});
                yield this.products.insertMany(mockProducts_1.mockProducts);
                logger_1.logger.info(`Mock data inserted.`);
            }
        });
    }
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (id != null) {
                    const doc = yield this.products.findOne({ _id: id });
                    if (doc)
                        return [doc];
                    else
                        return errorApi_1.ApiError.notFound(EErrors_1.EProductsErrors.ProductNotFound);
                }
                else {
                    const docs = yield this.products.find({});
                    if (docs.length > 0)
                        return docs;
                    else
                        return errorApi_1.ApiError.notFound(EErrors_1.EProductsErrors.NoProducts);
                }
            }
            catch (error) {
                return errorApi_1.ApiError.internalError(`An error occured.`);
            }
        });
    }
    getByCategory(category) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const docs = yield this.products.find({ category: category });
                if (docs.length > 0)
                    return docs;
                return errorApi_1.ApiError.notFound(EErrors_1.EProductsErrors.NoProducts);
            }
            catch (error) {
                return errorApi_1.ApiError.internalError(`An error occured.`);
            }
        });
    }
    getStock() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const docs = yield this.products.find({}).select('title stock');
                if (docs.length > 0)
                    return docs;
                else
                    return errorApi_1.ApiError.notFound(EErrors_1.EProductsErrors.NoProducts);
            }
            catch (error) {
                return errorApi_1.ApiError.internalError(`An error occured.`);
            }
        });
    }
    add(product) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const doc = yield this.products.create(product);
                return {
                    message: `Product successfully saved.`,
                    data: doc,
                };
            }
            catch (error) {
                return errorApi_1.ApiError.internalError(`An error occured.`);
            }
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const doc = yield this.products.findOne({ _id: id }).lean();
                if (doc) {
                    const newProduct = Object.assign(Object.assign({}, doc), data);
                    newProduct.modifiedAt = (0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss');
                    yield this.products.replaceOne({ _id: id }, newProduct);
                    return {
                        message: `Product successfully updated.`,
                        data: Object.assign({ _id: id }, newProduct)
                    };
                }
                else {
                    return errorApi_1.ApiError.notFound(EErrors_1.EProductsErrors.ProductNotFound);
                }
            }
            catch (error) {
                return errorApi_1.ApiError.internalError(`An error occured.`);
            }
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deletedDoc = yield this.products.findOne({ _id: id });
                if (deletedDoc) {
                    yield this.products.deleteOne({ _id: id });
                    return {
                        message: `Product successfully deleted`,
                        data: deletedDoc,
                    };
                }
                else {
                    return errorApi_1.ApiError.notFound(EErrors_1.EProductsErrors.ProductNotFound);
                }
            }
            catch (error) {
                return errorApi_1.ApiError.internalError(`An error occured.`);
            }
        });
    }
    deleteImages(photos_ids, product_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const doc = yield this.products.findOne({ _id: product_id });
                if (doc) {
                    const newImages = doc.images.filter(image => !photos_ids.some(ids => image.photo_id === ids));
                    doc.images = newImages;
                    yield doc.save();
                    return {
                        message: `Images deleted successfully.`,
                        data: doc
                    };
                }
                else
                    return errorApi_1.ApiError.notFound(EErrors_1.EProductsErrors.ProductNotFound);
            }
            catch (error) {
                return errorApi_1.ApiError.internalError(`An error occured.`);
            }
        });
    }
    // Function implemented for retrieving the products selected to buy in an order.
    getByIds(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const docs = yield this.products.find({ _id: { $in: ids } });
                return docs.map(document => {
                    return {
                        _id: document.id,
                        stock: document.stock
                    };
                });
            }
            catch (error) {
                return errorApi_1.ApiError.internalError(`An error occured.`);
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
                const categoryRegex = options.category === '' ? new RegExp(`.*`) : new RegExp(`(${options.category})`);
                const docs = yield this.products.find({
                    title: { $regex: titleRegex },
                    code: { $regex: codeRegex },
                    category: { $regex: categoryRegex },
                    price: {
                        $gte: options.price.minPrice,
                        $lte: options.price.maxPrice,
                    },
                    stock: {
                        $gte: options.stock.minStock,
                        $lte: options.stock.maxStock,
                    },
                });
                if (docs.length > 0)
                    return docs;
                else
                    return errorApi_1.ApiError.notFound(`No products matching the query`);
            }
            catch (error) {
                return errorApi_1.ApiError.internalError(`An error occured.`);
            }
        });
    }
}
exports.MongoProducts = MongoProducts;
