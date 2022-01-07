import { Request, NextFunction, Response } from 'express';
import { ApiError } from '../api/errorApi';
import { EProductsErrors } from '../common/EErrors';
import { productsApi } from '../api/products';
import { validator } from '../common/interfaces/joiSchemas';
import { Utils } from '../common/utils';
import { IMongoProduct, INew_Product, IQuery, IUpdate } from '../common/interfaces/products';
import { CUDResponse } from '../common/interfaces/others';
import { logger } from '../services/logger';
import { isValidObjectId } from 'mongoose';

/**
 *
 * Product Controller Class
 *
 */

 declare global {
    namespace Express {
        interface Request {
            product_data: {
                product_id: string;
                category: string; // For storing the images in the category folder at cloudinary.
            };
        }
    }
}


class ProductController {
    async getAll(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        logger.info(`[PATH]: Inside Products Controller.`)
        const result: IMongoProduct[] | ApiError = await productsApi.getProduct();
        if(result instanceof ApiError)
            next(result)
        else
            res.status(200).send(result)
    }
    async getOne(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        const product_id: string = req.params.id;
        logger.info(`[PATH]: Inside Products Controller.`)
        if (isValidObjectId(product_id)){
            const result: IMongoProduct[] | ApiError = await productsApi.getProduct(
            product_id
            );
            if(result instanceof ApiError)
                next(result)
            else
                res.status(200).send(result[0])
        }else {
            next(ApiError.badRequest(EProductsErrors.IdIncorrect));
        }
    }

    async getByCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
        const category = req.params.category;
        if(category){
            const result : IMongoProduct[] | ApiError = await productsApi.getByCategory(category);
            if(result instanceof ApiError)
                next(result);
            else
                res.status(200).send(result)
        }else 
            next(ApiError.badRequest(`Category name needed.`))
    }

    async save(req: Request, res: Response, next: NextFunction): Promise<void> {
        const product: INew_Product = req.body;
        logger.info(`[PATH]: Inside Products Controller.`)
        const { error } = await validator.newProduct.validate(product);
        if (error)
            next(ApiError.badRequest(error.message));
         else {
            const result : ApiError | CUDResponse = await productsApi.addProduct(product);
            if(result instanceof ApiError)
                next(result)
            else{
                const product = result.data as IMongoProduct;
                req.product_data = {
                    product_id: product._id,
                    category: product.category
                }
                next() // To image upload controller function to upload the images to cloudinary and
                       // finish the product addition.
            }
        }
    }
    async update(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        const product_id: string = req.params.id;
        const newProperties: IUpdate = req.body;
        const { error } = validator.update.validate(newProperties);
        logger.info(`[PATH]: Inside Products Controller.`)
        if (isValidObjectId(product_id)){
            if(error)
                next(ApiError.badRequest(error.message))
            else{
                const firstResult: IMongoProduct[] | ApiError = await productsApi.getProduct(product_id);
                if(firstResult instanceof ApiError)
                    next(firstResult)
                else{
                    const result : CUDResponse | ApiError = await productsApi.updateProduct(product_id, newProperties);
                    if(result instanceof ApiError)
                        next(result)
                    else
                        res.status(201).send(result)
                }
            }
        }else
            next(ApiError.badRequest(EProductsErrors.IdIncorrect))
    }

    async delete(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        const product_id = req.params.id;
        logger.info(`[PATH]: Inside Products Controller.`)
        if (isValidObjectId(product_id)){
            const firstResult: IMongoProduct[] | ApiError = await productsApi.getProduct(product_id);
            if(firstResult instanceof ApiError)
                next(firstResult)
            else{
                const result : CUDResponse | ApiError = await productsApi.deleteProduct(product_id);
                if(result instanceof ApiError)
                    next(result)
                else
                    res.status(201).send(result)    
                
            }  
            
        }else
            next(ApiError.badRequest(EProductsErrors.IdIncorrect));
        
    }

    async query(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        let { title, code, minPrice, maxPrice, minStock, maxStock, category } = {
            title: req.query.title as string,
            code: req.query.code as string,
            minPrice: req.query.minPrice as string,
            maxPrice: req.query.maxPrice as string,
            minStock: req.query.minStock as string,
            maxStock: req.query.maxStock as string,
            category: req.query.category as string,
        };
        const firstResult: IMongoProduct[] | ApiError = await productsApi.getProduct();
        if(firstResult instanceof ApiError)
                next(firstResult)
        else{
            /**
             * First result already checked to have the corresponding properties of a stored Product
             */
             const maxDBPrice = (
                await Utils.getMaxStockPrice(firstResult as IMongoProduct[], 'price')
            )
            const maxDBStock = (
                await Utils.getMaxStockPrice(firstResult as IMongoProduct[], 'stock')
            )

            title = title != null ? title : '';
            code = code != null ? code : '';
            category = category !== null ? category : '';
            minPrice = minPrice != null ? minPrice : '0.01';
            maxPrice =
                maxPrice != null
                    ? maxPrice
                    :  +minPrice > maxDBPrice ? minPrice : maxDBPrice.toString();
            minStock = minStock != null ? minStock : '0';
            maxStock =
                maxStock != null
                    ? maxStock
                    :  +minStock > maxDBStock ? minStock : maxDBStock.toString();
            const options: IQuery = {
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
            const { error } = await validator.query.validate(options);
            if (error) {
                next(ApiError.badRequest(error.message));
            } else {
                const result: IMongoProduct[] | ApiError = await productsApi.query(
                    options
                );
                if(result instanceof ApiError)
                    next(result)
                else
                    res.status(200).send(result)
            }
        }
        
    }
}

export const products_controller = new ProductController();
