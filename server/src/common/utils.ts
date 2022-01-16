
import {  IMongoCart, IMongoProduct } from './interfaces/products';
import { ApiError } from '../api/errorApi';
import { EOrdersErrors, EProductsErrors } from './EErrors';
import { uploadManyImages } from '../middleware/cloudinary';
import { productsApi } from '../api/products';
import { IMongoOrderPopulated, IOrderPopulated, IUserOrder, OrderProducts } from './interfaces/orders';
import { Types, Document } from 'mongoose';
import { IMongoUser, UserAddresses } from './interfaces/users';
import { usersApi } from '../api/users';
import { logger } from '../services/logger';
import cloudinary from '../services/cloudinary';
import Mail from 'nodemailer/lib/mailer';
import { createTransporter } from '../services/email';
import { ordersApi } from '../api/order';
import { cartApi } from '../api/cart'
import { IMessageSentPopulated, IMongoMessage } from './interfaces/messages';
import { messagesApi } from '../api/messages';
import { CUDResponse } from './interfaces/others';
import moment from 'moment';

const BOTID = new Types.ObjectId();

export const htmlGeneral = `<!doctype html>
                    <html>
                      <head>
                        <meta name="viewport" contsent="width=device-width" />
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
                          <div ="main-container">`;

export const htmlFooter = `</div></td></tr></table></body></html>`;

export class Utils {
    
    
    /* -------------------------------- QUERY UTIL FUNCTION ------------------------------------------*/

    /**
     *
     * @param type: string
     *
     * @returns : Max price or stock of products.
     */
    static getMaxStockPrice = async (
        products: IMongoProduct[],
        type: string
    ): Promise<number> => {
        if (type === 'price') {
            const prices = products.map((product) => product.price);
            return Math.max(...prices);
        } else {
            const stocks = products.map((product) => product.stock);
            return Math.max(...stocks);
        }
    };


    /*------------------------------ MOCKING PRODUCTS UTIL FUNCTION ------------------------------------- */


    /**
     * Product code different than DB id.
     * @returns String code.
     */

    static generateCode = (): string => {
        return `${Math.random().toString(36).substr(2, 9)}`;
    };

    /* ----------------------------- BOT MESSAGE IMPLEMENTATION --------------------------------------- */
    
    static botAnswer = async (message: string, user_id: string, username: string): Promise<string> => {
        switch(message.toLowerCase()){
            case 'stock' : {
                        const result : IMongoProduct[] | ApiError = await productsApi.getStock();
                        if(result instanceof ApiError)
                            return result.message
                        else{
                            const result2 : CUDResponse| ApiError = await messagesApi.addMsg({
                                timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
                                from: BOTID,
                                to: new Types.ObjectId(user_id),
                                type: 'system',
                                message: JSON.stringify(result, null, '\t')
                            });
                            if(result2 instanceof ApiError)
                                return result2.message
                            else{
                                const message = JSON.stringify(result2.data, null, '\n'); 
                                return message
                            }
                        }
                        
                        }
            case 'order': {
                        const result : IOrderPopulated[] | IMongoOrderPopulated[] | ApiError = await ordersApi.get('user', user_id);
                        if(result instanceof ApiError)
                            return result.message
                        else{
                            const result2 : CUDResponse | ApiError = await messagesApi.addMsg({
                                timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
                                from: BOTID,
                                to: new Types.ObjectId(user_id),
                                type: 'system',
                                message: JSON.stringify(result, null, '\t')
                            });
                            if(result2 instanceof ApiError)
                                return result2.message
                            else{
                                const message = JSON.stringify(result2.data, null, '\t');
                                return message
                            }
                        }
                        
                        }
            case 'cart': {
                        const result : IMongoCart[] | ApiError = await cartApi.get(username);
                        if(result instanceof ApiError)
                            return result.message
                        else{
                            const result2 : CUDResponse | ApiError = await messagesApi.addMsg({
                                timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
                                from: BOTID,
                                to: new Types.ObjectId(user_id),
                                type: 'system',
                                message: JSON.stringify(result, null, '\t')
                            });
                            if(result2 instanceof ApiError)
                                return result2.message
                            else{
                                const message = JSON.stringify(result2.data, null, '\t');
                                return message
                            }
                        }
                    }
            default: 
                    return `Please, type a valid option among the followings: order, stock or cart.`
        }
    }
    
    /*----------------------------- CART UTIL FUNCTION ---------------------------------------------------- */


    static validateCartModification = async (product_id: string, quantity: number): Promise<boolean> => {
        const doc = await productsApi.getProduct(product_id) as IMongoProduct[] ; 
        
        // It's already checked that the product exists at the controller.

        return quantity <= doc[0].stock;
    }



    /*-----------------------------  IMAGES UTILS FUNCTION -----------------------------------------------*/



    static validateAndUploadImages = async (files: {
        file: string;
        name: string;
        mimetype: string;
    }[], folder: string): Promise<ApiError | { url: string, photo_id: string }[]> => { 
        const typesAllowed = /jpeg|jpg|png/;
        for await (const file of files) {
            if(!typesAllowed.test(file.mimetype))
                return ApiError.badRequest(EProductsErrors.UnsupportedImageType)
        }
        const uploadedData = await uploadManyImages(files.map(file => {
            return {
                file: file.file,
                name: file.name
            }
        }), folder);
        return uploadedData.length > 0 ? uploadedData : ApiError.internalError(`An error at uploading images`);
    }

    static deleteImagesFromCloud = async (files_id: string[]): Promise<ApiError | boolean> => {
        for await (const iterator of files_id) {
            const { result } = await cloudinary.uploader.destroy(iterator);
            if(result !== "ok") return ApiError.internalError(`Wrong image id. Error at cloud image deletion.`)
        }
        return true
    }


