"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validator = void 0;
const joi_1 = __importDefault(require("joi"));
const moment_1 = __importDefault(require("moment"));
const maxDate = (0, moment_1.default)().subtract(10, 'y').format('MM/DD/YYYY');
const minDate = (0, moment_1.default)().subtract(99, 'y').format('MM/DD/YYYY');
const streetStringErrorMsg = {
    // Won't be empty cause if it's empty it will be undefined.
    'string.min': `The name of the street must be longer than 5 characters.`,
    'string.max': `The name of the street must be shorter than 40 characters.`
};
class Validations {
    constructor() {
        /**
         * JOI Schema to validate the objects to be saved from the frontend
         *
         * Images will be validated at the controller.
         */
        this.newProduct = joi_1.default.object({
            createdAt: joi_1.default.string().required(),
            modifiedAt: joi_1.default.string().required(),
            title: joi_1.default.string()
                .min(4)
                .max(100)
                .required()
                .messages({
                'string.empty': `Product must have a title of at least 4 characters.`,
                'string.min': `The title of the product must be at least 4 characters long.`,
                'string.max': `The title of the product must be shorter than 31 characters.`,
            }),
            description: joi_1.default.string()
                .min(10)
                .max(500)
                .required()
                .messages({
                'string.empty': `Product must have a description of at least 10 characters.`,
                'string.min': `The description should be longer than 9 characters.`,
                'string.max': `The description must be shorter than 151 characters.`,
            }),
            code: joi_1.default.string().alphanum().min(5).max(10).required().messages({
                'string.empty': `Product must have a code.`,
                'string.alphanum': `The code must contain only letters and numbers.`,
                'string.min': `The code must be at least 5 characters long.`,
                'string.max': `The code must be shorter than 11 characters.`,
            }),
            price: joi_1.default.number().min(0.01).required().messages({
                'number.base': `The price must be a number and greater than 0.01.`,
                'number.min': `The price must be greater than 0.01.`,
            }),
            stock: joi_1.default.number().min(0).required().messages({
                'number.base': 'The stock must be a number and equal to or greater than 0.',
                'number.min': `Stock must be positive or equal to 0.`
            }),
            category: joi_1.default.string().min(3).max(20).required().messages({
                'string.empty': `Must provide a category.`,
                'string.min': `Category must be longer than 2 characters.`,
                'string.max': `Category must be shorter than 21 characters.`
            })
        }).required();
        /**
         * JOI Schema to validate the objects from the frontend for updates.
         *
         * Images will be validated at the controller.
         */
        this.update = joi_1.default.object({
            title: joi_1.default.string().min(4).max(30).optional().messages({
                // Won't be empty cause if it's empty it will be undefined.
                'string.min': `The title of the product must be at least 4 characters long.`,
                'string.max': `The title of the product must be shorter than 31 characters.`,
            }),
            description: joi_1.default.string().min(10).max(500).optional().messages({
                // Won't be empty cause if it's empty it will be undefined.
                'string.min': `The description should be longer than 9 characters.`,
                'string.max': `The description must be shorter than 151 characters.`,
            }),
            code: joi_1.default.string().alphanum().min(5).max(10).optional().messages({
                'string.alphanum': `The code must contain only letters and numbers.`,
                'string.min': `The code must be at least 5 characters long.`,
                'string.max': `The code must be shorter than 11 characters.`,
            }),
            price: joi_1.default.number().min(0.01).optional().messages({
                'number.base': `The price must be a number and greater than 0.01.`,
                'number.min': `The price must be greater than 0.01.`,
            }),
            stock: joi_1.default.number().min(0).optional().messages({
                'number.base': 'The stock must be a number and equal to or greater than 0.',
                'number.min': `Stock must be positive or equal to 0.`
            }),
            category: joi_1.default.string().min(3).max(20).optional().messages({
                'string.empty': `Must provide a category.`,
                'string.min': `Category must be longer than 2 characters.`,
                'string.max': `Category must be shorter than 21 characters.`
            }),
            images: joi_1.default.array().items(joi_1.default.object().keys({
                url: joi_1.default.string().uri().required(),
                photo_id: joi_1.default.string().required(),
            }).required()).optional()
        }).required();
        this.query = joi_1.default.object({
            title: joi_1.default.string().allow('').optional(),
            code: joi_1.default.string().allow('').optional(),
            price: {
                minPrice: joi_1.default.number().min(0.01).optional(),
                maxPrice: joi_1.default.number().min(0).optional(),
            },
            stock: {
                minStock: joi_1.default.number().min(0).optional(),
                maxStock: joi_1.default.number().min(0).optional(),
            },
            category: joi_1.default.string().allow('').optional(),
        }).required();
        /**
         * JOI Schema to validate users.
         *
         * Images will be validated at the controller.
         */
        this.user = joi_1.default.object({
            username: joi_1.default.string().email({ tlds: { allow: false } }).required().messages({
                'string.empty': `Please type an email...`,
                'string.email': `The email submitted is not valid. Please, try with a different one...`,
            }),
            password: joi_1.default.string().alphanum().min(6).max(20).required().messages({
                'string.empty': `You moust provide your password.`,
                'string.alphanum': `Your password must be alphanumeric.`,
                'string.min': `Your password need to be longer than 6 characters.`,
                'string.max': `Your password need to be shorter than 20 characters.`,
            }),
            repeatedPassword: joi_1.default.string().required().valid(joi_1.default.ref('password')).required().messages({
                'string.empty': `You must provide your password repeated.`,
                'any.only': `The passwords don't match.`
            }),
            name: joi_1.default.string().min(3).max(25).required().messages({
                'string.empty': `You must provide your name`,
                'string.min': `Name must be at least 3 characters long.`,
                'string.max': `Name must be shorter than 25 characters.`
            }),
            surname: joi_1.default.string().min(3).max(25).required().messages({
                'string.empty': `You must provide your surname`,
                'string.min': `Surname must be at least 3 characters long.`,
                'string.max': `Surname must be shorter than 25 characters.`
            }),
            age: joi_1.default.date().min(minDate).max(maxDate).required().messages({
                'date.base': `You must provide a valid date.`,
                'date.max': `99 years old is the max age allowed.`,
                'date.min': `10 years old is the min age allowed.`,
            }),
            phoneNumber: joi_1.default.string().pattern(/^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/m).required().messages({
                'string.empty': `You must provide your phone number.`,
                'string.pattern.base': `The phone number submitted is not a valid one.`,
            }),
            addresses: joi_1.default.array().items(joi_1.default.object().keys({
                alias: joi_1.default.string().min(1).max(15).optional().messages({
                    'string.min': `Alias should be at least 1 character long.`,
                    'string.max': `Alias must be shorter than 16 characters.`
                }),
                street1: joi_1.default.object().keys({
                    name: joi_1.default.string().min(5).max(40).required().messages({
                        'string.empty': `You must provide at least the street name where you live.`,
                        'string.min': `The name of the street must be longer than 4 characters.`,
                        'string.max': `The name of the street must be shorter than 41 characters.`
                    }),
                    number: joi_1.default.number().min(0).max(10000).required().messages({
                        'number.base': `You must provide a number for the main street.`,
                        'number.min': `The minimum street number is 0.`,
                        'number.max': `The maximum street number is 10000.`
                    })
                }).required(),
                street2: joi_1.default.string().min(5).max(40).optional().messages(streetStringErrorMsg),
                street3: joi_1.default.string().min(5).max(40).optional().messages(streetStringErrorMsg),
                zipcode: joi_1.default.string().min(2).max(10).required().messages({
                    'string.empty': `You must provide this address zipcode.`,
                    'string.min': `The zipcode must be longer than 1 character.`,
                    'string.max': `The zipcode must be shorter than 11 characters.`,
                }),
                floor: joi_1.default.string().min(1).max(5).optional().messages({
                    // Won't be empty cause if it's empty it will be undefined.
                    'string.max': `Floor must be shorter than 5 characters.`,
                }),
                department: joi_1.default.string().min(1).max(5).optional().messages({
                    'string.max': `Department must be shorter than 5 characters.`,
                }),
                city: joi_1.default.string().min(3).max(30).required().messages({
                    'string.empty': `Must provide this address city.`,
                    'string.min': `The city name must be longer than 2 characters.`,
                    'string.max': `The city name must be shorter than 31 characters.`,
                })
            })).optional(),
            facebookID: joi_1.default.string(),
            isAdmin: joi_1.default.boolean().required(),
        }).required();
        this.address = joi_1.default.object({
            alias: joi_1.default.string().min(1).max(15).required().messages({
                'string.min': `Alias should be at least 1 character long.`,
                'string.max': `Alias must be shorter than 16 characters.`
            }),
            street1: joi_1.default.object().keys({
                name: joi_1.default.string().min(5).max(40).required().messages({
                    'string.empty': `You must provide at least the street name where you live.`,
                    'string.min': `The name of the street must be longer than 4 characters.`,
                    'string.max': `The name of the street must be shorter than 41 characters.`
                }),
                number: joi_1.default.number().min(0).max(10000).required().messages({
                    'number.base': `You must provide a number for the main street.`,
                    'number.min': `The minimum street number is 0.`,
                    'number.max': `The maximum street number is 10000.`
                })
            }).required(),
            street2: joi_1.default.string().min(5).max(40).optional().messages(streetStringErrorMsg),
            street3: joi_1.default.string().min(5).max(40).optional().messages(streetStringErrorMsg),
            zipcode: joi_1.default.string().min(2).max(10).required().messages({
                'string.empty': `You must provide this address zipcode.`,
                'string.min': `The zipcode must be longer than 1 character.`,
                'string.max': `The zipcode must be shorter than 11 characters.`,
            }),
            floor: joi_1.default.string().min(1).max(5).optional().messages({
                // Won't be empty cause if it's empty it will be undefined.
                'string.max': `Floor must be shorter than 5 characters.`,
            }),
            department: joi_1.default.string().min(1).max(5).optional().messages({
                'string.max': `Department must be shorter than 5 characters.`,
            }),
            city: joi_1.default.string().min(3).max(30).required().messages({
                'string.empty': `Must provide this address city.`,
                'string.min': `The city name must be longer than 2 characters.`,
                'string.max': `The city name must be shorter than 31 characters.`,
            }),
            extra_info: joi_1.default.string().min(5).max(100).optional().messages({
                'string.min': `Extra instructions must be longer than 5 characters.`,
                'string.max': `Extra instructions must be shorter than 101 characters.`
            })
        }).required();
    }
}
exports.validator = new Validations();
