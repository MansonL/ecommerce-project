"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCUDResponse = exports.isMessages = exports.isUser = exports.isProduct = exports.isCartProduct = void 0;
/* This implementation is for when we request an array of data
 from the db and need to check if there was an error or everything
 gone well.
*/
const isCartProduct = (data) => {
    return data.length ? 'product_id' in data[0] : 'product_id' in data;
};
exports.isCartProduct = isCartProduct;
const isProduct = (data) => {
    return data.length ? '_id' in data[0] : '_id' in data;
};
exports.isProduct = isProduct;
const isUser = (data) => {
    return data.length ? 'username' in data[0] : 'username' in data;
};
exports.isUser = isUser;
const isMessages = (data) => {
    return data.length ? 'author' in data[0] : 'author' in data;
};
exports.isMessages = isMessages;
const isCUDResponse = (data) => {
    return 'data' in data;
};
exports.isCUDResponse = isCUDResponse;
