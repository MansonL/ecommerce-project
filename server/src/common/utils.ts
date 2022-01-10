
import {  IMongoProduct } from './interfaces/products';
import { ApiError } from '../api/errorApi';
import { EOrdersErrors, EProductsErrors } from './EErrors';
import { uploadManyImages } from '../middleware/cloudinary';
import { productsApi } from '../api/products';
import { IMongoOrderPopulated, IOrder, IOrderPopulated, IUserOrder, OrderProducts } from './interfaces/orders';
import { Types, Document } from 'mongoose';
import { IMongoUser, UserAddresses } from './interfaces/users';
import { usersApi } from '../api/users';
import { logger } from '../services/logger';
import cloudinary from '../services/cloudinary';
import transporter from '../services/email';
import Mail from 'nodemailer/lib/mailer';

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
        return `_${Math.random().toString(36).substr(2, 9)}`;
    };


    /*----------------------------- CART UTIL FUNCTION ---------------------------------------------------- */


    static validateCartModification = async (product_id: string, quantity: number): Promise<boolean> => {
        const doc = await productsApi.getProduct(product_id) as IMongoProduct[] ; 
        
        // It's already checked that the product exists at the controller.

        return quantity <= doc[0].stock;
    }



    /*-----------------------------------  IMAGES UTILS FUNCTION -----------------------------------------------*/



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
        const response = await transporter.sendMail(mailOptions)
        logger.info(response)
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
                const valid = DBProducts.every(DBproduct => {
                   return order[DBproduct._id] <= DBproduct.stock
                });
                return valid ? valid : EOrdersErrors.GreaterQuantity
            }else{
                return EOrdersErrors.DeletedProduct
            }
        }
    }

    static async  populatedAddressDeep (ordersDocs: (Document<any, any, IUserOrder> & IUserOrder & {
        _id: Types.ObjectId;
    })[]): Promise<IMongoOrderPopulated[] | ApiError> {
        const users : IMongoUser[] | ApiError = await usersApi.getUsers();
            if(users instanceof ApiError)
                return users
            else {
                const populatedAddressDocs : IMongoOrderPopulated[] = [];
                const populatedOrders : IOrderPopulated[] = []
                ordersDocs.forEach(orderDoc => {
                    orderDoc.orders.forEach(order => {
                        const orderCreator = users.find(user => 
                             user._id == String(orderDoc.user)
                        ) as IMongoUser
                        populatedOrders.push({
                            createdAt: order.createdAt,
                            products: order.products,
                            status: order.status,
                            _id: order._id,
                            total: order.total,
                            address: orderCreator.data.addresses?.find(address => address._id == String(order.address)) as UserAddresses
                        })
                    populatedAddressDocs.push({
                        user: {
                            data: {
                                username: users.find(user => user._id == String(orderDoc.user))?.data.username as string
                            }
                        },
                        orders: [...populatedOrders]                    
                    });
                    
                    populatedOrders.length = 0; // Truncating array of orders.
                });

        })
        return populatedAddressDocs
    }
  }
}
