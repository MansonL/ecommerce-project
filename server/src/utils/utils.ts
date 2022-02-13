import { IMongoCart, IMongoProduct } from "../interfaces/products";
import { ApiError } from "../api/errorApi";
import { EOrdersErrors, EProductsErrors } from "../interfaces/EErrors";
import { uploadManyImages } from "../middleware/cloudinary";
import { productsApi } from "../api/products";
import {
  IMongoOrderPopulated,
  IOrderPopulated,
  IUserOrder,
  OrderProducts,
} from "../interfaces/orders";
import { Types, Document } from "mongoose";
import { IMongoUser, UserAddresses } from "../interfaces/users";
import { usersApi } from "../api/users";
import cloudinary from "../services/cloudinary";
import { cartApi } from "../api/cart";
import moment from "moment";

export class Utils {
  /**
   * Function for getting the max stock or price according to the products stored at the DB.
   * Its purpose if for defining the max price or max stock for finishing the query object in
   * case it's not specified to the endpoint of from the frontend.
   *
   * @param products all the products stored at the DB.
   * @param type 'price' or 'stock' depending on the desired number to get.
   * @returns the max stock or max price of the products at the DB.
   */

  static getMaxStockPrice = async (
    products: IMongoProduct[],
    type: string
  ): Promise<number> => {
    if (type === "price") {
      const prices = products.map((product) => product.price);
      return Math.max(...prices);
    } else {
      const stocks = products.map((product) => product.stock);
      return Math.max(...stocks);
    }
  };

  /**
   * Function for creating a random code for mock products.
   * @returns string code.
   */

  static generateCode = (): string => {
    return `${Math.random().toString(36).substr(2, 9)}`;
  };

  /**
   * Function for validating the addition of a product to the cart. It checks the available
   * stock of the product with the desired amount to add.
   *
   * @param product_id desired product id to add to the cart.
   * @param quantity amount of the product
   * @returns Promise: true if the addition is possible, false if not.
   */

  static validateCartModification = async (
    product_id: string,
    quantity: number
  ): Promise<boolean> => {
    const doc = (await productsApi.getProduct(product_id)) as IMongoProduct[];

    // It's already checked that the product exists at the controller.

    return quantity <= doc[0].stock;
  };

  /**
   * Function for getting the user cart after a successfull login and to send it with its
   * token.
   *
   * @param user user object.
   * @returns if the user has a cart created, his cart, if not, a newly created one or in case
   * of error at creating a new one, a default one.
   */

  static getUserCartOrDefault = async (
    user_id: string
  ): Promise<IMongoCart> => {
    const userHasCart = await cartApi.get(user_id);
    if (userHasCart instanceof ApiError) {
      const userCart = await cartApi.createEmptyCart(user_id);
      if (userCart instanceof ApiError)
        return {
          createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
          modifiedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
          user: new Types.ObjectId(user_id),
          products: [],
          _id: new Types.ObjectId(),
        };
      else return userCart.data as IMongoCart;
    } else {
      return userHasCart[0];
    }
  };

  /**
   * Function for validating the types of the desired images to be uploaded and uploading them
   * to the cloudinary account.
   *
   * @param files an array containing the images information objects.
   * @param folder the folder where the images are going to be uploaded in the cloud.
   * @returns Promise: an array containing the images data objects to be used and stored to
   * the DB, or an ApiError object.
   */

  static validateAndUploadImages = async (
    files: {
      file: string;
      name: string;
      mimetype: string;
    }[],
    folder: string
  ): Promise<ApiError | { url: string; photo_id: string }[]> => {
    const typesAllowed = /jpeg|jpg|png/;
    for await (const file of files) {
      if (!typesAllowed.test(file.mimetype))
        return ApiError.badRequest(EProductsErrors.UnsupportedImageType);
    }
    const uploadedData = await uploadManyImages(
      files.map((file) => {
        return {
          file: file.file,
          name: file.name,
        };
      }),
      folder
    );
    return uploadedData.length > 0
      ? uploadedData
      : ApiError.internalError(`An error at uploading images`);
  };

