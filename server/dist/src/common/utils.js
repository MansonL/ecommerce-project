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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utils = exports.htmlFooter = exports.htmlGeneral = void 0;
const errorApi_1 = require("../api/errorApi");
const EErrors_1 = require("./EErrors");
const cloudinary_1 = require("../middleware/cloudinary");
const products_1 = require("../api/products");
const mongoose_1 = require("mongoose");
const users_1 = require("../api/users");
const logger_1 = require("../services/logger");
const cloudinary_2 = __importDefault(require("../services/cloudinary"));
const email_1 = require("../services/email");
const order_1 = require("../api/order");
const cart_1 = require("../api/cart");
const messages_1 = require("../api/messages");
const moment_1 = __importDefault(require("moment"));
const BOTID = new mongoose_1.Types.ObjectId();
exports.htmlGeneral = `<!doctype html>
                    <html>
                      <head>
                        <meta name="viewport" contsent="width=device-width" />
                        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
                        <title>New order html email</title>
                      </head>
                      <body><table ="container" style="margin: auto; background-color: white; width: 80%; padding: 0.5rem; text-align: center; font-family: 'Helvetica', sans-seriff;" width="80%" bgcolor="white" align="center">
                      <tr>
                        <td>
                          <div ="header-container" style="background-color: #f1faee; border-radius: 0.4rem; max-height: 10rem; padding: 1rem; margin-bottom: 0.2rem;">
                            <img src="https://www.seekpng.com/png/full/428-4289671_logo-e-commerce-good-e-commerce-logo.png" alt="" style="width: auto; max-height: 5rem;">
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div ="main-container">`;
exports.htmlFooter = `</div></td></tr></table></body></html>`;
class Utils {
    /* ------------------------- MANUALLY ADDRESSES POPULATION ------------------------------------------ */
    static populatedAddressDeep(ordersDocs) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield users_1.usersApi.getUsers();
            const products = yield products_1.productsApi.getProduct();
            if (users instanceof errorApi_1.ApiError)
                return users;
            else if (products instanceof errorApi_1.ApiError)
                return products;
            else {
                const populatedAddressDocs = [];
                const populatedOrders = [];
                ordersDocs.forEach(orderDoc => {
                    var _b;
                    orderDoc.orders.forEach(order => {
                        var _b;
                        const orderCreator = users.find(user => user._id == String(orderDoc.user));
                        populatedOrders.push({
                            createdAt: order.createdAt,
                            products: order.products.map(orderProduct => {
                                return {
                                    product_id: orderProduct.product_id,
                                    quantity: orderProduct.quantity,
                                    price: orderProduct.price,
                                    product_title: products.filter(product => product._id == String(orderProduct.product_id))[0].title
                                };
                            }),
                            status: order.status,
                            _id: order._id,
                            total: order.total,
                            address: (_b = orderCreator.data.addresses) === null || _b === void 0 ? void 0 : _b.find(address => address._id == String(order.address))
                        });
                    });
                    populatedAddressDocs.push({
                        user: {
                            data: {
                                username: (_b = users.find(user => user._id == String(orderDoc.user))) === null || _b === void 0 ? void 0 : _b.data.username
                            }
                        },
                        orders: [...populatedOrders]
                    });
                    populatedOrders.length = 0; // Truncating array of orders.
                });
                return populatedAddressDocs;
            }
        });
    }
}
exports.Utils = Utils;
_a = Utils;
/* -------------------------------- QUERY UTIL FUNCTION ------------------------------------------*/
/**
 *
 * @param type: string
 *
 * @returns : Max price or stock of products.
 */
Utils.getMaxStockPrice = (products, type) => __awaiter(void 0, void 0, void 0, function* () {
    if (type === 'price') {
        const prices = products.map((product) => product.price);
        return Math.max(...prices);
    }
    else {
        const stocks = products.map((product) => product.stock);
        return Math.max(...stocks);
    }
});
/*------------------------------ MOCKING PRODUCTS UTIL FUNCTION ------------------------------------- */
/**
 * Product code different than DB id.
 * @returns String code.
 */
