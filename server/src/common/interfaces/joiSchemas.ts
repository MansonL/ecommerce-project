import Joi from 'joi';
import moment from 'moment';
import { INew_Product, IQuery, IUpdate } from './products';
import { INew_User, UserInfo } from './users';


const maxDate = moment().subtract(10, 'y').format('MM/DD/YYYY');
const minDate = moment().subtract(99, 'y').format('MM/DD/YYYY');

class Validations {
    newProduct: Joi.ObjectSchema<INew_Product>;
    update: Joi.ObjectSchema<IUpdate>;
    query: Joi.ObjectSchema<IQuery>;
    user: Joi.ObjectSchema<UserInfo>;
    constructor() {
        /**
         * JOI Schema to validate the objects to be saved from the frontend
         */
        this.newProduct = Joi.object<INew_Product>({
            createdAt: Joi.string().required(),
            modifiedAt: Joi.string().required(),
            title: Joi.string()
                .min(4)
                .max(100)
                .required()
                .pattern(/^\s*\w+(?:[^\w,]+\w+)*[^,\w]*$/),
            description: Joi.string()
                .min(10)
                .max(1000)
                .pattern(/^\s*\w+(?:[^\w,]+\w+)*[^,\w]*$/),
            code: Joi.string().min(5).max(10).required(),
            img: Joi.array().items(Joi.object().keys({
                id: Joi.string().required(),
                url: Joi.string().uri(),
            })),
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
        this.user = Joi.object<UserInfo>({
            username: Joi.string().email({ tlds: { allow: false } }).required(),
            password: Joi.string().alphanum().min(6).max(20).required(),
            repeatedPassword: Joi.any().equal(Joi.ref('password'))
            .required(),
            name: Joi.string().min(4).max(20).required(),
            surname: Joi.string().min(4).max(20).required(),
            age: Joi.number().min(10).max(100).required(),
            avatar: Joi.string().uri(),
            photos: Joi.array().items(Joi.string().uri()),
            facebookID: Joi.string(),
        });
    }
}
export const validator = new Validations();
