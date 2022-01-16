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
exports.uploadManyImages = exports.uploadImage = void 0;
const cloudinary_1 = __importDefault(require("../services/cloudinary"));
const logger_1 = require("../services/logger");
const uploadImage = (file, folder, name) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield cloudinary_1.default.uploader.upload(file, {
        folder: folder,
        public_id: name,
    });
    return { url: data.secure_url, photo_id: data.public_id };
});
exports.uploadImage = uploadImage;
const uploadManyImages = (files, folder) => { var files_1, files_1_1; return __awaiter(void 0, void 0, void 0, function* () {
    var e_1, _a;
    const images = [];
    try {
        for (files_1 = __asyncValues(files); files_1_1 = yield files_1.next(), !files_1_1.done;) {
            const file = files_1_1.value;
            const data = yield cloudinary_1.default.uploader.upload(file.file, {
                folder: folder,
                public_id: file.name,
            });
            images.push({ url: data.secure_url, photo_id: data.public_id });
            logger_1.logger.info(JSON.stringify(images, null, '\t'));
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (files_1_1 && !files_1_1.done && (_a = files_1.return)) yield _a.call(files_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return images;
}); };
exports.uploadManyImages = uploadManyImages;
