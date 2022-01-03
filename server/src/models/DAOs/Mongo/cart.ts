import { model, Model, Schema } from 'mongoose';
import { EProductsErrors } from '../../../common/EErrors';
import { Utils } from '../../../common/utils';
import { ApiError } from '../../../api/errorApi';
import { DBCartClass, ICart, IMongoCart, isCartProduct } from '../../../common/interfaces/products';
import { CUDResponse, InternalError } from '../../../common/interfaces/others';
import moment from 'moment';




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
    async get(id?: string | undefined): Promise<IMongoCartProduct[] | ApiError | InternalError> {
        try {
            if (id != null) {
                const doc = await this.cart.find({
                    product_id: id,
                });
                console.log(doc);
                if (doc.length > 0) {
                    const products: IMongoCartProduct[] =
                        Utils.extractMongoCartDocs(doc);
                    return products;
                } else {
                    return ApiError.notFound(EProductsErrors.ProductNotFound)
                }
            } else {
                const doc = await this.cart.find({});
                if (doc.length > 0) {
                    const products: IMongoCartProduct[] =
                        Utils.extractMongoCartDocs(doc);
                    return products;
                } else {
                    return ApiError.notFound(EProductsErrors.ProductNotFound)
                }
            }
        } catch (error) {
            return {
                error: error,
                message: "An error occured." 
            }
        }
        
    }
    async add(user_id: string, product_id: string): Promise<CUDResponse | InternalError> {
        try {
            const cartDoc = await this.cart.findOne({ user: user_id })
            if(cartDoc){
                const product = cartDoc.products.find(product => product.product === product_id);
                product ? product.quantity++ : cartDoc.products.push({
                    product: product_id,
                    quantity: 1,
                });
                cartDoc.save();
                const cart = (await (await cartDoc.populate({ path: 'products.product', select: 'title price img'})).populate<{ user: string }>({ path: 'user', select: 'data.username' }))
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
                return {
                    message: `Product successfully added.`,
                    data: cart
                }
            }
            
        } catch (error) {
            return {
                error: error,
                message: "An error occured."
            }
        }
        
    }
    async delete(id: string): Promise<CUDResponse | InternalError> {
        try {
            const deleted = await this.get(id);
            if(isCartProduct(deleted)){
            const result = await this.cart.deleteOne({ product_id: id });
            return {
                message: `Product successfully deleted.`,
                data: deleted,
            };
        }else{
            const error = deleted as ApiError;
            return {
                error: error.error,
                message: error.message
            }
        }
        } catch (error) {
            return {
                error: error,
                message: "An error occured."
            }
        }
        
    }
}
