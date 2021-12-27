"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeData = void 0;
const normalizr_1 = require("normalizr");
const authorsSchema = new normalizr_1.schema.Entity('authors', {}, { idAttribute: '_id' });
const messagesSchema = new normalizr_1.schema.Entity('messages', {
    author: authorsSchema,
}, { idAttribute: '_id' });
const normalizeData = (messages) => {
    const normalizedData = (0, normalizr_1.normalize)(messages, [messagesSchema]);
    return normalizedData;
};
exports.normalizeData = normalizeData;
