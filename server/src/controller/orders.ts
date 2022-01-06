import { NextFunction, Request, Response } from "express";
import moment from "moment";
import { ObjectId } from "mongodb";
import { isValidObjectId } from "mongoose";
import { ApiError } from "../api/errorApi";
import { ordersApi } from "../api/order";
import { EProductsErrors } from "../common/EErrors";
import { IMongoOrderPopulated, IOrder, IOrderPopulated, OrderProducts } from "../common/interfaces/orders";
import { CUDResponse } from "../common/interfaces/others";
import { Utils } from "../common/utils";
import { logger } from "../services/logger";



class OrdersController {
    
    async getByAdmin (req: Request, res: Response, next: NextFunction): Promise<void> {
        const { user_id, order_id } = req.body;
        if(user_id){
            if(isValidObjectId(user_id)){
                const result : IMongoOrderPopulated[] | IOrderPopulated[] | ApiError = await ordersApi.get('user', user_id);

                // Will be one document containing the orders of the user if there's no error.

                if(result instanceof ApiError)
                    next(result)
                else
                    res.status(200).send(result)
            }else
                next(ApiError.badRequest(EProductsErrors.IdIncorrect))

        }else if(order_id){
            if(isValidObjectId(order_id)){
                const result : IMongoOrderPopulated[] | IOrderPopulated[] | ApiError = await ordersApi.get('order', order_id);
                
                // Will be IOrder if there's no error.

                if(result instanceof ApiError)
                    next(result);
                else
                    res.status(200).send(result)
            }else
                next(ApiError.badRequest(EProductsErrors.IdIncorrect))

        }else{
            const result: IMongoOrderPopulated[] | IOrderPopulated[] | ApiError = await ordersApi.get(undefined, undefined);    

            // Will be IMongoOrder[] of every user if there's no error.

            if(result instanceof ApiError)
                next(result)
            else
                res.status(200).send(result)
        }
    }

    async getByUser (req: Request, res: Response, next: NextFunction): Promise<void> {
        const order_id = req.params.id;
        const { user_id } = req.user as Express.User;
        if(order_id){
            if(isValidObjectId(order_id)){
                const result : IMongoOrderPopulated[] | IOrderPopulated[] | ApiError = await ordersApi.get('order', order_id)

                // At frontend user must only have a view of his orders and theirs id's.

                if(result instanceof ApiError)
                    next(result)
                else
                    res.status(200).send(result)
            }else
                next(ApiError.badRequest(EProductsErrors.IdIncorrect))
        }else{
            const result: IMongoOrderPopulated[] | IOrderPopulated[] | ApiError = await ordersApi.get('user', user_id);
            
            // Retrieving all orders of the user
            
            if(result instanceof ApiError)
                next(result)
            else
                res.status(200).send(result)
        }
    }

    async createOrder (req: Request, res: Response, next: NextFunction): Promise<void> {
        const { user_id } = req.user as Express.User;
        const { products, total, address } = req.body as {
            products: OrderProducts[],
            total: number;
            address: ObjectId;
        }
        const isValidOrder = await Utils.isValidOrder(products);
        if(isValidOrder instanceof ApiError)
            next(isValidOrder);
        else if(typeof isValidOrder === 'string')
            next(ApiError.badRequest(isValidOrder));
        else{
            const order : IOrder = {
                _id: new ObjectId(),
                createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
                products: products,
                status: 'created',
                total: total,
                address: address
            };
            const result : CUDResponse | ApiError= await ordersApi.create(order, user_id);
            if(result instanceof ApiError)
                next(result)
            else
                res.status(201).send(result)
        }
    }

    async modifyOrder (req: Request, res: Response, next: NextFunction): Promise<void> {
        const { order_id, newStatus } = req.body as {
            order_id: string;
            newStatus: string; 
        }
        if(order_id && newStatus){
            if(isValidObjectId(order_id)){
                if(newStatus === 'paid' || newStatus === 'delivering' || newStatus === 'completed'){
                    const result : CUDResponse | ApiError = await ordersApi.modifyOrder(order_id, newStatus);
                    if(result instanceof ApiError)
                        next(result)
                    else
                        res.status(201).send(result)
                }else
                    next(ApiError.badRequest(`Valid status to assign: paid, delivering or completed `))
            }else
                next(ApiError.badRequest(EProductsErrors.IdIncorrect))
        }else{
            next(ApiError.badRequest(`Please type an order id and a new status for the order.`));
        }
    }
}

export const ordersController = new OrdersController();