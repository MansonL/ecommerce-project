import { NextFunction, Request, Response } from "express";
import moment from "moment";
import { ObjectId } from "mongodb";
import { isValidObjectId } from "mongoose";
import { ApiError } from "../api/errorApi";
import { ordersApi } from "../api/order";
import { usersApi } from "../api/users";
import { EProductsErrors } from "../common/EErrors";
import { IMongoOrderPopulated, IOrder, IOrderPopulated, OrderProducts } from "../common/interfaces/orders";
import { CUDResponse } from "../common/interfaces/others";
import { IMongoUser } from "../common/interfaces/users";
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
            const result : CUDResponse | ApiError = await ordersApi.create(order, user_id);
            if(result instanceof ApiError)
                next(result)
            else{
                const user = (await usersApi.getUser(user_id) as IMongoUser[])[0];
                const customerTo = user.data.username
                const customerSubject = `[NEW ORDER]: You have created a new order at Ecommerce.`
                let adminsResult = await usersApi.getAdmins();
                if(adminsResult instanceof ApiError)
                    res.send(adminsResult)
                else{
                    const adminsSubject = `[NEW ORDER]: ${user.data.name} ${user.data.surname} has made an order.`;
                    const adminsTo = adminsResult.join(', ');
                    logger.info(`Admin emails array: ${adminsTo}`);
                    const htmlGeneral = `<!doctype html>
                    <html>
                      <head>
                        <meta name="viewport" content="width=device-width" />
                        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
                        <title>New order html email</title>
                      </head>
                      <body><table ="container" style="margin: auto; background-color: white; width: 80%; padding: 0.5rem; text-align: center; font-family: 'Helvetica', sans-seriff;" width="80%" bgcolor="white" align="center">
                      <tr>
                        <td>
                          <div ="header-container" style="background-color: #f1faee; border-radius: 0.4rem; max-height: 10rem; padding: 1rem; margin-bottom: 0.2rem;">
                            <img src="https://www.seekpng.com/png/full/428-4289671_logo-e-commerce-good-e-commerce-logo.png" alt="" style="width: auto; max-height: 5rem;">
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div ="main-container">`

                        let productsHTML : string = '';
                        products.length > 1 ?
                        
                        products.forEach(product => {
                            productsHTML.concat(`<p ="products-list" style="font-size: 1.2rem; text-align: left; margin-left: 2.5rem;">
                            ${product.product_title} x${product.quantity} <span style="margin-left:0.2rem; font-size: 1.2rem; color: green;">${product.price*product.quantity}</span>
                         </p>`)
                        })

                        : 

                        productsHTML = `<p ="products-list" style="font-size: 1.2rem; text-align: left; margin-left: 2.5rem;">
                        ${products[0].product_title} x${products[0].quantity} <span style="margin-left:0.2rem; font-size: 1.2rem; color: green;">${products[0].price*products[0].quantity}</span>
                     </p>`;

                        const totalPieceMail = `<p ="order-text" style="font-size: 1.2rem; text-align: left; margin-left: 1.2rem;">
                        <b>Total:</b> <span ="price" style="margin-left: 0.5rem; font-size: 1.5rem; color: green;">${total}</span>
                      </p>`;

                        const mailFooter = `</div></td></tr></table></body></html>`

                        const customerMail = htmlGeneral.concat(`<h2>You have made an order!</h2><h4>Here are the details:</h4>`.
                        concat(productsHTML.concat(totalPieceMail)).concat(`<p ="order-text" style="font-size: 1.2rem; text-align: left; margin-left: 1.2rem;">
                        The address you selected is: <b>${(result.data as IOrderPopulated).address}</b>
                      </p>`)).concat(mailFooter);

                        const adminsMail = htmlGeneral.concat(`<h2>A new order was made!</h2><h4>Here is the order that ${user.data.name} ${user.data.surname} made:</h4>`.concat(productsHTML.concat(totalPieceMail)).concat(`<p ="order-text" style="font-size: 1.2rem; text-align: left; margin-left: 1.2rem;">
                        The address selected is: <b>${(result.data as IOrderPopulated).address}</b>
                      </p>`)).concat(mailFooter)
                        

                    res.status(201).send(result)
                }
            }
        }
    }


    <!doctype html>
                    <html>
                      <head>
                        <meta name="viewport" content="width=device-width">
                        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                        <title>New order html email</title>

                      </head>

                      <body>
<table ="container" style="margin: auto; background-color: white; width: 80%; padding: 0.5rem; text-align: center; font-family: 'Helvetica', sans-seriff;" width="80%" bgcolor="white" align="center">
  <tr>
    <td>
      <div ="header-container" style="background-color: #f1faee; border-radius: 0.4rem; max-height: 10rem; padding: 1rem; margin-bottom: 0.2rem;">
        <img src="https://www.seekpng.com/png/full/428-4289671_logo-e-commerce-good-e-commerce-logo.png" alt="" style="width: auto; max-height: 5rem;">
      </div>
    </td>
  </tr>
  <tr>
    <td>
      <div ="main-container">
        <h2>You have a new order!</h2>
        <p ="order-text" style="font-size: 1.2rem; text-align: left; margin-left: 1.2rem;">
          The following products were ordered by customerName:
        </p>
        
        <p ="products-list" style="font-size: 1.2rem; text-align: left; margin-left: 2.5rem;">
          Product 
        </p>
        <p ="products-list" style="font-size: 1.2rem; text-align: left; margin-left: 2.5rem;">
          Product 
        </p>
        <p ="products-list" style="font-size: 1.2rem; text-align: left; margin-left: 2.5rem;">
          Product 
        </p>
        <p ="order-text" style="font-size: 1.2rem; text-align: left; margin-left: 1.2rem;">
          <b>Total:</b> <span ="price" style="margin-left: 0.5rem; font-size: 1.5rem; color: green;">$500</span>
        </p>
        <p ="order-text" style="font-size: 1.2rem; text-align: left; margin-left: 1.2rem;">
          CustomerName address order #orderID is: <b>Lago Viedma 3077, Las Heras</b>
        </p>
      </div>
    </td>
  </tr>
</table>


</body>
</html>
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