Utils.generateCode = () => {
    return `${Math.random().toString(36).substr(2, 9)}`;
};
/* ----------------------------- BOT MESSAGE IMPLEMENTATION --------------------------------------- */
Utils.botAnswer = (message, user_id, username) => __awaiter(void 0, void 0, void 0, function* () {
    switch (message.toLowerCase()) {
        case 'stock': {
            const result = yield products_1.productsApi.getStock();
            if (result instanceof errorApi_1.ApiError)
                return result.message;
            else {
                const result2 = yield messages_1.messagesApi.addMsg({
                    timestamp: (0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss'),
                    from: BOTID,
                    to: new mongoose_1.Types.ObjectId(user_id),
                    type: 'system',
                    message: JSON.stringify(result, null, '\t')
                });
                if (result2 instanceof errorApi_1.ApiError)
                    return result2.message;
                else {
                    const message = JSON.stringify(result2.data, null, '\n');
                    return message;
                }
            }
        }
        case 'order': {
            const result = yield order_1.ordersApi.get('user', user_id);
            if (result instanceof errorApi_1.ApiError)
                return result.message;
            else {
                const result2 = yield messages_1.messagesApi.addMsg({
                    timestamp: (0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss'),
                    from: BOTID,
                    to: new mongoose_1.Types.ObjectId(user_id),
                    type: 'system',
                    message: JSON.stringify(result, null, '\t')
                });
                if (result2 instanceof errorApi_1.ApiError)
                    return result2.message;
                else {
                    const message = JSON.stringify(result2.data, null, '\t');
                    return message;
                }
            }
        }
        case 'cart': {
            const result = yield cart_1.cartApi.get(username);
            if (result instanceof errorApi_1.ApiError)
                return result.message;
            else {
                const result2 = yield messages_1.messagesApi.addMsg({
                    timestamp: (0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss'),
                    from: BOTID,
                    to: new mongoose_1.Types.ObjectId(user_id),
                    type: 'system',
                    message: JSON.stringify(result, null, '\t')
                });
                if (result2 instanceof errorApi_1.ApiError)
                    return result2.message;
                else {
                    const message = JSON.stringify(result2.data, null, '\t');
                    return message;
                }
            }
        }
        default:
            return `Please, type a valid option among the followings: order, stock or cart.`;
    }
});
/*----------------------------- CART UTIL FUNCTION ---------------------------------------------------- */
Utils.validateCartModification = (product_id, quantity) => __awaiter(void 0, void 0, void 0, function* () {
    const doc = yield products_1.productsApi.getProduct(product_id);
    // It's already checked that the product exists at the controller.
    return quantity <= doc[0].stock;
});
/*-----------------------------  IMAGES UTILS FUNCTION -----------------------------------------------*/
Utils.validateAndUploadImages = (files, folder) => { var files_1, files_1_1; return __awaiter(void 0, void 0, void 0, function* () {
    var e_1, _b;
    const typesAllowed = /jpeg|jpg|png/;
    try {
        for (files_1 = __asyncValues(files); files_1_1 = yield files_1.next(), !files_1_1.done;) {
            const file = files_1_1.value;
            if (!typesAllowed.test(file.mimetype))
                return errorApi_1.ApiError.badRequest(EErrors_1.EProductsErrors.UnsupportedImageType);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (files_1_1 && !files_1_1.done && (_b = files_1.return)) yield _b.call(files_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    const uploadedData = yield (0, cloudinary_1.uploadManyImages)(files.map(file => {
        return {
            file: file.file,
            name: file.name
        };
    }), folder);
    return uploadedData.length > 0 ? uploadedData : errorApi_1.ApiError.internalError(`An error at uploading images`);
}); };
Utils.deleteImagesFromCloud = (files_id) => { var files_id_1, files_id_1_1; return __awaiter(void 0, void 0, void 0, function* () {
    var e_2, _b;
    try {
        for (files_id_1 = __asyncValues(files_id); files_id_1_1 = yield files_id_1.next(), !files_id_1_1.done;) {
            const iterator = files_id_1_1.value;
            const { result } = yield cloudinary_2.default.uploader.destroy(iterator);
            if (result !== "ok")
                return errorApi_1.ApiError.internalError(`Wrong image id. Error at cloud image deletion.`);
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (files_id_1_1 && !files_id_1_1.done && (_b = files_id_1.return)) yield _b.call(files_id_1);
        }
        finally { if (e_2) throw e_2.error; }
    }
    return true;
}); };
/*------------------------------ EMAIL UTIL FUNCTION ------------------------------------------------  */
Utils.sendEmail = (to, subject, content) => __awaiter(void 0, void 0, void 0, function* () {
    const mailOptions = {
        to: to,
        subject: subject,
        html: content,
        replyTo: 'mansonlautaro@gmail.com'
    };
    const transporter = yield (0, email_1.createTransporter)();
    if (transporter instanceof errorApi_1.ApiError)
        logger_1.logger.warn(transporter.message);
    else {
        yield transporter.sendMail(mailOptions);
    }
});
/*------------------------------ ORDER UTILS FUNCTIONS -----------------------------------------------*/
Utils.isValidOrder = (orderProducts) => __awaiter(void 0, void 0, void 0, function* () {
    const ids = orderProducts.map(product => String(product.product_id));
    const DBProducts = yield products_1.productsApi.getByIds(ids);
    if (DBProducts instanceof errorApi_1.ApiError)
        return DBProducts;
    else {
        if (DBProducts.length === ids.length) {
            const order = {};
            orderProducts.forEach(product => {
                order[String(product.product_id)] = product.quantity;
            });
            const invalidProductAmount = [];
            const valid = DBProducts.every(DBproduct => {
                if (order[DBproduct._id] > DBproduct.stock)
                    orderProducts.forEach(product => {
                        if (String(product.product_id) == DBproduct._id)
                            invalidProductAmount.push(product.product_title);
                    });
                return order[DBproduct._id] <= DBproduct.stock;
            });
            return valid ? valid : `${EErrors_1.EOrdersErrors.GreaterQuantity}
                ${invalidProductAmount.concat(', ')}`;
        }
        else {
            return EErrors_1.EOrdersErrors.DeletedProduct;
        }
    }
});
/* ------------------------- ADDRESS FORMATTING FOR HTML EMAIL -------------------------------------- */
Utils.addressHTMLFormat = (address) => {
    return `${address.street1.name} ${address.street1.number}${address.department ? ` ${address.department}` : ''}${address.floor ? ` ${address.floor}` : ''}, ${!address.street2 ? '' :
        address.street3 ? `near ${address.street2} and ${address.street3},` :
            `near ${address.street2}, `}${address.city} ${address.zipcode}`;
};
/* ----------------------------- HTML EMAIL FUNCTION CREATOR ------------------------------ */
Utils.createHTMLOrderEmail = (products, htmlAddress, total, customerOrAdminFiller) => {
    const productsHTML = products.length > 1 ?
        products.map(product => {
            return `<p ="products-list" style="text-align: left; margin-left: 2.5rem;">
                        ${product.product_title} x${product.quantity} <span style="margin-left:0.2rem; font-size: 1.2rem; color: green;">${product.price * product.quantity}</span>
                        </p>`;
        }).join()
        :
            [`<p ="products-list" style="text-align: left; margin-left: 2.5rem;">
                    ${products[0].product_title} x${products[0].quantity} <span style="margin-left:0.2rem; font-size: 1.2rem; color: green;">${products[0].price * products[0].quantity}</span>
                </p>`].toString();
    const htmlTotal = `<p ="order-text" style="font-size: 1.2rem; text-align: left; margin-left: 1.2rem;">
                <b>Total:</b> <span ="price" style="margin-left: 0.5rem; font-size: 1.5rem; color: green;">${total}</span>
                </p>`;
    return exports.htmlGeneral.concat(`<h2>${customerOrAdminFiller[0]}</h2><h4>Here are the details:</h4>`.
        concat(productsHTML.concat(htmlTotal)).concat(`<p ="order-text" style="font-size: 1.2rem; text-align: left; margin-left: 1.2rem;">
        ${customerOrAdminFiller[1]}: <b>${htmlAddress}</b>
      </p>`)).concat(exports.htmlFooter);
};
