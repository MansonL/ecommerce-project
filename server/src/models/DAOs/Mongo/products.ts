import { Document, model, Model, Schema, Types } from 'mongoose';
import { mockProducts } from '../../mockProducts';
import moment from 'moment';
import { ApiError } from '../../../api/errorApi';
import { EProductsErrors } from '../../../common/EErrors';
import { DBProductsClass, IMongoProduct, INew_Product, IQuery, IUpdate } from '../../../common/interfaces/products';
import { CUDResponse, InternalError } from '../../../common/interfaces/others';


const productSchema = new Schema({
    createdAt: { type: String, required: true },
    modifiedAt: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    code: { type: String, required: true },
    img: [{
        id: { type: String, required: true },
        url: { type: String, required: true }
    }],
    stock: { type: Number, required: true },
    price: { type: Number, required: true },
});

productSchema.set('toJSON', {
    transform: (document, returnedDocument) => {
        delete returnedDocument.__v;
    }
});

const productModel = model<INew_Product, Model<INew_Product>>(
    'products',
    productSchema
)


export class MongoProducts implements DBProductsClass {
    private products: Model<INew_Product>;
    constructor(type: string) {
        this.products = productModel;
        this.init();
    }
    async init(): Promise<void> {
        await this.products.deleteMany({});
        await this.products.insertMany(mockProducts);
        console.log(`Mock data inserted `);
    }
    async get(id?: string | undefined): Promise<IMongoProduct[] | ApiError> {
      try {
        if (id != null) {
            const doc = await this.products.findOne({ _id: id });
            if (doc) return [doc]
            else return ApiError.notFound(EProductsErrors.ProductNotFound)
        } else {
            const docs = await this.products.find({});
            if (docs.length > 0) return docs
            else return ApiError.notFound(EProductsErrors.NoProducts)
        }
      } catch (error) {
            return ApiError.internalError(`An error occured.`)
      }
    }
    async add(product: INew_Product): Promise<CUDResponse | ApiError> {
        try {
            const doc = await this.products.create(product);
            return {
                message: `Product successfully saved.`,
                data: doc,
            };
        } catch (error) {
            return ApiError.internalError(`An error occured.`)
        }
        
    }
    async update(id: string, data: IUpdate): Promise<CUDResponse | ApiError> {
        try {
            const doc = await this.products.findOne({ _id: id }).lean();
            if(doc){
                const newProduct = { ...doc, ...data };
                newProduct.modifiedAt = moment().format('YYYY-MM-DD HH:mm:ss');
                console.log(newProduct);
                await this.products.replaceOne({ _id: id }, newProduct);
                return {
                    message: `Product successfully updated.`,
                    data: { _id: id, ...newProduct},
                }
            }else{
                return ApiError.notFound(EProductsErrors.ProductNotFound)
            }
            
        } catch (error) {
            return ApiError.internalError(`An error occured.`)
        }
        
    }
    async delete(id: string): Promise<CUDResponse | ApiError> {
        try {
            const deletedDoc = await this.products.findOne({ _id: id });
            if(deletedDoc){
                await this.products.deleteOne({ _id: id });
                return {
                    message: `Product successfully deleted`,
                    data: deletedDoc,
                };
            }else{
                return ApiError.notFound(EProductsErrors.ProductNotFound)
            }
        } catch (error) {
            return ApiError.internalError(`An error occured.`)
        }
        
    }

    async query(options: IQuery): Promise<IMongoProduct[] | ApiError> {
        try {
            const titleRegex =
                options.title === ''
                    ? new RegExp(`.*`)
                    : new RegExp(`(${options.title})`);
            const codeRegex =
                options.code === ''
                    ? new RegExp(`.*`)
                    : new RegExp(`(${options.code})`);
            const docs = await this.products.find({
                title: { $regex: titleRegex },
                code: { $regex: codeRegex },
                price: {
                    $gte: options.price.minPrice,
                    $lte: options.price.maxPrice,
                },
                stock: {
                    $gte: options.stock.minStock,
                    $lte: options.stock.maxStock,
                },
            });
            if (docs.length > 0) return docs;
            else return ApiError.notFound(`No products matching the query`); 
        } catch (error) {
            return ApiError.internalError(`An error occured.`)
        }
        
    }
}