    /*------------------------------ EMAIL UTIL FUNCTION ------------------------------------------------  */

    static sendEmail = async (to: string, subject: string, content: string): Promise<void> => {
        const mailOptions : Mail.Options = {
            to: to,
            subject: subject,
            html: content,
            replyTo: 'mansonlautaro@gmail.com'
        };
        const transporter = await createTransporter();
        if(transporter instanceof ApiError)
            logger.warn(transporter.message)
        else {
             await transporter.sendMail(mailOptions)   
        }
    }

    /*------------------------------ ORDER UTILS FUNCTIONS -----------------------------------------------*/


    static isValidOrder = async (orderProducts: OrderProducts[]): Promise<boolean | string | ApiError > => {
        const ids = orderProducts.map(product => String(product.product_id));
        const DBProducts = await productsApi.getByIds(ids);
        if(DBProducts instanceof ApiError)
            return DBProducts
        else{
            if(DBProducts.length === ids.length){
                const order : {
                    [index: string]: number;
                } = {};
                orderProducts.forEach(product => {
                    order[String(product.product_id)] = product.quantity;
                });
                const invalidProductAmount : string[] = [];
                const valid = DBProducts.every(DBproduct => {
                    if(order[DBproduct._id] > DBproduct.stock) orderProducts.forEach(product => {
                        if(String(product.product_id) == DBproduct._id) invalidProductAmount.push(product.product_title)
                    })
                    return order[DBproduct._id] <= DBproduct.stock
                });
                return valid ? valid : `${EOrdersErrors.GreaterQuantity}
                ${invalidProductAmount.concat(', ')}`
            }else{
                return EOrdersErrors.DeletedProduct
            }
        }
    }

    /* ------------------------- ADDRESS FORMATTING FOR HTML EMAIL -------------------------------------- */

    static addressHTMLFormat = (address: UserAddresses): string => {
        return `${address.street1.name} ${address.street1.number}${address.department ? ` ${address.department}` : ''}${address.floor ? ` ${address.floor}` : ''}, ${!address.street2 ? '' : 
                address.street3 ? `near ${address.street2} and ${address.street3},` :
                `near ${address.street2}, `}${address.city} ${address.zipcode}`
    }


    /* ----------------------------- HTML EMAIL FUNCTION CREATOR ------------------------------ */
    static createHTMLOrderEmail = (products: OrderProducts[], htmlAddress: string, total: number, customerOrAdminFiller: [string, string]) => {
        
        const productsHTML : string = products.length > 1 ? 
                products.map(product => {
                    return `<p ="products-list" style="text-align: left; margin-left: 2.5rem;">
                        ${product.product_title} x${product.quantity} <span style="margin-left:0.2rem; font-size: 1.2rem; color: green;">${product.price*product.quantity}</span>
                        </p>`
                }).join()
            :
                [`<p ="products-list" style="text-align: left; margin-left: 2.5rem;">
                    ${products[0].product_title} x${products[0].quantity} <span style="margin-left:0.2rem; font-size: 1.2rem; color: green;">${products[0].price*products[0].quantity}</span>
                </p>`].toString()
        
        const htmlTotal = `<p ="order-text" style="font-size: 1.2rem; text-align: left; margin-left: 1.2rem;">
                <b>Total:</b> <span ="price" style="margin-left: 0.5rem; font-size: 1.5rem; color: green;">${total}</span>
                </p>`;

    
        return  htmlGeneral.concat(`<h2>${customerOrAdminFiller[0]}</h2><h4>Here are the details:</h4>`.
        concat(productsHTML.concat(htmlTotal)).concat(`<p ="order-text" style="font-size: 1.2rem; text-align: left; margin-left: 1.2rem;">
        ${customerOrAdminFiller[1]}: <b>${htmlAddress}</b>
      </p>`)).concat(htmlFooter);
    }

    /* ------------------------- MANUALLY ADDRESSES POPULATION ------------------------------------------ */

    static async  populatedAddressDeep (ordersDocs: (Document<any, any, IUserOrder> & IUserOrder & {
        _id: Types.ObjectId;
    })[]): Promise<IMongoOrderPopulated[] | ApiError> {
        const users : IMongoUser[] | ApiError = await usersApi.getUsers();
        const products : IMongoProduct[] | ApiError = await productsApi.getProduct();
            if(users instanceof ApiError)
                return users
            else if(products instanceof ApiError)
                return products
            else {
                const populatedAddressDocs : IMongoOrderPopulated[] = [];
                const populatedOrders : IOrderPopulated[] = []
                ordersDocs.forEach(orderDoc => {
                    orderDoc.orders.forEach(order => {
                        const orderCreator = users.find(user => 
                             user._id == String(orderDoc.user)
                        ) as IMongoUser;
                        populatedOrders.push({
                            createdAt: order.createdAt,
                            products: order.products.map(orderProduct => {
                                return {
                                    product_id: orderProduct.product_id,
                                    quantity: orderProduct.quantity,
                                    price: orderProduct.price,
                                    product_title: products.filter(product => product._id == String(orderProduct.product_id))[0].title
                                }
                            }),
                            status: order.status,
                            _id: order._id,
                            total: order.total,
                            address: orderCreator.data.addresses?.find(address => address._id == String(order.address)) as UserAddresses
                        })
                });
                populatedAddressDocs.push({
                    user: {
                        data: {
                            username: users.find(user => user._id == String(orderDoc.user))?.data.username as string
                        }
                    },
                    orders: [...populatedOrders]                    
                });
                populatedOrders.length = 0; // Truncating array of orders.
        })
        return populatedAddressDocs
    }
  }
}
