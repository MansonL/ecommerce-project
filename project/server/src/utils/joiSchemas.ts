import Joi from 'joi';
import {
    INew_Product,
    IQuery,
    IUpdate,
    INew_User,
} from '../interfaces/interfaces';

class Validations {
    newProduct: Joi.ObjectSchema<INew_Product>;
    update: Joi.ObjectSchema<IUpdate>;
    query: Joi.ObjectSchema<IQuery>;
    id: Joi.StringSchema | Joi.NumberSchema;
    user: Joi.ObjectSchema<INew_User>;
    constructor() {
        /**
         * JOI Schema to validate the objects to be saved from the frontend
         */
        this.newProduct = Joi.object<INew_Product>({
            timestamp: Joi.string().required(),
            title: Joi.string()
                .min(4)
                .max(100)
                .required()
                .pattern(/^\s*\w+(?:[^\w,]+\w+)*[^,\w]*$/),
            description: Joi.string()
                .min(10)
                .max(1000)
                .pattern(/^\s*\w+(?:[^\w,]+\w+)*[^,\w]*$/),
            code: Joi.string().min(5).required(),
            img: Joi.string().uri().required(),
            price: Joi.number().min(0.01).required(),
            stock: Joi.number().min(0).required(),
        });
        /**
         * JOI Schema to validate the objects from the frontend for updates
         */
        this.update = Joi.object<IUpdate>({
            title: Joi.string().alphanum().min(4).max(30),
            description: Joi.string().alphanum().min(10).max(60),
            img: Joi.string().uri(),
            code: Joi.string().alphanum().min(5).max(30),
            price: Joi.number().min(0.01),
            stock: Joi.number().min(0),
        });

        this.query = Joi.object<IQuery>({
            title: Joi.string().alphanum().allow('').optional(),
            code: Joi.string().alphanum().allow('').optional(),
            price: {
                minPrice: Joi.number().min(0.01).optional(),
                maxPrice: Joi.number().min(0).optional(),
            },
            stock: {
                minStock: Joi.number().min(0).optional(),
                maxStock: Joi.number().min(0).optional(),
            },
        });
        /**
         * JOI Schema to validate users.
         */
        this.user = Joi.object<INew_User>({
            timestamp: Joi.string().required(),
            username: Joi.string().email({ tlds: { allow: false } }),
            
            name: Joi.string().min(4).max(20).required(),
            surname: Joi.string().min(4).max(20).required(),
            age: Joi.number().min(10).max(100).required(),
            alias: Joi.string().min(5).max(35),
            avatar: Joi.string().uri(),
        });

        this.id = Joi.string().min(2).required();
    }
}
export const validator = new Validations();
