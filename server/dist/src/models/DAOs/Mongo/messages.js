"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoMessages = void 0;
const mongoose_1 = require("mongoose");
const errorApi_1 = require("../../../api/errorApi");
const config_1 = require("../../../config/config");
const cluster_1 = __importDefault(require("cluster"));
const logger_1 = require("../../../services/logger");
const messagesSchema = new mongoose_1.Schema({
    timestamp: { type: String, required: true },
    from: { type: mongoose_1.Schema.Types.ObjectId, ref: 'users' },
    to: { type: mongoose_1.Schema.Types.ObjectId, ref: 'users' },
    message: { type: String, required: true },
});
messagesSchema.set('toJSON', {
    transform: (document, returnedDocument) => {
        delete returnedDocument.__v;
    }
});
const messagesModel = (0, mongoose_1.model)('messages', messagesSchema);
class MongoMessages {
    constructor() {
        this.messages = messagesModel;
        this.init();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            if (config_1.Config.MODE === 'CLUSTER') {
                if (cluster_1.default.isMaster) {
                    yield this.messages.deleteMany({});
                    logger_1.logger.info(`Messages initialized`);
                }
            }
            else {
                yield this.messages.deleteMany({});
                logger_1.logger.info(`Messages initialized`);
            }
        });
    }
    get(user_id) {
        var e_1, _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const docs = yield this.messages.find({});
                if (docs.length > 0) {
                    if (user_id) {
                        let messages = [];
                        try {
                            for (var docs_1 = __asyncValues(docs), docs_1_1; docs_1_1 = yield docs_1.next(), !docs_1_1.done;) {
                                const document = docs_1_1.value;
                                if (String(document.from) == user_id) {
                                    const populatedDoc = yield document.populate({ path: 'to', select: 'data.username data.name data.surname _id data.avatar' });
                                    messages.push(populatedDoc);
                                }
                                else if (String(document.to) == user_id) {
                                    const populatedDoc = yield document.populate({ path: 'from', select: 'data.username data.name data.surname _id data.avatar' });
                                    messages.push(populatedDoc);
                                }
                            }
                        }
                        catch (e_1_1) { e_1 = { error: e_1_1 }; }
                        finally {
                            try {
                                if (docs_1_1 && !docs_1_1.done && (_a = docs_1.return)) yield _a.call(docs_1);
                            }
                            finally { if (e_1) throw e_1.error; }
                        }
                        return messages;
                    }
                    else {
                        let messages = [];
                        yield docs.forEach((document) => __awaiter(this, void 0, void 0, function* () {
                            const populatedDoc = yield document.populate({ path: 'from to', select: 'data.username' });
                            messages.push(populatedDoc);
                        }));
                        return messages;
                    }
                }
                else {
                    return errorApi_1.ApiError.notFound(`No messages.`);
                }
            }
            catch (error) {
                return errorApi_1.ApiError.internalError(`An error occured.`);
            }
        });
    }
    add(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const doc = yield (yield this.messages.create(msg)).populate({ path: 'to', select: 'data.username' });
                return {
                    message: `Message successfully added.`,
                    data: doc,
                };
            }
            catch (error) {
                return errorApi_1.ApiError.internalError(`An error occured.`);
            }
        });
    }
}
exports.MongoMessages = MongoMessages;
