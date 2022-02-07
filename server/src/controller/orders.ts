import { NextFunction, Request, Response } from "express";
import moment from "moment";
import { ObjectId } from "mongodb";
import { isValidObjectId } from "mongoose";
import { ApiError } from "../api/errorApi";
import { ordersApi } from "../api/order";
import { usersApi } from "../api/users";
import { EProductsErrors } from "../interfaces/EErrors";
import { IMongoOrderPopulated, IOrder, IOrderPopulated, OrderProducts } from "../interfaces/orders";
import { CUDResponse } from "../interfaces/others";
import { IMongoUser } from "../interfaces/users";
import { EmailUtilities } from "../utils/emails";
import { Utils } from "../utils/utils";




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
                
                // Will be IOrderPopulated if there's no error.

                if(result instanceof ApiError)
                    next(result);
                else
                    res.status(200).send(result)
            }else
                next(ApiError.badRequest(EProductsErrors.IdIncorrect))

        }else{
            const result: IMongoOrderPopulated[] | IOrderPopulated[] | ApiError = await ordersApi.get(undefined, undefined);    

            // Will be IMongoOrderPopulated[] of every user if there's no error.

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
            const result : CUDResponse | ApiError = await ordersApi.create(order, user_id);
            if(result instanceof ApiError)
                next(result)
            else{
                const user = (await usersApi.getUser(user_id) as IMongoUser[])[0];
                const customerTo = user.data.username
                const customerSubject = `[NEW ORDER]: You have created a new order at Ecommerce.`;
                const selectedAddress = (result.data as IOrderPopulated).address;
                let adminsResult = await usersApi.getAdmins();
                if(adminsResult instanceof ApiError)
                    res.send(adminsResult)
                else{
                    const adminsSubject = `[NEW ORDER]: ${user.data.name} ${user.data.surname} has made an order.`;
                    const adminsTo = adminsResult.join(', ');
                    const customerMail = EmailUtilities.createHTMLOrderEmail((result.data as IOrderPopulated).products, EmailUtilities.addressHTMLFormat(selectedAddress), total, ['You have made an order!', 'Your order will be delivered to']);
                    const adminsMail = EmailUtilities.createHTMLOrderEmail((result.data as IOrderPopulated).products, EmailUtilities.addressHTMLFormat(selectedAddress), total, ['A new order was made!', 'Address'])
                    await EmailUtilities.sendEmail(customerTo, customerSubject, customerMail);
                    await EmailUtilities.sendEmail(adminsTo, adminsSubject, adminsMail)
                    res.status(201).send(result)
                }
            }
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