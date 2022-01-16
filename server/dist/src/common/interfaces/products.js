"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isProduct = exports.isCartProduct = void 0;
/**
 *
 * @param data Possible product object
 * @returns whether the passed data is the desired Mongo DB Object or not
 */
const isCartProduct = (data) => {
    return data.length ? 'product_id' in data[0] : 'product_id' in data;
};
exports.isCartProduct = isCartProduct;
const isProduct = (data) => {
    return data.length ? '_id' in data[0] : '_id' in data;
};
exports.isProduct = isProduct;
