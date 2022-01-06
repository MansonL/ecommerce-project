import cluster from "cluster";
import { Model, model, Schema, Types } from "mongoose";
import { ApiError } from "../../../api/errorApi";
import { EOrdersErrors } from "../../../common/EErrors";
import { DBOrdersClass, IMongoOrder, IOrder } from "../../../common/interfaces/orders";
import { Config } from "../../../config/config";
import { logger } from "../../../services/logger";

const ordersSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'users' },
    orders: [{
        createdAt: { type: String, required: true },
        products: [{
            product_id: { type: Types.ObjectId, ref: 'products', required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
        }],
        status: { type: String, required: true },
        total: { type: Number, required: true }
    }]
});

ordersSchema.set('toJSON', {
    transform: (document, returnedDocument) => {
        delete returnedDocument.__v;
    }
});

const ordersModel = model<IOrder, Model<IOrder>>(
    'orders',
    ordersSchema
)

export class MongoOrders implements DBOrdersClass {
    private orders: Model<IOrder>;
    constructor(){
        this.orders = ordersModel;
        this.init();
    }

    async init(): Promise<void> {
        if(Config.MODE === 'CLUSTER'){
            if(cluster.isMaster){
                await this.orders.deleteMany({});
                logger.info(`Orders cleaned`);
            }
            
        }else{
            await this.orders.deleteMany({});
                logger.info(`Orders cleaned`);
        }
    }

    async get(type: 'user' | 'order' | undefined, _id: string | undefined): Promise<IMongoOrder[] | ApiError> {
        try{
            if(type != null && _id != null){
                if(type === 'user'){
                    const docs = await this.orders.find({ user: _id }).populate({ path: 'user', select: 'data.username' });
                    if(docs.length > 0)
                        return docs
                    else
                        return ApiError.notFound(EOrdersErrors.NoOrdersCreated)
                }else{
                    const doc = await this.orders.findOne({ _id: _id }).populate({ path: 'user', select: 'data.username' });
                    if(doc)
                        return [doc]
                    else
                        return ApiError.notFound(EOrdersErrors.OrderNotFound)
                }
            }else{
                const docs = await this.orders.find({}).populate({ path: 'user', select: 'data.username' });
                if(docs.length > 0)
                    return docs
                else
                    return ApiError.notFound(EOrdersErrors.NoOrdersCreated);
            }
        }catch(error){
            return ApiError.internalError(`An error occured.`)
        }
    }
    
}