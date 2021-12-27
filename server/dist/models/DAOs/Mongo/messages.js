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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoMessages = void 0;
const models_1 = require("./models");
const utils_1 = require("../../../common/utils");
const errorApi_1 = require("../../../utils/errorApi");
class MongoMessages {
    constructor(type) {
        this.messages = models_1.models.messages;
        this.init();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.messages.deleteMany({});
            yield models_1.WelcomeMessage.save();
            console.log(`Messages initialized`);
        });
    }
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const docs = yield this.messages.find({});
                if (docs.length > 0) {
                    const messages = utils_1.Utils.extractMongoMessages(docs);
                    return messages;
                }
                else {
                    return errorApi_1.ApiError.notFound(`No messages.`);
                }
            }
            catch (error) {
                return {
                    error: error,
                    message: "An error occured."
                };
            }
        });
    }
    add(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const doc = yield this.messages.create(msg);
                const result = utils_1.Utils.extractMongoMessages([doc])[0];
                return {
                    message: `Message successfully added.`,
                    data: result,
                };
            }
            catch (error) {
                return {
                    error: error,
                    message: "An error occured."
                };
            }
        });
    }
}
exports.MongoMessages = MongoMessages;
