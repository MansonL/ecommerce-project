import cluster from "cluster";
import { Model, model, Schema, Types } from "mongoose";
import { ApiError } from "../../../api/errorApi";
import { EOrdersErrors } from "../../../interfaces/EErrors";
import { DBOrdersClass, IUserOrder, IOrder, IMongoOrderPopulated, IOrderPopulated } from "../../../interfaces/orders";
import { CUDResponse } from "../../../interfaces/others";
import { Utils } from "../../../utils/utils";
import { Config } from "../../../config/config";
import { logger } from "../../../services/logger";

const ordersSchema = new Schema({
    user: { type: Schema.Types.ObjectId, required: true, ref: 'users' },
    orders: [{
        createdAt: { type: String, required: true },
        products: [{
            product_id: { type: Types.ObjectId, ref: 'products', required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
            _id: false,
        }],
        status: { type: String, required: true },
        total: { type: Number, required: true },
        address: { type: Types.ObjectId, required: true, ref: 'users.data.addresses' }
    }]
});

ordersSchema.set('toJSON', {
    transform: (document, returnedDocument) => {
        delete returnedDocument.__v;
    }
});

const ordersModel = model<IUserOrder, Model<IUserOrder>>(
    'orders',
    ordersSchema
)

export class MongoOrders implements DBOrdersClass {
    private orders: Model<IUserOrder>;
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

    async get(type: 'user' | 'order' | undefined, _id: string | undefined): Promise<IMongoOrderPopulated[] | IOrderPopulated[] | ApiError> {
        try{
            if(type != null && _id != null){
                if(type === 'user'){
                    const doc = await this.orders.findOne({ user: _id })
                    if(doc){
                        const docPopulated = await Utils.populatedAddressDeep([doc]);
                        if(docPopulated instanceof ApiError)
                            return docPopulated
                        else
                            return docPopulated[0].orders
                    }else
                        return ApiError.notFound(EOrdersErrors.NoOrdersCreated)
                }else{
                    const doc = await (await this.orders.findOne({ "orders._id": _id }));
                    if(doc){
                        const docPopulated = await Utils.populatedAddressDeep([doc]);
                        if(docPopulated instanceof ApiError)
                            return docPopulated
                        else
                            return docPopulated[0].orders
                    
                    }else
                        return ApiError.notFound(EOrdersErrors.OrderNotFound)
                }
            }else{
                const docs = await this.orders.find({})
                if(docs.length > 0){ // Querying all the orders from all the users.
                    const populatedAddressDocs = await Utils.populatedAddressDeep(docs);
                    if(populatedAddressDocs instanceof ApiError)
                        return populatedAddressDocs;
                    else
                        return populatedAddressDocs
                }else
                    return ApiError.notFound(EOrdersErrors.NoOrdersCreated);
            }
        }catch(error){
            return ApiError.internalError(`An error occured.`)
        }
    }

    async create(order: IOrder, user_id: string): Promise<CUDResponse | ApiError> {
        try {
            const doc = await this.orders.findOne({ user: user_id });
            if(doc){
                doc.orders.push(order);
                await doc.save();
                const docPopulated = await Utils.populatedAddressDeep([doc]);
                if(docPopulated instanceof ApiError)
                    return docPopulated
                else
                    return {
                        message: `Order successfully created.`,
                        data: docPopulated[0].orders.find(orderPopulated => orderPopulated._id == order._id) as IOrderPopulated
                    }
            }else{
                const doc = await this.orders.create({
                    user: user_id,
                    orders: [order],
                });
                const docPopulated  = await Utils.populatedAddressDeep([doc]);
                logger.info(JSON.stringify(docPopulated))
                if(docPopulated  instanceof ApiError)
                    return docPopulated 
                else
                    return {
                        message: `Order successfully created.`,
                        data: docPopulated[0].orders.find(orderPopulated => orderPopulated._id == order._id) as IOrderPopulated
                    }
            }
        } catch (error) {
            return ApiError.internalError(`An error occured.`)
        }
    }

    async modifyStatus(order_id: string, newStatus: 'created' | 'paid' | 'delivering' | 'completed'): Promise<CUDResponse | ApiError> {
        try {
            const doc = await this.orders.findOne({ 'orders._id': order_id });
            if(doc){
                const modifiedOrder : IOrder[] = [];
                doc.orders.forEach(order => {
                    if(String(order._id) == order_id){
                        order.status = newStatus;
                        modifiedOrder.push(order);
                    }
                });
                await doc.save();
                const docPopulated = await Utils.populatedAddressDeep([doc]);
                if(docPopulated instanceof ApiError)
                    return docPopulated
                else
                    return {
                        message: `Order status successfully modified.`,
                        data: docPopulated[0].orders.find(populatedOrder => String(populatedOrder._id) == order_id) as IOrderPopulated
                        }
            }else
                return ApiError.notFound(EOrdersErrors.OrderNotFound);
        } catch (error) {
            return ApiError.internalError(`An error occured.`)
        }
    }

}