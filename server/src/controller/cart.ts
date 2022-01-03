import { NextFunction, Request, Response } from 'express';
import { cartApi } from '../api/cart';
import { productsApi } from '../api/products';
import { EProductsErrors } from '../common/EErrors';
import { ApiError } from '../api/errorApi';
import { validator } from '../utils/joiSchemas';
import { IMongoCart, IMongoProduct, isCartProduct, isProduct } from '../common/interfaces/products';
import { CUDResponse, InternalError, isCUDResponse } from '../common/interfaces/others';

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
        const id: string | undefined = req.params.id;
        console.log(`[PATH] Inside controller.`);
        const { error } = await validator.id.validateAsync(id);
        if (error) {
            next(ApiError.badRequest(EProductsErrors.IdIncorrect));
        } else {
            const result: IMongoCart[] | InternalError | ApiError = await cartApi.get(
                id
            );
            
        }
    }
    async getCart(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        const result: IMongoCart[] | ApiError | InternalError = await cartApi.get();
        console.log(`[PATH] Inside controller.`);
        if (isCartProduct(result)) {
            res.status(200).send(result);
        }else if(result instanceof ApiError){
            res.status(result.error).send(result)
        }else{
            res.status(500).send(result)  // Internal Error sent.
        }
    }

    async addToCart(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        const productID : string = req.params.id;
        const userID : string = req.body
        console.log(`[PATH] Inside controller.`);
        const { error } = await validator.id.validate(productID);
        if (error) {
            next(ApiError.badRequest(EProductsErrors.IdIncorrect));
        } else {
            const firstResult: IMongoProduct[] | ApiError | InternalError = await productsApi.getProduct(
                productID
            );
            if (isProduct(firstResult)) {
                /**
                 * Cause the data was previously checked to be MongoProducts
                 */
                const result : CUDResponse | InternalError = await cartApi.addProduct(
                    userID, productID
                );
                if(isCUDResponse(result)){
                    res.status(201).send(result);
                }else{
                    res.status(500).send(result) // Internal Error sent, generated at the product saving to cart.
                }
            } else if(firstResult instanceof ApiError){
                res.status(firstResult.error).send(firstResult)
            }else{
                res.status(500).send(firstResult) // Internal Error sent, generated at the searched of the required product to be added to the cart
            }
        }
    }

    async deleteFromCart(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        const id: string = req.params.id;
        console.log(`[PATH] Inside controller.`);
        const { error } = await validator.id.validate(id);
        if (error) {
            next(ApiError.badRequest(EProductsErrors.IdIncorrect));
        } else {
            const firstResult: IMongoCart[] | ApiError | InternalError =
                await cartApi.getProduct(id);
            if(isProduct(firstResult)){
                const result: CUDResponse | InternalError = await cartApi.deleteProduct(id);
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
