"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMessages = void 0;
/**
 *
 * @param data Possible message object
 * @returns whether the passed data is the desired Mongo DB Object or not
 */
const isMessages = (data) => {
    return data.length ? 'author' in data[0] : 'author' in data;
};
exports.isMessages = isMessages;
