import Joi from "joi";
import moment from "moment";
import { INew_Product, IQuery, IUpdate } from "./products";
import { UserAddresses, UserInfo } from "./users";

const maxDate = moment().subtract(10, "y").format("MM/DD/YYYY");
const minDate = moment().subtract(99, "y").format("MM/DD/YYYY");

const streetStringErrorMsg = {
  // Won't be empty cause if it's empty it will be undefined.
  "string.min": `The name of the street must be longer than 5 characters.`,
  "string.max": `The name of the street must be shorter than 40 characters.`,
};

class Validations {
  newProduct: Joi.ObjectSchema<INew_Product>;
  update: Joi.ObjectSchema<IUpdate>;
  query: Joi.ObjectSchema<IQuery>;
  user: Joi.ObjectSchema<UserInfo>;
  address: Joi.ObjectSchema<UserAddresses>;
  constructor() {
    /**
     * JOI Schema to validate the objects to be saved from the frontend
     *
     * Images will be validated at the controller.
     */
    this.newProduct = Joi.object<INew_Product>({
      createdAt: Joi.string().required(),
      modifiedAt: Joi.string().required(),
      title: Joi.string().min(4).max(100).required().messages({
        "string.empty": `Product must have a title of at least 4 characters.`,
        "string.min": `The title of the product must be at least 4 characters long.`,
        "string.max": `The title of the product must be shorter than 31 characters.`,
      }),
      description: Joi.string().min(10).max(500).required().messages({
        "string.empty": `Product must have a description of at least 10 characters.`,
        "string.min": `The description should be longer than 9 characters.`,
        "string.max": `The description must be shorter than 151 characters.`,
      }),
      code: Joi.string().alphanum().min(5).max(10).required().messages({
        "string.empty": `Product must have a code.`,
        "string.alphanum": `The code must contain only letters and numbers.`,
        "string.min": `The code must be at least 5 characters long.`,
        "string.max": `The code must be shorter than 11 characters.`,
      }),
      price: Joi.number().min(0.01).required().messages({
        "number.base": `The price must be a number and greater than 0.01.`,
        "number.min": `The price must be greater than 0.01.`,
      }),
      stock: Joi.number().min(0).required().messages({
        "number.base":
          "The stock must be a number and equal to or greater than 0.",
        "number.min": `Stock must be positive or equal to 0.`,
      }),
      category: Joi.string().min(3).max(20).required().messages({
        "string.empty": `Must provide a category.`,
        "string.min": `Category must be longer than 2 characters.`,
        "string.max": `Category must be shorter than 21 characters.`,
      }),
    }).required();
    /**
     * JOI Schema to validate the objects from the frontend for updates.
     *
     * Images will be validated at the controller.
     */
    this.update = Joi.object<IUpdate>({
      title: Joi.string().min(4).max(30).optional().messages({
        // Won't be empty cause if it's empty it will be undefined.
        "string.min": `The title of the product must be at least 4 characters long.`,
        "string.max": `The title of the product must be shorter than 31 characters.`,
      }),
      description: Joi.string().min(10).max(500).optional().messages({
        // Won't be empty cause if it's empty it will be undefined.
        "string.min": `The description should be longer than 9 characters.`,
        "string.max": `The description must be shorter than 151 characters.`,
      }),
      code: Joi.string().alphanum().min(5).max(10).optional().messages({
        "string.alphanum": `The code must contain only letters and numbers.`,
        "string.min": `The code must be at least 5 characters long.`,
        "string.max": `The code must be shorter than 11 characters.`,
      }),
      price: Joi.number().min(0.01).optional().messages({
        "number.base": `The price must be a number and greater than 0.01.`,
        "number.min": `The price must be greater than 0.01.`,
      }),
      stock: Joi.number().min(0).optional().messages({
        "number.base":
          "The stock must be a number and equal to or greater than 0.",
        "number.min": `Stock must be positive or equal to 0.`,
      }),
      category: Joi.string().min(3).max(20).optional().messages({
        "string.empty": `Must provide a category.`,
        "string.min": `Category must be longer than 2 characters.`,
        "string.max": `Category must be shorter than 21 characters.`,
      }),
      images: Joi.array()
        .items(
          Joi.object()
            .keys({
              url: Joi.string().uri().required(),
              photo_id: Joi.string().required(),
            })
            .required()
        )
        .optional(),
    }).required();

    this.query = Joi.object<IQuery>({
      title: Joi.string().allow("").optional(),
      code: Joi.string().allow("").optional(),
      price: {
        minPrice: Joi.number().min(0.01).optional(),
        maxPrice: Joi.number().min(0).optional(),
      },
      stock: {
        minStock: Joi.number().min(0).optional(),
        maxStock: Joi.number().min(0).optional(),
      },
      category: Joi.string().allow("").optional(),
    }).required();
    /**
     * JOI Schema to validate users.
     *
     * Images will be validated at the controller.
     */
    this.user = Joi.object<UserInfo>({
      username: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
          "string.empty": `Please type an email...`,
          "string.email": `The email submitted is not valid. Please, try with a different one...`,
        }),
      password: Joi.string().alphanum().min(6).max(20).required().messages({
        "string.empty": `You moust provide your password.`,
        "string.alphanum": `Your password must be alphanumeric.`,
        "string.min": `Your password need to be longer than 6 characters.`,
        "string.max": `Your password need to be shorter than 20 characters.`,
      }),
      repeatedPassword: Joi.string()
        .required()
        .valid(Joi.ref("password"))
        .required()
        .messages({
          "string.empty": `You must provide your password repeated.`,
          "any.only": `The passwords don't match.`,
        }),
      name: Joi.string().min(3).max(25).required().messages({
        "string.empty": `You must provide your name`,
        "string.min": `Name must be at least 3 characters long.`,
        "string.max": `Name must be shorter than 25 characters.`,
      }),
      surname: Joi.string().min(3).max(25).required().messages({
        "string.empty": `You must provide your surname`,
        "string.min": `Surname must be at least 3 characters long.`,
        "string.max": `Surname must be shorter than 25 characters.`,
      }),
      age: Joi.date().min(minDate).max(maxDate).required().messages({
        "date.base": `You must provide a valid date.`,
        "date.max": `99 years old is the max age allowed.`,
        "date.min": `10 years old is the min age allowed.`,
      }),
      phoneNumber: Joi.string()
        .pattern(/\+\d{1,4}\d{1,4}\d{7}/)
        .required()
        .messages({
          "string.empty": `You must provide your phone number.`,
          "string.pattern.base": `The phone number submitted is not a valid one.`,
        }),
      addresses: Joi.array()
        .items(
          Joi.object().keys({
            alias: Joi.string().min(1).max(15).optional().messages({
              "string.min": `Alias should be at least 1 character long.`,
              "string.max": `Alias must be shorter than 16 characters.`,
            }),
            street1: Joi.object()
              .keys({
                name: Joi.string().min(5).max(40).required().messages({
                  "string.empty": `You must provide at least the street name where you live.`,
                  "string.min": `The name of the street must be longer than 4 characters.`,
                  "string.max": `The name of the street must be shorter than 41 characters.`,
                }),
                number: Joi.number().min(0).max(10000).required().messages({
                  "number.base": `You must provide a number for the main street.`,
                  "number.min": `The minimum street number is 0.`,
                  "number.max": `The maximum street number is 10000.`,
                }),
              })
              .required(),
            street2: Joi.string()
              .min(5)
              .max(40)
              .optional()
              .messages(streetStringErrorMsg),
            street3: Joi.string()
              .min(5)
              .max(40)
              .optional()
              .messages(streetStringErrorMsg),
            zipcode: Joi.string().min(2).max(10).required().messages({
              "string.empty": `You must provide this address zipcode.`,
              "string.min": `The zipcode must be longer than 1 character.`,
              "string.max": `The zipcode must be shorter than 11 characters.`,
            }),
            floor: Joi.string().min(1).max(5).optional().messages({
              // Won't be empty cause if it's empty it will be undefined.
              "string.max": `Floor must be shorter than 5 characters.`,
            }),
            department: Joi.string().min(1).max(5).optional().messages({
              "string.max": `Department must be shorter than 5 characters.`,
            }),
            city: Joi.string().min(3).max(30).required().messages({
              "string.empty": `Must provide this address city.`,
              "string.min": `The city name must be longer than 2 characters.`,
              "string.max": `The city name must be shorter than 31 characters.`,
            }),
          })
        )
        .optional(),
      facebookID: Joi.string().allow("").optional(),
      avatar: Joi.string().uri().allow("").optional(),
      isAdmin: Joi.boolean().required(),
    }).required();

    this.address = Joi.object<UserAddresses>({
      _id: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required(),
      alias: Joi.string().min(1).max(15).required().messages({
        "string.min": `Alias should be at least 1 character long.`,
        "string.max": `Alias must be shorter than 16 characters.`,
      }),
      street1: Joi.object()
        .keys({
          name: Joi.string().min(5).max(40).required().messages({
            "string.empty": `You must provide at least the street name where you live.`,
            "string.min": `The name of the street must be longer than 4 characters.`,
            "string.max": `The name of the street must be shorter than 41 characters.`,
          }),
          number: Joi.number().min(0).max(10000).required().messages({
            "number.base": `You must provide a number for the main street.`,
            "number.min": `The minimum street number is 0.`,
            "number.max": `The maximum street number is 10000.`,
          }),
        })
        .required(),
      street2: Joi.string()
        .min(5)
        .max(40)
        .optional()
        .messages(streetStringErrorMsg),
      street3: Joi.string()
        .min(5)
        .max(40)
        .optional()
        .messages(streetStringErrorMsg),
      zipcode: Joi.string().min(2).max(10).required().messages({
        "string.empty": `You must provide this address zipcode.`,
        "string.min": `The zipcode must be longer than 1 character.`,
        "string.max": `The zipcode must be shorter than 11 characters.`,
      }),
      floor: Joi.string().min(1).max(5).optional().messages({
        // Won't be empty cause if it's empty it will be undefined.
        "string.max": `Floor must be shorter than 5 characters.`,
      }),
      department: Joi.string().min(1).max(5).optional().messages({
        "string.max": `Department must be shorter than 5 characters.`,
      }),
      city: Joi.string().min(3).max(30).required().messages({
        "string.empty": `Must provide this address city.`,
        "string.min": `The city name must be longer than 2 characters.`,
        "string.max": `The city name must be shorter than 31 characters.`,
      }),
      extra_info: Joi.string().min(5).max(100).optional().messages({
        "string.min": `Extra instructions must be longer than 5 characters.`,
        "string.max": `Extra instructions must be shorter than 101 characters.`,
      }),
    }).required();
  }
}
export const validator = new Validations();
