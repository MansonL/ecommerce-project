import { Request, NextFunction, Response } from 'express';
import { ApiError } from '../api/errorApi';
import { EProductsErrors } from '../common/EErrors';
import { productsApi } from '../api/products';
import { validator } from '../common/interfaces/joiSchemas';
import { Utils } from '../common/utils';
import { IMongoProduct, INew_Product, IQuery, isProduct, IUpdate } from '../common/interfaces/products';
import { CUDResponse } from '../common/interfaces/others';
import { logger } from '../services/logger';
import { ObjectId } from 'mongodb';

/**
 *
 * Product Controller Class
 *
 */

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
        if (ObjectId.isValid(product_id)) 
            next(ApiError.badRequest(EProductsErrors.IdIncorrect));
         else {
            const result: IMongoProduct[] | ApiError = await productsApi.getProduct(
                product_id
            );
            if(result instanceof ApiError)
                next(result)
            else
                res.status(200).send(result)
        }
    }

    async save(req: Request, res: Response, next: NextFunction): Promise<void> {
        const product: INew_Product = req.body;
        logger.info(`[PATH]: Inside Products Controller.`)
        const { error } = await validator.newProduct.validateAsync(product);
        if (error) {
            next(ApiError.badRequest(EProductsErrors.PropertiesIncorrect));
        } else {
            const result: CUDResponse | ApiError = await productsApi.addProduct(product);
            if(result instanceof ApiError)
                next(result)
            else
                res.status(201).send(result)
        }
    }
    async update(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        const product_id: string = req.params.id;
        const newProperties: IUpdate = req.body;
        const propsValidation = await validator.update.validateAsync(newProperties);
        logger.info(`[PATH]: Inside Products Controller.`)
        if (ObjectId.isValid(product_id)){
            next(ApiError.badRequest(EProductsErrors.IdIncorrect));
        }else if(propsValidation.error){
            next(ApiError.badRequest(EProductsErrors.PropertiesIncorrect));
        }else{
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
    }

    async delete(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        const product_id = req.params.id;
        logger.info(`[PATH]: Inside Products Controller.`)
        if (ObjectId.isValid(product_id)){
            next(ApiError.badRequest(EProductsErrors.IdIncorrect));
        }else{
            const firstResult: IMongoProduct[] | ApiError = await productsApi.getProduct(product_id);
            if(firstResult instanceof ApiError)
                next(firstResult)
            else{
                const result : CUDResponse | ApiError = await productsApi.deleteProduct(product_id);
                if(result instanceof ApiError){
                    next(result)
                }else{
                    res.status(201).send(result)    
                }
            }   
        }
        
    }

    async query(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        let { title, code, minPrice, maxPrice, minStock, maxStock } = {
            title: req.query.title as string,
            code: req.query.code as string,
            minPrice: req.query.minPrice as string,
            maxPrice: req.query.maxPrice as string,
            minStock: req.query.minStock as string,
            maxStock: req.query.maxStock as string,
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
                price: {
                    minPrice: Number(minPrice),
                    maxPrice: Number(maxPrice),
                },
                stock: {
                    minStock: Number(minStock),
                    maxStock: Number(maxStock),
                },
            };
            const { error } = await validator.query.validateAsync(options);
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
