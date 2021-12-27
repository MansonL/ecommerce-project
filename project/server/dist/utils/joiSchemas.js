"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validator = void 0;
const joi_1 = __importDefault(require("joi"));
class Validations {
    constructor() {
        /**
         * JOI Schema to validate the objects to be saved from the frontend
         */
        this.newProduct = joi_1.default.object({
            timestamp: joi_1.default.string().required(),
            title: joi_1.default.string()
                .min(4)
                .max(100)
                .required()
                .pattern(/^\s*\w+(?:[^\w,]+\w+)*[^,\w]*$/),
            description: joi_1.default.string()
                .min(10)
                .max(1000)
                .pattern(/^\s*\w+(?:[^\w,]+\w+)*[^,\w]*$/),
            code: joi_1.default.string().min(5).required(),
            img: joi_1.default.string().uri().required(),
            price: joi_1.default.number().min(0.01).required(),
            stock: joi_1.default.number().min(0).required(),
        });
        /**
         * JOI Schema to validate the objects from the frontend for updates
         */
        this.update = joi_1.default.object({
            title: joi_1.default.string().alphanum().min(4).max(30),
            description: joi_1.default.string().alphanum().min(10).max(60),
            img: joi_1.default.string().uri(),
            code: joi_1.default.string().alphanum().min(5).max(30),
            price: joi_1.default.number().min(0.01),
            stock: joi_1.default.number().min(0),
        });
        this.query = joi_1.default.object({
            title: joi_1.default.string().alphanum().allow('').optional(),
            code: joi_1.default.string().alphanum().allow('').optional(),
            price: {
                minPrice: joi_1.default.number().min(0.01).optional(),
                maxPrice: joi_1.default.number().min(0).optional(),
            },
            stock: {
                minStock: joi_1.default.number().min(0).optional(),
                maxStock: joi_1.default.number().min(0).optional(),
            },
        });
        /**
         * JOI Schema to validate users.
         */
        this.user = joi_1.default.object({
            timestamp: joi_1.default.string().required(),
            username: joi_1.default.string().email({ tlds: { allow: false } }),
            name: joi_1.default.string().min(4).max(20).required(),
            surname: joi_1.default.string().min(4).max(20).required(),
            age: joi_1.default.number().min(10).max(100).required(),
            alias: joi_1.default.string().min(5).max(35),
            avatar: joi_1.default.string().uri(),
        });
        this.id = joi_1.default.string().min(2).required();
    }
}
exports.validator = new Validations();
