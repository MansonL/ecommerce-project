
import { Model, Schema, model, Document, Types } from 'mongoose';
import { Utils } from '../../../common/utils';
import { ApiError } from '../../../api/errorApi';
import { DBMessagesClass, IMongoMessage, INew_Message } from '../../../common/interfaces/messages';
import { CUDResponse } from '../../../common/interfaces/others';


const messagesSchema = new Schema({
    timestamp: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'users' },
    message: { type: String, required: true },
});

messagesSchema.set('toJSON', {
    transform: (document, returnedDocument) => {
        delete returnedDocument.__v;
    }
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
    async get(user_id: string): Promise<IMongoMessage[] | ApiError > {
        try {
            const docs = await this.messages.find({});
        if (docs.length > 0) {
            let messages : (Document<any, any, INew_Message> & INew_Message & {
                _id: Types.ObjectId;
            })[] = [];
            docs.map(async document => {
                const populatedDoc = await document.populate({ path: 'author', select: 'data.username' });
                messages.push(populatedDoc)
            })
            return messages as IMongoMessage[]
        } else {
            return ApiError.notFound(`No messages.`)
        }
        } catch (error) {
            return ApiError.internalError(`An error occured.`)
        }
        
    }
    async add(msg: INew_Message): Promise<CUDResponse | ApiError> {
        try {
            const doc = await (await this.messages.create(msg)).populate({ path: 'author', select: 'data.username' }) as IMongoMessage;
        return {
            message: `Message successfully added.`,
            data: doc,
        };
        } catch (error) {
            return ApiError.internalError(`An error occured.`)
        }
        
    }
}
