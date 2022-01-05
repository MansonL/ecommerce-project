import { Document, model, Model, Schema, Types } from 'mongoose';
import { ECartErrors } from '../../../common/EErrors';
import { ApiError } from '../../../api/errorApi';
import { DBCartClass, ICart, IMongoCart } from '../../../common/interfaces/products';
import { CUDResponse } from '../../../common/interfaces/others';
import moment from 'moment';
import { Config } from '../../../config/config';
import { logger } from '../../../services/logger';
import cluster from 'cluster';
import { Utils } from '../../../common/utils';
import { ObjectId } from 'mongodb';





const cartSchema = new Schema({
    createdAt: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'users' },
    products: [{
        product: { type: Schema.Types.ObjectId, ref: 'products'},
        quantity: { type: Number, required: true },
    }],
});

cartSchema.set('toJSON', {
    transform: (document, returnedDocument) => {
        delete returnedDocument.__v;
        delete returnedDocument.user._id;
    }
});

const cartModel = model<ICart, Model<ICart>>('cart', cartSchema)



export class MongoCart implements DBCartClass {
    private cart: Model<ICart>;
    constructor(type: string) {
        this.cart = cartModel;
        this.init();
    }
    async init(): Promise<void> {
        if(Config.MODE === 'CLUSTER'){
            if(cluster.isMaster){
                await this.cart.deleteMany({});
                logger.info(`Cart cleaned`);
            }
        }else{
            await this.cart.deleteMany({});
            logger.info(`Cart cleaned`);
        }
        
    }
    async get(user_id?: string | undefined): Promise<IMongoCart[] | ApiError > {
        try {
            if (user_id != null) {
                const doc = await this.cart.findOne({
                    user: user_id
                });
                logger.info(doc);
                if(doc){
                    const cart = await (await doc.populate({ path: 'products.product', select: 'title price images' })).populate({ path: 'user', select: 'data.username' });
                    return [cart]
                } else {
                    return ApiError.notFound(ECartErrors.EmptyCart)
                }
            } else {
                const docs = await this.cart.find({});
                if (docs.length > 0) {
                    let carts: (Document<any, any, ICart> & ICart & {
                        _id: Types.ObjectId;
                    })[] = [];
                    docs.map(async (document) => {
                        const cart = await (await document.populate({ path: 'products.product', select: 'title price images' })).populate({ path: 'user', select: 'data.username' });
                        carts.push(cart);
                    })
                    logger.info(carts)
                    return carts;
                } else {
                    return ApiError.notFound(ECartErrors.NoCarts)
                }
            }
        } catch (error) {
            return ApiError.internalError(`Internal error ocurred.`)
        }
        
    }
    async add(user_id: string, product_id: string, quantity: number): Promise<CUDResponse | ApiError> {
        try {
            const cartDoc = await this.cart.findOne({ user: user_id })
            const canAdd = await Utils.validateCartModification(product_id, quantity)
            if(canAdd){
                if(cartDoc){
                    const product = cartDoc.products.find(product => product.product.toString() === product_id
                    );
                        product ? product.quantity = quantity 
                        : cartDoc.products.push({
                                product: new ObjectId(product_id),
                                quantity: quantity,
                        });
                    await cartDoc.save();
                    const cart = await (await cartDoc.populate({ path: 'products.product', select: 'title price images'})).populate({ path: 'user', select: 'username' })
                    logger.info(cart)
                    return {
                        message: `Product successfully added.`,
                        data: cart,
                    };
                }else{
                    const newCart : ICart = {
                        createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
                        user: user_id,
                        products: [{
                            product: new ObjectId(product_id),
                            quantity: quantity,
                        }]
                    }
                    const cartDoc = await this.cart.create(newCart);
                    const cart = (await (await cartDoc.populate({ path: 'products.product', select: 'title price images'})).populate({ path: 'user', select: 'data.username' }));
                    logger.info(cart)
                    return {
                        message: `Product successfully added.`,
                        data: cart
                    }
                }
            }else{
                return ApiError.badRequest(`Not enough stock of the desired product.`)
            }
        } catch (error) {
            return ApiError.internalError(`An error occured.`)
        }
        
    }
    async delete(user_id: string, product_id: string, quantity: number): Promise<CUDResponse | ApiError> {
        try {
            const cartDoc = await this.cart.findOne({ user: user_id });
            if(cartDoc){
                let deleted = cartDoc.products.filter(product => product.product.toString() === product_id);
                logger.info(deleted)
                if(deleted.length > 0 && (deleted[0].quantity >= quantity)){
                    const newProducts = deleted[0].quantity === quantity ?
                        cartDoc.products.filter(product => product.product.toString() === product_id) :
                        cartDoc.products.map(product => {
                            if(product.product.toString() === product_id)
                                product.quantity - quantity
                            return product
                        });
                    await cartDoc.set('products', newProducts)
                    logger.info(cartDoc)
                    await cartDoc.save()
                    const newCart = await (await cartDoc.populate({ path: 'products', select: 'title price images' })).populate({ path: 'user', select: 'data.username' })
                    return {
                        data: newCart,
                        message: `Product successfully deleted from cart.`
                    }
                }else if(deleted.length > 0)  // The error was caused by the incorrect quantity to delete
                    return ApiError.badRequest(`The desired amount of the product to delete is greater than the amount stored in the cart`);
                else
                    return ApiError.notFound(ECartErrors.ProductNotInCart)
            }else{
                return ApiError.notFound(ECartErrors.EmptyCart);
            }
        } catch (error) {
            return ApiError.internalError(`An error occured.`)
        }
        
    }
}
