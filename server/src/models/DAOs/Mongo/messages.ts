
import { Model, Schema, model } from 'mongoose';
import { Utils } from '../../../common/utils';
import { ApiError } from '../../../api/errorApi';
import { DBMessagesClass, IMongoMessage, INew_Message } from '../../../common/interfaces/messages';
import { CUDResponse, InternalError } from '../../../common/interfaces/others';


const messagesSchema = new Schema({
    timestamp: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, required: true },
    message: { type: String, required: true },
});

const messagesModel = model<INew_Message, Model<INew_Message>>(
    'messages',
    messagesSchema
)

export class MongoMessages implements DBMessagesClass {
    private messages: Model<INew_Message>;
    constructor(type: string) {
        this.messages = messagesModel;
        this.init();
    }
    async init() {
        await this.messages.deleteMany({});
        console.log(`Messages initialized`);
    }
    async get(): Promise<IMongoMessage[] | ApiError | InternalError> {
        try {
            const docs = await this.messages.find({});
        if (docs.length > 0) {
            const messages: IMongoMessage[] = Utils.extractMongoMessages(docs);
            return messages;
        } else {
            return ApiError.notFound(`No messages.`)
        }
        } catch (error) {
            return {
                error: error,
                message: "An error occured."
            }
        }
        
    }
    async add(msg: INew_Message): Promise<CUDResponse | InternalError> {
        try {
            const doc = await this.messages.create(msg);
        const result = Utils.extractMongoMessages([doc])[0];
        return {
            message: `Message successfully added.`,
            data: result,
        };
        } catch (error) {
            return {
                error: error,
                message: "An error occured."
            }
        }
        
    }
}
