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
    async getProduct(
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
                res.status(result.error).send(result);
            else
                res.status(200).send(result)
        }
    }
    async getCart(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        logger.info(`[PATH]: Inside Cart Controller`)
        const result: IMongoCart[] | ApiError  = await cartApi.get();
        if(result instanceof ApiError)
            res.status(result.error).send(result);
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
                /**
                 * Cause the data was previously checked to be MongoProducts
                 */
                const result : CUDResponse | ApiError = await cartApi.addProduct(
                    userID, productID
                );
                if(isCUDResponse(result)){
                    res.status(201).send(result);
                }else{
                    res.status(result.error).send(result) // Internal Error sent, generated at the product saving to cart.
                }
            } else if(firstResult instanceof ApiError){
                res.status(firstResult.error).send(firstResult)
            }
        }
    }

    async deleteFromCart(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        const id: string = req.params.id;
        logger.info(`[PATH]: Inside Cart Controller`)
        const { error } = await validator.id.validate(id);
        if (error) {
            next(ApiError.badRequest(EProductsErrors.IdIncorrect));
        } else {
            const firstResult: IMongoCart[] | ApiError  =
                await cartApi.getProduct(id);
            if(isProduct(firstResult)){
                const result: CUDResponse | ApiError = await cartApi.deleteProduct(id);
                if(isCUDResponse(result)){
                    res.status(201).send(result)
                }else{
                    res.status(500).send(result)     // Internal Error sent, generated at the product deleting from cart.
                }
            }else if(firstResult instanceof ApiError){
                res.status(firstResult.error).send(firstResult);
            }else{
                res.status(500).send(firstResult)  // Internal Error sent, generated at the searched of the required product to be deleted from the cart
            }
        }
    }
}

export const cart_controller = new CartController();
