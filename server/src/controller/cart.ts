import { NextFunction, Request, Response } from 'express';
import { cartApi } from '../api/cart';
import { productsApi } from '../api/products';
import { EProductsErrors } from '../common/EErrors';
import { ApiError } from '../api/errorApi';
import { validator } from '../common/interfaces/joiSchemas';
import { IMongoCart, IMongoProduct, isCartProduct, isProduct } from '../common/interfaces/products';
import { CUDResponse, isCUDResponse } from '../common/interfaces/others';
import { logger } from '../services/logger';
import { ObjectId } from 'mongodb';

/**
 *
 * Cart Controller Class
 *
 */
class CartController {
    async getOneCart(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        const user_id: string | undefined = req.params.id;
        logger.info(`[PATH]: Inside Cart Controller`);
        if (!ObjectId.isValid(user_id))
            next(ApiError.badRequest(EProductsErrors.IdIncorrect));
        else {
            const result: IMongoCart[]  | ApiError = await cartApi.get(
                user_id
            );
            if(result instanceof ApiError)
                next(result);
            else
                res.status(200).send(result)
        }
    }
    async getCarts(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        logger.info(`[PATH]: Inside Cart Controller`)
        const result: IMongoCart[] | ApiError  = await cartApi.get();
        if(result instanceof ApiError)
            next(result);
        else
            res.status(200).send(result);
    }

    async addToCart(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        const productID : string = req.params.id;
        const userID : string = req.body
        logger.info(`[PATH]: Inside Cart Controller`)
        if (ObjectId.isValid(productID)) {
            next(ApiError.badRequest(EProductsErrors.IdIncorrect));
        } else {
            const firstResult: IMongoProduct[] | ApiError  = await productsApi.getProduct(
                productID
            );
            if (isProduct(firstResult)) {
                const result : CUDResponse | ApiError = await cartApi.addProduct(
                    userID, productID
                );
                if(result instanceof ApiError)
                    next(result)
                else
                    res.status(201).send(result)
            } else if(firstResult instanceof ApiError){
                next(firstResult)
            }
        }
    }

    async deleteFromCart(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        const product_id: string = req.params.id;
        const user_id : string = req.body;
        logger.info(`[PATH]: Inside Cart Controller`)
        if (!ObjectId.isValid(product_id) && ObjectId.isValid(user_id)) 
            next(ApiError.badRequest(EProductsErrors.IdIncorrect));
         else {
            const firstResult: IMongoProduct[] | ApiError  =
                await productsApi.getProduct(product_id);
            if(isProduct(firstResult)){
                const result: CUDResponse | ApiError = await cartApi.deleteProduct(user_id, product_id);
                if(result instanceof ApiError)
                    next(result)
                else
                    res.status(201).send(result)    
                
            }else if(firstResult instanceof ApiError)
                next(firstResult);
            
        }
    }
}

export const cart_controller = new CartController();
