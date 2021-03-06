/* eslint-disable no-unused-vars */

import { model, Model, Schema } from "mongoose";
import moment from "moment";
import { ApiError } from "../../../api/errorApi";
import { EProductsErrors } from "../../../interfaces/EErrors";
import {
  DBProductsClass,
  IMongoProduct,
  INew_Product,
  IQuery,
  IUpdate,
} from "../../../interfaces/products";
import { CUDResponse } from "../../../interfaces/others";
import { logger } from "../../../services/logger";
import { Config } from "../../../config/config";
import cluster from "cluster";
import { mockProducts } from "../../mockProducts";
import { ObjectId } from "mongodb";

const productSchema = new Schema({
  createdAt: { type: String, required: true },
  modifiedAt: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  code: { type: String, required: true },
  images: [
    {
      photo_id: { type: String },
      url: { type: String },
      _id: false,
    },
  ],
  stock: { type: Number, required: true },
  price: { type: Number, required: true },
});

productSchema.set("toJSON", {
  transform: (document, returnedDocument) => {
    delete returnedDocument.__v;
  },
});

const productModel = model<INew_Product, Model<INew_Product>>(
  "products",
  productSchema
);

export class MongoProducts implements DBProductsClass {
  private products: Model<INew_Product>;
  constructor() {
    this.products = productModel;
    this.init();
  }
  async init(): Promise<void> {
    //console.log(mockProducts[0].img)
    // if (Config.MODE === "CLUSTER") {
    //   if (cluster.isMaster) {
    //     await this.products.deleteMany({});
    //     await this.products.insertMany(mockProducts);
    //     logger.info(`Mock data inserted.`);
    //   }
    // } else {
    //   await this.products.deleteMany({});
    //   await this.products.insertMany(mockProducts);
    //   logger.info(`Mock data inserted.`);
    // }
  }
  async get(id?: string | undefined): Promise<IMongoProduct[] | ApiError> {
    try {
      if (id != null) {
        const doc = await this.products.findOne({ _id: id });
        if (doc) return [doc];
        else return ApiError.notFound(EProductsErrors.ProductNotFound);
      } else {
        const docs = await this.products.find({});
        if (docs.length > 0) return docs;
        else return ApiError.notFound(EProductsErrors.NoProducts);
      }
    } catch (error) {
      return ApiError.internalError(`An error occured.`);
    }
  }

  async getByCategory(category: string): Promise<IMongoProduct[] | ApiError> {
    try {
      const docs = await this.products.find({ category: category });
      if (docs.length > 0) return docs;
      return ApiError.notFound(EProductsErrors.NoProducts);
    } catch (error) {
      return ApiError.internalError(`An error occured.`);
    }
  }

  async getStock(): Promise<IMongoProduct[] | ApiError> {
    try {
      const docs = await this.products.find({}).select("title stock");
      if (docs.length > 0) return docs;
      else return ApiError.notFound(EProductsErrors.NoProducts);
    } catch (error) {
      return ApiError.internalError(`An error occured.`);
    }
  }

  async add(product: INew_Product): Promise<CUDResponse | ApiError> {
    try {
      const doc = await this.products.create(product);
      return {
        message: `Product successfully saved.`,
        data: doc,
      };
    } catch (error) {
      return ApiError.internalError(`An error occured.`);
    }
  }
  async update(id: string, data: IUpdate): Promise<CUDResponse | ApiError> {
    try {
      const doc = await this.products.findOne({ _id: id }).lean();
      if (doc) {
        const newProduct = { ...doc, ...data };
        newProduct.modifiedAt = moment().format("YYYY-MM-DD HH:mm:ss");
        await this.products.replaceOne({ _id: id }, newProduct);
        return {
          message: `Product successfully updated.`,
          data: { _id: new ObjectId(id), ...newProduct },
        };
      } else {
        return ApiError.notFound(EProductsErrors.ProductNotFound);
      }
    } catch (error) {
      return ApiError.internalError(`An error occured.`);
    }
  }
  async delete(id: string): Promise<CUDResponse | ApiError> {
    try {
      const deletedDoc = await this.products.findOne({ _id: id });
      if (deletedDoc) {
        await this.products.deleteOne({ _id: id });
        return {
          message: `Product successfully deleted`,
          data: deletedDoc,
        };
      } else {
        return ApiError.notFound(EProductsErrors.ProductNotFound);
      }
    } catch (error) {
      return ApiError.internalError(`An error occured.`);
    }
  }

  async deleteImages(
    photos_ids: string[],
    product_id: string
  ): Promise<ApiError | CUDResponse> {
    try {
      const doc = await this.products.findOne({ _id: product_id });
      if (doc) {
        const newImages = doc.images.filter(
          (image) => !photos_ids.some((ids) => image.photo_id === ids)
        );
        doc.images = newImages;
        await doc.save();
        return {
          message: `Images deleted successfully.`,
          data: doc,
        };
      } else return ApiError.notFound(EProductsErrors.ProductNotFound);
    } catch (error) {
      return ApiError.internalError(`An error occured.`);
    }
  }

  // Function implemented for retrieving the products selected to buy in an order.

  async getByIds(ids: string[]): Promise<
    | {
        _id: string;
        stock: number;
      }[]
    | ApiError
  > {
    try {
      const docs = await this.products.find({ _id: { $in: ids } });
      return docs.map((document) => {
        return {
          _id: document.id,
          stock: document.stock,
        };
      });
    } catch (error) {
      return ApiError.internalError(`An error occured.`);
    }
  }

  async query(options: IQuery): Promise<IMongoProduct[] | ApiError> {
    try {
      const titleRegex =
        options.title === ""
          ? new RegExp(`.*`)
          : new RegExp(`(${options.title})`);
      const codeRegex =
        options.code === ""
          ? new RegExp(`.*`)
          : new RegExp(`(${options.code})`);
      const categoryRegex =
        options.category === ""
          ? new RegExp(`.*`)
          : new RegExp(`(${options.category})`);
      const docs = await this.products.find({
        title: { $regex: titleRegex },
        code: { $regex: codeRegex },
        category: { $regex: categoryRegex },
        price: {
          $gte: options.price.minPrice,
          $lte: options.price.maxPrice,
        },
        stock: {
          $gte: options.stock.minStock,
          $lte: options.stock.maxStock,
        },
      });
      if (docs.length > 0) return docs;
      else return ApiError.notFound(`No products matching the query`);
    } catch (error) {
      return ApiError.internalError(`An error occured.`);
    }
  }
}
