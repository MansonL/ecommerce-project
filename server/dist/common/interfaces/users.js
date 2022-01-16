"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUser = void 0;
/**
 *
 * @param data Possible user object
 * @returns whether the passed data is the desired Mongo DB Object or not
 */
const isUser = (data) => {
    return data.length ? 'username' in data[0] : 'username' in data;
};
exports.isUser = isUser;
