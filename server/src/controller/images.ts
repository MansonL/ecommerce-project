import { NextFunction, Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import { ApiError } from "../api/errorApi";
import { productsApi } from "../api/products";
import { EProductsErrors } from "../common/EErrors";
import { CUDResponse } from "../common/interfaces/others";
import { Utils } from "../common/utils";

class ImagesController {

    async save(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { product_id, category } = req.product_data ? req.product_data : req.body;
        if(req.files){
            const images = req.files.photos;
            const imagesValidation = await Utils.validateAndUploadImages(
                Array.isArray(images) ? images.map(image => {
                    return {
                        file: image.tempFilePath,
                        name: image.name,
                        mimetype: image.mimetype
                    }
                }) :
                [{
                    file: images.tempFilePath,
                    name: images.name,
                    mimetype: images.mimetype
                }], 
                category
            );
            if(imagesValidation instanceof ApiError)
                next(imagesValidation)
            else{
                const result : ApiError | CUDResponse = await productsApi.updateProduct(product_id, {
                    images: imagesValidation
                });
                if(result instanceof ApiError)
                    next(result)
                else
                    res.status(201).send(result)
            }
        }else
            next(ApiError.badRequest(EProductsErrors.NoImagesUploaded))
    }

    async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { photos_ids, product_id } = req.body;
        if(Array.isArray(photos_ids) && photos_ids.length > 0){
            if(isValidObjectId(product_id)){
                photos_ids.forEach(ids => {
                    if(!isValidObjectId(ids)) next(ApiError.badRequest(EProductsErrors.IdIncorrect))
                });
                const result : ApiError | CUDResponse = await productsApi.deleteImages(photos_ids, product_id);
                if(result instanceof ApiError)
                    next(result)
                else 
                    res.status(201).send(result)
            }else
                next(ApiError.badRequest(EProductsErrors.IdIncorrect));
        }else
            next(ApiError.badRequest(`No photo ids received.`))
    }
}

export const images_controller = new ImagesController();