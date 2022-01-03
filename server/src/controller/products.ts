import { Request, NextFunction, Response } from 'express';
import { ApiError } from '../api/errorApi';
import { EProductsErrors } from '../common/EErrors';
import { productsApi } from '../api/products';
import {
    CUDResponse,
    IMongoProduct,
    INew_Product,
    InternalError,
    IQuery,
    IUpdate,
} from '../common/interfaces/others';
import { validator } from '../utils/joiSchemas';
import { Utils } from '../common/utils';
import { isCUDResponse, isProduct } from '../common/interfaces/checkType';

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
        const result: IMongoProduct[] | ApiError | InternalError = await productsApi.getProduct();
        console.log(`[PATH] Inside controller.`);
        
        if(isProduct(result)){
            res.status(200).send(result)
        }else if(result instanceof ApiError){
            res.status(result.error).send(result)
        }else{
            res.status(500).send(result) // Internal Error sent.
        }
    }
    async getOne(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        const id: string = req.params.id;
        console.log(`[PATH] Inside controller.`);
        const { error } = await validator.id.validateAsync(id);
        if (error) {
            next(ApiError.badRequest(EProductsErrors.IdIncorrect));
        } else {
            const result: IMongoProduct[] | ApiError | InternalError = await productsApi.getProduct(
                id
            );
            if(isProduct(result)){
                res.status(200).send(result);
            }else if(result instanceof ApiError){
                res.status(result.error).send(error);
            }else{
                res.status(500).send(result)    // Internal Error sent.
            }
        }
    }
    async getTest(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        const qty = req.params.qty;
        if (qty != null) {
            const quantity = Number(qty);
            const randomProducts = Utils.generateRandomProducts(quantity);
            res.status(200).send(randomProducts);
        } else {
            const randomProducts = Utils.generateRandomProducts(10);
            res.status(200).send(randomProducts);
        }
    }
    async save(req: Request, res: Response, next: NextFunction): Promise<void> {
        const product: INew_Product = req.body;
        console.log(`[PATH] Inside controller.`);
        const { error } = await validator.newProduct.validateAsync(product);
        if (error) {
            next(ApiError.badRequest(EProductsErrors.PropertiesIncorrect));
        } else {
            const result: CUDResponse | InternalError = await productsApi.addProduct(product);
            if(isCUDResponse(result)){
                res.status(201).send(result)
            }else{
                res.status(500).send(result)    // Internal Error sent.
            }
        }
    }
    async update(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        const id: string = req.params.id;
        const newProperties: IUpdate = req.body;
        const resultID = validator.id.validate(id);
        const resultProps = validator.update.validate(newProperties);
        console.log(`[PATH] Inside controller.`);
        if (resultID.error){
            next(ApiError.badRequest(EProductsErrors.IdIncorrect));
        }else if(resultProps.error){
            next(ApiError.badRequest(EProductsErrors.PropertiesIncorrect));
        }else{
            const firstResult: IMongoProduct[] | ApiError | InternalError = await productsApi.getProduct(id);
            if(isProduct(firstResult)){
                const result : CUDResponse | InternalError = await productsApi.updateProduct(id, newProperties);
                if(isCUDResponse(result)){
                    res.status(201).send(result)
                }else{
                    res.status(500).send(result)  // Internal Error sent, generated at the attempt to update the required product.
                }
            }else if(firstResult instanceof ApiError){
                res.status(firstResult.error).send(firstResult)
            }else{
                res.status(500).send(firstResult) // Internal Error sent, generated at the search of the required product to be updated.
            }
        }
    }

    async delete(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        const id = req.params.id;
        console.log(`[PATH] Inside controller.`);
        const { error } = await validator.id.validateAsync(id);
        if (error){
            next(ApiError.badRequest(EProductsErrors.IdIncorrect));
        }else{
            const firstResult: IMongoProduct[] | ApiError | InternalError = await productsApi.getProduct(id);
            if(isProduct(firstResult)){
                const result : CUDResponse | InternalError = await productsApi.deleteProduct(id);
                if(isCUDResponse(result)){
                    res.status(201).send(result)
                }else{
                    res.status(500).send(result)    // Internal Error sent, generated at the attempt to delete the required product.
                }
            }else if(firstResult instanceof ApiError){
                res.status(firstResult.error).send(firstResult)
            }else{
                res.status(500).send(firstResult)   // Internal Error sent, generated at the search of the required product to be deleted.
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
        const firstResult: IMongoProduct[] | ApiError | InternalError = await productsApi.getProduct();
        if(isProduct(firstResult)){
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
                const { error } =  validator.query.validate(options);
                if (error) {
                    next(ApiError.badRequest(error.message));
                } else {
                    console.log(options)
                    const result: IMongoProduct[] | ApiError | InternalError = await productsApi.query(
                        options
                    );
                    if(isProduct(result)){
                        res.status(200).send(result)
                    }else if(result instanceof ApiError){
                        res.status(result.error).send(result)
                    }else{
                        res.status(500).send(result)  // Internal Error sent, generated at the attempt to get a products params.
                    }
                }
        }else if(firstResult instanceof ApiError){
            res.status(firstResult.error).send(firstResult)
        }else{
            res.status(500).send(firstResult)  // Internal Error sent, genereated at the attempt to get products (just for checking if there is at least one product to request a query).
        }
        
    }
}

export const products_controller = new ProductController();
