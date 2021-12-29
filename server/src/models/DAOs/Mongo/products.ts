import { connect, Model } from 'mongoose';
import { models } from './models';
import {
    DBProductsClass,
    INew_Product,
    IMongoProduct,
    CUDResponse,
    IUpdate,
    IQuery,
    InternalError,
} from '../../../interfaces/interfaces';
import { mockProducts } from '../../mockProducts';
import moment from 'moment';
import { Utils } from '../../../common/utils';
import { ApiError } from '../../../api/errorApi';
import { EProductsErrors } from '../../../common/EErrors';

export class MongoProducts implements DBProductsClass {
    private products: Model<INew_Product>;
    constructor(type: string) {
        this.products = models.products;
        this.init();
    }
    async init(): Promise<void> {
        await this.products.deleteMany({});
        await this.products.insertMany(mockProducts);
        console.log(`Mock data inserted `);
    }
    async get(id?: string | undefined): Promise<IMongoProduct[] | ApiError | InternalError> {
      try {
        if (id != null) {
            const docs = await this.products.find({ _id: id });
            if (docs.length > 0) {
                const product: IMongoProduct[] =
                    Utils.extractMongoProducts(docs);
                return product;
            }
            return ApiError.notFound(EProductsErrors.ProductNotFound)
        } else {
            const docs = await this.products.find({});
            if (docs.length > 0) {
                const products: IMongoProduct[] =
                    Utils.extractMongoProducts(docs);
                return products;
            }
            return ApiError.notFound(EProductsErrors.NoProducts)
        }
      } catch (error) {
            return {
                error: error,
                message: "An error occured"
            }
      }
    }
    async add(product: INew_Product): Promise<CUDResponse | InternalError> {
        try {
            const doc = await this.products.create(product);
            const result: IMongoProduct = Utils.extractMongoProducts([doc])[0];
            return {
                message: `Product successfully saved.`,
                data: result,
            };
        } catch (error) {
            return {
                error: error,
                message: "An error occured"
            }
        }
        
    }
    async update(id: string, data: IUpdate): Promise<CUDResponse | InternalError> {
        try {
            const doc = await this.products.find({ _id: id });
            const product: IMongoProduct = Utils.extractMongoProducts(doc)[0];
            const newProduct = { ...product, ...data };
            newProduct.timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
            console.log(newProduct);
            await this.products.replaceOne({ _id: id }, newProduct);
            return {
                message: `Product successfully updated.`,
                data: newProduct,
            };
        } catch (error) {
            return {
                error: error,
                message: "An error occured"
            }
        }
        
    }
    async delete(id: string): Promise<CUDResponse | InternalError> {
        try {
            const deletedDoc = await this.products.find({ _id: id });
            const deletedProduct: IMongoProduct =
                Utils.extractMongoProducts(deletedDoc)[0];
            await this.products.deleteOne({ _id: id });
            return {
                message: `Product successfully deleted`,
                data: deletedProduct,
            };
        } catch (error) {
            return {
                error: error,
                message: "An error occured"
            }
        }
        
    }

    async query(options: IQuery): Promise<IMongoProduct[] | ApiError | InternalError> {
        try {
            const titleRegex =
                options.title === ''
                    ? new RegExp(`.*`)
                    : new RegExp(`(${options.title})`);
            const codeRegex =
                options.code === ''
                    ? new RegExp(`.*`)
                    : new RegExp(`(${options.code})`);
            const doc = await this.products.find({
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
            if (doc.length > 0) {
                const products: IMongoProduct[] = Utils.extractMongoProducts(doc);
                return products;
            } else {
                return ApiError.notFound(`No products matching the query`);
            }
        } catch (error) {
            return {
                error: error,
                message: "An error occured"
            }
        }
        
    }
}
