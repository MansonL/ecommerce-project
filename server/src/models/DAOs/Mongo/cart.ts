import { Document, model, Model, Schema, Types } from 'mongoose';
import { ECartErrors } from '../../../interfaces/EErrors';
import { ApiError } from '../../../api/errorApi';
import { DBCartClass, ICart, IMongoCart } from '../../../interfaces/products';
import { CUDResponse } from '../../../interfaces/others';
import moment from 'moment';
import { Config } from '../../../config/config';
import { logger } from '../../../services/logger';
import cluster from 'cluster';
import { Utils } from '../../../utils/utils';
import { ObjectId } from 'mongodb';





const cartSchema = new Schema({
    createdAt: { type: String, required: true },
    modifiedAt: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'users' },
    products: [{
        product: { type: Schema.Types.ObjectId, ref: 'products'},
        quantity: { type: Number, required: true },
        _id: false,
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
    constructor() {
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
                if(doc){
                    const cart = await (await doc.populate({ path: 'products.product', select: 'title price images' })).populate({ path: 'user', select: 'data.username' }) as IMongoCart;
                    return [cart]
                } else {
                    return ApiError.notFound(ECartErrors.EmptyCart)
                }
            } else {
                const docs = await this.cart.find({}).populate({ path: 'products.product', select: '_id title price images' }).populate({ path: 'user', select: 'data.username' }) as IMongoCart[];
                if (docs.length > 0) {
                    return docs
                } else {
                    return ApiError.notFound(ECartErrors.NoCarts)
                }
            }
        } catch (error) {
            return ApiError.internalError(`Internal error ocurred.`)
        }
        
    }

    async createEmpty(user_id: string): Promise<CUDResponse | ApiError> {
        try {
            const newCart = await (await this.cart.create({
                createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
                modifiedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
                user: user_id,
                products: [],
            })).populate({ path: 'user' , select: 'data.username' }) as IMongoCart
            return {
                data: newCart,
                message: `New cart successfully created.`
            }
        } catch (error) {
            return ApiError.internalError(`An error occured.`)
        }
    }

    async add(user_id: string, product_id: string, quantity: number): Promise<CUDResponse | ApiError> {
        try {
            const cartDoc = await this.cart.findOne({ user: user_id });
            if(cartDoc){
                const product = cartDoc.products.find(product => product.product.toString() === product_id
                    );
                if(product){
                    const canAddExistingOne = await Utils.validateCartModification(product_id, quantity + product.quantity);
                    if(canAddExistingOne){
                        cartDoc.products = cartDoc.products.map(product => {
                            if(String(product.product) == product_id){
                                product.quantity += quantity;
                                return product
                            }else
                                return product
                        });
                    }else
                        return ApiError.badRequest(`Not enough stock of the desired product.`);
                }else{
                    const canAddNewOne = await Utils.validateCartModification(product_id, quantity);
                    if(canAddNewOne){
                        cartDoc.products.push({
                            product: new Types.ObjectId(product_id),
                            quantity: quantity,
                        });
                    }else
                        return ApiError.badRequest(`Not enough stock of the desired product.`)
                }
                cartDoc.modifiedAt = moment().format('YYYY-MM-DD HH:mm:ss');
                await cartDoc.save();
                const cart = await (await cartDoc.populate({ path: 'products.product', select: '_id title price images'})).populate({ path: 'user', select: 'data.username' }) as IMongoCart
                return {
                    message: `Product successfully added.`,
                    data: cart,
                };
            }else{
                const canAdd = await Utils.validateCartModification(product_id, quantity);
                if(canAdd){
                    const newCart : ICart = {
                        createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
                        modifiedAt:  moment().format('YYYY-MM-DD HH:mm:ss'),
                        user: new ObjectId(user_id),
                        products: [{
                            product: new ObjectId(product_id),
                            quantity: quantity,
                        }]
                    }
                    const cartDoc = await this.cart.create(newCart);
                    const cart = (await (await cartDoc.populate({ path: 'products.product', select: '_id title price images'})).populate({ path: 'user', select: 'data.username' })) as IMongoCart
                    return {
                        message: `Product successfully added.`,
                        data: cart
                    }
                }else
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
                if(deleted.length > 0 && (deleted[0].quantity >= quantity)){
                    const newProducts = deleted[0].quantity === quantity ?
                        cartDoc.products.filter(product => product.product.toString() !== product_id) :
                        cartDoc.products.map(product => {
                            if(product.product.toString() === product_id)
                                product.quantity -= quantity
                            return product
                        });
                    cartDoc.modifiedAt = moment().format('YYYY-MM-DD HH:mm:ss');
                    await cartDoc.set('products', newProducts)
                    await cartDoc.save()
                    const newCart = await (await cartDoc.populate({ path: 'products.product', select: '_id title price images' })).populate({ path: 'user', select: 'data.username' }) as IMongoCart
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
