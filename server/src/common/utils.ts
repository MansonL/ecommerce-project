
import faker from 'faker';
import moment from 'moment';
import { randomNumber } from '../models/mockProducts';
import { Document, Types } from 'mongoose';
import bcrypt from 'bcrypt'
import { ICart, IMongoCart, IMongoProduct, INew_Product } from './interfaces/products';
import { IMongoUser } from './interfaces/users';
import { INew_Message } from './interfaces/messages';

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
}