  /**
   * Function for deleting the images from the cloudinary account.
   *
   * @param files_id an array containing the images id's strings.
   * @returns Promise: true if everything went ok, ApiError object if there were any error
   * with a file.
   */

  static deleteImagesFromCloud = async (
    files_id: string[]
  ): Promise<ApiError | boolean> => {
    for await (const iterator of files_id) {
      const { result } = await cloudinary.uploader.destroy(iterator);
      if (result !== "ok")
        return ApiError.internalError(
          `Wrong image id. Error at cloud image deletion.`
        );
    }
    return true;
  };

  /**
   * Function for validating the confirmated order by the user against the available stock
   * of the order products.
   *
   * @param orderProducts products from the user order.
   * @returns Promise: true if it's a valid order, string if the order is NOT valid and it
   * specifies the title of every exceeded amount product, ApiError object if there's something
   * that went wrong.
   */

  static isValidOrder = async (
    orderProducts: OrderProducts[]
  ): Promise<boolean | string | ApiError> => {
    const ids = orderProducts.map((product) => String(product.product_id));
    const DBProducts = await productsApi.getByIds(ids);
    if (DBProducts instanceof ApiError) return DBProducts;
    else {
      if (DBProducts.length === ids.length) {
        const order: {
          [index: string]: number;
        } = {};
        orderProducts.forEach((orderProduct) => {
          order[String(orderProduct.product_id)] = orderProduct.quantity;
        });
        const invalidProductAmount: string[] = [];
        const valid = DBProducts.every((DBproduct) => {
          if (order[DBproduct._id] > DBproduct.stock)
            orderProducts.forEach((orderProduct) => {
              if (String(orderProduct.product_id) == DBproduct._id)
                invalidProductAmount.push(orderProduct.product_title);
            });
          return order[DBproduct._id] <= DBproduct.stock;
        });
        return valid
          ? valid
          : `${EOrdersErrors.GreaterQuantity}
                ${invalidProductAmount.concat(", ")}`;
      } else {
        return EOrdersErrors.DeletedProduct;
      }
    }
  };

  /**
   * Function for populating the user orders with the selected address from their addresses array. No mongoose/mongodb utility/function there for making a document population of a document subdocument. Also parsing the product title of each product.
   * Used for populating all the orders of the DB or the orders of one user, just receives an array with the Order Document from the DB.
   *
   * @param ordersDocs an array containing all the order documents to be populated just queried from the DB.
   * @returns Promise: an array containing the populated orders documents with IMongoOrderPopulated structure, or an ApiError object if something went wrong.
   */

  static async populatedAddressDeep(
    ordersDocs: (Document<any, any, IUserOrder> &
      IUserOrder & {
        _id: Types.ObjectId;
      })[]
  ): Promise<IMongoOrderPopulated[] | ApiError> {
    const users: IMongoUser[] | ApiError = await usersApi.getUsers();
    const products: IMongoProduct[] | ApiError = await productsApi.getProduct();
    if (users instanceof ApiError) return users;
    else if (products instanceof ApiError) return products;
    else {
      const populatedAddressDocs: IMongoOrderPopulated[] = [];
      const populatedOrders: IOrderPopulated[] = [];
      ordersDocs.forEach((orderDoc) => {
        orderDoc.orders.forEach((order) => {
          const orderCreator = users.find(
            (user) => user._id == String(orderDoc.user)
          ) as IMongoUser;
          populatedOrders.push({
            createdAt: order.createdAt,
            products: order.products.map((orderProduct) => {
              return {
                product_id: orderProduct.product_id,
                quantity: orderProduct.quantity,
                price: orderProduct.price,
                product_title: products.filter(
                  (product) => product._id == String(orderProduct.product_id)
                )[0].title,
              };
            }),
            status: order.status,
            _id: order._id,
            total: order.total,
            address: orderCreator.addresses?.find(
              (address) => address._id == String(order.address)
            ) as UserAddresses,
          });
        });
        populatedAddressDocs.push({
          user: {
            username: users.find((user) => user._id == String(orderDoc.user))
              ?.username as string,
          },
          orders: [...populatedOrders],
        });
        populatedOrders.length = 0; // Truncating array of orders.
      });
      return populatedAddressDocs;
    }
  }
}
