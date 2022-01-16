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
exports.images_controller = void 0;
const mongoose_1 = require("mongoose");
const errorApi_1 = require("../api/errorApi");
const products_1 = require("../api/products");
const EErrors_1 = require("../common/EErrors");
const utils_1 = require("../common/utils");
class ImagesController {
    save(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { product_id, category } = req.product_data ? req.product_data : req.body;
            if (req.files) {
                const images = req.files.photos;
                const imagesValidation = yield utils_1.Utils.validateAndUploadImages(Array.isArray(images) ? images.map(image => {
                    return {
                        file: image.tempFilePath,
                        name: image.name.split('.')[0],
                        mimetype: image.mimetype
                    };
                }) :
                    [{
                            file: images.tempFilePath,
                            name: images.name.split('.')[0],
                            mimetype: images.mimetype
                        }], category);
                if (imagesValidation instanceof errorApi_1.ApiError)
                    next(imagesValidation);
                else {
                    const result = yield products_1.productsApi.updateProduct(product_id, {
                        images: imagesValidation
                    });
                    if (result instanceof errorApi_1.ApiError)
                        next(result);
                    else
                        res.status(201).send(result);
                }
            }
            else
                next(errorApi_1.ApiError.badRequest(EErrors_1.EProductsErrors.NoImagesUploaded));
        });
    }
    delete(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { photos_ids, product_id } = req.body;
            if (Array.isArray(photos_ids) && photos_ids.length > 0) {
                if ((0, mongoose_1.isValidObjectId)(product_id)) {
                    photos_ids.forEach(ids => {
                        if (typeof ids !== 'string')
                            next(errorApi_1.ApiError.badRequest(EErrors_1.EProductsErrors.IdIncorrect));
                    });
                    const result = yield products_1.productsApi.deleteImages(photos_ids, product_id);
                    if (result instanceof errorApi_1.ApiError)
                        next(result);
                    else {
                        const cloudDeletionResult = yield utils_1.Utils.deleteImagesFromCloud(photos_ids);
                        if (cloudDeletionResult instanceof errorApi_1.ApiError)
                            next(cloudDeletionResult);
                        else
                            res.status(201).send(result);
                    }
                }
                else
                    next(errorApi_1.ApiError.badRequest(EErrors_1.EProductsErrors.IdIncorrect));
            }
            else
                next(errorApi_1.ApiError.badRequest(`No photo ids received.`));
        });
    }
}
exports.images_controller = new ImagesController();
