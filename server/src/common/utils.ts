
import faker from 'faker';
import moment from 'moment';
import { randomNumber } from '../models/mockProducts';
import { Document, Types } from 'mongoose';
import bcrypt from 'bcrypt'
import { IMongoCartProduct, IMongoProduct, INew_Product } from './interfaces/products';
import { IMongoUser } from './interfaces/users';

export class Utils {
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

    /**
     * Product code different than DB id.
     * @returns String code.
     */

    static generateCode = (): string => {
        return `_${Math.random().toString(36).substr(2, 9)}`;
    };

    /**
     * Functions for extracting the needed data from the queried docs from MongoDB
     * @param documents
     *
     * @returns
     */
    static extractMongoProducts = (
        documents: (Document<any, any, INew_Product> &
            INew_Product & {
                _id: Types.ObjectId;
            })[]
    ): IMongoProduct[] => {
        const products: IMongoProduct[] = documents.map(
            (document): IMongoProduct => {
                const {
                    _id,
                    timestamp,
                    title,
                    description,
                    code,
                    img,
                    stock,
                    price,
                } = document.toObject({ flattenMaps: true });
                const product: IMongoProduct = {
                    _id: _id as string,
                    timestamp: timestamp as string,
                    title: title as string,
                    description: description as string,
                    code: code as string,
                    img: img as string,
                    stock: stock as number,
                    price: price as number,
                };
                return product;
            }
        );
        return products;
    };
    static extractMongoMessages = (
        documents: (Document<any, any, INew_Message> &
            INew_Message & {
                _id: Types.ObjectId;
            })[]
    ): IMongoMessage[] => {
        const messages: IMongoMessage[] = documents.map(
            (document): IMongoMessage => {
                const { timestamp, author, message } = document.toObject({
                    flattenMaps: true,
                });
                const _id = document._id;
                const mongoMessage: IMongoMessage = {
                    _id,
                    timestamp,
                    author,
                    message,
                };
                return mongoMessage;
            }
        );
        return messages;
    };
    static extractMongoUsers = (
        documents: (Document<any, any, INew_User> &
            INew_User & {
                _id: Types.ObjectId;
            })[]
    ): IMongoUser[] => {
        const users: IMongoUser[] = documents.map((document): IMongoUser => {
            const { timestamp, username, password, name, surname, age, alias, avatar, facebookID, photos } =
                document.toObject({ flattenMaps: true });
            const _id: string = document._id;
            const mongoUser: IMongoUser = {
                _id: _id,
                timestamp: timestamp,
                username: username,
                password: password,
                name: name,
                surname: surname ,
                age: age,
                alias: alias,
                avatar: avatar,
                facebookID: facebookID,
                photos: photos,
            };
            return mongoUser;
        });
        return users;
    };


    static extractMongoCartDocs = (documents: any): IMongoCartProduct[] => {
        const productsIds = documents.map((document: any) => {
            const { product_id } = document;
            return product_id;
        });
        const products: IMongoProduct[] = this.extractMongoProducts(documents);
        const cartProducts: IMongoCartProduct[] = products.map(
            (product: IMongoProduct, idx: number) => {
                return { product_id: productsIds[idx], ...product };
            }
        );
        return cartProducts;
    };

    /**
    * Function for encrypting user password
    * @param password to encrypt
    * @returns password encrypted
    *
    */
    static createHash = (password: string): string => {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
    }
}
