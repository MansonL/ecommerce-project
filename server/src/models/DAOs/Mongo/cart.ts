import { Document, model, Model, Schema, Types } from 'mongoose';
import { ECartErrors } from '../../../common/EErrors';
import { ApiError } from '../../../api/errorApi';
import { DBCartClass, ICart, IMongoCart, IMongoProduct, isCartProduct } from '../../../common/interfaces/products';
import { CUDResponse, InternalError } from '../../../common/interfaces/others';
import moment from 'moment';
import { productsApi } from '../../../api/products';





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
        await this.cart.deleteMany({});
        console.log(`Cart cleaned`);
    }
    async get(user_id?: string | undefined): Promise<IMongoCart[] | ApiError > {
        try {
            if (user_id != null) {
                const doc = await this.cart.findOne({
                    user: user_id
                });
                console.log(doc);
                if(doc){
                    const cart = await (await doc.populate({ path: 'products.product', select: 'title price img' })).populate({ path: 'user', select: 'data.username' });
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
                        const cart = await (await document.populate({ path: 'products.product', select: 'title price img' })).populate({ path: 'user', select: 'data.username' });
                        carts.push(cart);
                    })
                    console.log(carts)
                    return carts;
                } else {
                    return ApiError.notFound(ECartErrors.NoCarts)
                }
            }
        } catch (error) {
            return ApiError.internalError(`Internal error ocurred.`)
        }
        
    }
    async add(user_id: string, product_id: string): Promise<CUDResponse | ApiError> {
        try {
            const cartDoc = await this.cart.findOne({ user: user_id })
            if(cartDoc){
                const product = cartDoc.products.find(product => product.product === product_id);
                product ? product.quantity++ : cartDoc.products.push({
                    product: product_id,
                    quantity: 1,
                });
                await cartDoc.save();
                const cart = await (await cartDoc.populate({ path: 'products.product', select: 'title price img'})).populate({ path: 'user', select: 'data.username' })
                console.log(cart)
                return {
                    message: `Product successfully added.`,
                    data: cart,
                };
            }else{
                const newCart : ICart = {
                    createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
                    user: user_id,
                    products: [{
                        product: product_id,
                        quantity: 1,
                    }]
                }
                const cartDoc = await this.cart.create(newCart);
                const cart = (await (await cartDoc.populate({ path: 'products', select: 'title price img'})).populate({ path: 'user', select: 'data.username' }));
                console.log(cart)
                return {
                    message: `Product successfully added.`,
                    data: cart
                }
            }
        } catch (error) {
            return ApiError.internalError(`An error occured.`)
        }
        
    }
    async delete(user_id: string, product_id: string): Promise<CUDResponse | ApiError> {
        try {
            const cartDoc = await this.cart.findOne({ user: user_id });
            if(cartDoc){
                let deleted = cartDoc.products.filter(product => product.product === product_id);
                console.log(deleted)
                if(deleted.length > 0){
                    const newProducts = cartDoc.products.filter(product => product.product !== product_id);
                    const productDeleted = await productsApi.getProduct(product_id) as IMongoProduct[]
                    cartDoc.set('products', newProducts);
                    console.log(cartDoc)
                    await cartDoc.save()
                    return {
                        data: productDeleted[0],
                        message: `Product successfully deleted from cart.`
                    }
                }else{
                    return ApiError.notFound(ECartErrors.ProductNotInCart);
                }
            }else{
                return ApiError.notFound(ECartErrors.EmptyCart);
            }
        } catch (error) {
            return ApiError.internalError(`An error occured.`)
        }
        
    }
}
